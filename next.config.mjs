/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async rewrites() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/crm',
      },
    ]
  }
}

export default nextConfig
