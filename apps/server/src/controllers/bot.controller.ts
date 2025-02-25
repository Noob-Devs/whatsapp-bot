import fs from 'node:fs/promises'
import { FastifyReply, FastifyRequest } from 'fastify'
import { bot } from '../start/bot.js'

export class BotController {
  static async init(request: FastifyRequest, reply: FastifyReply) {
    const { name } = request.body as any
    await bot.newDevice({ name })
    const { id, status } = bot.devices.get(name)!
    reply.send({ device: { id, name, status } })
  }

  static async list(_: FastifyRequest, reply: FastifyReply) {
    const devicesArray = Array.from(bot.devices.values())
    const bots = devicesArray.map((device) => ({
      id: device.id,
      name: device.name,
      status: device.status,
    }))
    reply.send({ bots })
  }

  static async remove(request: FastifyRequest, reply: FastifyReply) {
    const { name } = request.params as any
    if (!name || !bot.devices.has(decodeURIComponent(name))) {
      return reply.status(404).send({ error: 'Device not found' })
    }
    bot.devices.delete(name)
    fs.rmdir(`./auth/${name}`, { recursive: true })
    reply.status(204).send()
  }

  static async qrcode(request: FastifyRequest, reply: FastifyReply) {
    const { name } = request.params as any

    if (!name || !bot.devices.get(decodeURIComponent(name))) {
      return reply.status(404).send({ error: 'Device not found' })
    }

    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })

    reply.raw.write(
      `data: ${JSON.stringify({ qr: bot.devices.get(decodeURIComponent(name))!.bot.lastQrCode })}\n\n`
    )

    bot.events.on('device.update', ({ device }) => {
      switch (device.status) {
        case 'close':
          reply.raw.write(
            `data: ${JSON.stringify({ qr: null, status: 'offline', name: device.name })}\n\n`
          )
          break
        case 'open':
          reply.raw.write(
            `data: ${JSON.stringify({ qr: null, status: 'open', name: device.name })}\n\n`
          )
          break
        case 'connecting':
          reply.raw.write(
            `data: ${JSON.stringify({ qr: null, status: 'connecting', name: device.name })}\n\n`
          )
          break
        default:
          break
      }
    })
    bot.events.on('device.qr', ({ device: deviceUpdate, qr }) => {
      reply.raw.write(
        `data: ${JSON.stringify({ qr, deviceId: deviceUpdate.id })}\n\n`
      )
    })
  }
}
