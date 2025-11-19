/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "resolvecars.softvencefsd.xyz"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "resolvecars.softvencefsd.xyz",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
