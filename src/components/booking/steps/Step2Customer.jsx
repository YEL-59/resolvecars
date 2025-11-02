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
  ArrowLeft,
  ArrowRight,
  CreditCard,
  User,
  IdCard,
  MapPin,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Step2Customer({ onPrev, onNext }) {
  const form = useFormContext();

  useEffect(() => {
    // no-op; values are prefilled from root defaults
  }, []);

  const getMinLicenseExpiry = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => onNext())} className="space-y-8">
        <div className="rounded-xl border bg-rose-50/60 p-6 space-y-4">
          {/* <h3 className="text-base font-semibold text-rose-700 flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Information
          </h3> */}

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-rose-600" />
              Personal Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="flightNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flight Number (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., BA142" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        {/* Driver and address information removed per minimal requirements */}

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            className="flex items-center gap-2 border-rose-300 text-rose-700 hover:bg-rose-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Coverage & Extras
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white"
          >
            Continue to Payment
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

