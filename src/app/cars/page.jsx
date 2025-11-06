import CarsCardSection from "@/components/cars/CarsCardSection";
import CarsHeroSection from "@/components/cars/sections/carsHeroSection";
import PricingPlans from "@/components/cars/PricingPlans";
import Layout from "@/components/layout/Layout";

export const metadata = {
  title: "Cars | ResolveCars",
  description: "Browse our collection of luxury and affordable cars for rent",
};

export default function CarsPage() {
  return (
    <Layout>
      <main className="min-h-screen bg-gray-50">
        <CarsHeroSection />
        {/* <PricingPlans /> */}
        <CarsCardSection />
      </main>
    </Layout>
  );
}
