import Layout from "@/components/layout/Layout";
import { Lock, Eye, Database, Share2, Shield, UserCheck, Globe, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | ResolveCars",
  description: "Learn how ResolveCars collects, uses, and protects your personal information",
};

const PrivacyPage = () => {
  const sections = [
    {
      icon: Eye,
      title: "1. Information We Collect",
      content: `We collect information you provide directly to us, including:

• Personal identification (name, email, phone number, address)
• Driver's license information and verification documents
• Payment information (credit card details processed securely)
• Rental history and preferences
• Communication records with our support team

We also automatically collect certain information when you use our services, including device information, IP address, and browsing behavior.`,
    },
    {
      icon: Database,
      title: "2. How We Use Your Information",
      content: `We use the information we collect to:

• Process your rental reservations and payments
• Verify your identity and driving eligibility
• Communicate with you about your rentals
• Send promotional offers and newsletters (with your consent)
• Improve our services and customer experience
• Comply with legal obligations and prevent fraud

We will never sell your personal information to third parties.`,
    },
    {
      icon: Share2,
      title: "3. Information Sharing",
      content: `We may share your information with:

• Service providers who assist in our operations (payment processors, insurance providers)
• Law enforcement when required by law
• Business partners with your explicit consent
• Affiliated companies within our corporate family

All third parties are required to maintain the confidentiality and security of your information.`,
    },
    {
      icon: Shield,
      title: "4. Data Security",
      content: `We implement industry-standard security measures to protect your personal information:

• SSL/TLS encryption for all data transmission
• PCI-DSS compliant payment processing
• Regular security audits and penetration testing
• Access controls and employee training
• Secure data centers with physical security

While we strive to protect your data, no method of transmission over the Internet is 100% secure.`,
    },
    {
      icon: UserCheck,
      title: "5. Your Rights",
      content: `You have the right to:

• Access your personal information we hold
• Correct inaccurate or incomplete data
• Request deletion of your data (subject to legal requirements)
• Opt-out of marketing communications
• Export your data in a portable format
• Lodge a complaint with a supervisory authority

To exercise these rights, please contact our privacy team.`,
    },
    {
      icon: Globe,
      title: "6. International Transfers",
      content: `Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place:

• Standard Contractual Clauses (SCCs)
• Adequacy decisions where applicable
• Binding Corporate Rules for intra-group transfers

By using our services, you consent to the transfer of your information to these countries.`,
    },
    {
      icon: Lock,
      title: "7. Data Retention",
      content: `We retain your personal information for as long as necessary to:

• Provide our services to you
• Comply with legal obligations
• Resolve disputes and enforce agreements
• Maintain business records

Rental records are typically retained for 7 years. You may request deletion of your account data at any time.`,
    },
    {
      icon: Mail,
      title: "8. Contact Us",
      content: `If you have questions or concerns about this Privacy Policy, please contact us:

Privacy Officer
Email: privacy@resolvecars.com
Phone: (555) 123-4567
Address: 123 Car Street, Auto City, AC 12345

We will respond to your inquiry within 30 days.`,
    },
  ];

  return (
    <Layout>
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
        <div className="hidden sm:block absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="hidden sm:block absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#F5807C]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full mb-6">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600 tracking-wide uppercase">
                Your Privacy Matters
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
              Privacy{" "}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
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

export default PrivacyPage;





