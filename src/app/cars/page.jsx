"use client";

import { Suspense } from "react";
import CarsCardSection from "@/components/cars/CarsCardSection";
import CarsHeroSection from "@/components/cars/sections/carsHeroSection";
import PricingPlans from "@/components/cars/PricingPlans";
import Layout from "@/components/layout/Layout";

function CarsPage() {
  return (
    <Layout>
      <main className="min-h-screen bg-gray-50">
        <CarsHeroSection />
        {/* <PricingPlans /> */}
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }>
          <CarsCardSection />
        </Suspense>
      </main>
    </Layout>
  );
}

export default CarsPage;
