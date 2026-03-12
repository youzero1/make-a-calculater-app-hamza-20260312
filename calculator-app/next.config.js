/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('better-sqlite3');
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['typeorm', 'better-sqlite3', 'reflect-metadata'],
  },
};

module.exports = nextConfig;
