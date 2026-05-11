-- TaskFlow Database Schema
-- Run this in your Supabase SQL Editor

-- ===== Enable UUID Extension =====
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== Profiles =====
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===== Organizations =====
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== Organization Members =====
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- ===== Projects =====
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#6366f1',
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== Columns =====
CREATE TABLE IF NOT EXISTS columns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== Tasks =====
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  column_id UUID NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'none' CHECK (priority IN ('urgent', 'high', 'medium', 'low', 'none')),
  position INTEGER NOT NULL DEFAULT 0,
  due_date TIMESTAMPTZ,
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  creator_id UUID NOT NULL REFERENCES profiles(id),
  labels JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== Task Comments =====
CREATE TABLE IF NOT EXISTS task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== Task Activities =====
CREATE TABLE IF NOT EXISTS task_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== Notifications =====
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  read BOOLEAN NOT NULL DEFAULT false,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== Indexes =====
CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_columns_project ON columns(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_column ON tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_comments_task ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_activities_task ON task_activities(task_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read);

-- ===== Row Level Security =====
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Notifications: users can only see own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Organizations: members can see
CREATE POLICY "Org members can view orgs" ON organizations FOR SELECT USING (
  EXISTS (SELECT 1 FROM organization_members WHERE organization_id = organizations.id AND user_id = auth.uid())
  OR owner_id = auth.uid()
);
CREATE POLICY "Anyone can create orgs" ON organizations FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update orgs" ON organizations FOR UPDATE USING (owner_id = auth.uid());

-- Org Members
CREATE POLICY "Members can view members" ON organization_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM organization_members AS om WHERE om.organization_id = organization_members.organization_id AND om.user_id = auth.uid())
);
CREATE POLICY "Admins can manage members" ON organization_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM organization_members AS om WHERE om.organization_id = organization_members.organization_id AND om.user_id = auth.uid() AND om.role IN ('owner', 'admin'))
);

-- Projects, Columns, Tasks: scoped to org membership
CREATE POLICY "Org members can view projects" ON projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM organization_members WHERE organization_id = projects.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org members can create projects" ON projects FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM organization_members WHERE organization_id = projects.organization_id AND user_id = auth.uid())
);
CREATE POLICY "Org members can update projects" ON projects FOR UPDATE USING (
  EXISTS (SELECT 1 FROM organization_members WHERE organization_id = projects.organization_id AND user_id = auth.uid())
);

CREATE POLICY "Project members can view columns" ON columns FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects p JOIN organization_members om ON om.organization_id = p.organization_id WHERE p.id = columns.project_id AND om.user_id = auth.uid())
);
CREATE POLICY "Project members can manage columns" ON columns FOR ALL USING (
  EXISTS (SELECT 1 FROM projects p JOIN organization_members om ON om.organization_id = p.organization_id WHERE p.id = columns.project_id AND om.user_id = auth.uid())
);

CREATE POLICY "Project members can view tasks" ON tasks FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects p JOIN organization_members om ON om.organization_id = p.organization_id WHERE p.id = tasks.project_id AND om.user_id = auth.uid())
);
CREATE POLICY "Project members can manage tasks" ON tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM projects p JOIN organization_members om ON om.organization_id = p.organization_id WHERE p.id = tasks.project_id AND om.user_id = auth.uid())
);

CREATE POLICY "Task members can view comments" ON task_comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM tasks t JOIN projects p ON p.id = t.project_id JOIN organization_members om ON om.organization_id = p.organization_id WHERE t.id = task_comments.task_id AND om.user_id = auth.uid())
);
CREATE POLICY "Task members can add comments" ON task_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Task members can view activities" ON task_activities FOR SELECT USING (
  EXISTS (SELECT 1 FROM tasks t JOIN projects p ON p.id = t.project_id JOIN organization_members om ON om.organization_id = p.organization_id WHERE t.id = task_activities.task_id AND om.user_id = auth.uid())
);
CREATE POLICY "System can insert activities" ON task_activities FOR INSERT WITH CHECK (true);

-- ===== Realtime =====
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE task_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE columns;
