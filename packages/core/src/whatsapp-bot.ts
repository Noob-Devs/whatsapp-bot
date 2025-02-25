import {
  AuthenticationState,
  DisconnectReason,
  initAuthCreds,
  makeWASocket,
  useMultiFileAuthState,
} from 'baileys'
import { randomBytes, randomUUID } from 'node:crypto'
import { WhatsAppBotEventEmitter } from './classes/event_emitter.js'
import { createThreadOnDiscard } from './lib/discord.js'
import { createDiscussionInGithub } from './lib/ocktokit.js'
import { Device } from './types/device.js'

import { Boom } from '@hapi/boom'

type AuthDeviceReturn = Promise<{
  state: AuthenticationState
  saveCreds: () => Promise<void>
}>

export class WhatsAppBot {
  devices: Map<string, Device> = new Map()
  events = new WhatsAppBotEventEmitter()
  constructor({ cachedDevices }: { cachedDevices: Array<string> }) {
    for (const device of cachedDevices) {
      this.newDevice({ name: device })
    }
  }

  /**
   * Starts all devices created with the WhatsAppBot instance.
   *
   * This function starts all devices that have been created with the WhatsAppBot
   * instance. It initializes the authentication state for each device and starts
   * the connection to the WhatsApp Web API.
   *
   * @returns {Promise<void>}
   */
  async startDevices(): Promise<void> {
    for await (const device of this.devices.values()) {
      const { state } = await this.authDevice({ path: device.name })
      makeWASocket({
        auth: state,
      })
      this.events.emit('device.start', { device })
    }
  }

  /**
   * Initializes authentication for a given device path.
   *
   * @param {{ path: string }} params - The parameters for initializing device authentication.
   * @param {string} params.path - The path to the device's authentication state.
   *
   * This function initializes the authentication state for a given device path and
   * returns an object containing the authentication state and a function to save the
   * authentication state. It uses the {@link https://github.com/adiwajshing/Baileys | Baileys} library
   * to perform the initialization.
   *
   * @returns { AuthDeviceReturn }
   */
  async authDevice({ path }: { path: string }): AuthDeviceReturn {
    const { state, saveCreds } = await useMultiFileAuthState(`auth/${path}`)
    return { state, saveCreds }
  }

  /**
   * Creates a new WhatsApp device and initializes its connection.
   *
   * @param {Object} params - The parameters for creating a new device.
   * @param {string} params.name - The name of the device to be created.
   *
   * This function initializes a new WhatsApp device by setting up its authentication,
   * creating a device object, and emitting a 'device.new' event. It also sets up event
   * listeners to handle credential updates, connection updates, and message upserts.
   * If a connection is closed, it attempts to re-initialize the device. Additionally,
   * it processes messages containing the '/card' command to create discussions on Discord
   * and issues on GitHub, and responds with the created discussion link.
   */

  async newDevice({ name, id }: { name: string; id?: string }) {
    const { state, saveCreds } = await this.authDevice({ path: name })
    const bot = makeWASocket({
      auth: state,
      browser: [`${name} - Bot`, '', '0.0.0'],
    })

    this.devices.set(name, {
      id: id ?? randomUUID(),
      name,
      status: 'close',
      bot: {
        ...bot,
        lastQrCode: '',
      },
    })

    this.events.emit('device.new', { device: this.devices.get(name)! })

    bot.ev.on('creds.update', async () => {
      await saveCreds()
    })

    bot.ev.on(
      'connection.update',
      async ({ qr, connection, lastDisconnect }) => {
        const device = this.devices.get(name)
        if (device) {
          this.events.emit('device.update', { device })
          device.status = connection ?? device.status
          if (qr) {
            this.events.emit('device.qr', { device, qr })
            this.devices.get(name)!.bot.lastQrCode = qr
          }

          switch (connection) {
            case 'close':
              const shouldReconnect =
                (lastDisconnect?.error as Boom)?.output?.statusCode !==
                DisconnectReason.loggedOut
              if (shouldReconnect) {
                this.newDevice({ name, id: device.id })
              } else {
                device.status = 'close'
              }
            default:
              break
          }
        }
      }
    )

    bot.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0]
      const msgContent =
        msg?.message?.extendedTextMessage?.text || msg?.message?.conversation

      console.log(msg)
      if (msg?.key.fromMe && msgContent?.includes('/card')) {
        let cardMesage = msgContent.replaceAll('/card', '')
        const protocol = `${randomBytes(8)
          .toString('base64')
          .replace(/[/+=]/g, '')
          .substring(
            0,
            8
          )} - ${new Intl.DateTimeFormat('pt-BR').format(new Date())}`

        const [title, ...body] = cardMesage.split('\n')
        await bot.sendMessage(msg.key.remoteJid!, {
          text: `*Abrindo chamado...*`,
          edit: {
            id: msg.key.id,
            fromMe: true,
          },
        })
        try {
          const { data } = await createThreadOnDiscard({
            name: `${protocol}-${title!}`,
            auto_archive_duration: 1440,
            message: {
              content: `${body.join('\n')}\n@everyone`,
            },
            applied_tags: ['1293990170701336609'],
          })

          // Enviar a requisição GraphQL
          await createDiscussionInGithub({
            title: title || 'Sem título',
            body: `${body.join('\n')}\nhttps://discord.com/channels/${data.guild_id}/${data.id}`,
            categoryId: 'DIC_kwDON-BNO84CnOyE',
            repositoryId: 'R_kgDON-BNOw',
          })

          cardMesage = `${title}\n${body.join('\n')}`
          await bot.sendMessage(msg.key.remoteJid!, {
            text: `*Chamado ${protocol} criado com sucesso!*`,
            edit: {
              id: msg.key.id,
            },
          })
        } catch (error) {
          console.error(error)
        }
      }
    })
  }

  initAuthCreds() {
    return initAuthCreds()
  }
}
