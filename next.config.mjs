import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // @tyandor/fonts ships TypeScript source, and its next.ts calls
  // next/font/local itself — the loader resolves each src path relative to the
  // file making the call, so the call has to live next to the woff2 files
  // rather than in this app.
  transpilePackages: ['@tyandor/fonts'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  images: {
    dangerouslyAllowSVG: true,
  },
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)

