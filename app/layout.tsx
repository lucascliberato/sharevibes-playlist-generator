import type { Metadata } from 'next'
import { Space_Grotesk, VT323 } from 'next/font/google'
import { AppProvider } from '@/lib/app-context'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
})

export const metadata: Metadata = {
  title: 'ShareVibes Playlist Generator - Create Your Perfect Mixtape',
  description: 'Generate personalized work playlists in 15 seconds with ShareVibes. Choose between Quick Mix or Precise Mix for the perfect soundtrack to your productivity.',
  keywords: 'playlist generator, work music, productivity playlist, mixtape, spotify playlist, focus music, ShareVibes',
  
  // 🔧 CONFIGURAÇÃO FAVICON MELHORADA
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: 'any'
      }
    ],
    shortcut: '/favicon.ico',
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${vt323.variable}`}>
      <head>
        {/* 🔧 FAVICON LINKS MAIS ROBUSTOS */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#a238ff" />
        
        {/* 🔧 FORCE FAVICON REFRESH */}
        <link rel="icon" href="/favicon.ico?v=2" />
      </head>
      <body className={`${spaceGrotesk.className} antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}