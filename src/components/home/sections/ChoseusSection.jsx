import React from "react";
import { Shield, Clock, DollarSign, Headphones } from "lucide-react";

const ChoseusSection = () => {
  const features = [
    {
      id: 1,
      icon: Shield,
      title: "Safe Journey",
      description:
        "We prioritize your safety with our well-maintained vehicles and comprehensive insurance coverage.",
    },
    {
      id: 2,
      icon: Clock,
      title: "Fast Booking",
      description:
        "Book your ride in minutes with our streamlined process and instant confirmation system.",
    },
    {
      id: 3,
      icon: DollarSign,
      title: "Affordable Price",
      description:
        "Enjoy competitive pricing with no hidden fees and transparent cost breakdown.",
    },
    {
      id: 4,
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Our dedicated support team is available round the clock to assist you with any queries.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FBF5F5]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose ResolveCars?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing exceptional car rental services with
            unmatched quality and convenience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-[#FAFAFA]   text-center group hover:transform hover:scale-105 transition-all duration-300 border border-primary/20 rounded-2xl p-6"
              >
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <IconComponent className="w-10 h-10 text-primary" />
                  </div>
                  {/* Decorative circle */}
                  <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-primary/20 rounded-full animate-pulse"></div>
                </div>

                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChoseusSection;
