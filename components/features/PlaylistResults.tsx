'use client'

import { useApp } from '@/lib/app-context'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function PlaylistResults() {
  const { state, actions } = useApp()

  if (!state.generatedPlaylist) {
    return (
      <div className="text-center py-12">
        <div className="text-white text-xl">No playlist generated yet</div>
      </div>
    )
  }

  const handleShowEmailForm = () => {
    actions.showEmailForm()
    actions.setStep('email-collection')
  }

  const handleRestart = () => {
    actions.resetApp()
  }



  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          Your Perfect ShareVibes Playlist Is Ready!
        </h2>
        <p className="text-purple-200 text-lg">
          {state.selectedPath === 'quick' ? 'Quick Mix' : 'Precise Mix'} • {state.workContext} vibes
        </p>
      </div>

      {/* Cassette Display */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-purple-900/50 to-pink-900/30 backdrop-blur-sm border-2 border-purple-500/30">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            {/* Large Cassette */}
            <div className="w-48 h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-2xl border-2 border-purple-400">
              {/* Cassette Reels */}
              <div className="flex justify-between items-center h-full px-8">
                <div className="w-12 h-12 bg-gray-800 rounded-full border-2 border-gray-600">
                  <div className="w-6 h-6 bg-gray-600 rounded-full mx-auto mt-3" />
                </div>
                <div className="w-12 h-12 bg-gray-800 rounded-full border-2 border-gray-600">
                  <div className="w-6 h-6 bg-gray-600 rounded-full mx-auto mt-3" />
                </div>
              </div>
              
              {/* Cassette Window */}
              <div className="absolute inset-x-8 top-4 bottom-4 bg-black bg-opacity-40 rounded" />
              
              {/* Cassette Label */}
              <div className="absolute inset-x-4 bottom-2 h-6 bg-white bg-opacity-95 rounded-sm flex items-center justify-center">
                <div className="text-sm font-bold text-purple-800">
                  {state.workContext?.toUpperCase()}
                </div>
              </div>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 w-48 h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-xl opacity-30 -z-10" />
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-white text-xl font-bold mb-2">
            {state.generatedPlaylist.length} songs • ~52 minutes
          </div>
          
          {/* Individual song links available below */}
          <div className="text-purple-300 text-sm">
            Click on individual songs below to open in Spotify or YouTube
          </div>
        </div>
      </Card>

      {/* Track List */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-purple-900/30 to-pink-900/20 backdrop-blur-sm border border-purple-500/30">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          ─── TRACK LIST ───────────────────────
        </h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {state.generatedPlaylist.map((track, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
              <div className="text-purple-300 font-mono text-sm w-8">
                {(index + 1).toString().padStart(2, '0')}.
              </div>
              
              {/* Album Cover (if available) */}
              {track.albumCover && (
                <img 
                  src={track.albumCover} 
                  alt={`${track.title} album cover`}
                  className="w-10 h-10 rounded bg-purple-800/50 object-cover"
                  loading="lazy"
                />
              )}
              
              <div className="flex-1">
                <div className="text-white font-medium">{track.title}</div>
                <div className="text-purple-300 text-sm">{track.artist}</div>
              </div>
              
              <div className="flex gap-3">
                {track.spotifyUrl && (
                  <a 
                    href={track.spotifyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded-full transition-colors"
                  >
                    🎵 Spotify
                  </a>
                )}
                {track.youtubeUrl && (
                  <a 
                    href={track.youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded-full transition-colors"
                  >
                    📺 YouTube
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Social Proof */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-sm border border-purple-500/30">
        <div className="text-center">
          <div className="text-purple-200 italic mb-2">
            &ldquo;Now it&apos;s so much easier to get the exact playlist I need&rdquo;
          </div>
          <div className="text-purple-300 text-sm">
            - Alex, Developer
          </div>
        </div>
      </Card>

      {/* Email Collection CTA */}
      <Card className="p-8 text-center bg-gradient-to-br from-purple-900/50 to-pink-900/30 backdrop-blur-sm border-2 border-purple-500/30">
        <h3 className="text-2xl font-bold text-white mb-4">
          Want more personalized ShareVibes playlists?
        </h3>
        
        <div className="mb-6">
          <div className="text-purple-200 mb-4">You&apos;ll get:</div>
          <div className="space-y-2 text-purple-200 text-sm max-w-md mx-auto">
            <div>- Weekly work playlists for your taste</div>
            <div>- New music discovery through stories</div>
            <div>- Different contexts (focus/creative)</div>
          </div>
        </div>

        <Button 
          onClick={handleShowEmailForm}
          className="px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 mb-4"
        >
          Send Me Weekly Vibes
        </Button>

        <div className="text-purple-300 text-sm mb-6">
          Join 2.3k+ music lovers getting weekly ShareVibes playlists
        </div>

        <div className="border-t border-purple-500/30 pt-6">
          <div className="text-purple-200 mb-4">Or explore our ShareVibes music community:</div>
          <Button 
            onClick={handleRestart}
            className="bg-transparent border border-purple-500 text-purple-300 hover:bg-purple-900/30"
          >
            Create Another Playlist →
          </Button>
        </div>
      </Card>
    </div>
  )
}