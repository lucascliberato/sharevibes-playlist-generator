// User Input Types
export type WorkContext = 'focus' | 'creative' | 'admin' | 'casual'
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

export interface SeedTrack {
  id: string
  title: string
  artist: string
  albumCover?: string
  spotifyUrl?: string
}

// Metadata Types
export interface PlaylistMetadata {
  total_found: number
  after_deduplication: number
  final_count: number
  path: 'quick' | 'precise'
  method: 'search_api'
}

// Validation Types
export interface ValidationResult {
  isValid: boolean
  error: string | null
  warning?: string | null
}

// App State
export interface AppState {
  // Navigation
  currentStep: 'path-selection' | 'input-collection' | 'generating' | 'results' | 'email-collection'
  selectedPath: 'quick' | 'precise' | null
  
  // User Inputs
  workContext: WorkContext | null
  selectedMood: MoodType | null
  selectedGenres: GenreType[]
  seedTracks: SeedTrack[]
  
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

// App Actions
export type AppAction = 
  | { type: 'SET_STEP'; payload: AppState['currentStep'] }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_PATH'; payload: 'quick' | 'precise' }
  | { type: 'SET_WORK_CONTEXT'; payload: WorkContext }
  | { type: 'SET_MOOD'; payload: MoodType }
  | { type: 'SET_GENRES'; payload: GenreType[] }
  | { type: 'TOGGLE_GENRE'; payload: GenreType }
  | { type: 'SET_SEED_TRACKS'; payload: SeedTrack[] }
  | { type: 'ADD_SEED_TRACK'; payload: SeedTrack }
  | { type: 'REMOVE_SEED_TRACK'; payload: string }
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
