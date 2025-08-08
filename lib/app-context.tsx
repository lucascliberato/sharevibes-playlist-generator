'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { AppState, AppAction, WorkContext, MoodType, GenreType, SeedTrack, PlaylistTrack, PlaylistMetadata } from '@/types'

const initialState: AppState = {
  currentStep: 'path-selection',
  selectedPath: null,
  workContext: null,
  selectedMood: null,
  selectedGenres: [],
  seedTracks: [],
  isGenerating: false,
  generationProgress: 0,
  estimatedTimeLeft: 0,
  generatedPlaylist: null,
  playlistMetadata: null,
  showEmailForm: false,
  emailCollectionLoading: false,
  emailCollected: false,
  error: null,
  hasUrlParams: false,
  mixtapeCount: 15
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload, error: null }
    
    case 'NEXT_STEP':
      const stepOrder = ['path-selection', 'input-collection', 'generating', 'results', 'email-collection']
      const currentIndex = stepOrder.indexOf(state.currentStep)
      const nextStep = stepOrder[currentIndex + 1] || state.currentStep
      return { ...state, currentStep: nextStep as any, error: null }
    
    case 'PREV_STEP':
      const prevStepOrder = ['path-selection', 'input-collection', 'generating', 'results', 'email-collection']
      const prevCurrentIndex = prevStepOrder.indexOf(state.currentStep)
      const prevStep = prevStepOrder[prevCurrentIndex - 1] || state.currentStep
      return { ...state, currentStep: prevStep as any, error: null }
    
    case 'SET_PATH':
      return { ...state, selectedPath: action.payload, error: null }
    
    case 'SET_WORK_CONTEXT':
      return { ...state, workContext: action.payload, error: null }
    
    case 'SET_MOOD':
      return { ...state, selectedMood: action.payload, error: null }
    
    case 'SET_GENRES':
      // Validate max 5 genres
      const validatedGenres = action.payload.slice(0, 5)
      return { ...state, selectedGenres: validatedGenres, error: null }
    
    case 'TOGGLE_GENRE':
      const genre = action.payload
      const isSelected = state.selectedGenres.includes(genre)
      
      if (isSelected) {
        // Remove genre
        const newGenres = state.selectedGenres.filter(g => g !== genre)
        return { ...state, selectedGenres: newGenres, error: null }
      } else {
        // Add genre with validation
        if (state.selectedGenres.length >= 5) {
          return { 
            ...state, 
            error: 'Maximum 5 genres allowed. Remove one to add another.' 
          }
        }
        const newGenres = [...state.selectedGenres, genre]
        return { ...state, selectedGenres: newGenres, error: null }
      }
    
    case 'SET_SEED_TRACKS':
      // Validate max 3 seed tracks
      const validatedTracks = action.payload.slice(0, 3)
      return { ...state, seedTracks: validatedTracks, error: null }
    
    case 'ADD_SEED_TRACK':
      // Validate max 3 seed tracks
      if (state.seedTracks.length >= 3) {
        return { 
          ...state, 
          error: 'Maximum 3 seed tracks allowed. Remove one to add another.' 
        }
      }
      
      // Check for duplicate titles/artists
      const isDuplicate = state.seedTracks.some(track => 
        track.title.toLowerCase() === action.payload.title.toLowerCase() &&
        track.artist.toLowerCase() === action.payload.artist.toLowerCase()
      )
      
      if (isDuplicate) {
        return { 
          ...state, 
          error: 'This song is already in your seed tracks.' 
        }
      }
      
      return { 
        ...state, 
        seedTracks: [...state.seedTracks, action.payload],
        error: null 
      }
    
    case 'REMOVE_SEED_TRACK':
      return { 
        ...state, 
        seedTracks: state.seedTracks.filter(track => track.id !== action.payload),
        error: null 
      }
    
    case 'START_GENERATION':
      return { 
        ...state, 
        isGenerating: true, 
        generationProgress: 0,
        estimatedTimeLeft: 20,
        error: null 
      }
    
    case 'UPDATE_PROGRESS':
      return { 
        ...state, 
        generationProgress: Math.min(action.payload.progress, 100),
        estimatedTimeLeft: Math.max(action.payload.timeLeft, 0)
      }
    
    case 'GENERATION_SUCCESS':
      return { 
        ...state, 
        isGenerating: false,
        generationProgress: 100,
        estimatedTimeLeft: 0,
        generatedPlaylist: action.payload.playlist,
        playlistMetadata: action.payload.metadata,
        error: null
      }
    
    case 'GENERATION_ERROR':
      return { 
        ...state, 
        isGenerating: false,
        generationProgress: 0,
        estimatedTimeLeft: 0,
        error: action.payload.message
      }
    
    case 'SHOW_EMAIL_FORM':
      return { ...state, showEmailForm: true }
    
    case 'HIDE_EMAIL_FORM':
      return { ...state, showEmailForm: false }
    
    case 'SET_EMAIL_LOADING':
      return { ...state, emailCollectionLoading: action.payload }
    
    case 'EMAIL_COLLECTION_SUCCESS':
      return { 
        ...state, 
        emailCollectionLoading: false,
        emailCollected: true,
        showEmailForm: false,
        error: null
      }
    
    case 'EMAIL_COLLECTION_ERROR':
      return { 
        ...state, 
        emailCollectionLoading: false,
        error: action.payload.message
      }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    
    case 'RESET_APP':
      // Clear persisted data when resetting
      try {
        localStorage.removeItem('vibes_form_data')
        localStorage.removeItem('vibes_auto_save')
      } catch (error) {
        console.warn('Failed to clear persisted data on reset:', error)
      }
      
      // Preserve mixtape count when resetting
      return { 
        ...initialState, 
        mixtapeCount: state.mixtapeCount,
        hasUrlParams: false 
      }
    
    case 'INCREMENT_MIXTAPE_COUNT':
      const newCount = state.mixtapeCount + 1
      const displayCount = Math.floor(newCount / 5) * 5 + (newCount % 5 === 0 ? 0 : 5)
      return { ...state, mixtapeCount: displayCount }
    
    case 'SET_URL_PARAMS_PROCESSED':
      return { ...state, hasUrlParams: true }
    
    case 'VALIDATE_CURRENT_STEP':
      // Validate current step data and set appropriate errors
      const validation = validateStepData(state)
      return { ...state, error: validation.error }
    
    default:
      return state
  }
}

