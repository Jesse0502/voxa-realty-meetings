import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  Fingerprint,
  Loader2,
  MessageSquare,
  PhoneCall,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import voxaLogo from "@/assets/voxa-logo.png";

const navItems = [
  { label: "Product", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Resources", href: "/best-ai-receptionist-for-real-estate-agents" },
];

const signalStats = [
  { label: "Avg first response", value: "< 5s" },
  { label: "Leads touched", value: "100%" },
  { label: "Qualified conversations", value: "2.4x" },
];

const seoFeatureCards = [
  {
    title: "AI receptionist for inbound calls",
    description:
      "Reply to missed calls in seconds with natural follow-up that captures motivation, budget, and timeline.",
    icon: <PhoneCall className="h-4 w-4 text-emerald-300" />,
  },
  {
    title: "AI lead follow-up from portals",
    description:
      "Engage fresh realestate.com.au and domain.com.au enquiries before competitors can respond.",
    icon: <MessageSquare className="h-4 w-4 text-emerald-300" />,
  },
  {
    title: "Pipeline visibility that drives action",
    description:
      "Track response speed, qualification quality, and booking outcomes so your team knows what to do next.",
    icon: <TrendingUp className="h-4 w-4 text-emerald-300" />,
  },
];

type FlowStep = {
  badge: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const flowSteps: FlowStep[] = [
  {
    badge: "01",
    title: "Capture",
    description:
      "When a call is missed or a portal lead arrives, Voxa responds instantly with context-aware messaging.",
    icon: PhoneCall,
  },
  {
    badge: "02",
    title: "Qualify",
    description:
      "Voxa asks smart follow-up questions to identify intent and urgency, then ranks lead quality automatically.",
    icon: Bot,
  },
  {
    badge: "03",
    title: "Convert",
    description:
      "Warm prospects are handed to your team with next-best actions so appraisals and inspections get booked faster.",
    icon: CalendarClock,
  },
];

const seoFaqs = [
  {
    question: "How does Voxa work as an AI receptionist for real estate agents?",
    answer:
      "Voxa replies to missed calls and online enquiries in real time, asks qualification questions, and routes high-intent prospects to your team.",
  },
  {
    question: "Can Voxa follow up internet leads without sounding robotic?",
    answer:
      "Yes. Voxa is tuned for natural, conversational messaging that matches your agency voice while still collecting structured lead data.",
  },
  {
    question: "What channels can Voxa support today?",
    answer:
      "Most teams start with missed-call text back and portal enquiry follow-up, then expand into website forms and CRM-integrated workflows.",
  },
  {
    question: "Who gets the most value from Voxa?",
    answer:
      "Solo agents, boutique agencies, and larger teams that want faster first response times and stronger conversion from inbound demand.",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: seoFaqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

const LandingPage = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleWaitlistOpenChange = (open: boolean) => {
    setWaitlistOpen(open);

    if (!open) {
      setFormSubmitted(false);
      setFormLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || formLoading) return;

    setFormLoading(true);

    try {
      await fetch(
        "https://n8n-production-a988.up.railway.app/webhook/7b58b4a9-bd2d-4f48-80a7-1fb8b25f8d69",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formName,
            email: formEmail,
            phone: formPhone,
          }),
        },
      );

      setFormSubmitted(true);
      toast.success("You're in. We will follow up with early access details.");
      setFormName("");
      setFormEmail("");
      setFormPhone("");
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100svh] overflow-x-hidden bg-[#04070a] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(16,185,129,0.26),transparent_36%),radial-gradient(circle_at_85%_12%,rgba(12,81,68,0.3),transparent_34%),linear-gradient(180deg,#05090d_0%,#020406_100%)]" />
        <div className="absolute left-1/2 top-[26%] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-emerald-500/18 blur-[120px] md:h-[30rem] md:w-[30rem]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:70px_70px]" />
      </div>

      <header className="relative z-20 border-b border-zinc-200/10 bg-zinc-950/65 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="/" className="group inline-flex items-center rounded-xl bg-white/95 px-3 py-1.5 transition-transform hover:-translate-y-0.5">
            <img src={voxaLogo} alt="Voxa Realty" className="h-8 w-auto" />
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-hero-copy text-sm font-medium text-zinc-300/90 transition-colors hover:text-emerald-300"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-10 rounded-full border-zinc-200/20 bg-zinc-950/70 px-4 text-sm text-zinc-100 hover:bg-zinc-900 md:inline-flex"
              onClick={() => setWaitlistOpen(true)}
            >
              Request demo
            </Button>
            <Button
              className="panel-glow h-10 rounded-full bg-emerald-400 px-4 text-sm font-semibold text-zinc-950 hover:bg-emerald-300"
              onClick={() => setWaitlistOpen(true)}
            >
              Join waitlist
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center px-6 pb-20 pt-14 text-center lg:px-10">
        <section className="mx-auto flex w-full max-w-5xl flex-col items-center">
          <p className="font-hero-copy animate-rise-fade rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200 [animation-fill-mode:both]">
            AI receptionist for high-performance agencies
          </p>

          <h1 className="font-hero-display animate-rise-fade animate-delay-1 mt-8 text-[clamp(2.4rem,9.2vw,7.4rem)] leading-[0.9] [animation-fill-mode:both]">
            <span className="block text-zinc-500">The future of real estate growth</span>
            <span className="block text-zinc-500">is</span>
            <span className="mt-2 flex flex-wrap items-center justify-center gap-3 text-white">
              <span className="inline-flex items-center gap-2">
                <Fingerprint className="h-10 w-10 text-emerald-300 md:h-12 md:w-12" />
                human
              </span>
              <span className="text-zinc-300">+</span>
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-10 w-10 text-emerald-300 animate-neon-pulse md:h-12 md:w-12" />
                AI
              </span>
            </span>
          </h1>

          <p className="font-hero-copy animate-rise-fade animate-delay-2 mt-8 max-w-2xl text-balance text-base leading-8 text-zinc-300 [animation-fill-mode:both] sm:text-lg">
            Voxa responds to every missed call and inbound enquiry in seconds, qualifies intent, and hands your team warm opportunities with context.
          </p>

          <div className="animate-rise-fade animate-delay-3 mt-10 flex flex-wrap items-center justify-center gap-3 [animation-fill-mode:both]">
            <Button
              className="panel-glow h-12 rounded-full bg-emerald-400 px-7 text-sm font-semibold text-zinc-950 hover:bg-emerald-300"
              onClick={() => setWaitlistOpen(true)}
            >
              Join the waitlist
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <a
              href="tel:+15753052236"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-zinc-200/20 bg-zinc-900/75 px-6 text-sm font-semibold text-zinc-100 transition-all hover:-translate-y-0.5 hover:border-emerald-300/35 hover:text-emerald-200"
            >
              <PhoneCall className="h-4 w-4 text-emerald-300" />
              +1 (575) 305-2236
            </a>
          </div>

          <div className="animate-rise-fade animate-delay-3 mt-9 grid w-full max-w-3xl grid-cols-1 gap-3 [animation-fill-mode:both] sm:grid-cols-3">
            {signalStats.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-zinc-200/10 bg-zinc-950/55 px-4 py-4 backdrop-blur-md"
              >
                <p className="font-hero-display text-3xl leading-none text-white">{value}</p>
                <p className="font-hero-copy mt-1 text-xs uppercase tracking-[0.17em] text-zinc-400">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <section id="features" className="relative z-10 border-y border-zinc-200/10 bg-zinc-950/55 py-16 backdrop-blur-md lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="font-hero-copy text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Product capabilities</p>
            <h2 className="font-hero-display mt-4 text-4xl leading-[0.92] text-white sm:text-5xl">
              Designed to close the gap between first contact and booked conversations.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {seoFeatureCards.map(({ title, description, icon }) => (
              <article
                key={title}
                className="rounded-3xl border border-emerald-300/18 bg-zinc-950/75 p-6 shadow-[0_0_0_1px_rgba(16,185,129,0.06),0_32px_80px_-44px_rgba(16,185,129,0.62)]"
              >
                <div className="inline-flex rounded-xl border border-emerald-300/25 bg-emerald-300/10 p-2.5">{icon}</div>
                <h3 className="font-hero-display mt-4 text-2xl leading-tight text-white">{title}</h3>
                <p className="font-hero-copy mt-3 text-sm leading-7 text-zinc-300">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="font-hero-copy text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">How Voxa works</p>
            <h2 className="font-hero-display mt-4 text-4xl leading-[0.92] text-white sm:text-5xl">
              One always-on system from missed call to qualified booking.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {flowSteps.map(({ badge, title, description, icon: Icon }) => (
              <article key={badge} className="rounded-3xl border border-zinc-200/10 bg-zinc-950/60 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-hero-copy text-xs font-bold tracking-[0.2em] text-emerald-300">{badge}</span>
                  <Icon className="h-5 w-5 text-emerald-300" />
                </div>
                <h3 className="font-hero-display mt-4 text-3xl leading-none text-white">{title}</h3>
                <p className="font-hero-copy mt-4 text-sm leading-7 text-zinc-300">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="relative z-10 border-t border-zinc-200/10 py-16 lg:py-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />

        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="font-hero-copy text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">FAQ</p>
            <h2 className="font-hero-display mt-4 text-4xl leading-[0.92] text-white sm:text-5xl">
              Questions agencies ask before switching to AI lead response.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {seoFaqs.map(({ question, answer }) => (
              <article key={question} className="rounded-3xl border border-zinc-200/10 bg-zinc-950/65 p-6 backdrop-blur-sm">
                <h3 className="font-hero-display text-2xl leading-tight text-white">{question}</h3>
                <p className="font-hero-copy mt-4 text-sm leading-7 text-zinc-300">{answer}</p>
              </article>
            ))}
          </div>

          <div className="panel-glow rounded-3xl border border-emerald-300/25 bg-emerald-300/10 px-6 py-8 text-center md:px-10">
            <p className="font-hero-copy text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Ready to upgrade lead handling?</p>
            <h3 className="font-hero-display mt-3 text-4xl leading-[0.94] text-white sm:text-5xl">Move from reactive follow-up to always-on conversion.</h3>
            <Button
              className="mt-7 h-11 rounded-full bg-emerald-400 px-6 font-semibold text-zinc-950 hover:bg-emerald-300"
              onClick={() => setWaitlistOpen(true)}
            >
              Join the waitlist
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={waitlistOpen} onOpenChange={handleWaitlistOpenChange}>
        <DialogContent className="overflow-hidden rounded-2xl border border-emerald-300/25 bg-zinc-950 p-0 text-zinc-100 sm:max-w-xl">
          {formSubmitted ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center px-8 py-10 text-center sm:px-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/12 text-emerald-300">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <DialogTitle className="font-hero-display mt-6 text-4xl leading-none text-white">
                You're on the list.
              </DialogTitle>
              <DialogDescription className="font-hero-copy mt-4 max-w-md text-sm leading-7 text-zinc-300 sm:text-base">
                We will follow up with early access details and setup steps for your team.
              </DialogDescription>

              <Button
                className="mt-7 h-11 rounded-full bg-emerald-400 px-6 font-semibold text-zinc-950 hover:bg-emerald-300"
                onClick={() => setWaitlistOpen(false)}
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              <DialogHeader>
                <DialogTitle className="font-hero-display text-4xl leading-none text-white">
                  Join the waitlist
                </DialogTitle>
                <DialogDescription className="font-hero-copy pt-2 text-sm leading-7 text-zinc-300 sm:text-base">
                  Share your details and we will reach out with onboarding availability.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleFormSubmit} className="mt-6 grid gap-5">
                <div className="space-y-2.5">
                  <Label
                    htmlFor="waitlist-name"
                    className="font-hero-copy text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-300"
                  >
                    Name <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="waitlist-name"
                    type="text"
                    placeholder="Your full name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    maxLength={100}
                    disabled={formLoading}
                    className="h-12 rounded-xl border-zinc-200/15 bg-zinc-900 px-4 text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label
                    htmlFor="waitlist-email"
                    className="font-hero-copy text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-300"
                  >
                    Email <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="waitlist-email"
                    type="email"
                    placeholder="you@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    maxLength={255}
                    disabled={formLoading}
                    className="h-12 rounded-xl border-zinc-200/15 bg-zinc-900 px-4 text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label
                    htmlFor="waitlist-phone"
                    className="font-hero-copy text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-300"
                  >
                    Phone <span className="text-zinc-500">(optional)</span>
                  </Label>
                  <Input
                    id="waitlist-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    maxLength={20}
                    disabled={formLoading}
                    className="h-12 rounded-xl border-zinc-200/15 bg-zinc-900 px-4 text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={formLoading || !formName || !formEmail}
                  className="mt-2 h-12 rounded-xl bg-emerald-400 text-sm font-semibold text-zinc-950 hover:bg-emerald-300"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>Request early access</>
                  )}
                </Button>

                <p className="font-hero-copy text-center text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                  2-minute form · no credit card · early access only
                </p>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <footer className="relative z-10 border-t border-zinc-200/10 bg-zinc-950/70 px-6 py-4 backdrop-blur-sm lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
          <p className="font-hero-copy text-xs text-zinc-400">Voxa Realty</p>
          <p className="font-hero-copy text-xs text-zinc-400">
            AI receptionist and sales agent software for real estate teams.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;