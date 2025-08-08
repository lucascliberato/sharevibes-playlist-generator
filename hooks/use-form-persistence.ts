'use client'

import { useEffect } from 'react'
import { useApp } from '@/lib/app-context'
import type { WorkContext, MoodType, GenreType, SeedTrack } from '@/types'

const STORAGE_KEY = 'vibes_form_data'
const STORAGE_VERSION = '1.0'

interface PersistedFormData {
  version: string
  timestamp: string
  selectedPath: 'quick' | 'precise' | null
  workContext: WorkContext | null
  selectedMood: MoodType | null
  selectedGenres: GenreType[]
  seedTracks: SeedTrack[]
  currentStep: string
}

export function useFormPersistence() {
  const { state, actions } = useApp()

  // Save form data to localStorage whenever relevant state changes
  useEffect(() => {
    // Don't persist if we're in generating, results, or email collection steps
    if (['generating', 'results', 'email-collection'].includes(state.currentStep)) {
      return
    }

    // Don't persist if we haven't made any selections yet
    if (!state.selectedPath && !state.workContext && state.selectedGenres.length === 0 && state.seedTracks.length === 0) {
      return
    }

    const formData: PersistedFormData = {
      version: STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      selectedPath: state.selectedPath,
      workContext: state.workContext,
      selectedMood: state.selectedMood,
      selectedGenres: state.selectedGenres,
      seedTracks: state.seedTracks,
      currentStep: state.currentStep
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
      console.log('Form data persisted:', formData)
    } catch (error) {
      console.warn('Failed to persist form data:', error)
    }
  }, [
    state.selectedPath,
    state.workContext,
    state.selectedMood,
    state.selectedGenres,
    state.seedTracks,
    state.currentStep
  ])

  // Load persisted form data on mount
  useEffect(() => {
    // Only load if we haven't processed URL params and we're on the initial step
    if (state.hasUrlParams || state.currentStep !== 'path-selection') {
      return
    }

    loadPersistedData()
  }, []) // Only run once on mount

  const loadPersistedData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return

      const formData: PersistedFormData = JSON.parse(stored)
      
      // Check version compatibility
      if (formData.version !== STORAGE_VERSION) {
        console.log('Form data version mismatch, clearing storage')
        clearPersistedData()
        return
      }

      // Check if data is not too old (24 hours)
      const dataAge = Date.now() - new Date(formData.timestamp).getTime()
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      
      if (dataAge > maxAge) {
        console.log('Form data too old, clearing storage')
        clearPersistedData()
        return
      }

      // Check if we have meaningful data to restore
      const hasData = formData.selectedPath || 
                     formData.workContext || 
                     formData.selectedGenres.length > 0 || 
                     formData.seedTracks.length > 0

      if (!hasData) return

      console.log('Restoring form data:', formData)

      // Restore form data
      if (formData.selectedPath) {
        actions.setPath(formData.selectedPath)
      }
      if (formData.workContext) {
        actions.setWorkContext(formData.workContext)
      }
      if (formData.selectedMood) {
        actions.setMood(formData.selectedMood)
      }
      if (formData.selectedGenres.length > 0) {
        actions.setGenres(formData.selectedGenres)
      }
      if (formData.seedTracks.length > 0) {
        actions.setSeedTracks(formData.seedTracks)
      }

      // Navigate to appropriate step
      if (formData.currentStep && formData.currentStep !== 'path-selection') {
        actions.setStep(formData.currentStep as any)
      }

      // Show restoration notification
      showRestorationNotification()

    } catch (error) {
      console.warn('Failed to load persisted form data:', error)
      clearPersistedData()
    }
  }

  const clearPersistedData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      console.log('Form data cleared from storage')
    } catch (error) {
      console.warn('Failed to clear persisted data:', error)
    }
  }

  const showRestorationNotification = () => {
    // Create a temporary notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in'
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
        <span class="text-sm">Form data restored from previous session</span>
      </div>
    `
    
    document.body.appendChild(notification)
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  const hasPersistedData = (): boolean => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return false

      const formData: PersistedFormData = JSON.parse(stored)
      return !!(formData.selectedPath || formData.workContext || 
               formData.selectedGenres.length > 0 || formData.seedTracks.length > 0)
    } catch {
      return false
    }
  }

  const getPersistedDataAge = (): number | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const formData: PersistedFormData = JSON.parse(stored)
      return Date.now() - new Date(formData.timestamp).getTime()
    } catch {
      return null
    }
  }

  return {
    loadPersistedData,
    clearPersistedData,
    hasPersistedData,
    getPersistedDataAge
  }
}
