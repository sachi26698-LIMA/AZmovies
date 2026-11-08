import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Every internal href in the prototype already ends with "/". Making that canonical
  // removes a 308 hop on detail/intermediate navigation and lets the /r/{id} Continue
  // endpoint answer directly instead of redirecting first.
  trailingSlash: true,
  images: {
    // Phase 2 uses only local fixture posters; no remote image optimizer or provider CDN.
    unoptimized: true,
  },
  // The Arena live preview is proxied under an assigned e2b.app host. This is a
  // development-server request allowance only; no authentication/trust policy exists yet.
  allowedDevOrigins: ['*.e2b.app'],
};

export default nextConfig;