// Helper function to validate step data
function validateStepData(state: AppState): { isValid: boolean; error: string | null } {
  switch (state.currentStep) {
    case 'path-selection':
      if (!state.selectedPath) {
        return { isValid: false, error: 'Please select a playlist style' }
      }
      break
    
    case 'input-collection':
      if (!state.workContext) {
        return { isValid: false, error: 'Please select your work context' }
      }
      
      if (state.selectedPath === 'quick') {
        if (state.selectedGenres.length === 0) {
          return { isValid: false, error: 'Please select at least 1 genre' }
        }
        if (state.selectedGenres.length > 5) {
          return { isValid: false, error: 'Maximum 5 genres allowed' }
        }
      }
      
      if (state.selectedPath === 'precise') {
        if (state.seedTracks.length === 0) {
          return { isValid: false, error: 'Please add at least 1 seed track' }
        }
        if (state.seedTracks.length > 3) {
          return { isValid: false, error: 'Maximum 3 seed tracks allowed' }
        }
      }
      break
    
    case 'generating':
      if (!state.isGenerating && !state.generatedPlaylist && !state.error) {
        return { isValid: false, error: 'Generation process not started' }
      }
      break
    
    case 'results':
      if (!state.generatedPlaylist) {
        return { isValid: false, error: 'No playlist generated' }
      }
      break
  }
  
  return { isValid: true, error: null }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppState must be used within AppProvider')
  }
  return context.state
}

