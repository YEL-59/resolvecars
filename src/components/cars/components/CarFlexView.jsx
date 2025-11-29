"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plane, Users, Car as CarIcon, Info, Check } from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";
import { useRouter } from "next/navigation";
import { isCarUnavailable, getCarPriceForDateRange, getCarPriceForDate, getCarPriceForCurrentDate, transformPackageToPlan } from "../helpers/carHelpers";

export default function CarFlexView({ cars, pickupDate, returnDate, rentalDays }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {cars.map((car) => {
        // Check if car is unavailable based on status
        const unavailable = isCarUnavailable(car);

        // Get dynamic car price based on selected dates or current date
        const dynamicCarPrice = pickupDate && returnDate
          ? getCarPriceForDateRange(car, pickupDate, returnDate)
          : pickupDate
            ? getCarPriceForDate(car, pickupDate)
            : getCarPriceForCurrentDate(car); // Use current date if no search params

        // Get packages from API data or use default pricing plans
        const carPackages = car.packages && car.packages.length > 0
          ? car.packages
          : [
            {
              package_type: "premium",
              package_type_display: "Premium",
              features: ["Premium coverage included", "Free cancellation and modification", "No Excess", "Fuel tank full/full", "Refundable"],
              price_per_day: car.price || 0,
              original_price_per_day: car.originalPrice || car.price || 0,
              discount_percentage: car.discount || 0,
              has_discount: car.discount > 0,
            }
          ];

        // Transform packages to pricing plans format
        const plansWithPricing = carPackages
          .filter(pkg => pkg.is_active !== false) // Only show active packages
          .map((pkg, index) => {
            const plan = transformPackageToPlan(pkg, index);

            // Use rental_calculation from API if available (from search API), otherwise calculate
            const rentalCalc = pkg.rental_calculation;
            let currentPrice, totalPrice;

            if (rentalCalc) {
              // Use API calculated prices
              currentPrice = rentalCalc.daily_rate || rentalCalc.base_rental_cost || plan.pricePerDay || 0;
              totalPrice = rentalCalc.base_rental_cost || (currentPrice * (rentalCalc.rental_days || rentalDays));
            } else {
              // Calculate manually
              currentPrice = plan.pricePerDay || (plan.originalPrice * (1 - plan.discount / 100));
              totalPrice = currentPrice * rentalDays;
            }

            return {
              ...plan,
              currentPrice: currentPrice.toFixed(2),
              totalPrice: totalPrice.toFixed(0),
              pricePerDay: currentPrice,
            };
          });

        // Get transmission display (M for manual, A for automatic)
        const transmissionDisplay = (car.transmission || car.model?.transmission_type) === "manual" ? "M" : "A";
        // Calculate doors (assuming 5 for sedans/SUVs, 3 for coupes)
        const doors = car.type === "SPORTS" ? 3 : 5;

        return (
          <div
            key={car.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow ${unavailable
              ? "opacity-50 grayscale cursor-not-allowed"
              : "hover:shadow-lg"
              }`}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Left Section - Car Details */}
              <div className="lg:w-1/3 p-4 lg:p-6 border-r-0 lg:border-r border-gray-200 border-b lg:border-b-0 pb-4 lg:pb-6 relative">
                {/* Unavailable Badge */}
                {unavailable && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      Unavailable
                    </span>
                  </div>
                )}

                {/* Car Model Name */}
                <h3 className="text-2xl font-bold text-blue-600 mb-2">
                  {car.name || `${car.model?.make || ""} ${car.model?.model || ""}`.trim() || "Car"} or similar
                </h3>

                {/* Car Type */}
                <p className="text-sm text-gray-600 mb-2">{car.type || car.model?.car_type?.name || ""}</p>

                {/* Dynamic Car Price Display */}
                {dynamicCarPrice && dynamicCarPrice.start_date && dynamicCarPrice.end_date && (
                  <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Base Price:</span>
                      <span className="text-lg font-bold text-blue-700">
                        {dynamicCarPrice.display_price || `$${dynamicCarPrice.price_per_day.toFixed(2)}`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(dynamicCarPrice.start_date).toLocaleDateString()} - {new Date(dynamicCarPrice.end_date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Collection Info */}
                <div className="flex items-center gap-2 mb-3">
                  <Plane className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 uppercase">
                    COLLECTION AT AIRPORT TERMINAL
                  </span>
                </div>

                {/* Best Price Badge */}
                <div className="mb-4">
                  <span className="text-red-600 text-sm font-medium">
                    Best price for these dates
                  </span>
                </div>

                {/* Car Image */}
                <div className="relative w-full h-48 mb-4 bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={car.image || car.image_url || "/assets/cars/ridecard1.png"}
                    alt={car.name || `${car.model?.make} ${car.model?.model}` || "Car"}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                {/* Specifications */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium">{car.passengers || car.model?.seats || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CarIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium">{doors}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-600"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 9h6v6H9z" />
                      <path d="M3 9h6" />
                      <path d="M15 9h6" />
                      <path d="M3 15h6" />
                      <path d="M15 15h6" />
                      <path d="M9 3v6" />
                      <path d="M9 15v6" />
                      <path d="M15 3v6" />
                      <path d="M15 15v6" />
                    </svg>
                    <span className="text-sm font-medium">{transmissionDisplay}</span>
                  </div>
                </div>

                {/* Unlimited Mileage */}
                <div className="mt-4">
                  <span className="text-sm font-semibold uppercase text-gray-700">
                    UNLIMITED MILEAGE
                  </span>
                </div>
              </div>

              {/* Right Section - Pricing Plan Cards */}
              <div className="lg:w-2/3 p-4 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto">
                  {plansWithPricing.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow min-w-[200px]"
                    >
                      {/* Header */}
                      <div
                        className={`${plan.headerColor} text-white px-4 py-3 flex items-center justify-between`}
                      >
                        <span className="font-semibold text-sm">{plan.name}</span>
                        <Info className="w-4 h-4" />
                      </div>

                      {/* Features */}
                      <div className="flex-1 bg-white p-4 space-y-2">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-gray-700">{feature.text}</span>
                              {feature.badge && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                  {feature.badgeIcon && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <line x1="3" y1="12" x2="21" y2="12" />
                                      <line x1="3" y1="8" x2="21" y2="8" />
                                      <line x1="3" y1="16" x2="21" y2="16" />
                                      <circle cx="12" cy="12" r="1" />
                                    </svg>
                                  )}
                                  {feature.badge}
                                  <Info className="w-3 h-3" />
                                </span>
                              )}
                              {feature.hasInfo && (
                                <Info className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pricing */}
                      <div className="bg-white p-4 border-t border-gray-100">
                        {plan.hasDiscount && plan.discount > 0 && (
                          <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded inline-block mb-2">
                            -{plan.discount}%
                          </div>
                        )}
                        <div className="space-y-1">
                          {plan.originalPrice > plan.pricePerDay && (
                            <p className="text-xs text-gray-500 line-through">
                              {plan.originalDisplayPrice || `${plan.originalPrice.toFixed(2)} €/day`}
                            </p>
                          )}
                          <p className="text-lg font-bold text-gray-900">
                            {plan.displayPrice || `${plan.currentPrice} €/day`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {plan.totalPrice} € {rentalDays} days
                          </p>
                        </div>
                      </div>

                      {/* Continue Button */}
                      <Button
                        disabled={unavailable}
                        onClick={() => {
                          if (!unavailable) {
                            bookingStorage.setCar(car);
                            // Preserve all existing step1 data including location IDs
                            const existingStep1 = bookingStorage.getStep("step1") || {};
                            bookingStorage.updateStep("step1", {
                              ...existingStep1,
                              protectionPlan: plan.id,
                              // Ensure location IDs are preserved
                              pickupLocationId: existingStep1.pickupLocationId || existingStep1.pickup_location_id || null,
                              pickup_location_id: existingStep1.pickup_location_id || existingStep1.pickupLocationId || null,
                              dropoffLocationId: existingStep1.dropoffLocationId || existingStep1.return_location_id || existingStep1.pickupLocationId || existingStep1.pickup_location_id || null,
                              return_location_id: existingStep1.return_location_id || existingStep1.dropoffLocationId || existingStep1.pickupLocationId || existingStep1.pickup_location_id || null,
                            });
                            router.push("/booking/step1");
                          }
                        }}
                        className={`m-4 font-medium py-3 rounded ${unavailable
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-blue-700 hover:bg-blue-800 text-white"
                          }`}
                      >
                        {unavailable ? "UNAVAILABLE" : "CONTINUE"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

