export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#030015] via-[#10053a] to-[#590e64] flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <p className="text-white/70">Loading your bookmarks...</p>
      </div>
    </div>
  )
}
