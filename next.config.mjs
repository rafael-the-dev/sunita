/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
      LIVE_URL: "https://sunita.netlify.app",
      MODE: "PRODUCTION",
      PORT: "3000"
    },
    webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                svgo: false, // optional: disable SVGO optimizations
              },
            },
          ],
        });
    
        return config;
      },
};

export default nextConfig;
