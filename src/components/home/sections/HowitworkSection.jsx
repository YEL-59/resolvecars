import React from "react";
import { Search, Calendar, Car } from "lucide-react";

const HowitworkSection = () => {
  const steps = [
    {
      id: 1,
      icon: Search,
      title: "Search & Select",
      description:
        "Browse our extensive fleet and select the perfect vehicle for your needs and budget.",
      color: "bg-primary",
    },
    {
      id: 2,
      icon: Calendar,
      title: "Book & Pay",
      description:
        "Select your dates, complete the booking process, and make secure payment online.",
      color: "bg-primary",
    },
    {
      id: 3,
      icon: Car,
      title: "Enjoy the Ride",
      description:
        "Pick up your car and enjoy a comfortable, safe journey to your destination.",
      color: "bg-primary",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FBF5F5]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Renting a car has never been easier. Follow these simple steps to
            get on the road quickly
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="relative text-center group">
                  {/* Connection Line (hidden on mobile) */}
                  {/* I WAN THIS LINE IS LIKE START TO END  */}

                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,#06327A_100%)] z-0">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#06327A] rounded-full"></div>
                    </div>
                  )}

                  {/* Step Content */}
                  <div className="relative z-10">
                    {/* Step Number & Icon */}
                    <div className="relative mb-6">
                      <div
                        className={`w-32 h-32 mx-auto ${step.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <IconComponent className="w-16 h-16 text-white" />
                      </div>

                      {/* Step Number Badge */}
                      {/* <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-4 border-primary rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-primary">
                          {step.id}
                        </span>
                      </div> */}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of satisfied customers and experience hassle-free
              car rental today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
                Start Booking Now
              </button>
              <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                View Our Fleet
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HowitworkSection;
