import Layout from "@/components/layout/Layout";
import { Cookie, Settings, BarChart3, Target, Shield, ToggleRight, HelpCircle, Mail } from "lucide-react";

export const metadata = {
  title: "Cookie Policy | ResolveCars",
  description: "Learn about how ResolveCars uses cookies and similar technologies",
};

const CookiesPage = () => {
  const sections = [
    {
      icon: Cookie,
      title: "1. What Are Cookies?",
      content: `Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.

Cookies can be "session cookies" (deleted when you close your browser) or "persistent cookies" (remain on your device for a set period).

We also use similar technologies like web beacons, pixels, and local storage.`,
    },
    {
      icon: Settings,
      title: "2. Essential Cookies",
      content: `These cookies are necessary for the website to function properly. They enable core functionality such as:

• User authentication and session management
• Shopping cart and booking functionality
• Security features and fraud prevention
• Accessibility preferences

Essential cookies cannot be disabled as they are required for the website to work.`,
    },
    {
      icon: BarChart3,
      title: "3. Analytics Cookies",
      content: `We use analytics cookies to understand how visitors interact with our website. This helps us improve our services and user experience.

Analytics cookies collect information such as:
• Pages visited and time spent on site
• Traffic sources and navigation paths
• Device and browser information
• Geographic location (country/city level)

We use Google Analytics and similar services for this purpose.`,
    },
    {
      icon: Target,
      title: "4. Marketing Cookies",
      content: `Marketing cookies are used to track visitors across websites to display relevant advertisements. These cookies may be set by our advertising partners.

They help us:
• Show you personalized offers and promotions
• Measure the effectiveness of our advertising campaigns
• Limit the number of times you see an ad
• Understand your interests and preferences

You can opt out of personalized advertising at any time.`,
    },
    {
      icon: Shield,
      title: "5. Third-Party Cookies",
      content: `Some cookies are placed by third-party services that appear on our pages:

• Payment processors (Stripe, PayPal)
• Social media plugins (Facebook, Twitter, Instagram)
• Customer support tools (chat widgets)
• Maps and location services (Google Maps)

These third parties have their own privacy policies governing their use of cookies.`,
    },
    {
      icon: ToggleRight,
      title: "6. Managing Your Cookie Preferences",
      content: `You can control and manage cookies in several ways:

Browser Settings:
Most browsers allow you to view, delete, and block cookies. Check your browser's help section for instructions.

Our Cookie Settings:
Use our cookie consent tool to customize your preferences when you first visit our site.

Opt-Out Links:
• Google Analytics: tools.google.com/dlpage/gaoptout
• Facebook Ads: facebook.com/settings?tab=ads
• General opt-out: aboutads.info/choices`,
    },
    {
      icon: HelpCircle,
      title: "7. Cookie Duration",
      content: `Different cookies have different lifespans:

Session Cookies: Deleted when you close your browser
Persistent Cookies: Remain for varying periods:
• Authentication: 30 days
• Preferences: 1 year
• Analytics: 2 years
• Marketing: 90 days

You can clear all cookies at any time through your browser settings.`,
    },
    {
      icon: Mail,
      title: "8. Contact Us",
      content: `If you have questions about our use of cookies, please contact us:

Email: privacy@resolvecars.com
Phone: (555) 123-4567
Address: 123 Car Street, Auto City, AC 12345

We may update this Cookie Policy from time to time. Please check back regularly for any changes.`,
    },
  ];

  const cookieTypes = [
    { name: "Essential", status: "Always Active", color: "bg-green-500" },
    { name: "Analytics", status: "Optional", color: "bg-blue-500" },
    { name: "Marketing", status: "Optional", color: "bg-purple-500" },
    { name: "Preferences", status: "Optional", color: "bg-amber-500" },
  ];

  return (
    <Layout>
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
        <div className="hidden sm:block absolute top-0 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="hidden sm:block absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full mb-6">
              <Cookie className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-600 tracking-wide uppercase">
                Transparency
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
              Cookie{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed">
              We use cookies to enhance your experience. Learn about the cookies we use and how to manage them.
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Last updated: January 1, 2025
            </p>
          </div>

          {/* Cookie Types Summary */}
          <div className="max-w-4xl mx-auto mb-10 sm:mb-12">
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                Cookie Categories Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cookieTypes.map((type, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-3 h-3 ${type.color} rounded-full mx-auto mb-2`} />
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{type.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{type.status}</p>
                  </div>
                ))}
              </div>
            </div>
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
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
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

export default CookiesPage;








