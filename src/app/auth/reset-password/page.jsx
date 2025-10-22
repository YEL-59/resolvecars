import { Suspense } from "react";
import ResetPasswordClient from "@/components/auth/ResetPasswordClient";

export default function ResetPasswordPage({ searchParams }) {
  const emailParam = typeof searchParams?.email === "string" ? searchParams.email : undefined;
  const email = emailParam ?? "your@email.com";

  return (
    <Suspense fallback={<div />}> 
      <ResetPasswordClient email={email} />
    </Suspense>
  );
}