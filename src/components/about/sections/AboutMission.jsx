import Image from "next/image";
import React from "react";

const AboutMission = () => {
  const features = [
    "Flexible booking and cancellation policies",
    "Comprehensive insurance coverage options",
    "24/7 roadside assistance",
    "GPS navigation systems available",
    "Fuel-efficient and eco-friendly options",
    "Additional driver options"
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 max-w-xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              At ResolveCars, we believe that transportation should be seamless, 
              reliable, and accessible to everyone. Our mission is to provide world-class 
              car rental services that empower people to explore, connect, and achieve 
              their goals with confidence.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center">
            <Image
              src="/assets/mission.png"
              alt="Our Mission"
              width={500}
              height={400}
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMission;
