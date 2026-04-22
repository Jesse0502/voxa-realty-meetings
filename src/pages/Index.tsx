import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import voxaLogo from "@/assets/voxa-logo.png";

const proofBlocks = [
  {
    value: "78%",
    title: "First response wins the deal",
    detail:
      "The agent who answers first controls the conversation and the appointment window.",
    source: "Sales cycle benchmark",
  },
  {
    value: "5 min",
    title: "High-intent demand drops off",
    detail: "Once response time stretches beyond 5 minutes, intent plummets.",
    source: "Lead response study",
  },
  {
    value: "50%+",
    title: "Inbound calls go unanswered",
    detail: "Every missed call is pipeline leakage unless covered immediately.",
    source: "Industry average",
  },
];

const systemProof = [
  "Logs immediate interaction transcript in your CRM.",
  "Tags leads with Intent (Low, Medium, High).",
  "Extracts qualification facts (Timeline, Budget).",
];

const rolloutPoints = [
  "Priority onboarding with founder involvement",
  "A setup tuned to your agency's lead flow and scripts",
  "Lifetime founder pricing for the first three qualified signups",
];

const nextSteps = [
  "Share your details for early access consideration.",
  "We review fit and send next-step onboarding details.",
  "Qualified early users are invited into the founder rollout.",
];

