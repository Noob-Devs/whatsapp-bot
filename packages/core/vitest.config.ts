import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 30000, // Tempo limite para testes
    deps: {
      interopDefault: true,
    },
    coverage: {
      include: ['src/**/*'],
      reporter: ['text', 'json', 'html'], // Opções de relatório de cobertura
    },
  }
})
