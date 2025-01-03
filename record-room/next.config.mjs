/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '/record-room',
  assetPrefix: '/record-room/',
  trailingSlash: true
};

export default nextConfig;
