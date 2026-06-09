import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Headphones,
  Loader2,
  Mic2,
  PlayCircle,
  Sparkles,
  Volume2,
} from "lucide-react";
import voxaLogoDark from "@/assets/voxa-logo-dark.png";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const voices = [
  {
    name: "Ana",
    file: "./voices/5GZaeOOG7yqLdoTRsaa6.mp3",
    accent: "from-violet-500 to-fuchsia-400",
    description:
      "Warm, polished, and natural for premium client conversations.",
  },
  {
    name: "Clara",
    file: "./voices/5TZtQYDIn8M40udRnoVI.mp3",
    accent: "from-violet-500 to-fuchsia-400",
    description: "Clear, confident, and friendly for fast lead qualification.",
  },
  {
    name: "Diana",
    file: "./voices/J70EyBFkBjTKuixo3fV1.mp3",
    accent: "from-violet-500 to-fuchsia-400",
    description: "Calm, professional, and reassuring for property enquiries.",
  },
  {
    name: "John",
    file: "./voices/WLKp2jV6nrS8aMkPPDRO.mp3",
    accent: "from-emerald-500 to-teal-400",
    description: "Pofessional, and reassuring voices.",
  },
  {
    name: "Emma",
    file: "./voices/XEQBC9sleaE3f5ff82UR.mp3",
    accent: "from-violet-500 to-fuchsia-400",
    description: "Conversational and approachable voice with a friendly tone.",
  },
  {
    name: "Alex",
    file: "./voices/xZhTmJnxrn4YyTmPDrfZ.mp3",
    accent: "from-emerald-500 to-teal-400",
    description: "Casual and Conversational tone with Australian accent",
  },
  {
    name: "Jess",
    file: "./voices/ys3XeJJA4ArWMhRpcX1D.mp3",
    accent: "from-violet-500 to-fuchsia-400",
    description: "Soft and soothing tone with a calm demeanor",
  },
  {
    name: "Barron",
    file: "./voices/Ziqfyey5k3R3GRC5abi8.mp3",
    accent: "from-emerald-500 to-teal-400",
    description: "Solid and confident voice with a professional tone",
  },
];

