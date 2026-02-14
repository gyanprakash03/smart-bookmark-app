'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">
          Something went wrong
        </h2>

        <p className="text-white/60">
          We couldn't load your bookmarks.
        </p>

        <button
          onClick={reset}
          className="px-4 py-2 bg-white text-black rounded-lg cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
