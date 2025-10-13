"use client";

import { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Info,
  LocateIcon,
  MapPin,
  Calendar,
  Bookmark,
} from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";

const locations = [
  "Airport Terminal 1",
  "Airport Terminal 2",
  "Downtown Office",
  "City Center",
  "Hotel District",
  "Train Station",
  "Port Area",
];

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

  const getTomorrowDate = () => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().split("T")[0];
  };

  const getMinDropoffDate = () => {
    const pickupDate = form.watch("pickupDate");
    if (pickupDate) {
      const d = new Date(pickupDate);
      d.setDate(d.getDate() + 1);
      return d.toISOString().split("T")[0];
    }
    return getTomorrowDate();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => onNext())} className="space-y-8">
        <div className="rounded-xl bg-white p-6 space-y-6">
          {/* --- Pickup & Drop-off --- */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-primary flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Pick-up & Drop-off Locations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Location */}
              <FormField
                control={form.control}
                name="pickupLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Location</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-rose-50 border border-rose-100 focus:ring-rose-200">
                          <SelectValue placeholder="Select pickup location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dropoff Location */}
              <FormField
                control={form.control}
                name="dropoffLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dropoff Location</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-rose-50 border border-rose-100 focus:ring-rose-200">
                          <SelectValue placeholder="Select dropoff location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* --- Rental Period --- */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-primary flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Rental Period
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Date */}
              <FormField
                control={form.control}
                name="pickupDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={getTomorrowDate()}
                        className="bg-rose-50 border border-rose-100 focus-visible:ring-rose-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dropoff Date */}
              <FormField
                control={form.control}
                name="dropoffDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dropoff Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={getMinDropoffDate()}
                        className="bg-rose-50 border border-rose-100 focus-visible:ring-rose-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Time */}
              <FormField
                control={form.control}
                name="pickupTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        className="bg-rose-50 border border-rose-100 focus-visible:ring-rose-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dropoff Time */}
              <FormField
                control={form.control}
                name="dropoffTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dropoff Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        className="bg-rose-50 border border-rose-100 focus-visible:ring-rose-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            Protection Plan
          </h3>
          <div className="grid grid-cols-1  gap-6">
            {[
              { id: "basic", name: "Basic Rate", price: 0, badge: "Included" },
              { id: "standard", name: "Standard Protection", price: 19 },
              { id: "premium", name: "Premium Protection", price: 39 },
            ].map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl border p-5 hover:shadow-sm transition ${
                  plan.id === "basic"
                    ? "bg-rose-50/60 border-rose-200"
                    : plan.id === "standard"
                    ? "bg-amber-50/60 border-amber-200"
                    : "bg-emerald-50/60 border-emerald-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="protectionPlan"
                      value={plan.id}
                      checked={
                        (form.getValues("protectionPlan") || "basic") ===
                        plan.id
                      }
                      onChange={() =>
                        form.setValue("protectionPlan", plan.id, {
                          shouldDirty: true,
                        })
                      }
                    />
                    <span className="text-sm font-semibold">{plan.name}</span>
                  </div>
                  {plan.badge && (
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-700 mb-3">
                  ${plan.price}/day
                </p>
                <h1>Coverage includes:</h1>
                <ul className="space-y-2 text-sm">
                  {[
                    "Coverage included",
                    "Roadside assistance",
                    "Liability protection",
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-slate-700">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
            <Bookmark className="w-5 h-5 text-rose-600" />
            Premium Add-ons & Extras
          </h3>
          {/* here i want gridcol-2 typed layout */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    Additional Drivers
                  </h4>
                  <p className="text-sm text-slate-700">$ 15 /day per driver</p>
                </div>
                <div>
                  <Checkbox />
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    Child Safety Seats
                  </h4>
                  <p className="text-sm text-slate-700">$ 10 /day per seat</p>
                </div>
                <div>
                  <Checkbox />
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    GPS Navigation
                  </h4>
                  <p className="text-sm text-slate-700">
                    Premium GPS device - $ 5 /day
                  </p>
                </div>
                <div>
                  <Checkbox />
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    Full Insurance Coverage
                  </h4>
                  <p className="text-sm text-slate-700">
                    Zero deductible protection - $ 20 /day
                  </p>
                </div>
                <div>
                  <Checkbox />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  24/7 Roadside Assistance
                </h4>
                <p className="text-sm text-slate-700">
                  Premium support service including towing, flat tire
                  assistance, and emergency services - $ 8 /day
                </p>
              </div>
              <div>
                <Checkbox />
              </div>
            </div>
          </div>

          {/* {[
            { id: "gps", name: "GPS Navigation", price: 8 },
            { id: "childSeat", name: "Child Seat", price: 6 },
            { id: "additionalDriver", name: "Additional Driver", price: 12 },
            { id: "wifi", name: "Wi-Fi Hotspot", price: 7 },
          ].map((extra) => {
            const current = form.getValues("extras") || [];
            const checked = current.includes(extra.id);
            return (
              <div
                key={extra.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-rose-50/40"
              >
                <div className="flex items-center gap-3">
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
                  <span className="text-sm font-semibold">{extra.name}</span>
                </div>
                <span className="text-sm font-medium">${extra.price}/day</span>
              </div>
            );
          })} */}
        </div>

        {/* <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Requirements (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requirements or requests..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* <div className="rounded-xl border bg-slate-50 p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-rose-600 mt-0.5" />
          <div className="text-sm text-slate-700">
            24/7 Roadside Assistance is available with all plans. For emergency
            support call our hotline anytime.
          </div>
        </div> */}

        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white"
          >
            Continue to Customer Info
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
