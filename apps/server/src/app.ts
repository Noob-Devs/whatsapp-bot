import fastify from 'fastify'
import cors from '@fastify/cors'
import { whatsappbotRoutes } from './routes/v1/whatsappbot.routes.js'

export const app = fastify({})

app.register(cors)
app.register(whatsappbotRoutes, { prefix: '/v1/bot' })
