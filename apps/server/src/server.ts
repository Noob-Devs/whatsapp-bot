import { app } from './app.js'

const port = Number(process.env.PORT) || 3333
const host = process.env.HOST || 'localhost'

app
  .listen({ port, host })
  .then(() => console.log(`HTTP Server running on http://${host}:${port}`))
  .catch(console.error)
