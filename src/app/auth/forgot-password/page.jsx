"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    // Simulate sending code, then navigate to verify page with email as query
    router.push(`/auth/verify-code?email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter the email address associated with your account"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full">Send Code</Button>

        <div className="text-sm text-muted-foreground text-center">
          Remember your password? {" "}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthShell>
  );
};

export default ForgotPasswordPage;