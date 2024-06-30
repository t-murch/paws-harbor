///** @type {import('next').NextConfig} */
//const nextConfig = {};
//
//export default nextConfig;

const path = require("path");

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["lucide-react", "@repo/ui"],
  output: "standalone",
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
};
