/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'img.clerk.com',
      'images.clerk.dev',
      'pub-1c83380c5e270f0d584e576e038edc6b.r2.dev',
      'pub-af1e06f43a504834a771308801881057.r2.dev',
      'peon.sh',
      'public-storage.peon.sh',
      'private-storage.peon.sh',
    ],
  },
  afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
  afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
};

export default nextConfig;
