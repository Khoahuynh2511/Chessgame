/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure your deployment settings here
  output: 'standalone', // Optimizes for Docker deployments
  // Add other deployment configurations as needed
};

module.exports = nextConfig; 