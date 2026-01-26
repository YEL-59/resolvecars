"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSearchParams } from "next/navigation";
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
import { getAddonId, getAddonByExtraId } from "@/lib/addonMapping";
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
  const searchParams = useSearchParams();
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
  const { data: addonsData, isLoading: isLoadingAddons, refetch: refetchAddons } = useAddons();

  // Refetch addons data on component mount to ensure fresh data
  useEffect(() => {
    console.log("Step1Rental: Component mounted - refetching addons data to get latest prices...");
    refetchAddons();
  }, []); // Run only on mount

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

  // Track previous car ID to detect car changes
  const [previousCarId, setPreviousCarId] = useState(() => {
    // Initialize with stored car ID if available
    const existing = bookingStorage.getStep("step1") || {};
    return existing.lastCarId || null;
  });

  // Clear extras/addons when car changes or on initial load with different car
  useEffect(() => {
    const currentCarId = selectedCar?.id;
    const existing = bookingStorage.getStep("step1") || {};
    const storedCarId = existing.lastCarId || previousCarId;

    // If car has changed or this is a new car selection, clear extras
    if (currentCarId && currentCarId !== storedCarId) {
      console.log("Car changed or new car selected. Clearing extras/addons.", {
        previousCarId: storedCarId,
        newCarId: currentCarId,
      });

      // Clear all extras (will be re-added based on package type)
      const clearedExtras = [];

      // Clear child seat quantities
      const clearedChildSeatQuantities = {
        babySeat: 0,
        childSeat: 0,
        boosterSeat: 0,
      };

      // Clear donation
      const clearedDonationAmount = 0;
      const clearedCustomDonation = "";

      // Update step1 with cleared extras and store current car ID
      bookingStorage.updateStep("step1", {
        ...existing,
        extras: clearedExtras,
        childSeatQuantities: clearedChildSeatQuantities,
        donationAmount: clearedDonationAmount,
        customDonation: clearedCustomDonation,
        lastCarId: currentCarId, // Store current car ID to track changes
        // Clear booking-related data when car changes
        bookingId: null,
        bookingResponse: null,
        bookingData: null,
        total_amount: null,
        total: null,
        subtotal: null,
        taxAmount: null,
      });

      // Update form values and local state
      form.setValue("extras", clearedExtras);
      setChildSeatQuantities(clearedChildSeatQuantities);
      setDonationAmount(clearedDonationAmount);
      setCustomDonation(clearedCustomDonation);
      setPriceUpdateKey(prev => prev + 1); // Force price recalculation

      // Update previous car ID
      setPreviousCarId(currentCarId);
    } else if (currentCarId && !storedCarId) {
      // First time selecting this car, just store the car ID
      bookingStorage.updateStep("step1", {
        ...existing,
        lastCarId: currentCarId,
      });
      setPreviousCarId(currentCarId);
    }
  }, [selectedCar?.id, form, previousCarId]);

  useEffect(() => {
    const existing = bookingStorage.getStep("step1") || {};
    let needsUpdate = false;

    // Debug: Log existing booking data on mount
    console.log("Step1Rental: Loading existing booking data:", {
      pickupLocationId: existing.pickupLocationId,
      pickupLocationPrice: existing.pickupLocationPrice,
      dropoffLocationId: existing.dropoffLocationId,
      returnLocationPrice: existing.returnLocationPrice,
      locationFee: existing.locationFee,
      sameStore: existing.sameStore,
    });

    // If location IDs are missing from bookingStorage, try to get from URL params
    if (!existing.pickupLocationId && !existing.pickup_location_id) {
      const urlPickupLocationId = searchParams.get("pickup_location_id");
      if (urlPickupLocationId) {
        const pickupId = parseInt(urlPickupLocationId);
        existing.pickupLocationId = pickupId;
        existing.pickup_location_id = pickupId;
        needsUpdate = true;
        console.log("Restored pickupLocationId from URL:", pickupId);
      }
    }

    if (!existing.dropoffLocationId && !existing.return_location_id) {
      const urlReturnLocationId = searchParams.get("return_location_id");
      if (urlReturnLocationId) {
        const returnId = parseInt(urlReturnLocationId);
        existing.dropoffLocationId = returnId;
        existing.return_location_id = returnId;
        needsUpdate = true;
        console.log("Restored dropoffLocationId from URL:", returnId);
      } else if (existing.pickupLocationId) {
        // If same store, use pickup location as return location
        existing.dropoffLocationId = existing.pickupLocationId;
        existing.return_location_id = existing.pickupLocationId;
        needsUpdate = true;
        console.log("Using pickupLocationId as dropoffLocationId (same store)");
      }
    }

    // Update bookingStorage with any missing data from URL
    if (needsUpdate) {
      bookingStorage.updateStep("step1", existing);
      console.log("Updated step1 with location IDs:", {
        pickupLocationId: existing.pickupLocationId,
        dropoffLocationId: existing.dropoffLocationId,
      });
    }

    if (Object.keys(existing).length > 0) {
      form.reset({ ...form.getValues(), ...existing });
      // Set coverage based on protection plan from car card selection
      const packageId = existing.protectionPlan || "premium";

      if (packageId === "premium") {
        // PREMIUM: Already has maximum coverage, no cards to show
        setSelectedCoverage("premium");
        form.setValue("coveragePlan", "premium");
      } else if (packageId === "smart") {
        // SMART: Default to premium cover
        setSelectedCoverage("premium");
        form.setValue("coveragePlan", "premium");
      } else if (packageId === "standard") {
        // STANDARD: Default to premium cover
        setSelectedCoverage("premium");
        form.setValue("coveragePlan", "premium");
      } else if (packageId === "superPremium") {
        setSelectedCoverage("superPremium");
        form.setValue("coveragePlan", "superPremium");
      }
      // Load existing extras from storage (no auto-include)
      const currentExtras = existing.extras || [];
      form.setValue("extras", currentExtras);
    } else {
      // Default to premium if no existing data
      setSelectedCoverage("premium");
      form.setValue("coveragePlan", "premium");
      form.setValue("extras", []); // Start with no extras selected
    }
    // Force price recalculation after data is loaded
    setPriceUpdateKey(prev => prev + 1);
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
  // Package price_per_day is already the discounted price if has_discount is true
  const getBaseRatePrice = () => {
    if (currentPackage) {
      // Use rental_calculation if available (from search API), otherwise use price_per_day
      const rentalCalc = currentPackage.rental_calculation;
      if (rentalCalc) {
        return rentalCalc.daily_rate || rentalCalc.base_rental_cost || currentPackage.price_per_day || 0;
      }

      // Use price_per_day from package (this is already discounted if has_discount is true)
      // The API returns price_per_day as the final price (discounted if applicable)
      const packagePrice = parseFloat(currentPackage.price_per_day || 0);

      // If has_discount is true, price_per_day is already the discounted price
      // If has_discount is false, price_per_day is the regular price
      // So we just use price_per_day directly
      return packagePrice;
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

  // Clear total_amount from previous booking when selections change (if no bookingId exists)
  // This ensures we recalculate instead of using old totals
  useEffect(() => {
    const step1Data = bookingStorage.getStep("step1") || {};
    // If we have total_amount but no bookingId, clear it so we recalculate
    if (step1Data.total_amount && !step1Data.bookingId) {
      bookingStorage.updateStep("step1", {
        ...step1Data,
        total_amount: undefined, // Clear old total_amount
      });
    }
  }, [watchedExtras, selectedPackage, rentalDays, priceUpdateKey]);

  // Get car's base price from car_prices or current_price (same logic as CarFlexView)
  // Priority: current_price > car_prices > model.car_prices > car.price
  const carBasePrice = useMemo(() => {
    const car = selectedCar;
    if (!car) return null;

    // Prioritize "car price" field from user request
    const rawCarPrice = car["car price"] !== undefined ? car["car price"] :
      (car._apiData?.["car price"] !== undefined ? car._apiData["car price"] :
        (car.price || 0));

    // If we have a price, return it with the CURRENT selection's rental days
    if (rawCarPrice !== undefined) {
      const priceValue = parseFloat(rawCarPrice);
      return {
        price_per_day: priceValue,
        display_price: `${priceValue.toFixed(2)} €`,
        rental_days: rentalDays, // Use user's selected days
        total_price: priceValue * rentalDays
      };
    }

    // Fallback: check current_price (directly on car object from API)
    const currentPrice = car._apiData?.current_price || car.current_price;
    if (currentPrice && currentPrice.price_per_day) {
      return {
        price_per_day: parseFloat(currentPrice.price_per_day) || 0,
        display_price: currentPrice.display_price || `${parseFloat(currentPrice.price_per_day || 0).toFixed(2)} €`,
        rental_days: rentalDays,
        total_price: (parseFloat(currentPrice.price_per_day) || 0) * rentalDays,
      };
    }

    return null;
  }, [selectedCar, rentalDays]);

  // Car base price total = calculated from car_prices (days × price_per_day)
  const carBasePriceTotal = useMemo(() => {
    if (!carBasePrice) return 0;
    // Use pre-calculated total_price if available (from car_prices date range)
    if (carBasePrice.total_price && carBasePrice.total_price > 0) {
      return carBasePrice.total_price;
    }
    // Fallback: use price_per_day × rentalDays
    return (carBasePrice.price_per_day || 0) * rentalDays;
  }, [carBasePrice, rentalDays]);

  // Calculate addons total price
  // Use API addon prices when available, otherwise fallback to extrasData prices
  const addonsTotal = useMemo(() => {
    const step1Data = bookingStorage.getStep("step1") || {};
    const selectedExtras = watchedExtras || form.getValues("extras") || [];
    const step1Extras = step1Data.extras || [];
    const allExtras = [...new Set([...selectedExtras, ...step1Extras])];

    let total = 0;

    allExtras.forEach((extraId) => {
      // Check if extraId is an API addon ID (numeric string)
      const isApiAddonId = !isNaN(parseInt(extraId));

      if (isApiAddonId && addonsData && Array.isArray(addonsData)) {
        // Find API addon by ID
        const apiAddon = addonsData.find(a => a.id.toString() === extraId);
        if (apiAddon) {
          const price = parseFloat(apiAddon.price_per_day) || 0;
          const isPerDay = apiAddon.addon_type === "days";
          // Per day addons are multiplied by rental days, per booking addons are fixed
          total += isPerDay ? price * rentalDays : price;
          return;
        }
      }

      // Check hardcoded extras (foundationDonation, childSeat)
      const extra = extrasData.find(e => e.id === extraId);
      if (!extra) return;

      // Get addon from API if available (for accurate pricing by name matching)
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
          // Use hardcoded price for child seats (not in API)
          const pricePerSeat = extra.price || 5.22;
          // Child seats are per_day
          total += pricePerSeat * totalChildSeats * rentalDays;
        }
      } else if (extraId === "foundationDonation") {
        // Donation: use custom amount (not in addons API)
        const donation = step1Data.donationAmount || donationAmount || customDonation;
        const donationAmountValue = parseFloat(donation) || 0;
        if (donationAmountValue > 0) {
          total += donationAmountValue;
        }
      } else {
        // Other extras: use API price if available, otherwise use extrasData price
        if (apiAddon) {
          const price = parseFloat(apiAddon.price_per_day) || 0;
          const isPerDay = apiAddon.addon_type === "days";
          total += isPerDay ? price * rentalDays : price;
        } else {
          const price = extra.price || 0;
          const isPerDay = extra.pricingType === "per_day";
          total += isPerDay ? price * rentalDays : price;
        }
      }
    });

    return total;
  }, [watchedExtras, childSeatQuantities, donationAmount, customDonation, rentalDays, priceUpdateKey, addonsData]);

  // Calculate location fee from bookingStorage
  // If same location: 0 (no charge), if different: sum of both prices
  const locationFee = useMemo(() => {
    const step1Data = bookingStorage.getStep("step1") || {};

    console.log("Step1Rental: Calculating location fee from step1Data:", {
      locationFee: step1Data.locationFee,
      pickupLocationPrice: step1Data.pickupLocationPrice,
      returnLocationPrice: step1Data.returnLocationPrice,
      sameStore: step1Data.sameStore,
    });

    // If locationFee was pre-calculated in HeroSections/carsHeroSection, use it
    if (typeof step1Data.locationFee === 'number') {
      console.log("Step1Rental: Using pre-calculated locationFee:", step1Data.locationFee);
      return step1Data.locationFee;
    }

    // Otherwise calculate from individual location prices
    const pickupPrice = parseFloat(step1Data.pickupLocationPrice) || 0;
    const returnPrice = parseFloat(step1Data.returnLocationPrice) || 0;
    const sameStore = step1Data.sameStore !== false; // Default to true

    // If same location: 0, if different: sum of both prices
    const calculatedFee = sameStore ? 0 : (pickupPrice + returnPrice);
    console.log("Step1Rental: Calculated locationFee:", calculatedFee);
    return calculatedFee;
  }, [priceUpdateKey, packageUpdateKey]); // Added packageUpdateKey to trigger recalculation

  // Get out-of-office fee (40 if pickup or return time is outside office hours 8:00-21:00)
  const outOfOfficeFee = useMemo(() => {
    const step1Data = bookingStorage.getStep("step1") || {};
    return parseFloat(step1Data.outOfOfficeFee) || 0;
  }, [priceUpdateKey, packageUpdateKey]);

  // Calculate grand total (car base price + package price + addons + location fee)
  // Only use total_amount from booking API if booking has already been created
  // Otherwise, always recalculate based on current selections
  const grandTotal = useMemo(() => {
    const step1Data = bookingStorage.getStep("step1") || {};

    // Only use total_amount from booking API if we have a bookingId (booking already created)
    // This prevents using old totals when user changes selections
    if (step1Data.total_amount && step1Data.bookingId) {
      // Booking already exists, use API total
      return parseFloat(step1Data.total_amount) || 0;
    }

    // Otherwise, always recalculate based on current selections
    // Match backend calculation exactly:
    // base_rental_cost = fixed car price (NOT multiplied by days)
    // package_cost = package_price_per_day × days
    // addons_cost = sum of (addon_price_per_day × quantity × days)
    // location_fee = pickup location price + return location price (if different)
    // out_of_office_fee = 40 if pickup or return time is outside office hours (8:00-21:00)
    // subtotal = base_rental_cost + package_cost + addons_cost + location_fee + out_of_office_fee
    // tax_amount = subtotal × tax_percentage / 100
    // total_amount = subtotal + tax_amount

    const baseRentalCost = carBasePriceTotal || 0; // Fixed car price (not multiplied by days)
    const packageCost = baseRateTotal || 0; // package_price_per_day × days
    const addonsCost = addonsTotal || 0; // sum of addons × days
    const locationCost = locationFee || 0; // Location fee
    const outOfOfficeCost = outOfOfficeFee || 0; // Out-of-office hours fee

    // Calculate subtotal (before tax)
    const subtotal = baseRentalCost + packageCost + addonsCost + locationCost + outOfOfficeCost;

    // Tax calculation commented out
    // const taxPercentage = 10; // Default tax percentage (can be made configurable)
    // const taxAmount = subtotal * (taxPercentage / 100);
    // const total = subtotal + taxAmount;

    // Total is now just subtotal (no tax)
    const taxPercentage = 0;
    const taxAmount = 0;
    const total = subtotal;

    // Store calculated values in bookingStorage for consistency across steps
    if (step1Data.total !== total || step1Data.subtotal !== subtotal || step1Data.taxAmount !== taxAmount) {
      bookingStorage.updateStep("step1", {
        ...step1Data,
        total: total,
        subtotal: subtotal,
        taxAmount: taxAmount,
        taxPercentage: taxPercentage,
        carBasePrice: baseRentalCost,
        baseRateTotal: packageCost,
        addonsTotal: addonsCost,
        locationFee: locationCost,
      });
    }

    return total;
  }, [carBasePriceTotal, baseRateTotal, addonsTotal, locationFee, outOfOfficeFee]);

  // Calculate payment breakdown: 30% upfront, 70% after journey
  const upfrontPaymentPercentage = 30;
  const remainingPaymentPercentage = 70;
  const upfrontPayment = useMemo(() => {
    return (grandTotal * upfrontPaymentPercentage) / 100;
  }, [grandTotal]);
  const remainingPayment = useMemo(() => {
    return (grandTotal * remainingPaymentPercentage) / 100;
  }, [grandTotal]);

  // Prepare booking data for API
  const prepareBookingData = () => {
    // Get ALL booking data first to debug
    const allBookingData = bookingStorage.getData();
    console.log("All booking data:", allBookingData);

    // Get step1 data from bookingStorage
    let step1Data = bookingStorage.getStep("step1") || {};
    console.log("Step1 data from bookingStorage:", step1Data);

    // If step1Data is empty or missing critical fields, try multiple fallbacks
    if (!step1Data || Object.keys(step1Data).length === 0 || !step1Data.pickupDate) {
      console.warn("Step1 data is empty or missing, trying fallbacks...");

      // Try form values
      const formValues = form.getValues();
      console.log("Form values:", formValues);

      // Merge form values with any existing step1 data
      step1Data = {
        ...step1Data,
        ...formValues,
      };

      // Also check if data exists in allBookingData directly
      if (allBookingData?.step1) {
        console.log("Found step1 in allBookingData:", allBookingData.step1);
        step1Data = {
          ...allBookingData.step1,
          ...step1Data,
        };
      }
    }

    // Always try to get location IDs from URL params as fallback
    const urlPickupId = searchParams?.get("pickup_location_id");
    const urlReturnId = searchParams?.get("return_location_id");

    if (!step1Data.pickupLocationId && !step1Data.pickup_location_id) {
      if (urlPickupId) {
        const pickupId = parseInt(urlPickupId);
        step1Data.pickupLocationId = pickupId;
        step1Data.pickup_location_id = pickupId;
        console.log("Restored pickupLocationId from URL:", pickupId);
        // Save it back to storage
        bookingStorage.updateStep("step1", {
          ...bookingStorage.getStep("step1") || {},
          pickupLocationId: pickupId,
          pickup_location_id: pickupId,
        });
      }
    }

    if (!step1Data.dropoffLocationId && !step1Data.return_location_id) {
      if (urlReturnId) {
        const returnId = parseInt(urlReturnId);
        step1Data.dropoffLocationId = returnId;
        step1Data.return_location_id = returnId;
        console.log("Restored dropoffLocationId from URL:", returnId);
        // Save it back to storage
        bookingStorage.updateStep("step1", {
          ...bookingStorage.getStep("step1") || {},
          dropoffLocationId: returnId,
          return_location_id: returnId,
        });
      } else if (step1Data.pickupLocationId) {
        step1Data.dropoffLocationId = step1Data.pickupLocationId;
        step1Data.return_location_id = step1Data.pickupLocationId;
        console.log("Using pickupLocationId as dropoffLocationId (same store)");
        // Save it back to storage
        bookingStorage.updateStep("step1", {
          ...bookingStorage.getStep("step1") || {},
          dropoffLocationId: step1Data.pickupLocationId,
          return_location_id: step1Data.pickupLocationId,
        });
      }
    }

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
      if (extraId === "foundationDonation") {
        console.log("Skipping foundationDonation - not in addons API");
        return;
      }

      // Check if extraId is already an API addon ID (numeric string)
      const isApiAddonId = !isNaN(parseInt(extraId));

      if (isApiAddonId) {
        // Direct API addon ID - use it directly
        const addonId = parseInt(extraId);
        console.log(`Using direct API addon ID: ${addonId}`);
        addons.push({
          id: addonId,
          quantity: 1,
        });
        return;
      }

      // Handle hardcoded extras (childSeat, etc.) - use dynamic API matching
      let addonId = null;
      const extra = extrasData.find(e => e.id === extraId);

      if (addonsData && Array.isArray(addonsData) && addonsData.length > 0) {
        // Try to find addon by matching name with extra name (dynamic matching)
        if (extra && extra.name) {
          addonId = getAddonIdByName(addonsData, extra.name);

          // If not found by exact name, try fuzzy matching
          if (!addonId) {
            const matchingAddon = addonsData.find(a => {
              const addonName = (a.name || "").toLowerCase();
              const addonSlug = (a.slug || "").toLowerCase();
              const extraName = extra.name.toLowerCase();
              return addonName === extraName ||
                addonSlug === extraName ||
                addonName.includes(extraName) ||
                extraName.includes(addonName);
            });
            addonId = matchingAddon?.id || null;
          }
        }

        // Use dynamic getAddonId (no static mapping)
        if (!addonId) {
          addonId = getAddonId(extraId, addonsData, extrasData);
        }
      }

      if (addonId) {
        console.log(`Mapped extra "${extraId}" (${extra?.name || "unknown"}) to addon ID: ${addonId}`);

        // Special handling for child seats (quantity based on child seat types)
        // Check if this is a child seat addon (by name or by extraId)
        const isChildSeat = extraId === "childSeat" ||
          (extra && extra.name && extra.name.toLowerCase().includes("child seat"));

        if (isChildSeat) {
          const quantities = step1Data.childSeatQuantities || childSeatQuantities;
          const totalChildSeats = (quantities.babySeat || 0) +
            (quantities.childSeat || 0) +
            (quantities.boosterSeat || 0);

          if (totalChildSeats > 0) {
            addons.push({
              id: addonId, // Use dynamic API addon ID (no static ID)
              quantity: totalChildSeats,
            });
          }
        } else {
          addons.push({
            id: addonId, // Use dynamic API addon ID (no static ID)
            quantity: 1,
          });
        }
      } else {
        console.warn(`Could not find addon ID for extra: ${extraId} (${extra?.name || "unknown"}) - skipping from payload`);
      }
    });

    // Validate required fields - check multiple possible field names
    // First try to get location IDs (not names)
    let pickupLocationId = step1Data.pickupLocationId || step1Data.pickup_location_id || null;
    let returnLocationId = step1Data.dropoffLocationId || step1Data.return_location_id || null;

    // If IDs are missing, try to get from URL search params
    if (!pickupLocationId) {
      const urlPickupId = searchParams?.get("pickup_location_id");
      if (urlPickupId) {
        pickupLocationId = parseInt(urlPickupId);
      }
    }

    if (!returnLocationId) {
      const urlReturnId = searchParams?.get("return_location_id");
      if (urlReturnId) {
        returnLocationId = parseInt(urlReturnId);
      } else if (pickupLocationId) {
        // If same store, use pickup location as return location
        returnLocationId = pickupLocationId;
      }
    }

    // Parse to integer if not already
    if (pickupLocationId && typeof pickupLocationId !== 'number') {
      pickupLocationId = parseInt(pickupLocationId);
    }
    if (returnLocationId && typeof returnLocationId !== 'number') {
      returnLocationId = parseInt(returnLocationId);
    }

    // Log for debugging
    console.log("Location validation:", {
      step1Data: {
        pickupLocationId: step1Data.pickupLocationId,
        pickup_location_id: step1Data.pickup_location_id,
        dropoffLocationId: step1Data.dropoffLocationId,
        return_location_id: step1Data.return_location_id,
        pickupLocation: step1Data.pickupLocation,
        dropoffLocation: step1Data.dropoffLocation,
      },
      urlParams: {
        pickup_location_id: searchParams?.get("pickup_location_id"),
        return_location_id: searchParams?.get("return_location_id"),
      },
      final: {
        pickupLocationId,
        returnLocationId,
      }
    });

    if (!pickupLocationId || pickupLocationId === 0 || isNaN(pickupLocationId)) {
      console.error("Missing pickup location ID. Step1 data:", step1Data);
      throw new Error("Pickup location is required. Please select a pickup location.");
    }

    if (!returnLocationId || returnLocationId === 0 || isNaN(returnLocationId)) {
      console.error("Missing return location ID. Step1 data:", step1Data);
      throw new Error("Return location is required. Please select a return location.");
    }

    if (!finalProtectionPlanId) {
      throw new Error("Protection plan is required. Please select a protection plan.");
    }

    if (!pickupDatetime || !returnDatetime) {
      throw new Error("Pickup and return dates/times are required. Please check your booking details.");
    }

    // Calculate pricing breakdown for API payload
    // Use stored values from grandTotal calculation or recalculate
    // Note: base_rental_cost now uses car_prices calculation (days × price_per_day)
    const baseRentalCost = step1Data.carBasePrice || carBasePriceTotal || 0;
    const packageCost = step1Data.baseRateTotal || baseRateTotal || 0;
    const protectionPlanCost = 0; // Currently not used, set to 0.00
    const addonsCost = step1Data.addonsTotal || addonsTotal || 0;
    const locationCost = step1Data.locationFee || locationFee || 0; // Location fee
    const outOfOfficeCost = step1Data.outOfOfficeFee || outOfOfficeFee || 0; // Out-of-office fee
    const subtotal = step1Data.subtotal || (baseRentalCost + packageCost + addonsCost + locationCost + outOfOfficeCost);
    // Tax calculation commented out - set to 0
    const taxPercentage = 0;
    const taxAmount = 0;
    const totalAmount = step1Data.total_amount || step1Data.total || subtotal;

    // Calculate upfront payment (30% of total) and remaining payment (70%)
    const upfrontPaymentPercentage = 30;
    const upfrontPaymentAmount = (totalAmount * upfrontPaymentPercentage) / 100;
    const remainingPaymentAmount = (totalAmount * (100 - upfrontPaymentPercentage)) / 100;

    // Format all amounts as strings with 2 decimal places (matching API format)
    const formatAmount = (amount) => {
      return parseFloat(amount || 0).toFixed(2);
    };

    const bookingPayload = {
      car_id: car.id,
      pickup_location_id: pickupLocationId,
      return_location_id: returnLocationId,
      pickup_datetime: pickupDatetime,
      return_datetime: returnDatetime,
      package_id: finalProtectionPlanId,
      // Pricing breakdown fields (all as strings with 2 decimal places)
      base_rental_cost: formatAmount(baseRentalCost),
      package_cost: formatAmount(packageCost),
      protection_plan_cost: formatAmount(protectionPlanCost),
      addons_cost: formatAmount(addonsCost),
      location_fee: formatAmount(locationCost), // Location fee
      out_of_office_fee: formatAmount(outOfOfficeCost), // Out-of-office fee
      subtotal: formatAmount(subtotal),
      tax_percentage: formatAmount(taxPercentage),
      tax_amount: formatAmount(taxAmount),
      total_amount: formatAmount(totalAmount),
      upfront_payment_amount: formatAmount(upfrontPaymentAmount), // 30% upfront payment
      remaining_payment_amount: formatAmount(remainingPaymentAmount), // 70% remaining payment
      upfront_payment_percentage: upfrontPaymentPercentage, // 30%
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
    console.log("--- Pricing Breakdown ---");
    console.log("Base Rental Cost:", bookingPayload.base_rental_cost);
    console.log("Package Cost:", bookingPayload.package_cost);
    console.log("Protection Plan Cost:", bookingPayload.protection_plan_cost);
    console.log("Addons Cost:", bookingPayload.addons_cost);
    console.log("Location Fee:", bookingPayload.location_fee);
    console.log("Out-of-Office Fee:", bookingPayload.out_of_office_fee);
    console.log("Subtotal:", bookingPayload.subtotal);
    console.log("Tax Percentage:", bookingPayload.tax_percentage);
    console.log("Tax Amount:", bookingPayload.tax_amount);
    console.log("Total Amount:", bookingPayload.total_amount);
    console.log("--- Payment Breakdown ---");
    console.log("Upfront Payment (30%):", bookingPayload.upfront_payment_amount);
    console.log("Remaining Payment (70%):", bookingPayload.remaining_payment_amount);
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

      // Store booking response and total_amount
      const bookingResponseData = response.data?.data || response.data || response;
      const totalAmount = bookingResponseData.total_amount || bookingResponseData.total || null;

      bookingStorage.updateStep("step1", {
        ...bookingStorage.getStep("step1"),
        bookingId: bookingResponseData.id || response.data?.id || response.id,
        bookingResponse: response,
        total_amount: totalAmount, // Store the total_amount from API
        bookingData: bookingResponseData, // Store full booking data
      });

      console.log("Stored booking total_amount:", totalAmount);

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
      // Store booking response and total_amount
      const bookingResponseData = response.data?.data || response.data || response;
      const totalAmount = bookingResponseData.total_amount || bookingResponseData.total || null;

      bookingStorage.updateStep("step1", {
        ...bookingStorage.getStep("step1"),
        bookingId: bookingResponseData.id || response.data?.id || response.id,
        bookingResponse: response,
        total_amount: totalAmount, // Store the total_amount from API
        bookingData: bookingResponseData, // Store full booking data
      });

      console.log("Stored booking total_amount:", totalAmount);
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
        {/* Loading indicator while fetching addons data */}
        {isLoadingAddons && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-blue-800">
              Loading latest addon prices and availability...
            </p>
          </div>
        )}

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
                {selectedCar?.name || "Car"}
              </h3>
              {/* <p className="text-xs text-red-600 mb-3">Best price for these dates</p> */}

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
              {/* here add the location price if it is different from the pickup location price */}
              {locationFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Location Fee</span>
                  <span className="text-gray-900 font-medium">{locationFee.toFixed(2)} €</span>
                </div>
              )}
              <div className="space-y-2 mb-4">
                {/* <p className="text-sm text-gray-600">
                  {currentPackageType === "premium" ? "Premium" : currentPackageType === "smart" ? "Smart" : currentPackageType === "lite" ? "Lite" : "Standard"} Rate x {rentalDays} days
                </p> */}
                <div>
                  <p className="text-xl font-bold text-blue-700">
                    {upfrontPayment.toFixed(2)} €
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Pay now (30% of {grandTotal.toFixed(2)} €)
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Remaining {remainingPayment.toFixed(2)} € after journey
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-bold text-gray-900 mb-3">
                  SUMMARY OF YOUR RENTAL
                </h4>
                <div className="space-y-2 text-sm">
                  {/* Car Base Price - (days × price_per_day) */}
                  {carBasePrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        Car Rental
                        <span className="text-xs text-gray-500 ml-1">
                          ({rentalDays} days × {carBasePrice.price_per_day.toFixed(2)} €)
                        </span>
                      </span>
                      <span className="text-gray-900 font-medium">
                        {(carBasePrice.price_per_day * rentalDays).toFixed(2)} €
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

                  {/* Location Fee */}
                  {locationFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        Location Fee
                        {(() => {
                          const step1Data = bookingStorage.getStep("step1") || {};
                          const isSameStore = step1Data.sameStore !== false;
                          return isSameStore ? " (Same Store)" : " (Different Stores)";
                        })()}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {locationFee.toFixed(2)} €
                      </span>
                    </div>
                  )}

                  {/* Display all selected addons with prices */}
                  {watchedExtras.map((extraId) => {
                    // Check if extraId is an API addon ID (numeric string)
                    const isApiAddonId = !isNaN(parseInt(extraId));

                    if (isApiAddonId && addonsData && Array.isArray(addonsData)) {
                      const apiAddon = addonsData.find(a => a.id.toString() === extraId);
                      if (apiAddon) {
                        const addonPrice = parseFloat(apiAddon.price_per_day) || 0;
                        const isPerDay = apiAddon.addon_type === "days";
                        const totalPrice = isPerDay ? addonPrice * rentalDays : addonPrice;

                        return (
                          <div key={extraId} className="flex justify-between">
                            <span className="text-gray-700">
                              {apiAddon.name}
                              {isPerDay && <span className="text-xs text-gray-500 ml-1">({rentalDays} days)</span>}
                            </span>
                            <span className="text-gray-900 font-medium">
                              {totalPrice.toFixed(2)} €
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }

                    // Handle hardcoded extras
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
                        price = extra.price * totalChildSeats * rentalDays;
                        label = `${extra.name} (${totalChildSeats}x)`;
                      } else {
                        return null;
                      }
                    } else if (extraId === "foundationDonation") {
                      const donation = bookingStorage.getStep("step1")?.donationAmount || donationAmount || customDonation;
                      price = parseFloat(donation) || 0;
                      if (price <= 0) return null;
                    } else if (extra.price > 0) {
                      const isPerDay = extra.pricingType === "per_day";
                      price = isPerDay ? extra.price * rentalDays : extra.price;
                    } else {
                      return null;
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
              {/* <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    className="text-sm"
                  />
                  <Button type="button" variant="outline" size="sm">
                    APPLY
                  </Button>
                </div>
              </div> */}

              {/* Daily Rate Info */}
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm">
                <div className="space-y-1">
                  {carBasePrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Car Rental:</span>
                      <span className="text-gray-900 font-medium">
                        {carBasePrice.rental_days > 0
                          ? `${carBasePrice.price_per_day.toFixed(2)} €/day × ${carBasePrice.rental_days} days = ${carBasePriceTotal.toFixed(2)} €`
                          : `${carBasePriceTotal.toFixed(2)} €`
                        }
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package Rate:</span>
                    <span className="text-gray-900 font-medium">
                      {baseRatePrice.toFixed(2)} €/day × {rentalDays} days = {baseRateTotal.toFixed(2)} €
                      {currentPackage?.has_discount && currentPackage.original_price_per_day && (
                        <span className="text-green-600 text-xs ml-1">
                          (Discounted from {parseFloat(currentPackage.original_price_per_day).toFixed(2)} €)
                        </span>
                      )}
                    </span>
                  </div>
                  {locationFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location Fee:</span>
                      <span className="text-gray-900 font-medium">
                        {locationFee.toFixed(2)} €
                      </span>
                    </div>
                  )}
                  {outOfOfficeFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Out-of-Office Hours Fee:</span>
                      <span className="text-gray-900 font-medium">
                        {outOfOfficeFee.toFixed(2)} €
                      </span>
                    </div>
                  )}
                  {addonsTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Addons:</span>
                      <span className="text-gray-900 font-medium">
                        {addonsTotal.toFixed(2)} €
                      </span>
                    </div>
                  )}
                  {/* Subtotal and Tax commented out - showing total only */}
                  {/* <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900 font-medium">
                      {(carBasePriceTotal + baseRateTotal + addonsTotal + locationFee).toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%):</span>
                    <span className="text-gray-900 font-medium">
                      {((carBasePriceTotal + baseRateTotal + addonsTotal + locationFee) * 0.1).toFixed(2)} €
                    </span>
                  </div> */}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-semibold">Total:</span>
                    <span className="text-gray-900 font-bold">
                      {grandTotal.toFixed(2)} €
                    </span>
                  </div>

                  {/* Payment Breakdown: 30% upfront, 70% after journey */}
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-blue-700">Payment Now (30%):</span>
                      <span className="text-lg font-bold text-blue-700">
                        {upfrontPayment.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Balance After Journey (70%):</span>
                      <span className="text-sm font-medium text-gray-600">
                        {remainingPayment.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
                {/* <p className="text-gray-600 mt-2">
                  Calculation: {carBasePrice ? `${carBasePriceTotal.toFixed(2)} € car` : ''}
                  {carBasePrice && carBasePrice.rental_days > 0 && ` (${carBasePrice.rental_days} days × ${carBasePrice.price_per_day.toFixed(2)} €)`}
                  {baseRateTotal > 0 && ` + ${baseRateTotal.toFixed(2)} € package`}
                  {locationFee > 0 && ` + ${locationFee.toFixed(2)} € location`}
                  {outOfOfficeFee > 0 && ` + ${outOfOfficeFee.toFixed(2)} € out-of-office`}
                  {addonsTotal > 0 && ` + ${addonsTotal.toFixed(2)} € addons`}
                  {" = "}{grandTotal.toFixed(2)} € total
                </p> */}
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  Pay {upfrontPaymentPercentage}% now ({upfrontPayment.toFixed(2)} €), remaining {remainingPaymentPercentage}% ({remainingPayment.toFixed(2)} €) after journey
                </p>
              </div>

              {/* Loyalty Points */}
              {/* <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Your booking gives you{" "}
                  {Math.floor(grandTotal)}{" "}
                  POINTS OK CLUB
                </p>
              </div> */}
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
                {/* Hardcoded extras: Foundation Donation, Child Seats, and Young Driver */}
                {extrasData
                  .filter((extra) =>
                    extra.id === "foundationDonation" ||
                    extra.id === "childSeat" ||
                    extra.id === "youngDriver"
                  )
                  .map((extra) => {
                    const isIncluded = isExtraIncluded(extra.id);
                    const isChildSeat = extra.id === "childSeat";

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
                                    {amount === 0 ? "Other..." : `${amount}€`}
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
                                ? "Select amount"
                                : `${extra.price.toFixed(2)} €/${extra.pricingType === "per_day" ? "day" : "booking"}`}
                            </p>
                          </div>
                          <div className="ml-4">
                            {isIncluded ? (
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

                {/* API Addons */}
                {addonsData && Array.isArray(addonsData) && addonsData
                  .filter((addon) => addon.is_available && addon.status === "available")
                  .filter((addon, index) => {
                    // Show first 3 API items always, then toggle the rest based on showMoreExtras
                    if (index < 3) return true;
                    return showMoreExtras;
                  })
                  .map((addon) => {
                    // Map API addon to extra ID format for consistency
                    const extraId = addon.name.toLowerCase().replace(/\s+/g, '');
                    const isIncluded = watchedExtras.includes(extraId) || watchedExtras.includes(addon.id.toString());
                    const isPerDay = addon.addon_type === "days";
                    const price = parseFloat(addon.price_per_day) || 0;

                    return (
                      <div
                        key={addon.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900 mb-1">
                              {addon.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {addon.description}
                            </p>
                            {/* Price and Calculation based on addon_type */}
                            <div className="mt-2 p-2 bg-gray-50 rounded-md">
                              <p className="text-sm font-medium text-gray-900">
                                {addon.price_display} / {isPerDay ? "day" : "booking"}
                              </p>
                              {isPerDay ? (
                                // addon_type: "days" - multiply by rental days
                                <div className="text-xs text-gray-600 mt-1">
                                  <span className="font-medium">Calculation: </span>
                                  {price.toFixed(2)} € × {rentalDays} days =
                                  <span className="font-bold text-gray-900 ml-1">
                                    {(price * rentalDays).toFixed(2)} €
                                  </span>
                                </div>
                              ) : (
                                // addon_type: "booking" - fixed price
                                <div className="text-xs text-gray-600 mt-1">
                                  <span className="font-medium">Total: </span>
                                  <span className="font-bold text-gray-900">
                                    {price.toFixed(2)} €
                                  </span>
                                  <span className="text-gray-500 ml-1">(fixed per booking)</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            {isIncluded ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-300 hover:bg-green-50"
                                onClick={() => {
                                  // Remove addon
                                  const current = form.getValues("extras") || [];
                                  const updated = current.filter((e) => e !== extraId && e !== addon.id.toString());
                                  form.setValue("extras", updated, { shouldDirty: true });
                                  bookingStorage.updateStep("step1", {
                                    ...bookingStorage.getStep("step1"),
                                    extras: updated,
                                  });
                                  setPriceUpdateKey(prev => prev + 1);
                                }}
                              >
                                <span className="flex items-center gap-1">
                                  <Check className="w-4 h-4" />
                                  INCLUDED
                                </span>
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  // Add addon using addon.id
                                  const current = form.getValues("extras") || [];
                                  const updated = [...current, addon.id.toString()];
                                  form.setValue("extras", updated, { shouldDirty: true });
                                  bookingStorage.updateStep("step1", {
                                    ...bookingStorage.getStep("step1"),
                                    extras: updated,
                                    // Store addon details for price calculation
                                    [`addon_${addon.id}`]: {
                                      id: addon.id,
                                      name: addon.name,
                                      price_per_day: addon.price_per_day,
                                      addon_type: addon.addon_type,
                                    },
                                  });
                                  setPriceUpdateKey(prev => prev + 1);
                                }}
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

              {addonsData && addonsData.length > 3 && (
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
                PAY {upfrontPaymentPercentage}% NOW ({upfrontPayment.toFixed(2)} €) & CONTINUE
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
                      // Find child seat addon from API dynamically
                      const childSeatAddon = getAddonByExtraId("childSeat", addonsData, extrasData);
                      const childSeatAddonId = childSeatAddon?.id;

                      if (!childSeatAddonId) {
                        console.warn("Child seat addon not found in API. Using fallback 'childSeat' ID.");
                      }

                      // Use API addon ID if found, otherwise use 'childSeat' as fallback
                      const extraIdToUse = childSeatAddonId ? childSeatAddonId.toString() : "childSeat";

                      // Add child seat to extras (using API addon ID if available)
                      const current = form.getValues("extras") || [];
                      if (!current.includes(extraIdToUse) && !current.includes("childSeat")) {
                        const updated = [...current, extraIdToUse];
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
