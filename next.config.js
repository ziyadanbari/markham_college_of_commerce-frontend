module.exports = {
  env: {
    NEXT_PUBLIC_API_HOST: "http://localhost:5000",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blogger.googleusercontent.com",
      },
    ],
  },
};
