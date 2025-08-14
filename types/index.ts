// EXPANDED User Input Types - Now includes all 10 contexts
export type WorkContext = 
  // Work contexts (original)
  | 'focus' | 'creative' | 'admin' | 'casual'
  // Activity contexts (new)
  | 'dancing' | 'party' | 'workout' | 'study' | 'sleep' | 'drive'

// Context Categories for UI organization
export type WorkContextCategory = 'work' | 'activity'

export type MoodType = 'calm' | 'energetic' | 'ambient' | 'uplifting'

export type GenreType = 'electronic' | 'indie' | 'rock' | 'pop' | 'hip-hop' | 'jazz' | 'folk' | 'alternative' | 'classical' | 'r&b' | 'lo-fi' | 'instrumental' | 'ambient' | 'house' | 'techno' | 'funk' | 'soul' | 'reggae' | 'blues' | 'country'

// Track Types
export interface PlaylistTrack {
  title: string
  artist: string
  albumCover?: string
  spotifyUrl?: string
  youtubeUrl: string
}

// UPDATED - Precise Path now uses artist names instead of track IDs
export interface SeedTrack {
  id: string        // For backward compatibility during transition
  title: string
  artist: string
  albumCover?: string
  spotifyUrl?: string
}

// NEW - Simplified artist interface for fixed Precise Path
export interface SeedArtist {
  name: string
  id?: string      // Optional Spotify artist ID if available
}

// Metadata Types (updated for new backend)
export interface PlaylistMetadata {
  total_found: number
  after_deduplication: number
  final_count: number
  path: 'quick' | 'precise'
  method: 'search_api' | 'fixed_search_api' | 'diverse_search_api'
  diversity_level?: 'high' | 'medium' | 'low'
}

// Validation Types
export interface ValidationResult {
  isValid: boolean
  error: string | null
  warning?: string | null
}

// Context Configuration Type
export interface ContextConfig {
  target_instrumentalness: number
  max_energy: number
  target_danceability: number
}

// Context Copy Type  
export interface ContextCopy {
  title: string
  description: string
  category: WorkContextCategory
}

// UPDATED App State - Now supports both seed tracks and artists
export interface AppState {
  // Navigation
  currentStep: 'path-selection' | 'input-collection' | 'generating' | 'results' | 'email-collection'
  selectedPath: 'quick' | 'precise' | null
  
  // User Inputs
  workContext: WorkContext | null
  selectedMood: MoodType | null
  selectedGenres: GenreType[]
  
  // UPDATED - Precise Path data (supporting both old and new formats during transition)
  seedTracks: SeedTrack[]        // Legacy format (artist names in id field)
  seedArtists: SeedArtist[]      // New format (proper artist names)
  
  // Generation State
  isGenerating: boolean
  generationProgress: number
  estimatedTimeLeft: number
  
  // Results
  generatedPlaylist: PlaylistTrack[] | null
  playlistMetadata: PlaylistMetadata | null
  
  // Email Collection
  showEmailForm: boolean
  emailCollectionLoading: boolean
  emailCollected: boolean
  
  // Error Handling
  error: string | null
  hasUrlParams: boolean
  
  // Counter
  mixtapeCount: number
}

