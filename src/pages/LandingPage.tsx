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
import { ArrowRight, BarChart3, Building2, Check, CheckCircle2, Database, LayoutGrid, Loader2, MessageSquare, Phone, PhoneCall, Settings, TrendingUp, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import voxaLogo from "@/assets/voxa-logo.png";

const IgIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);
const FbIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const WaIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.103 1.508 5.83L.057 23.428a.5.5 0 00.609.61l5.64-1.48A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);
const SheetIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
    <path d="M11.318 0H1.333C.6 0 0 .6 0 1.333v21.334C0 23.4.6 24 1.333 24h21.334C23.4 24 24 23.4 24 22.667V8.727L11.318 0z" fill="#23A566"/>
    <path d="M11.318 0v8.727H24L11.318 0z" fill="#1C8C57"/>
    <path d="M7 10.5h10v1.5H7zm0 3h10v1.5H7zm0 3h7v1.5H7z" fill="white"/>
  </svg>
);

const channelTags = [
  { label: "Phone calls",    icon: <PhoneCall className="h-3.5 w-3.5" />,  color: "text-emerald-600" },
  { label: "Instagram",      icon: <IgIcon />,                               color: "text-pink-600" },
  { label: "Facebook",       icon: <FbIcon />,                               color: "text-blue-600" },
  { label: "WhatsApp",       icon: <WaIcon />,                               color: "text-[#25D366]" },
  { label: "Google Sheets",  icon: <SheetIcon />,                            color: "text-[#23A566]" },
  { label: "ReapitSales",    icon: <Building2 className="h-3.5 w-3.5" />,   color: "text-violet-600" },
  { label: "Rex",            icon: <LayoutGrid className="h-3.5 w-3.5" />,  color: "text-orange-500" },
];

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
    <div className="relative h-[100svh] overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(22,101,90,0.16),transparent_36%),radial-gradient(circle_at_82%_16%,rgba(12,72,67,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.7),rgba(247,245,240,0.26))]" />

      <header className="relative z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:h-24 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <img src={voxaLogo} alt="Voxa Realty" className="h-12 w-auto sm:h-14" />
          </a>

          <Button
            className="h-11 rounded-full px-6 text-sm font-semibold shadow-[0_20px_50px_-30px_rgba(22,101,90,0.55)] transition-transform hover:-translate-y-0.5 hover:bg-primary/95"
            onClick={() => setWaitlistOpen(true)}
          >
            Join waitlist
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex h-[calc(100svh-5rem)] max-w-7xl items-center px-6 py-4 lg:h-[calc(100svh-6rem)] lg:px-10">
        <section className="grid w-full items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">

          {/* LEFT: Copy */}
          <div className="flex flex-col gap-5">
            <p className="section-kicker animate-rise-fade [animation-fill-mode:both]">
              sales automation for real estate
            </p>
            <h1 className="animate-rise-fade animate-delay-1 [animation-fill-mode:both] text-[clamp(2.4rem,5.2vw,5rem)] font-bold leading-[0.92] tracking-tight text-foreground">
              Automate sales.
              <br />
              Stop lead leakage.
            </h1>
            <p className="animate-rise-fade animate-delay-2 [animation-fill-mode:both] max-w-lg text-base leading-7 text-muted-foreground">
              Voxa replies to every missed call and social DM in under 5 seconds, qualifies the lead, and pushes it to your CRM — automatically.
            </p>

            <div className="animate-rise-fade animate-delay-2 [animation-fill-mode:both] flex flex-wrap gap-2">
              {channelTags.map(({ label, icon, color }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full border border-border/80 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-foreground/80 transition-colors hover:bg-white"
                >
                  <span className={color}>{icon}</span>
                  {label}
                </span>
              ))}
            </div>

            <div className="animate-rise-fade animate-delay-3 [animation-fill-mode:both] flex flex-wrap items-center gap-3">
              <Button
                className="h-11 rounded-full px-6 text-sm font-semibold shadow-[0_20px_48px_-24px_rgba(22,101,90,0.6)] transition-transform hover:-translate-y-0.5 hover:bg-primary/95"
                onClick={() => setWaitlistOpen(true)}
              >
                Join the waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <a
                href="tel:+15753052236"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border/80 bg-white/75 px-5 text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:bg-white hover:-translate-y-0.5"
              >
                <PhoneCall className="h-4 w-4 text-primary" />
                <span>+1 (575) 305-2236</span>
              </a>
            </div>
          </div>

          {/* RIGHT: App UI mockup */}
          <div className="animate-rise-fade animate-delay-2 [animation-fill-mode:both] relative hidden lg:block">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-primary/12 via-emerald-50/40 to-transparent blur-3xl" />

            {/* Floating pill – top right */}
            <div className="absolute -right-5 -top-3 z-20 flex items-center gap-1.5 rounded-full border border-border/60 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm">
              <Zap className="h-3 w-3 text-amber-500" />
              <span className="text-[11px] font-bold tracking-tight">Lead captured · 2s</span>
            </div>

            {/* App window frame */}
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-white/80 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.14)] backdrop-blur-xl">

              {/* Title bar */}
              <div className="flex items-center gap-3 border-b border-border/40 bg-white/90 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <span className="rounded-md bg-border/30 px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
                    Voxa — Lead Inbox
                  </span>
                </div>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              </div>

              {/* 3-pane layout */}
              <div className="flex" style={{ height: 320 }}>

                {/* Nav sidebar */}
                <div className="flex w-12 shrink-0 flex-col items-center gap-3 border-r border-border/40 bg-white/60 py-4">
                  {[
                    { icon: <MessageSquare className="h-4 w-4" />, active: true },
                    { icon: <Users className="h-4 w-4" />, active: false },
                    { icon: <BarChart3 className="h-4 w-4" />, active: false },
                    { icon: <Database className="h-4 w-4" />, active: false },
                    { icon: <Settings className="h-4 w-4" />, active: false },
                  ].map(({ icon, active }, i) => (
                    <div
                      key={i}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        active
                          ? "bg-primary text-white shadow-[0_4px_12px_-4px_rgba(22,101,90,0.5)]"
                          : "text-muted-foreground/50 hover:bg-border/40"
                      }`}
                    >
                      {icon}
                    </div>
                  ))}
                </div>

                {/* Lead list */}
                <div className="flex w-44 shrink-0 flex-col border-r border-border/40 bg-white/50">
                  <div className="border-b border-border/40 px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">Inbox</p>
                    <span className="mt-0.5 inline-flex rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">3 new</span>
                  </div>
                  {[
                    {
                      avatar: <Phone className="h-3 w-3 text-white" />,
                      avatarBg: "bg-emerald-500",
                      name: "Sarah M.",
                      preview: "4BR Paddington…",
                      time: "2m",
                      unread: true,
                      active: true,
                    },
                    {
                      avatar: <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" /></svg>,
                      avatarBg: "bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
                      name: "James N.",
                      preview: "Bondi viewing?",
                      time: "11m",
                      unread: true,
                      active: false,
                    },
                    {
                      avatar: <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.103 1.508 5.83L.057 23.428a.5.5 0 00.609.61l5.64-1.48A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>,
                      avatarBg: "bg-[#25D366]",
                      name: "Priya S.",
                      preview: "Surry Hills 2BR?",
                      time: "34m",
                      unread: true,
                      active: false,
                    },
                  ].map((lead, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 px-3 py-2.5 ${
                        lead.active ? "bg-primary/8 border-l-2 border-primary" : "border-l-2 border-transparent hover:bg-border/20"
                      }`}
                    >
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${lead.avatarBg}`}>
                        {lead.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-semibold text-foreground">{lead.name}</p>
                          <span className="text-[9px] text-muted-foreground/60">{lead.time}</span>
                        </div>
                        <p className="truncate text-[10px] text-muted-foreground/70">{lead.preview}</p>
                      </div>
                      {lead.unread && <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                    </div>
                  ))}
                </div>

                {/* Conversation panel */}
                <div className="flex flex-1 flex-col bg-white/90">
                  {/* Conv header */}
                  <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5">
                    <div>
                      <p className="text-[12px] font-semibold text-foreground">Sarah Mitchell</p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                        <Phone className="h-2.5 w-2.5 text-emerald-500" />
                        Missed call · Paddington
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 ring-1 ring-emerald-200">
                      Qualified
                    </span>
                  </div>

                  {/* Messages */}
                  <div className="flex flex-1 flex-col gap-2 overflow-hidden px-4 py-3">
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-border/30 px-3 py-2">
                        <p className="text-[10px] text-foreground/80">Hi, I missed your call. I'm interested in the 4BR on Oxford St.</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2">
                        <p className="text-[10px] text-white">Hi Sarah! Thanks for reaching out. The Paddington 4BR is available — happy to arrange a viewing. What time works for you?</p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-white/60">
                          <Zap className="h-2 w-2" />
                          <span className="text-[8px]">Voxa · 3s</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-border/30 px-3 py-2">
                        <p className="text-[10px] text-foreground/80">Saturday morning would be perfect!</p>
                      </div>
                    </div>
                  </div>

                  {/* Input bar */}
                  <div className="border-t border-border/40 px-3 py-2">
                    <div className="flex items-center gap-2 rounded-xl bg-border/20 px-3 py-2">
                      <span className="flex-1 text-[10px] text-muted-foreground/50">Voxa is drafting a reply…</span>
                      <div className="flex gap-0.5">
                        <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "0ms" }} />
                        <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "150ms" }} />
                        <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between border-t border-border/40 bg-primary/5 px-4 py-2">
                <div className="flex items-center gap-1.5 text-primary">
                  <Database className="h-3 w-3" />
                  <span className="text-[10px] font-semibold">Synced to Rex CRM</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground/60">
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-[10px]">Lead pushed · pipeline updated</span>
                </div>
              </div>
            </div>

            {/* Floating pill – bottom left */}
            <div className="absolute -bottom-3 -left-5 z-20 flex items-center gap-1.5 rounded-full border border-border/60 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-bold tracking-tight">Pipeline updated</span>
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
  );
};

export default LandingPage;