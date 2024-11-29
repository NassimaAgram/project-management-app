/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
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
  },
  experimental: {
    turbo: {
      cache: true, // Enable Turbo caching
    },
  },
  output: 'standalone',
};

export default nextConfig;
