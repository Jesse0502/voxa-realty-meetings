import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneOff, Phone, CalendarCheck, Users, ArrowRight, CheckCircle2, Zap, BarChart3, Clock, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import voxaLogo from "@/assets/voxa-logo.png";

const Index = () => {
  const [heroEmail, setHeroEmail] = useState("");
  const [heroSubmitted, setHeroSubmitted] = useState(false);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroEmail) return;
    setHeroSubmitted(true);
    toast.success("You're in! We'll be in touch soon.");
    setHeroEmail("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;
    setFormSubmitted(true);
    toast.success("You're in! We'll reach out with early access details.");
    setFormName("");
    setFormEmail("");
    setFormPhone("");
  };

  const features = [
    {
      icon: PhoneOff,
      title: "Never Miss a Call Again",
      description: "AI instantly answers missed calls, qualifies leads, and captures their info — even at 2 AM.",
    },
    {
      icon: Users,
      title: "Cold Outreach on Autopilot",
      description: "Automatically reach out to your cold leads via call and text with personalized, human-like conversations.",
    },
    {
      icon: CalendarCheck,
      title: "Book More Meetings",
      description: "Voxa schedules appointments directly on your calendar. You just show up and close.",
    },
    {
      icon: Zap,
      title: "Instant Lead Qualification",
      description: "AI asks the right questions to separate tire-kickers from serious buyers and sellers.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Dashboard",
      description: "See every conversation, lead score, and booked appointment in one clean dashboard.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Your AI assistant works around the clock so you never lose a deal to slow response times.",
    },
  ];

  const stats = [
    { value: "78%", label: "of leads go to the agent who responds first" },
    { value: "5 min", label: "average response time loses 80% of leads" },
    { value: "50%+", label: "of agent calls go unanswered daily" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src={voxaLogo} alt="Voxa Realty" className="h-10" />
          <a href="#early-access">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-6">
              Get Early Access
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Phone className="w-4 h-4" />
            AI-Powered Sales Assistant for Real Estate
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            Stop Losing Leads.<br />
            <span className="text-primary">Start Closing Deals.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Voxa Realty is an AI sales assistant that handles your missed calls, 
            follows up with cold leads, and books meetings on your calendar — so you 
            can focus on what you do best: selling homes.
          </p>

          {/* Demo phone */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <a
              href="tel:+15753052236"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors group"
            >
              <PhoneCall className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-foreground font-semibold">Try the demo:</span>
              <span className="text-primary font-bold">+1 (575) 305-2236</span>
            </a>
          </div>

          <form
            onSubmit={handleHeroSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            {heroSubmitted ? (
              <div className="flex items-center gap-3 text-primary font-semibold text-lg mx-auto">
                <CheckCircle2 className="w-6 h-6" />
                You're in! Check your inbox soon.
              </div>
            ) : (
              <>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={heroEmail}
                  onChange={(e) => setHeroEmail(e.target.value)}
                  required
                  className="h-12 rounded-full px-5 bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  type="submit"
                  className="h-12 rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold whitespace-nowrap"
                >
                  Get Early Access
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            )}
          </form>

          <p className="text-sm text-muted-foreground mt-4">
            Free to join · No credit card required · Limited spots
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-border/50 bg-card/50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Your AI Agent That Never Sleeps
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built specifically for real estate agents who are tired of losing deals to slow follow-ups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-card/50 border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-16">
            How It Works
          </h2>
          <div className="space-y-12">
            {[
              { step: "01", title: "Connect Your Number", desc: "Link your business phone line in under 2 minutes. No hardware needed." },
              { step: "02", title: "Import Your Leads", desc: "Upload your cold leads or connect your CRM. Voxa handles the rest." },
              { step: "03", title: "Watch Meetings Roll In", desc: "Voxa calls, texts, qualifies, and books — you just show up and close." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Access Form */}
      <section id="early-access" className="py-24 px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Get Early Access
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Be among the first real estate agents to use Voxa Realty. Limited spots available.
            </p>
          </div>

          {formSubmitted ? (
            <div className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-primary/30 bg-primary/5 text-center">
              <CheckCircle2 className="w-12 h-12 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">You're in!</h3>
              <p className="text-muted-foreground">We'll reach out with early access details soon.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-5 p-8 rounded-2xl border border-border/60 bg-card">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  maxLength={100}
                  className="h-12 rounded-xl px-4 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="form-email" className="text-foreground font-medium">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="form-email"
                  type="email"
                  placeholder="you@example.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                  maxLength={255}
                  className="h-12 rounded-xl px-4 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">
                  Phone <span className="text-muted-foreground text-sm font-normal">(optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  maxLength={20}
                  className="h-12 rounded-xl px-4 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
              >
                Request Early Access
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                No credit card required · We'll never spam you
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={voxaLogo} alt="Voxa Realty" className="h-8" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Voxa Realty. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
