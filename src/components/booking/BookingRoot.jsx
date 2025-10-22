"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookingStorage } from "@/lib/bookingStorage";
import BookingSummary from "./BookingSummary";
import Step1Rental from "./steps/Step1Rental";
import Step2Customer from "./steps/Step2Customer";
import Step3Payment from "./steps/Step3Payment";
import Step4Review from "./steps/Step4Review";
import { CarIcon, CheckIcon, CreditCardIcon, UserIcon } from "lucide-react";
// removed: import BookingStepper from "./BookingStepper";

// Combined schema for all steps; each page will validate only its relevant slice
const schema = z.object({
  // step 1
  pickupDate: z.string().optional(),
  dropoffDate: z.string().optional(),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  requirements: z.string().optional(),
  protectionPlan: z.string().optional(),
  extras: z.array(z.string()).optional(),
  // step 2
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.string().optional(),
  age: z.string().optional(),
  // step 3
  paymentMethod: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardholderName: z.string().optional(),
  billingAddress: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  // step 4
  termsAccepted: z.boolean().optional(),
  newsletterSubscribe: z.boolean().optional(),
});

export default function BookingRoot() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const step = useMemo(() => {
    if (!pathname) return 1;
    if (pathname.includes("step1")) return 1;
    if (pathname.includes("step2")) return 2;
    if (pathname.includes("step3")) return 3;
    if (pathname.includes("step4")) return 4;
    return 1;
  }, [pathname]);

  const [selectedCar, setSelectedCar] = useState(null);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: useMemo(() => {
      const all = bookingStorage.getData() || {};
      return {
        // flatten known steps for a unified form state
        ...(all.step1 || {}),
        ...(all.step2 || {}),
        ...(all.step3 || {}),
        ...(all.step4 || {}),
      };
    }, []),
  });

  // mark mounted and load selected car
  useEffect(() => {
    setMounted(true);
    const car = bookingStorage.getCar();
    setSelectedCar(car || null);
  }, []);

  // persist on change (subscribe once)
  useEffect(() => {
    const subscription = form.watch((values) => {
      const {
        pickupDate,
        dropoffDate,
        pickupLocation,
        dropoffLocation,
        requirements,
        protectionPlan,
        extras,
        firstName,
        lastName,
        email,
        phone,
        licenseNumber,
        licenseExpiry,
        age,
        paymentMethod,
        cardNumber,
        expiryDate,
        cvv,
        cardholderName,
        billingAddress,
        city,
        zipCode,
        country,
        termsAccepted,
        newsletterSubscribe,
      } = values;

      bookingStorage.updateStep("step1", {
        pickupDate,
        dropoffDate,
        pickupLocation,
        dropoffLocation,
        requirements,
        protectionPlan,
        extras,
      });
      bookingStorage.updateStep("step2", {
        firstName,
        lastName,
        email,
        phone,
        licenseNumber,
        licenseExpiry,
        age,
      });
      bookingStorage.updateStep("step3", {
        paymentMethod,
        cardNumber,
        expiryDate,
        cvv,
        cardholderName,
        billingAddress,
        city,
        zipCode,
        country,
      });
      bookingStorage.updateStep("step4", {
        termsAccepted: !!termsAccepted,
        newsletterSubscribe: !!newsletterSubscribe,
      });
    });
    return () => subscription.unsubscribe();
    // subscribe once; the form instance doesn't change after mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (target) => router.push(`/booking/step${target}`);

  if (!mounted) {
    return null; // avoid SSR/client mismatch
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 ">
        <div className=" p-0 shadow-lg ">
          <div className="bg-white  ">
            <div className="text-2xl font-normal text-primary bg-[#F7F8FA] py-5 px-5 rounded-t-lg shadow-sm">
              {/* here i add car icon before text {step === 1 && "   Rental Details"} */}
              {step === 1 && (
                <>
                  <CarIcon className="inline-block w-6 h-6 mr-2" /> Rental
                  Details
                </>
              )}
              {step === 2 && (
                <>
                  <UserIcon className="inline-block w-6 h-6 mr-2" /> "Customer
                  Information"
                </>
              )}
              {step === 3 && (
                <>
                  <CreditCardIcon className="inline-block w-6 h-6 mr-2" />{" "}
                  "Payment Information"
                </>
              )}
              {step === 4 && (
                <>
                  <CheckIcon className="inline-block w-6 h-6 mr-2" /> "Review
                  Your Booking"
                </>
              )}
            </div>
          </div>
          {/* removed inner BookingStepper to avoid duplicate */}
          {/* <div className="px-5 py-4">
            <BookingStepper current={step} />
          </div> */}
          <div className="p-3 space-y-8">
            <FormProvider {...form}>
              {step === 1 && <Step1Rental onNext={() => goTo(2)} />}
              {step === 2 && (
                <Step2Customer onPrev={() => goTo(1)} onNext={() => goTo(3)} />
              )}
              {step === 3 && (
                <Step3Payment onPrev={() => goTo(2)} onNext={() => goTo(4)} />
              )}
              {step === 4 && <Step4Review onPrev={() => goTo(3)} />}
            </FormProvider>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <BookingSummary selectedCar={selectedCar} form={form} />
      </div>
    </div>
  );
}
