"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Lock, Star, MapPin } from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";

export default function BookingSummary({ selectedCar, form }) {
  const watchPickup = form.watch("pickupDate");
  const watchDropoff = form.watch("dropoffDate");

  const step1 = bookingStorage.getStep("step1") || {};

  const computeDays = () => {
    let days = 1;
    if (watchPickup && watchDropoff) {
      const pickup = new Date(watchPickup);
      const dropoff = new Date(watchDropoff);
      const diff = Math.ceil(
        Math.abs(dropoff - pickup) / (1000 * 60 * 60 * 24)
      );
      days = diff || 1;
    }
    return days;
  };

  const computeTotals = () => {
    const days = computeDays();
    const dailyRate = parseInt(selectedCar?.price || 0) || 0;
    const planPrices = { basic: 0, standard: 19, premium: 39 };
    const extrasPrices = {
      gps: 8,
      childSeat: 6,
      additionalDriver: 12,
      wifi: 7,
    };
    const protection = planPrices[step1.protectionPlan || "basic"] || 0;
    const extras = (step1.extras || []).reduce(
      (s, id) => s + (extrasPrices[id] || 0),
      0
    );
    const taxRate = 0.08;
    const subtotal = (dailyRate + protection + extras) * days;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return { days, subtotal, tax, total, dailyRate };
  };

  const { days, subtotal, tax, total, dailyRate } = computeTotals();

  return (
    <div className="space-y-4">
      {/* Booking Summary Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Car className="w-5 h-5 text-primary" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCar ? (
            <div className="space-y-4">
              {/* Car Image */}
              <div className="rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={selectedCar.image}
                  alt={selectedCar.name}
                  className="w-full h-40 object-cover"
                />
              </div>

              {/* Car Info */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{selectedCar.name}</h3>
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <Star className="w-4 h-4 fill-red-500" />
                    <span>4.8</span>
                  </div>
                </div>
                <span className="bg-yellow-400 text-xs font-semibold text-black px-3 py-1 rounded-md">
                  Premium
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Car className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No car selected</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Breakdown Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Car className="w-5 h-5 text-primary" />
            Price Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Base rental */}
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2">
              <Car className="w-4 h-4 text-primary" />
              Base rental ({days} {days > 1 ? "days" : "day"})
            </span>
            <span>${dailyRate.toFixed(2)}</span>
          </div>

          <hr className="my-2 border-rose-100" />

          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {/* Tax */}
          <div className="flex justify-between text-sm">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          {/* Total */}
          <div className="flex justify-between pt-3 text-base font-semibold text-red-600 border-t border-rose-100">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            ${total.toFixed(2)} per day avg
          </p>

          {/* Secure Payment Section */}
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
            <Lock className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-600">
                Secure Payment
              </p>
              <p className="text-xs text-gray-600">
                Your payment information is encrypted and protected. Cancel free
                within{" "}
                <span className="font-semibold text-blue-600">24 hours</span>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
