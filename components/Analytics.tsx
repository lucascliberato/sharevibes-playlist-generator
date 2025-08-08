'use client'

import Script from 'next/script'

const GA_TRACKING_ID = 'G-513N0GXXZT'

export function Analytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `}
      </Script>
    </>
  )
}

// 🎯 FUNÇÕES AUXILIARES PARA TRACKING CUSTOM (com tipos seguros)
export const trackEvent = (
  action: string, 
  category: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }
}

// 🎵 EVENTOS ESPECÍFICOS DO SHAREVIBES
export const trackPlaylistGeneration = (path: 'quick' | 'precise', context: string) => {
  trackEvent('playlist_generated', 'user_engagement', `${path}_${context}`)
}

export const trackEmailCollection = (context: string) => {
  trackEvent('email_collected', 'lead_generation', context)
}

export const trackPathSelection = (path: 'quick' | 'precise') => {
  trackEvent('path_selected', 'user_flow', path)
}