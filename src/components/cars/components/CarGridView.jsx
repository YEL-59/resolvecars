"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, LogIn } from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";
import { userStorage } from "@/lib/userStorage";
import { useRouter } from "next/navigation";
import { isCarUnavailable, getCarPriceForDateRange, getCarPriceForDate, getCarPriceForCurrentDate } from "../helpers/carHelpers";

export default function CarGridView({ cars, pickupDate, returnDate }) {
  const router = useRouter();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => {
        // Check if car is unavailable based on status
        const unavailable = isCarUnavailable(car);

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
            className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow ${unavailable
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
              {unavailable && (
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
                disabled={unavailable}
                onClick={() => {
                  if (!unavailable) {
                    // Check if user is logged in
                    if (!userStorage.isLoggedIn()) {
                      setShowLoginDialog(true);
                      return;
                    }
                    
                    bookingStorage.setCar(car);
                    router.push(`/cars/${car.id}`);
                  }
                }}
              >
                {unavailable ? "Unavailable" : "Book Now"}
              </Button>
            </div>
          </div>
        );
      })}
      
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
    </div>
  );
}

