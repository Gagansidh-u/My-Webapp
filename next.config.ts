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
    RAZORPAY_KEY_ID: 'rzp_live_ejYiKvpbjCVgtj',
    RAZORPAY_KEY_SECRET: 'KRLOvNB1jK0L9pCWEW9vi349',
    NEXT_PUBLIC_RAZORPAY_KEY_ID: 'rzp_live_ejYiKvpbjCVgtj',
  },
};

export default nextConfig;
