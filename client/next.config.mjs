/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['clerk.dev'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/**",
      }
    ]
  }
};

export default nextConfig;
