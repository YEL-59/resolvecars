"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const OTP_LENGTH = 6;

const VerifyCodePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "your@email.com", [searchParams]);

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef([]);
  const [remaining, setRemaining] = useState(60);
  const code = digits.join("");

  useEffect(() => {
    const timer = setInterval(() => setRemaining((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const onChange = (idx, val) => {
    const v = val.replace(/\D/g, "").slice(0, 1);
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
    if (v && idx < OTP_LENGTH - 1) inputsRef.current[idx + 1]?.focus();
  };

  const onKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) inputsRef.current[idx + 1]?.focus();
  };

  const onPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH)
      .fill("")
      .map((_, i) => pasted[i] || "");
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  const resend = () => {
    if (remaining === 0) setRemaining(60);
  };

  const verify = (e) => {
    e.preventDefault();
    if (code.length === OTP_LENGTH) {
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    }
  };

  const formattedTime = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;

  return (
    <AuthShell
      title="Password reset"
      subtitle={`Enter the ${OTP_LENGTH}-digit code we sent to ${email}`}
    >
      <form className="space-y-6" onSubmit={verify}>
        <div className="flex items-center justify-center gap-3" onPaste={onPaste}>
          {digits.map((d, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={d}
              onChange={(e) => onChange(idx, e.target.value)}
              onKeyDown={(e) => onKeyDown(idx, e)}
              className="w-12 h-12 rounded-md border border-gray-300 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Digit ${idx + 1}`}
            />
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground space-y-1">
          <div>
            Didn&apos;t receive a code? {" "}
            <button
              type="button"
              onClick={resend}
              disabled={remaining > 0}
              className={remaining > 0 ? "cursor-not-allowed text-gray-400" : "text-primary hover:underline"}
            >
              Resend
            </button>
          </div>
          <div className="font-medium">{formattedTime} min</div>
        </div>

        <Button type="submit" className="w-full" disabled={code.length !== OTP_LENGTH}>
          Verify
        </Button>

        <div className="text-sm text-muted-foreground text-center">
          Wrong email? {" "}
          <Link href="/auth/forgot-password" className="text-primary hover:underline">
            Change
          </Link>
        </div>
      </form>
    </AuthShell>
  );
};

export default VerifyCodePage;