'use client'

import { useEffect, useRef } from 'react'
import { useApp } from '@/lib/app-context'

const AUTO_SAVE_DELAY = 2000 // 2 seconds

export function useAutoSave() {
  const { state } = useApp()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null) // ✅ CORRIGIDO: Valor inicial
  const lastSavedRef = useRef<string>('')

  useEffect(() => {
    // Create a snapshot of current form state
    const currentState = {
      selectedPath: state.selectedPath,
      workContext: state.workContext,
      selectedMood: state.selectedMood,
      selectedGenres: state.selectedGenres,
      seedTracks: state.seedTracks,
      currentStep: state.currentStep
    }

    const stateString = JSON.stringify(currentState)
    
    // Only save if state has actually changed
    if (stateString === lastSavedRef.current) {
      return
    }

    // Don't auto-save during certain steps
    if (['generating', 'results', 'email-collection'].includes(state.currentStep)) {
      return
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      try {
        const autoSaveData = {
          ...currentState,
          timestamp: new Date().toISOString(),
          autoSaved: true
        }

        localStorage.setItem('vibes_auto_save', JSON.stringify(autoSaveData))
        lastSavedRef.current = stateString
        
        // Show subtle save indicator
        showSaveIndicator()
      } catch (error) {
        console.warn('Auto-save failed:', error)
      }
    }, AUTO_SAVE_DELAY)

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [
    state.selectedPath,
    state.workContext,
    state.selectedMood,
    state.selectedGenres,
    state.seedTracks,
    state.currentStep
  ])

  const showSaveIndicator = () => {
    // Create subtle save indicator
    const indicator = document.createElement('div')
    indicator.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-3 py-1 rounded text-xs opacity-0 transition-opacity z-50'
    indicator.textContent = 'Saved'
    
    document.body.appendChild(indicator)
    
    // Fade in
    setTimeout(() => {
      indicator.style.opacity = '1'
    }, 10)
    
    // Fade out and remove
    setTimeout(() => {
      indicator.style.opacity = '0'
      setTimeout(() => {
        indicator.remove()
      }, 300)
    }, 1500)
  }

  const clearAutoSave = () => {
    try {
      localStorage.removeItem('vibes_auto_save')
    } catch (error) {
      console.warn('Failed to clear auto-save:', error)
    }
  }

  return {
    clearAutoSave
  }
}