const Index = () => {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

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
      toast.success("You're in. We'll reach out with early access details.");
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
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(circle_at_top_left,rgba(22,101,90,0.12),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.62),rgba(247,245,240,0.14))]" />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 sm:h-24 max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="#top" className="flex items-center gap-3">
            <img
              src={voxaLogo}
              alt="Voxa Realty"
              className="h-12 w-auto sm:h-16"
            />
          </a>

          <a href="#early-access">
            <Button className="h-11 rounded-full px-6 text-sm font-semibold shadow-[0_20px_50px_-30px_rgba(22,101,90,0.55)] transition-transform hover:-translate-y-0.5 hover:bg-primary/95">
              Request early access
            </Button>
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative px-6 pb-18 pt-16 sm:pb-24 sm:pt-20 lg:px-10 lg:pt-24">
          <div className="bg-grid-soft absolute inset-0 -z-20 opacity-30" />
          <div className="animate-drift-soft absolute left-0 top-20 -z-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="animate-float-soft absolute right-4 top-16 -z-10 h-64 w-64 rounded-full bg-emerald-950/5 blur-3xl" />

          <div className="mx-auto max-w-7xl">
            <div className="animate-rise-fade">
              <p className="section-kicker mb-5">
                sales infrastructure for real estate agents
              </p>
              <h1 className="text-[3.7rem] leading-[0.9] text-foreground font-bold tracking-tight sm:text-[4.6rem] lg:text-[5.6rem]">
                Never lose a lead after hours.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-[1.15rem]">
                AI call handling for real estate agents. Answer missed calls,
                qualify leads, and book appointments automatically while you
                focus on closing.
              </p>

              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap">
                <a href="#early-access">
                  <Button className="h-13 py-4 rounded-full px-8 text-base font-semibold shadow-[0_26px_60px_-32px_rgba(22,101,90,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-primary/95">
                    Join the waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>

                <a
                  href="tel:+15753052236"
                  className="inline-flex h-13 items-center gap-3 rounded-full border border-border/80 bg-white/70 px-6 text-sm font-semibold text-foreground shadow-[0_22px_60px_-42px_rgba(22,30,31,0.35)] transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white"
                >
                  <PhoneCall className="h-4 w-4 text-primary" />
                  <span>Try demo</span>
                  <span className="text-primary py-4">+1 (575) 305-2236</span>
                </a>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  "Picks up every missed call, 24/7.",
                  "Collects lead info and qualification details.",
                  "Books appointments directly on your calendar.",
                ].map((item, index) => (
                  <div
                    key={item}
                    className={`surface-card animate-rise-fade rounded-[1.6rem] px-5 py-5 text-sm leading-6 text-muted-foreground ${
                      index === 0
                        ? "animate-delay-1"
                        : index === 1
                          ? "animate-delay-2"
                          : "animate-delay-3"
                    }`}
                  >
                    <div className="mb-3 h-px w-12 bg-primary/30" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="proof" className="px-6 py-6 lg:px-10">
          <div className="mx-auto max-w-7xl border-y border-border/70 py-16">
            <div className="mb-12 max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wider text-primary">
                Economic proof
              </p>
              <h2 className="mt-4 font-bold tracking-tight text-4xl text-foreground sm:text-5xl">
                Missed response time is lost revenue.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {proofBlocks.map((block) => (
                <article
                  key={block.title}
                  className="rounded-2xl border border-border/60 bg-white/50 p-8 shadow-sm"
                >
                  <p className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl">
                    {block.value}
                  </p>
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">
                    {block.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {block.detail}
                  </p>
                  {block.source && (
                    <p className="mt-6 text-xs text-muted-foreground/60 font-medium uppercase tracking-widest">
                      {block.source}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="offer" className="px-6 pb-10 lg:px-10 mt-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[2.2rem] bg-primary text-white px-8 py-12 lg:p-16 shadow-[0_20px_60px_-15px_rgba(22,101,90,0.4)]">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.8),transparent_60%)]" />
              <div className="relative z-10 grid gap-10 md:grid-cols-[1fr_0.85fr] md:items-center">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-200">
                    Founder rollout
                  </p>
                  <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-[4rem] leading-[1.05]">
                    Founder pricing for the first 3 agencies.
                  </h2>
                  <p className="mt-6 max-w-xl text-lg text-emerald-50/80">
                    This rollout is intentionally small. Early users get
                    priority setup support, the strongest commercial terms, and
                    a direct hand in shaping how Voxa fits your pipeline.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-md">
                  <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-200/80">
                        Priority tier
                      </p>
                      <p className="mt-2 text-2xl font-bold tracking-tight text-white">
                        White-glove onboarding
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-emerald-200">
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>

                  <ul className="space-y-4">
                    {rolloutPoints.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-4 text-[15px] text-emerald-50/90"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="early-access"
          className="relative overflow-hidden px-6 py-24 lg:px-10"
        >
          <div className="bg-noise-soft absolute inset-0 -z-10 opacity-20" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div>
              <h2 className="text-4xl text-foreground sm:text-5xl lg:text-[4rem]">
                Join the waitlist before the first rollout closes.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                If the fit is right, Voxa reaches out with onboarding details,
                founder pricing status, and the next step for getting your phone
                coverage live.
              </p>

              <div className="surface-card mt-8 rounded-[2rem] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">
                  What happens next
                </p>
                <ul className="mt-5 space-y-4">
                  {nextSteps.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-7 text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              {formSubmitted ? (
                <div className="surface-card flex min-h-[420px] flex-col items-center justify-center rounded-[2.2rem] border border-border/60 bg-white/50 p-8 text-center sm:p-12 shadow-[0_30px_60px_-20px_rgba(22,101,90,0.15)]">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                    You're on the list.
                  </h3>
                  <p className="mt-5 max-w-md text-base leading-8 text-muted-foreground sm:text-lg">
                    We'll follow up with early-access details and let you know
                    if founder pricing is still open.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleFormSubmit}
                  className="surface-card rounded-[2.2rem] border border-border/60 bg-white/50 p-6 sm:p-10 shadow-[0_30px_60px_-20px_rgba(22,101,90,0.15)]"
                >
                  <div className="flex flex-col gap-2 pb-8">
                    <h3 className="text-3xl font-black tracking-tight text-foreground sm:text-[2.8rem]">
                      Claim your spot
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Join the waitlist for founder pricing and priority setup.
                    </p>
                  </div>

                  <div className="mt-2 grid gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="name"
                        className="text-[13px] font-bold uppercase tracking-wider text-foreground/80"
                      >
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
                        disabled={formLoading}
                        className="h-14 rounded-xl border-border/60 bg-white px-5 text-[15px] text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="form-email"
                        className="text-[13px] font-bold uppercase tracking-wider text-foreground/80"
                      >
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
                        disabled={formLoading}
                        className="h-14 rounded-xl border-border/60 bg-white px-5 text-[15px] text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-foreground/80"
                      >
                        Phone{" "}
                        <span className="text-muted-foreground/60 text-[10px] uppercase tracking-widest">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        maxLength={20}
                        disabled={formLoading}
                        className="h-14 rounded-xl border-border/60 bg-white px-5 text-[15px] text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-4">
                    <Button
                      type="submit"
                      disabled={formLoading}
                      className="h-14 w-full rounded-xl text-[15px] font-bold shadow-sm transition-all hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-50 hover:shadow-[0_20px_40px_-20px_rgba(22,101,90,0.4)]"
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
                    <p className="text-center text-xs font-medium text-muted-foreground/70 uppercase tracking-widest mt-2">
                      2-minute form • No credit card • Early access only
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 px-6 py-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Voxa Realty</p>
          <p>Stop losing leads. Start closing deals.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
