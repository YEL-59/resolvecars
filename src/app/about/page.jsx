import AboutHero from "@/components/about/sections/AboutHero";
import AboutMission from "@/components/about/sections/AboutMission";
import AboutcoreValue from "@/components/about/sections/AboutcoreValue";
import AboutLeadership from "@/components/about/sections/AboutLeadership";
import Aboutusdetails from "@/components/about/sections/Aboutusdetails";
import Layout from "@/components/layout/Layout";
import React from "react";

export const metadata = {
  title: "About Us | ResolveCars",
  description:
    "Learn about ResolveCars - our mission, values, and leadership team",
};

const page = () => {
  return (
    <Layout>
      <div>
        <AboutHero />
        <Aboutusdetails />
        <AboutMission />
        <AboutcoreValue />
        <AboutLeadership />
      </div>
    </Layout>
  );
};

export default page;
