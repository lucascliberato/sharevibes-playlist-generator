'use client'

import { useEffect, useState } from 'react'
import { useFormPersistence } from '@/hooks/use-form-persistence'
import { useAutoSave } from '@/hooks/use-auto-save'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function FormPersistenceManager() {
  const { state, actions } = useApp()
  const { hasPersistedData, clearPersistedData, getPersistedDataAge } = useFormPersistence()
  const { clearAutoSave } = useAutoSave()
  const [showRestorePrompt, setShowRestorePrompt] = useState(false)

  useEffect(() => {
    // Check for persisted data on mount
    if (hasPersistedData() && !state.hasUrlParams && state.currentStep === 'path-selection') {
      const dataAge = getPersistedDataAge()
      
      // Only show restore prompt if data is recent (less than 1 hour)
      if (dataAge && dataAge < 60 * 60 * 1000) {
        setShowRestorePrompt(true)
      }
    }
  }, [])

  const handleRestore = () => {
    // The useFormPersistence hook will handle the actual restoration
    window.location.reload() // Simple way to trigger restoration
  }

  const handleDismiss = () => {
    clearPersistedData()
    clearAutoSave()
    setShowRestorePrompt(false)
  }

  const formatDataAge = (age: number): string => {
    const minutes = Math.floor(age / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
      return 'just now'
    }
  }

  if (!showRestorePrompt) {
    return null
  }

  const dataAge = getPersistedDataAge()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-sm border-2 border-purple-500/50">
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            Continue your ShareVibes session?
          </h3>
          
          <p className="text-purple-200 mb-4">
            We found your previous ShareVibes session from {dataAge ? formatDataAge(dataAge) : 'recently'}. 
            Would you like to restore your selections?
          </p>
          
          <div className="flex gap-3">
            <Button
              onClick={handleRestore}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
            >
              Restore Session
            </Button>
            <Button
              onClick={handleDismiss}
              className="flex-1 bg-transparent border border-purple-500 text-purple-300 hover:bg-purple-900/30"
            >
              Start Fresh
            </Button>
          </div>
          
          <p className="text-purple-400 text-xs mt-3">
            Your data is stored locally and never shared
          </p>
        </div>
      </Card>
    </div>
  )
}
