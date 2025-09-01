import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // ✅ Ensure Cloud Workstations can connect during dev
  devServer: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '6000-firebase-studio-1756709014969.cluster-cbeiita7rbe7iuwhvjs5zww2i4.cloudworkstations.dev',
    ],
  },

  // ✅ Expose Supabase vars safely to client
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // ✅ Optional: rewrites for Supabase Edge Functions (if using them)
  async rewrites() {
    return [
      {
        source: '/functions/:path*',
        destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
