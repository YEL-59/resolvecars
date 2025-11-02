"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  MapPin,
  Clock,
  Car,
  Users,
  ArrowBigLeft,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { bookingStorage } from "@/lib/bookingStorage";

const HeroSections = () => {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const [pickupTime, setPickupTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [pickupDateOpen, setPickupDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [sameStore, setSameStore] = useState(true);

  const pickupTimeRef = useRef(null);
  const returnTimeRef = useRef(null);
  const locations = [
    { value: "new-york", label: "New York City" },
    { value: "los-angeles", label: "Los Angeles" },
    { value: "chicago", label: "Chicago" },
    { value: "miami", label: "Miami" },
    { value: "las-vegas", label: "Las Vegas" },
  ];

  const handleSearch = () => {
    if (!pickupDate || !returnDate || !location) {
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
      pickupLocation: location,
      dropoffLocation: sameStore ? location : destination,
      requirements: "",
      protectionPlan: "basic",
      extras: [],
    });

    router.push("/cars");
  };

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
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl max-w-7xl mx-auto text-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Locations (combined) */}
              <div className="space-y-3 lg:col-span-2">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Locations
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Pick-up Location */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">Pick-up Location</label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.value} value={loc.value}>
                            {loc.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Return Location (conditional) */}
                  {!sameStore ? (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">Return Location</label>
                      <Select value={destination} onValueChange={setDestination}>
                        <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc.value} value={loc.value}>
                              {loc.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">Return Location</label>
                      <div className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm text-gray-700 bg-gray-50">
                        Same as pick-up
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6 flex-wrap mt-2 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Checkbox id="same-store" checked={sameStore} onCheckedChange={(v) => setSameStore(!!v)} />
                    <label htmlFor="same-store" className="text-sm font-medium text-gray-900">
                      Return in the same Store
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="age-25-plus" />
                    <label htmlFor="age-25-plus" className="text-sm font-medium text-gray-900">
                      I am 25 years old or more
                    </label>
                  </div>
                </div>
              </div>

              {/* Pick-up Date & Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Pick-up Date
                </label>
                <Popover open={pickupDateOpen} onOpenChange={setPickupDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border border-gray-300 text-gray-900",
                        !pickupDate && "text-muted-foreground"
                      )}
                      onClick={() => setPickupDateOpen(true)}
                    >
                      {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={(date) => {
                        setPickupDate(date);
                        setPickupDateOpen(false);
                        setTimeout(() => {
                          pickupTimeRef.current?.focus();
                        }, 0);
                      }}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pick-up Time
                </label>
                <Input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => {
                    setPickupTime(e.target.value);
                    setReturnDateOpen(true);
                  }}
                  ref={pickupTimeRef}
                  className="border border-gray-300 text-gray-900 placeholder:text-gray-500"
                />
              </div>

              {/* Return Date & Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Return Date
                </label>
                <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border border-gray-300 text-gray-900",
                        !returnDate && "text-muted-foreground"
                      )}
                      onClick={() => setReturnDateOpen(true)}
                    >
                      {returnDate ? format(returnDate, "PPP") : "Select date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={(date) => {
                        setReturnDate(date);
                        setReturnDateOpen(false);
                        setTimeout(() => {
                          returnTimeRef.current?.focus();
                        }, 0);
                      }}
                      disabled={(date) =>
                        date < pickupDate || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Return Time
                </label>
                <Input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  ref={returnTimeRef}
                  className="border border-gray-300 text-gray-900 placeholder:text-gray-500"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full bg-primary hover:bg-primary/90 text-white text-lg ">
                  Search Cars
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
