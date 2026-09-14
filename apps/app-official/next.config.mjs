/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { trustHostHeader: true },
  eslint: {
    dirs: ['src/app', 'src/components', 'src/lib'],
  },
};

export default nextConfig;
