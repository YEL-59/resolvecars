import React from "react";
import Image from "next/image";

const AboutLeadership = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      position: "Chief Executive Officer",
      image: "/assets/team/sarah.jpg",
      description: "Leading ResolveCars with over 15 years of experience in the automotive and technology industries."
    },
    {
      name: "Michael Chen",
      position: "Chief Technology Officer",
      image: "/assets/team/michael.jpg", 
      description: "Overseeing digital operations and driving our technological advancement with expertise in software development."
    },
    {
      name: "Emma Rodriguez",
      position: "Head of Operations",
      image: "/assets/team/emma.jpg",
      description: "Developing global operations and fleet management with extensive experience in logistics and operations."
    },
    {
      name: "David Thompson",
      position: "Chief Financial Officer",
      image: "/assets/team/david.jpg",
      description: "Managing financial operations and strategic planning with deep expertise in corporate finance and growth strategies."
    }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Leadership Team
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experienced professionals dedicated to delivering exceptional car rental experiences.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              {/* Profile Image */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Name and Position */}
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-red-500 font-medium mb-3">
                {member.position}
              </p>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutLeadership;
