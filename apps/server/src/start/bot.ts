import fs from 'node:fs/promises'
import { constants, existsSync } from 'node:fs'

import { WhatsAppBot } from '@whatsapp-bot/core'

const haveAuthPath = existsSync('./auth')
if (!haveAuthPath) {
  await fs.mkdir('./auth', { recursive: true })
}
const devices_paths = await fs.readdir('./auth')
export const bot = new WhatsAppBot({ cachedDevices: devices_paths })
await bot.startDevices()
