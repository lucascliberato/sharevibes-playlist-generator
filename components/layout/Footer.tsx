export function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-purple-500/20">
      <div className="text-center">
        <p className="text-purple-300">
          Discover new music through human recs on{' '}
          <a 
            href="https://sharevibes.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline transition-colors"
          >
            ShareVibes
          </a>
        </p>
      </div>
    </footer>
  )
}
