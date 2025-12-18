"use client";

import Image from "next/image";
import React from "react";
import { Check, Target, Sparkles, Shield, Clock, MapPin, Fuel, Users } from "lucide-react";

const AboutMission = () => {
  const features = [
    { text: "Flexible booking and cancellation policies", icon: Clock },
    { text: "Comprehensive insurance coverage options", icon: Shield },
    { text: "24/7 roadside assistance", icon: MapPin },
    { text: "GPS navigation systems available", icon: Target },
    { text: "Fuel-efficient and eco-friendly options", icon: Fuel },
    { text: "Additional driver options", icon: Users },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden">
      {/* Background Design */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-orange-50/40" />

      {/* Decorative Elements - Hidden on mobile */}
      <div className="hidden sm:block absolute top-0 right-0 w-[300px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[500px] lg:h-[600px] bg-[#F5807C]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="hidden sm:block absolute bottom-0 left-0 w-[250px] md:w-[400px] lg:w-[500px] h-[250px] md:h-[400px] lg:h-[500px] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      {/* Floating Dots - Hidden on small screens */}
      <div className="hidden md:block absolute top-32 left-10 lg:left-20 w-2 lg:w-3 h-2 lg:h-3 bg-[#F5807C] rounded-full animate-pulse" />
      <div className="hidden md:block absolute top-48 right-16 lg:right-32 w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
      <div className="hidden lg:block absolute bottom-40 left-40 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-12 md:gap-14 lg:gap-16 xl:gap-20">

          {/* Left Content */}
          <div className="flex-1 w-full lg:max-w-2xl text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#F5807C]/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5807C]" />
              <span className="text-xs sm:text-sm font-semibold text-[#F5807C] tracking-wide uppercase">
                Our Purpose
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
              Our{" "}
              <span className="bg-gradient-to-r from-[#F5807C] to-orange-500 bg-clip-text text-transparent">
                Mission
              </span>
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              At ResolveCars, we believe that transportation should be seamless,
              reliable, and accessible to everyone. Our mission is to provide world-class
              car rental services that empower people to explore, connect, and achieve
              their goals with confidence.
            </p>

            {/* Features Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="group flex items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#F5807C]/30 cursor-default"
                  >
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#F5807C] to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md sm:shadow-lg shadow-[#F5807C]/20 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium text-xs sm:text-sm group-hover:text-gray-900 transition-colors text-left">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Stats Section - Responsive */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 md:mt-12 pt-8 sm:pt-10 border-t border-gray-200 max-w-md mx-auto lg:mx-0 lg:max-w-none">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F5807C] to-orange-500 bg-clip-text text-transparent">
                  15+
                </div>
                <div className="text-gray-500 text-[10px] sm:text-xs md:text-sm mt-1">Years Experience</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F5807C] to-orange-500 bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-gray-500 text-[10px] sm:text-xs md:text-sm mt-1">Happy Customers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F5807C] to-orange-500 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-gray-500 text-[10px] sm:text-xs md:text-sm mt-1">Premium Cars</div>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="flex-1 flex justify-center relative w-full order-1 lg:order-2 mb-6 lg:mb-0">
            {/* Background Decoration - Responsive */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] xl:w-[500px] xl:h-[500px] bg-gradient-to-br from-[#F5807C]/10 to-orange-500/10 rounded-full" />
            </div>

            {/* Image Container */}
            <div className="relative z-10 group w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px]">
              {/* Decorative Frame - Hidden on mobile */}
              <div className="hidden sm:block absolute -inset-3 md:-inset-4 bg-gradient-to-br from-[#F5807C] to-orange-500 rounded-2xl md:rounded-3xl opacity-20 blur-lg md:blur-xl group-hover:opacity-30 transition-opacity duration-500" />

              {/* Main Image */}
              <div className="relative bg-white p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl">
                <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                  <Image
                    src="/assets/mission.png"
                    alt="Our Mission"
                    width={500}
                    height={400}
                    className="object-contain transition-transform duration-700 group-hover:scale-105 w-full h-auto"
                  />
                </div>

                {/* Floating Card - Top Right - Responsive */}
                <div className="absolute -top-3 sm:-top-4 md:-top-6 -right-2 sm:-right-4 md:-right-6 bg-white px-2.5 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-900">Trusted</div>
                      <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-500">Since 2009</div>
                    </div>
                  </div>
                </div>

                {/* Floating Card - Bottom Left - Responsive */}
                <div className="absolute -bottom-3 sm:-bottom-4 md:-bottom-6 -left-2 sm:-left-4 md:-left-6 bg-white px-2.5 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#F5807C] to-orange-500 rounded-full flex items-center justify-center">
                      <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-900">Goal Driven</div>
                      <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-500">Excellence First</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMission;
