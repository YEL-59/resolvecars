"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { bookingStorage } from "@/lib/bookingStorage";
import { ShieldCheck, ShieldQuestion, ShieldAlert } from "lucide-react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

const plans = [
  { id: "basic", name: "Basic Protection", icon: ShieldQuestion, perDay: 0, color: "border-gray-300" },
  { id: "standard", name: "Standard Protection", icon: ShieldCheck, perDay: 19, color: "border-blue-300" },
  { id: "premium", name: "Premium Protection", icon: ShieldAlert, perDay: 39, color: "border-rose-300" },
];

export default function PricingPlans() {
  const router = useRouter();
  const { days } = useMemo(() => {
    const step1 = bookingStorage.getStep("step1") || {};
    const start = step1?.pickupDate ? new Date(step1.pickupDate) : null;
    const end = step1?.dropoffDate ? new Date(step1.dropoffDate) : null;
    let d = 1;
    if (start && end) {
      const diff = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
      d = diff || 1;
    }
    return { days: d };
  }, []);

  const selectPlan = (planId) => {
    const current = bookingStorage.getData() || {};
    bookingStorage.updateStep("step1", {
      ...(current.step1 || {}),
      protectionPlan: planId,
    });
    router.push("/booking/step1");
  };

  return (
    <section className="container mx-auto mt-8">
      <div className="rounded-xl border bg-white p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Choose Your Protection</h2>
          <p className="text-sm text-gray-600">Total shown for {days} day(s)</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => {
            const Icon = p.icon;
            const total = p.perDay * days;
            return (
              <Card key={p.id} className={`border ${p.color} shadow-none hover:shadow transition`}> 
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <CardTitle className="text-base">{p.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">${total}</p>
                      <p className="text-xs text-gray-500">${p.perDay}/day × {days}</p>
                    </div>
                    <Button onClick={() => selectPlan(p.id)} className="bg-primary hover:bg-primary/90 text-white">
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}