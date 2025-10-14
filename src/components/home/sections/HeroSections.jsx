"use client";

import React, { useState } from "react";
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

const HeroSections = () => {
  const [pickupDate, setPickupDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");
  const locations = [
    { value: "new-york", label: "New York City" },
    { value: "los-angeles", label: "Los Angeles" },
    { value: "chicago", label: "Chicago" },
    { value: "miami", label: "Miami" },
    { value: "las-vegas", label: "Las Vegas" },
  ];

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
        {/* <div className="absolute inset-0 bg-black/40"></div> */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        {/* Hero Text */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Premium Car Rental
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 text-primary">
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
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Pick-up Location
                </label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700">
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
                  <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700">
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
                <Button className="w-full bg-primary hover:bg-primary/90 text-white h-10">
                  Search Cars
                </Button>
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-2 ">
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
      </div>
    </section>
  );
};

export default HeroSections;
