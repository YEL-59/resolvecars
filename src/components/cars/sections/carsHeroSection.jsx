"use client";

import React, { useState, useEffect } from "react";
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
import { CalendarIcon, MapPin, Clock, Car, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { bookingStorage } from "@/lib/bookingStorage";
import { useRouter } from "next/navigation";

const CarsHeroSection = () => {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");
  useEffect(() => {
    const step1 = bookingStorage.getStep("step1") || {};
    try {
      if (step1.pickupDate) setPickupDate(new Date(step1.pickupDate));
      if (step1.dropoffDate) setReturnDate(new Date(step1.dropoffDate));
      if (step1.pickupLocation) setLocation(step1.pickupLocation);
      if (step1.dropoffLocation) setDestination(step1.dropoffLocation);
    } catch {}
  }, []);
  const locations = [
    { value: "new-york", label: "New York City" },
    { value: "los-angeles", label: "Los Angeles" },
    { value: "chicago", label: "Chicago" },
    { value: "miami", label: "Miami" },
    { value: "las-vegas", label: "Las Vegas" },
  ];
  return (
    <div className="container mx-auto py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">
          Find Your Perfect Car
        </h1>
        <p className="text-lg text-gray-600">
          Browse our extensive fleet of premium vehicles and find the perfect
          car for your journey.
        </p>
      </div>
      {/* Search Form */}
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl max-w-7xl mx-auto shadow-2xl ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Pick-up Location
            </label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full">
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
          {/* desLocation */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Return Location
            </label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="w-full">
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

          {/* Pick-up Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Pick-up Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border border-gray-300",
                    !pickupDate && "text-muted-foreground"
                  )}
                >
                  {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={pickupDate}
                  onSelect={setPickupDate}
                  disabled={(date) =>
                    date < new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Return Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border border-gray-300",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  {returnDate ? format(returnDate, "PPP") : "Select date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(date) =>
                    date < pickupDate || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white h-10"
              onClick={() => {
                if (!pickupDate || !returnDate || !location) {
                  alert("Please fill in all required fields");
                  return;
                }
                const toISO = (dateObj) => {
                  try {
                    if (!dateObj) return "";
                    const d = new Date(dateObj);
                    return d.toISOString();
                  } catch {
                    return "";
                  }
                };

                bookingStorage.updateStep("step1", {
                  pickupDate: toISO(pickupDate),
                  dropoffDate: toISO(returnDate),
                  pickupLocation: location,
                  dropoffLocation: destination || location,
                  requirements: "",
                  protectionPlan: "basic",
                  extras: [],
                });
                
                // The page will stay on /cars but the data is saved
                // User can now click on a car to see insurance prices
              }}
            >
              Search Cars
            </Button>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox id="include-children" />
            <label
              htmlFor="include-children"
              className="text-sm font-medium text-gray-900"
            >
              Return in the same Store
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="include-children" />
            <label
              htmlFor="include-children"
              className="text-sm font-medium text-gray-900"
            >
              I am 25 years old or more
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarsHeroSection;
