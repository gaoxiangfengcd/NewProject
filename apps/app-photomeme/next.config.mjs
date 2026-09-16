/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cloudflare / Caddy 反代：信任 X-Forwarded-Proto / X-Forwarded-Host，
  // 使 req.headers.host 与外网域名一致（OG meta、规范链接等）。
  // 注意：Next 14.2 运行时读取 experimental.trustHostHeader（见 next-server.js），
  // 但 config schema 漏收该 key 会打印一条 harmless warning，升级 Next 15 后移到顶层。
  experimental: {
    trustHostHeader: true,
  },
  eslint: {
    dirs: ['src/app', 'src/components', 'src/lib'],
  },
}

export default nextConfig
