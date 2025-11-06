"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Star, Grid3X3, List, Plane, Users, Car as CarIcon, Info, Check } from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { carsData } from "@/lib/carsData";

// Sample car data (fallback if needed)
const localCarsData = [
  {
    id: 1,
    name: "BMW 3 Series",
    image: "/assets/cars/bmw-3.png",
    type: "SEDAN",
    year: 2025,
    price: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.0,
    passengers: 4,
    transmission: "automatic",
    fuelType: "gasoline",
    features: [
      "Premium Sound System",
      "BOSE Sound System",
      "Leather Seats",
      "Premium coverage included",
      "Fuel tank full/full",
    ],
    description:
      "Experience luxury and performance with the BMW 3 Series. Perfect for business trips...",
  },
  {
    id: 2,
    name: "Mercedes GLC",
    image: "/assets/cars/mercedes-glc.png",
    type: "SUV",
    year: 2025,
    price: 349,
    originalPrice: 449,
    discount: 20,
    rating: 4.5,
    passengers: 5,
    transmission: "automatic",
    fuelType: "hybrid",
    features: [
      "Premium Sound System",
      "Panoramic Sunroof",
      "Leather Seats",
      "Premium coverage included",
      "Fuel tank full/full",
    ],
    description:
      "Luxury SUV with advanced features and comfortable interior...",
  },
  // Add more cars here...
];

const categories = ["All Categories", "Luxury", "SUV", "Sports", "Electric"];
const sortOptions = [
  "Name (A-Z)",
  "Price (Low to High)",
  "Price (High to Low)",
  "Rating",
];

// Pricing plans data
const pricingPlans = [
  {
    id: "premium",
    name: "PREMIUM",
    headerColor: "bg-blue-900",
    features: [
      { text: "Activation", badge: "FASTTRACK", badgeIcon: true },
      { text: "Premium coverage included", hasInfo: true },
      { text: "Free cancellation and modification" },
      { text: "No Excess" },
      { text: "Fuel tank full/ full" },
      { text: "Refundable" },
    ],
    discount: 20,
    originalPrice: 32.29,
  },
  {
    id: "smart",
    name: "SMART",
    headerColor: "bg-blue-900",
    features: [
      { text: "Premium coverage included", hasInfo: true },
      { text: "No Excess" },
      { text: "Fuel tank full/ full" },
      { text: "Non-refundable" },
    ],
    discount: 20,
    originalPrice: 30.71,
  },
  {
    id: "lite",
    name: "LITE",
    headerColor: "bg-gray-600",
    features: [
      { text: "Fuel tank full/ full" },
      { text: "Non-refundable" },
      { text: "Excess", hasInfo: true },
    ],
    discount: 20,
    originalPrice: 13.75,
  },
  {
    id: "standard",
    name: "STANDARD",
    headerColor: "bg-gray-600",
    features: [
      { text: "Basic coverage" },
      { text: "Excess", hasInfo: true },
      { text: "Non-refundable" },
    ],
    discount: 15,
    originalPrice: 15.50,
  },
];

