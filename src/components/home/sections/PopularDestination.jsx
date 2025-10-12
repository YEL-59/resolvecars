import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PopularDestination = () => {
  const countries = [
    { name: "Spain", flag: "/assets/spain.png" },
    { name: "Italy", flag: "/assets/italy.png" },
    { name: "Portugal", flag: "/assets/portugal.png" },
    { name: "France", flag: "/assets/france.png" },
    { name: "Croatia", flag: "/assets/croatia.png" },
    { name: "Greece", flag: "/assets/greece.png" },
    { name: "United Arab Emirates", flag: "/assets/uae.png" },
    { name: "United States", flag: "/assets/usa.png" },
  ];

  const destinations = [
    {
      id: 1,
      name: "Spain",
      image: "/assets/spain.png",
      badge: "SPAIN",
    },
    {
      id: 2,
      name: "France",
      image: "/assets/france.png",
      badge: "FRANCE",
    },
    {
      id: 3,
      name: "Greece",
      image: "/assets/greece.png",
      badge: "GREECE",
    },
    {
      id: 4,
      name: "Croatia",
      image: "/assets/croatia.png",
      badge: "CROATIA",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Our most popular destinations
          </h2>

          {/* Country Flags List */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-12">
            {countries.map((country, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img
                    src={country.flag}
                    alt={country.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-gray-700 font-medium text-sm md:text-base">
                  {country.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Cards */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <Card
                key={destination.id}
                className="relative bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden h-80"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${destination.image})` }}
                />

                {/* Gradient Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" /> */}

                {/* Vertical Badge */}
                <div className="absolute top-3 -right-5 h-full w-16 flex items-start justify-start">
                  <div className="bg-[#F5807C] p-2 rounded-sm text-white text-xs font-bold uppercase tracking-wider transform -rotate-90 whitespace-nowrap">
                    {destination.badge}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularDestination;
