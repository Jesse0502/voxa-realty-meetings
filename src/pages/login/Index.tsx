import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { clearAuthError, login, register } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function LoginRegister() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error: authError, status } = useAppSelector((state) => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

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
      if (!isLogin && password !== confirmPassword) {
        setValidationError("Passwords do not match");
        return;
      }

      const authAction = isLogin ? login : register;
      await dispatch(
        authAction({
          phoneNumber,
          password,
        }),
      ).unwrap();
      navigate("/dashboard");
    } catch {
      // Redux state already captures request failures for display.
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 pt-20">
      <div className="bg-grid-soft absolute inset-0 -z-20 opacity-30" />
      <div className="absolute left-0 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
      
      <div className="absolute top-6 left-6">
        <Link to="/">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md border-border/60 shadow-xl bg-background/80 backdrop-blur-sm p-6 sm:p-8">
        <div className="space-y-2 text-center pb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 relative">
            <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/20" />
            <PhoneCall className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-base text-muted-foreground">
            {isLogin 
              ? "Enter your credentials to access your dashboard"
              : "Sign up to start automating your calls"}
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
                placeholder="(555) 000-0000"
                value={phoneNumber}
                onChange={(e) => {
                  clearErrors();
                  setPhoneNumber(e.target.value);
                }}
                disabled={loading}
                className="h-12 bg-white/50 pl-[3.75rem]"
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
              onChange={(e) => {
                clearErrors();
                setPassword(e.target.value);
              }}
              disabled={loading}
              className="h-12 bg-white/50"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  clearErrors();
                  setConfirmPassword(e.target.value);
                }}
                disabled={loading}
                className="h-12 bg-white/50"
              />
            </div>
          )}

          <Button type="submit" className="w-full h-12 text-base font-semibold mt-4 shadow-sm" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isLogin ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              isLogin ? "Sign in to Dashboard" : "Get Started Now"
            )}
          </Button>
        </form>
        
        <div className="mt-8 flex justify-center border-t border-border/40 pt-8">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="font-semibold text-primary hover:text-primary/90 hover:underline underline-offset-4"
              onClick={() => {
                clearErrors();
                setIsLogin(!isLogin);
                setPassword("");
                setConfirmPassword("");
              }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
