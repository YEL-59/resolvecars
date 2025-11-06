"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Info,
  X,
  Check,
  Minus,
  Plus,
} from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";
import { coveragePlans, extrasData } from "@/lib/coverageData";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function Step1Rental({ onNext }) {
  const form = useFormContext();
  const [selectedCoverage, setSelectedCoverage] = useState("premium");
  const [showMoreExtras, setShowMoreExtras] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);
  const [customDonation, setCustomDonation] = useState("");
  const [isChildSeatModalOpen, setIsChildSeatModalOpen] = useState(false);
  const [childSeatQuantities, setChildSeatQuantities] = useState({
    babySeat: 0,
    childSeat: 0,
    boosterSeat: 0,
  });

  // Load existing child seat quantities when modal opens
  useEffect(() => {
    if (isChildSeatModalOpen) {
      const step1Data = bookingStorage.getStep("step1") || {};
      if (step1Data.childSeatQuantities) {
        setChildSeatQuantities(step1Data.childSeatQuantities);
      }
    }
  }, [isChildSeatModalOpen]);

  // Get rental days
  const rentalDays = useMemo(() => {
    const step1Data = bookingStorage.getStep("step1") || {};
    if (step1Data.pickupDate && step1Data.dropoffDate) {
      try {
        const pickup = new Date(step1Data.pickupDate);
        const dropoff = new Date(step1Data.dropoffDate);
        const diffTime = Math.abs(dropoff - pickup);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 23;
      } catch {
        return 23;
      }
    }
    return 23;
  }, []);

  // Get selected car
  const selectedCar = useMemo(() => {
    return bookingStorage.getCar();
  }, []);

  useEffect(() => {
    const existing = bookingStorage.getStep("step1");
    if (existing) {
      form.reset({ ...form.getValues(), ...existing });
      // Set coverage based on protection plan from car card selection
      if (existing.protectionPlan === "premium" || existing.protectionPlan === "smart") {
        setSelectedCoverage("premium");
        // Auto-include Fast Track if not already included
        const currentExtras = existing.extras || [];
        if (!currentExtras.includes("fastTrack")) {
          const updatedExtras = [...currentExtras, "fastTrack"];
          form.setValue("extras", updatedExtras);
          bookingStorage.updateStep("step1", {
            ...existing,
            extras: updatedExtras,
          });
        }
      } else if (existing.protectionPlan === "superPremium") {
        setSelectedCoverage("superPremium");
        // Auto-include Fast Track if not already included
        const currentExtras = existing.extras || [];
        if (!currentExtras.includes("fastTrack")) {
          const updatedExtras = [...currentExtras, "fastTrack"];
          form.setValue("extras", updatedExtras);
          bookingStorage.updateStep("step1", {
            ...existing,
            extras: updatedExtras,
          });
        }
      }
    } else {
      // Default to premium if no existing data
      setSelectedCoverage("premium");
      form.setValue("coveragePlan", "premium");
      form.setValue("extras", ["fastTrack"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update form when coverage changes
  useEffect(() => {
    form.setValue("coveragePlan", selectedCoverage);
    bookingStorage.updateStep("step1", {
      ...bookingStorage.getStep("step1"),
      coveragePlan: selectedCoverage,
    });
  }, [selectedCoverage, form]);

  const handleCoverageSelect = (coverageId) => {
    setSelectedCoverage(coverageId);
  };

  const handleExtraToggle = (extraId) => {
    const current = form.getValues("extras") || [];
    const isCurrentlyIncluded = current.includes(extraId);
    
    if (isCurrentlyIncluded) {
      // Remove from extras
      const updated = current.filter((e) => e !== extraId);
      form.setValue("extras", updated, { shouldDirty: true });
      bookingStorage.updateStep("step1", {
        ...bookingStorage.getStep("step1"),
        extras: updated,
      });
    } else {
      // Add to extras
      const updated = [...current, extraId];
      form.setValue("extras", updated, { shouldDirty: true });
      bookingStorage.updateStep("step1", {
        ...bookingStorage.getStep("step1"),
        extras: updated,
      });
    }
  };

  // Watch extras to make component reactive
  const watchedExtras = form.watch("extras") || [];
  
  const isExtraIncluded = (extraId) => {
    return watchedExtras.includes(extraId);
  };

  // Get selected package from booking storage
  const selectedPackage = useMemo(() => {
    const step1Data = bookingStorage.getStep("step1") || {};
    return step1Data.protectionPlan || "premium";
  }, []);

  // Determine which coverage cards to show
  const showBasicCover = selectedPackage === "lite" || selectedPackage === "standard";
  const showPremiumCover = true; // Always show Premium
  const showSuperPremiumCover = true; // Always show Super Premium

  const basicCover = coveragePlans.basic;
  const premiumCover = coveragePlans.premium;
  const superPremiumCover = coveragePlans.superPremium;

  // Calculate prices based on selected package
  const getBaseRatePrice = () => {
    // These prices should match the car card package prices
    const packagePrices = {
      premium: 25.83, // From PREMIUM card
      smart: 24.57, // From SMART card
      lite: 11.00, // From LITE card
      standard: 13.18, // From STANDARD card (15.50 * 0.85)
    };
    return packagePrices[selectedPackage] || 25.83;
  };

  const baseRatePrice = getBaseRatePrice();
  const premiumDailyPrice = showBasicCover ? 13.57 : premiumCover.basePrice;
  const superPremiumDailyPrice = showBasicCover ? 19.78 : (premiumCover.basePrice + superPremiumCover.dailyPrice);

  // Calculate totals
  const baseRateTotal = baseRatePrice * rentalDays;
  const premiumTotal = premiumDailyPrice * rentalDays;
  const superPremiumTotal = superPremiumDailyPrice * rentalDays;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => onNext())} className="space-y-6">
        {/* Refundable Rate Banner */}
        <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-green-800">
            Refundable rate: cancellation and amendment at no extra cost.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Rental Summary */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {selectedCar?.name || "Car"} or similar
              </h3>
              <p className="text-xs text-red-600 mb-3">Best price for these dates</p>
              
              {selectedCar?.image && (
                <div className="relative w-full h-32 mb-4 bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={selectedCar.image}
                    alt={selectedCar.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              )}

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  {selectedPackage === "premium" ? "Premium" : selectedPackage === "smart" ? "Smart" : selectedPackage === "lite" ? "Lite" : "Standard"} Rate x {rentalDays} days
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {(() => {
                    if (selectedCoverage === "basic") {
                      return baseRateTotal.toFixed(2);
                    } else if (selectedCoverage === "premium") {
                      return (baseRateTotal + premiumTotal).toFixed(2);
                    } else {
                      return (baseRateTotal + superPremiumTotal).toFixed(2);
                    }
                  })()}{" "}
                  €
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3">
                  SUMMARY OF YOUR RENTAL
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      {selectedCoverage === "basic"
                        ? "Basic Cover"
                        : selectedCoverage === "premium"
                        ? "Premium Cover"
                        : "Super Premium Cover"}
                    </span>
                    <span className="text-green-600 font-medium">Included</span>
                  </div>
                  {isExtraIncluded("youngDriver") && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Young Driver</span>
                      <span className="text-gray-900 font-medium">
                        {(extrasData.find((e) => e.id === "youngDriver")?.price || 0) *
                          rentalDays}{" "}
                        €
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    className="text-sm"
                  />
                  <Button type="button" variant="outline" size="sm">
                    APPLY
                  </Button>
                </div>
              </div>

              {/* Daily Rate Info */}
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm">
                <p className="text-gray-600">
                  {(() => {
                    if (selectedCoverage === "basic") {
                      return baseRatePrice.toFixed(2);
                    } else if (selectedCoverage === "premium") {
                      return (baseRatePrice + premiumDailyPrice).toFixed(2);
                    } else {
                      return (baseRatePrice + superPremiumDailyPrice).toFixed(2);
                    }
                  })()}{" "}
                  €/day
                </p>
                <p className="text-gray-600">
                  {(() => {
                    if (selectedCoverage === "basic") {
                      return baseRateTotal.toFixed(0);
                    } else if (selectedCoverage === "premium") {
                      return (baseRateTotal + premiumTotal).toFixed(0);
                    } else {
                      return (baseRateTotal + superPremiumTotal).toFixed(0);
                    }
                  })()}{" "}
                  € ({rentalDays} days)
                </p>
              </div>

              {/* Loyalty Points */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Your booking gives you{" "}
                  {Math.floor(
                    (() => {
                      if (selectedCoverage === "basic") {
                        return baseRateTotal;
                      } else if (selectedCoverage === "premium") {
                        return baseRateTotal + premiumTotal;
                      } else {
                        return baseRateTotal + superPremiumTotal;
                      }
                    })()
                  )}{" "}
                  POINTS OK CLUB
                </p>
              </div>
            </div>
          </div>

          {/* Right Main Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Coverage Selection */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Protect your vacations! Select your cover of choice
              </h2>
              
              <div className={`grid gap-4 ${showBasicCover ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
                {/* Basic Cover - Only show for LITE/STANDARD */}
                {showBasicCover && (
                  <div
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedCoverage === "basic"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="bg-blue-600 text-white px-4 py-2 text-xs font-semibold">
                      {basicCover.status}
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Included in the price
                        </p>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            FRANCHISE: {basicCover.franchise} €
                          </span>
                          <Info className="w-3 h-3 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 mt-2">
                          Included in the price:
                        </p>
                        {basicCover.included.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{item.name}</span>
                          </div>
                        ))}
                      </div>

                      {basicCover.excluded.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <p className="text-sm font-medium text-gray-700">
                            Excluded:
                          </p>
                          {basicCover.excluded.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-500 line-through">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <a href="#" className="text-sm text-blue-600 hover:underline">
                        See more
                      </a>

                      <Button
                        type="button"
                        onClick={() => handleCoverageSelect("basic")}
                        className={`w-full mt-4 ${
                          selectedCoverage === "basic"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-white`}
                      >
                        {selectedCoverage === "basic" ? (
                          <span className="flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Included
                          </span>
                        ) : (
                          "Select"
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Premium Cover */}
                <div
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedCoverage === "premium"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className={`${selectedCoverage === "premium" ? "bg-blue-600" : "bg-gray-600"} text-white px-4 py-2 text-xs font-semibold`}>
                    {selectedCoverage === "premium" ? "SELECTED" : premiumCover.status}
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      {showBasicCover ? (
                        <>
                          <p className="text-sm text-gray-500 line-through mb-1">
                            15,36 €
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {premiumDailyPrice.toFixed(2)} €/day
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-2xl font-bold text-gray-900">
                            {premiumTotal.toFixed(2)} €
                          </p>
                          <p className="text-sm text-gray-600">
                            for {rentalDays} days
                          </p>
                        </>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-gray-700">
                        Included in the price:
                      </p>
                      {premiumCover.included.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-700">{item.name}</span>
                            {item.hasInfo && (
                              <Info className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {premiumCover.excluded.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-sm font-medium text-gray-700">
                          Excluded:
                        </p>
                        {premiumCover.excluded.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-500 line-through">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      See more
                    </a>

                    <Button
                      type="button"
                      onClick={() => handleCoverageSelect("premium")}
                      className={`w-full mt-4 ${
                        selectedCoverage === "premium"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white`}
                    >
                      {selectedCoverage === "premium" ? (
                        <span className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Included
                        </span>
                      ) : (
                        "Select"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Super Premium Cover */}
                <div
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedCoverage === "superPremium"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className={`${selectedCoverage === "superPremium" ? "bg-blue-600" : "bg-gray-600"} text-white px-4 py-2 text-xs font-semibold`}>
                    {selectedCoverage === "superPremium" ? "SELECTED" : superPremiumCover.status}
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <p className="text-lg font-bold text-gray-900">
                        {superPremiumDailyPrice.toFixed(2)} €/day
                      </p>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-gray-700">
                        Included in the price:
                      </p>
                      {superPremiumCover.included.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-700">{item.name}</span>
                            {item.hasInfo && (
                              <Info className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      See more
                    </a>

                    <Button
                      type="button"
                      onClick={() => handleCoverageSelect("superPremium")}
                      className={`w-full mt-4 ${
                        selectedCoverage === "superPremium"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white`}
                    >
                      {selectedCoverage === "superPremium" ? (
                        <span className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          Included
                        </span>
                      ) : (
                        "Select"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Extras Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Other coverages, options and complements:
              </h2>
              
              <div className="space-y-4">
                {extrasData
                  .filter((extra, index) => {
                    // Show first 3 items always, then toggle the rest based on showMoreExtras
                    if (index < 3) return true;
                    return showMoreExtras;
                  })
                  .map((extra) => {
                  const isIncluded = isExtraIncluded(extra.id);
                  const isFastTrack = extra.id === "fastTrack";
                  const isChildSeat = extra.id === "childSeat";
                  // Fast Track is included in both Premium and Super Premium coverage
                  const isIncludedInCoverage = isFastTrack && (selectedCoverage === "premium" || selectedCoverage === "superPremium");

                  return (
                    <div
                      key={extra.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-gray-900 mb-1">
                            {extra.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {extra.description}
                          </p>
                          {extra.includes && (
                            <ul className="list-disc list-inside text-sm text-gray-600 mb-2 space-y-1">
                              {extra.includes.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          )}
                          {extra.id === "foundationDonation" && (
                            <div className="flex gap-2 mt-2">
                              {extra.donationOptions?.map((amount) => (
                                <Button
                                  key={amount}
                                  type="button"
                                  variant={
                                    donationAmount === amount
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => {
                                    if (amount === 0) {
                                      setCustomDonation("");
                                      setDonationAmount(0);
                                      // Remove donation if no amount selected
                                      const current = form.getValues("extras") || [];
                                      const updated = current.filter((e) => e !== extra.id);
                                      form.setValue("extras", updated, { shouldDirty: true });
                                      bookingStorage.updateStep("step1", {
                                        ...bookingStorage.getStep("step1"),
                                        extras: updated,
                                      });
                                    } else {
                                      setDonationAmount(amount);
                                      setCustomDonation("");
                                      // Add donation to extras
                                      const current = form.getValues("extras") || [];
                                      if (!current.includes(extra.id)) {
                                        const updated = [...current, extra.id];
                                        form.setValue("extras", updated, { shouldDirty: true });
                                        bookingStorage.updateStep("step1", {
                                          ...bookingStorage.getStep("step1"),
                                          extras: updated,
                                        });
                                      }
                                    }
                                  }}
                                >
                                  {amount === 0 ? "Otra..." : `${amount}€`}
                                </Button>
                              ))}
                              {donationAmount === 0 && (
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={customDonation}
                                    onChange={(e) => setCustomDonation(e.target.value)}
                                    className="w-24"
                                  />
                                  {customDonation && parseFloat(customDonation) > 0 && (
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => {
                                        const amount = parseFloat(customDonation);
                                        if (amount > 0) {
                                          setDonationAmount(amount);
                                          // Add donation to extras
                                          const current = form.getValues("extras") || [];
                                          if (!current.includes(extra.id)) {
                                            const updated = [...current, extra.id];
                                            form.setValue("extras", updated, { shouldDirty: true });
                                            bookingStorage.updateStep("step1", {
                                              ...bookingStorage.getStep("step1"),
                                              extras: updated,
                                            });
                                          }
                                        }
                                      }}
                                    >
                                      Apply
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          <p className="text-sm font-medium text-gray-900 mt-2">
                            {extra.price === 0
                              ? "0,00 €"
                              : `${extra.price.toFixed(2)} €/${
                                  extra.pricingType === "per_day" ? "day" : "booking"
                                }`}
                          </p>
                        </div>
                        <div className="ml-4">
                          {isIncludedInCoverage ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-300"
                              onClick={() => {
                                // Remove from extras but it's still included in coverage
                                const current = form.getValues("extras") || [];
                                const updated = current.filter((e) => e !== extra.id);
                                form.setValue("extras", updated, { shouldDirty: true });
                                bookingStorage.updateStep("step1", {
                                  ...bookingStorage.getStep("step1"),
                                  extras: updated,
                                });
                              }}
                            >
                              REMOVE
                            </Button>
                          ) : isIncluded ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-300 hover:bg-green-50"
                              onClick={() => handleExtraToggle(extra.id)}
                            >
                              <span className="flex items-center gap-1">
                                <Check className="w-4 h-4" />
                                INCLUDED
                              </span>
                            </Button>
                          ) : isChildSeat ? (
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              onClick={() => setIsChildSeatModalOpen(true)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              ADD+
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              onClick={() => handleExtraToggle(extra.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              ADD+
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {extrasData.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowMoreExtras(!showMoreExtras)}
                  className="text-sm text-blue-600 hover:underline mt-4 block"
                >
                  {showMoreExtras ? "See less" : "See more"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-6 text-lg"
          >
            CONTINUE
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Child Car Seats Modal */}
        <Dialog open={isChildSeatModalOpen} onOpenChange={setIsChildSeatModalOpen}>
          <DialogContent className="max-w-md p-0">
            <div className="p-6">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold text-blue-900 text-center">
                  Child car seats
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Baby Seat */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-bold text-gray-900 mb-1">BABY SEAT</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Group 0: 0 a 9 Kg (40-75 cm. ISOFIX)
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    5,22 € day / Unidad
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setChildSeatQuantities((prev) => ({
                          ...prev,
                          babySeat: Math.max(0, prev.babySeat - 1),
                        }));
                      }}
                      disabled={childSeatQuantities.babySeat === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {childSeatQuantities.babySeat}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setChildSeatQuantities((prev) => ({
                          ...prev,
                          babySeat: prev.babySeat + 1,
                        }));
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Child Seat */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-bold text-gray-900 mb-1">CHILD SEAT</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Group 1: 9 a 18 Kg (61-105 cm. ISOFIX)
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    5,22 € day / Unidad
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setChildSeatQuantities((prev) => ({
                          ...prev,
                          childSeat: Math.max(0, prev.childSeat - 1),
                        }));
                      }}
                      disabled={childSeatQuantities.childSeat === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {childSeatQuantities.childSeat}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setChildSeatQuantities((prev) => ({
                          ...prev,
                          childSeat: prev.childSeat + 1,
                        }));
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Booster Seat */}
                <div className="pb-4">
                  <h4 className="font-bold text-gray-900 mb-1">BOOSTER SEAT</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Group 2: 18 a 36 Kg (100-150 cm. ISOFIX)
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    5,22 € day / Unidad
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setChildSeatQuantities((prev) => ({
                          ...prev,
                          boosterSeat: Math.max(0, prev.boosterSeat - 1),
                        }));
                      }}
                      disabled={childSeatQuantities.boosterSeat === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {childSeatQuantities.boosterSeat}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setChildSeatQuantities((prev) => ({
                          ...prev,
                          boosterSeat: prev.boosterSeat + 1,
                        }));
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {(
                      (childSeatQuantities.babySeat +
                        childSeatQuantities.childSeat +
                        childSeatQuantities.boosterSeat) *
                      5.22 *
                      rentalDays
                    ).toFixed(2)}{" "}
                    €
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    const totalSeats =
                      childSeatQuantities.babySeat +
                      childSeatQuantities.childSeat +
                      childSeatQuantities.boosterSeat;
                    
                    if (totalSeats > 0) {
                      // Add child seat to extras
                      const current = form.getValues("extras") || [];
                      if (!current.includes("childSeat")) {
                        const updated = [...current, "childSeat"];
                        form.setValue("extras", updated, { shouldDirty: true });
                        bookingStorage.updateStep("step1", {
                          ...bookingStorage.getStep("step1"),
                          extras: updated,
                          childSeatQuantities: childSeatQuantities,
                        });
                      } else {
                        // Update quantities if already included
                        bookingStorage.updateStep("step1", {
                          ...bookingStorage.getStep("step1"),
                          childSeatQuantities: childSeatQuantities,
                        });
                      }
                      setIsChildSeatModalOpen(false);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2"
                  disabled={
                    childSeatQuantities.babySeat === 0 &&
                    childSeatQuantities.childSeat === 0 &&
                    childSeatQuantities.boosterSeat === 0
                  }
                >
                  ADD +
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
