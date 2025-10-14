import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

const PerfectRideSection = () => {
  const rideOptions = [
    {
      id: 1,
      title: "Cars",
      description: "Explore luxury vehicles",
      price: "From $25/day",
      image: "/assets/ridecard1.png",
      badge: "250+ Cars",
      badgeColor: "bg-blue-500",
    },
    {
      id: 2,
      title: "Motorbike",
      description: "Perfect for city adventures",
      price: "From $15/day",
      image: "/assets/ridecard2.png",
      badge: "300+ Bikes",
      badgeColor: "bg-primary",
    },
    {
      id: 3,
      title: "Cargo Vans",
      description: "For your moving needs",
      price: "From $50/day",
      image: "/assets/ridecard3.png",
      badge: "250+ Vans",
      badgeColor: "bg-blue-500",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#fff]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Perfect Ride
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto">
            From economy cars to luxury vehicles, we have something for everyone
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {rideOptions.map((option) => (
            <Card
              key={option.id}
              className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden p-0"
            >
              <CardContent className="p-0">
                {/* Image Container */}
                <div className="relative h-64 md:h-72 bg-transparent overflow-hidden">
                  {/* Badge */}
                  <div
                    className={`absolute top-4 right-4 z-10 ${option.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {option.badge}
                  </div>

                  {/* Vehicle Image */}
                  <div className="relative w-full h-full flex items-center justify-center p-8">
                    <Image
                      src={option.image}
                      alt={option.title}
                      width={300}
                      height={200}
                      className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-start">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <p className="text-xl font-semibold text-primary mb-6 cursor-pointer">
                    {option.price}
                    <ArrowRightIcon className="inline-block w-5 h-5 ml-2" />
                  </p>
                  {/* <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
                    size="lg"
                  >
                    Book Now
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        {/* <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3"
          >
            View All Vehicles
          </Button>
        </div> */}
      </div>
    </section>
  );
};

export default PerfectRideSection;
