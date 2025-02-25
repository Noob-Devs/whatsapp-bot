"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { DevicesProvider } from "@/contexts/devices"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <DevicesProvider>
        {children}
      </DevicesProvider>
    </NextThemesProvider>
  )
}
