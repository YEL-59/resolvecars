"use client";

import Image from "next/image";
import React from "react";
import { CheckCircle, Star, Users, Car, Award, Sparkles } from "lucide-react";

const AboutHero = () => {
  const stats = [
    { icon: Users, value: "250K+", label: "Happy Customers" },
    { icon: Car, value: "500+", label: "Premium Cars" },
    { icon: Award, value: "15+", label: "Years Experience" },
  ];

  return (
    <section className="relative min-h-screen sm:min-h-[90vh] overflow-hidden">
      {/* Background Design */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FBF5F5] via-white to-orange-50/50" />

      {/* Decorative Elements - Hidden on mobile for cleaner look */}
      <div className="hidden sm:block absolute top-0 right-0 w-[400px] md:w-[600px] lg:w-[800px] h-[400px] md:h-[600px] lg:h-[800px] bg-[#F5807C]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="hidden sm:block absolute bottom-0 left-0 w-[300px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[500px] lg:h-[600px] bg-orange-500/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      {/* Animated Floating Elements - Responsive positioning */}
      <div className="hidden md:block absolute top-24 left-8 lg:left-16 w-3 lg:w-4 h-3 lg:h-4 bg-[#F5807C] rounded-full animate-pulse opacity-60" />
      <div className="hidden md:block absolute top-40 right-12 lg:right-24 w-2 lg:w-3 h-2 lg:h-3 bg-orange-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.5s' }} />
      <div className="hidden lg:block absolute bottom-32 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
      <div className="hidden lg:block absolute top-1/2 right-16 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-50" style={{ animationDelay: '0.3s' }} />

      {/* Grid Pattern Overlay - Subtle on all screens */}
      <div className="absolute inset-0 opacity-[0.015] sm:opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20">

          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left w-full lg:max-w-2xl order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 shadow-sm border border-gray-100">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5807C]" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                Welcome to ResolveCars
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight leading-tight">
              Find Your{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#F5807C] to-orange-500 bg-clip-text text-transparent">
                  Perfect Car
                </span>
                {/* Decorative underline */}
                <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1.5 sm:h-2" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                  <path d="M1 5.5C47.6667 2.16667 152.4 -2.3 199 5.5" stroke="url(#heroGradient)" strokeWidth="3" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="heroGradient" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="#F5807C" />
                      <stop offset="1" stopColor="#F97316" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 px-2 sm:px-0">
              Browse our extensive fleet of premium vehicles and find the
              perfect car for your journey. Experience luxury, comfort, and reliability.
            </p>

            {/* Trust Badge - Responsive layout */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-8 sm:mb-10">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-gray-900 font-bold text-sm sm:text-base md:text-lg">
                  Trusted by 250,000+ customers
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-0.5 sm:gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs sm:text-sm text-gray-500 ml-1.5 sm:ml-2">4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Stats Row - Responsive grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-lg mx-auto lg:mx-0">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center lg:text-left group">
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 md:gap-3 mb-1">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#F5807C]/10 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-[#F5807C]/20 transition-colors">
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5807C]" />
                      </div>
                      <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm font-medium">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Image Section */}
          <div className="flex-1 relative flex items-center justify-center w-full order-1 lg:order-2 mb-6 lg:mb-0">
            {/* Background Glow - Responsive sizing */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] xl:w-[550px] xl:h-[550px] bg-gradient-to-br from-[#F5807C]/15 to-orange-500/10 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
            </div>

            {/* Image Container */}
            <div className="relative z-10 group w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]">
              {/* Decorative Ring - Hidden on mobile */}
              <div className="hidden md:block absolute -inset-4 lg:-inset-6 border-2 border-dashed border-[#F5807C]/20 rounded-full animate-spin" style={{ animationDuration: '30s' }} />

              {/* Main Image */}
              <div className="relative">
                <Image
                  src="/assets/aboutcar.png"
                  alt="About Hero - Premium Car"
                  width={700}
                  height={500}
                  className="object-contain drop-shadow-xl sm:drop-shadow-2xl transition-transform duration-700 group-hover:scale-105 w-full h-auto"
                  priority
                />

                {/* Floating Badge - Top Right - Responsive */}
                <div className="absolute -top-2 sm:-top-3 md:-top-4 right-0 sm:right-2 md:right-4 lg:right-8 bg-white px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-[#F5807C] to-orange-500 rounded-full flex items-center justify-center">
                      <Car className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-xs font-bold text-gray-900">Premium Fleet</div>
                      <div className="text-[8px] sm:text-[10px] text-gray-500">500+ Vehicles</div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge - Bottom Left - Responsive */}
                <div className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 left-0 sm:left-2 md:left-4 lg:left-8 bg-white px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                      <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-xs font-bold text-gray-900">Top Rated</div>
                      <div className="text-[8px] sm:text-[10px] text-gray-500">Best in Class</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave - Responsive height */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 sm:h-16 md:h-20 lg:h-auto" preserveAspectRatio="none">
          <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default AboutHero;
