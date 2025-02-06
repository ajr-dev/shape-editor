import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shape Editor',
  description: 'A simple tool to make modern clip paths for your designs.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
