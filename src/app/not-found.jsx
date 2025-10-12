"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <Image
          src="/assets/404.svg"
          alt="404 Illustration"
          width={400}
          height={300}
          className="mx-auto"
          priority
        />
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Page Not Found
        </h1>
        
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
          
          <Button
            size="lg"
            onClick={() => router.push("/")}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}