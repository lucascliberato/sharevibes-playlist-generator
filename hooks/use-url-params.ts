'use client'

import { useEffect } from 'react'
import { useApp } from '@/lib/app-context'
import type { WorkContext, GenreType, MoodType } from '@/types'
import { AVAILABLE_GENRES } from '@/constants'

export function useUrlParams() {
  const { state, actions } = useApp()

  useEffect(() => {
    // Only process URL params once on mount
    if (state.hasUrlParams) return

    const urlParams = new URLSearchParams(window.location.search)
    
    // Check if we have any relevant parameters
    const hasRelevantParams = urlParams.has('context') || 
                             urlParams.has('genres') || 
                             urlParams.has('mood') || 
                             urlParams.has('path') ||
                             urlParams.has('campaign') ||
                             urlParams.has('auto')

    if (!hasRelevantParams) return

    console.log('Processing URL parameters:', Object.fromEntries(urlParams.entries()))

    try {
      handleUrlParams(urlParams)
    } catch (error) {
      console.error('Error processing URL parameters:', error)
      // Don't break the app if URL params are malformed
    }
  }, []) // Only run once on mount

  const handleUrlParams = (urlParams: URLSearchParams) => {
    let shouldAutoGenerate = false
    let pathSet = false

    // 1. Campaign tracking
    const campaign = urlParams.get('campaign')
    const source = urlParams.get('source') || urlParams.get('utm_source')
    const medium = urlParams.get('medium') || urlParams.get('utm_medium')
    
    if (campaign || source) {
      console.log('Campaign detected:', { campaign, source, medium })
      // Store campaign data for analytics
      sessionStorage.setItem('campaign_data', JSON.stringify({
        campaign,
        source,
        medium,
        timestamp: new Date().toISOString()
      }))
    }

    // 2. Path selection
    const path = urlParams.get('path')
    if (path === 'quick' || path === 'precise') {
      actions.setPath(path)
      pathSet = true
      console.log('Path set from URL:', path)
    }

    // 3. Work context
    const context = urlParams.get('context')
    if (context && ['focus', 'creative', 'admin', 'casual'].includes(context)) {
      actions.setWorkContext(context as WorkContext)
      console.log('Context set from URL:', context)
    }

    // 4. Mood selection
    const mood = urlParams.get('mood')
    if (mood && ['calm', 'energetic', 'ambient', 'uplifting'].includes(mood)) {
      actions.setMood(mood as MoodType)
      console.log('Mood set from URL:', mood)
    }

    // 5. Genres (comma-separated)
    const genresParam = urlParams.get('genres')
    if (genresParam) {
      const genres = genresParam.split(',')
        .map(g => g.trim().toLowerCase())
        .filter(g => AVAILABLE_GENRES.includes(g as GenreType))
        .slice(0, 5) // Max 5 genres
      
      if (genres.length > 0) {
        actions.setGenres(genres as GenreType[])
        console.log('Genres set from URL:', genres)
      }
    }

    // 6. Seed tracks (for precise path)
    const seedTracks = urlParams.get('seeds')
    if (seedTracks && path === 'precise') {
      try {
        const tracks = JSON.parse(decodeURIComponent(seedTracks))
        if (Array.isArray(tracks) && tracks.length > 0) {
          const validTracks = tracks
            .filter(track => track.title && track.artist)
            .slice(0, 3) // Max 3 seed tracks
            .map((track, index) => ({
              id: `url_seed_${index}`,
              title: track.title,
              artist: track.artist
            }))
          
          if (validTracks.length > 0) {
            actions.setSeedTracks(validTracks)
            console.log('Seed tracks set from URL:', validTracks)
          }
        }
      } catch (error) {
        console.warn('Invalid seed tracks format in URL:', error)
      }
    }

    // 7. Auto-generation flag
    const autoGenerate = urlParams.get('auto')
    if (autoGenerate === 'true' || autoGenerate === '1') {
      shouldAutoGenerate = true
    }

    // 8. Email pre-fill
    const email = urlParams.get('email')
    if (email && email.includes('@')) {
      sessionStorage.setItem('prefill_email', email)
      console.log('Email prefill stored:', email)
    }

    // Mark that we've processed URL params
    actions.setUrlParamsProcessed()

    // Auto-generate playlist if conditions are met
    if (shouldAutoGenerate && canAutoGenerate()) {
      console.log('Auto-generating playlist from URL params')
      setTimeout(() => {
        autoGeneratePlaylist()
      }, 1000) // Small delay to ensure state is updated
    } else if (pathSet || context || genresParam) {
      // Navigate to appropriate step based on what was provided
      navigateToAppropriateStep()
    }
  }

  const canAutoGenerate = (): boolean => {
    // For quick path: need path, context, and at least one genre
    if (state.selectedPath === 'quick') {
      return !!(state.selectedPath && state.workContext && state.selectedGenres.length > 0)
    }
    
    // For precise path: need path, context, and at least one seed track
    if (state.selectedPath === 'precise') {
      return !!(state.selectedPath && state.workContext && state.seedTracks.length > 0)
    }

    return false
  }

  const autoGeneratePlaylist = () => {
    if (canAutoGenerate()) {
      actions.setStep('generating')
      actions.startGeneration()
    }
  }

  const navigateToAppropriateStep = () => {
    // If we have a path but missing required data, go to input collection
    if (state.selectedPath && !canAutoGenerate()) {
      actions.setStep('input-collection')
      return
    }

    // If we have some data but no path, stay on path selection
    if (!state.selectedPath) {
      actions.setStep('path-selection')
      return
    }
  }

  const getCampaignData = () => {
    try {
      const stored = sessionStorage.getItem('campaign_data')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  const getPrefillEmail = () => {
    return sessionStorage.getItem('prefill_email') || ''
  }

  const clearUrlData = () => {
    sessionStorage.removeItem('campaign_data')
    sessionStorage.removeItem('prefill_email')
  }

  return {
    getCampaignData,
    getPrefillEmail,
    clearUrlData,
    canAutoGenerate: canAutoGenerate()
  }
}
