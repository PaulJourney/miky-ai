/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
    ],
    unoptimized: true, // Required for Netlify
  },
  serverExternalPackages: ['@supabase/supabase-js', 'openai', 'stripe', '@sendgrid/mail'],
  // Optimize for Netlify
  experimental: {
    optimizePackageImports: ['next-intl']
  },
  // Ensure proper output for Netlify
  output: 'standalone'
};

module.exports = withNextIntl(nextConfig);
