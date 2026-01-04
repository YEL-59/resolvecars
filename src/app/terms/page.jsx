import Layout from "@/components/layout/Layout";
import { FileText, Shield, AlertCircle, Users, CreditCard, Car, Scale, Mail } from "lucide-react";

export const metadata = {
  title: "Terms of Service | ResolveCars",
  description: "Read our terms of service and rental agreement policies",
};

const TermsPage = () => {
  const sections = [
    {
      icon: FileText,
      title: "1. Agreement to Terms",
      content: `By accessing or using ResolveCars services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.

These terms apply to all users, including but not limited to browsers, customers, merchants, and contributors of content. We reserve the right to update these terms at any time without prior notice.`,
    },
    {
      icon: Users,
      title: "2. Rental Eligibility",
      content: `To rent a vehicle from ResolveCars, you must:
      
• Be at least 21 years of age (25 for premium vehicles)
• Hold a valid driver's license for at least 1 year
• Provide a valid credit card in your name
• Meet our driver verification requirements
• Have no major traffic violations in the past 3 years

Additional drivers must also meet these requirements and be registered at the time of rental.`,
    },
    {
      icon: CreditCard,
      title: "3. Payment & Deposits",
      content: `All rentals require a valid credit card for payment and security deposit. The security deposit will be held on your card and released within 7-14 business days after the vehicle is returned in satisfactory condition.

We accept all major credit cards including Visa, Mastercard, and American Express. Debit cards may be accepted with additional verification requirements.

Late returns will incur additional charges at the daily rate plus applicable fees.`,
    },
    {
      icon: Car,
      title: "4. Vehicle Use Policy",
      content: `Vehicles rented from ResolveCars may only be used for lawful purposes. The following uses are strictly prohibited:

• Off-road driving or racing
• Transporting hazardous materials
• Subletting or unauthorized drivers
• Crossing international borders without permission
• Towing or pushing other vehicles
• Using the vehicle while under the influence

Violation of these terms may result in immediate termination of your rental agreement.`,
    },
    {
      icon: Shield,
      title: "5. Insurance & Liability",
      content: `Basic liability insurance is included with all rentals. However, renters are responsible for any damage to the vehicle that exceeds the coverage limits.

We offer additional coverage options including:
• Collision Damage Waiver (CDW)
• Personal Accident Insurance (PAI)
• Supplemental Liability Protection (SLP)

Please review your coverage options at the time of booking.`,
    },
    {
      icon: AlertCircle,
      title: "6. Cancellation Policy",
      content: `Cancellations made 48 hours or more before the scheduled pickup time will receive a full refund. Cancellations within 48 hours may be subject to a cancellation fee.

No-shows will be charged the full rental amount unless the reservation is modified at least 24 hours in advance.

Modifications to existing reservations are subject to availability and may result in rate changes.`,
    },
    {
      icon: Scale,
      title: "7. Dispute Resolution",
      content: `Any disputes arising from these terms or your use of our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.

You agree to waive your right to participate in class action lawsuits against ResolveCars.

These terms shall be governed by the laws of the State of California.`,
    },
    {
      icon: Mail,
      title: "8. Contact Information",
      content: `If you have any questions about these Terms of Service, please contact us:

Email: legal@resolvecars.com
Phone: (555) 123-4567
Address: 123 Car Street, Auto City, AC 12345

Our legal team is available Monday through Friday, 9am to 5pm PST.`,
    },
  ];

  return (
    <Layout>
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
        <div className="hidden sm:block absolute top-0 right-0 w-[400px] h-[400px] bg-[#F5807C]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="hidden sm:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#F5807C]/10 px-4 py-2 rounded-full mb-6">
              <FileText className="w-4 h-4 text-[#F5807C]" />
              <span className="text-sm font-semibold text-[#F5807C] tracking-wide uppercase">
                Legal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
              Terms of{" "}
              <span className="bg-gradient-to-r from-[#F5807C] to-orange-500 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed">
              Please read these terms carefully before using our car rental services.
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Last updated: January 1, 2025
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#F5807C] to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-[#F5807C]/20">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                        {section.title}
                      </h2>
                      <div className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsPage;




