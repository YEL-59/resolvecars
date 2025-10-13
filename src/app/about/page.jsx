import AboutHero from "@/components/about/sections/AboutHero";
import Layout from "@/components/layout/Layout";
import React from "react";

export const metadata = {
  title: "Cars | ResolveCars",
  description: "Browse our collection of luxury and affordable cars for rent",
};

const page = () => {
  return (
    <Layout>
      <div>
        <AboutHero />
      </div>
    </Layout>
  );
};

export default page;
