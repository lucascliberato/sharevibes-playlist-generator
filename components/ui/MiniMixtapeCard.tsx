interface MiniMixtapeCardProps {
  title: string
  subtitle: string
  description: string
  onClick: () => void
  variant?: 'purple' | 'pink' | 'blue' | 'green'
  className?: string
}

export function MiniMixtapeCard({ 
  title, 
  subtitle, 
  description, 
  onClick, 
  variant = 'purple',
  className = '' 
}: MiniMixtapeCardProps) {
  const gradientClass = {
    purple: 'from-purple-600 to-purple-800',
    pink: 'from-pink-600 to-pink-800', 
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800'
  }[variant]
  
  const borderClass = {
    purple: 'border-purple-400',
    pink: 'border-pink-400',
    blue: 'border-blue-400', 
    green: 'border-green-400'
  }[variant]

  return (
    <div 
      className={`group hover:scale-105 transition-all duration-300 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Mini Mixtape Container */}
      <div className="relative">
        {/* Main Cassette Body */}
        <div className={`w-full h-32 bg-gradient-to-r ${gradientClass} rounded-lg shadow-xl border-2 ${borderClass} relative overflow-hidden`}>
          {/* Corner Screws */}
          <div className="absolute top-1 left-1 w-2 h-2 bg-gray-600 rounded-full border border-gray-500" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-gray-600 rounded-full border border-gray-500" />
          <div className="absolute bottom-1 left-1 w-2 h-2 bg-gray-600 rounded-full border border-gray-500" />
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-600 rounded-full border border-gray-500" />
          
          {/* Top Section - Reels */}
          <div className="flex justify-between items-center px-4 pt-3 h-12">
            <div className="w-6 h-6 bg-gray-800 rounded-full border border-gray-600 group-hover:animate-spin">
              <div className="w-3 h-3 bg-gray-600 rounded-full mx-auto mt-1.5" />
            </div>
            <div className="w-6 h-6 bg-gray-800 rounded-full border border-gray-600 group-hover:animate-spin" style={{ animationDirection: 'reverse' }}>
              <div className="w-3 h-3 bg-gray-600 rounded-full mx-auto mt-1.5" />
            </div>
          </div>
          
          {/* Middle Section - Window with Content */}
          <div className="absolute inset-x-3 top-12 bottom-3 bg-black bg-opacity-60 rounded border border-gray-600">
            <div className="p-2 h-full flex flex-col justify-center">
              <div className="text-center">
                <div className="text-xs font-mono text-white/80 mb-1">{subtitle}</div>
                <div className="text-sm font-bold text-white">{title}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Glow Effect */}
        <div className={`absolute inset-0 w-full h-32 bg-gradient-to-r ${gradientClass} rounded-lg blur-md opacity-20 -z-10 group-hover:opacity-40 transition-opacity`} />
      </div>

      {/* Description */}
      <div className="mt-3 text-center">
        <p className="text-purple-200 text-sm">{description}</p>
      </div>
    </div>
  )
}
