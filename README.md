# TaskFlow ⚡️

A modern, production-quality SaaS Task Management platform inspired by Linear, Notion, and Trello.

![Landing Page Preview](https://placehold.co/1200x600/0f172a/6366f1?text=TaskFlow+Dashboard)

## Features

- **Premium UI/UX**: Built with Tailwind v4, shadcn/ui, and Framer Motion for a fluid, high-end feel.
- **Kanban Board**: Drag-and-drop task management with real-time sync capabilities.
- **Full Auth Flow**: Secure login, registration, and password recovery via Supabase.
- **Analytics**: Deep insights into team productivity with interactive charts.
- **Real-time Collaboration**: Instant updates and presence indicators.
- **Mobile Responsive**: Fully optimized for all screen sizes.
- **Dark Mode**: Native dark mode support with curated OKLCH colors.
- **Organization Support**: Multiple workspaces and team management.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Backend**: Supabase (Auth, PostgreSQL, Realtime, Storage)
- **State Management**: Zustand (Global), React Query (Server State)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. **Run development server**
   ```bash
   npm run dev
   ```

## Database Setup

Run the SQL migration found in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor to set up the tables, RLS policies, and triggers.

## Deployment

This project is optimized for deployment on **Vercel**. Simply push to a repository and connect it to Vercel.

---

Built with ❤️ by TaskFlow Team.
