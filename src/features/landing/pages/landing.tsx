import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Zap, ArrowRight, CheckCircle2, BarChart3, Users, Kanban, MessageSquare, Bell, Star, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

const features = [
  { icon: Kanban, title: "Kanban Boards", desc: "Drag and drop task management with customizable columns and workflows." },
  { icon: Users, title: "Team Collaboration", desc: "Real-time updates, task assignments, and team presence indicators." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track productivity, team activity, and project completion rates." },
  { icon: MessageSquare, title: "Comments & Activity", desc: "Threaded comments, activity logs, and markdown support." },
  { icon: Bell, title: "Smart Notifications", desc: "Real-time alerts for task assignments, comments, and deadlines." },
  { icon: CheckCircle2, title: "Task Management", desc: "Priorities, labels, due dates, and assignees for every task." },
]

const pricing = [
  { name: "Free", price: "$0", period: "/month", features: ["Up to 5 members", "3 projects", "Basic analytics", "Community support"], cta: "Get Started", popular: false },
  { name: "Pro", price: "$12", period: "/member/mo", features: ["Unlimited members", "Unlimited projects", "Advanced analytics", "Priority support", "Custom fields", "API access"], cta: "Start Free Trial", popular: true },
  { name: "Enterprise", price: "Custom", period: "", features: ["Everything in Pro", "SSO & SAML", "Audit logs", "Dedicated support", "Custom integrations", "SLA guarantee"], cta: "Contact Sales", popular: false },
]

const faqs = [
  { q: "How does the free trial work?", a: "Start with a 14-day free trial of Pro. No credit card required. Downgrade anytime." },
  { q: "Can I import from Trello or Jira?", a: "Yes! We support one-click imports from Trello, Jira, Asana, and more." },
  { q: "Is my data secure?", a: "Absolutely. All data is encrypted at rest and in transit. We're SOC 2 compliant." },
  { q: "Do you offer discounts for startups?", a: "Yes, we offer 50% off for qualified startups. Contact us to learn more." },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"><Zap className="h-4 w-4" /></div><span className="font-bold text-lg">TaskFlow</span></div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link to="/register"><Button size="sm">Get Started<ArrowRight className="h-3 w-3" /></Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px]" /></div>
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5"><Star className="h-3 w-3 mr-1 text-amber-500" />Trusted by 10,000+ teams worldwide</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-3xl mx-auto">
              Ship faster with <span className="gradient-text">TaskFlow</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-xl mx-auto">The modern project management platform for teams who build great products. Kanban boards, real-time collaboration, and powerful analytics.</p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <Link to="/login"><Button size="lg"><Zap className="h-4 w-4" />Try Demo</Button></Link>
              <Link to="/register"><Button size="lg" variant="outline">Get Started Free<ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16"><Badge variant="secondary" className="mb-4">Features</Badge><h2 className="text-3xl font-bold">Everything you need to ship</h2><p className="text-muted-foreground mt-3 max-w-lg mx-auto">Powerful features to help your team collaborate, track progress, and deliver results.</p></div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <motion.div key={f.title} variants={item}>
                <Card className="h-full hover:shadow-lg hover:border-primary/20 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors"><f.icon className="h-6 w-6 text-primary" /></div>
                    <h3 className="font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16"><Badge variant="secondary" className="mb-4">Pricing</Badge><h2 className="text-3xl font-bold">Simple, transparent pricing</h2><p className="text-muted-foreground mt-3">Start free, upgrade when you&apos;re ready.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricing.map((p) => (
              <Card key={p.name} className={`relative ${p.popular ? "border-primary shadow-lg shadow-primary/10 scale-105" : ""}`}>
                {p.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <div className="mt-4 mb-6"><span className="text-3xl font-bold">{p.price}</span><span className="text-muted-foreground text-sm">{p.period}</span></div>
                  <ul className="space-y-3 mb-6">{p.features.map(f => <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />{f}</li>)}</ul>
                  <Button className="w-full" variant={p.popular ? "default" : "outline"}>{p.cta}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 border-t border-border/50">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12"><Badge variant="secondary" className="mb-4">FAQ</Badge><h2 className="text-3xl font-bold">Common questions</h2></div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Card key={i} className="cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between"><span className="font-medium text-sm">{f.q}</span><ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} /></div>
                  {openFaq === i && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-sm text-muted-foreground mt-3">{f.a}</motion.p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to ship faster?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Join thousands of teams using TaskFlow to build and deliver great products.</p>
          <Link to="/register"><Button size="lg"><Zap className="h-4 w-4" />Get Started Free</Button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"><Zap className="h-3.5 w-3.5" /></div><span className="font-bold">TaskFlow</span></div>
            <p className="text-sm text-muted-foreground">© 2026 TaskFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
