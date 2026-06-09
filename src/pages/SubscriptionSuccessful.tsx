import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, PhoneForwarded, CheckCheck, PhoneCall } from "lucide-react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

type UIState = "success" | "setup" | "test" | "done";
type ForwardTab = "telstra" | "android" | "iphone";

const SubscriptionSuccessful = () => {
  const navigate = useNavigate();
  const [uiState, setUiState] = useState<UIState>("success");
  const [activeTab, setActiveTab] = useState<ForwardTab>("telstra");
  const [virtualNumber, setVirtualNumber] = useState<string | null>(null);
  const [loadingNumber, setLoadingNumber] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("voxa_token");
    if (!token) return;

    setLoadingNumber(true);
    fetch(`${SERVER_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.virtualNumber) {
          setVirtualNumber(data.virtualNumber);
        } else if (data?.virtual_number) {
          setVirtualNumber(data.virtual_number);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingNumber(false));
  }, []);

  const displayNumber = virtualNumber ?? "your Voxa number";

  const handleDone = () => setUiState("test");

  const handleFinish = () => {
    setUiState("done");
    setTimeout(() => navigate("/dashboard"), 2200);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#06111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(17,156,158,0.14),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.10),transparent_35%),linear-gradient(180deg,#06111f_0%,#0b1220_60%,#020617_100%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 py-16">

        {/* ── Success State ── */}
        {uiState === "success" && (
          <div className="flex w-full flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#119c9e]/15 ring-1 ring-[#119c9e]/30">
              <CheckCircle2 className="h-12 w-12 text-[#119c9e]" />
            </div>

            <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
              Payment successful!
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-sky-100/60">
              Welcome to Voxa Realty. Your account is now active. Let's get your call
              forwarding set up so you never miss a lead.
            </p>

            <Button
              onClick={() => setUiState("setup")}
              className="mt-10 h-12 rounded-xl bg-[#119c9e] px-8 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(17,156,158,0.5)] hover:bg-[#0e8082]"
            >
              Set up call forwarding →
            </Button>
          </div>
        )}

        {/* ── Setup State ── */}
        {uiState === "setup" && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#119c9e]/15 ring-1 ring-[#119c9e]/30">
                <PhoneForwarded className="h-6 w-6 text-[#119c9e]" />
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                Set up call forwarding
              </h2>
              <p className="mt-2 text-sm text-sky-100/50">
                Forward unanswered calls to your Voxa number so every lead is captured.
              </p>
            </div>

            {/* Virtual number display */}
            <div className="mb-6 rounded-2xl border border-[#119c9e]/30 bg-[#119c9e]/10 px-6 py-4 text-center">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#119c9e]">
                Your Voxa Number
              </p>
              {loadingNumber ? (
                <p className="mt-1 text-lg font-semibold text-white/50">Loading…</p>
              ) : (
                <p className="mt-1 text-2xl font-bold tracking-wide text-white">
                  {displayNumber}
                </p>
              )}
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl border border-white/10 bg-white/5 p-1 mb-6">
              {(["telstra", "android", "iphone"] as ForwardTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-[#119c9e] text-white shadow"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {tab === "telstra" ? "Telstra" : tab === "android" ? "Android" : "iPhone"}
                </button>
              ))}
            </div>

            {/* Telstra tab */}
            {activeTab === "telstra" && (
              <div className="animate-in fade-in duration-300 space-y-4">
                <p className="text-xs text-sky-100/50 mb-1">
                  Open your phone's dial pad and enter the code, then press Call.
                </p>
                <p className="text-xs text-amber-300/70 mb-2">
                  It is advised to set up all 3 types of call forwarding — unanswered, busy, and unreachable.
                </p>
                <div className="rounded-xl border border-white/10 bg-white/5 divide-y divide-white/5">
                  {[
                    { label: "Forward when unanswered", code: `*61*${displayNumber}#` },
                    { label: "Forward when busy", code: `*67*${displayNumber}#` },
                    { label: "Forward when unreachable", code: `*62*${displayNumber}#` },
                    
                  ].map(({ label, code }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-sky-100/60">{label}</span>
                      <code className="rounded-md bg-black/30 px-3 py-1 text-sm font-mono font-semibold text-[#119c9e]">
                        {code}
                      </code>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-sky-100/35 mt-2">
                  Dial <strong className="text-white/50">##61#</strong> to deactivate &quot;when unanswered&quot; forwarding only.
                </p>
              </div>
            )}

            {/* Android tab */}
            {activeTab === "android" && (
              <div className="animate-in fade-in duration-300 space-y-3">
                {[
                  "Open your Phone app.",
                  "Tap the ⋮ (three-dot) menu → Settings.",
                  "Go to Call forwarding (or Supplementary services → Call forwarding).",
                  'Choose "When unanswered", "When busy", or "When unreachable".',
                  `Enter your Voxa number: ${displayNumber}`,
                  'Tap "Enable" to activate.',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#119c9e]/20 text-[11px] font-bold text-[#119c9e]">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-6 text-sky-100/70">{step}</p>
                  </div>
                ))}
              </div>
            )}

            {/* iPhone tab */}
            {activeTab === "iphone" && (
              <div className="animate-in fade-in duration-300 space-y-3">
                {[
                  "Open Settings → Phone.",
                  "Tap Call Forwarding.",
                  "Toggle Call Forwarding ON (green).",
                  `Tap "Forward To" → enter your Voxa number: ${displayNumber}`,
                  "Tap Call Forwarding in the top-left to confirm.",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#119c9e]/20 text-[11px] font-bold text-[#119c9e]">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-6 text-sky-100/70">{step}</p>
                  </div>
                ))}
                <div className="mt-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
                  <p className="text-xs leading-5 text-amber-300/80">
                    <strong>Note:</strong> iPhone's built-in forwarding forwards <em>all</em> calls. For conditional
                    forwarding (unanswered / busy), use the Telstra dial codes in the tab above.
                  </p>
                </div>
              </div>
            )}

            {/* Support note */}
            <p className="mt-8 text-center text-sm text-sky-100/40">
              Having trouble?{" "}
              <a
                href="mailto:mail@voxarealty.com"
                className="text-[#119c9e] hover:underline"
              >
                mail@voxarealty.com
              </a>{" "}
              — we're happy to help.
            </p>

            {/* Done button */}
            <Button
              onClick={handleDone}
              className="mt-6 h-12 w-full rounded-xl bg-white/10 text-sm font-semibold text-white hover:bg-white/15 border border-white/10"
            >
              Done ✔️
            </Button>
          </div>
        )}

        {/* ── Test State ── */}
        {uiState === "test" && (
          <div className="flex w-full flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#119c9e]/15 ring-1 ring-[#119c9e]/30">
              <PhoneCall className="h-10 w-10 text-[#119c9e]" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Test it out
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-7 text-sky-100/55">
              Call your own phone number from another phone. Let it ring and
              don't answer — Voxa should pick it up.
            </p>

            <div className="mt-8 w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/5">
              {[
                { step: "1", text: "Get a second phone (or ask someone to call you)." },
                { step: "2", text: "Call your regular phone number from that phone." },
                { step: "3", text: "Let it ring and don't answer — Voxa should answer after a few rings." },
                { step: "4", text: "You'll receive an SMS summary after the call ends." },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-4 px-5 py-4 text-left">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#119c9e]/20 text-[11px] font-bold text-[#119c9e]">
                    {step}
                  </span>
                  <p className="text-sm leading-6 text-sky-100/70">{text}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={handleFinish}
              className="mt-8 h-12 w-full max-w-sm rounded-xl bg-[#119c9e] text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(17,156,158,0.5)] hover:bg-[#0e8082]"
            >
              It's working — go to dashboard →
            </Button>
            <button
              onClick={handleFinish}
              className="mt-3 text-xs text-sky-100/30 hover:text-sky-100/50 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* ── Done State ── */}
        {uiState === "done" && (
          <div className="flex w-full flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#119c9e]/15 ring-1 ring-[#119c9e]/30">
              <CheckCheck className="h-10 w-10 text-[#119c9e]" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              You're good to go!
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-7 text-sky-100/55">
              You can customise your opening message and call prompt in the{" "}
              <strong className="text-white/70">Assistant</strong> section of your dashboard.
            </p>
            <p className="mt-4 text-xs text-sky-100/30">Taking you to your dashboard…</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default SubscriptionSuccessful;
