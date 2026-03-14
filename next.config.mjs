// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: [
//       "images.unsplash.com",
//       "resolvecars.softvencefsd.xyz",
//       "resolvecars.svaalpha.com",
//       "resolvecars.reigeeky.com",
//       "resolvecars.thesyndicates.team",
//       "admin.resolvecars.com"
//     ],
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "admin.resolvecars.com",
//         pathname: "/storage/**",
//       },
//       {
//         protocol: "https",
//         hostname: "resolvecars.softvencefsd.xyz",
//         pathname: "/storage/**",
//       },
//       {
//         protocol: "https",
//         hostname: "resolvecars.svaalpha.com",
//         pathname: "/storage/**",
//       },
//       {
//         protocol: "https",
//         hostname: "resolvecars.reigeeky.com",
//         pathname: "/storage/**",
//       },
//     ],
//   },
// };




const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
