/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/record-room' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/record-room/' : '',
  trailingSlash: true
};

export default nextConfig;
