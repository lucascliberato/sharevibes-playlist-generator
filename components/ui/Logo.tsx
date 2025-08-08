export function Logo() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Cassette Body */}
        <div className="w-20 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg border-2 border-purple-400">
          {/* Cassette Reels */}
          <div className="flex justify-between items-center h-full px-2">
            <div className="w-4 h-4 bg-gray-800 rounded-full border border-gray-600">
              <div className="w-2 h-2 bg-gray-600 rounded-full mx-auto mt-1" />
            </div>
            <div className="w-4 h-4 bg-gray-800 rounded-full border border-gray-600">
              <div className="w-2 h-2 bg-gray-600 rounded-full mx-auto mt-1" />
            </div>
          </div>
          
          {/* Cassette Window */}
          <div className="absolute inset-x-2 top-1 bottom-1 bg-black bg-opacity-30 rounded" />
        </div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 w-20 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-md opacity-50 -z-10" />
      </div>
    </div>
  )
}
