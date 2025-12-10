/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "resolvecars.softvencefsd.xyz",
      "resolvecars.svaalpha.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "resolvecars.softvencefsd.xyz",
        hostname: "resolvecars.svaalpha.com",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
