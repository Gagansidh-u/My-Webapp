
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  env: {
    RAZORPAY_KEY_ID: 'rzp_live_RSm2UNwErs0ra1',
    RAZORPAY_KEY_SECRET: 'f5UotViWVuO4KuNIHT02j6v4',
    NEXT_PUBLIC_RAZORPAY_KEY_ID: 'rzp_live_RSm2UNwErs0ra1',
  },
};

export default nextConfig;
