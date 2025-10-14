"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const CustomersaySection = () => {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, NY",
      rating: 5,
      review:
        "Exceptional service! The car was spotless and the booking process was incredibly smooth. I'll definitely be using ResolveCars.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Los Angeles, CA",
      rating: 5,
      review:
        "Great experience from start to finish. The staff was professional, the car was exactly as described, and the pickup process was quick and easy.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      location: "Miami, FL",
      rating: 5,
      review:
        "I've used many car rental services, but ResolveCars stands out for their attention to detail and customer service. Highly recommended!",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      location: "Miami, FL",
      rating: 5,
      review:
        "I've used many car rental services, but ResolveCars stands out for their attention to detail and customer service. Highly recommended!",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      location: "Miami, FL",
      rating: 5,
      review:
        "I've used many car rental services, but ResolveCars stands out for their attention to detail and customer service. Highly recommended!",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers
            have to say about their experience with ResolveCars.
          </p>
        </div>

        {/* Carousel with Autoplay */}
        <Carousel
          plugins={[autoplay.current]}
          opts={{
            align: "center",
            loop: true,
          }}
          className="max-w-5xl mx-auto relative"
        >
          <CarouselContent className="-ml-2 md:-ml-4 p-2">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Card className="bg-white border-0  hover:shadow-md transition-shadow duration-300 group">
                  <CardContent className="p-8">
                    {/* Quote Icon */}
                    <div className="mb-6">
                      <Quote className="w-12 h-12 text-primary/20 group-hover:text-primary/40 transition-colors duration-300" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-6">
                      <div className="flex space-x-1">
                        {renderStars(testimonial.rating)}
                      </div>
                      <span className="ml-2 text-sm text-gray-600 font-medium">
                        {testimonial.rating}.0
                      </span>
                    </div>

                    {/* Review */}
                    <p className="text-gray-700 leading-relaxed mb-8 text-base">
                      "{testimonial.review}"
                    </p>

                    {/* Customer Info */}
                    <div className="flex items-center">
                      <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-gray-100">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={56}
                          height={56}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Carousel Controls */}
          <CarouselPrevious className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white text-primary shadow-md hover:bg-gray-100 border border-primary" />
          <CarouselNext className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white text-primary shadow-md hover:bg-gray-100 border border-primary" />
        </Carousel>
      </div>
    </section>
  );
};

export default CustomersaySection;
