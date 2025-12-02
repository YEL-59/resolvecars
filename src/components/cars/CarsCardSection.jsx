"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";
import { useSearchParams } from "next/navigation";
import { useCars, useSearchCars } from "@/hooks/cars.hook";
import { isCarUnavailable } from "./helpers/carHelpers";
import CarGridView from "./components/CarGridView";
import CarFlexView from "./components/CarFlexView";
import CarGridSkeleton from "./components/CarGridSkeleton";
import CarFlexSkeleton from "./components/CarFlexSkeleton";
import FiltersDialog from "./components/FiltersDialog";
import Pagination from "./components/Pagination";

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
];

export default function CarsCardSection() {
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

  // Reset price range when search params are present (search results may have different price ranges)
  useEffect(() => {
    if (hasSearchParams && data?.cars && data.cars.length > 0) {
      // Calculate min and max prices from search results
      const prices = data.cars.map(car => car.price || 0).filter(p => p > 0);
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        // Set price range to accommodate all search results (with some padding)
        const newPriceRange = [Math.max(0, Math.floor(minPrice * 0.9)), Math.ceil(maxPrice * 1.1)];
        setPriceRange(newPriceRange);
        console.log("Price range adjusted for search results:", newPriceRange, "based on prices:", prices);
      }
    }
  }, [hasSearchParams, data?.cars]);

  // Debug: Log search API data
  useEffect(() => {
    if (hasSearchParams) {
      console.log("=== SEARCH API DEBUG ===");
      console.log("hasSearchParams:", hasSearchParams);
      console.log("Search params:", {
        pickup_location_id: pickupLocationId,
        return_location_id: returnLocationId,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        return_date: returnDate,
        return_time: returnTime,
      });
      console.log("Search query state:", {
        isLoading: searchCarsQuery.isLoading,
        isError: searchCarsQuery.isError,
        error: searchCarsQuery.error,
        data: searchCarsQuery.data,
      });
      console.log("Transformed cars:", searchCarsQuery.data?.cars);
      console.log("Total cars:", searchCarsQuery.data?.cars?.length);
      console.log("Meta:", searchCarsQuery.data?.meta);
      if (searchCarsQuery.data?.cars && searchCarsQuery.data.cars.length > 0) {
        console.log("Car prices:", searchCarsQuery.data.cars.map(c => ({ name: c.name, price: c.price })));
      }
      console.log("Current price range:", priceRange);
      console.log("=========================");
    }
  }, [hasSearchParams, searchCarsQuery.data, searchCarsQuery.isLoading, searchCarsQuery.isError, pickupLocationId, returnLocationId, pickupDate, returnDate, priceRange]);

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
  // Note: The hooks (useCars and useSearchCars) already filter by status "available"
  // This is an additional safety check to ensure only available cars are shown
  const carsToFilter = (data?.cars || localCarsData).filter(car => {
    // Double-check status: only show "available" cars
    // This ensures filtering works even if the hook filtering somehow fails
    const carStatus = car.status || car._apiData?.status;
    if (!carStatus) return true; // If no status, show the car (fallback)
    const statusLower = carStatus.toLowerCase();
    return statusLower === "available";
  });

  // Debug: Log cars data
  useEffect(() => {
    console.log("=== CARS FILTERING DEBUG ===");
    console.log("carsToFilter:", carsToFilter);
    console.log("carsToFilter length:", carsToFilter?.length);
    console.log("searchTerm:", searchTerm);
    console.log("selectedCategory:", selectedCategory);
    console.log("priceRange:", priceRange);
    if (carsToFilter && carsToFilter.length > 0) {
      console.log("First car sample:", carsToFilter[0]);
      console.log("First car price:", carsToFilter[0]?.price);
      console.log("First car name:", carsToFilter[0]?.name);
      console.log("First car category:", carsToFilter[0]?.category);
    }
    console.log("============================");
  }, [carsToFilter, searchTerm, selectedCategory, priceRange]);

  const filteredCars = carsToFilter
    .filter((car) => {
      // Fix: Allow empty search term to show all cars
      const matchesSearch = !searchTerm || (car.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ?? true);
      const matchesCategory =
        selectedCategory === "All Categories" ||
        car.category === selectedCategory;
      // Fix: Handle cases where car.price might be undefined or very high
      const carPrice = car.price || 0;
      const matchesPrice =
        carPrice >= priceRange[0] && carPrice <= priceRange[1];

      // Debug individual car filtering (only for search results)
      if (hasSearchParams) {
        if (!matchesSearch && searchTerm) {
          console.log(`Car "${car.name}" filtered out by search term "${searchTerm}"`);
        }
        if (!matchesCategory) {
          console.log(`Car "${car.name}" filtered out by category (${car.category} !== ${selectedCategory})`);
        }
        if (!matchesPrice) {
          console.log(`Car "${car.name}" filtered out by price (${carPrice} not in range [${priceRange[0]}, ${priceRange[1]}])`);
        }
      }

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

  // Debug: Log filtered results
  useEffect(() => {
    if (hasSearchParams) {
      console.log("=== FILTERED CARS DEBUG ===");
      console.log("filteredCars length:", filteredCars.length);
      console.log("displayedCars length:", displayedCars.length);
      console.log("filteredCars:", filteredCars);
      console.log("===========================");
    }
  }, [filteredCars, displayedCars, hasSearchParams]);

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

            {/* Filters Dialog */}
            <FiltersDialog
              isOpen={isFilterOpen}
              onOpenChange={setIsFilterOpen}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              availableCategories={availableCategories}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />
          </div>
        </div>

        {/* Loading State - Skeleton */}
        {isLoading && (
          <>
            {viewMode === "grid" ? (
              <CarGridSkeleton />
            ) : (
              <CarFlexSkeleton />
            )}
          </>
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
              <CarGridView
                cars={displayedCars}
                pickupDate={pickupDate}
                returnDate={returnDate}
              />
            ) : (
              <CarFlexView
                cars={displayedCars}
                pickupDate={pickupDate}
                returnDate={returnDate}
                rentalDays={rentalDays}
              />
            )}

            {/* Pagination - Only show for regular cars listing (not search) */}
            {!hasSearchParams && (
              <Pagination pagination={pagination} currentPage={currentPage} />
            )}
          </>
        )}

        {/* No Cars Found */}
        {!isLoading && !isError && filteredCars.length === 0 && carsToFilter.length > 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-4">
              No cars match your current filters. Try adjusting your search criteria.
            </p>
            <div className="text-sm text-gray-500">
              <p>Total cars available: {carsToFilter.length}</p>
              <p>Filtered out by: Search term, Category, or Price range</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && filteredCars.length === 0 && carsToFilter.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No cars found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
