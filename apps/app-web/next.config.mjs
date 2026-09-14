/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  eslint: {
    // 只 lint 业务代码，跳过 Prisma 生成的 client（src/db/generated）
    dirs: ['src/app', 'src/components', 'src/lib', 'src/data'],
  },
};

export default nextConfig;
