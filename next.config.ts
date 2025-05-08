import type { NextConfig } from "next";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

const nextConfig: NextConfig = {
  /* config options here */
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/druckohsj/image/upload/**',
        },
      ],
    },
};

export default nextConfig;
