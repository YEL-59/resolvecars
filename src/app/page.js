import Layout from "@/components/layout/Layout";
import HeroSections from "@/components/home/sections/HeroSections";
import PerfectRideSection from "@/components/home/sections/PerfectRideSection";
import ChoseusSection from "@/components/home/sections/ChoseusSection";
import FeaturedSection from "@/components/home/sections/FeaturedSection";
import HowitworkSection from "@/components/home/sections/HowitworkSection";
import CustomersaySection from "@/components/home/sections/CustomersaySection";
import FaqSection from "@/components/home/sections/FaqSection";
import PopularDestination from "@/components/home/sections/PopularDestination";

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <HeroSections />
        <PerfectRideSection />
        <ChoseusSection />
        <FeaturedSection />
        <HowitworkSection />
        <CustomersaySection />
        <FaqSection />
        <PopularDestination />
      </div>
    </Layout>
  );
}
