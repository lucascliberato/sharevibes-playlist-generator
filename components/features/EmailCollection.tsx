'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/lib/app-context'
import { useVibesAPI } from '@/hooks/use-api'
import { useUrlParams } from '@/hooks/use-url-params'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function EmailCollection() {
  const { state, actions } = useApp()
  const api = useVibesAPI()
  const { getPrefillEmail, getCampaignData } = useUrlParams()
  const [email, setEmail] = useState('')

  // Prefill email from URL params
  useEffect(() => {
    const prefillEmail = getPrefillEmail()
    if (prefillEmail) {
      setEmail(prefillEmail)
    }
  }, [getPrefillEmail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      actions.setError('Please enter a valid email address')
      return
    }

    // Include campaign data in email collection
    const campaignData = getCampaignData()
    const contextPreference = state.workContext || 'focus'
    
    const success = await api.email.collectEmail(email, contextPreference)
    if (success) {
      setEmail('')
      
      // Log campaign conversion if available
      if (campaignData) {
        console.log('Campaign conversion:', {
          ...campaignData,
          email,
          convertedAt: new Date().toISOString()
        })
      }
    }
  }

  const handleSkip = () => {
    actions.resetApp()
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="p-8 text-center bg-gradient-to-br from-purple-900/50 to-pink-900/30 backdrop-blur-sm border-2 border-purple-500/30">
        <h2 className="text-3xl font-bold text-white mb-6">
          Join the ShareVibes Weekly Family
        </h2>
        
        <p className="text-purple-200 text-lg mb-8">
          Get personalized playlists delivered to your inbox every week, 
          curated specifically for your work context and musical taste through ShareVibes.
        </p>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-4 mb-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-black/30 border-purple-500/50 text-white placeholder-purple-300"
              required
            />
            <Button 
              type="submit"
              disabled={state.emailCollectionLoading}
              className="px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
            >
              {state.emailCollectionLoading ? 'Joining...' : 'Join Now'}
            </Button>
          </div>
        </form>

        {state.error && (
          <div className="text-red-300 mb-4">
            Error: {state.error}
          </div>
        )}

        <div className="text-purple-300 text-sm mb-6">
          Join 2.3k+ creators getting weekly personalized playlists from ShareVibes
        </div>

        <div className="border-t border-purple-500/30 pt-6">
          <Button 
            onClick={handleSkip}
            className="bg-transparent text-purple-300 hover:text-white hover:bg-purple-900/30"
          >
            Maybe later - Create another playlist
          </Button>
        </div>
      </Card>
    </div>
  )
}