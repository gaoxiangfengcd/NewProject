/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { trustHostHeader: true },
  eslint: {
    dirs: ['src/app', 'src/components', 'src/lib'],
    // Cloudflare 等构建环境可能未安装 eslint-config-next，构建时跳过 ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
