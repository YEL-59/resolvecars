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
  Loader2,
} from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";
import { coveragePlans, extrasData } from "@/lib/coverageData";
import { useCreateBooking } from "@/hooks/booking.hook";
import { useAddons, getAddonIdByName } from "@/hooks/addons.hook";
import { getAddonId } from "@/lib/addonMapping";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceUpdateKey, setPriceUpdateKey] = useState(0); // Force price recalculation

  // Booking API mutation
  const createBookingMutation = useCreateBooking();

  // Fetch addons from API
  const { data: addonsData, isLoading: isLoadingAddons } = useAddons();
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
    // Force price recalculation
    setPriceUpdateKey(prev => prev + 1);
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
    // Force price recalculation
    setPriceUpdateKey(prev => prev + 1);
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

  const baseRatePrice = useMemo(() => getBaseRatePrice(), [currentPackage, selectedPackage, packageUpdateKey]);
  const baseRateTotal = useMemo(() => baseRatePrice * rentalDays, [baseRatePrice, rentalDays]);

  // Get car's base price from car_prices (separate from package price)
  const carBasePrice = useMemo(() => {
    const car = selectedCar;
    if (!car) return null;

    // Try to get from _apiData.model.car_prices
    const carPrices = car._apiData?.model?.car_prices || car._apiData?.car_prices;
    if (carPrices && Array.isArray(carPrices) && carPrices.length > 0) {
      // Get the first active price or just the first one
      const activePrice = carPrices.find(p => p.is_active !== false) || carPrices[0];
      return {
        price_per_day: activePrice.price_per_day || 0,
        display_price: activePrice.display_price || `$${(activePrice.price_per_day || 0).toFixed(2)}`,
      };
    }

    // Fallback to car.price if available
    if (car.price) {
      return {
        price_per_day: car.price,
        display_price: `$${car.price.toFixed(2)}`,
      };
    }

    return null;
  }, [selectedCar]);

  // Car price is FIXED (not multiplied by days)
  const carBasePriceTotal = useMemo(() => {
    if (!carBasePrice) return 0;
    return carBasePrice.price_per_day || 0; // Fixed price, not per day
  }, [carBasePrice]);

  // Calculate addons total price
  // Use API addon prices when available, otherwise fallback to extrasData prices
  const addonsTotal = useMemo(() => {
    const step1Data = bookingStorage.getStep("step1") || {};
    const selectedExtras = watchedExtras || form.getValues("extras") || [];
    const step1Extras = step1Data.extras || [];
    const allExtras = [...new Set([...selectedExtras, ...step1Extras])];

    let total = 0;

    allExtras.forEach((extraId) => {
      const extra = extrasData.find(e => e.id === extraId);
      if (!extra) return;

      // Get addon from API if available (for accurate pricing)
      let apiAddon = null;
      if (addonsData && Array.isArray(addonsData) && addonsData.length > 0) {
        apiAddon = addonsData.find(a => {
          const addonName = (a.name || "").toLowerCase();
          const extraName = extra.name.toLowerCase();
          return addonName === extraName ||
            addonName.includes(extraName) ||
            extraName.includes(addonName);
        });
      }

      if (extraId === "childSeat") {
        // Child seats: quantity based on child seat types
        const quantities = step1Data.childSeatQuantities || childSeatQuantities;
        const totalChildSeats = (quantities.babySeat || 0) +
          (quantities.childSeat || 0) +
          (quantities.boosterSeat || 0);
        if (totalChildSeats > 0) {
          // Use API price if available, otherwise use extrasData price
          const pricePerSeat = apiAddon ? parseFloat(apiAddon.price_per_day || 0) : (extra.price || 0);
          // Child seats are per_day according to API
          total += pricePerSeat * totalChildSeats * rentalDays;
        }
      } else if (extraId === "foundationDonation") {
        // Donation: use custom amount (not in addons API, so use custom amount)
        const donation = step1Data.donationAmount || donationAmount || customDonation;
        const donationAmountValue = parseFloat(donation) || 0;
        if (donationAmountValue > 0) {
          total += donationAmountValue;
        }
      } else {
        // Other addons: use API price if available, otherwise use extrasData price
        const price = apiAddon ? parseFloat(apiAddon.price_per_day || 0) : (extra.price || 0);
        if (price > 0) {
          // All addons are multiplied by days (except donations which are handled separately)
          total += price * rentalDays;
        }
      }
    });

    return total;
  }, [watchedExtras, childSeatQuantities, donationAmount, customDonation, rentalDays, priceUpdateKey, addonsData]);

  // Calculate grand total (car base price + package price + addons)
  const grandTotal = useMemo(() => {
    const carPrice = carBasePriceTotal || 0;
    return carPrice + baseRateTotal + addonsTotal;
  }, [carBasePriceTotal, baseRateTotal, addonsTotal]);

  // Prepare booking data for API
  const prepareBookingData = () => {
    const step1Data = bookingStorage.getStep("step1") || {};
    const car = bookingStorage.getCar();

    console.log("Step1 data:", step1Data);
    console.log("Selected car:", car);

    if (!car) {
      throw new Error("No car selected. Please select a car first.");
    }

    if (!step1Data.pickupDate || !step1Data.dropoffDate) {
      throw new Error("Missing pickup or dropoff date. Please check your booking details.");
    }

    // Format dates and times
    const formatDateTime = (dateStr, timeStr = null) => {
      try {
        const date = new Date(dateStr);

        // If time is provided separately, use it; otherwise extract from date string
        if (timeStr) {
          const [hours, minutes] = timeStr.split(":");
          date.setHours(parseInt(hours || 12), parseInt(minutes || 0), 0, 0);
        }
        // If date string is ISO format with time, it's already set

        // Format as YYYY-MM-DD HH:mm:ss
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const h = String(date.getHours()).padStart(2, "0");
        const m = String(date.getMinutes()).padStart(2, "0");
        const s = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${h}:${m}:${s}`;
      } catch (error) {
        console.error("Error formatting datetime:", error);
        return null;
      }
    };

    // Get pickup and return times from step1Data or use defaults
    // Times can be stored as pickupTime/returnTime or pickup_time/return_time
    // If dates are ISO strings with time, we can extract time from them
    const pickupTime = step1Data.pickupTime || step1Data.pickup_time || null;
    const returnTime = step1Data.returnTime || step1Data.return_time || step1Data.dropoffTime || null;

    const pickupDatetime = formatDateTime(step1Data.pickupDate, pickupTime);
    const returnDatetime = formatDateTime(step1Data.dropoffDate, returnTime);

    if (!pickupDatetime || !returnDatetime) {
      throw new Error("Invalid date format");
    }

    // Get protection plan ID - check if package has protection_plan_id field first
    // The API might expect protection_plan_id which could be different from package id
    let finalProtectionPlanId = null;

    // First, try to use protection_plan_id from the package if it exists
    if (currentPackage?.protection_plan_id) {
      finalProtectionPlanId = typeof currentPackage.protection_plan_id === "number"
        ? currentPackage.protection_plan_id
        : parseInt(currentPackage.protection_plan_id);
    }
    // If not, try to use the original package data's protection_plan_id
    else if (currentPackage?._original?.protection_plan_id) {
      finalProtectionPlanId = typeof currentPackage._original.protection_plan_id === "number"
        ? currentPackage._original.protection_plan_id
        : parseInt(currentPackage._original.protection_plan_id);
    }
    // Fallback to package ID
    else if (currentPackage?.id) {
      finalProtectionPlanId = typeof currentPackage.id === "number"
        ? currentPackage.id
        : parseInt(currentPackage.id);
    }
    // Last resort: try to find package by type
    else {
      const pkg = carPackages.find(p => {
        const pkgType = p.package_type?.toLowerCase();
        const selected = selectedPackage?.toString().toLowerCase();
        return pkgType === selected || p.id?.toString() === selected;
      });

      // Try protection_plan_id from found package
      if (pkg?.protection_plan_id) {
        finalProtectionPlanId = typeof pkg.protection_plan_id === "number"
          ? pkg.protection_plan_id
          : parseInt(pkg.protection_plan_id);
      } else if (pkg?._original?.protection_plan_id) {
        finalProtectionPlanId = typeof pkg._original.protection_plan_id === "number"
          ? pkg._original.protection_plan_id
          : parseInt(pkg._original.protection_plan_id);
      } else if (pkg?.id) {
        finalProtectionPlanId = typeof pkg.id === "number" ? pkg.id : parseInt(pkg.id);
      }
    }

    if (!finalProtectionPlanId) {
      console.error("Could not determine protection_plan_id. Package data:", {
        currentPackage,
        selectedPackage,
        carPackages: carPackages.map(p => ({ id: p.id, type: p.package_type, protection_plan_id: p.protection_plan_id, original: p._original })),
      });
      throw new Error(`Invalid protection plan. Selected: ${selectedPackage}, Current package: ${JSON.stringify(currentPackage)}`);
    }

    console.log("Protection plan ID:", finalProtectionPlanId, "from package:", {
      id: currentPackage?.id,
      protection_plan_id: currentPackage?.protection_plan_id,
      original_protection_plan_id: currentPackage?._original?.protection_plan_id,
      fullPackage: currentPackage,
    });

    // Prepare addons array
    const addons = [];
    const selectedExtras = form.getValues("extras") || [];
    const step1Extras = step1Data.extras || [];
    const allExtras = [...new Set([...selectedExtras, ...step1Extras])];

    // Process each extra/addon
    allExtras.forEach((extraId) => {
      // Skip foundation donation - it's not in the addons API
      // (It might be handled separately or not sent as an addon)
      if (extraId === "foundationDonation") {
        console.log("Skipping foundationDonation - not in addons API");
        return;
      }

      // Try to get addon ID from API first, then fallback to mapping
      let addonId = null;
      const extra = extrasData.find(e => e.id === extraId);

      if (addonsData && Array.isArray(addonsData) && addonsData.length > 0) {
        // Try to find addon by matching name with extra name (prioritize API matching)
        if (extra) {
          // Try exact name match first
          addonId = getAddonIdByName(addonsData, extra.name);

          // If not found, try partial name matching
          if (!addonId && extra.name) {
            const matchingAddon = addonsData.find(a => {
              const addonName = (a.name || "").toLowerCase();
              const extraName = extra.name.toLowerCase();
              // Match if names are similar (e.g., "Child car seats" vs "Child car seats")
              return addonName === extraName ||
                addonName.includes(extraName) ||
                extraName.includes(addonName);
            });
            addonId = matchingAddon?.id || null;
          }
        }

        // If not found in API addons, fallback to hardcoded mapping
        if (!addonId) {
          addonId = getAddonId(extraId);
        }
      } else {
        // Fallback to hardcoded mapping if API addons not available
        addonId = getAddonId(extraId);
      }

      if (addonId) {
        console.log(`Mapped extra "${extraId}" (${extra?.name || "unknown"}) to addon ID: ${addonId}`);

        // Special handling for child seats (quantity based on child seat types)
        if (extraId === "childSeat") {
          const quantities = step1Data.childSeatQuantities || childSeatQuantities;
          const totalChildSeats = (quantities.babySeat || 0) +
            (quantities.childSeat || 0) +
            (quantities.boosterSeat || 0);

          if (totalChildSeats > 0) {
            addons.push({
              id: addonId,
              quantity: totalChildSeats,
            });
          }
        } else {
          // Other addons have quantity 1
          addons.push({
            id: addonId,
            quantity: 1,
          });
        }
      } else {
        console.warn(`Could not find addon ID for extra: ${extraId} (${extra?.name || "unknown"})`);
      }
    });

    // Validate required fields
    const pickupLocationId = parseInt(step1Data.pickupLocationId || step1Data.pickup_location_id || 0);
    const returnLocationId = parseInt(step1Data.dropoffLocationId || step1Data.return_location_id || step1Data.pickupLocationId || step1Data.pickup_location_id || 0);

    if (!pickupLocationId || pickupLocationId === 0) {
      throw new Error("Pickup location is required. Please select a pickup location.");
    }

    if (!returnLocationId || returnLocationId === 0) {
      throw new Error("Return location is required. Please select a return location.");
    }

    if (!finalProtectionPlanId) {
      throw new Error("Protection plan is required. Please select a protection plan.");
    }

    if (!pickupDatetime || !returnDatetime) {
      throw new Error("Pickup and return dates/times are required. Please check your booking details.");
    }

    const bookingPayload = {
      car_id: car.id,
      pickup_location_id: pickupLocationId,
      return_location_id: returnLocationId,
      pickup_datetime: pickupDatetime,
      return_datetime: returnDatetime,
      package_id: finalProtectionPlanId,
      addons: addons, // Always include as array (can be empty)
    };

    console.log("=== BOOKING PAYLOAD DEBUG ===");
    console.log("Final booking payload:", JSON.stringify(bookingPayload, null, 2));
    console.log("Selected package:", selectedPackage);
    console.log("Current package:", currentPackage);
    console.log("Car packages:", carPackages.map(p => ({
      id: p.id,
      package_type: p.package_type,
      protection_plan_id: p.protection_plan_id,
      original: p._original,
    })));
    console.log("Available addons from API:", addonsData);
    console.log("Selected extras:", allExtras);
    console.log("Mapped addons:", addons);
    console.log("Pickup location ID:", pickupLocationId);
    console.log("Return location ID:", returnLocationId);
    console.log("Protection plan ID:", finalProtectionPlanId);
    console.log("Pickup datetime:", pickupDatetime);
    console.log("Return datetime:", returnDatetime);
    console.log("=============================");

    return bookingPayload;
  };

  // Handle form submission
  const handleSubmit = async (data) => {
    console.log("Form submitted, data:", data);
    try {
      setIsSubmitting(true);
      console.log("Preparing booking data...");

      // Prepare booking data
      const bookingData = prepareBookingData();
      console.log("Booking data prepared:", bookingData);

      // Call booking API
      console.log("Calling booking API...");
      const response = await createBookingMutation.mutateAsync(bookingData);
      console.log("Booking API response:", response);

      // Store booking response
      bookingStorage.updateStep("step1", {
        ...bookingStorage.getStep("step1"),
        bookingId: response.data?.id || response.id,
        bookingResponse: response,
      });

      console.log("Moving to next step...");
      // Move to next step
      onNext();
    } catch (error) {
      console.error("Booking error:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response?.data,
        errors: error?.errors,
        status: error?.response?.status,
        stack: error?.stack,
      });

      // Build detailed error message
      let errorMessage = error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create booking. Please try again.";

      // Add validation errors if available
      if (error?.response?.status === 422 && error?.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorDetails = Object.entries(validationErrors)
          .map(([field, messages]) => {
            const fieldMessages = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${fieldMessages.join(", ")}`;
          })
          .join("\n");
        errorMessage = `${errorMessage}\n\nValidation Errors:\n${errorDetails}`;
      }

      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  // Handle form validation errors
  const onError = (errors) => {
    console.error("Form validation errors:", errors);
    console.error("Form state:", form.formState);
    // Don't block submission for optional fields - just log
    if (Object.keys(errors).length > 0) {
      console.warn("Form has validation errors but continuing anyway:", errors);
    }
  };

  // Alternative submit handler that bypasses validation
  const handleSubmitDirect = async (e) => {
    e?.preventDefault?.();
    console.log("Direct submit handler called");
    try {
      setIsSubmitting(true);
      const bookingData = prepareBookingData();
      console.log("Booking data:", bookingData);
      const response = await createBookingMutation.mutateAsync(bookingData);
      console.log("Booking response:", response);
      bookingStorage.updateStep("step1", {
        ...bookingStorage.getStep("step1"),
        bookingId: response.data?.id || response.id,
        bookingResponse: response,
      });
      onNext();
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage = error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create booking. Please try again.";
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => {
        e.preventDefault();
        console.log("Form onSubmit event");
        // Try form validation first, but fallback to direct submit
        form.handleSubmit(handleSubmit, () => {
          console.log("Form validation failed, trying direct submit");
          handleSubmitDirect();
        })();
      }} className="space-y-6">
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
                  {grandTotal.toFixed(2)} €
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3">
                  SUMMARY OF YOUR RENTAL
                </h4>
                <div className="space-y-2 text-sm">
                  {/* Car Base Price - Fixed price, not per day */}
                  {carBasePrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        Car Rental
                      </span>
                      <span className="text-gray-900 font-medium">
                        {carBasePriceTotal.toFixed(2)} €
                      </span>
                    </div>
                  )}

                  {/* Package Price */}
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
                    <span className="text-gray-900 font-medium">
                      {baseRateTotal.toFixed(2)} €
                    </span>
                  </div>

                  {/* Display all selected addons with prices */}
                  {watchedExtras.map((extraId) => {
                    const extra = extrasData.find(e => e.id === extraId);
                    if (!extra) return null;

                    let price = 0;
                    let label = extra.name;

                    if (extraId === "childSeat") {
                      const quantities = bookingStorage.getStep("step1")?.childSeatQuantities || childSeatQuantities;
                      const totalChildSeats = (quantities.babySeat || 0) +
                        (quantities.childSeat || 0) +
                        (quantities.boosterSeat || 0);
                      if (totalChildSeats > 0 && extra.price > 0) {
                        // Child seats: multiply by quantity and days
                        price = extra.price * totalChildSeats * rentalDays;
                        label = `${extra.name} (${totalChildSeats}x)`;
                      } else {
                        return null;
                      }
                    } else if (extraId === "foundationDonation") {
                      // Donations are fixed amounts, not multiplied by days
                      const donation = bookingStorage.getStep("step1")?.donationAmount || donationAmount || customDonation;
                      price = parseFloat(donation) || 0;
                      if (price <= 0) return null;
                    } else if (extra.price > 0) {
                      // All other addons are multiplied by days
                      price = extra.price * rentalDays;
                    } else {
                      return null; // Skip free items from summary
                    }

                    return (
                      <div key={extraId} className="flex justify-between">
                        <span className="text-gray-700">{label}</span>
                        <span className="text-gray-900 font-medium">
                          {price.toFixed(2)} €
                        </span>
                      </div>
                    );
                  })}
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
                <div className="space-y-1">
                  {carBasePrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Car Price:</span>
                      <span className="text-gray-900 font-medium">
                        {carBasePriceTotal.toFixed(2)} € (fixed)
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package Rate:</span>
                    <span className="text-gray-900 font-medium">
                      {baseRatePrice.toFixed(2)} €/day
                    </span>
                  </div>
                  {addonsTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Addons:</span>
                      <span className="text-gray-900 font-medium">
                        {addonsTotal.toFixed(2)} €
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-semibold">Total:</span>
                    <span className="text-gray-900 font-bold">
                      {grandTotal.toFixed(2)} €
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">
                  {carBasePriceTotal > 0 && `${carBasePriceTotal.toFixed(0)} € car + `}
                  {baseRateTotal.toFixed(0)} € package ({rentalDays} days)
                  {addonsTotal > 0 && ` + ${addonsTotal.toFixed(2)} € addons`}
                </p>
              </div>

              {/* Loyalty Points */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Your booking gives you{" "}
                  {Math.floor(grandTotal)}{" "}
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
                                          donationAmount: 0,
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
                                            donationAmount: amount,
                                          });
                                        } else {
                                          bookingStorage.updateStep("step1", {
                                            ...bookingStorage.getStep("step1"),
                                            donationAmount: amount,
                                          });
                                        }
                                      }
                                      setPriceUpdateKey(prev => prev + 1);
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
                                                donationAmount: amount,
                                              });
                                            } else {
                                              bookingStorage.updateStep("step1", {
                                                ...bookingStorage.getStep("step1"),
                                                donationAmount: amount,
                                              });
                                            }
                                            setPriceUpdateKey(prev => prev + 1);
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
            type="button"
            disabled={isSubmitting || createBookingMutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              console.log("Continue button clicked");
              console.log("Form state:", {
                isValid: form.formState.isValid,
                errors: form.formState.errors,
                isSubmitting: isSubmitting,
                isPending: createBookingMutation.isPending,
              });
              // Directly call the submit handler
              handleSubmitDirect();
            }}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || createBookingMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                CONTINUE
                <ArrowRight className="w-5 h-5" />
              </>
            )}
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
                        setPriceUpdateKey(prev => prev + 1);
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
                        setPriceUpdateKey(prev => prev + 1);
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
                        setPriceUpdateKey(prev => prev + 1);
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
                        setPriceUpdateKey(prev => prev + 1);
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
                        setPriceUpdateKey(prev => prev + 1);
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
                        setPriceUpdateKey(prev => prev + 1);
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
                      setPriceUpdateKey(prev => prev + 1);
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
