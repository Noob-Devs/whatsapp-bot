import { makeWASocket, WAConnectionState } from 'baileys'

export interface Device {
  id: string
  name: string
  status: WAConnectionState
  bot: Bot
}

export interface Bot extends ReturnType<typeof makeWASocket> {
  lastQrCode: string
}