// UPDATED App Actions - Added support for new contexts and artists
export type AppAction = 
  | { type: 'SET_STEP'; payload: AppState['currentStep'] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_PATH'; payload: 'quick' | 'precise' }
  | { type: 'SET_WORK_CONTEXT'; payload: WorkContext }  // Now supports all 10 contexts
  | { type: 'SET_MOOD'; payload: MoodType }
  | { type: 'SET_GENRES'; payload: GenreType[] }
  | { type: 'TOGGLE_GENRE'; payload: GenreType }
  
  // Legacy seed tracks support (for backward compatibility)
  | { type: 'SET_SEED_TRACKS'; payload: SeedTrack[] }
  | { type: 'ADD_SEED_TRACK'; payload: SeedTrack }
  | { type: 'REMOVE_SEED_TRACK'; payload: string }
  
  // NEW - Proper artist support for fixed Precise Path
  | { type: 'SET_SEED_ARTISTS'; payload: SeedArtist[] }
  | { type: 'ADD_SEED_ARTIST'; payload: SeedArtist }
  | { type: 'REMOVE_SEED_ARTIST'; payload: string }
  
  | { type: 'START_GENERATION' }
  | { type: 'UPDATE_PROGRESS'; payload: { progress: number; timeLeft: number } }
  | { type: 'GENERATION_SUCCESS'; payload: { playlist: PlaylistTrack[]; metadata: PlaylistMetadata } }
  | { type: 'GENERATION_ERROR'; payload: { message: string } }
  | { type: 'SHOW_EMAIL_FORM' }
  | { type: 'HIDE_EMAIL_FORM' }
  | { type: 'SET_EMAIL_LOADING'; payload: boolean }
  | { type: 'EMAIL_COLLECTION_SUCCESS'; payload: string }
  | { type: 'EMAIL_COLLECTION_ERROR'; payload: { message: string } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_APP' }
  | { type: 'INCREMENT_MIXTAPE_COUNT' }
  | { type: 'SET_URL_PARAMS_PROCESSED' }
  | { type: 'VALIDATE_CURRENT_STEP' }

// API Request Types for backend integration

// Quick Path Request
export interface QuickPathRequest {
  path: 'quick'
  genres: GenreType[]
  context: ContextConfig
}

// UPDATED - Precise Path Request (now uses artist names)
export interface PrecisePathRequest {
  path: 'precise'
  seed_artists: string[]  // Array of artist names (backend expects this)
  context: ContextConfig
}

// Union type for all playlist requests
export type PlaylistGenerationRequest = QuickPathRequest | PrecisePathRequest

// API Response Types
export interface PlaylistGenerationResponse {
  success: boolean
  message: string
  path: 'quick' | 'precise'
  method: string
  source?: 'post_body' | 'query_parameters'
  playlist: PlaylistTrack[]
  metadata: PlaylistMetadata
  available_contexts?: WorkContext[]
  timestamp: string
}

export interface EmailCollectionRequest {
  email: string
  contextPreference: WorkContext
  playlistData?: {
    playlist: PlaylistTrack[]
    metadata: PlaylistMetadata
  }
}

export interface EmailCollectionResponse {
  success: boolean
  message: string
  brevo_result: {
    success: boolean
    contactId?: number
    message: string
  }
  personalized_url: string
  context_preference: WorkContext
  next_steps: string
  timestamp: string
}

// Error Response Type
export interface ApiErrorResponse {
  success: false
  error: string
  message: string
  timestamp: string
}

// Utility Types
export type PathType = 'quick' | 'precise'
export type StepType = AppState['currentStep']

// Feature Flag Types
export interface FeatureFlags {
  EXPANDED_CONTEXTS: boolean
  PRECISE_PATH_V2: boolean
  CONTEXT_CATEGORIES: boolean
  ANALYTICS: boolean
  EMAIL_VALIDATION: boolean
}

// Loading Message Types
export type LoadingMessageKey = WorkContext | 'generic'
export type LoadingMessages = Record<LoadingMessageKey, string[]>

// Helper Types for Constants
export type ContextConfigs = Record<WorkContext, ContextConfig>
export type ContextCopyMap = Record<WorkContext, ContextCopy>

// Analytics Event Types
export interface AnalyticsEvent {
  event_name: string
  properties: Record<string, any>
  timestamp?: string
}

// Component Prop Types (commonly used)
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface StepComponentProps extends BaseComponentProps {
  onNext?: () => void
  onBack?: () => void
  isValid?: boolean
  isLoading?: boolean
}

// Form Validation Types
export interface FormField {
  value: any
  error: string | null
  touched: boolean
}

export interface FormState {
  [key: string]: FormField
}

// URL Parameter Types (for email campaigns)
export interface UrlParams {
  context?: WorkContext
  mood?: MoodType
  genres?: string
  path?: PathType
}

// Gtag (Google Analytics) Types
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
  }
}