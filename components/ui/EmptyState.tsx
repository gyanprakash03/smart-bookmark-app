'use client'

export default function EmptyState() {
  return (
    <div className="w-full flex items-center justify-center my-auto">
        <div className="text-center max-w-sm space-y-6">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
            🔖
            </div>

            <h2 className="text-2xl font-semibold text-white">
            Your collection is empty
            </h2>

            <p className="text-white/60 text-sm">
            Start by saving your first link.
            </p>

        </div>
    </div>
  )
}
