import { Logo } from '@/components/ui/Logo'
import { useApp } from '@/lib/app-context'

export function Header() {
  const { state } = useApp()

  return (
    <header className="pt-8 pb-4">
      <div className="text-center">
        <Logo />
        <div className="mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Playlist Generator
          </h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Create your perfect mixtape in 30 seconds
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-purple-300">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {state.mixtapeCount}+ playlists created
            </span>
            <span className="text-purple-400">•</span>
            <span>
              powered by <span className="text-purple-400">ShareVibes</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
