"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Star,
  Users,
  Settings,
  Fuel,
  Calendar,
  MapPin,
  Clock,
  Shield,
  Car,
  CheckCircle,
  Heart,
  Share2,
  ChevronRight,
  Fan,
  Shield as ShieldIcon,
  Bluetooth,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import Layout from "../layout/Layout";
import { bookingStorage } from "@/lib/bookingStorage";
import { getCarById } from "@/lib/carsData";

export default function CarDetailsPage({ carId }) {
  const router = useRouter();
  // Removed unused state variables

  // Find the car by ID
  const car = getCarById(carId) || {
    id: carId,
    name: "Car",
    type: "Premium",
    year: 2025,
    image: "/assets/cars/featured1.png",
    rating: 4.5,
    reviews: 100,
    passengers: 4,
    luggage: "2 Large Bags",
    transmission: "automatic",
    fuelType: "gasoline",
    engine: "2.0L Turbo",
    price: 99,
    description:
      "Detailed information unavailable for this car. Showing defaults.",
    features: ["Air Conditioning", "Advanced Safety", "Bluetooth", "GPS Ready"],
    location: "Airport Terminal 1",
    pickupInfo: "International Airport, Terminal 1, Rental Car Center, Level 1",
    available: "Available 24/7",
  };

  const handleBookNow = (protectionPlanId) => {
    // Store the selected car in localStorage
    bookingStorage.setCar(car);
    // Store the selected protection plan
    const step1Data = bookingStorage.getStep("step1") || {};
    bookingStorage.updateStep("step1", {
      ...step1Data,
      protectionPlan: protectionPlanId,
    });
    // Redirect to booking page step 1 (Coverage & Extras)
    router.push("/booking/step1");
  };

  // Calculate rental period from booking storage
  const calculateRentalDays = () => {
    const step1Data = bookingStorage.getStep("step1") || {};
    if (step1Data.pickupDate && step1Data.dropoffDate) {
      try {
        const pickup = new Date(step1Data.pickupDate);
        const dropoff = new Date(step1Data.dropoffDate);
        const diffTime = Math.abs(dropoff - pickup);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
      } catch {
        return 1;
      }
    }
    return 1; // default to 1 day if dates not set
  };

  const rentalDays = calculateRentalDays();

  const handleExtraChange = (extra) => {
    setSelectedExtras((prev) =>
      prev.includes(extra)
        ? prev.filter((item) => item !== extra)
        : [...prev, extra]
    );
  };

  const protectionPlans = [
    {
      id: "basic",
      name: "Basic Protection",
      dailyPrice: 0, // Basic is included (free)
      description:
        "Perfect for budget-conscious travelers who need reliable transportation.",
      details: {
        pricing: {
          dailyRate: 0,
          securityDeposit: "None",
          cancellation: "Free",
        },
        features: [
          "Basic insurance",
          "Standard vehicle maintenance",
          "24/7 emergency support",
        ],
        cancellationPolicy: "Cancel up to 24 hours before pickup",
      },
    },
    {
      id: "standard",
      name: "Standard Protection",
      dailyPrice: 19,
      description:
        "Enhanced protection with reduced liability and comprehensive coverage.",
      details: {
        pricing: {
          dailyRate: 19,
          securityDeposit: "$200",
          cancellation: "Free",
        },
        features: [
          "Collision Damage Waiver (CDW)",
          "Theft Protection (TP)",
          "Third Party Liability up to $1M",
          "Reduced excess to $500",
          "Personal Accident Insurance",
        ],
        cancellationPolicy: "Cancel up to 24 hours before pickup",
      },
    },
    {
      id: "premium",
      name: "Premium Protection",
      dailyPrice: 39,
      description:
        "Maximum protection with zero excess and comprehensive coverage.",
      details: {
        pricing: {
          dailyRate: 39,
          securityDeposit: "None",
          cancellation: "Free",
        },
        features: [
          "Full Collision Damage Waiver",
          "Complete Theft Protection",
          "Third Party Liability up to $5M",
          "Zero excess - no deductible",
          "Personal Effects Coverage",
          "Emergency Medical Coverage",
        ],
        cancellationPolicy: "Cancel up to 24 hours before pickup",
      },
    },
  ];

  // Calculate total for each protection plan
  const calculateTotalForPlan = (plan) => {
    const carDailyRate = parseInt(car.price || 0);
    const protectionTotal = plan.dailyPrice * rentalDays;
    const baseTotal = carDailyRate * rentalDays;
    const subtotal = baseTotal + protectionTotal;
    const tax = subtotal * 0.08; // 8% tax
    return {
      base: baseTotal,
      protection: protectionTotal,
      subtotal: subtotal,
      tax: tax,
      total: subtotal + tax,
    };
  };

  // Extras are now handled in Step1 (Coverage & Extras)

  return (
    <Layout>
      {" "}
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Search
              </button>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{car.rating}</span>
            <span>({car.reviews} reviews)</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Car Overview Card */}
              <Card className="overflow-hidden">
                <div className="relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                      {car.type}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {car.name}
                    </h1>
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Premium
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{car.rating}</span>
                      <span className="text-sm text-gray-500">
                        ({car.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg">{car.description}</p>
                </CardContent>
              </Card>

              {/* Car Specifications Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3">
                      <Car className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Vehicle Type</p>
                        <p className="font-medium">Premium Sedan</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Passengers</p>
                        <p className="font-medium">{car.passengers} Adults</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3">
                      <Settings className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Luggage</p>
                        <p className="font-medium">{car.luggage}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3">
                      <Fuel className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Fuel Type</p>
                        <p className="font-medium">{car.fuelType}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3">
                      <Settings className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Transmission</p>
                        <p className="font-medium">{car.transmission}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3">
                      <Car className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-500">Engine</p>
                        <p className="font-medium">{car.engine}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Protection Plans - Show 3 prices with totals */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Choose Your Protection Plan</h2>
                <p className="text-sm text-gray-600">
                  Rental Period: {rentalDays} {rentalDays === 1 ? "day" : "days"}
                </p>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {protectionPlans.map((plan) => {
                     const totals = calculateTotalForPlan(plan);
                     return (
                       <div key={plan.id} className={`rounded-lg border-2 p-5 transition-all hover:shadow-lg ${
                         plan.id === "basic" ? "border-gray-200 bg-gray-50" :
                         plan.id === "standard" ? "border-blue-200 bg-blue-50" :
                         "border-purple-200 bg-purple-50"
                       }`}>
                         <div className="mb-4">
                           <div className="flex items-center justify-between mb-2">
                             <h3 className="text-lg font-bold">{plan.name}</h3>
                             {plan.id === "basic" && (
                               <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Included</span>
                             )}
                           </div>
                           <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                           
                           {/* Price breakdown */}
                           <div className="space-y-2 mb-4">
                             <div className="flex justify-between text-sm">
                               <span className="text-gray-600">Base rental ({rentalDays} {rentalDays === 1 ? "day" : "days"})</span>
                               <span className="font-medium">${totals.base.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between text-sm">
                               <span className="text-gray-600">Protection ({plan.id === "basic" ? "Included" : `$${plan.dailyPrice}/day`})</span>
                               <span className="font-medium">{plan.id === "basic" ? "Free" : `$${totals.protection.toFixed(2)}`}</span>
                             </div>
                             <div className="flex justify-between text-sm">
                               <span className="text-gray-600">Tax (8%)</span>
                               <span className="font-medium">${totals.tax.toFixed(2)}</span>
                             </div>
                             <div className="border-t pt-2 mt-2">
                               <div className="flex justify-between items-center">
                                 <span className="font-bold text-lg">Total</span>
                                 <span className="font-bold text-xl text-red-600">${totals.total.toFixed(2)}</span>
                               </div>
                             </div>
                           </div>
                         </div>

                         {/* Continue/Book Button */}
                         <Button
                           onClick={() => handleBookNow(plan.id)}
                           className={`w-full ${
                             plan.id === "basic" ? "bg-gray-800 hover:bg-gray-900" :
                             plan.id === "standard" ? "bg-blue-600 hover:bg-blue-700" :
                             "bg-purple-600 hover:bg-purple-700"
                           } text-white`}
                         >
                           Continue with {plan.name}
                         </Button>
                       </div>
                     );
                   })}
                 </div>

              </div>

              {/* Included Features */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Included Features
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {feature === "Air Conditioning" && (
                        <Fan className="w-5 h-5 text-gray-600" />
                      )}
                      {feature === "Advanced Safety" && (
                        <ShieldIcon className="w-5 h-5 text-gray-600" />
                      )}
                      {feature === "Bluetooth" && (
                        <Bluetooth className="w-5 h-5 text-gray-600" />
                      )}
                      {feature === "GPS Ready" && (
                        <Navigation className="w-5 h-5 text-gray-600" />
                      )}
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Vehicle Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  The BMW 5 Series combines luxury and performance with a
                  powerful yet efficient engine. This premium vehicle offers
                  exceptional comfort, advanced safety features, and
                  cutting-edge technology for an unparalleled driving
                  experience. Perfect for business trips or special occasions.
                </p>
              </div>

              {/* Important Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Important Information
                </h2>
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-4">
                    <ul className="space-y-2 text-gray-700">
                      <li>• Minimum age: 25 years</li>
                      <li>• Valid driver's license required</li>
                      <li>• Credit card for security deposit</li>
                      <li>• Fuel policy: Return with same level</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Pickup Location */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Pickup Location
                </h2>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <h3 className="font-medium text-lg">{car.location}</h3>
                      <p className="text-gray-600">{car.pickupInfo}</p>
                      <p className="text-sm text-gray-500">{car.available}</p>
                      <div className="rounded-lg bg-gray-100 h-40 flex items-center justify-center text-gray-500">
                        Map Preview
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-red-500 text-red-500 hover:bg-red-50"
                      >
                        View in Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-bold">Booking Details</h3>
                  </div>

                  {/* Pickup/Return Details */}
                  <div className="space-y-3 mb-6">
                    {(() => {
                      const step1Data = bookingStorage.getStep("step1") || {};
                      const formatDate = (dateStr) => {
                        if (!dateStr) return "Not set";
                        try {
                          const date = new Date(dateStr);
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                        } catch {
                          return "Not set";
                        }
                      };
                      return (
                        <>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Pickup
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(step1Data.pickupDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Return
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(step1Data.dropoffDate)}
                            </p>
                          </div>
                          {step1Data.pickupLocation && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-600">
                                {step1Data.pickupLocation}
                              </span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    Free cancellation up to 24 hours before pickup
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
