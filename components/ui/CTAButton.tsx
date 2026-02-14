'use client'

import React from 'react'

type CTAButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'solid' | 'outline' | 'text'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export default function CTAButton({
  children,
  onClick,
  variant = 'solid',
  className = '',
  type = 'button',
  disabled = false,
}: CTAButtonProps) {

  // base styles for buttons and its variants
  const base = 'rounded-lg font-medium transition duration-300 cursor-pointer'

  const variants = {
    solid:
      'lg:px-6 lg:py-3 px-3 py-2 bg-white text-black hover:bg-white/90 disabled:opacity-50',
    text:
      'py-2 px-4 hover:underline disabled:opacity-50 text-xl',
    outline:
      'lg:px-6 lg:py-3 px-3 py-2 border border-white text-white hover:bg-white/10 disabled:opacity-50',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${base} ${variants[variant]}`}
    >
      {children}
    </button>
  )
}
