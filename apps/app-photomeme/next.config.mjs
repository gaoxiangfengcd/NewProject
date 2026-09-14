/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cloudflare / Caddy 反代：信任 X-Forwarded-Proto / X-Forwarded-Host
  // 使 req.headers.host 与外网域名一致（webhook URL 生成、OG meta 等）
  experimental: {
    trustHostHeader: true,
  },
  eslint: {
    dirs: ['src/app', 'src/components', 'src/lib'],
  },
};

export default nextConfig;