export default function CarsCardSection() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("Name (A-Z)");
  const [visibleCars, setVisibleCars] = useState(10);
  const [viewMode, setViewMode] = useState("flex"); // Default to flex view
  const [rentalDays, setRentalDays] = useState(23);

  // Calculate rental days from booking storage
  useEffect(() => {
    const step1Data = bookingStorage.getStep("step1") || {};
    if (step1Data.pickupDate && step1Data.dropoffDate) {
      try {
        const pickup = new Date(step1Data.pickupDate);
        const dropoff = new Date(step1Data.dropoffDate);
        const diffTime = Math.abs(dropoff - pickup);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setRentalDays(diffDays > 0 ? diffDays : 23);
      } catch {
        setRentalDays(23);
      }
    }
  }, []);

  // Filter and sort cars
  const filteredCars = (carsData || localCarsData)
    .filter((car) => {
      const matchesSearch = car.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" ||
        car.category === selectedCategory;
      const matchesPrice =
        car.price >= priceRange[0] && car.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Price (Low to High)":
          return a.price - b.price;
        case "Price (High to Low)":
          return b.price - a.price;
        case "Rating":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const displayedCars = filteredCars.slice(0, visibleCars);

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Available Cars</h2>

          <div className="flex items-center gap-4">
            {/* View Toggle Buttons */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "flex" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("flex")}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                List
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-2"
              >
                <Grid3X3 className="w-4 h-4" />
                Grid
              </Button>
            </div>

            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <Input
                      placeholder="Search by make, model, or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Price Range: ${priceRange[0]} - ${priceRange[1]} per day
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      step={10}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sorting" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Cars Display */}
        {viewMode === "grid" ? (
          // Grid View (existing card design)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-2 py-1 rounded text-sm">
                      {car.category}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{car.name}</h3>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        ${car.price}
                      </p>
                      <p className="text-sm text-gray-500">per day</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(car.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({car.reviews} reviews)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <span>Year:</span>
                      <span className="font-medium">{car.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Transmission:</span>
                      <span className="font-medium">{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Fuel:</span>
                      <span className="font-medium">{car.fuel}</span>
                    </div>
                  </div>

                  <Button className="w-full">Book Now</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Flex View (horizontal card design matching image)
          <div className="space-y-6">
            {displayedCars.map((car) => {
              // Calculate pricing for each plan
              const plansWithPricing = pricingPlans.map((plan) => {
                const currentPrice = plan.originalPrice * (1 - plan.discount / 100);
                const totalPrice = currentPrice * rentalDays;
                return {
                  ...plan,
                  currentPrice: currentPrice.toFixed(2),
                  totalPrice: totalPrice.toFixed(0),
                };
              });

              // Get transmission display (M for manual, A for automatic)
              const transmissionDisplay = car.transmission === "manual" ? "M" : "A";
              // Calculate doors (assuming 5 for sedans/SUVs, 3 for coupes)
              const doors = car.type === "SPORTS" ? 3 : 5;

              return (
                <div
                  key={car.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Section - Car Details */}
                    <div className="lg:w-1/3 p-4 lg:p-6 border-r-0 lg:border-r border-gray-200 border-b lg:border-b-0 pb-4 lg:pb-6">
                      {/* Car Model Name */}
                      <h3 className="text-2xl font-bold text-blue-600 mb-2">
                        {car.name} or similar
                      </h3>

                      {/* Car Type */}
                      <p className="text-sm text-gray-600 mb-4">{car.type}</p>

                      {/* Collection Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <Plane className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 uppercase">
                          COLLECTION AT AIRPORT TERMINAL
                        </span>
                      </div>

                      {/* Best Price Badge */}
                      <div className="mb-4">
                        <span className="text-red-600 text-sm font-medium">
                          Best price for these dates
                        </span>
                      </div>

                      {/* Car Image */}
                      <div className="relative w-full h-48 mb-4 bg-gray-50 rounded-lg overflow-hidden">
                        <Image
                          src={car.image}
                          alt={car.name}
                          fill
                          className="object-contain p-4"
                        />
                      </div>

                      {/* Specifications */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium">{car.passengers}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CarIcon className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium">{doors}</span>
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
                          <span className="text-sm font-medium">{transmissionDisplay}</span>
                        </div>
                      </div>

                      {/* Unlimited Mileage */}
                      <div className="mt-4">
                        <span className="text-sm font-semibold uppercase text-gray-700">
                          UNLIMITED MILEAGE
                        </span>
                      </div>
                    </div>

                    {/* Right Section - Pricing Plan Cards */}
                    <div className="lg:w-2/3 p-4 lg:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
                        {plansWithPricing.map((plan) => (
                          <div
                            key={plan.id}
                            className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow min-w-[200px]"
                          >
                            {/* Header */}
                            <div
                              className={`${plan.headerColor} text-white px-4 py-3 flex items-center justify-between`}
                            >
                              <span className="font-semibold text-sm">{plan.name}</span>
                              <Info className="w-4 h-4" />
                            </div>

                            {/* Features */}
                            <div className="flex-1 bg-white p-4 space-y-2">
                              {plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs text-gray-700">{feature.text}</span>
                                    {feature.badge && (
                                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                        {feature.badgeIcon && (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <line x1="3" y1="12" x2="21" y2="12" />
                                            <line x1="3" y1="8" x2="21" y2="8" />
                                            <line x1="3" y1="16" x2="21" y2="16" />
                                            <circle cx="12" cy="12" r="1" />
                                          </svg>
                                        )}
                                        {feature.badge}
                                        <Info className="w-3 h-3" />
                                      </span>
                                    )}
                                    {feature.hasInfo && (
                                      <Info className="w-3 h-3 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Pricing */}
                            <div className="bg-white p-4 border-t border-gray-100">
                              <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded inline-block mb-2">
                                -{plan.discount}%
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-gray-500 line-through">
                                  {plan.originalPrice.toFixed(2)} €/day
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                  {plan.currentPrice} € /day
                                </p>
                                <p className="text-sm text-gray-600">
                                  {plan.totalPrice} € {rentalDays} days
                                </p>
                              </div>
                            </div>

                            {/* Continue Button */}
                            <Button
                              onClick={() => {
                                bookingStorage.setCar(car);
                                bookingStorage.updateStep("step1", {
                                  ...bookingStorage.getStep("step1"),
                                  protectionPlan: plan.id,
                                });
                                router.push("/booking/step1");
                              }}
                              className="m-4 bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded"
                            >
                              CONTINUE
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {visibleCars < filteredCars.length && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setVisibleCars(filteredCars.length)}
              className="mx-auto"
            >
              View All Cars
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
