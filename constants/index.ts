import type { WorkContext, GenreType } from '@/types'

// EXPANDED Context Configurations - Now includes activity-based contexts
export const CONTEXT_CONFIGS = {
  // WORK CONTEXTS (Original)
  'focus': {
    target_instrumentalness: 0.7,
    max_energy: 0.5,
    target_danceability: 0.4
  },
  'creative': {
    target_instrumentalness: 0.4,
    max_energy: 0.7,
    target_danceability: 0.6
  },
  'admin': {
    target_instrumentalness: 0.3,
    max_energy: 0.6,
    target_danceability: 0.7
  },
  'casual': {
    target_instrumentalness: 0.5,
    max_energy: 0.5,
    target_danceability: 0.5
  },
  
  // ACTIVITY CONTEXTS (New)
  'dancing': {
    target_instrumentalness: 0.1,
    max_energy: 0.9,
    target_danceability: 0.9
  },
  'party': {
    target_instrumentalness: 0.2,
    max_energy: 0.8,
    target_danceability: 0.8
  },
  'workout': {
    target_instrumentalness: 0.3,
    max_energy: 0.9,
    target_danceability: 0.7
  },
  'study': {
    target_instrumentalness: 0.8,
    max_energy: 0.3,
    target_danceability: 0.2
  },
  'sleep': {
    target_instrumentalness: 0.9,
    max_energy: 0.1,
    target_danceability: 0.1
  },
  'drive': {
    target_instrumentalness: 0.4,
    max_energy: 0.6,
    target_danceability: 0.6
  }
} as const

// Available Genres (unchanged)
export const AVAILABLE_GENRES: GenreType[] = [
  'electronic', 'indie', 'rock', 'pop', 'hip-hop', 'jazz', 'folk', 
  'alternative', 'classical', 'r&b', 'lo-fi', 'instrumental', 
  'ambient', 'house', 'techno', 'funk', 'soul', 'reggae', 'blues', 'country'
]

// Popular Genres (unchanged for now)
export const POPULAR_GENRES: GenreType[] = [
  'electronic', 'indie', 'pop', 'rock', 'hip-hop', 'jazz', 'folk', 'alternative'
]

// EXPANDED Context Copy - Work + Activity contexts
export const CONTEXT_COPY = {
  // WORK CONTEXTS
  focus: {
    title: "🧠 Deep Focus",
    description: "Coding, writing, analysis",
    category: "work"
  },
  creative: {
    title: "🎨 Creative Work", 
    description: "Design, brainstorm, ideation",
    category: "work"
  },
  admin: {
    title: "📧 Admin Tasks",
    description: "Emails, planning, organizing",
    category: "work"
  },
  casual: {
    title: "🌐 Casual Browsing",
    description: "Research, reading, light work",
    category: "work"
  },
  
  // ACTIVITY CONTEXTS (New)
  dancing: {
    title: "💃 Dancing",
    description: "High energy beats to move to",
    category: "activity"
  },
  party: {
    title: "🎉 Party",
    description: "Upbeat vibes for celebrations",
    category: "activity"
  },
  workout: {
    title: "🏋️ Workout",
    description: "Motivating beats for exercise",
    category: "activity"
  },
  study: {
    title: "📚 Study",
    description: "Calm focus for learning",
    category: "activity"
  },
  sleep: {
    title: "😴 Sleep",
    description: "Peaceful sounds for rest",
    category: "activity"
  },
  drive: {
    title: "🚗 Drive",
    description: "Road trip soundtrack",
    category: "activity"
  }
} as const

// Context Categories for UI organization
export const CONTEXT_CATEGORIES = {
  work: {
    title: "Work & Focus",
    contexts: ['focus', 'creative', 'admin', 'casual'] as const
  },
  activity: {
    title: "Lifestyle & Activities", 
    contexts: ['dancing', 'party', 'workout', 'study', 'sleep', 'drive'] as const
  }
} as const

