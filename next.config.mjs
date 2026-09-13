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
    },
    env: {
        NEXT_PUBLIC_API_URL: 'https://backend.taal.life/api/v1/',
        NEXT_PUBLIC_SOCKET_URL: 'https://backend.taal.life',
        NEXT_PUBLIC_API_BASE_URL: 'https://backend.taal.life'
    }
};

export default nextConfig;
