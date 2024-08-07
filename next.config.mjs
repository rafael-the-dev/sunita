/** @type {import('next').NextConfig} */

const nextConfig = {
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
