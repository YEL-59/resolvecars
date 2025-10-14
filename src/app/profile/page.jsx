import Layout from "@/components/layout/Layout";
import ProfileMain from "@/components/profile/sections/Profile";
import React from "react";

const Profile = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <ProfileMain />
      </div>
    </Layout>
  );
};

export default Profile;
