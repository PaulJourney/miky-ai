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
    unoptimized: process.env.NETLIFY === 'true',
  },
  serverExternalPackages: ['@supabase/supabase-js', 'openai', 'stripe', '@sendgrid/mail'],
  // Optimize i18n
  experimental: {
    optimizePackageImports: ['next-intl']
  }
};

module.exports = withNextIntl(nextConfig);
