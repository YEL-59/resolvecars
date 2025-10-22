import { Suspense } from "react";
import VerifyCodeClient from "@/components/auth/VerifyCodeClient";

export default function VerifyCodePage({ searchParams }) {
  const emailParam = typeof searchParams?.email === "string" ? searchParams.email : undefined;
  const email = emailParam ?? "your@email.com";

  return (
    <Suspense fallback={<div />}> 
      <VerifyCodeClient email={email} />
    </Suspense>
  );
}