export function useAppActions() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppActions must be used within AppProvider')
  }

  const { dispatch } = context

  return {
    // Navigation actions
    setStep: (step: AppState['currentStep']) => dispatch({ type: 'SET_STEP', payload: step }),
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    prevStep: () => dispatch({ type: 'PREV_STEP' }),
    
    // Path and context actions
    setPath: (path: 'quick' | 'precise') => dispatch({ type: 'SET_PATH', payload: path }),
    setWorkContext: (context: WorkContext) => dispatch({ type: 'SET_WORK_CONTEXT', payload: context }),
    setMood: (mood: MoodType) => dispatch({ type: 'SET_MOOD', payload: mood }),
    
    // Genre actions (with validation)
    setGenres: (genres: GenreType[]) => dispatch({ type: 'SET_GENRES', payload: genres }),
    toggleGenre: (genre: GenreType) => dispatch({ type: 'TOGGLE_GENRE', payload: genre }),
    
    // Seed track actions (with validation)
    setSeedTracks: (tracks: SeedTrack[]) => dispatch({ type: 'SET_SEED_TRACKS', payload: tracks }),
    addSeedTrack: (track: SeedTrack) => dispatch({ type: 'ADD_SEED_TRACK', payload: track }),
    removeSeedTrack: (id: string) => dispatch({ type: 'REMOVE_SEED_TRACK', payload: id }),
    
    // Generation actions
    startGeneration: () => dispatch({ type: 'START_GENERATION' }),
    updateProgress: (progress: number, timeLeft: number) => dispatch({ type: 'UPDATE_PROGRESS', payload: { progress, timeLeft } }),
    generationSuccess: (playlist: PlaylistTrack[], metadata: PlaylistMetadata) => dispatch({ type: 'GENERATION_SUCCESS', payload: { playlist, metadata } }),
    generationError: (error: { message: string }) => dispatch({ type: 'GENERATION_ERROR', payload: error }),
    
    // Email collection actions
    showEmailForm: () => dispatch({ type: 'SHOW_EMAIL_FORM' }),
    hideEmailForm: () => dispatch({ type: 'HIDE_EMAIL_FORM' }),
    setEmailLoading: (loading: boolean) => dispatch({ type: 'SET_EMAIL_LOADING', payload: loading }),
    emailCollectionSuccess: (email: string) => dispatch({ type: 'EMAIL_COLLECTION_SUCCESS', payload: email }),
    emailCollectionError: (error: { message: string }) => dispatch({ type: 'EMAIL_COLLECTION_ERROR', payload: error }),
    
    // Error handling
    setError: (message: string) => dispatch({ type: 'SET_ERROR', payload: message }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    
    // App lifecycle
    resetApp: () => dispatch({ type: 'RESET_APP' }),
    incrementMixtapeCount: () => dispatch({ type: 'INCREMENT_MIXTAPE_COUNT' }),
    
    // URL params
    setUrlParamsProcessed: () => dispatch({ type: 'SET_URL_PARAMS_PROCESSED' }),
    
    // Validation
    validateCurrentStep: () => dispatch({ type: 'VALIDATE_CURRENT_STEP' })
  }
}

export function useApp() {
  const state = useAppState()
  const actions = useAppActions()
  return { state, actions }
}

export function useCanProceed() {
  const state = useAppState()
  
  switch (state.currentStep) {
    case 'path-selection':
      return !!state.selectedPath
    
    case 'input-collection':
      if (state.selectedPath === 'quick') {
        return !!state.workContext && 
               state.selectedGenres.length > 0 && 
               state.selectedGenres.length <= 5
      } else {
        return !!state.workContext && 
               state.seedTracks.length > 0 && 
               state.seedTracks.length <= 3
      }
    
    case 'generating':
      return false
    
    case 'results':
      return !!state.generatedPlaylist
    
    case 'email-collection':
      return true
    
    default:
      return false
  }
}

// New validation hooks
export function useValidation() {
  const state = useAppState()
  
  const validateGenres = (genres: GenreType[]) => {
    if (genres.length === 0) {
      return { isValid: false, error: 'Please select at least 1 genre', warning: null }
    }
    if (genres.length > 5) {
      return { isValid: false, error: 'Maximum 5 genres allowed', warning: null }
    }
    if (genres.length > 3) {
      return { isValid: true, error: null, warning: 'More than 3 genres may reduce accuracy' }
    }
    return { isValid: true, error: null, warning: null }
  }
  
  const validateSeedTracks = (tracks: SeedTrack[]) => {
    if (tracks.length === 0) {
      return { isValid: false, error: 'Please add at least 1 seed track', warning: null }
    }
    if (tracks.length > 3) {
      return { isValid: false, error: 'Maximum 3 seed tracks allowed', warning: null }
    }
    return { isValid: true, error: null, warning: null }
  }
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return { isValid: false, error: 'Email is required', warning: null }
    }
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address', warning: null }
    }
    return { isValid: true, error: null, warning: null }
  }
  
  return {
    validateGenres,
    validateSeedTracks,
    validateEmail,
    currentStepValidation: validateStepData(state)
  }
}
