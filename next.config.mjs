/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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
