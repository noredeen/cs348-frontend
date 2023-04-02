/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Rewrite everything else to use `pages/index`
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
}

module.exports = nextConfig
