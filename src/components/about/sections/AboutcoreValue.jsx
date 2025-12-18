"use client";

import React from "react";
import { Shield, HeartHandshake, Lightbulb, Award, Sparkles } from "lucide-react";

const AboutcoreValue = () => {
  const coreValues = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Every vehicle undergoes rigorous safety inspections and maintenance to ensure your peace of mind on every journey.",
      gradient: "from-emerald-500 to-teal-600",
      shadowColor: "shadow-emerald-500/25",
      bgLight: "bg-emerald-50",
    },
    {
      icon: HeartHandshake,
      title: "Customer Care",
      description: "Our dedicated support team is available 24/7 to assist you with any questions or concerns during your rental experience.",
      gradient: "from-blue-500 to-indigo-600",
      shadowColor: "shadow-blue-500/25",
      bgLight: "bg-blue-50",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously improving our technology and services to provide you with the most convenient and efficient rental experience.",
      gradient: "from-amber-500 to-orange-600",
      shadowColor: "shadow-amber-500/25",
      bgLight: "bg-amber-50",
    },
    {
      icon: Award,
      title: "Quality Service",
      description: "We are committed to providing exceptional service and maintaining the highest standards in every aspect of our business.",
      gradient: "from-[#F5807C] to-rose-600",
      shadowColor: "shadow-[#F5807C]/25",
      bgLight: "bg-rose-50",
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden">
      {/* Background Design */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

      {/* Decorative Elements */}
      <div className="hidden sm:block absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#F5807C]/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="hidden sm:block absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2" />

      {/* Floating Dots */}
      <div className="hidden md:block absolute top-24 right-20 w-2 lg:w-3 h-2 lg:h-3 bg-[#F5807C] rounded-full animate-pulse" />
      <div className="hidden md:block absolute bottom-32 left-16 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
      <div className="hidden lg:block absolute top-1/2 right-32 w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#F5807C]/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5807C]" />
            <span className="text-xs sm:text-sm font-semibold text-[#F5807C] tracking-wide uppercase">
              What We Stand For
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Our Core{" "}
            <span className="bg-gradient-to-r from-[#F5807C] to-orange-500 bg-clip-text text-transparent">
              Values
            </span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            These principles guide everything we do and define who we are as a company.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {coreValues.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div
                key={index}
                className="group relative bg-white p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 hover:border-transparent shadow-sm hover:shadow-2xl transition-all duration-500 cursor-default overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                {/* Decorative Corner */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${value.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500 blur-2xl`} />

                <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${value.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ${value.shadowColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-gray-800 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed group-hover:text-gray-700 transition-colors">
                      {value.description}
                    </p>

                    {/* Hover Indicator */}
                    <div className="mt-4 sm:mt-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className={`w-8 sm:w-10 h-0.5 bg-gradient-to-r ${value.gradient} rounded-full`} />
                      <span className={`text-xs sm:text-sm font-semibold bg-gradient-to-r ${value.gradient} bg-clip-text text-transparent`}>
                        Learn More
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Border Accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${value.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </div>
            );
          })}
        </div>

        {/* Bottom Decorative Element */}
        <div className="flex justify-center mt-10 sm:mt-12 md:mt-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-transparent to-[#F5807C]/50 rounded-full" />
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#F5807C] rounded-full animate-pulse" />
            <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-[#F5807C] to-orange-500 rounded-full" />
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-orange-500/50 to-transparent rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutcoreValue;
