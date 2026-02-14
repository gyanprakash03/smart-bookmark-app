'use client'

import LightPillar from './LightPillar'

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <LightPillar
        topColor="#5227FF"
        bottomColor="#FF9FFC"
        intensity={0.85}
        rotationSpeed={0.3}
        glowAmount={0.002}
        pillarWidth={5}
        pillarHeight={0.4}
        noiseIntensity={0.3}
        pillarRotation={25}
        interactive={false}
        mixBlendMode="screen"
        quality="high"
      />
    </div>
  )
}
