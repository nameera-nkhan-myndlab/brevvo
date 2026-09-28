const path = require('path');
module.exports = {
  turbopack: { root: path.join(__dirname) },
  allowedDevOrigins: ['*.preview.myndlab.ai', '*.hotload.myndlab.ai', '*.localhost', 'localhost'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || process.env.API_PROXY_TARGET || process.env.VITE_API_URL || 'http://localhost:8000'}/api/:path*`,
      },
    ];
  },
};