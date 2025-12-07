/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude pdfjs-dist from bundling (we load it from CDN)
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
        'pdfjs-dist': false,
      };
      
      // Externalize pdfjs-dist to prevent bundling
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('pdfjs-dist');
      } else {
        config.externals = [config.externals, 'pdfjs-dist'];
      }
    }
    return config;
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'krfitnessstudio.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/terms-conditions',
        permanent: true,
      },
      {
        source: '/refund',
        destination: '/return-refund-policy',
        permanent: true,
      },
      {
        source: '/refund-policy',
        destination: '/return-refund-policy',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
