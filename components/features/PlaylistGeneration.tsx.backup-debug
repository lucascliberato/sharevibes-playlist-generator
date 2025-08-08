'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useApp } from '@/lib/app-context'
import { useVibesAPI } from '@/hooks/use-api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LOADING_MESSAGES } from '@/constants'

export function PlaylistGeneration() {
  const { state, actions } = useApp()
  const api = useVibesAPI()
  const hasStartedGeneration = useRef(false)

  const generatePlaylist = useCallback(async () => {
    console.log('🎵 generatePlaylist called from component')
    
    // Mark that we've started to prevent duplicate calls
    hasStartedGeneration.current = true
    
    const success = await api.playlist.generatePlaylist()
    
    if (success) {
      console.log('✅ API returned success, playlist should be in state now')
      // Navigation will be handled by useEffect below
    } else {
      console.log('❌ API returned failure, allowing retry')
      hasStartedGeneration.current = false // Allow retry
    }
  }, [api.playlist])

  // FIXED: Start generation when component mounts AND isGenerating is true but not started yet
  useEffect(() => {
    console.log('🏗️ PlaylistGeneration mounted, checking if should start generation')
    console.log('📊 Mount state:', {
      currentStep: state.currentStep,
      isGenerating: state.isGenerating,
      hasPlaylist: !!state.generatedPlaylist,
      hasError: !!state.error,
      hasStartedGeneration: hasStartedGeneration.current
    })

    // FIXED LOGIC: Start generation if we're generating but haven't actually started the API call
    const shouldStartGeneration = 
      state.currentStep === 'generating' && 
      state.isGenerating && 
      !state.generatedPlaylist && 
      !state.error && 
      !hasStartedGeneration.current

    if (shouldStartGeneration) {
      console.log('✅ Starting generation - conditions met!')
      generatePlaylist()
    } else {
      console.log('⏸️ Not starting generation:', {
        wrongStep: state.currentStep !== 'generating',
        notGenerating: !state.isGenerating,
        hasPlaylist: !!state.generatedPlaylist,
        hasError: !!state.error,
        alreadyStarted: hasStartedGeneration.current
      })
    }
  }, [state.currentStep, state.isGenerating, state.generatedPlaylist, state.error, generatePlaylist])

  // Effect to navigate to results when playlist is ready
  useEffect(() => {
    if (state.generatedPlaylist && state.currentStep === 'generating') {
      console.log('🎯 Playlist ready, navigating to results...')
      setTimeout(() => {
        actions.setStep('results')
      }, 1000) // Small delay to show 100% completion
    }
  }, [state.generatedPlaylist, state.currentStep, actions])

  // Reset the generation flag if we navigate away and back
  useEffect(() => {
    if (state.currentStep !== 'generating') {
      hasStartedGeneration.current = false
    }
  }, [state.currentStep])

  const handleRetry = () => {
    console.log('🔄 Manual retry triggered')
    hasStartedGeneration.current = false
    actions.clearError()
    actions.startGeneration() // This will trigger the useEffect above
  }

  const handleGoBack = () => {
    console.log('⬅️ Go back triggered')
    hasStartedGeneration.current = false
    actions.clearError()
    actions.prevStep()
  }

  const getRandomMessage = () => {
    return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="p-8 text-center bg-gradient-to-br from-purple-900/50 to-pink-900/30 backdrop-blur-sm border-2 border-purple-500/30">
        
        {/* Debug Panel - Temporary */}
        <div className="mb-6 p-4 bg-black/30 rounded text-left text-xs text-green-400 font-mono">
          <div className="text-green-300 font-bold mb-2">🔍 DEBUG INFO</div>
          <div>Current Step: {state.currentStep}</div>
          <div>Is Generating: {state.isGenerating ? 'YES' : 'NO'}</div>
          <div>Progress: {state.generationProgress}%</div>
          <div>Time Left: {state.estimatedTimeLeft}s</div>
          <div>Has Playlist: {state.generatedPlaylist ? 'YES' : 'NO'}</div>
          <div>Has Error: {state.error ? 'YES' : 'NO'}</div>
          <div>Error Message: {state.error || 'None'}</div>
          <div>Has Started Generation: {hasStartedGeneration.current ? 'YES' : 'NO'}</div>
          <div>Can Retry: {api.retry?.canRetry ? 'YES' : 'NO'}</div>
          <div>Selected Path: {state.selectedPath}</div>
          <div>Work Context: {state.workContext}</div>
          <div>Genres: {state.selectedGenres.join(', ') || 'None'}</div>
          <div>Seed Tracks: {state.seedTracks.length}</div>
        </div>

        {/* Cassette Animation */}
        <div className="mb-8">
          <div className="relative mx-auto w-32 h-20">
            <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-2xl border-2 border-purple-400">
              <div className="flex justify-between items-center h-full px-4">
                <div className={`w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600 ${state.isGenerating ? 'animate-spin' : ''}`}>
                  <div className="w-4 h-4 bg-gray-600 rounded-full mx-auto mt-1" />
                </div>
                <div className={`w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600 ${state.isGenerating ? 'animate-spin' : ''}`} style={{ animationDirection: 'reverse' }}>
                  <div className="w-4 h-4 bg-gray-600 rounded-full mx-auto mt-1" />
                </div>
              </div>
              <div className="absolute inset-x-4 top-2 bottom-2 bg-black bg-opacity-40 rounded" />
              <div className="absolute inset-x-2 bottom-1 h-3 bg-white bg-opacity-95 rounded-sm flex items-center justify-center">
                <div className="text-xs font-bold text-purple-800" style={{ fontSize: '8px' }}>
                  sharevibes.app
                </div>
              </div>
            </div>
            <div className={`absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-lg opacity-50 -z-10 ${state.isGenerating ? 'animate-pulse' : ''}`} />
          </div>
        </div>

        {/* Dynamic Content */}
        {state.error ? (
          // ERROR STATE
          <>
            <h2 className="text-3xl font-bold text-red-300 mb-4">
              Houston, we have a problem! 🚨
            </h2>
            
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <div className="text-red-200 mb-2 font-medium">Error Details:</div>
              <div className="text-red-300 text-sm mb-4">{state.error}</div>
              
              {(state.error.includes('ECONNRESET') || state.error.includes('Failed to fetch') || state.error.includes('Network error')) && (
                <div className="text-red-200 text-sm text-left">
                  <strong>🔧 Possible solutions:</strong>
                  <ul className="list-disc list-inside mt-2">
                    <li>Check if Spotify credentials are updated</li>
                    <li>Wait a moment and try again</li>
                    <li>Check your internet connection</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={handleRetry}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
              >
                🔄 Try Again
              </Button>
              
              <Button
                onClick={handleGoBack}
                className="px-6 py-3 bg-transparent border border-purple-500 text-purple-300 hover:bg-purple-900/30"
              >
                ⬅️ Go Back
              </Button>

              {api.retry?.canRetry && (
                <Button
                  onClick={() => api.retry.retryLastAction()}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black text-sm"
                >
                  🔄 API Retry
                </Button>
              )}
            </div>
          </>
        ) : state.isGenerating ? (
          // LOADING STATE
          <>
            <h2 className="text-3xl font-bold text-white mb-4">
              Creating your perfect playlist... 🎵
            </h2>

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

            {state.estimatedTimeLeft > 0 && (
              <div className="text-purple-300 mb-6">
                ~{state.estimatedTimeLeft} seconds left...
              </div>
            )}

            <div className="text-purple-200 italic">
              &ldquo;{getRandomMessage()}&rdquo;
            </div>

            {/* Force Start Button for debugging */}
            <div className="mt-6">
              <Button
                onClick={() => {
                  console.log('🚀 Force start generation')
                  hasStartedGeneration.current = false
                  generatePlaylist()
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm"
              >
                🚀 Force Start (Debug)
              </Button>
            </div>
          </>
        ) : (
          // INITIAL STATE (should start generation)
          <>
            <h2 className="text-3xl font-bold text-yellow-300 mb-4">
              Preparing your playlist... ⚡
            </h2>
            
            <div className="mb-6 text-yellow-200">
              Ready to generate your perfect mix...
            </div>

            <Button
              onClick={() => {
                console.log('🚀 Manual start generation')
                actions.startGeneration()
              }}
              className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500"
            >
              🚀 Start Generation
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}