"use client";

import { useState, useEffect } from "react";
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
import { Star, Grid3X3, List, Plane, Users, Car as CarIcon, Info, Check, Loader2 } from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";
import { useRouter, useSearchParams } from "next/navigation";
import { useCars, useSearchCars } from "@/hooks/cars.hook";

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

// Helper function to transform API package to pricing plan format
const transformPackageToPlan = (pkg, index) => {
  const packageType = pkg.package_type?.toLowerCase() || "standard";
  const isPremium = packageType === "premium";

  return {
    id: pkg.id || pkg.package_type || `package-${index}`,
    name: pkg.package_type_display?.toUpperCase() || pkg.package_type?.toUpperCase() || "STANDARD",
    headerColor: isPremium ? "bg-blue-900" : "bg-gray-600",
    features: (pkg.features || []).map((feature, featureIdx) => ({
      text: feature,
      hasInfo: feature.toLowerCase().includes("coverage") || feature.toLowerCase().includes("excess"),
      // Only show badge on the first feature of the first premium package
      badge: isPremium && index === 0 && featureIdx === 0 ? "RECOMMENDED" : undefined,
      badgeIcon: isPremium && index === 0 && featureIdx === 0,
    })),
    discount: pkg.discount_percentage || 0,
    originalPrice: pkg.original_price_per_day || pkg.price_per_day || 0,
    pricePerDay: pkg.price_per_day || 0,
    hasDiscount: pkg.has_discount || false,
    displayPrice: pkg.display_price,
    originalDisplayPrice: pkg.original_display_price,
  };
};

export default function CarsCardSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("Name (A-Z)");
  const [visibleCars, setVisibleCars] = useState(10);
  const [viewMode, setViewMode] = useState("flex"); // Default to flex view
  const [rentalDays, setRentalDays] = useState(23);

  // Get search parameters from URL
  const pickupLocationId = searchParams.get("pickup_location_id");
  const returnLocationId = searchParams.get("return_location_id");
  const pickupDate = searchParams.get("pickup_date");
  const pickupTime = searchParams.get("pickup_time") || "12:00";
  const returnDate = searchParams.get("return_date");
  const returnTime = searchParams.get("return_time") || "12:00";

  // Use search API if search parameters are present, otherwise use regular cars API
  const hasSearchParams = pickupLocationId && pickupDate && returnDate;

  const searchCarsQuery = useSearchCars(
    hasSearchParams
      ? {
        pickup_location_id: pickupLocationId,
        return_location_id: returnLocationId || undefined,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        return_date: returnDate,
        return_time: returnTime,
      }
      : { pickup_location_id: null, pickup_date: null, return_date: null }
  );

  const regularCarsQuery = useCars({ per_page: 15 });

  // Use search results if available, otherwise use regular cars
  const { data, isLoading, isError, error } = hasSearchParams
    ? searchCarsQuery
    : regularCarsQuery;

  // Calculate rental days from search API meta, search params, or booking storage
  useEffect(() => {
    // First, try to use rental_period.days from search API meta
    if (data?.meta?.rental_period?.days) {
      setRentalDays(data.meta.rental_period.days);
      return;
    }

    // Otherwise, calculate from dates
    if (pickupDate && returnDate) {
      try {
        const pickup = new Date(pickupDate);
        const returnD = new Date(returnDate);
        const diffTime = Math.abs(returnD - pickup);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setRentalDays(diffDays > 0 ? diffDays : 1);
      } catch {
        // Fallback to booking storage
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
      }
    } else {
      // Fallback to booking storage
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
    }
  }, [pickupDate, returnDate, data?.meta?.rental_period?.days]);

  // Get available categories from API data
  const availableCategories = ["All Categories"];
  if (data?.cars) {
    const categories = new Set(data.cars.map(car => car.category).filter(Boolean));
    availableCategories.push(...Array.from(categories));
  }

  // Filter and sort cars
  const carsToFilter = data?.cars || localCarsData;
  const filteredCars = carsToFilter
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
                        {availableCategories.map((category) => (
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading cars...</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">
              {error?.response?.data?.message || "Failed to load cars. Please try again."}
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Cars Display */}
        {!isLoading && !isError && (
          <>
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

                      <Button
                        className="w-full"
                        onClick={() => {
                          bookingStorage.setCar(car);
                          router.push(`/cars/${car.id}`);
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Flex View (horizontal card design matching image)
              <div className="space-y-6">
                {displayedCars.map((car) => {
                  // Get packages from API data or use default pricing plans
                  const carPackages = car.packages && car.packages.length > 0
                    ? car.packages
                    : [
                      {
                        package_type: "premium",
                        package_type_display: "Premium",
                        features: ["Premium coverage included", "Free cancellation and modification", "No Excess", "Fuel tank full/full", "Refundable"],
                        price_per_day: car.price || 0,
                        original_price_per_day: car.originalPrice || car.price || 0,
                        discount_percentage: car.discount || 0,
                        has_discount: car.discount > 0,
                      }
                    ];

                  // Transform packages to pricing plans format
                  const plansWithPricing = carPackages
                    .filter(pkg => pkg.is_active !== false) // Only show active packages
                    .map((pkg, index) => {
                      const plan = transformPackageToPlan(pkg, index);

                      // Use rental_calculation from API if available (from search API), otherwise calculate
                      const rentalCalc = pkg.rental_calculation;
                      let currentPrice, totalPrice;

                      if (rentalCalc) {
                        // Use API calculated prices
                        currentPrice = rentalCalc.daily_rate || rentalCalc.base_rental_cost || plan.pricePerDay || 0;
                        totalPrice = rentalCalc.base_rental_cost || (currentPrice * (rentalCalc.rental_days || rentalDays));
                      } else {
                        // Calculate manually
                        currentPrice = plan.pricePerDay || (plan.originalPrice * (1 - plan.discount / 100));
                        totalPrice = currentPrice * rentalDays;
                      }

                      return {
                        ...plan,
                        currentPrice: currentPrice.toFixed(2),
                        totalPrice: totalPrice.toFixed(0),
                        pricePerDay: currentPrice,
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto">
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
                                  {plan.hasDiscount && plan.discount > 0 && (
                                    <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded inline-block mb-2">
                                      -{plan.discount}%
                                    </div>
                                  )}
                                  <div className="space-y-1">
                                    {plan.originalPrice > plan.pricePerDay && (
                                      <p className="text-xs text-gray-500 line-through">
                                        {plan.originalDisplayPrice || `${plan.originalPrice.toFixed(2)} €/day`}
                                      </p>
                                    )}
                                    <p className="text-lg font-bold text-gray-900">
                                      {plan.displayPrice || `${plan.currentPrice} €/day`}
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
          </>
        )}

        {/* No Cars Found */}
        {!isLoading && !isError && filteredCars.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No cars found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
