"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, Users, Fuel, Settings, MapPin, Heart, LogIn, Loader2 } from "lucide-react";
import { favoritesStorage } from "@/lib/favoritesStorage";
import { userStorage } from "@/lib/userStorage";
import { useCars } from "@/hooks/cars.hook";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { bookingStorage } from "@/lib/bookingStorage";
import { getCarPriceForCurrentDate } from "@/components/cars/helpers/carHelpers";

const FeaturedSection = () => {
  const router = useRouter();
  const [savedIds, setSavedIds] = useState([]);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Fetch cars from API
  const { data, isLoading, isError } = useCars({ per_page: 15, page: 1 });

  useEffect(() => {
    setSavedIds(favoritesStorage.getAll().map((v) => v.id));
  }, []);

  const isSaved = (id) => savedIds?.some((v) => String(v) === String(id));
  const toggleFavorite = (vehicle) => {
    const list = favoritesStorage.toggle(vehicle);
    setSavedIds(list.map((v) => v.id));
  };

  const handleBookNow = (vehicle) => {
    // Check if user is logged in
    if (!userStorage.isLoggedIn()) {
      setShowLoginDialog(true);
      return;
    }

    bookingStorage.setCar(vehicle);
    router.push("/booking/step1");
  };

  // Get first 3 cars from API response
  const featuredVehicles = data?.cars?.slice(0, 3).map((car) => {
    // Get current price for display
    const currentPrice = getCarPriceForCurrentDate(car);
    const displayPrice = currentPrice?.price_per_day || car.price || 0;
    const originalPrice = currentPrice?.original_price_per_day || car.originalPrice || null;

    // Get first 3 features for tags
    const featureTags = car.features?.slice(0, 3) || [];
    const remainingFeatures = car.features?.length > 3 ? car.features.length - 3 : 0;

    return {
      id: car.id,
      name: car.name,
      category: car.category || car.type,
      image: car.image || "/assets/cars/bmw-3.png",
      rating: car.rating || 0,
      reviews: car.reviews || 0,
      passengers: car.passengers || 4,
      transmission: car.transmission || "Automatic",
      fuel: car.fuel || car.fuelType || "Petrol",
      price: displayPrice,
      originalPrice: originalPrice,
      year: car.year || new Date().getFullYear(),
      badge: car.discount > 0 ? `${car.discount}% OFF` : car._apiData?.model?.is_featured ? "Featured" : null,
      badgeColor: car.discount > 0 ? "bg-green-500" : "bg-primary",
      features: car.features || [],
      featureTags: featureTags,
      remainingFeatures: remainingFeatures,
      type: car.type || car.category || "SEDAN",
      _apiData: car._apiData, // Keep original API data
    };
  }) || [];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Featured Vehicles
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our hand-picked selection of premium vehicles, each
            offering exceptional comfort and performance
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-gray-600">Failed to load featured vehicles. Please try again later.</p>
          </div>
        )}

        {/* Vehicle Cards */}
        {!isLoading && !isError && featuredVehicles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredVehicles.map((vehicle) => {
              // Calculate rating stars
              const rating = vehicle.rating || 0;
              const fullStars = Math.floor(rating);
              const hasHalfStar = rating % 1 >= 0.5;

              return (
                <Card
                  key={vehicle.id}
                  className="max-w-sm mx-auto rounded-2xl shadow-md border-gray-100 group hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden"
                >
                  <CardContent className="p-0">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 pt-4">
                      <span className="text-xs font-semibold bg-yellow-400 text-black px-3 py-1 rounded-full">
                        {vehicle.type}
                      </span>
                      <div className="relative flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">
                          {vehicle.year}
                        </span>
                        {/* <button
                          aria-label={
                            isSaved(vehicle.id) ? "Unsave vehicle" : "Save vehicle"
                          }
                          onClick={() => toggleFavorite(vehicle)}
                          className="rounded-full p-2 bg-white/90 hover:bg-white shadow border border-primary"
                        >
                          <Heart
                            className={
                              isSaved(vehicle.id)
                                ? "w-5 h-5 text-rose-500"
                                : "w-5 h-5 text-gray-700"
                            }
                            fill={isSaved(vehicle.id) ? "currentColor" : "none"}
                          />
                        </button> */}
                      </div>
                    </div>

                    {/* Car Image */}
                    <div className="relative flex justify-center items-start mt-2 mb-4 h-[200px] w-full group-hover:scale-110 transition-all duration-300">
                      <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        width={400}
                        height={200}
                        className="object-contain h-full w-full"
                        onError={(e) => {
                          e.target.src = "/assets/cars/bmw-3.png";
                        }}
                      />
                    </div>

                    {/* Car Info */}
                    <div className="px-5 pb-5">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {vehicle.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {vehicle._apiData?.model?.description || `Experience luxury and performance with the ${vehicle.name}. Perfect for business trips...`}
                      </p>

                      {/* Icons */}
                      <div className="flex items-center gap-4 mt-4 text-gray-600">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4" /> {vehicle.passengers}
                        </div>
                        <div className="flex items-center gap-1 text-sm capitalize">
                          <Settings className="w-4 h-4" /> {vehicle.transmission}
                        </div>
                        <div className="flex items-center gap-1 text-sm capitalize">
                          <Fuel className="w-4 h-4" /> {vehicle.fuel}
                        </div>
                      </div>

                      {/* Rating and Price */}
                      {/* <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1 text-gray-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < fullStars
                                ? "text-red-400 fill-red-400"
                                : i === fullStars && hasHalfStar
                                  ? "text-red-400 fill-red-400 opacity-50"
                                  : "text-gray-300"
                                }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            ({rating.toFixed(1)})
                          </span>
                        </div>
                        <div className="text-right">
                          {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
                            <p className="text-xs text-gray-500 line-through">
                              ${vehicle.originalPrice.toFixed(2)}
                            </p>
                          )}
                          <p className="text-xl font-bold text-rose-500">
                            ${parseFloat(vehicle.price).toFixed(2)}/day
                          </p>
                        </div>
                      </div> */}

                      {/* Tags */}
                      {vehicle.featureTags && vehicle.featureTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {vehicle.featureTags.slice(0, 3).map((feature, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                          {vehicle.remainingFeatures > 0 && (
                            <span className="text-xs font-medium text-gray-500 px-3 py-1 rounded-full border border-gray-200">
                              +{vehicle.remainingFeatures} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex gap-3 mt-6">
                        {/* <Link href={`/cars/${vehicle.id}`} className="w-1/2">
                          <Button
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                          >
                            View Details
                          </Button>
                        </Link> */}
                        <Button
                          className="w-full bg-[#F5807C] hover:bg-rose-600 text-white"
                          // onClick={() => handleBookNow(vehicle)}
                          //i want onclick redirect /cars page
                          onClick={() => router.push("/cars")}
                        >
                          To See All Vehicles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* No Cars Found */}
        {!isLoading && !isError && featuredVehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured vehicles available at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        {/* <div className="text-center mt-12">
          <Link href="/cars">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3"
            >
              View All Featured Vehicles
            </Button>
          </Link>
        </div> */}
      </div>

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-full">
                <LogIn className="w-6 h-6 text-yellow-600" />
              </div>
              <DialogTitle>Login Required</DialogTitle>
            </div>
            <DialogDescription>
              You need to be logged in to continue with your booking. Please sign in or create an account to proceed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowLoginDialog(false);
                router.push("/auth/signin");
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Go to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturedSection;
