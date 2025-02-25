import { FastifyInstance } from 'fastify'
import { BotController } from '../../controllers/bot.controller.js'

export const whatsappbotRoutes = (app: FastifyInstance) => {
  app.post('/init', BotController.init)
  app.get('/list', BotController.list)
  app.delete('/remove/:name', BotController.remove)
  app.get('/qrcode/:name', BotController.qrcode)
}
