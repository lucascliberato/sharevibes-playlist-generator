'use client'

import { useApp } from '@/lib/app-context'
import { useUrlParams } from '@/hooks/use-url-params'
import { useFormPersistence } from '@/hooks/use-form-persistence'
import { useAutoSave } from '@/hooks/use-auto-save'
import { PathSelection } from '@/components/features/PathSelection'
import { InputCollection } from '@/components/features/InputCollection'
import { PlaylistGeneration } from '@/components/features/PlaylistGeneration'
import { PlaylistResults } from '@/components/features/PlaylistResults'
import { EmailCollection } from '@/components/features/EmailCollection'
import { FormPersistenceManager } from '@/components/features/FormPersistenceManager'
import { Header } from '@/components/layout/Header'
import { Container } from '@/components/layout/Container'
import { Footer } from '@/components/layout/Footer'

export default function PlaylistGenerator() {
  const { state } = useApp()
  
  // Initialize all hooks
  useUrlParams()
  useFormPersistence()
  useAutoSave()

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'path-selection':
        return <PathSelection />
      case 'input-collection':
        return <InputCollection />
      case 'generating':
        return <PlaylistGeneration />
      case 'results':
        return <PlaylistResults />
      case 'email-collection':
        return <EmailCollection />
      default:
        return <PathSelection />
    }
  }

  return (
    <div className="min-h-screen bg-red-500 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNhMjM4ZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc=')] opacity-50" />
      
      {/* Form Persistence Manager */}
      <FormPersistenceManager />
      
      <Container>
        <Header />
        <main className="relative z-10">
          {renderCurrentStep()}
        </main>
        <Footer />
      </Container>
    </div>
  )
}
