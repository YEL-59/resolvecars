"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MapPin, ArrowRight, Sparkles } from "lucide-react";

const PopularDestination = () => {
  const [hoveredId, setHoveredId] = useState(null);

  // Using FlagCDN for high-quality flag images
  const countries = [
    { name: "Spain", code: "es" },
    { name: "Italy", code: "it" },
    { name: "Portugal", code: "pt" },
    { name: "France", code: "fr" },
    { name: "Croatia", code: "hr" },
    { name: "Greece", code: "gr" },
    { name: "UAE", code: "ae" },
    { name: "USA", code: "us" },
  ];

  const destinations = [
    {
      id: 1,
      name: "Barcelona",
      country: "Spain",
      code: "es",
      image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
      cars: "250+ Cars",
      gradient: "from-orange-500/80 to-red-600/80",
    },
    {
      id: 2,
      name: "Paris",
      country: "France",
      code: "fr",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
      cars: "180+ Cars",
      gradient: "from-blue-500/80 to-indigo-600/80",
    },
    {
      id: 3,
      name: "Athens",
      country: "Greece",
      code: "gr",
      image: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80",
      cars: "120+ Cars",
      gradient: "from-cyan-500/80 to-blue-600/80",
    },
    {
      id: 4,
      name: "Dubrovnik",
      country: "Croatia",
      code: "hr",
      image: "https://images.unsplash.com/photo-1555990793-da11153b2473?w=800&q=80",
      cars: "90+ Cars",
      gradient: "from-teal-500/80 to-emerald-600/80",
    },
  ];

  // Get flag URL from FlagCDN
  const getFlagUrl = (code, size = 40) =>
    `https://flagcdn.com/w${size}/${code}.png`;

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-orange-50/30" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#F5807C]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-[#F5807C] rounded-full animate-pulse" />
      <div className="absolute top-40 left-32 w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-32 right-40 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#F5807C]/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#F5807C]" />
            <span className="text-sm font-semibold text-[#F5807C] tracking-wide uppercase">
              Explore Destinations
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Our Most Popular
            <span className="block mt-2 bg-gradient-to-r from-[#F5807C] to-orange-500 bg-clip-text text-transparent">
              Destinations
            </span>
          </h2>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
            Discover amazing places around the world with our premium car rental services
          </p>

          {/* Country Flags List */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-5 mb-8">
            {countries.map((country, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-[#F5807C]/40 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-8 h-6 rounded overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={getFlagUrl(country.code, 80)}
                    alt={`${country.name} flag`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-gray-700 font-semibold text-sm group-hover:text-[#F5807C] transition-colors">
                  {country.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Cards */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <Link href="/cars" key={destination.id}>
                <Card
                  className="relative bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden rounded-3xl cursor-pointer h-[340px]"
                  style={{
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    animationDelay: `${index * 0.15}s`
                  }}
                  onMouseEnter={() => setHoveredId(destination.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${destination.image})` }}
                  />

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${destination.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Floating Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                      <div className="w-6 h-4 rounded overflow-hidden shadow-sm">
                        <img
                          src={getFlagUrl(destination.code, 80)}
                          alt={`${destination.country} flag`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        {destination.country}
                      </span>
                    </div>
                  </div>

                  {/* Cars Available Badge */}
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-[#F5807C] px-3 py-1.5 rounded-full shadow-lg">
                      <span className="text-xs font-bold text-white">
                        {destination.cars}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <MapPin className="w-4 h-4 text-[#F5807C]" />
                      <span className="text-white/80 text-sm">{destination.country}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:translate-y-0 transition-transform duration-300">
                      {destination.name}
                    </h3>

                    <div className="flex items-center gap-2 text-white/90 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <span className="text-sm font-medium">Explore Now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#F5807C]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a
            href="/cars"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#F5807C] to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-[#F5807C]/30 hover:shadow-xl hover:shadow-[#F5807C]/40 transition-all duration-300 hover:scale-105 group"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PopularDestination;