// EXPANDED Loading Messages - Context-aware
export const LOADING_MESSAGES = {
  // Work contexts
  focus: [
    "ShareVibes is finding that perfect focus flow...",
    "Curating instrumental beats for deep concentration...",
    "Building your productivity soundtrack with ShareVibes...",
    "Finding the sweet spot between calm and energizing..."
  ],
  creative: [
    "ShareVibes is sparking your creative energy...",
    "Mixing inspiration with the perfect creative vibe...",
    "Crafting beats that unlock your imagination...",
    "Your creative flow is taking shape with ShareVibes..."
  ],
  admin: [
    "ShareVibes is making admin tasks more enjoyable...",
    "Finding upbeat tracks to power through your to-do list...",
    "Adding some groove to your organizing session...",
    "Your productivity playlist is almost ready..."
  ],
  casual: [
    "ShareVibes is curating your perfect background vibe...",
    "Finding the ideal soundtrack for browsing and reading...",
    "Creating a chill atmosphere for your downtime...",
    "Your casual listening experience is brewing..."
  ],
  
  // Activity contexts
  dancing: [
    "ShareVibes is finding beats that make you move...",
    "Curating high-energy dance floor anthems...",
    "Building your ultimate dance party playlist...",
    "These tracks are going to get you grooving..."
  ],
  party: [
    "ShareVibes is bringing the party energy...",
    "Mixing crowd-pleasers and hidden gems...",
    "Your celebration soundtrack is taking shape...",
    "Getting ready to turn up the good vibes..."
  ],
  workout: [
    "ShareVibes is finding your workout motivation...",
    "Curating high-intensity tracks for maximum energy...",
    "Building beats that push you harder...",
    "Your gym playlist is about to level up..."
  ],
  study: [
    "ShareVibes is creating your focus sanctuary...",
    "Finding calm, concentration-friendly tracks...",
    "Building the perfect studying atmosphere...",
    "Your learning soundtrack is almost ready..."
  ],
  sleep: [
    "ShareVibes is crafting peaceful vibes for rest...",
    "Finding the most calming, dreamy tracks...",
    "Creating your perfect sleep sanctuary...",
    "Sweet dreams are being carefully curated..."
  ],
  drive: [
    "ShareVibes is building your road trip soundtrack...",
    "Finding tracks perfect for the open road...",
    "Curating your ultimate driving experience...",
    "Your highway playlist is taking shape..."
  ],
  
  // Generic fallbacks
  generic: [
    "ShareVibes is finding that perfect vibe...",
    "Discovering hidden musical gems with ShareVibes...",
    "Your personalized mixtape is taking shape...",
    "Almost ready - ShareVibes is adding final touches..."
  ]
} as const

// Error Messages (expanded)
export const ERROR_MESSAGES = {
  GENERATION_FAILED: "Failed to generate playlist. Please try again.",
  EMAIL_INVALID: "Please enter a valid email address",
  EMAIL_COLLECTION_FAILED: "Failed to collect email. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  INVALID_CONTEXT: "Please select a valid context for your playlist",
  NO_GENRES_SELECTED: "Please select at least one genre",
  TOO_MANY_GENRES: "Please select no more than 5 genres",
  NO_ARTISTS_PROVIDED: "Please provide at least one artist for the Precise Path",
  TOO_MANY_ARTISTS: "Please provide no more than 3 artists for best results"
} as const

// UPDATED Validation Config - Now supports both paths properly
export const VALIDATION_CONFIG = {
  // Genre validation (Quick Path)
  MAX_GENRES: 5,
  MIN_GENRES: 1,
  
  // Artist validation (Precise Path) - UPDATED for new backend
  MAX_SEED_ARTISTS: 3,
  MIN_SEED_ARTISTS: 1,
  
  // Deprecated (kept for backward compatibility during transition)
  MAX_SEED_TRACKS: 3,
  MIN_SEED_TRACKS: 1,
  
  // Email validation
  EMAIL_MIN_LENGTH: 5,
  EMAIL_MAX_LENGTH: 254
} as const

// Path Configuration
export const PATH_CONFIG = {
  quick: {
    title: "🚀 Quick Path",
    subtitle: "30 seconds",
    description: "Choose genres + context for instant results",
    estimatedTime: 20
  },
  precise: {
    title: "🎯 Precise Path", 
    subtitle: "60 seconds",
    description: "Add your favorite artists for personalized magic",
    estimatedTime: 25
  }
} as const

// API Configuration
export const API_CONFIG = {
  GENERATION_TIMEOUT: 30000, // 30 seconds
  EMAIL_COLLECTION_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000 // 2 seconds
} as const

// SEO Configuration
export const SEO_CONFIG = {
  SITE_NAME: "ShareVibes - Playlist Generator",
  SITE_DESCRIPTION: "Generate personalized playlists for work, focus, dancing, parties and more. Your perfect mixtape in 30 seconds.",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://playlistgen.co",
  TWITTER_HANDLE: "@lucascliberato",
  OG_IMAGE: "/og-image.png"
} as const

// Feature Flags (for progressive rollout)
export const FEATURE_FLAGS = {
  EXPANDED_CONTEXTS: true, // Enable new activity contexts
  PRECISE_PATH_V2: true,   // Enable fixed Precise Path
  CONTEXT_CATEGORIES: true, // Enable categorized context UI
  ANALYTICS: true,         // Enable analytics tracking
  EMAIL_VALIDATION: true   // Enable enhanced email validation
} as const

// Helper functions for context management
export const getContextsByCategory = (category: 'work' | 'activity') => {
  return CONTEXT_CATEGORIES[category].contexts
}

export const getAllContexts = () => {
  return Object.keys(CONTEXT_COPY) as WorkContext[]
}

export const getRandomLoadingMessage = (context?: WorkContext) => {
  if (context && LOADING_MESSAGES[context]) {
    const messages = LOADING_MESSAGES[context]
    return messages[Math.floor(Math.random() * messages.length)]
  }
  
  const genericMessages = LOADING_MESSAGES.generic
  return genericMessages[Math.floor(Math.random() * genericMessages.length)]
}