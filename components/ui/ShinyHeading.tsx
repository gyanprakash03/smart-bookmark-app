'use client'

import ShinyText from './ShinyText'

type Props = {
  children: React.ReactNode
  className?: string
}

// Wrapper for shiny text component
export default function ShinyHeading({
  children,
  className = '',
}: Props) {

  return (
    <div className={className}>
      <ShinyText
        text={typeof children === 'string' ? children : ''}
        speed={1.6}
        delay={0}
        color="#8F4999"
        shineColor="#ffffff"
        spread={120}
        direction="left"
        yoyo={false}
        pauseOnHover={false}
        disabled={false}
      />
    </div>
  )
}