export default function VoiceLibraryPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleBookingOpenChange = (open: boolean) => {
    setBookingOpen(open);
    if (!open) { setFormSubmitted(false); setFormLoading(false); }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || formLoading) return;
    setFormLoading(true);
    const normalizedPhone = `+61${formPhone.replace(/\D/g, "").replace(/^0+/, "")}`;
    try {
      const response = await fetch("https://formspree.io/f/maqkerye", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formName,
          phone: normalizedPhone,
          agency_suburb: formEmail,
          intent: "book_call",
          source: "voice_library_page",
          _subject: "New Voxa booking request",
        }),
      });
      if (!response.ok) throw new Error(`Formspree request failed: ${response.status}`);
      setFormSubmitted(true);
      toast.success("Booking request received. We will email available times shortly.");
      setFormName(""); setFormEmail(""); setFormPhone("");
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <main className="bg-[#06111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.28),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_30%),linear-gradient(180deg,#06111f_0%,#0b1220_55%,#020617_100%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={voxaLogoDark} alt="Voxa Realty" className="h-12 w-auto" />
          </Link>
          <button
            onClick={() => setBookingOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#119c9e]/40 bg-[#119c9e]/10 px-4 py-2 text-sm font-medium text-[#3ecfcf] backdrop-blur transition hover:bg-[#119c9e]/20"
          >
            <CalendarDays className="h-4 w-4" />
            Book a call
          </button>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-16 text-center lg:py-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-lg shadow-cyan-950/20 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Voxa Realty Voice Library
          </div>

          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Choose the voice that best represents your brand.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Listen to three curated AI receptionist voices built for real estate
            enquiries, lead qualification, and polished first impressions.
          </p>

          <div className="mt-12 grid w-full gap-6 md:grid-cols-3">
            {voices.map((voice) => (
              <article
                key={voice.name}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-6 text-left shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.1]"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${voice.accent}`}
                />
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${voice.accent} shadow-lg`}
                  >
                    <Mic2 className="h-7 w-7 text-white" />
                  </div>
                  <Volume2 className="h-6 w-6 text-white/35 transition group-hover:text-white/60" />
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Voice
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  {voice.name}
                </h2>
                <p className="mt-3 min-h-[72px] text-base leading-7 text-slate-300">
                  {voice.description}
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
                    <PlayCircle className="h-4 w-4" />
                    Play sample
                  </div>
                  <audio controls className="w-full" preload="metadata">
                    <source src={voice.file} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] px-6 py-6 shadow-2xl shadow-black/20 backdrop-blur sm:flex-row sm:px-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Headphones className="h-6 w-6 text-cyan-200" />
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-left">
              Pick your preferred voice and Voxa can configure your AI
              receptionist experience around that tone.
            </p>
          </div>
        </section>
      </div>

      <Dialog open={bookingOpen} onOpenChange={handleBookingOpenChange}>
        <DialogContent className="w-[calc(100%-2rem)] overflow-hidden rounded-2xl border-white/10 bg-[#071220] p-0 max-w-xl">
          {formSubmitted ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center px-8 py-10 text-center sm:px-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#119c9e]/15 text-[#119c9e]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <DialogTitle className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Request received.
              </DialogTitle>
              <DialogDescription className="mt-4 max-w-md text-sm leading-7 text-sky-100/60 sm:text-base">
                We'll send available times shortly so you can book a strategy call with our team.
              </DialogDescription>
              <Button
                className="mt-7 h-11 rounded-full bg-[#119c9e] px-6 text-white hover:bg-[#0e8082]"
                onClick={() => setBookingOpen(false)}
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Book a call
                </DialogTitle>
                <DialogDescription className="pt-2 text-sm leading-7 text-sky-100/60 sm:text-base">
                  Share your details and we'll call you soon!
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="mt-6 grid gap-5">
                <div className="space-y-2.5">
                  <Label htmlFor="vl-booking-name" className="text-[13px] font-bold uppercase tracking-wider text-sky-100/80">
                    Name <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="vl-booking-name"
                    type="text"
                    placeholder="Your full name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    maxLength={100}
                    disabled={formLoading}
                    className="h-12 rounded-xl border-white/10 bg-white/5 px-4 text-white placeholder:text-white/30 focus-visible:ring-[#119c9e]"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="vl-booking-phone" className="text-[13px] font-bold uppercase tracking-wider text-sky-100/80">
                    Phone <span className="text-rose-400">*</span>
                  </Label>
                  <div className="flex h-12 items-center rounded-xl border border-white/10 bg-white/5 focus-within:ring-2 focus-within:ring-[#119c9e]">
                    <span className="pl-4 pr-3 text-sm font-semibold text-white/85">+61</span>
                    <Input
                      id="vl-booking-phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="4xx xxx xxx"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      required
                      maxLength={12}
                      disabled={formLoading}
                      className="h-full border-0 bg-transparent px-0 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="vl-booking-email" className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-sky-100/80">
                    Agency / Suburb
                    <span className="text-[10px] font-medium tracking-[0.14em] text-sky-100/40">optional</span>
                  </Label>
                  <Input
                    id="vl-booking-email"
                    type="text"
                    placeholder="e.g. Ray White · Brighton"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    maxLength={255}
                    disabled={formLoading}
                    className="h-12 rounded-xl border-white/10 bg-white/5 px-4 text-white placeholder:text-white/30 focus-visible:ring-[#119c9e]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={formLoading || !formName || !formPhone}
                  className="mt-2 h-12 rounded-xl bg-[#119c9e] text-sm font-semibold text-white hover:bg-[#0e8082]"
                >
                  {formLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending request...</>
                  ) : (
                    <>Send booking request</>
                  )}
                </Button>
                <p className="text-center text-[11px] font-medium uppercase tracking-[0.14em] text-sky-100/40">
                  A real person will call you back soon!
                </p>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
