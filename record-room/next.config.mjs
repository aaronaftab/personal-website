/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '/record-room',
  assetPrefix: '/record-room',
  trailingSlash: true,
  distDir: 'out'
};

export default nextConfig;
