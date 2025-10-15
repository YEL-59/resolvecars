"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShieldCheck, CheckCircle, UserCheck, X } from "lucide-react";

const AuthShell = ({ title, subtitle, children, showClose = true }) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/auth-bg.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Shell */}
      <div className="relative z-10 w-full max-w-6xl backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left visuals */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Image
                src="/assets/logo.png"
                alt="Resolvecars"
                width={160}
                height={48}
                className="h-10 w-auto"
              />
            </div>

            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
              <Image
                src="/assets/signin.png"
                alt="Showcase car"
                width={800}
                height={450}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 py-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-gray-700">Secure & Safe</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 py-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-gray-700">Verified Rentals</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 py-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                  <UserCheck className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-gray-700">Personal Service</span>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div>
            <Card className="bg-white/95 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    {title && (
                      <CardTitle className="text-xl md:text-2xl font-bold text-foreground">
                        {title}
                      </CardTitle>
                    )}
                    {subtitle && (
                      <CardDescription className="text-muted-foreground">
                        {subtitle}
                      </CardDescription>
                    )}
                  </div>
                  {showClose && (
                    <Link href="/" aria-label="Close" className="p-1 rounded hover:bg-muted">
                      <X className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>{children}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;