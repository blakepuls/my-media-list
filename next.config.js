/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add supabase image host to next image domains
  images: {
    domains: ["vjdkxtgvxqwqiljwvghe.supabase.co", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
