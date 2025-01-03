/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/record-room' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/record-room/' : '',
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json'
  },
  onError: (error) => {
    console.error('Next.js build error:', error);
  }
};

export default nextConfig;
