/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Direct Supabase — new uploads
      {
        protocol: 'https',
        hostname: 'gmutwwuglrhyvcpzealx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Proxy URL — images already stored in DB with this hostname
      {
        protocol: 'https',
        hostname: 'vinayakacreation.com',
        pathname: '/supabase/storage/v1/object/public/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/supabase/:path*',
        destination: 'https://gmutwwuglrhyvcpzealx.supabase.co/:path*',
      },
    ]
  },
}

export default nextConfig
