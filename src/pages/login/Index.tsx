import { useState, useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, CalendarDays, CheckCircle2 } from "lucide-react";
import voxaLogoDark from "@/assets/voxa-logo-dark.png";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { clearAuthError, login } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function LoginRegister() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  const { error: authError, status } = useAppSelector((state) => state.auth);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const [bookingOpen, setBookingOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleBookingOpenChange = (open: boolean) => {
    setBookingOpen(open);
    if (!open) {
      setFormSubmitted(false);
      setFormLoading(false);
    }
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
          source: "login_page",
          _subject: "New Voxa booking request",
        }),
      });
      if (!response.ok) throw new Error(`Formspree request failed: ${response.status}`);
      setFormSubmitted(true);
      toast.success("Booking request received. We will email available times shortly.");
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

  const loading = status === "loading";
  const error = validationError || authError || "";

  const clearErrors = () => {
    setValidationError("");
    if (authError) {
      dispatch(clearAuthError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!phoneNumber || !password) {
      setValidationError("Please fill in all fields");
      return;
    }

    try {
      await dispatch(login({ phoneNumber, password })).unwrap();
      navigate("/dashboard");
    } catch {
      // Redux state already captures request failures for display.
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 pt-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(17,156,158,0.12),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(17,156,158,0.06),transparent_35%)]" />

      <div className="absolute top-6 left-6">
        <Link to="/">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md border-border/60 shadow-2xl bg-card/90 backdrop-blur-sm p-6 sm:p-8">
        <div className="space-y-2 text-center pb-6">
          <div className="mx-auto mb-6">
            <img src={voxaLogoDark} alt="Voxa Realty" className="h-16 w-auto mx-auto" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back
          </h1>
          <p className="text-base text-muted-foreground">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="py-2.5 animate-in fade-in slide-in-from-top-1">
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center rounded-l-md border-r border-border/50 bg-muted/50 px-3.5 text-sm font-medium text-muted-foreground">
                +61
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="(444) 000-0000"
                value={phoneNumber}
                onChange={(e) => { clearErrors(); setPhoneNumber(e.target.value); }}
                disabled={loading}
                className="h-12 bg-background/60 pl-[3.75rem]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { clearErrors(); setPassword(e.target.value); }}
              disabled={loading}
              className="h-12 bg-background/60"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base font-semibold mt-4 shadow-sm" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in to Dashboard"
            )}
          </Button>
        </form>

        <div className="mt-8 border-t border-border/40 pt-8 text-center space-y-3">
          <p className="text-sm text-muted-foreground">Not a customer yet?</p>
          <Button
            variant="outline"
            className="w-full h-11 gap-2 border-[#119c9e]/40 text-[#3ecfcf] hover:bg-[#119c9e]/10 hover:border-[#119c9e]/60 hover:text-[#3ecfcf]"
            onClick={() => setBookingOpen(true)}
          >
            <CalendarDays className="h-4 w-4" />
            Book a call — Try Voxa Realty
          </Button>
        </div>
      </Card>

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
                  <Label htmlFor="booking-name" className="text-[13px] font-bold uppercase tracking-wider text-sky-100/80">
                    Name <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="booking-name"
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
                  <Label htmlFor="booking-phone" className="text-[13px] font-bold uppercase tracking-wider text-sky-100/80">
                    Phone <span className="text-rose-400">*</span>
                  </Label>
                  <div className="flex h-12 items-center rounded-xl border border-white/10 bg-white/5 focus-within:ring-2 focus-within:ring-[#119c9e]">
                    <span className="pl-4 pr-3 text-sm font-semibold text-white/85">+61</span>
                    <Input
                      id="booking-phone"
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
                  <Label htmlFor="booking-email" className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-sky-100/80">
                    Agency / Suburb
                    <span className="text-[10px] font-medium tracking-[0.14em] text-sky-100/40">optional</span>
                  </Label>
                  <Input
                    id="booking-email"
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
    </div>
  );
}
