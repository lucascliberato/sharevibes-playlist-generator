interface MixtapeCardProps {
  title: string
  subtitle: string
  description: string
  features: string[]
  onClick: () => void
  variant?: 'purple' | 'pink'
  className?: string
}

export function MixtapeCard({ 
  title, 
  subtitle, 
  description, 
  features, 
  onClick, 
  variant = 'purple',
  className = '' 
}: MixtapeCardProps) {
  const gradientClass = variant === 'purple' 
    ? 'from-purple-600 to-pink-600' 
    : 'from-pink-600 to-purple-600'
  
  const borderClass = variant === 'purple'
    ? 'border-purple-400'
    : 'border-pink-400'

  return (
    <div 
      className={`group hover:scale-105 transition-all duration-300 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Mixtape Container */}
      <div className="relative">
        {/* Main Cassette Body */}
        <div className={`w-full h-48 bg-gradient-to-r ${gradientClass} rounded-xl shadow-2xl border-2 ${borderClass} relative overflow-hidden`}>
          {/* Corner Screws */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-gray-600 rounded-full border border-gray-500" />
          <div className="absolute top-2 right-2 w-3 h-3 bg-gray-600 rounded-full border border-gray-500" />
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-gray-600 rounded-full border border-gray-500" />
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-gray-600 rounded-full border border-gray-500" />
          
          {/* Top Section - Reels and Side Label */}
          <div className="flex justify-between items-center p-6 h-20 relative">
            <div className="w-12 h-12 bg-gray-800 rounded-full border-2 border-gray-600 group-hover:animate-spin">
              <div className="w-6 h-6 bg-gray-600 rounded-full mx-auto mt-3" />
            </div>
            
            {/* Side Label */}
            <div className="absolute inset-x-0 top-2 text-center">
              <div className="text-sm font-mono text-white/90 font-bold">{subtitle}</div>
            </div>
            
            <div className="w-12 h-12 bg-gray-800 rounded-full border-2 border-gray-600 group-hover:animate-spin" style={{ animationDirection: 'reverse' }}>
              <div className="w-6 h-6 bg-gray-600 rounded-full mx-auto mt-3" />
            </div>
          </div>
          
          {/* Middle Section - Window with Title and Time */}
          <div className="absolute inset-x-6 top-20 bottom-8 bg-black bg-opacity-60 rounded-lg border border-gray-600">
            <div className="p-4 h-full flex flex-col justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-white mb-2">{title}</div>
                <div className="text-sm text-purple-200">{description}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Glow Effect */}
        <div className={`absolute inset-0 w-full h-48 bg-gradient-to-r ${gradientClass} rounded-xl blur-lg opacity-30 -z-10 group-hover:opacity-50 transition-opacity`} />
      </div>

      {/* Features List */}
      <div className="mt-6 space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3 text-purple-200">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            {feature}
          </div>
        ))}
      </div>
    </div>
  )
}
