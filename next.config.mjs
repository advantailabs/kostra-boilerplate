/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["img.clerk.com", "images.clerk.dev"],
  },
  afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
  afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
}

export default nextConfig
