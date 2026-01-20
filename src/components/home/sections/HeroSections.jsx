"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  MapPin,
  Clock,
  Car,
  Users,
  ArrowBigLeft,
  ArrowRight,
  X,
  Search,
  RotateCcw,
} from "lucide-react";
import { format, differenceInDays, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { bookingStorage } from "@/lib/bookingStorage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocations } from "@/hooks/locations.hook";
import Link from "next/link";
import toast from "react-hot-toast";

// Time Selector Component
const TimeSelector = ({ value, onChange, label }) => {
  const [open, setOpen] = useState(false);
  const timeOptions = [];

  // Generate time options from 00:00 to 23:00 in 1-hour intervals
  for (let hour = 0; hour < 24; hour++) {
    const timeString = `${String(hour).padStart(2, '0')}:00`;
    timeOptions.push(timeString);
  }

  return (
    <div className="space-y-1">
      {label && <label className="text-xs text-gray-100 block">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-white border-0 text-gray-900 h-12 hover:bg-white text-xs sm:text-sm",
              !value && "text-gray-400"
            )}
          >
            <Clock className="mr-2 h-5 w-5 text-gray-400" />
            <span className="text-sm">{value || "HH:MM"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-50" align="start" sideOffset={8}>
          <div className="timer-options max-h-[300px] overflow-y-auto p-2">
            {timeOptions.map((time) => (
              <div
                key={time}
                className={cn(
                  "timer-option px-4 py-2 cursor-pointer hover:bg-blue-50 rounded transition-colors",
                  value === time && "selected bg-blue-100 text-blue-700 font-semibold"
                )}
                data-value={time}
                onClick={() => {
                  onChange(time);
                  setOpen(false);
                }}
              >
                {time}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Searchable Location Input Component
const SearchableLocationInput = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = "City, airport...",
  label,
  inputRef: externalInputRef
}) => {
  const [searchQuery, setSearchQuery] = useState(value || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const internalInputRef = useRef(null);
  const inputRef = externalInputRef || internalInputRef;
  const dropdownRef = useRef(null);

  // Fetch locations from API
  const { data, isLoading } = useLocations({
    per_page: 15,
    search: searchQuery.trim() || undefined
  });

  // Get locations and filter client-side if needed (as fallback)
  const allLocations = data?.locations || [];
  const locations = searchQuery.trim().length > 0
    ? allLocations.filter(
      (loc) =>
        loc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.city?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : allLocations;

  useEffect(() => {
    // Always sync the value, including when it's cleared to empty string
    setSearchQuery(value || "");
    if (!value) {
      setSelectedLocationId(null);
      setShowSuggestions(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(true);
      onChange("");
      if (onLocationSelect) {
        onLocationSelect(null);
      }
      setSelectedLocationId(null);
    }
  };

  const handleSelectLocation = (location) => {
    const displayName = `${location.name}${location.city ? `, ${location.city}` : ""}`;
    setSearchQuery(displayName);
    onChange(displayName);
    setSelectedLocationId(location.id);
    if (onLocationSelect) {
      // Pass the full location object so parent can access id and price
      onLocationSelect(location);
    }
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchQuery("");
    onChange("");
    setSelectedLocationId(null);
    if (onLocationSelect) {
      onLocationSelect(null);
    }
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
        <Input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => {
            // Show suggestions when input is focused
            // Locations are already fetched and filtered via the API hook
            setShowSuggestions(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 text-gray-900 border border-gray-300 rounded-md bg-white placeholder:text-gray-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showSuggestions && (isLoading || locations.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">Loading locations...</div>
          ) : locations.length > 0 ? (
            locations.map((location) => {
              const displayAddress = [
                location.address,
                location.city,
                location.country
              ].filter(Boolean).join(", ");

              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => handleSelectLocation(location)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-gray-900">{location.name}</div>
                  <div className="text-sm text-gray-500">{displayAddress || location.address}</div>
                </button>
              );
            })
          ) : searchQuery.trim().length > 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">No locations found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

const HeroSections = () => {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [pickupTime, setPickupTime] = useState("13:00");
  const [returnTime, setReturnTime] = useState("14:00");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeTrigger, setActiveTrigger] = useState(null); // Track which button was clicked
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [pickupLocationId, setPickupLocationId] = useState(null);
  const [returnLocationId, setReturnLocationId] = useState(null);
  const [pickupLocationPrice, setPickupLocationPrice] = useState(0);
  const [returnLocationPrice, setReturnLocationPrice] = useState(0);
  const [sameStore, setSameStore] = useState(true);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const returnLocationInputRef = useRef(null);


  // Office hours: 8:00 to 21:00 (8 AM to 9 PM)
  const OFFICE_START_HOUR = 8;
  const OFFICE_END_HOUR = 21;
  const OUT_OF_OFFICE_FEE = 40;

  // Check if time is outside office hours
  const isOutOfOfficeHours = (timeString) => {
    if (!timeString) return false;
    const [hour] = timeString.split(":").map(Number);
    return hour < OFFICE_START_HOUR || hour >= OFFICE_END_HOUR;
  };

  // Calculate period in days based on strict 24-hour periods
  // Logic: After each 24-hour period, if there's any additional time (even 1 minute), charge an extra day
  // Example: Pickup 20/1/2026 11:00 AM, Return 22/1/2026 11:00 AM = 2 days (exactly 48 hours)
  // Example: Pickup 20/1/2026 11:00 AM, Return 22/1/2026 11:01 AM = 3 days (48 hours + 1 minute)
  const periodDays = pickupDate && returnDate && pickupTime && returnTime
    ? (() => {
        // Create complete datetime objects for pickup and return
        const [pickupHour, pickupMin] = pickupTime.split(":").map(Number);
        const [returnHour, returnMin] = returnTime.split(":").map(Number);

        // Create fresh datetime objects to avoid timezone issues
        // Extract year, month, day from the date objects
        const pickupDateTime = new Date(
          pickupDate.getFullYear(),
          pickupDate.getMonth(),
          pickupDate.getDate(),
          pickupHour,
          pickupMin,
          0,
          0,
        );

        const returnDateTime = new Date(
          returnDate.getFullYear(),
          returnDate.getMonth(),
          returnDate.getDate(),
          returnHour,
          returnMin,
          0,
          0,
        );

        // Calculate total time difference in milliseconds
        const timeDiffMs = returnDateTime - pickupDateTime;

        // Convert to hours
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

        // Calculate days: divide by 24 and round up to nearest integer
        // This ensures any time over a 24-hour period adds another day
        let days = Math.ceil(timeDiffHours / 24);

        // Check if pickup time is outside office hours
        const pickupOutOfOffice = isOutOfOfficeHours(pickupTime);
        // Check if return time is outside office hours
        const returnOutOfOffice = isOutOfOfficeHours(returnTime);

        // If pickup time is outside office hours, add 1 day
        if (pickupOutOfOffice) {
          days = days + 1;
        }

        // If return time is outside office hours, add 1 day
        if (returnOutOfOffice) {
          days = days + 1;
        }

        // Ensure minimum of 1 day
        return Math.max(1, days);
      })()
    : pickupDate && returnDate
      ? Math.max(1, differenceInDays(returnDate, pickupDate))
      : 0;

  // Calculate out-of-office fee (40 if any time is outside office hours)
  const outOfOfficeFee = (pickupTime && isOutOfOfficeHours(pickupTime)) ||
    (returnTime && isOutOfOfficeHours(returnTime))
    ? OUT_OF_OFFICE_FEE
    : 0;

  // Format date as DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
  };

  // Format date as Y-m-d (e.g., 2025-11-12)
  const formatDateForAPI = (date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  const handleClear = () => {
    // Clear all form fields
    setPickupDate(null);
    setReturnDate(null);
    setPickupTime("13:00");
    setReturnTime("14:00");
    setPickupLocation("");
    setReturnLocation("");
    setPickupLocationId(null);
    setReturnLocationId(null);
    setPickupLocationPrice(0);
    setReturnLocationPrice(0);
    setSameStore(true);
    setAgeConfirmed(false);

    // Clear UI state
    setCalendarOpen(false);
    setActiveTrigger(null);

    // Clear booking storage completely for step1
    bookingStorage.updateStep("step1", {
      pickupDate: "",
      dropoffDate: "",
      pickupLocation: "",
      pickupLocationId: null,
      pickupLocationPrice: 0,
      dropoffLocation: "",
      dropoffLocationId: null,
      returnLocationPrice: 0,
      pickup_time: "",
      return_time: "",
      requirements: "",
      protectionPlan: "",
      extras: [],
    });

    // If we're on /cars page, clear URL parameters by navigating
    if (typeof window !== "undefined" && window.location.pathname === "/cars") {
      router.push("/cars");
    }
  };

  const handleSearch = () => {
    // Validate required fields with user feedback
    if (!pickupDate || !returnDate || !pickupLocationId) {
      const missingFields = [];
      if (!pickupDate) missingFields.push("Pick-up date");
      if (!returnDate) missingFields.push("Return date");
      if (!pickupLocationId) missingFields.push("Pick-up location");

      toast.error(`Please fill in: ${missingFields.join(", ")}`);
      return;
    }
    if (!sameStore && !returnLocationId) {
      toast.error("Please select a return location");
      return;
    }

    // Determine final location IDs
    const finalPickupId = pickupLocationId;
    const finalReturnId = sameStore ? pickupLocationId : returnLocationId;

    // Format dates for API (Y-m-d format)
    const formattedPickupDate = formatDateForAPI(pickupDate);
    const formattedReturnDate = formatDateForAPI(returnDate);

    // Format times (H:i format, default to 12:00 if not set)
    const formattedPickupTime = pickupTime || "12:00";
    const formattedReturnTime = returnTime || "12:00";

    console.log("=== SEARCH API CALL ===");
    console.log("Search Parameters:", {
      pickup_location_id: finalPickupId,
      return_location_id: finalReturnId,
      pickup_date: formattedPickupDate,
      pickup_time: formattedPickupTime,
      return_date: formattedReturnDate,
      return_time: formattedReturnTime,
    });
    console.log("API Endpoint: /api/v1/cars/search");
    console.log("======================");

    // Store in booking storage
    const toISO = (dateObj, timeStr) => {
      try {
        const d = new Date(dateObj);
        if (timeStr) {
          const [h, m] = timeStr.split(":");
          d.setHours(parseInt(h || "0"), parseInt(m || "0"), 0, 0);
        }
        return d.toISOString();
      } catch {
        return dateObj?.toString?.() || "";
      }
    };

    // Calculate location fee: same location = 0 (no charge), different = sum of both prices
    const finalPickupPrice = pickupLocationPrice || 0;
    const finalReturnPrice = returnLocationPrice || 0;
    const locationFee = sameStore ? 0 : (finalPickupPrice + finalReturnPrice);

    // Calculate out-of-office fee (40 if any time is outside office hours 8:00-21:00)
    const finalOutOfOfficeFee = outOfOfficeFee || 0;

    console.log("HeroSections: Storing location fee and out-of-office fee data:", {
      pickupLocationPrice: finalPickupPrice,
      returnLocationPrice: finalReturnPrice,
      locationFee: locationFee,
      sameStore: sameStore,
      outOfOfficeFee: finalOutOfOfficeFee,
      pickupTime: formattedPickupTime,
      returnTime: formattedReturnTime,
    });

    bookingStorage.updateStep("step1", {
      pickupDate: toISO(pickupDate, pickupTime),
      dropoffDate: toISO(returnDate, returnTime),
      pickupLocation: pickupLocation,
      pickupLocationId: finalPickupId,
      pickupLocationPrice: finalPickupPrice,
      dropoffLocation: sameStore ? pickupLocation : returnLocation,
      dropoffLocationId: finalReturnId,
      returnLocationPrice: finalReturnPrice,
      locationFee: locationFee,
      outOfOfficeFee: finalOutOfOfficeFee,
      sameStore: sameStore,
      pickup_time: formattedPickupTime,
      return_time: formattedReturnTime,
      requirements: "",
      protectionPlan: "basic",
      extras: [],
    });

    // Navigate to cars page with search parameters
    // The CarsCardSection component will automatically call the search API via useSearchCars hook
    const searchParams = new URLSearchParams({
      pickup_location_id: finalPickupId.toString(),
      return_location_id: finalReturnId.toString(), // Always include return_location_id
      pickup_date: formattedPickupDate,
      return_date: formattedReturnDate,
    });

    // Include times (always include them, even if default 12:00, for consistency)
    searchParams.append("pickup_time", formattedPickupTime);
    searchParams.append("return_time", formattedReturnTime);

    console.log("Navigating to /cars with search params:", searchParams.toString());
    router.push(`/cars?${searchParams.toString()}`);
  };

  // Clear return location when sameStore is checked
  useEffect(() => {
    if (sameStore) {
      setReturnLocation("");
      setReturnLocationId(null);
    }
  }, [sameStore]);

  // Handle client-side only mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Add custom styles for react-datepicker
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .react-datepicker {
        font-family: inherit !important;
        border: none !important;
        border-radius: 0.5rem !important;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
      }
      .react-datepicker__header {
        background-color: white !important;
        border-bottom: 1px solid #e5e7eb !important;
        border-radius: 0.5rem 0.5rem 0 0 !important;
        padding-top: 0.75rem !important;
      }
      .react-datepicker__month-container {
        padding: 0 !important;
      }
      .react-datepicker__day--selected,
      .react-datepicker__day--in-selecting-range,
      .react-datepicker__day--in-range {
        background-color: rgb(37 99 235) !important;
        color: white !important;
        border-radius: 0.375rem !important;
      }
      .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range) {
        background-color: rgb(191 219 254) !important;
        color: rgb(30 58 138) !important;
      }
      .react-datepicker__day--range-start,
      .react-datepicker__day--range-end {
        background-color: rgb(37 99 235) !important;
        color: white !important;
      }
      .react-datepicker__day:hover {
        background-color: rgb(219 234 254) !important;
        border-radius: 0.375rem !important;
      }
      .react-datepicker__day--keyboard-selected {
        background-color: rgb(219 234 254) !important;
        color: inherit !important;
      }
      .react-datepicker__day--disabled {
        color: #d1d5db !important;
        cursor: not-allowed !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/herobg.png"
          alt="Car rental background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-[#FAFAFA]">
        {/* Hero Text */}
        <div className="py-10 md:py-0">
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-6">
            Premium Car Rental
          </h1>
          <h2 className="text-3xl md:text-6xl lg:text-7xl font-semibold mb-6 text-primary">
            Made Simple
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience luxury and comfort with our premium fleet. From business
            trips to weekend getaways, we have the perfect car for every
            journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/cars">   <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
            >
              Explore Our Fleet
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button></Link>

            <Link href="/about">   <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 border-white text-white px-8 py-3 text-lg"
            >
              Learn More
            </Button>
            </Link>
          </div>

          {/* Search Form */}
          <div className="bg-[#3B82F6] p-4 sm:p-6 rounded-xl max-w-7xl mx-auto text-gray-900">
            <div className="space-y-4 sm:space-y-6">
              {/* Location Fields */}
              <div className={cn(
                "grid gap-4",
                sameStore ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
              )}>
                {/* Pick-up/Return Store */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-100 block">
                    {sameStore ? "Pick-up/Return Store" : "Pick-up/Return Store"}
                  </label>
                  <SearchableLocationInput
                    value={pickupLocation}
                    onChange={setPickupLocation}
                    onLocationSelect={(location) => {
                      if (location) {
                        setPickupLocationId(location.id);
                        setPickupLocationPrice(location.price || 0);

                        // Auto-focus return location if sameStore is unchecked
                        if (!sameStore) {
                          // Small delay to ensure the return location field is rendered and state is updated
                          setTimeout(() => {
                            if (returnLocationInputRef.current) {
                              returnLocationInputRef.current.focus();
                              // Scroll into view if needed
                              returnLocationInputRef.current.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                              });
                            }
                          }, 150);
                        }
                      } else {
                        setPickupLocationId(null);
                        setPickupLocationPrice(0);
                      }
                    }}
                    placeholder="City, airport..."
                  />
                </div>

                {/* Return Store (conditional) */}
                {!sameStore && (
                  <div className="space-y-2">
                    <label className="text-xs text-gray-100 block">
                      Return Store
                    </label>
                    <SearchableLocationInput
                      value={returnLocation}
                      onChange={setReturnLocation}
                      onLocationSelect={(location) => {
                        if (location) {
                          setReturnLocationId(location.id);
                          setReturnLocationPrice(location.price || 0);
                        } else {
                          setReturnLocationId(null);
                          setReturnLocationPrice(0);
                        }
                      }}
                      placeholder="City, airport..."
                      inputRef={returnLocationInputRef}
                    />
                  </div>
                )}
              </div>

              {/* Date and Time Fields - Grouped */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pick-up Date & Time Group */}
                <div className="border-2 border-blue-400 rounded-lg p-3 bg-white/10">
                  <Popover open={calendarOpen && activeTrigger === "pickup"} onOpenChange={(open) => {
                    setCalendarOpen(open);
                    if (open) setActiveTrigger("pickup");
                    else setActiveTrigger(null);
                  }}>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {/* Pick-up Date */}
                      <div className="space-y-1">
                        <label className="text-xs text-gray-100 block">Pick-up date</label>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setActiveTrigger("pickup");
                              setCalendarOpen(true);
                            }}
                            className={cn(
                              "w-full justify-start text-left font-normal bg-white border-0 text-gray-900 h-12 hover:bg-white text-xs sm:text-sm",
                              !pickupDate && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                            <span className="text-sm">
                              {pickupDate ? formatDate(pickupDate) : "DD/MM/YYYY"}
                            </span>
                          </Button>
                        </PopoverTrigger>
                      </div>

                      {/* Pick-up Time */}
                      <TimeSelector
                        value={pickupTime}
                        onChange={setPickupTime}
                        label="Time"
                      />
                    </div>
                    <PopoverContent
                      className="w-auto p-0 z-50 max-w-[95vw] sm:max-w-none"
                      align="start"
                      sideOffset={8}
                      side="bottom"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <div className="overflow-x-auto p-0 m-0">
                        {mounted && (
                          <DatePicker
                            selected={pickupDate}
                            onChange={(date) => {
                              setPickupDate(date);
                              // If pickup date is after return date, reset return date
                              if (date && returnDate && date >= returnDate) {
                                // Set return date to next day after pickup
                                const nextDay = new Date(date);
                                nextDay.setDate(nextDay.getDate() + 1);
                                setReturnDate(nextDay);
                              }
                            }}
                            selectsStart
                            startDate={pickupDate}
                            endDate={returnDate}
                            minDate={new Date()}
                            monthsShown={isMobile ? 1 : 2}
                            inline
                            calendarClassName="!border-0"
                          />
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Return Date & Time Group */}
                <div className="border-2 border-blue-400 rounded-lg p-3 bg-white/10">
                  <Popover open={calendarOpen && activeTrigger === "return"} onOpenChange={(open) => {
                    setCalendarOpen(open);
                    if (open) setActiveTrigger("return");
                    else setActiveTrigger(null);
                  }}>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {/* Return Date */}
                      <div className="space-y-1">
                        <label className="text-xs text-gray-100 block">Return date</label>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setActiveTrigger("return");
                              setCalendarOpen(true);
                            }}
                            className={cn(
                              "w-full justify-start text-left font-normal bg-white border-0 text-gray-900 h-12 hover:bg-white text-xs sm:text-sm",
                              !returnDate && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                            <span className="text-sm">
                              {returnDate ? formatDate(returnDate) : "DD/MM/YYYY"}
                            </span>
                          </Button>
                        </PopoverTrigger>
                      </div>

                      {/* Return Time */}
                      <TimeSelector
                        value={returnTime}
                        onChange={setReturnTime}
                        label="Time"
                      />
                    </div>
                    <PopoverContent
                      className="w-auto p-0 z-50 max-w-[95vw] sm:max-w-none"
                      align="start"
                      sideOffset={8}
                      side="bottom"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <div className="p-0 m-0">
                        {mounted && (
                          <DatePicker
                            selected={returnDate}
                            onChange={(date) => {
                              setReturnDate(date);
                              // If return date is before or equal to pickup date, adjust pickup date
                              if (date && pickupDate && date <= pickupDate) {
                                // Set pickup date to previous day before return
                                const prevDay = new Date(date);
                                prevDay.setDate(prevDay.getDate() - 1);
                                if (prevDay >= new Date()) {
                                  setPickupDate(prevDay);
                                }
                              }
                            }}
                            selectsEnd
                            startDate={pickupDate}
                            endDate={returnDate}
                            minDate={pickupDate ? new Date(new Date(pickupDate).setDate(pickupDate.getDate() + 1)) : new Date()}
                            monthsShown={isMobile ? 1 : 2}
                            inline
                            calendarClassName="!border-0"
                          />
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Period Display */}
              {pickupDate && returnDate && (
                <div className="relative">
                  <div className="border-t border-dashed border-gray-300"></div>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#3B82F6] px-3 sm:px-4">
                    <span className="text-xs sm:text-sm text-gray-100">
                      Period: {periodDays} {periodDays === 1 ? "day" : "days"}
                    </span>
                  </div>
                </div>
              )}

              {/* Checkboxes and Search Button */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="same-store"
                      checked={sameStore}
                      onCheckedChange={(v) => setSameStore(!!v)}
                      className="border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <label
                      htmlFor="same-store"
                      className="text-xs sm:text-sm font-medium text-white cursor-pointer"
                    >
                      Return in the same Store
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="age-26-plus"
                      checked={ageConfirmed}
                      onCheckedChange={(v) => setAgeConfirmed(!!v)}
                      className="border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <label
                      htmlFor="age-26-plus"
                      className="text-xs sm:text-sm font-medium text-white cursor-pointer"
                    >
                      I am 26 years old or more
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full md:w-auto">
                  {/* Clear Button - Show if any field has data */}
                  {(pickupDate || returnDate || pickupLocation || returnLocation || pickupLocationId || returnLocationId) && (
                    <Button
                      onClick={handleClear}
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-4 sm:px-6 py-4 sm:py-6 text-sm sm:text-base font-medium flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                      <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                      CLEAR
                    </Button>
                  )}

                  {/* Search Button */}
                  <Button
                    onClick={handleSearch}
                    className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-medium flex items-center justify-center gap-2 w-full md:w-auto"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                    SEARCH
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSections;
