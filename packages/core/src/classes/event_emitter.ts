import EventEmitter from 'node:events'
import { Device } from '../types/device.js'

interface WhatsAppBotEvents {
  'device.new': { device: Device }
  'device.start': { device: Device }
  'device.update': { device: Device }
  'device.stop': { device: Device }
  'device.qr': { device: Device; qr: string }
}

export class WhatsAppBotEventEmitter extends EventEmitter {
  constructor() {
    super()
  }

  emit<K extends keyof WhatsAppBotEvents>(
    eventName: K,
    arg?: WhatsAppBotEvents[K]
  ) {
    return super.emit(eventName, arg)
  }

  on<K extends keyof WhatsAppBotEvents>(
    eventName: K,
    listener: (arg: WhatsAppBotEvents[K]) => void
  ): this {
    return super.on(eventName, listener)
  }
}
