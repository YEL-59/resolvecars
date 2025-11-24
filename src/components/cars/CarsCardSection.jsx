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
import { Star, Grid3X3, List, Plane, Users, Car as CarIcon, Info, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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

// Helper function to get car_prices from car object (check multiple locations)
const getCarPrices = (car) => {
  // Check direct model.car_prices
  if (car?.model?.car_prices && Array.isArray(car.model.car_prices)) {
    return car.model.car_prices;
  }
  // Check _apiData.model.car_prices (from transformed data)
  if (car?._apiData?.model?.car_prices && Array.isArray(car._apiData.model.car_prices)) {
    return car._apiData.model.car_prices;
  }
  return null;
};

// Helper function to get dynamic car price based on selected dates
const getCarPriceForDate = (car, selectedDate) => {
  const carPrices = getCarPrices(car);
  if (!carPrices || !selectedDate) {
    return null;
  }

  // Parse date string (YYYY-MM-DD) as local date
  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const selected = parseLocalDate(selectedDate);

  // Find the price range that matches the selected date
  const matchingPrice = carPrices.find((priceRange) => {
    if (!priceRange.is_active) return false;

    const startDate = parseLocalDate(priceRange.start_date);
    const endDate = parseLocalDate(priceRange.end_date);
    endDate.setHours(23, 59, 59, 999);

    return selected >= startDate && selected <= endDate;
  });

  return matchingPrice || null;
};

// Helper function to get car price for current date (today) - uses user's local time
const getCarPriceForCurrentDate = (car) => {
  const today = new Date();
  // Get local date string in YYYY-MM-DD format
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const localDateString = `${year}-${month}-${day}`;
  return getCarPriceForDate(car, localDateString);
};

// Helper function to get average car price for date range
const getCarPriceForDateRange = (car, pickupDate, returnDate) => {
  const carPrices = getCarPrices(car);
  if (!carPrices || !pickupDate || !returnDate) {
    return null;
  }

  // Parse date string (YYYY-MM-DD) as local date
  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const pickup = parseLocalDate(pickupDate);
  const returnD = parseLocalDate(returnDate);
  returnD.setHours(23, 59, 59, 999);

  // Get all active price ranges
  const activePrices = carPrices.filter(p => p.is_active);

  if (activePrices.length === 0) return null;

  // Find prices that overlap with the rental period
  const matchingPrices = activePrices.filter((priceRange) => {
    const startDate = parseLocalDate(priceRange.start_date);
    const endDate = parseLocalDate(priceRange.end_date);
    endDate.setHours(23, 59, 59, 999);

    // Check if price range overlaps with rental period
    return (pickup <= endDate && returnD >= startDate);
  });

  if (matchingPrices.length === 0) {
    // If no exact match, use the price for pickup date
    return getCarPriceForDate(car, pickupDate);
  }

  // If multiple price ranges, calculate weighted average based on days
  if (matchingPrices.length === 1) {
    return matchingPrices[0];
  }

  // For multiple ranges, use the price for the pickup date (primary date)
  return getCarPriceForDate(car, pickupDate) || matchingPrices[0];
};

// Helper function to check if car is unavailable
const isCarUnavailable = (car, pickupDate = null, returnDate = null) => {
  // First check the car's status field - if status is not "available", car is unavailable
  const carStatus = car.status || car._apiData?.status;
  if (carStatus && carStatus.toLowerCase() !== "available") {
    return true;
  }

  // Parse date string (YYYY-MM-DD) as local date
  const parseLocalDate = (dateString) => {
    if (!dateString) return null;
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      return date;
    } catch {
      return null;
    }
  };

  const availableDate = car.available_date || car._apiData?.available_date;
  const availableStartDate = car.available_start_date || car._apiData?.available_start_date;
  const availableEndDate = car.available_end_date || car._apiData?.available_end_date;

  // If we have pickup and return dates, check if they fall within the available range
  if (pickupDate && returnDate) {
    const selectedPickup = parseLocalDate(pickupDate);
    const selectedReturn = parseLocalDate(returnDate);

    if (selectedPickup && selectedReturn) {
      // If available_start_date and available_end_date are both null, car is available
      // (no date restrictions)
      if ((availableStartDate === null || availableStartDate === undefined) &&
        (availableEndDate === null || availableEndDate === undefined)) {
        // Check legacy available_date field
        if (availableDate !== null && availableDate !== undefined) {
          const available = parseLocalDate(availableDate);
          // If available_date is in the past relative to pickup, car is unavailable
          if (available && selectedPickup < available) {
            return true;
          }
        }
        return false; // No date restrictions, car is available
      }

      // Check if selected dates fall within available range
      const startDate = parseLocalDate(availableStartDate);
      const endDate = parseLocalDate(availableEndDate);

      // If we have a start date and pickup is before it, car is unavailable
      if (startDate && selectedPickup < startDate) {
        return true;
      }

      // If we have an end date and return is after it, car is unavailable
      if (endDate && selectedReturn > endDate) {
        return true;
      }

      // Selected dates are within the available range (or no end date means available indefinitely)
      return false;
    }
  }

  // If no pickup/return dates provided, check against today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If available_date is null AND both start/end dates are null, car is available
  // (no restrictions means available)
  if ((availableDate === null || availableDate === undefined) &&
    (availableStartDate === null || availableStartDate === undefined) &&
    (availableEndDate === null || availableEndDate === undefined)) {
    return false; // No restrictions, car is available
  }

  // Check available_date (legacy field) - if it's in the past, car is unavailable
  if (availableDate !== null && availableDate !== undefined) {
    const available = parseLocalDate(availableDate);
    if (available && available < today) {
      return true; // available_date is in the past
    }
  }

  // Check available_start_date and available_end_date (new fields)
  const startDate = parseLocalDate(availableStartDate);
  const endDate = parseLocalDate(availableEndDate);

  // If we have a start date and today is before it, car is unavailable
  if (startDate && today < startDate) {
    return true;
  }

  // If we have an end date and today is after it, car is unavailable
  if (endDate && today > endDate) {
    return true;
  }

  // If we reach here, car is available
  // (either no date restrictions, or today is within the available range)
  return false;
};

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
  const [viewMode, setViewMode] = useState("flex"); // Default to flex view
  const [rentalDays, setRentalDays] = useState(23);

  // Get search parameters from URL
  const pickupLocationId = searchParams.get("pickup_location_id");
  const returnLocationId = searchParams.get("return_location_id");
  const pickupDate = searchParams.get("pickup_date");
  const pickupTime = searchParams.get("pickup_time") || "12:00";
  const returnDate = searchParams.get("return_date");
  const returnTime = searchParams.get("return_time") || "12:00";

  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

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

  const regularCarsQuery = useCars({ per_page: 5, page: currentPage });

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

  const displayedCars = filteredCars;
  const pagination = data?.pagination;

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
                {displayedCars.map((car) => {
                  // Check if car is unavailable (pass pickup and return dates if available)
                  const isUnavailable = isCarUnavailable(car, pickupDate, returnDate);

                  // Get dynamic car price based on selected dates or current date
                  const dynamicCarPrice = pickupDate && returnDate
                    ? getCarPriceForDateRange(car, pickupDate, returnDate)
                    : pickupDate
                      ? getCarPriceForDate(car, pickupDate)
                      : getCarPriceForCurrentDate(car); // Use current date if no search params

                  // Use dynamic price if available, otherwise fallback to car.price
                  const displayPrice = dynamicCarPrice
                    ? dynamicCarPrice.price_per_day
                    : car.price;

                  const displayPriceFormatted = dynamicCarPrice
                    ? dynamicCarPrice.display_price || `$${displayPrice.toFixed(2)}`
                    : `$${car.price}`;

                  return (
                    <div
                      key={car.id}
                      className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow ${isUnavailable
                        ? "opacity-50 grayscale cursor-not-allowed"
                        : "hover:shadow-lg"
                        }`}
                    >
                      <div className="relative h-48">
                        <Image
                          src={car.image || car.image_url}
                          alt={car.name || `${car.model?.make} ${car.model?.model}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-white px-2 py-1 rounded text-sm">
                            {car.category || car.model?.car_type?.name}
                          </span>
                        </div>
                        {isUnavailable && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-semibold">
                              Unavailable
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">{car.name || `${car.model?.make} ${car.model?.model}`}</h3>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              {displayPriceFormatted}
                            </p>
                            <p className="text-sm text-gray-500">per day</p>
                            {dynamicCarPrice && dynamicCarPrice.start_date && dynamicCarPrice.end_date && (
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(dynamicCarPrice.start_date).toLocaleDateString()} - {new Date(dynamicCarPrice.end_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(car.rating || car.model?.average_rating || 0)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({car.reviews || car.model?.review_count || 0} reviews)
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-2">
                            <span>Year:</span>
                            <span className="font-medium">{car.year || car.model?.year || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Transmission:</span>
                            <span className="font-medium">{car.transmission || car.model?.transmission_type || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Fuel:</span>
                            <span className="font-medium">{car.fuel || car.model?.fuel_type || "N/A"}</span>
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          disabled={isUnavailable}
                          onClick={() => {
                            if (!isUnavailable) {
                              bookingStorage.setCar(car);
                              router.push(`/cars/${car.id}`);
                            }
                          }}
                        >
                          {isUnavailable ? "Unavailable" : "Book Now"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Flex View (horizontal card design matching image)
              <div className="space-y-6">
                {displayedCars.map((car) => {
                  // Check if car is unavailable (pass pickup and return dates if available)
                  const isUnavailable = isCarUnavailable(car, pickupDate, returnDate);

                  // Get dynamic car price based on selected dates or current date
                  const dynamicCarPrice = pickupDate && returnDate
                    ? getCarPriceForDateRange(car, pickupDate, returnDate)
                    : pickupDate
                      ? getCarPriceForDate(car, pickupDate)
                      : getCarPriceForCurrentDate(car); // Use current date if no search params

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
                  const transmissionDisplay = (car.transmission || car.model?.transmission_type) === "manual" ? "M" : "A";
                  // Calculate doors (assuming 5 for sedans/SUVs, 3 for coupes)
                  const doors = car.type === "SPORTS" ? 3 : 5;

                  return (
                    <div
                      key={car.id}
                      className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow ${isUnavailable
                        ? "opacity-50 grayscale cursor-not-allowed"
                        : "hover:shadow-lg"
                        }`}
                    >
                      <div className="flex flex-col lg:flex-row">
                        {/* Left Section - Car Details */}
                        <div className="lg:w-1/3 p-4 lg:p-6 border-r-0 lg:border-r border-gray-200 border-b lg:border-b-0 pb-4 lg:pb-6 relative">
                          {/* Unavailable Badge */}
                          {isUnavailable && (
                            <div className="absolute top-4 right-4 z-10">
                              <span className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-semibold">
                                Unavailable
                              </span>
                            </div>
                          )}

                          {/* Car Model Name */}
                          <h3 className="text-2xl font-bold text-blue-600 mb-2">
                            {car.name || `${car.model?.make || ""} ${car.model?.model || ""}`.trim() || "Car"} or similar
                          </h3>

                          {/* Car Type */}
                          <p className="text-sm text-gray-600 mb-2">{car.type || car.model?.car_type?.name || ""}</p>

                          {/* Dynamic Car Price Display */}
                          {dynamicCarPrice && dynamicCarPrice.start_date && dynamicCarPrice.end_date && (
                            <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Base Price:</span>
                                <span className="text-lg font-bold text-blue-700">
                                  {dynamicCarPrice.display_price || `$${dynamicCarPrice.price_per_day.toFixed(2)}`}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(dynamicCarPrice.start_date).toLocaleDateString()} - {new Date(dynamicCarPrice.end_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}

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
                              src={car.image || car.image_url || "/assets/cars/ridecard1.png"}
                              alt={car.name || `${car.model?.make} ${car.model?.model}` || "Car"}
                              fill
                              className="object-contain p-4"
                            />
                          </div>

                          {/* Specifications */}
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <Users className="w-5 h-5 text-gray-600" />
                              <span className="text-sm font-medium">{car.passengers || car.model?.seats || 0}</span>
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
                                  disabled={isUnavailable}
                                  onClick={() => {
                                    if (!isUnavailable) {
                                      bookingStorage.setCar(car);
                                      bookingStorage.updateStep("step1", {
                                        ...bookingStorage.getStep("step1"),
                                        protectionPlan: plan.id,
                                      });
                                      router.push("/booking/step1");
                                    }
                                  }}
                                  className={`m-4 font-medium py-3 rounded ${isUnavailable
                                    ? "bg-gray-400 cursor-not-allowed text-white"
                                    : "bg-blue-700 hover:bg-blue-800 text-white"
                                    }`}
                                >
                                  {isUnavailable ? "UNAVAILABLE" : "CONTINUE"}
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

            {/* Pagination - Only show for regular cars listing (not search) */}
            {!hasSearchParams && pagination && pagination.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = currentPage - 1;
                    if (newPage >= 1) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("page", newPage.toString());
                      router.push(`/cars?${params.toString()}`);
                    }
                  }}
                  disabled={currentPage === 1 || !pagination.prev_page_url}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {pagination.links && pagination.links.map((link, index) => {
                    // Skip Previous and Next links (they're handled by buttons)
                    if (!link.url || link.label === "&laquo; Previous" || link.label === "Next &raquo;") {
                      return null;
                    }

                    const pageNum = link.page;
                    const isCurrentPage = link.active;

                    return (
                      <Button
                        key={index}
                        variant={isCurrentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString());
                          params.set("page", pageNum.toString());
                          router.push(`/cars?${params.toString()}`);
                        }}
                        className={isCurrentPage ? "bg-primary text-primary-foreground" : ""}
                      >
                        {link.label.replace(/[<>&;]/g, "")}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = currentPage + 1;
                    if (newPage <= pagination.last_page) {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set("page", newPage.toString());
                      router.push(`/cars?${params.toString()}`);
                    }
                  }}
                  disabled={currentPage === pagination.last_page || !pagination.next_page_url}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Pagination Info - Only show for regular cars listing */}
            {!hasSearchParams && pagination && (
              <div className="text-center mt-4 text-sm text-gray-600">
                Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total || 0} cars
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
