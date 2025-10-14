"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users, Fuel, Settings, MapPin, Heart } from "lucide-react";
import { favoritesStorage } from "@/lib/favoritesStorage";

const FeaturedSection = () => {
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    setSavedIds(favoritesStorage.getAll().map((v) => v.id));
  }, []);

  const isSaved = (id) => savedIds?.some((v) => String(v) === String(id));
  const toggleFavorite = (vehicle) => {
    const list = favoritesStorage.toggle(vehicle);
    setSavedIds(list.map((v) => v.id));
  };
  const featuredVehicles = [
    {
      id: 1,
      name: "BMW 3 Series",
      category: "Luxury Sedan",
      image: "/assets/featured1.jpg",
      rating: 4.8,
      reviews: 124,
      passengers: 5,
      transmission: "Automatic",
      fuel: "Petrol",
      price: 89,
      originalPrice: 120,
      year: 2023,
      badge: "20% OFF",
      badgeColor: "bg-green-500",
      features: [
        "GPS Navigation",
        "Bluetooth",
        "Air Conditioning",
        "Premium Sound",
      ],
    },
    {
      id: 2,
      name: "Audi Q7",
      category: "Premium SUV",
      image: "/assets/featured2.png",
      rating: 4.9,
      reviews: 89,
      passengers: 7,
      transmission: "Automatic",
      fuel: "Diesel",
      year: 2023,
      price: 125,
      originalPrice: 150,
      badge: "Popular",
      badgeColor: "bg-primary",
      features: ["4WD", "Leather Seats", "Sunroof", "Advanced Safety"],
    },
    {
      id: 3,
      name: "Porsche Cayenne",
      category: "Sports SUV",
      image: "/assets/featured3.jpg",
      rating: 5.0,
      reviews: 67,
      passengers: 5,
      transmission: "Automatic",
      fuel: "Hybrid",
      year: 2024,
      price: 199,
      originalPrice: 250,
      badge: "Premium",
      badgeColor: "bg-purple-500",
      features: [
        "Sport Mode",
        "Premium Interior",
        "Adaptive Suspension",
        "Panoramic Roof",
      ],
    },
  ];

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

        {/* Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {featuredVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="max-w-sm mx-auto rounded-2xl shadow-md  border-gray-100  group hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden"
            >
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-4">
                  <span className="text-xs font-semibold bg-yellow-400 text-black px-3 py-1 rounded-full">
                    SEDAN
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    2025
                  </span>
                </div>

                {/* Car Image */}
                <div className="relative flex justify-center items-center mt-2 mb-4 h-[200px] w-full group-hover:scale-110 transition-all duration-300">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    width={400}
                    height={200}
                    className="object-contain h-full w-full"
                  />
                  <button
                    aria-label={isSaved(vehicle.id) ? "Unsave vehicle" : "Save vehicle"}
                    onClick={() => toggleFavorite(vehicle)}
                    className="absolute top-2 right-2 rounded-full p-2 bg-white/90 hover:bg-white shadow"
                  >
                    <Heart
                      className={isSaved(vehicle.id) ? "w-5 h-5 text-rose-500" : "w-5 h-5 text-gray-700"}
                      fill={isSaved(vehicle.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                {/* Car Info */}
                <div className="px-5 pb-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {vehicle.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Experience luxury and performance with the BMW 3 Series.
                    Perfect for business trips...
                  </p>

                  {/* Icons */}
                  <div className="flex items-center gap-4 mt-4 text-gray-600">
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="w-4 h-4" /> {vehicle.passengers}{" "}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Settings className="w-4 h-4" /> {vehicle.transmission}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Fuel className="w-4 h-4" /> {vehicle.fuel}
                    </div>
                  </div>

                  {/* Rating and Price */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 text-gray-400">
                      {[...Array(4)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-red-400 fill-red-400"
                        />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                      <span className="text-sm text-gray-600 ml-1">(4.0)</span>
                    </div>
                    <p className="text-xl font-bold text-rose-500">
                      ${vehicle.price}/day
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      Premium Sound System
                    </span>
                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      BOSE Sound System
                    </span>
                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      Leather Seats
                    </span>
                    <span className="text-xs font-medium text-gray-500 px-3 py-1 rounded-full border border-gray-200">
                      +{vehicle.features.length} more
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      className="w-1/2 border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      View Details
                    </Button>
                    <Button className="w-1/2 bg-[#F5807C] hover:bg-rose-600 text-white">
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3"
          >
            View All Featured Vehicles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
