'use client'

import { useEffect, useCallback } from 'react'
import { useApp } from '@/lib/app-context'
import { useVibesAPI } from '@/hooks/use-api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LOADING_MESSAGES } from '@/constants'

export function PlaylistGeneration() {
  const { state, actions } = useApp()
  const api = useVibesAPI()

  const generatePlaylist = useCallback(async () => {
    console.log('🎵 generatePlaylist called')
    console.log('📊 Current state:', {
      isGenerating: state.isGenerating,
      hasPlaylist: !!state.generatedPlaylist,
      hasError: !!state.error,
      currentStep: state.currentStep,
      selectedPath: state.selectedPath,
      workContext: state.workContext,
      genresCount: state.selectedGenres.length,
      seedTracksCount: state.seedTracks.length
    })
    
    try {
      console.log('🔄 Starting API call...')
      const success = await api.playlist.generatePlaylist()
      console.log('📋 API call result:', success)
      
      if (success) {
        console.log('✅ Success! Should navigate to results')
      } else {
        console.log('❌ Failed! Should show error state')
      }
    } catch (error) {
      console.error('💥 Exception in generatePlaylist:', error)
    }
  }, [api, state])

  // Log when component mounts/unmounts
  useEffect(() => {
    console.log('🏗️ PlaylistGeneration component mounted')
    console.log('📊 Initial state:', {
      currentStep: state.currentStep,
      isGenerating: state.isGenerating,
      hasPlaylist: !!state.generatedPlaylist,
      hasError: !!state.error
    })

    return () => {
      console.log('🧹 PlaylistGeneration component unmounting')
    }
  }, [])

  // Main effect to start generation
  useEffect(() => {
    console.log('🔄 Main effect triggered with state:', {
      currentStep: state.currentStep,
      isGenerating: state.isGenerating,
      hasPlaylist: !!state.generatedPlaylist,
      hasError: !!state.error
    })

    // Only start generation if conditions are met
    if (!state.isGenerating && !state.generatedPlaylist && !state.error) {
      console.log('✅ Conditions met, starting generation...')
      generatePlaylist()
    } else {
      console.log('⏸️ Conditions NOT met for generation:', {
        reasonIsGenerating: state.isGenerating,
        reasonHasPlaylist: !!state.generatedPlaylist,
        reasonHasError: !!state.error
      })
    }
  }, [generatePlaylist, state.isGenerating, state.generatedPlaylist, state.error])

  // Effect to handle navigation after success
  useEffect(() => {
    if (state.generatedPlaylist && state.currentStep === 'generating') {
      console.log('🎯 Playlist ready, navigating to results...')
      actions.setStep('results')
    }
  }, [state.generatedPlaylist, state.currentStep, actions])

  // Log state changes
  useEffect(() => {
    console.log('📊 State change detected:', {
      currentStep: state.currentStep,
      isGenerating: state.isGenerating,
      progress: state.generationProgress,
      timeLeft: state.estimatedTimeLeft,
      error: state.error,
      hasPlaylist: !!state.generatedPlaylist
    })
  }, [state.currentStep, state.isGenerating, state.generationProgress, state.error, state.generatedPlaylist])

  const handleRetry = () => {
    console.log('🔄 Manual retry triggered')
    actions.clearError()
    generatePlaylist()
  }

  const handleGoBack = () => {
    console.log('⬅️ Go back triggered')
    actions.clearError()
    actions.prevStep()
  }

  const getRandomMessage = () => {
    return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="p-8 text-center bg-gradient-to-br from-purple-900/50 to-pink-900/30 backdrop-blur-sm border-2 border-purple-500/30">
        {/* Debug Panel */}
        <div className="mb-6 p-4 bg-black/30 rounded text-left text-xs text-green-400 font-mono">
          <div className="text-green-300 font-bold mb-2">🔍 DEBUG INFO</div>
          <div>Current Step: {state.currentStep}</div>
          <div>Is Generating: {state.isGenerating ? 'YES' : 'NO'}</div>
          <div>Progress: {state.generationProgress}%</div>
          <div>Time Left: {state.estimatedTimeLeft}s</div>
          <div>Has Playlist: {state.generatedPlaylist ? 'YES' : 'NO'}</div>
          <div>Has Error: {state.error ? 'YES' : 'NO'}</div>
          <div>Error Message: {state.error || 'None'}</div>
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
              
              {state.error.includes('ECONNRESET') && (
                <div className="text-red-200 text-sm text-left">
                  <strong>🔧 Possible solutions:</strong>
                  <ul className="list-disc list-inside mt-2">
                    <li>Check if Spotify credentials are valid</li>
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

              <Button
                onClick={() => {
                  console.log('🧪 Manual generation test')
                  actions.startGeneration()
                }}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black text-sm"
              >
                🧪 Test Start
              </Button>
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
          </>
        ) : (
          // INITIAL STATE (should trigger generation)
          <>
            <h2 className="text-3xl font-bold text-yellow-300 mb-4">
              Initializing generation... ⚡
            </h2>
            
            <div className="mb-6 text-yellow-200">
              Setting up your playlist generation...
            </div>

            <Button
              onClick={() => {
                console.log('🚀 Manual start generation')
                actions.startGeneration()
                generatePlaylist()
              }}
              className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500"
            >
              🚀 Start Generation Manually
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}