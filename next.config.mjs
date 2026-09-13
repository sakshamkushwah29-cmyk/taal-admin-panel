/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
     images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'admin.taal.life',
            },
            {
                protocol: 'https',
                hostname: 'backend.taal.life',
            },
            {
                protocol: 'https',
                hostname: 'taal.life',
            },
            {
                protocol: 'https',
                hostname: 'example.com',
            },
            {
                protocol: 'https',
                hostname: 'ondseller.co',
            },
            {
                protocol: 'https',
                hostname: 'static.vecteezy.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ]
    }
};

export default nextConfig;
