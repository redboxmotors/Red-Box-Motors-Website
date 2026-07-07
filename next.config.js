// Image host is pinned to THIS project's Supabase hostname — a wildcard
// (*.supabase.co) would let anyone run the image optimizer (and its bill)
// against images hosted on their own Supabase project.
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
  } catch {
    return 'bpndodghuxcdhqsoalid.supabase.co';
  }
})();

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: supabaseHost },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async redirects() {
    // Short memorable alias for the consignment form.
    return [{ source: '/sell', destination: '/dealer/sell', permanent: false }];
  },
};

module.exports = nextConfig;
