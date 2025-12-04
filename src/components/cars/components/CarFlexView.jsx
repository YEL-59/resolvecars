"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Info, Check, Calendar as CalendarIcon, Star, LogIn } from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";
import { userStorage } from "@/lib/userStorage";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { isCarUnavailable, getCarPriceForDateRange, getCarPriceForDate, getCarPriceForCurrentDate, transformPackageToPlan, formatDateDisplay } from "../helpers/carHelpers";

// Internal component that uses useSearchParams
function CarFlexViewContent({ cars, pickupDate, returnDate, rentalDays }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

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
        // Get fuel type
        const fuelType = car.fuel || car.fuelType || car.model?.fuel_type || "gasoline";
        // Get car year
        const carYear = car.year || car.model?.year;
        // Get car name
        const carName = car.name || `${car.model?.make || ""} ${car.model?.model || ""}`.trim() || "Car";
        // Get car type
        const carType = car.type || car.model?.car_type?.name || "";
        // Get car image
        const carImage = car.image || car.image_url || "/assets/cars/ridecard1.png";
        // Get passengers
        const passengers = car.passengers || car.model?.seats || 0;
        // Get rating
        const rating = parseFloat(car.rating || car.model?.average_rating || 0);

        // Get base price from API - prioritize pricing.rental_calculation.daily_rate
        // Then check car_prices array, then dynamicCarPrice, then fallback
        let basePriceData = null;

        // First, try to get from pricing.rental_calculation (from search API)
        if (car.pricing?.rental_calculation?.daily_rate) {
          basePriceData = {
            price_per_day: parseFloat(car.pricing.rental_calculation.daily_rate),
            display_price: `$${parseFloat(car.pricing.rental_calculation.daily_rate).toFixed(2)}`,
            start_date: null,
            end_date: null,
          };
        }
        // Second, try to get from model.car_prices array (active price range)
        else if (car.model?.car_prices && Array.isArray(car.model.car_prices) && car.model.car_prices.length > 0) {
          const activePrice = car.model.car_prices.find(p => p.is_active !== false) || car.model.car_prices[0];
          if (activePrice) {
            basePriceData = {
              price_per_day: parseFloat(activePrice.price_per_day || 0),
              display_price: activePrice.display_price || `$${parseFloat(activePrice.price_per_day || 0).toFixed(2)}`,
              start_date: activePrice.start_date,
              end_date: activePrice.end_date,
            };
          }
        }
        // Third, use dynamicCarPrice if available
        else if (dynamicCarPrice) {
          basePriceData = {
            price_per_day: parseFloat(dynamicCarPrice.price_per_day || 0),
            display_price: dynamicCarPrice.display_price || `$${parseFloat(dynamicCarPrice.price_per_day || 0).toFixed(2)}`,
            start_date: dynamicCarPrice.start_date,
            end_date: dynamicCarPrice.end_date,
          };
        }
        // Fallback to car.price if available
        else if (car.price) {
          basePriceData = {
            price_per_day: parseFloat(car.price),
            display_price: `$${parseFloat(car.price).toFixed(2)}`,
            start_date: null,
            end_date: null,
          };
        }

        // Get active car price for display
        const activeCarPrice = basePriceData;

        // Get available dates from car data (API provides available_start_date and available_end_date)
        const availableStartDate = car.available_start_date || basePriceData?.start_date || dynamicCarPrice?.start_date;
        const availableEndDate = car.available_end_date || basePriceData?.end_date || dynamicCarPrice?.end_date;

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
              <div className="lg:w-1/3 p-6 border-r border-gray-200 relative">
                {/* Unavailable Badge */}
                {unavailable && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      Unavailable
                    </span>
                  </div>
                )}

                {/* Car Model Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {carName}
                </h3>

                {/* Car Type Badge - Yellow oval */}
                <div className="mb-4">
                  <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-medium">
                    {carType}
                  </span>
                </div>

                {/* Car Image with Year */}
                <div className="relative w-full h-64 mb-4 bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={carImage}
                    alt={carName}
                    fill
                    className="object-cover"
                  />
                  {/* Year Badge - Only show if year exists */}
                  {carYear && (
                    <div className="absolute bottom-4 right-4">
                      <span className="text-gray-900 font-semibold text-lg">
                        {carYear}
                      </span>
                    </div>
                  )}
                </div>

                {/* Base Price and Available Dates */}
                {(activeCarPrice || availableStartDate || availableEndDate) && (
                  <div className="mb-4 space-y-3">
                    {/* Base Price Section */}
                    {activeCarPrice && activeCarPrice.price_per_day > 0 && (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Base Price
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-normal">
                              Starting from
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold text-gray-900">
                              {activeCarPrice.display_price ||
                                `$${activeCarPrice.price_per_day?.toFixed(2) ||
                                "0.00"
                                }`}
                            </span>
                            <p className="text-xs text-gray-500 font-normal mt-0.5">
                              per day
                            </p>
                          </div>
                        </div>
                        {/* Show price validity dates if available from car_prices */}
                        {activeCarPrice.start_date &&
                          activeCarPrice.end_date && (
                            <div className="pt-2 border-t border-gray-200 mt-2">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-xs text-gray-600 font-medium">
                                  Valid from{" "}
                                  <span className="text-gray-900">
                                    {formatDateDisplay(
                                      activeCarPrice.start_date
                                    )}
                                  </span>{" "}
                                  to{" "}
                                  <span className="text-gray-900">
                                    {formatDateDisplay(activeCarPrice.end_date)}
                                  </span>
                                </span>
                              </div>
                            </div>
                          )}
                        {/* Show pricing info from API if available */}
                        {car.pricing?.rental_calculation && (
                          <div className="pt-2 border-t border-gray-200 mt-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Base Rental Cost:</span>
                              <span className="text-gray-900 font-semibold">
                                ${parseFloat(car.pricing.rental_calculation.base_rental_cost || 0).toFixed(2)}
                              </span>
                            </div>
                            {car.pricing.rental_calculation.rental_days && (
                              <div className="flex items-center justify-between text-xs mt-1">
                                <span className="text-gray-600">Rental Days:</span>
                                <span className="text-gray-900 font-semibold">
                                  {parseFloat(car.pricing.rental_calculation.rental_days).toFixed(2)} days
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Available Dates Section */}
                    {(availableStartDate || availableEndDate) && (
                      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Available Period
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {availableStartDate && (
                              <span className="text-xs text-gray-900 font-semibold bg-gray-100 px-2.5 py-1 rounded-md">
                                {formatDateDisplay(availableStartDate)}
                              </span>
                            )}
                            {availableStartDate && availableEndDate && (
                              <span className="text-xs text-gray-400">→</span>
                            )}
                            {availableEndDate && (
                              <span className="text-xs text-gray-900 font-semibold bg-gray-100 px-2.5 py-1 rounded-md">
                                {formatDateDisplay(availableEndDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Specifications */}
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {passengers}
                    </span>
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
                    <span className="text-sm font-medium text-gray-700">
                      {transmissionDisplay}
                    </span>
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
                      <path d="M3 2v6h6" />
                      <path d="M21 2v6h-6" />
                      <path d="M21 22v-6h-6" />
                      <path d="M3 22v-6h6" />
                      <rect x="3" y="10" width="18" height="4" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {fuelType}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating)
                          ? "fill-red-400 text-red-400"
                          : "fill-gray-300 text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({rating.toFixed(1)})
                  </span>
                </div>
              </div>

              {/* Right Section - Pricing Plan Cards */}
              <div className="lg:w-2/3 p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plansWithPricing.map((plan) => {
                    // Determine header color based on plan type
                    const isStandard = plan.name.toLowerCase() === "standard";
                    const headerBg = isStandard ? "bg-red-400" : "bg-red-400";

                    return (
                      <div
                        key={plan.id}
                        className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
                      >
                        {/* Header */}
                        <div
                          className={`${headerBg} text-white px-4 py-3 flex items-center justify-between`}
                        >
                          <span className="font-semibold text-sm">
                            {plan.name}
                          </span>
                          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                            <Info className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex-1 bg-white p-4 space-y-3">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-gray-700">
                                  {feature.text}
                                </span>
                                {feature.badge && (
                                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                    {feature.badge}
                                    <Info className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pricing */}
                        <div className="bg-white p-4 border-t border-gray-100">
                          {plan.hasDiscount && plan.discount > 0 && (
                            <div className="bg-red-400 text-white text-xs font-semibold px-2 py-1 rounded inline-block mb-2">
                              -{plan.discount}%
                            </div>
                          )}
                          <div className="space-y-1">
                            {/* Show original price if it exists and is higher than current price */}
                            {plan.originalDisplayPrice && (
                              <p className="text-xs text-gray-500 line-through">
                                {plan.originalDisplayPrice}/day
                              </p>
                            )}
                            {!plan.originalDisplayPrice &&
                              plan.originalPrice &&
                              plan.originalPrice > plan.pricePerDay && (
                                <p className="text-xs text-gray-500 line-through">
                                  ${plan.originalPrice.toFixed(2)}/day
                                </p>
                              )}
                            <p className="text-lg font-bold text-gray-900">
                              {plan.displayPrice ||
                                `$${parseFloat(plan.currentPrice).toFixed(2)}`}
                              /day
                            </p>
                          </div>
                        </div>

                        {/* Continue Button */}
                        <Button
                          disabled={unavailable}
                          onClick={() => {
                            if (!unavailable) {
                              // Check if user is logged in
                              if (!userStorage.isLoggedIn()) {
                                setShowLoginDialog(true);
                                return;
                              }

                              // Validate required search fields
                              const existingStep1 = bookingStorage.getStep("step1") || {};

                              // Check for required fields from bookingStorage or URL params
                              const hasPickupDate = existingStep1.pickupDate || pickupDate || searchParams.get("pickup_date");
                              const hasReturnDate = existingStep1.dropoffDate || existingStep1.returnDate || returnDate || searchParams.get("return_date");
                              const hasPickupLocation = existingStep1.pickupLocationId || existingStep1.pickup_location_id || searchParams.get("pickup_location_id");

                              // Show toast if required fields are missing
                              if (!hasPickupDate || !hasReturnDate || !hasPickupLocation) {
                                toast.error("Please complete the search form first. Pickup date, return date, and location are required to continue with booking.", {
                                  duration: 5000,
                                  style: {
                                    maxWidth: '500px',
                                  },
                                });
                                // Scroll to search form
                                router.push("/cars");
                                return;
                              }

                              bookingStorage.setCar(car);
                              bookingStorage.updateStep("step1", {
                                ...existingStep1,
                                protectionPlan: plan.id,
                                pickupLocationId:
                                  existingStep1.pickupLocationId ||
                                  existingStep1.pickup_location_id ||
                                  searchParams.get("pickup_location_id") ||
                                  null,
                                pickup_location_id:
                                  existingStep1.pickup_location_id ||
                                  existingStep1.pickupLocationId ||
                                  searchParams.get("pickup_location_id") ||
                                  null,
                                dropoffLocationId:
                                  existingStep1.dropoffLocationId ||
                                  existingStep1.return_location_id ||
                                  searchParams.get("return_location_id") ||
                                  existingStep1.pickupLocationId ||
                                  existingStep1.pickup_location_id ||
                                  null,
                                return_location_id:
                                  existingStep1.return_location_id ||
                                  existingStep1.dropoffLocationId ||
                                  searchParams.get("return_location_id") ||
                                  existingStep1.pickupLocationId ||
                                  existingStep1.pickup_location_id ||
                                  null,
                              });
                              router.push("/booking/step1");
                            }
                          }}
                          className={`m-4 font-medium py-3 rounded ${unavailable
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-red-400 hover:bg-red-500 text-white"
                            }`}
                        >
                          {unavailable ? "UNAVAILABLE" : "Continue"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-full">
                <LogIn className="w-6 h-6 text-yellow-600" />
              </div>
              <DialogTitle>Login Required</DialogTitle>
            </div>
            <DialogDescription>
              You need to be logged in to continue with your booking. Please sign in or create an account to proceed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowLoginDialog(false);
                router.push("/auth");
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Go to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Main component with Suspense boundary
export default function CarFlexView({ cars, pickupDate, returnDate, rentalDays }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <CarFlexViewContent cars={cars} pickupDate={pickupDate} returnDate={returnDate} rentalDays={rentalDays} />
    </Suspense>
  );
}

