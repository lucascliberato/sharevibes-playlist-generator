'use client'

import { useEffect, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { useVibesAPI } from '@/hooks/use-api'
import { Card } from '@/components/ui/Card'
import { LOADING_MESSAGES } from '@/constants'

export function PlaylistGeneration() {
  const { state } = useApp()
  const api = useVibesAPI()

  const generatePlaylist = useCallback(async () => {
    const success = await api.playlist.generatePlaylist()
    if (!success && api.retry.canRetry) {
      // Auto-retry once after 3 seconds
      setTimeout(() => {
        api.retry.retryLastAction()
      }, 3000)
    }
  }, [api.playlist, api.retry])

  useEffect(() => {
    generatePlaylist()
  }, [generatePlaylist])

  const getRandomMessage = () => {
    return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="p-8 text-center bg-gradient-to-br from-purple-900/50 to-pink-900/30 backdrop-blur-sm border-2 border-purple-500/30">
        {/* Cassette Animation */}
        <div className="mb-8">
          <div className="relative mx-auto w-32 h-20">
            {/* Cassette Body */}
            <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-2xl border-2 border-purple-400">
              {/* Cassette Reels */}
              <div className="flex justify-between items-center h-full px-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600 animate-spin">
                  <div className="w-4 h-4 bg-gray-600 rounded-full mx-auto mt-1" />
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600 animate-spin" style={{ animationDirection: 'reverse' }}>
                  <div className="w-4 h-4 bg-gray-600 rounded-full mx-auto mt-1" />
                </div>
              </div>
              
              {/* Cassette Window */}
              <div className="absolute inset-x-4 top-2 bottom-2 bg-black bg-opacity-40 rounded" />
              
              {/* Cassette Label */}
              <div className="absolute inset-x-2 bottom-1 h-3 bg-white bg-opacity-95 rounded-sm flex items-center justify-center">
                <div className="text-xs font-bold text-purple-800" style={{ fontSize: '8px' }}>
                  sharevibes.app
                </div>
              </div>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-lg opacity-50 -z-10 animate-pulse" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Creating your perfect playlist...
        </h2>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${state.generationProgress}%` }}
            />
          </div>
          <div className="text-purple-200 text-lg font-medium">
            Progress: {state.generationProgress}%
          </div>
        </div>

        {/* Time Remaining */}
        {state.estimatedTimeLeft > 0 && (
          <div className="text-purple-300 mb-6">
            ~{state.estimatedTimeLeft} seconds left...
          </div>
        )}

        {/* Loading Message */}
        <div className="text-purple-200 italic">
          &ldquo;{getRandomMessage()}&rdquo;
        </div>

        {/* Error State */}
        {state.error && (
          <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
            <div className="text-red-300 mb-2">Error: {state.error}</div>
            {api.retry.canRetry && (
              <button
                onClick={() => api.retry.retryLastAction()}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}