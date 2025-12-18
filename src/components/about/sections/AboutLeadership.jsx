"use client";

import React from "react";
import { Sparkles, Linkedin, Twitter, Mail } from "lucide-react";

const AboutLeadership = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      position: "Chief Executive Officer",
      initials: "SJ",
      gradient: "from-[#F5807C] to-rose-600",
      description: "Leading ResolveCars with over 15 years of experience in the automotive and technology industries.",
      delay: "0s",
    },
    {
      name: "Michael Chen",
      position: "Chief Technology Officer",
      initials: "MC",
      gradient: "from-blue-500 to-indigo-600",
      description: "Overseeing digital operations and driving our technological advancement with expertise in software development.",
      delay: "0.1s",
    },
    {
      name: "Emma Rodriguez",
      position: "Head of Operations",
      initials: "ER",
      gradient: "from-emerald-500 to-teal-600",
      description: "Developing global operations and fleet management with extensive experience in logistics and operations.",
      delay: "0.2s",
    },
    {
      name: "David Thompson",
      position: "Chief Financial Officer",
      initials: "DT",
      gradient: "from-amber-500 to-orange-600",
      description: "Managing financial operations and strategic planning with deep expertise in corporate finance and growth strategies.",
      delay: "0.3s",
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />

      {/* Decorative Elements */}
      <div className="hidden sm:block absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#F5807C]/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="hidden sm:block absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2" />

      {/* Floating Dots */}
      <div className="hidden md:block absolute top-32 left-16 w-2 lg:w-3 h-2 lg:h-3 bg-[#F5807C] rounded-full animate-pulse" />
      <div className="hidden md:block absolute top-48 right-24 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
      <div className="hidden lg:block absolute bottom-40 left-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#F5807C]/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5807C]" />
            <span className="text-xs sm:text-sm font-semibold text-[#F5807C] tracking-wide uppercase">
              Our Team
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Meet Our{" "}
            <span className="bg-gradient-to-r from-[#F5807C] to-orange-500 bg-clip-text text-transparent">
              Leadership
            </span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Experienced professionals dedicated to delivering exceptional car rental experiences.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative bg-white p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 hover:border-transparent shadow-sm hover:shadow-2xl transition-all duration-500 cursor-default overflow-hidden text-center"
              style={{ animationDelay: member.delay }}
            >
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

              {/* Top Decorative Glow */}
              <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-br ${member.gradient} rounded-full opacity-10 group-hover:opacity-25 transition-opacity duration-500 blur-2xl`} />

              {/* Profile Avatar */}
              <div className="relative mx-auto mb-5 sm:mb-6">
                {/* Avatar Ring */}
                <div className={`absolute inset-0  rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-sm scale-110`} />

                {/* Avatar Container */}
                <div className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto bg-gradient-to-br ${member.gradient} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                    {member.initials}
                  </span>
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-0 right-1/2 translate-x-8 sm:translate-x-10 md:translate-x-12 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 sm:border-3 border-white shadow-sm" />
              </div>

              {/* Name */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-gray-800 transition-colors">
                {member.name}
              </h3>

              {/* Position */}
              <p className={`text-sm sm:text-base font-semibold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent mb-3 sm:mb-4`}>
                {member.position}
              </p>

              {/* Description */}
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 group-hover:text-gray-700 transition-colors">
                {member.description}
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <a
                  href="#"
                  className={`w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br ${member.gradient} rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-md`}
                >
                  <Linkedin className="w-4 h-4 text-white" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center hover:scale-110 transition-all"
                >
                  <Twitter className="w-4 h-4 text-gray-600" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center hover:scale-110 transition-all"
                >
                  <Mail className="w-4 h-4 text-gray-600" />
                </a>
              </div>

              {/* Bottom Border Accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${member.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center`} />
            </div>
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="text-center mt-12 sm:mt-16 md:mt-20">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white px-6 sm:px-8 py-5 sm:py-6 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100">
            <div className="text-center sm:text-left">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                Want to join our team?
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                We're always looking for talented individuals
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F5807C] to-orange-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-lg shadow-[#F5807C]/25 hover:shadow-xl hover:shadow-[#F5807C]/30 hover:scale-105 transition-all duration-300"
            >
              View Careers
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutLeadership;
