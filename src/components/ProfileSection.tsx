import React, { useEffect, useMemo, useState } from "react";
import { Loader2, CreditCard, Calendar, ShieldAlert, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  updateOverageLimit,
  cancelSubscription,
  payOveragesNow,
} from "@/store/profileSlice";
import { fetchCurrentUser } from "@/store/authSlice";
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
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  // Define plan max limits
  const planMaxLimits: Record<string, number> = {
    earlyAccess: 50,
    basic: 79,
    pro: 149,
    custom: 500,
  };

  const subscriptionType = profile?.subscriptionType || "basic";
  const maxLimit = planMaxLimits[subscriptionType] || planMaxLimits.basic;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBillingProfile());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (profile) {
      const limit = Number(profile.overageLimit || 0);
      setOverageLimitInput(limit > 0 ? limit.toFixed(2) : "");
      // Check if current value is a preset or custom
      const presets = [1, 5, 10, 20, 50, 79, 149];
      setIsCustomAmount(limit > 0 && !presets.includes(limit));
    }
  }, [profile]);

  // Generate preset amounts based on plan max
  const getPresetAmounts = () => {
    const presets = [1, 5, 10, 20];
    // Add plan-specific amounts up to max
    if (maxLimit >= 50) presets.push(50);
    if (maxLimit >= 79) presets.push(79);
    if (maxLimit >= 149) presets.push(149);
    // Add max limit if not already included
    if (!presets.includes(maxLimit)) {
      presets.push(maxLimit);
    }
    return presets.filter(p => p <= maxLimit);
  };

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

    const newLimitDollars = parsed;
    if (newLimitDollars * 100 < profile.overageSpentThisMonthCents) {
      toast.error(
        `Limit cannot be lower than current month spend (${formatMoney(profile.overageSpentThisMonthCents)})`,
      );
      return;
    }

    try {
      const result = await dispatch(
        updateOverageLimit({ overageLimit: newLimitDollars }),
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
      dispatch(fetchCurrentUser());
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
              <CardTitle className="text-sm font-medium">
                Virtual Number
              </CardTitle>
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
                variant={
                  profile?.isSubscriptionActive ? "default" : "secondary"
                }
                className={
                  profile?.isSubscriptionActive
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : ""
                }
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
                  ? `${new Date(profile.nextPaymentDueDate).getDate()}/${new Date(profile.nextPaymentDueDate).getMonth() + 1}/${new Date(profile.nextPaymentDueDate).getFullYear()}`
                  : "Not available"}
              </div>
            </CardContent>
          </Card>

          <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Overage Money Due
              </CardTitle>
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
            <Label htmlFor="overage-limit">
              Maximum overage amount for current month
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 sm:max-w-xs">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={isCustomAmount ? "custom" : overageLimitInput}
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setIsCustomAmount(true);
                      setOverageLimitInput("");
                    } else {
                      setIsCustomAmount(false);
                      setOverageLimitInput(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select amount" />
                  </SelectTrigger>
                  <SelectContent>
                    {getPresetAmounts().map((amount) => (
                      <SelectItem key={amount} value={amount.toString()}>
                        ${amount}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom amount...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isCustomAmount && (
                <Input
                  id="overage-limit"
                  type="number"
                  step="0.01"
                  min="0"
                  max={maxLimit}
                  placeholder={`Max $${maxLimit}`}
                  value={overageLimitInput}
                  onChange={(event) => setOverageLimitInput(event.target.value)}
                  className="sm:max-w-xs"
                />
              )}
              <Button
                onClick={handleSaveLimit}
                disabled={actionStatus === "loading"}
              >
                {actionStatus === "loading" ? "Saving..." : "Save Limit"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Limit cannot be set lower than already spent this month. Maximum for your plan: ${maxLimit}.
            </p>
          </CardContent>
        </Card>

        <Card className={isDark ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className="text-base">Billing Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            {profile?.canPayOveragesNow && (
              <Button
                variant="outline"
                onClick={handlePayOveragesNow}
                disabled={actionStatus === "loading"}
              >
                Pay Overages Now
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={
                actionStatus === "loading" ||
                !profile?.isSubscriptionActive ||
                profile?.canPayOveragesNow
              }
              title={
                profile?.canPayOveragesNow
                  ? "Please pay outstanding overages before cancelling"
                  : undefined
              }
            >
              Cancel Subscription
            </Button>
            {profile?.canPayOveragesNow && (
              <p className="text-xs text-muted-foreground self-center">
                Outstanding overages must be paid before cancelling.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
