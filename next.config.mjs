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

  // API-Konfiguration
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
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
  },

  // Headers für CORS und Sicherheit
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ]
  }
}

export default nextConfig