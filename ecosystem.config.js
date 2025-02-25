module.exports = {
  apps: [
    {
      name: 'whatsapp-bot-server',
      script: './apps/server/dist/server.js',
      combine_logs: true,
      time: true,
      max_memory_restart: '1G',
    },
    {
      name: 'whatsapp-bot-web',
      script: 'cd apps/web && pnpm run start',
      combine_logs: true,
      time: true,
      max_memory_restart: '1G',
    }
  ],
}
