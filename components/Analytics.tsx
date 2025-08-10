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

// 🎯 FUNÇÃO BASE PARA TRACKING CUSTOM (com tipos seguros)
export const trackEvent = (
  action: string, 
  category: string, 
  label?: string, 
  value?: number,
  customParameters?: Record<string, string | number | boolean>
) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...customParameters
    })
  }
}

// 📊 EVENTOS DO CORE JOURNEY
export const analytics = {
  
  // 🎵 PATH SELECTION
  trackPathSelection: (path: 'quick' | 'precise') => {
    trackEvent('path_selected', 'user_flow', path, undefined, {
      flow_step: 'path_selection',
      user_choice: path
    })
  },

  // 🎨 INPUT COLLECTION
  trackWorkContextSelection: (context: string, path: 'quick' | 'precise') => {
    trackEvent('work_context_selected', 'user_preferences', context, undefined, {
      selected_path: path,
      flow_step: 'input_collection'
    })
  },

  trackGenreSelection: (genres: string[], context: string) => {
    trackEvent('genres_selected', 'user_preferences', genres.join(','), genres.length, {
      work_context: context,
      genre_count: genres.length,
      flow_step: 'input_collection'
    })
  },

  trackMoodSelection: (mood: string, context: string) => {
    trackEvent('mood_selected', 'user_preferences', mood, undefined, {
      work_context: context,
      flow_step: 'input_collection'
    })
  },

  trackSeedTracksAdded: (trackCount: number, context: string) => {
    trackEvent('seed_tracks_added', 'user_preferences', 'precise_path', trackCount, {
      work_context: context,
      track_count: trackCount,
      flow_step: 'input_collection'
    })
  },

  // ⚡ PLAYLIST GENERATION
  trackPlaylistGenerationStarted: (path: 'quick' | 'precise', context: string, genres?: string[]) => {
    trackEvent('playlist_generation_started', 'core_action', `${path}_${context}`, undefined, {
      selected_path: path,
      work_context: context,
      genres: genres?.join(',') || '',
      flow_step: 'generation'
    })
  },

  trackPlaylistGenerationCompleted: (
    path: 'quick' | 'precise', 
    context: string, 
    trackCount: number,
    generationTimeSeconds: number,
    genres?: string[]
  ) => {
    trackEvent('playlist_generation_completed', 'core_action', `${path}_${context}`, generationTimeSeconds, {
      selected_path: path,
      work_context: context,
      track_count: trackCount,
      generation_time_seconds: generationTimeSeconds,
      genres: genres?.join(',') || '',
      flow_step: 'generation_success'
    })
  },

  trackPlaylistGenerationFailed: (path: 'quick' | 'precise', context: string, errorType: string) => {
    trackEvent('playlist_generation_failed', 'error', `${path}_${context}`, undefined, {
      selected_path: path,
      work_context: context,
      error_type: errorType,
      flow_step: 'generation_error'
    })
  },

  // 🔗 PLAYLIST INTERACTION
  trackTrackLinkClicked: (platform: 'spotify' | 'youtube', trackTitle: string, trackPosition: number) => {
    trackEvent('track_link_clicked', 'engagement', platform, trackPosition, {
      platform: platform,
      track_title: trackTitle,
      track_position: trackPosition,
      flow_step: 'results'
    })
  },

  // 📧 EMAIL COLLECTION
  trackEmailCollectionStarted: (context: string) => {
    trackEvent('email_collection_started', 'lead_generation', context, undefined, {
      work_context: context,
      flow_step: 'email_collection'
    })
  },

  trackEmailCollectionCompleted: (context: string) => {
    trackEvent('email_collection_completed', 'lead_generation', context, undefined, {
      work_context: context,
      flow_step: 'email_success'
    })
  },

  trackEmailCollectionFailed: (context: string, errorType: string) => {
    trackEvent('email_collection_failed', 'error', context, undefined, {
      work_context: context,
      error_type: errorType,
      flow_step: 'email_error'
    })
  },

  // 🔄 NAVIGATION & RESTART
  trackCreateAnotherPlaylistClicked: (previousContext: string) => {
    trackEvent('create_another_playlist_clicked', 'engagement', 'restart', undefined, {
      previous_context: previousContext,
      flow_step: 'results'
    })
  },

  trackDiscoverNewMusicClicked: (currentContext: string) => {
    trackEvent('discover_new_music_clicked', 'engagement', 'external_link', undefined, {
      current_context: currentContext,
      destination: 'sharevibes_app',
      flow_step: 'results'
    })
  },

  // 🔗 URL PARAMETERS (Email Campaigns)
  trackPageLoadWithParams: (params: { context?: string, mood?: string, genres?: string[] }) => {
    trackEvent('page_load_with_params', 'campaign', 'email_campaign', undefined, {
      url_context: params.context || '',
      url_mood: params.mood || '',
      url_genres: params.genres?.join(',') || '',
      campaign_source: 'email',
      flow_step: 'landing'
    })
  },

  // ⏱️ SESSION TRACKING
  trackSessionDuration: (durationSeconds: number, completedSteps: string[]) => {
    trackEvent('session_completed', 'engagement', 'full_session', durationSeconds, {
      session_duration_seconds: durationSeconds,
      completed_steps: completedSteps.join(','),
      steps_completed_count: completedSteps.length
    })
  },

  trackStepCompleted: (step: string, timeOnStepSeconds: number) => {
    trackEvent('step_completed', 'user_flow', step, timeOnStepSeconds, {
      step_name: step,
      time_on_step_seconds: timeOnStepSeconds
    })
  },

  // 🎯 BUSINESS METRICS
  // 🎯 BUSINESS METRICS
  trackConversionFunnel: (
    step: string, // Accept any string for flexibility
    previousStep?: string
  ) => {
    trackEvent('funnel_step_reached', 'conversion', step, undefined, {
      funnel_step: step,
      previous_step: previousStep || 'none',
      flow_progression: `${previousStep || 'start'}_to_${step}`
    })
  }
}

// 🎵 BACKWARDS COMPATIBILITY (manter funções antigas)
export const trackPlaylistGeneration = (path: 'quick' | 'precise', context: string) => {
  analytics.trackPlaylistGenerationCompleted(path, context, 15, 0) // Default values for backward compatibility
}

export const trackEmailCollection = (context: string) => {
  analytics.trackEmailCollectionCompleted(context)
}

export const trackPathSelection = (path: 'quick' | 'precise') => {
  analytics.trackPathSelection(path)
}