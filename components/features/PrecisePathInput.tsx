'use client'

import { useState } from 'react'
import { useApp, useCanProceed, useValidation } from '@/lib/app-context'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CONTEXT_CONFIGS } from '@/constants'
import { MiniMixtapeCard } from '@/components/ui/MiniMixtapeCard'

export function PrecisePathInput() {
  const { state, actions } = useApp()
  const canProceed = useCanProceed()
  const { validateSeedTracks } = useValidation()
  const [step, setStep] = useState<'seeds' | 'context'>('seeds')
  const [currentSeed, setCurrentSeed] = useState({ title: '', artist: '' })

  const handleAddSeed = () => {
    if (currentSeed.title.trim() && currentSeed.artist.trim()) {
      const seedTrack = {
        id: `seed_${Date.now()}`,
        title: currentSeed.title.trim(),
        artist: currentSeed.artist.trim()
      }
      actions.clearError() // Clear any previous errors
      actions.addSeedTrack(seedTrack)
      
      // Only clear form if successfully added (no error)
      if (!state.error) {
        setCurrentSeed({ title: '', artist: '' })
      }
    }
  }

  const handleRemoveSeed = (id: string) => {
    actions.removeSeedTrack(id)
  }

  const handleContextSelect = (context: any) => {
    actions.setWorkContext(context)
  }

  const handleGenerate = () => {
    // Final validation before generation
    const seedValidation = validateSeedTracks(state.seedTracks)
    if (!seedValidation.isValid) {
      actions.setError(seedValidation.error!)
      return
    }
    
    actions.startGeneration()
    actions.nextStep()
  }

  if (step === 'seeds') {
    const seedValidation = validateSeedTracks(state.seedTracks)
    const canAddMore = state.seedTracks.length < 3

    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Your last 3 favorite songs
          </h2>
          <p className="text-purple-200">Use songs you've been listening to recently for best personalization (max 3)</p>
        </div>

        <Card className="p-6 mb-6 bg-gradient-to-br from-purple-900/50 to-pink-900/30 backdrop-blur-sm border-2 border-purple-500/30">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Song title"
              value={currentSeed.title}
              onChange={(e) => setCurrentSeed(prev => ({ ...prev, title: e.target.value }))}
              className="bg-black/30 border-purple-500/50 text-white placeholder-purple-300"
              disabled={!canAddMore}
            />
            <Input
              placeholder="Artist name"
              value={currentSeed.artist}
              onChange={(e) => setCurrentSeed(prev => ({ ...prev, artist: e.target.value }))}
              className="bg-black/30 border-purple-500/50 text-white placeholder-purple-300"
              disabled={!canAddMore}
            />
          </div>
          <Button 
            onClick={handleAddSeed}
            disabled={!currentSeed.title || !currentSeed.artist || !canAddMore}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50"
          >
            {canAddMore ? 'Add Song' : 'Maximum 3 songs reached'}
          </Button>
        </Card>

        {/* Validation Messages */}
        {state.error && (
          <div className="text-center mb-6">
            <div className="text-red-300 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3 inline-block">
              {state.error}
            </div>
          </div>
        )}

        {state.seedTracks.length > 0 && (
          <div className="space-y-3 mb-8">
            <h3 className="text-white font-medium text-center mb-4">
              Your Seed Tracks ({state.seedTracks.length}/3)
            </h3>
            {state.seedTracks.map((track, index) => (
              <Card key={track.id} className="p-4 bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-sm border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Song {index + 1}: {track.title}</div>
                    <div className="text-purple-300 text-sm">Artist: {track.artist}</div>
                  </div>
                  <Button
                    onClick={() => handleRemoveSeed(track.id)}
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
            disabled={state.seedTracks.length === 0}
            className="px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50"
          >
            Continue to Context
          </Button>
          
          <p className="text-purple-300 text-sm mt-4">
            {state.seedTracks.length === 0 
              ? 'Add at least 1 song to continue'
              : `${state.seedTracks.length}/3 songs added`
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Based on your {state.seedTracks.length > 0 ? 'indie/bedroom pop' : ''} taste,<br />
          what's your work context?
        </h2>
        <p className="text-purple-200">Choose how you'll be using this playlist</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MiniMixtapeCard
          title="Deep Focus"
          subtitle="FOCUS"
          description="Coding, writing, analysis"
          onClick={() => handleContextSelect('focus')}
          variant="purple"
        />
        <MiniMixtapeCard
          title="Creative Work"
          subtitle="CREATE"
          description="Design, brainstorm, ideation"
          onClick={() => handleContextSelect('creative')}
          variant="pink"
        />
        <MiniMixtapeCard
          title="Admin Tasks"
          subtitle="ADMIN"
          description="Emails, planning, organizing"
          onClick={() => handleContextSelect('admin')}
          variant="blue"
        />
        <MiniMixtapeCard
          title="Casual Browsing"
          subtitle="BROWSE"
          description="Research, reading, light work"
          onClick={() => handleContextSelect('casual')}
          variant="green"
        />
      </div>

      <div className="text-center">
        <Button 
          onClick={handleGenerate}
          disabled={!canProceed}
          className="px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50"
        >
          Generate My Playlist
        </Button>
      </div>
    </div>
  )
}
