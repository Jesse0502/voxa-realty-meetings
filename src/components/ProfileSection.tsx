import React, { useEffect, useMemo, useState } from "react";
import { Loader2, CreditCard, Calendar, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchBillingProfile,
  updateOverageLimit,
  cancelSubscription,
  payOveragesNow,
} from "@/store/profileSlice";
import { toast } from "sonner";

interface ProfileSectionProps {
  isDark: boolean;
}

export function ProfileSection({ isDark }: ProfileSectionProps) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);
  const assistant = useAppSelector((state) => state.assistant.assistant);
  const status = useAppSelector((state) => state.profile.status);
  const actionStatus = useAppSelector((state) => state.profile.actionStatus);

  const [overageLimitInput, setOverageLimitInput] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBillingProfile());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (profile) {
      setOverageLimitInput((profile.overageLimitCents / 100).toFixed(2));
    }
  }, [profile]);

  const formatMoney = useMemo(() => {
    return (amountInCents: number) => {
      const amount = (amountInCents || 0) / 100;
      try {
        return new Intl.NumberFormat("en-AU", {
          style: "currency",
          currency: "AUD",
        }).format(amount);
      } catch {
        return `A$${amount.toFixed(2)}`;
      }
    };
  }, []);

  const handleSaveLimit = async () => {
    if (!profile) {
      return;
    }

    const parsed = Number(overageLimitInput);
    if (!Number.isFinite(parsed) || parsed < 0) {
      toast.error("Please enter a valid overage limit amount");
      return;
    }

    const newLimitCents = Math.round(parsed * 100);
    if (newLimitCents < profile.overageSpentThisMonthCents) {
      toast.error(
        `Limit cannot be lower than current month spend (${formatMoney(profile.overageSpentThisMonthCents)})`,
      );
      return;
    }

    try {
      const result = await dispatch(
        updateOverageLimit({ overageLimitCents: newLimitCents }),
      ).unwrap();
      toast.success(result.message || "Overage limit updated");
    } catch (error) {
      toast.error(String(error || "Failed to update overage limit"));
    }
  };

  const handleCancelSubscription = async () => {
    const confirmed = window.confirm(
      "Cancel subscription at period end? Your service stays active until the billing period ends.",
    );
    if (!confirmed) {
      return;
    }

    try {
      const result = await dispatch(cancelSubscription()).unwrap();
      toast.success(result.message || "Subscription updated");
    } catch (error) {
      toast.error(String(error || "Failed to cancel subscription"));
    }
  };

  const handlePayOveragesNow = async () => {
    try {
      const result = await dispatch(payOveragesNow()).unwrap();
      toast.success(result.message || "Payment successful");
    } catch (error) {
      toast.error(String(error || "Failed to pay overages"));
    }
  };

  if (status === "loading" && !profile) {
    return (
      <main className="flex-1 p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
    <main className="flex-1 p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Profile and Billing</h1>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}>
              Manage subscription status, overages, and billing controls.
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
          <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Virtual Number</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {assistant?.virtualNumber || "Not configured"}
              </div>
            </CardContent>
          </Card>

          <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Active Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge
                variant={profile?.isSubscriptionActive ? "default" : "secondary"}
                className={
                  profile?.isSubscriptionActive
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : ""
                }
              >
                {(profile?.subscriptionStatus || "inactive").replaceAll("_", " ")}
              </Badge>
              {profile?.cancelAtPeriodEnd && (
                <div className="text-xs text-amber-600 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Cancels at period end
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Next Payment Due
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {profile?.nextPaymentDueDate
                  ? new Date(profile.nextPaymentDueDate).toLocaleDateString()
                  : "Not available"}
              </div>
            </CardContent>
          </Card>

          <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Overage Money Due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatMoney(profile?.overageDueCents || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Accrued this billing cycle
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="text-base">Overage Limit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="overage-limit">Maximum overage amount for current month</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                id="overage-limit"
                type="number"
                step="0.01"
                min="0"
                value={overageLimitInput}
                onChange={(event) => setOverageLimitInput(event.target.value)}
                className="sm:max-w-xs"
              />
              <Button onClick={handleSaveLimit} disabled={actionStatus === "loading"}>
                {actionStatus === "loading" ? "Saving..." : "Save Limit"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Limit cannot be set lower than already spent this month.
            </p>
          </CardContent>
        </Card>

        <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="text-base">Billing Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handlePayOveragesNow}
              disabled={actionStatus === "loading" || !profile?.canPayOveragesNow}
            >
              Pay Overages Now
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={actionStatus === "loading" || !profile?.isSubscriptionActive}
            >
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
