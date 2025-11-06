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
} from "lucide-react";
import { format, differenceInDays, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { bookingStorage } from "@/lib/bookingStorage";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// Fake location data
const LOCATIONS = [
  { id: 1, name: "Majorca Palma Airport (PMI)", address: "Palma de Mallorca, Spain" },
  { id: 2, name: "Barcelona El Prat Airport (BCN)", address: "Barcelona, Spain" },
  { id: 3, name: "Madrid Barajas Airport (MAD)", address: "Madrid, Spain" },
  { id: 4, name: "Paris Charles de Gaulle (CDG)", address: "Paris, France" },
  { id: 5, name: "London Heathrow (LHR)", address: "London, UK" },
  { id: 6, name: "Rome Fiumicino Airport (FCO)", address: "Rome, Italy" },
  { id: 7, name: "Amsterdam Schiphol (AMS)", address: "Amsterdam, Netherlands" },
  { id: 8, name: "Berlin Brandenburg (BER)", address: "Berlin, Germany" },
  { id: 9, name: "Vienna Airport (VIE)", address: "Vienna, Austria" },
  { id: 10, name: "Prague Airport (PRG)", address: "Prague, Czech Republic" },
  { id: 11, name: "Dubai International (DXB)", address: "Dubai, UAE" },
  { id: 12, name: "New York JFK (JFK)", address: "New York, USA" },
  { id: 13, name: "Los Angeles (LAX)", address: "Los Angeles, USA" },
  { id: 14, name: "Tokyo Narita (NRT)", address: "Tokyo, Japan" },
  { id: 15, name: "Sydney Airport (SYD)", address: "Sydney, Australia" },
];

// Searchable Location Input Component
const SearchableLocationInput = ({
  value,
  onChange,
  placeholder = "City, airport...",
  label
}) => {
  const [searchQuery, setSearchQuery] = useState(value || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value) {
      setSearchQuery(value);
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
      const filtered = LOCATIONS.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query.toLowerCase()) ||
          loc.address.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowSuggestions(true);
    } else {
      // Show all locations when input is empty but focused
      setFilteredLocations(LOCATIONS);
      setShowSuggestions(true);
      onChange("");
    }
  };

  const handleSelectLocation = (location) => {
    setSearchQuery(location.name);
    onChange(location.name);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchQuery("");
    onChange("");
    setFilteredLocations([]);
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
            if (searchQuery.trim().length > 0) {
              // If there's a query, filter locations
              const filtered = LOCATIONS.filter(
                (loc) =>
                  loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  loc.address.toLowerCase().includes(searchQuery.toLowerCase())
              );
              setFilteredLocations(filtered);
            } else {
              // If no query, show all locations
              setFilteredLocations(LOCATIONS);
            }
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

      {showSuggestions && filteredLocations.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredLocations.map((location) => (
            <button
              key={location.id}
              type="button"
              onClick={() => handleSelectLocation(location)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-900">{location.name}</div>
              <div className="text-sm text-gray-500">{location.address}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const HeroSections = () => {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const [dateRange, setDateRange] = useState([
    {
      startDate: undefined,
      endDate: undefined,
      key: "selection",
    },
  ]);
  const [pickupTime, setPickupTime] = useState("13:00");
  const [returnTime, setReturnTime] = useState("13:30");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeTrigger, setActiveTrigger] = useState(null); // Track which button was clicked
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [sameStore, setSameStore] = useState(true);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const pickupTimeRef = useRef(null);
  const returnTimeRef = useRef(null);

  // Sync dateRange with pickupDate and returnDate (only when dates change externally)
  useEffect(() => {
    if (!mounted) return;

    if (pickupDate || returnDate) {
      const startDate = pickupDate ? startOfDay(pickupDate) : undefined;
      const endDate = returnDate ? startOfDay(returnDate) : undefined;

      // Only update if dates actually changed
      const currentStart = dateRange[0]?.startDate;
      const currentEnd = dateRange[0]?.endDate;

      if (
        (startDate && (!currentStart || currentStart.getTime() !== startDate.getTime())) ||
        (!startDate && currentStart) ||
        (endDate && (!currentEnd || currentEnd.getTime() !== endDate.getTime())) ||
        (!endDate && currentEnd)
      ) {
        setDateRange([
          {
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            key: "selection",
          },
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupDate, returnDate, mounted]);

  // Calculate period in days (including both start and end days)
  const periodDays = pickupDate && returnDate
    ? Math.max(1, differenceInDays(returnDate, pickupDate) + 1)
    : 0;

  // Format date as DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
  };

  // Handle date range selection with drag support
  const handleDateRangeSelect = (item) => {
    const selection = item.selection;
    setDateRange([selection]);

    // Update individual dates
    if (selection.startDate) {
      setPickupDate(selection.startDate);
    }
    if (selection.endDate) {
      setReturnDate(selection.endDate);
      // Close calendar when both dates are selected (with a small delay for smooth UX)
      if (selection.startDate && selection.endDate) {
        setTimeout(() => {
          setCalendarOpen(false);
          setActiveTrigger(null);
        }, 300);
      }
    }
  };

  const handleSearch = () => {
    if (!pickupDate || !returnDate || !pickupLocation) {
      return;
    }
    if (!sameStore && !returnLocation) {
      return;
    }
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

    bookingStorage.updateStep("step1", {
      pickupDate: toISO(pickupDate, pickupTime),
      dropoffDate: toISO(returnDate, returnTime),
      pickupLocation: pickupLocation,
      dropoffLocation: sameStore ? pickupLocation : returnLocation,
      requirements: "",
      protectionPlan: "basic",
      extras: [],
    });

    router.push("/cars");
  };

  // Clear return location when sameStore is checked
  useEffect(() => {
    if (sameStore) {
      setReturnLocation("");
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

  // Add smooth styles for react-date-range calendar
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .rdrDateRangePickerWrapper {
        font-family: inherit !important;
      }
      .rdrDateRangeWrapper {
        border-radius: 0.5rem;
        overflow: hidden;
      }
      .rdrCalendarWrapper {
        background: white;
        border-radius: 0.5rem;
      }
      .rdrDayStartOfMonth .rdrDayNumber span,
      .rdrDayEndOfMonth .rdrDayNumber span {
        color: inherit !important;
      }
      .rdrDayInRange {
        background-color: rgb(191 219 254) !important;
        color: rgb(30 58 138) !important;
        transition: all 0.2s ease-in-out !important;
      }
      .rdrDayInRange:hover {
        background-color: rgb(147 197 253) !important;
      }
      .rdrDayStartOfRange,
      .rdrDayEndOfRange {
        background-color: rgb(37 99 235) !important;
        color: white !important;
        border-radius: 0.375rem !important;
        transition: all 0.2s ease-in-out !important;
      }
      .rdrDayStartOfRange:hover,
      .rdrDayEndOfRange:hover {
        background-color: rgb(29 78 216) !important;
      }
      .rdrDay:not(.rdrDayPassive):hover .rdrDayNumber span {
        background-color: rgb(219 234 254) !important;
        transition: background-color 0.15s ease-in-out !important;
      }
      .rdrDayNumber {
        cursor: pointer !important;
        transition: all 0.2s ease-in-out !important;
        user-select: none !important;
      }
      .rdrDayNumber:active {
        transform: scale(0.95);
      }
      .rdrDaySelected .rdrDayNumber span {
        background-color: rgb(37 99 235) !important;
        color: white !important;
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
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
            >
              Explore Our Fleet
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 border-white text-white px-8 py-3 text-lg"
            >
              Learn More
            </Button>
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
                      placeholder="City, airport..."
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
                      <div className="space-y-1">
                        <label className="text-xs text-gray-100 block">Time</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                          <Input
                            type="time"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            ref={pickupTimeRef}
                            className="pl-10 h-12 bg-white border-0 text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                    <PopoverContent
                      className="w-auto p-0 z-50 max-w-[95vw] sm:max-w-none"
                      align="start"
                      sideOffset={8}
                      side="bottom"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <div className="overflow-x-auto">
                        {mounted && (
                          <DateRangePicker
                            ranges={dateRange}
                            onChange={handleDateRangeSelect}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            months={isMobile ? 1 : 2}
                            direction="horizontal"
                            minDate={new Date()}
                            rangeColors={["rgb(37 99 235)"]}
                            showDateDisplay={false}
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
                      <div className="space-y-1">
                        <label className="text-xs text-gray-100 block">Time</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                          <Input
                            type="time"
                            value={returnTime}
                            onChange={(e) => setReturnTime(e.target.value)}
                            ref={returnTimeRef}
                            className="pl-10 h-12 bg-white border-0 text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                    <PopoverContent
                      className="w-auto p-0 z-50 max-w-[95vw] sm:max-w-none"
                      align="start"
                      sideOffset={8}
                      side="bottom"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <div className="overflow-x-auto">
                        {mounted && (
                          <DateRangePicker
                            ranges={dateRange}
                            onChange={handleDateRangeSelect}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            months={isMobile ? 1 : 2}
                            direction="horizontal"
                            minDate={new Date()}
                            rangeColors={["rgb(37 99 235)"]}
                            showDateDisplay={false}
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
    </section>
  );
};

export default HeroSections;
