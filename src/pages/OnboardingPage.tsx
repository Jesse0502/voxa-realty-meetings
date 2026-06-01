import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const nextStep = () => {
    if (step === 1 && !formData.name.trim()) return toast({ title: "Name required", variant: "destructive" });
    if (step === 2 && !formData.email.trim()) return toast({ title: "Email required", variant: "destructive" });
    if (step === 3 && !formData.phone.trim()) return toast({ title: "Phone required", variant: "destructive" });
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password.trim()) return toast({ title: "Password required", variant: "destructive" });

    setLoading(true);
    try {
      const resp = await fetch(`${SERVER_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone,
          password: formData.password
        })
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.detail || 'Registration failed');

      if (data.setup_link) {
        window.location.href = data.setup_link;
      } else {
        toast({ title: "Success, but no payment link returned." });
      }

    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Voxa</CardTitle>
          <CardDescription>Let's get your account set up (Step {step} of 4)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            <div className="space-y-4">
              {step === 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">What's your name?</label>
                  <Input 
                    name="name" 
                    placeholder="John Doe" 
                    value={formData.name} 
                    onChange={handleChange} 
                    autoFocus 
                  />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">What's your email?</label>
                  <Input 
                    name="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email} 
                    onChange={handleChange} 
                    autoFocus 
                  />
                </div>
              )}
              {step === 3 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Enter your phone number</label>
                  <Input 
                    name="phone" 
                    type="tel" 
                    placeholder="+1234567890" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    autoFocus 
                  />
                </div>
              )}
              {step === 4 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Set a password</label>
                  <Input 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password} 
                    onChange={handleChange} 
                    autoFocus 
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep} disabled={loading} className="min-h-[44px] px-6">
                  Back
                </Button>
              ) : <div></div>}
              
              <Button type="submit" disabled={loading} className="min-h-[44px] px-6">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {step === 4 ? "Pay Setup Fee" : "Next"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}