import axios from 'axios'

export const discordApi = axios.create({
  baseURL: 'https://discord.com/api/v10',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
  },
})

/**
 * Creates a new thread in a Discord channel.
 *
 * This function uses the Discord API to create a new thread within a specified
 * channel. It requires a thread name, message content, optional auto-archive duration,
 * and an array of applied tags.
 *
 * @param {Object} params - The parameters for creating the thread.
 * @param {string} params.name - The name of the thread.
 * @param {Object} params.message - The message to be posted in the thread.
 * @param {string} params.message.content - The content of the message.
 * @param {number} [params.auto_archive_duration=1440] - Optional duration in minutes
 *     for auto-archiving the thread. Defaults to 1440 (24 hours).
 * @param {Array<string>} params.applied_tags - An array of tags to be applied to the thread.
 *
 * @returns {Promise<any>} A promise that resolves to the response from the Discord API.
 */
export const createThreadOnDiscard = async ({
  name,
  message,
  auto_archive_duration = 1440,
  applied_tags,
}: {
  name: string
  message: {
    content: string
  }
  auto_archive_duration?: number
  applied_tags: Array<string>
}): Promise<any> => {
  return await discordApi.post(
    `/channels/${process.env.DISCORD_CHANNEL}/threads`,
    {
      name,
      auto_archive_duration,
      message,
      applied_tags,
    }
  )
}
