/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true, poweredByHeader: false };
export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
