import type React from "react"
import { Inter } from "next/font/google"
import './globals.css'
import Providers from "@/components/providers/Providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: 'CUMall - Your Campus Shopping Destination',
  description: 'Shop for all your campus needs at CUMall',
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
