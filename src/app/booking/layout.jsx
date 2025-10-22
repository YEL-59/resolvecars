"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, User, CreditCard, CheckCircle, Car, Star, Heart, Share2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { bookingStorage } from "@/lib/bookingStorage";
import { Button } from "@/components/ui/button";

const steps = [
  { id: 1, name: "Rental Details", path: "/booking/step1", icon: Car },
  { id: 2, name: "Customer Info", path: "/booking/step2", icon: User },
  { id: 3, name: "Payment", path: "/booking/step3", icon: CreditCard },
  { id: 4, name: "Review & Book", path: "/booking/step4", icon: CheckCircle },
];

export default function BookingLayout({ children }) {
  const pathname = usePathname();
  const all = bookingStorage.getData() || {};
  const car = bookingStorage.getCar();
  const plan = all?.step1?.protectionPlan;
  const premiumSelected = plan === "premium";

  const getCurrentStep = () => {
    if (pathname.includes("step1")) return 1;
    if (pathname.includes("step2")) return 2;
    if (pathname.includes("step3")) return 3;
    if (pathname.includes("step4")) return 4;
    if (pathname.includes("success")) return 5;
    return 1;
  };

  const currentStep = getCurrentStep();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Layout>
      {" "}
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/cars"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Cars
              </Link>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
              {premiumSelected && (
                <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 text-xs px-2 py-1">
                  Premium
                </span>
              )}
            </div>

            {/* Car info (if available) */}
            {(car?.name || car?.model || car?.rating) && (
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                {(car?.name || car?.model) && (
                  <span className="inline-flex items-center gap-1">
                    <Car className="h-4 w-4 text-rose-500" />
                    {car?.name || car?.model}
                  </span>
                )}
                {car?.rating && (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 text-rose-500" />
                    {car?.rating}
                  </span>
                )}
              </div>
            )}

            {/* Stepper */}
            <div className="mt-6">
              <div className="flex items-center w-full">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCurrent = currentStep === step.id;
                  const isDone = currentStep > step.id;
                  const isNext = currentStep + 1 === step.id;

                  const circle = isCurrent
                    ? "bg-rose-500 text-white ring-2 ring-rose-200"
                    : isDone
                    ? "bg-rose-200 text-rose-700"
                    : isNext
                    ? "bg-white text-rose-500 border border-rose-200"
                    : "bg-white text-gray-600 border border-gray-300";

                  const label = isCurrent ? "text-rose-600" : "text-gray-700";

                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${circle}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className={`mt-2 text-sm ${label}`}>{step.name}</p>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`h-[2px] mx-6 flex-1 bg-gradient-to-r ${
                            isDone
                              ? "from-rose-300 to-rose-100"
                              : isCurrent
                              ? "from-rose-500 to-rose-100"
                              : "from-gray-200 to-gray-100"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
      </div>
    </Layout>
  );
}
