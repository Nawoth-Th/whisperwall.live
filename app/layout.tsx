import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Whisper Wall - Anonymous Gossip",
  description: "Share your secrets anonymously. No names, no traces.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/favicon.svg",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjMUExQTFBIi8+CjxwYXRoIGQ9Ik0zMC4wMDAxIDUwLjAwMDFDMzAuMDAwMSA0NC4wMDAxIDM0LjAwMDEgMzAuMDAwMSA1MC4wMDAxIDMwLjAwMDFDNjYuMDAwMSAzMC4wMDAxIDcwLjAwMDEgNDQuMDAwMSA3MC4wMDAxIDUwLjAwMDFDNzAuMDAwMSA1Ni4wMDAxIDY2LjAwMDEgNzAuMDAwMSA1MC4wMDAxIDcwLjAwMDFDMzQuMDAwMSA3MC4wMDAxIDMwLjAwMDEgNTYuMDAwMSAzMC4wMDAxIDUwLjAwMDFaIiBmaWxsPSIjRTExRDQ4Ii8+CjxwYXRoIGQ9Ik00Mi41IDQ3LjVDNDIuNSA0NS41IDQ0IDQyLjUgNDcuNSA0Mi41QzUxIDQyLjUgNTIuNSA0NS41IDUyLjUgNDcuNUM1Mi41IDQ5LjUgNTEgNTIuNSA0Ny41IDUyLjVDNDQgNTIuNSA0Mi41IDQ5LjUgNDIuNSA0Ny41WiIgZmlsbD0iIzFBMUExQSIvPgo8cGF0aCBkPSJNNTcuNSA0Ny41QzU3LjUgNDUuNSA1OSA0Mi41IDYyLjUgNDIuNUM2NiA0Mi41IDY3LjUgNDUuNSA2Ny41IDQ3LjVDNjcuNSA0OS41IDY2IDUyLjUgNjIuNSA1Mi41QzU5IDUyLjUgNTcuNSA0OS41IDU3LjUgNDcuNVoiIGZpbGw9IiMxQTFBMUEiLz4KPC9zdmc+Cg=="
        />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'