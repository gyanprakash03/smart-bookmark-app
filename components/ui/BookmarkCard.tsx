'use client'

import SpotlightCard from './SpotLightCard'

type Props = {
  children: React.ReactNode
}

export default function BookmarkCard({ children }: Props) {
  return (
    <SpotlightCard
      spotlightColor="rgba(180, 180, 180, 0.30)"
      className="custom-spotlight-card bg-white/10 backdrop-blur-sm border border-white/20 
      shadow-lg pt-4 pb-2"
    >
      {children}
    </SpotlightCard>
  )
}
