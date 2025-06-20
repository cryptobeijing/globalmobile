/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14, no need for experimental flag
  
  // Handle Web Workers and other problematic files
  webpack: (config, { isServer }) => {
    // Exclude problematic Web Worker files from processing
    config.module.rules.push({
      test: /HeartbeatWorker\.js$/,
      type: 'javascript/auto',
    });

    // Handle ES6 modules in Web Workers
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },

  // Disable webpack 5 module federation for problematic packages
  experimental: {
    esmExternals: 'loose',
  },
}

module.exports = nextConfig 