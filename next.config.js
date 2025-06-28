const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Le manifest.json est déjà présent dans public/
});

module.exports = withPWA({
  // ...autres options Next.js si besoin
  reactStrictMode: true,
  // Si tu utilises des réécritures ou redirections, ajoute-les ici
});
