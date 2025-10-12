import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection = () => {
  const faqs = [
    {
      id: "item-1",
      question: "What documents do I need to rent a car?",
      answer:
        "You'll need a valid driver's license, a credit card in your name, and a form of identification (passport or ID card). International visitors may need an International Driving Permit depending on their country of origin.",
    },
    {
      id: "item-2",
      question: "What is the minimum age requirement for car rental?",
      answer:
        "The minimum age to rent a car is 21 years old. However, drivers under 25 may be subject to a young driver surcharge. Some luxury or specialty vehicles may have higher age requirements.",
    },
    {
      id: "item-3",
      question: "Can I modify or cancel my reservation?",
      answer:
        "Yes, you can modify or cancel your reservation up to 24 hours before your pickup time without any penalty. Changes made within 24 hours may be subject to fees depending on the type of modification.",
    },
    {
      id: "item-4",
      question: "What happens if I return the car late?",
      answer:
        "Late returns are subject to additional charges. If you're more than 30 minutes late, you'll be charged for an additional day. We recommend contacting us if you anticipate being late to discuss your options.",
    },
    {
      id: "item-5",
      question: "Is insurance included in the rental price?",
      answer:
        "Basic insurance coverage is included in all our rental prices. This includes third-party liability and basic collision coverage. Additional coverage options like comprehensive insurance and personal accident insurance are available for purchase.",
    },
    {
      id: "item-6",
      question: "Can I add an additional driver to my rental?",
      answer:
        "Yes, you can add additional drivers to your rental. Each additional driver must meet the same requirements as the primary renter and will need to be present during pickup to provide their documentation. Additional driver fees may apply.",
    },
    {
      id: "item-7",
      question: "What fuel policy do you follow?",
      answer:
        "We operate on a 'full-to-full' fuel policy. This means you'll receive the car with a full tank of fuel and should return it with a full tank. If returned with less fuel, you'll be charged for refueling at our current rates.",
    },
    {
      id: "item-8",
      question: "Do you offer one-way rentals?",
      answer:
        "Yes, we offer one-way rentals between select locations. One-way rentals may be subject to additional fees depending on the pickup and drop-off locations. Please check availability when making your reservation.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FBF5F5]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Ask Questions
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to the most common questions about our car rental
            services. Can't find what you're looking for? Contact our support
            team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-gray-50 rounded-lg border-0 px-6 py-2 hover:bg-gray-100 transition-colors duration-200"
              >
                <AccordionTrigger className="text-left text-lg md:text-xl font-semibold text-gray-900 hover:text-primary transition-colors duration-200 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base md:text-lg pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Support Section */}
        {/* <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Our friendly customer support team is here to help you 24/7. Get
              in touch and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
                Contact Support
              </button>
              <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                Live Chat
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default FaqSection;
