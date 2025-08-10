'use client'

import { useApp } from '@/lib/app-context'
import { MixtapeCard } from '@/components/ui/MixtapeCard'

export function PathSelection() {
  const { actions } = useApp()

  const handlePathSelect = (path: 'quick' | 'precise') => {
    actions.setPath(path)
    actions.nextStep()
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Choose Your Playlist Style
        </h2>
        <p className="text-purple-200 text-lg max-w-2xl mx-auto">
          Pick your path to the perfect vibe
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Side A - Quick Path */}
        <MixtapeCard
          title="Quick Mix"
          subtitle="SIDE A"
          description="30 seconds"
          features={[
            "Pick genres + context",
            "Good result",
            "15 curated tracks"
          ]}
          onClick={() => handlePathSelect('quick')}
          variant="purple"
        />

        {/* Side B - Precise Path */}
        <MixtapeCard
          title="Precise Mix"
          subtitle="SIDE B"
          description="60 seconds"
          features={[
            "Your 3 songs → Magic result",
            "Highly personalized",
            "15 perfect matches"
          ]}
          onClick={() => handlePathSelect('precise')}
          variant="pink"
        />
      </div>
    </div>
  )
}