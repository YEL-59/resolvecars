"use client";

import {
  Car,
  Headphones,
  MapPin,
  Star,
} from "lucide-react";
import React from "react";

const Aboutusdetails = () => {
  const details = [
    {
      icon: Car,
      title: "10,000+",
      description: "Vehicles Available",
      gradient: "from-[#F5807C] to-orange-500",
      delay: "0s",
    },
    {
      icon: Headphones,
      title: "24/7",
      description: "Customer Support",
      gradient: "from-blue-500 to-indigo-600",
      delay: "0.1s",
    },
    {
      icon: MapPin,
      title: "500+",
      description: "Pickup Locations",
      gradient: "from-emerald-500 to-teal-600",
      delay: "0.2s",
    },
    {
      icon: Star,
      title: "4.9/5",
      description: "Average Rating",
      gradient: "from-amber-500 to-orange-600",
      delay: "0.3s",
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FBF5F5]/50 to-white" />

      {/* Decorative Elements */}
      <div className="hidden sm:block absolute top-1/2 left-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-[#F5807C]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="hidden sm:block absolute top-1/2 right-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {details.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="group relative bg-white p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 hover:border-transparent shadow-sm hover:shadow-2xl transition-all duration-500 cursor-default overflow-hidden"
                style={{ animationDelay: item.delay }}
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                {/* Top Decorative Glow */}
                <div className={`absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${item.gradient} rounded-full opacity-10 group-hover:opacity-25 transition-opacity duration-500 blur-2xl`} />

                <div className="relative flex flex-col items-center text-center">
                  {/* Icon Container */}
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br ${item.gradient} rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-1 sm:mb-2`}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm sm:text-base font-medium">
                    {item.description}
                  </p>

                  {/* Bottom Line Accent */}
                  <div className={`mt-4 sm:mt-6 w-12 sm:w-16 h-1 bg-gradient-to-r ${item.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </div>

                {/* Floating Particles on Hover */}
                <div className={`absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r ${item.gradient} rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500 group-hover:animate-bounce`} style={{ animationDelay: '0.1s' }} />
                <div className={`absolute top-1/2 right-4 w-1.5 h-1.5 bg-gradient-to-r ${item.gradient} rounded-full opacity-0 group-hover:opacity-40 transition-all duration-500 group-hover:animate-pulse`} style={{ animationDelay: '0.2s' }} />
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-10 sm:mt-12 md:mt-16">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white flex items-center justify-center text-[10px] sm:text-xs font-bold text-gray-600"
                  style={{ zIndex: 4 - i }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="text-gray-600 text-sm sm:text-base font-medium ml-2">
              +250K Happy Customers
            </span>
          </div>

          <div className="hidden sm:block w-px h-6 bg-gray-300" />

          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-gray-600 text-sm sm:text-base font-medium">
              Trusted Worldwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutusdetails;
