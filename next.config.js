/** @type {import('next').NextConfig} */
module.exports = {
  //for GitHub Pages
  assetPrefix: process.env.CI ? '/TouchLyricWorld': undefined,
  distDir: 'build',
  reactStrictMode: true,
  poweredByHeader: false,
  optimizeFonts: true,
}
