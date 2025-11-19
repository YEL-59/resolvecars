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
  const [packageUpdateKey, setPackageUpdateKey] = useState(0); // Force re-render when package changes

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
      const packageId = existing.protectionPlan || "premium";

      if (packageId === "premium") {
        // PREMIUM: Already has maximum coverage, no cards to show
        setSelectedCoverage("premium");
        form.setValue("coveragePlan", "premium");
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
      } else if (packageId === "smart") {
        // SMART: Default to premium cover
        setSelectedCoverage("premium");
        form.setValue("coveragePlan", "premium");
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
      } else if (packageId === "standard") {
        // STANDARD: Default to premium cover
        setSelectedCoverage("premium");
        form.setValue("coveragePlan", "premium");
      } else if (packageId === "superPremium") {
        setSelectedCoverage("superPremium");
        form.setValue("coveragePlan", "superPremium");
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
  }, [packageUpdateKey]);

  // Get car packages for upgrade pricing
  const carPackages = useMemo(() => {
    const car = bookingStorage.getCar();
    return car?.packages || [];
  }, []);

  // Get upgrade package data
  const getUpgradePackage = (packageType) => {
    if (!packageType) return null;
    const packageTypeLower = packageType.toString().toLowerCase();
    return carPackages.find(pkg => {
      const pkgType = pkg.package_type?.toLowerCase();
      const pkgId = pkg.id?.toString().toLowerCase();
      // Match by package_type or by ID if they match
      return pkgType === packageTypeLower || pkgId === packageTypeLower;
    });
  };

  // Get current package - try to match by ID first, then by package_type
  const getCurrentPackage = () => {
    if (!selectedPackage) return null;
    const selectedLower = selectedPackage.toString().toLowerCase();
    // First try to find by ID
    let found = carPackages.find(pkg =>
      pkg.id?.toString().toLowerCase() === selectedLower
    );
    // If not found by ID, try by package_type
    if (!found) {
      found = carPackages.find(pkg =>
        pkg.package_type?.toLowerCase() === selectedLower
      );
    }
    return found || null;
  };

  const premiumUpgradePkg = getUpgradePackage("premium");
  const standardUpgradePkg = getUpgradePackage("standard");
  const smartUpgradePkg = getUpgradePackage("smart");
  const currentPackage = getCurrentPackage();

  // Get current package type for determining which cards to show
  const currentPackageType = currentPackage?.package_type?.toLowerCase() || selectedPackage?.toString().toLowerCase() || "premium";

  // Determine which upgrade cards to show based on package
  // PREMIUM: No cards (already has maximum coverage) - show message
  // SMART: Show 2 upgrade cards (Premium and Standard)
  // STANDARD: Show 2 upgrade cards (Premium and Smart)
  const showPremiumUpgrade = (currentPackageType === "smart" || currentPackageType === "standard");
  const showStandardUpgrade = currentPackageType === "smart";
  const showSmartUpgrade = currentPackageType === "standard";

  // Calculate upgrade prices (difference between upgrade package and current package)
  const calculateUpgradePrice = (upgradePkg) => {
    if (!upgradePkg || !currentPackage) return 0;
    const upgradePrice = upgradePkg.price_per_day || 0;
    const currentPrice = currentPackage.price_per_day || 0;
    return Math.max(0, upgradePrice - currentPrice);
  };

  const premiumUpgradePrice = calculateUpgradePrice(premiumUpgradePkg);
  const standardUpgradePrice = calculateUpgradePrice(standardUpgradePkg);
  const smartUpgradePrice = calculateUpgradePrice(smartUpgradePkg);

  const premiumUpgradeTotal = premiumUpgradePrice * rentalDays;
  const standardUpgradeTotal = standardUpgradePrice * rentalDays;
  const smartUpgradeTotal = smartUpgradePrice * rentalDays;

  // Handle package upgrade selection
  const handlePackageUpgrade = (upgradePackageType) => {
    // Find the upgrade package to get its actual ID/type
    const upgradePkg = getUpgradePackage(upgradePackageType);
    // Store the package_type (more reliable than ID) or fallback to the type string
    const packageIdentifier = upgradePkg?.package_type || upgradePackageType;

    bookingStorage.updateStep("step1", {
      ...bookingStorage.getStep("step1"),
      protectionPlan: packageIdentifier,
    });
    // Force re-render by updating the key
    setPackageUpdateKey(prev => prev + 1);
  };

  // Calculate prices based on selected package from car data
  const getBaseRatePrice = () => {
    if (currentPackage) {
      // Use rental_calculation if available (from search API), otherwise use price_per_day
      const rentalCalc = currentPackage.rental_calculation;
      if (rentalCalc) {
        return rentalCalc.daily_rate || rentalCalc.base_rental_cost || currentPackage.price_per_day || 0;
      }
      return currentPackage.price_per_day || 0;
    }
    // Fallback to hardcoded prices if package data not available
    const packagePrices = {
      premium: 25.83,
      smart: 24.57,
      standard: 13.18,
    };
    return packagePrices[selectedPackage] || 25.83;
  };

  const baseRatePrice = getBaseRatePrice();
  const baseRateTotal = baseRatePrice * rentalDays;

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
                  {currentPackageType === "premium" ? "Premium" : currentPackageType === "smart" ? "Smart" : currentPackageType === "lite" ? "Lite" : "Standard"} Rate x {rentalDays} days
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {baseRateTotal.toFixed(2)} €
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3">
                  SUMMARY OF YOUR RENTAL
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      {currentPackageType === "premium"
                        ? "Premium Package"
                        : currentPackageType === "smart"
                          ? "Smart Package"
                          : currentPackageType === "standard"
                            ? "Standard Package"
                            : "Package"}
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
                  {baseRatePrice.toFixed(2)} €/day
                </p>
                <p className="text-gray-600">
                  {baseRateTotal.toFixed(0)} € ({rentalDays} days)
                </p>
              </div>

              {/* Loyalty Points */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Your booking gives you{" "}
                  {Math.floor(baseRateTotal)}{" "}
                  POINTS OK CLUB
                </p>
              </div>
            </div>
          </div>

          {/* Right Main Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Upgrade Selection */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Protect your vacations! Select your cover of choice
              </h2>

              {/* Show message for PREMIUM package (no upgrade cards) */}
              {currentPackageType === "premium" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-700">
                    Your Premium package already includes maximum coverage. No additional coverage options available.
                  </p>
                </div>
              )}

              {/* Show upgrade cards for SMART and STANDARD packages */}
              {(showPremiumUpgrade || showStandardUpgrade || showSmartUpgrade) && (
                <div className={`grid gap-4 ${(showPremiumUpgrade && (showStandardUpgrade || showSmartUpgrade))
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
                  }`}>
                  {/* Premium Upgrade Card - Show for SMART and STANDARD */}
                  {showPremiumUpgrade && premiumUpgradePkg && (
                    <div className="border-2 rounded-lg overflow-hidden border-gray-200 bg-white hover:border-blue-600 transition-colors">
                      <div className="bg-blue-900 text-white px-4 py-2 text-xs font-semibold">
                        PREMIUM
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <p className="text-2xl font-bold text-gray-900">
                            {premiumUpgradeTotal > 0 ? `+${premiumUpgradeTotal.toFixed(2)}` : "0.00"} €
                          </p>
                          <p className="text-sm text-gray-600">
                            {premiumUpgradePrice > 0 ? `+${premiumUpgradePrice.toFixed(2)} €/day` : "Included"} for {rentalDays} days
                          </p>
                        </div>

                        <div className="space-y-2 mb-4">
                          <p className="text-sm font-medium text-gray-700">
                            Included in the price:
                          </p>
                          {(premiumUpgradePkg.features || []).slice(0, 5).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          type="button"
                          onClick={() => handlePackageUpgrade("premium")}
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Upgrade to Premium
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Standard Upgrade Card - Show for SMART */}
                  {showStandardUpgrade && standardUpgradePkg && (
                    <div className="border-2 rounded-lg overflow-hidden border-gray-200 bg-white hover:border-blue-600 transition-colors">
                      <div className="bg-gray-600 text-white px-4 py-2 text-xs font-semibold">
                        STANDARD
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <p className="text-2xl font-bold text-gray-900">
                            {standardUpgradeTotal < 0 ? `${standardUpgradeTotal.toFixed(2)}` : standardUpgradeTotal === 0 ? "0.00" : `+${standardUpgradeTotal.toFixed(2)}`} €
                          </p>
                          <p className="text-sm text-gray-600">
                            {standardUpgradePrice < 0 ? `${standardUpgradePrice.toFixed(2)} €/day` : standardUpgradePrice === 0 ? "Same price" : `+${standardUpgradePrice.toFixed(2)} €/day`} for {rentalDays} days
                          </p>
                        </div>

                        <div className="space-y-2 mb-4">
                          <p className="text-sm font-medium text-gray-700">
                            Included in the price:
                          </p>
                          {(standardUpgradePkg.features || []).slice(0, 5).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          type="button"
                          onClick={() => handlePackageUpgrade("standard")}
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {standardUpgradePrice < 0 ? "Downgrade to Standard" : standardUpgradePrice === 0 ? "Select Standard" : "Upgrade to Standard"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Smart Upgrade Card - Show for STANDARD */}
                  {showSmartUpgrade && smartUpgradePkg && (
                    <div className="border-2 rounded-lg overflow-hidden border-gray-200 bg-white hover:border-blue-600 transition-colors">
                      <div className="bg-gray-600 text-white px-4 py-2 text-xs font-semibold">
                        SMART
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <p className="text-2xl font-bold text-gray-900">
                            {smartUpgradeTotal < 0 ? `${smartUpgradeTotal.toFixed(2)}` : smartUpgradeTotal === 0 ? "0.00" : `+${smartUpgradeTotal.toFixed(2)}`} €
                          </p>
                          <p className="text-sm text-gray-600">
                            {smartUpgradePrice < 0 ? `${smartUpgradePrice.toFixed(2)} €/day` : smartUpgradePrice === 0 ? "Same price" : `+${smartUpgradePrice.toFixed(2)} €/day`} for {rentalDays} days
                          </p>
                        </div>

                        <div className="space-y-2 mb-4">
                          <p className="text-sm font-medium text-gray-700">
                            Included in the price:
                          </p>
                          {(smartUpgradePkg.features || []).slice(0, 5).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          type="button"
                          onClick={() => handlePackageUpgrade("smart")}
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {smartUpgradePrice < 0 ? "Downgrade to Smart" : smartUpgradePrice === 0 ? "Select Smart" : "Upgrade to Smart"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                                : `${extra.price.toFixed(2)} €/${extra.pricingType === "per_day" ? "day" : "booking"
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
