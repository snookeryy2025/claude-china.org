/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // scripts/dev.mjs assigns separate output to every dev server; production
  // builds and next start share only .next.
  distDir: process.env.NEXT_DIST_DIR || '.next',
};
export default nextConfig;
