/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimiert für Vercel Deployment
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'resumeparser.app',
      },
      {
        protocol: 'https',
        hostname: 'vercel.app',
      },
    ],
  },
  
  // API-Routen Konfiguration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/resume-parser/:path*',
        destination: process.env.NEXT_PUBLIC_RESUME_PARSER_URL + '/:path*',
      }
    ]
  },
  
  // Strikte Typenprüfung in Produktion
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // ESLint in Produktion aktiviert
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },

  // Optimierungen für Produktion
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Experimentelle Funktionen
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'your-domain.vercel.app']
    }
  },

  // Optimierungen für große Dateien
  webpack: (config) => {
    config.performance = {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    }
    return config
  }
}

export default nextConfig