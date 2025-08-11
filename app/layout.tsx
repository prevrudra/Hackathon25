import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AuthProvider } from "@/lib/auth-context"
import { AppStateProvider } from "@/lib/app-state"
import "./globals.css"

export const metadata: Metadata = {
  title: "QuickCourt - Book Sports Facilities",
  description:
    "Discover and book local sports facilities like badminton courts, turf grounds, and table tennis tables.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          <AppStateProvider>{children}</AppStateProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
