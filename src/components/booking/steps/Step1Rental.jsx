"use client";

import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Bookmark,
} from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";

export default function Step1Rental({ onNext }) {
  const form = useFormContext();

  useEffect(() => {
    const existing = bookingStorage.getStep("step1");
    if (existing) {
      form.reset({ ...form.getValues(), ...existing });
    }
    // run only once on mount to avoid update loops if form identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get selected protection plan details
  const selectedProtectionPlan = useMemo(() => {
    const planId = form.watch("protectionPlan") || "basic";
    const plans = {
      basic: {
        id: "basic",
        name: "Basic Protection",
        dailyPrice: 0,
        description: "Perfect for budget-conscious travelers who need reliable transportation.",
        features: [
          "Basic insurance",
          "Standard vehicle maintenance",
          "24/7 emergency support",
        ],
      },
      standard: {
        id: "standard",
        name: "Standard Protection",
        dailyPrice: 19,
        description: "Enhanced protection with reduced liability and comprehensive coverage.",
        features: [
          "Collision Damage Waiver (CDW)",
          "Theft Protection (TP)",
          "Third Party Liability up to $1M",
          "Reduced excess to $500",
          "Personal Accident Insurance",
        ],
      },
      premium: {
        id: "premium",
        name: "Premium Protection",
        dailyPrice: 39,
        description: "Maximum protection with zero excess and comprehensive coverage.",
        features: [
          "Full Collision Damage Waiver",
          "Complete Theft Protection",
          "Third Party Liability up to $5M",
          "Zero excess - no deductible",
          "Personal Effects Coverage",
          "Emergency Medical Coverage",
        ],
      },
    };
    return plans[planId] || plans.basic;
  }, [form.watch("protectionPlan")]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => onNext())} className="space-y-8">
        {/* Selected Protection Plan (Read-only display) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            Selected Protection Plan
          </h3>
          <div className={`rounded-xl border-2 p-5 ${selectedProtectionPlan.id === "basic"
            ? "bg-rose-50/60 border-rose-200"
            : selectedProtectionPlan.id === "standard"
              ? "bg-amber-50/60 border-amber-200"
              : "bg-emerald-50/60 border-emerald-200"
            }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-lg font-semibold">{selectedProtectionPlan.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedProtectionPlan.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">
                  {selectedProtectionPlan.dailyPrice === 0 ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded">Included</span>
                  ) : (
                    `$${selectedProtectionPlan.dailyPrice}/day`
                  )}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Coverage includes:</p>
              <ul className="space-y-2 text-sm">
                {selectedProtectionPlan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-slate-700">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Extras Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
            <Bookmark className="w-5 h-5 text-rose-600" />
            Premium Add-ons & Extras
          </h3>
          <p className="text-sm text-gray-600">Select any additional services you need for your rental.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "additionalDriver", name: "Additional Drivers", desc: "$15/day per driver", pricingType: "per_day", bg: "bg-rose-50 border-rose-100" },
              { id: "childSeat", name: "Child Safety Seats", desc: "$10/day per seat", pricingType: "per_day", bg: "bg-amber-50 border-amber-100" },
              { id: "gps", name: "GPS Navigation", desc: "$5/day - Premium GPS device", pricingType: "per_day", bg: "bg-amber-50 border-amber-100" },
              { id: "wifi", name: "Wi‑Fi Hotspot", desc: "$7/day - Portable Wi‑Fi router", pricingType: "per_day", bg: "bg-amber-50 border-amber-100" },
              { id: "roadside", name: "24/7 Roadside Assistance", desc: "$8/day - Towing, flat tire, emergency services", pricingType: "per_day", bg: "bg-blue-50 border-blue-100" },
              { id: "youngDriver", name: "Young Driver (Under 25)", desc: "$25/booking - Additional fee for drivers under 25", pricingType: "per_booking", bg: "bg-purple-50 border-purple-100" },
            ].map((extra) => {
              const current = form.getValues("extras") || [];
              const checked = current.includes(extra.id);
              return (
                <div key={extra.id} className={`${extra.bg} border rounded-xl p-5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-slate-900 mb-1">{extra.name}</h4>
                      <p className="text-sm text-slate-600">{extra.desc}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {extra.pricingType === "per_day" ? "Charged per day" : "One-time fee"}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => {
                          const list = form.getValues("extras") || [];
                          const updated = checked
                            ? list.filter((e) => e !== extra.id)
                            : [...list, extra.id];
                          form.setValue("extras", updated, { shouldDirty: true });
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white"
          >
            Continue to Customer Details
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
