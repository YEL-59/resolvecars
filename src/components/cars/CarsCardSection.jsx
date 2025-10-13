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
import { Star, Grid3X3, List } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { bookingStorage } from "@/lib/bookingStorage";

// Sample car data
const carsData = [
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
    id: 3,
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
  {
    id: 4,
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
  {
    id: 5,
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
  {
    id: 6,
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
  {
    id: 7,
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
  {
    id: 8,
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

export default function CarsCardSection() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("Name (A-Z)");
  const [visibleCars, setVisibleCars] = useState(10);
  const [viewMode, setViewMode] = useState("flex"); // Default to flex view

  const handleBookNow = (car) => {
    // Store the selected car in localStorage
    bookingStorage.setCar(car);
    // Redirect to booking page
    router.push('/booking/step1');
  };

  // Filter and sort cars
  const filteredCars = carsData
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
                          className={`w-4 h-4 ${
                            i < Math.floor(car.rating)
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

                  <Link href={`/cars/${car.id}`}>
                    <Button className="w-full">View Details</Button>
                  </Link>
                  <Button 
                    className="w-full mt-2" 
                    onClick={() => handleBookNow(car)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Flex View (horizontal card design)
          <div className="space-y-4">
            {displayedCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-5  px-10">
                  {/* Left Section - Image */}
                  <div className="  relative w-full md:w-80 h-64 md:h-[220px]">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-contain"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {car.type}
                      </span>
                    </div>
                  </div>

                  {/* Right Section - Content */}
                  <div className="  p-5">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-semibold">{car.name}</h3>
                          <span className="text-gray-600">{car.year}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 max-w-[300px] py-2">
                          {car.description}
                        </p>
                        {/* Icons */}
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
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
                              className="text-gray-500"
                            >
                              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                              <circle cx="7" cy="17" r="2"></circle>
                              <path d="M9 17h6"></path>
                              <circle cx="17" cy="17" r="2"></circle>
                            </svg>
                            <span className="text-sm text-gray-500">
                              {car.passengers}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
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
                              className="text-gray-500"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                              <line x1="9" y1="9" x2="9.01" y2="9"></line>
                              <line x1="15" y1="9" x2="15.01" y2="9"></line>
                            </svg>
                            <span className="text-sm text-gray-500">
                              {car.transmission}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
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
                              className="text-gray-500"
                            >
                              <path d="M3 22v-3"></path>
                              <path d="M6 22v-3"></path>
                              <path d="M9 22v-3"></path>
                              <path d="M12 22v-3"></path>
                              <path d="M15 22v-3"></path>
                              <path d="M18 22v-3"></path>
                              <path d="M21 22v-3"></path>
                              <path d="M3 14v-3"></path>
                              <path d="M21 14v-3"></path>
                              <path d="M3 6V3"></path>
                              <path d="M21 6V3"></path>
                              <path d="M9 14v-3"></path>
                              <path d="M15 14v-3"></path>
                              <path d="M9 6V3"></path>
                              <path d="M15 6V3"></path>
                              <path d="M6 14h.01"></path>
                              <path d="M12 14h.01"></path>
                              <path d="M18 14h.01"></path>
                              <path d="M6 6h.01"></path>
                              <path d="M12 6h.01"></path>
                              <path d="M18 6h.01"></path>
                            </svg>
                            <span className="text-sm text-gray-500">
                              {car.fuelType}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 py-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(car.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({car.rating})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Features */}
                    <div className="space-y-1 mb-6">
                      <h1 className="text-lg font-bold">Details</h1>
                      {car.features.slice(0, 3).map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          {feature}
                        </div>
                      ))}
                      <button className="text-sm text-primary hover:underline mt-1">
                        {car.features.length - 3} more
                      </button>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex flex-col items-center justify-center">
                    <div>
                      <div className="flex flex-col items-center gap-2 mb-1">
                        <span className="text-2xl font-bold">
                          ${car.price}/day
                        </span>
                        <div>
                          <span className="line-through text-gray-400">
                            ${car.originalPrice}/day
                          </span>
                          <span className="bg-red-100 text-red-500 px-2 py-0.5 rounded text-sm">
                            -{car.discount}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link href={`/cars/${car.id}`}>
                        <Button className="bg-primary hover:bg-primary/90 text-white px-8">
                          view Details
                        </Button>
                      </Link>
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white px-8"
                        onClick={() => handleBookNow(car)}
                      >
                        Book now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
