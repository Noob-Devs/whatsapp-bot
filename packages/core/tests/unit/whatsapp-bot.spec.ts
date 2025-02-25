import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { WhatsAppBot } from "../../src/whatsapp-bot.js";
import { rmdirSync } from "node:fs";

describe("WhatsAppBot", () => {
  let sut: WhatsAppBot
  beforeEach(() => {
    sut = new WhatsAppBot()
  })
  afterEach(() => {
    rmdirSync('auth', { recursive: true })
  })
  it("should be able to create a new device", async () => {
    await sut.newDevice({ name: 'test' })
    expect(sut.devices.size).toBe(1)
    expect(sut.devices.has('test')).toBe(true)
  });

  it("should be able to start devices", async () => {
    await sut.newDevice({ name: 'test' })
    await sut.startDevices()
    expect(sut.devices.size).toBe(1)
    expect(sut.devices.has('test')).toBe(true)
  });
});