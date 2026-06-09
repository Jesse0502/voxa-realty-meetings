import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2, CreditCard, Calendar, ShieldAlert, Clock, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchBillingProfile,
  createCreditsCheckout,
  cancelSubscription,
} from "@/store/profileSlice";
import { fetchCurrentUser } from "@/store/authSlice";
import { toast } from "sonner";

const PRESET_MINS = [100, 200, 300, 400, 500, 1000];

const PLAN_LINKS: Record<string, string> = {
  basic: import.meta.env.VITE_BASIC_PAYMENT_LINK ?? "",
  pro: import.meta.env.VITE_PRO_PAYMENT_LINK ?? "",
};

const PLAN_DETAILS: Record<string, { label: string; price: string; mins: string; description: string }> = {
  basic: {
    label: "Basic",
    price: "A$79/mo",
    mins: "180 mins",
    description: "180 call minutes + 100 SMS per month",
  },
  pro: {
    label: "Pro",
    price: "A$149/mo",
    mins: "360 mins",
    description: "360 call minutes + 185 SMS per month",
  },
};

const PLAN_TIER: Record<string, number> = { earlyAccess: 0, basic: 1, pro: 2 };

interface ProfileSectionProps {
  isDark: boolean;
}

export function ProfileSection({ isDark }: ProfileSectionProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const profile = useAppSelector((state) => state.profile.profile);
  const assistant = useAppSelector((state) => state.assistant.assistant);
  const status = useAppSelector((state) => state.profile.status);
  const actionStatus = useAppSelector((state) => state.profile.actionStatus);

  const [selectedMins, setSelectedMins] = useState<string>("100");
  const [customMins, setCustomMins] = useState<string>("");
  const creditSuccessShown = useRef(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBillingProfile());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (!creditSuccessShown.current && location.search.includes("credits=success")) {
      creditSuccessShown.current = true;
      toast.success("Credits added successfully! Your minutes have been topped up.");
      dispatch(fetchBillingProfile());
    }
  }, [location.search, dispatch]);

  const costPerMin = profile?.overageCostPerMin ?? null;
  const minsValue = selectedMins === "custom"
    ? parseInt(customMins || "0", 10)
    : parseInt(selectedMins, 10);
  const estimatedCost = minsValue > 0 && costPerMin !== null ? (minsValue * costPerMin).toFixed(2) : null;

  const remainingMins = profile?.remainingMins ?? assistant?.remainingMins ?? null;
  const minsColour =
    remainingMins === null
      ? ""
      : remainingMins > 20
      ? "text-emerald-600"
      : remainingMins > 0
      ? "text-amber-500"
      : "text-red-500";

  const handleAddCredits = async () => {
    if (!minsValue || minsValue <= 0) {
      toast.error("Please select or enter a valid number of minutes.");
      return;
    }
    try {
      const result = await dispatch(createCreditsCheckout({ mins_to_add: minsValue })).unwrap();
      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      }
    } catch (error) {
      toast.error(String(error || "Failed to start checkout"));
    }
  };

  const handleCancelSubscription = async () => {
    const confirmed = window.confirm(
      "Cancel subscription at period end? Your service stays active until the billing period ends.",
    );
    if (!confirmed) return;
    try {
      const result = await dispatch(cancelSubscription()).unwrap();
      toast.success(result.message || "Subscription updated");
      dispatch(fetchCurrentUser());
    } catch (error) {
      toast.error(String(error || "Failed to cancel subscription"));
    }
  };

  if (status === "loading" && !profile) {
    return (
      <main className="flex-1 p-4 md:p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="mx-auto w-full max-w-4xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading subscription profile...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Profile and Billing
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your subscription and call minute credits.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => dispatch(fetchBillingProfile())}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className={""}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Virtual Number</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {assistant?.virtualNumber || "Not configured"}
              </div>
            </CardContent>
          </Card>

          <Card className={""}>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Active Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge
                variant={profile?.isSubscriptionActive ? "default" : "secondary"}
                className={profile?.isSubscriptionActive ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                {profile?.isSubscriptionActive
                  ? (profile?.subscriptionStatus || "active").replace(/_/g, " ")
                  : "inactive"}
              </Badge>
              {profile?.cancelAtPeriodEnd && (
                <div className="text-xs text-amber-600 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Cancels at period end
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={""}>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Next Payment Due
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {profile?.nextPaymentDueDate
                  ? `${new Date(profile.nextPaymentDueDate).getDate()}/${new Date(profile.nextPaymentDueDate).getMonth() + 1}/${new Date(profile.nextPaymentDueDate).getFullYear()}`
                  : "Not available"}
              </div>
            </CardContent>
          </Card>

          <Card className={""}>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Minutes Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${minsColour}`}>
                {remainingMins !== null ? `${remainingMins} min` : "—"}
              </div>
              {remainingMins !== null && remainingMins <= 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Credits exhausted — add more below to keep your assistant active.
                </p>
              )}
              {remainingMins !== null && remainingMins > 0 && remainingMins <= 20 && (
                <p className="text-xs text-amber-500 mt-1">Running low — consider topping up.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Credits */}
        <Card className={""}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Credits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Purchase additional call minutes{costPerMin !== null ? <> at <strong>A${costPerMin.toFixed(2)}/min</strong></> : ""}.
              Minutes are added to your account immediately after payment.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div className="w-full sm:w-52 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Minutes to add
                </label>
                <Select value={selectedMins} onValueChange={(v) => { setSelectedMins(v); if (v !== "custom") setCustomMins(""); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select minutes" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESET_MINS.map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        {m} mins{costPerMin !== null ? ` — A$${(m * costPerMin).toFixed(2)}` : ""}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom amount…</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedMins === "custom" && (
                <div className="w-full sm:w-40 space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Enter minutes
                  </label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g. 150"
                    value={customMins}
                    onChange={(e) => setCustomMins(e.target.value)}
                  />
                </div>
              )}

              <Button
                onClick={handleAddCredits}
                disabled={actionStatus === "loading" || !minsValue || minsValue <= 0}
                className="h-10 shrink-0"
              >
                {actionStatus === "loading" ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>
                ) : (
                  <>Add Credits {estimatedCost ? `— A$${estimatedCost}` : ""}</>
                )}
              </Button>
            </div>

            {estimatedCost && (
              <p className="text-xs text-muted-foreground">
                {minsValue} minutes for <strong>A${estimatedCost}</strong> — one-time payment via Stripe.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upgrade Plan */}
        {(() => {
          const currentTier = PLAN_TIER[profile?.subscriptionType ?? ""] ?? -1;
          const upgrades = Object.entries(PLAN_DETAILS).filter(
            ([key]) => PLAN_TIER[key] > currentTier,
          );
          const isOnPro = profile?.subscriptionType === "pro";

          return (
            <Card className={""}>
              <CardHeader>
                <CardTitle className="text-base">Upgrade Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.subscriptionType && (
                  <p className="text-sm text-muted-foreground">
                    Current plan:{" "}
                    <Badge variant="outline" className="ml-1 capitalize">
                      {profile.subscriptionType === "earlyAccess" ? "Early Access" : profile.subscriptionType}
                    </Badge>
                  </p>
                )}

                {upgrades.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {upgrades.map(([key, plan]) => (
                      <div
                        key={key}
                        className="rounded-lg border border-border bg-muted/40 p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{plan.label}</span>
                          <span className="text-sm font-medium text-[#119c9e]">{plan.price}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {plan.description}
                        </p>
                        <Button
                          size="sm"
                          className="w-full bg-[#119c9e] hover:bg-[#0e8082] text-white"
                          onClick={() => {
                            if (PLAN_LINKS[key]) window.location.href = PLAN_LINKS[key];
                          }}
                          disabled={!PLAN_LINKS[key]}
                        >
                          Upgrade to {plan.label}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className="rounded-lg border border-border bg-muted/40 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Custom</span>
                    <span className="text-sm font-medium text-[#119c9e]">Tailored</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isOnPro
                      ? "You're on our top plan. Contact us to discuss a custom enterprise solution."
                      : "Need something specific? We'll build a plan around your requirements."}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open("mailto:mail@voxarealty.com", "_blank")}
                  >
                    Contact mail@voxarealty.com
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Billing Actions */}
        <Card className={""}>
          <CardHeader>
            <CardTitle className="text-base">Billing Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={actionStatus === "loading" || !profile?.isSubscriptionActive}
            >
              Cancel Subscription
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Your service stays active until the end of the current billing period.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
