import { useCallback, useEffect, useRef } from 'react'
import { useApp } from '@/lib/app-context'
import { analytics } from '@/components/Analytics'

export function useAnalytics() {
  const { state } = useApp()
  const stepTimersRef = useRef<Record<string, number>>({})
  const sessionStartRef = useRef<number>(Date.now())

  // 🕒 STEP TIMING TRACKING
  const startStepTimer = useCallback((step: string) => {
    stepTimersRef.current[step] = Date.now()
  }, [])

  const endStepTimer = useCallback((step: string) => {
    if (stepTimersRef.current[step]) {
      const duration = Math.round((Date.now() - stepTimersRef.current[step]) / 1000)
      analytics.trackStepCompleted(step, duration)
      delete stepTimersRef.current[step]
    }
  }, [])

  // 🎯 SIMPLIFIED TRACKING FUNCTIONS
  const track = {
    // Path Selection
    pathSelected: useCallback((path: 'quick' | 'precise') => {
      analytics.trackPathSelection(path)
      analytics.trackConversionFunnel('path_selection', 'landing')
    }, []),

    // Input Collection
    workContextSelected: useCallback((context: string) => {
      if (state.selectedPath) {
        analytics.trackWorkContextSelection(context, state.selectedPath)
      }
    }, [state.selectedPath]),

    genresSelected: useCallback((genres: string[]) => {
      if (state.workContext) {
        analytics.trackGenreSelection(genres, state.workContext)
      }
    }, [state.workContext]),

    moodSelected: useCallback((mood: string) => {
      if (state.workContext) {
        analytics.trackMoodSelection(mood, state.workContext)
      }
    }, [state.workContext]),

    seedTracksAdded: useCallback((trackCount: number) => {
      if (state.workContext) {
        analytics.trackSeedTracksAdded(trackCount, state.workContext)
      }
    }, [state.workContext]),

    // Playlist Generation
    generationStarted: useCallback(() => {
      if (state.selectedPath && state.workContext) {
        analytics.trackPlaylistGenerationStarted(
          state.selectedPath, 
          state.workContext, 
          state.selectedGenres
        )
        analytics.trackConversionFunnel('generation', 'input_collection')
        startStepTimer('playlist_generation')
      }
    }, [state.selectedPath, state.workContext, state.selectedGenres, startStepTimer]),

    generationCompleted: useCallback((trackCount: number = 15) => {
      if (state.selectedPath && state.workContext) {
        const generationTime = stepTimersRef.current['playlist_generation'] 
          ? Math.round((Date.now() - stepTimersRef.current['playlist_generation']) / 1000)
          : 0

        analytics.trackPlaylistGenerationCompleted(
          state.selectedPath,
          state.workContext,
          trackCount,
          generationTime,
          state.selectedGenres
        )
        analytics.trackConversionFunnel('results', 'generation')
        endStepTimer('playlist_generation')
      }
    }, [state.selectedPath, state.workContext, state.selectedGenres, endStepTimer]),

    generationFailed: useCallback((errorType: string) => {
      if (state.selectedPath && state.workContext) {
        analytics.trackPlaylistGenerationFailed(state.selectedPath, state.workContext, errorType)
        endStepTimer('playlist_generation')
      }
    }, [state.selectedPath, state.workContext, endStepTimer]),

    // Track Interactions
    trackLinkClicked: useCallback((platform: 'spotify' | 'youtube', trackTitle: string, position: number) => {
      analytics.trackTrackLinkClicked(platform, trackTitle, position)
    }, []),

    // Email Collection
    emailCollectionStarted: useCallback(() => {
      if (state.workContext) {
        analytics.trackEmailCollectionStarted(state.workContext)
        analytics.trackConversionFunnel('email_collection', 'results')
      }
    }, [state.workContext]),

    emailCollectionCompleted: useCallback(() => {
      if (state.workContext) {
        analytics.trackEmailCollectionCompleted(state.workContext)
      }
    }, [state.workContext]),

    emailCollectionFailed: useCallback((errorType: string) => {
      if (state.workContext) {
        analytics.trackEmailCollectionFailed(state.workContext, errorType)
      }
    }, [state.workContext]),

    // Navigation
    createAnotherPlaylistClicked: useCallback(() => {
      if (state.workContext) {
        analytics.trackCreateAnotherPlaylistClicked(state.workContext)
      }
    }, [state.workContext]),

    discoverNewMusicClicked: useCallback(() => {
      if (state.workContext) {
        analytics.trackDiscoverNewMusicClicked(state.workContext)
      }
    }, [state.workContext]),

    // Session & Timing
    sessionCompleted: useCallback(() => {
      const duration = Math.round((Date.now() - sessionStartRef.current) / 1000)
      const completedSteps = [
        state.selectedPath ? 'path_selection' : '',
        state.workContext ? 'input_collection' : '',
        state.generatedPlaylist ? 'generation' : '',
        state.emailCollected ? 'email_collection' : ''
      ].filter(Boolean)

      analytics.trackSessionDuration(duration, completedSteps)
    }, [state.selectedPath, state.workContext, state.generatedPlaylist, state.emailCollected])
  }

  // 🔄 AUTO-TRACK STEP CHANGES
  useEffect(() => {
    analytics.trackConversionFunnel(state.currentStep)
    startStepTimer(state.currentStep)

    return () => {
      endStepTimer(state.currentStep)
    }
  }, [state.currentStep, startStepTimer, endStepTimer])

  // 📊 AUTO-TRACK URL PARAMETERS ON MOUNT
  useEffect(() => {
    if (state.hasUrlParams && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      analytics.trackPageLoadWithParams({
        context: urlParams.get('context') || undefined,
        mood: urlParams.get('mood') || undefined,
        genres: urlParams.get('genres')?.split(',') || undefined
      })
    }
  }, [state.hasUrlParams])

  // 🔚 AUTO-TRACK SESSION END ON UNMOUNT
  useEffect(() => {
    const handleBeforeUnload = () => {
      track.sessionCompleted()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      track.sessionCompleted()
    }
  }, [track])

  return {
    track,
    analytics: analytics, // Access to raw analytics functions if needed
    startStepTimer,
    endStepTimer
  }
}