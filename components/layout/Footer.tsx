export function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-purple-500/20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-purple-300">
            Discover new music through human recs on{' '}
            <a 
              href="https://sharevibes.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline transition-colors font-medium relative z-10 cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              ShareVibes
            </a>
          </p>
          
          {/* Additional footer content */}
          <div className="mt-4 text-purple-400 text-sm">
            <p>Create your perfect mixtape in 30 seconds</p>
          </div>
          
          {/* Copyright */}
          <div className="mt-4 text-purple-500 text-xs">
            <p>© 2025 ShareVibes. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}