import React from "react";
import ContactUs from "@/components/contact/ContactUs";
import Layout from "@/components/layout/Layout";

export const metadata = {
  title: "Contact Us - Resolve Cars",
  description: "Get in touch with our friendly customer service team. We're here to help with your car rental needs 24/7.",
};

const contact = () => {
  return (
    <Layout>
      <ContactUs />
    </Layout>
  );
};

export default contact;
