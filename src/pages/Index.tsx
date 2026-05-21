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
  CheckCircle2,
  Loader2,
  PhoneCall,
} from "lucide-react";
import { toast } from "sonner";
import voxaLogo from "@/assets/voxa-logo.png";

const capabilityPoints = [
  "Automates sales follow-up so no hot lead goes cold.",
  "Works with your own phone number and handles missed calls instantly.",
  "Replies to Instagram, Facebook, and WhatsApp DMs about your listings.",
  "Syncs lead data to Google Sheets, ReapitSales, and Rex.",
];

const channels = ["Phone calls", "Instagram", "Facebook", "WhatsApp"];

const integrations = ["Google Sheets", "ReapitSales", "Rex"];

const Index = () => {
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
                          <div className="relative h-[100svh] overflow-hidden bg-background text-foreground">
                            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(22,101,90,0.16),transparent_36%),radial-gradient(circle_at_82%_16%,rgba(12,72,67,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.7),rgba(247,245,240,0.26))]" />

                            <header className="relative z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
                              <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:h-24 lg:px-10">
                                <a href="/" className="flex items-center gap-3">
                      />
                    </div>

                                    className="h-12 w-auto sm:h-14"
                      <Label
                        htmlFor="form-email"
                        className="text-[13px] font-bold uppercase tracking-wider text-foreground/80"
                                <Button
                                  className="h-11 rounded-full px-6 text-sm font-semibold shadow-[0_20px_50px_-30px_rgba(22,101,90,0.55)] transition-transform hover:-translate-y-0.5 hover:bg-primary/95"
                                  onClick={() => setWaitlistOpen(true)}
                                >
                                  Join waitlist
                                </Button>
                              </div>
                            </header>

                            <main className="relative z-10 mx-auto flex h-[calc(100svh-5rem)] max-w-7xl items-center px-6 py-6 lg:h-[calc(100svh-6rem)] lg:px-10">
                              <section className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
                                <div className="animate-rise-fade flex flex-col justify-center">
                                  <p className="section-kicker">sales automation for real estate</p>
                                  <h1 className="mt-4 text-[2.5rem] font-bold leading-[0.95] tracking-tight text-foreground sm:text-[3.2rem] lg:text-[4.4rem]">
                                    Automate sales.
                                    <br />
                                    Stop lead leakage.
                                  </h1>
                                  <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                                    Voxa responds to leads in seconds across calls and social DMs, so
                                    every inquiry about your listings is captured, qualified, and
                                    pushed into your CRM.
                                  </p>

                                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    {capabilityPoints.map((point) => (
                                      <div
                                        key={point}
                                        className="surface-card rounded-2xl px-4 py-3 text-sm leading-6 text-muted-foreground"
                                      >
                                        <div className="mb-2 flex items-center gap-2 text-primary">
                                          <CheckCircle2 className="h-4 w-4" />
                                          <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                                            Core value
                                          </span>
                                        </div>
                                        {point}
                                      </div>
                                    ))}
                                  </div>

                                  <div className="mt-7 flex flex-wrap items-center gap-3">
                                    <Button
                                      className="h-12 rounded-full px-7 text-sm font-semibold shadow-[0_24px_52px_-28px_rgba(22,101,90,0.6)] hover:bg-primary/95"
                                      onClick={() => setWaitlistOpen(true)}
                                    >
                                      Join the waitlist
                                      <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>

                                    <a
                                      href="tel:+15753052236"
                                      className="inline-flex h-12 items-center gap-2 rounded-full border border-border/80 bg-white/75 px-5 text-sm font-semibold text-foreground transition-all hover:border-primary/35 hover:bg-white"
                                    >
                                      <PhoneCall className="h-4 w-4 text-primary" />
                                      <span>Try demo: +1 (575) 305-2236</span>
                                    </a>
                                  </div>
                                </div>

                                <div className="animate-rise-fade surface-card flex h-full min-h-[310px] flex-col justify-between rounded-[2rem] border border-border/70 p-6 sm:p-8">
                                  <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">
                                      One inbox for every channel
                                    </p>
                                    <h2 className="mt-3 text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-[2.4rem]">
                                      Every listing inquiry gets an instant response.
                                    </h2>
                                  </div>

                                  <div className="mt-6">
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                                      Lead channels covered
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {channels.map((channel) => (
                                        <span
                                          key={channel}
                                          className="rounded-full border border-border/80 bg-white/75 px-3 py-1.5 text-xs font-semibold text-foreground"
                                        >
                                          {channel}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="mt-6 border-t border-border/60 pt-5">
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                                      CRM sync
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {integrations.map((integration) => (
                                        <span
                                          key={integration}
                                          className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                                        >
                                          {integration}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </section>
                            </main>

                            <Dialog open={waitlistOpen} onOpenChange={handleWaitlistOpenChange}>
                              <DialogContent className="overflow-hidden rounded-2xl border-border/70 p-0 sm:max-w-xl">
                                {formSubmitted ? (
                                  <div className="flex min-h-[340px] flex-col items-center justify-center px-8 py-10 text-center sm:px-12">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                      <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <DialogTitle className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                      You're on the list.
                                    </DialogTitle>
                                    <DialogDescription className="mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                                      We will follow up with early access details and next steps for
                                      getting Voxa live on your number and channels.
                                    </DialogDescription>

                                    <Button
                                      className="mt-7 h-11 rounded-full px-6"
                                      onClick={() => setWaitlistOpen(false)}
                                    >
                                      Done
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="p-6 sm:p-8">
                                    <DialogHeader>
                                      <DialogTitle className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                        Join the waitlist
                                      </DialogTitle>
                                      <DialogDescription className="pt-2 text-sm leading-7 sm:text-base">
                                        Share your details and we will reach out with onboarding
                                        availability.
                                      </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleFormSubmit} className="mt-6 grid gap-5">
                                      <div className="space-y-2.5">
                                        <Label
                                          htmlFor="waitlist-name"
                                          className="text-[13px] font-bold uppercase tracking-wider text-foreground/80"
                                        >
                                          Name <span className="text-destructive">*</span>
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
                                          className="h-12 rounded-xl border-border/70 bg-white px-4"
                                        />
                                      </div>

                                      <div className="space-y-2.5">
                                        <Label
                                          htmlFor="waitlist-email"
                                          className="text-[13px] font-bold uppercase tracking-wider text-foreground/80"
                                        >
                                          Email <span className="text-destructive">*</span>
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
                                          className="h-12 rounded-xl border-border/70 bg-white px-4"
                                        />
                                      </div>

                                      <div className="space-y-2.5">
                                        <Label
                                          htmlFor="waitlist-phone"
                                          className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-foreground/80"
                                        >
                                          Phone
                                          <span className="text-[10px] font-medium tracking-[0.14em] text-muted-foreground/70">
                                            optional
                                          </span>
                                        </Label>
                                        <Input
                                          id="waitlist-phone"
                                          type="tel"
                                          placeholder="+1 (555) 000-0000"
                                          value={formPhone}
                                          onChange={(e) => setFormPhone(e.target.value)}
                                          maxLength={20}
                                          disabled={formLoading}
                                          className="h-12 rounded-xl border-border/70 bg-white px-4"
                                        />
                                      </div>

                                      <Button
                                        type="submit"
                                        disabled={formLoading || !formName || !formEmail}
                                        className="mt-2 h-12 rounded-xl text-sm font-semibold"
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

                                      <p className="text-center text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
                                        2-minute form - no credit card - early access only
                                      </p>
                                    </form>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <footer className="absolute inset-x-0 bottom-0 z-10 border-t border-border/60 bg-background/40 px-6 py-3 backdrop-blur-sm lg:px-10">
                              <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-xs text-muted-foreground sm:text-sm">
                                <p>Voxa Realty</p>
                                <p>Automate sales. Eliminate lead leakage.</p>
                              </div>
                            </footer>
                          </div>
