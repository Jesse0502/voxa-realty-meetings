import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, PhoneCall, Lock, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { setAuthFromOnboarding } from "@/store/authSlice";
import voxaLogoDark from "@/assets/voxa-logo-dark.png";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const PAYMENT_LINKS: Record<string, string> = {
  earlyAccess: import.meta.env.VITE_EARLY_ACCESS_PAYMENT_LINK ?? "",
  basic: import.meta.env.VITE_BASIC_PAYMENT_LINK ?? "",
  pro: import.meta.env.VITE_PRO_PAYMENT_LINK ?? "",
};

const PLAN_LABELS: Record<string, string> = {
  earlyAccess: "Early Access",
  basic: "Basic",
  pro: "Pro",
};

type Step = "info" | "password" | "plan";

export default function OnboardingPage() {
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<Step>("info");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`${SERVER_URL}/auth/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone_number: phone.trim(),
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || "Could not verify account.");

      setUserId(data.user_id);
      setStep("password");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`${SERVER_URL}/auth/onboarding/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, password }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || "Failed to set password.");

      dispatch(setAuthFromOnboarding({ token: data.token, user: data.user }));
      setSubscriptionType(data.subscription_type ?? "basic");
      setStep("plan");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToPayment = () => {
    const link = PAYMENT_LINKS[subscriptionType ?? ""] || PAYMENT_LINKS.basic;
    if (!link) {
      toast.error("Payment link not configured. Please contact support.");
      return;
    }
    window.location.href = link;
  };

  const stepIndex = step === "info" ? 0 : step === "password" ? 1 : 2;

  return (
    <main className="min-h-screen overflow-hidden bg-[#06111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_35%),linear-gradient(180deg,#06111f_0%,#0b1220_60%,#020617_100%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col px-6 py-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 self-start">
          <img src={voxaLogoDark} alt="Voxa" className="h-12 w-auto" />
        </Link>

        {/* Step dots */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {["info", "password", "plan"].map((s, i) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === stepIndex
                  ? "w-6 bg-[#119c9e]"
                  : i < stepIndex
                  ? "w-2 bg-[#119c9e]/50"
                  : "w-2 bg-white/15"
              }`}
            />
          ))}
        </div>

        {/* Cards */}
        <div className="mt-10 flex flex-1 flex-col justify-center">

          {/* ── Step 1: Personal Info ── */}
          {step === "info" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 flex flex-col gap-1">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-sky-400/70">
                  Step 1 of 3
                </p>
                <h1 className="text-3xl font-bold tracking-tight">
                  Let's get you set up
                </h1>
                <p className="mt-1 text-sm leading-6 text-sky-100/50">
                  Enter your details so we can verify your account.
                </p>
              </div>

              <form onSubmit={handleInfoSubmit} className="flex flex-col gap-5">
                <div className="space-y-2">
                  <Label className="text-[13px] font-bold uppercase tracking-wider text-sky-100/70">
                    Full Name <span className="text-rose-400">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      type="text"
                      placeholder="Jane Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                      className="h-12 rounded-xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/25 focus-visible:ring-[#119c9e]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[13px] font-bold uppercase tracking-wider text-sky-100/70">
                    Phone Number <span className="text-rose-400">*</span>
                  </Label>
                  <div className="flex h-12 items-center rounded-xl border border-white/10 bg-white/5 focus-within:ring-2 focus-within:ring-[#119c9e]">
                    <PhoneCall className="ml-4 mr-2 h-4 w-4 shrink-0 text-white/30" />
                    <span className="pr-3 text-sm font-semibold text-white/70">+61</span>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      placeholder="4xx xxx xxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={loading}
                      className="h-full border-0 bg-transparent px-0 text-white placeholder:text-white/25 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[13px] font-bold uppercase tracking-wider text-sky-100/70">
                    Email Address <span className="text-rose-400">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      type="email"
                      placeholder="jane@raywhite.com.au"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="h-12 rounded-xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/25 focus-visible:ring-[#119c9e]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-12 rounded-xl bg-[#119c9e] text-sm font-semibold text-white hover:bg-[#0e8082]"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                  ) : (
                    <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* ── Step 2: Set Password ── */}
          {step === "password" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 flex flex-col gap-1">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-sky-400/70">
                  Step 2 of 3
                </p>
                <h1 className="text-3xl font-bold tracking-tight">
                  Create your password
                </h1>
                <p className="mt-1 text-sm leading-6 text-sky-100/50">
                  This will be used to log in to your Voxa dashboard.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
                <div className="space-y-2">
                  <Label className="text-[13px] font-bold uppercase tracking-wider text-sky-100/70">
                    Password <span className="text-rose-400">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      type="password"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="h-12 rounded-xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/25 focus-visible:ring-[#119c9e]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[13px] font-bold uppercase tracking-wider text-sky-100/70">
                    Confirm Password <span className="text-rose-400">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <Input
                      type="password"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="h-12 rounded-xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/25 focus-visible:ring-[#119c9e]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("info")}
                    disabled={loading}
                    className="h-12 flex-1 rounded-xl border-white/10 text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 flex-[2] rounded-xl bg-[#119c9e] text-sm font-semibold text-white hover:bg-[#0e8082]"
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting up...</>
                    ) : (
                      <>Set Password <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ── Step 3: Plan & Payment ── */}
          {step === "plan" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 flex flex-col gap-1">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-sky-400/70">
                  Step 3 of 3
                </p>
                <h1 className="text-3xl font-bold tracking-tight">
                  You're almost there!
                </h1>
                <p className="mt-1 text-sm leading-6 text-sky-100/50">
                  Complete your subscription to activate your Voxa account.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#119c9e]">
                  Your plan
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {PLAN_LABELS[subscriptionType ?? ""] ?? subscriptionType ?? "—"}
                </p>
                <p className="mt-1 text-sm text-sky-100/50">
                  You'll be redirected to Stripe to complete payment securely.
                </p>
              </div>

              <Button
                onClick={handleGoToPayment}
                className="mt-6 h-12 w-full rounded-xl bg-[#119c9e] text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(17,156,158,0.5)] hover:bg-[#0e8082]"
              >
                Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="mt-4 text-center text-[11px] text-sky-100/30">
                Payments are processed securely by Stripe. Your card details are never stored on our servers.
              </p>
            </div>
          )}
        </div>

        <p className="mt-10 text-center text-[11px] text-sky-100/25">
          Already set up?{" "}
          <Link to="/login" className="text-[#119c9e] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}