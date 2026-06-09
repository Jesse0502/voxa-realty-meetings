import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Headphones, Mic2, PlayCircle, Sparkles, Volume2 } from "lucide-react";
import voxaLogoDark from "@/assets/voxa-logo-dark.png";

const voices = [
  {
    name: "Ana",
    file: "https://www.voxarealty.com/5GZaeOOG7yqLdoTRsaa6.mp3",
    accent: "from-blue-500 to-cyan-400",
    description: "Warm, polished, and natural for premium client conversations.",
  },
  {
    name: "Clara",
    file: "https://www.voxarealty.com/5TZtQYDIn8M40udRnoVI.mp3",
    accent: "from-violet-500 to-fuchsia-400",
    description: "Clear, confident, and friendly for fast lead qualification.",
  },
  {
    name: "Diana",
    file: "https://www.voxarealty.com/J70EyBFkBjTKuixo3fV1.mp3",
    accent: "from-emerald-500 to-teal-400",
    description: "Calm, professional, and reassuring for property enquiries.",
  },
];

export default function VoiceLibraryPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#06111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.28),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_30%),linear-gradient(180deg,#06111f_0%,#0b1220_55%,#020617_100%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={voxaLogoDark} alt="Voxa Realty" className="h-12 w-auto" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
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
            Listen to three curated AI receptionist voices built for real estate enquiries, lead qualification, and polished first impressions.
          </p>

          <div className="mt-12 grid w-full gap-6 md:grid-cols-3">
            {voices.map((voice) => (
              <article
                key={voice.name}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-6 text-left shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.1]"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${voice.accent}`} />
                <div className="mb-6 flex items-center justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${voice.accent} shadow-lg`}>
                    <Mic2 className="h-7 w-7 text-white" />
                  </div>
                  <Volume2 className="h-6 w-6 text-white/35 transition group-hover:text-white/60" />
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Voice</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">{voice.name}</h2>
                <p className="mt-3 min-h-[72px] text-base leading-7 text-slate-300">{voice.description}</p>

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
              Pick your preferred voice and Voxa can configure your AI receptionist experience around that tone.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
