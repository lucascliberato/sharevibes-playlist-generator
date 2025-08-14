'use client'

import { useState } from 'react'
import { useApp, useCanProceed, useValidation } from '@/lib/app-context'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MiniMixtapeCard } from '@/components/ui/MiniMixtapeCard'
import { CONTEXT_COPY, CONTEXT_CATEGORIES } from '@/constants'
import type { WorkContext } from '@/types'

export function PrecisePathInput() {
  const { state, actions } = useApp()
  const canProceed = useCanProceed()
  const { validateSeedArtists } = useValidation()
  const [step, setStep] = useState<'artists' | 'context'>('artists')
  const [currentArtist, setCurrentArtist] = useState('')

  // FIXED: Now handles artist names properly
  const handleAddArtist = () => {
    if (currentArtist.trim()) {
      const artistName = currentArtist.trim()
      
      // Check for duplicates
      const isDuplicate = state.seedArtists?.some(
        artist => artist.name.toLowerCase() === artistName.toLowerCase()
      )
      
      if (isDuplicate) {
        actions.setError('This artist is already in your list')
        return
      }
      
      // Create proper artist object
      const seedArtist = {
        name: artistName
      }
      
      actions.clearError()
      actions.addSeedArtist(seedArtist)
      
      // Clear form if successfully added
      if (!state.error) {
        setCurrentArtist('')
      }
    }
  }

  const handleRemoveArtist = (artistName: string) => {
    actions.removeSeedArtist(artistName)
  }

  const handleContextSelect = async (context: WorkContext) => {
    try {
      // 1. Select context
      actions.setWorkContext(context)
      
      // 2. Small delay to ensure state update
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // 3. Validate artists
      const artistValidation = validateSeedArtists(state.seedArtists || [])
      if (!artistValidation.isValid) {
        actions.setError(artistValidation.error!)
        return
      }
      
      // 4. Clear errors and start generation
      actions.clearError()
      actions.startGeneration()
      actions.nextStep()
      
    } catch (error) {
      console.error('Error in context selection:', error)
      actions.setError('Failed to start playlist generation')
    }
  }

  // ARTISTS INPUT STEP
  if (step === 'artists') {
    const currentArtists = state.seedArtists || []
    const canAddMore = currentArtists.length < 3

    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Your 3 favorite artists
          </h2>
          <p className="text-purple-200">
            Add artists you love for highly personalized recommendations (max 3)
          </p>
        </div>

        <Card className="p-6 mb-6 bg-gradient-to-br from-purple-900/50 to-pink-900/30 backdrop-blur-sm border-2 border-purple-500/30">
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Artist name (e.g., Bruce Hornsby, Tom Petty, Mumford & Sons)"
              value={currentArtist}
              onChange={(e) => setCurrentArtist(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddArtist()}
              className="flex-1 bg-black/30 border-purple-500/50 text-white placeholder-purple-300"
              disabled={!canAddMore}
            />
            <Button 
              onClick={handleAddArtist}
              disabled={!currentArtist.trim() || !canAddMore}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50"
            >
              Add Artist
            </Button>
          </div>
          
          {!canAddMore && (
            <p className="text-purple-300 text-sm text-center">
              Maximum 3 artists reached for best results
            </p>
          )}
        </Card>

        {/* Validation Messages */}
        {state.error && (
          <div className="text-center mb-6">
            <div className="text-red-300 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3 inline-block">
              {state.error}
            </div>
          </div>
        )}

        {currentArtists.length > 0 && (
          <div className="space-y-3 mb-8">
            <h3 className="text-white font-medium text-center mb-4">
              Your Artists ({currentArtists.length}/3)
            </h3>
            {currentArtists.map((artist, index) => (
              <Card key={artist.name} className="p-4 bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-sm border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">
                      {index + 1}. {artist.name}
                    </div>
                    <div className="text-purple-300 text-sm">
                      Will find music similar to this artist
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemoveArtist(artist.name)}
                    className="text-red-400 hover:text-red-300 bg-transparent hover:bg-red-900/20 p-2"
                  >
                    ✕
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button 
            onClick={() => setStep('context')}
            disabled={currentArtists.length === 0}
            className="px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50"
          >
            Continue to Context
          </Button>
          
          <p className="text-purple-300 text-sm mt-4">
            {currentArtists.length === 0 
              ? 'Add at least 1 artist to continue'
              : `${currentArtists.length}/3 artists added`
            }
          </p>
        </div>
      </div>
    )
  }

  // CONTEXT SELECTION STEP - Now shows all 10 contexts organized by category
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Based on your musical taste,<br />
          what&apos;s your context?
        </h2>
        <p className="text-purple-200">Choose how you&apos;ll be using this playlist</p>
      </div>

      {/* WORK CONTEXTS */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">
          🏢 {CONTEXT_CATEGORIES.work.title}
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTEXT_CATEGORIES.work.contexts.map((context) => {
            const copy = CONTEXT_COPY[context]
            return (
              <MiniMixtapeCard
                key={context}
                title={copy.title.split(' ').slice(1).join(' ')} // Remove emoji for cleaner look
                subtitle={context.toUpperCase()}
                description={copy.description}
                onClick={() => handleContextSelect(context)}
                variant="purple"
              />
            )
          })}
        </div>
      </div>

      {/* ACTIVITY CONTEXTS */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">
          🎯 {CONTEXT_CATEGORIES.activity.title}
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONTEXT_CATEGORIES.activity.contexts.map((context) => {
            const copy = CONTEXT_COPY[context]
            const variants = ['pink', 'blue', 'green', 'purple'] as const
            const variant = variants[CONTEXT_CATEGORIES.activity.contexts.indexOf(context) % variants.length]
            
            return (
              <MiniMixtapeCard
                key={context}
                title={copy.title.split(' ').slice(1).join(' ')} // Remove emoji
                subtitle={context.toUpperCase()}
                description={copy.description}
                onClick={() => handleContextSelect(context)}
                variant={variant}
              />
            )
          })}
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="text-center mb-6">
          <div className="text-red-300 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3 inline-block">
            {state.error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {state.isGenerating && (
        <div className="text-center">
          <div className="text-purple-300 text-lg">
            🎵 Generating your personalized playlist based on your artists...
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="text-center mt-8">
        <Button 
          onClick={() => setStep('artists')}
          className="text-purple-300 hover:text-white bg-transparent hover:bg-purple-900/20"
        >
          ← Back to Artists
        </Button>
      </div>
    </div>
  )
}