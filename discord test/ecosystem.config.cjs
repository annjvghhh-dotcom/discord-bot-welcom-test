/** PM2 — تشغيل 24/7 مع إعادة تشغيل تلقائي */
module.exports = {
  apps: [
    {
      name: 'discord-welcome-bot',
      script: 'index.js',
      autorestart: true,
      watch: false,
      max_restarts: 100,
      restart_delay: 5000,
      exp_backoff_restart_delay: 2000,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
