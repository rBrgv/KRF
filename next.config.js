/** @type {import('next').NextConfig} */
const nextConfig = {
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
