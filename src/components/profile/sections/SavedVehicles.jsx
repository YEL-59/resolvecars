"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { favoritesStorage } from "@/lib/favoritesStorage";
import { Heart } from "lucide-react";

const SavedVehicles = () => {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    setSaved(favoritesStorage.getAll());
  }, []);

  const remove = (id) => {
    const list = favoritesStorage.remove(id);
    setSaved(list);
  };

  if (!saved?.length) {
    return (
      <div className="p-6 rounded-lg border bg-muted/30">
        <p className="text-sm">No saved vehicles yet. Save cars you like using the heart icon.</p>
      </div>
    );
  }

  return (
    <section className="py-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Heart className="w-5 h-5 text-rose-500" fill="currentColor" />
        Saved Vehicles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {saved.map((car) => (
          <div key={car.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="relative h-40">
              <Image src={car.image} alt={car.name} fill className="object-cover" />
              <button
                onClick={() => remove(car.id)}
                className="absolute top-3 right-3 rounded-full p-2 bg-white/90 hover:bg-white shadow"
                aria-label="Remove from saved"
              >
                <Heart className="w-5 h-5 text-rose-500" fill="currentColor" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{car.name}</h3>
                  <p className="text-sm text-gray-500">${car.price || car["car price"]}/day</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Link href={`/cars/${car.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                <Link href={`/booking/step1`}>
                  <Button className="bg-primary hover:bg-primary/90" onClick={() => favoritesStorage.remove(car.id)}>Book Now</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SavedVehicles;
