import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Validation utilities
export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return {
    isValid: emailRegex.test(email),
    errors: emailRegex.test(email) ? [] : ['Invalid email format']
  }
}

export function validateGenres(genres: string[]) {
  return {
    isValid: genres.length >= 1 && genres.length <= 5,
    warnings: genres.length > 3 ? ['More than 3 genres may reduce accuracy'] : []
  }
}

export function validateSeedTracks(tracks: any[]) {
  return {
    isValid: tracks.length >= 1 && tracks.length <= 3,
    errors: tracks.length === 0 ? ['At least one seed track is required'] : []
  }
}

// String utilities
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Storage utilities
export function saveLastPlaylist(playlist: any[], metadata: any) {
  try {
    const data = {
      playlist,
      metadata,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('vibes_last_playlist', JSON.stringify(data))
  } catch (error) {
    console.warn('Cannot save playlist to localStorage:', error)
  }
}

export function loadLastPlaylist() {
  try {
    const saved = localStorage.getItem('vibes_last_playlist')
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.warn('Cannot load playlist from localStorage:', error)
    return null
  }
}
