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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${vt323.variable}`}>
      <body className={`${spaceGrotesk.className} antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
