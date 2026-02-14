'use client'

import Background from '@/components/ui/Background'
import CTAButton from '@/components/ui/CTAButton'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function HomePage() {
  const supabase = createClient()

  // Handle Google Sign-In
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <Background />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen text-white">
        
        {/* Navbar */}
        <nav className="flex justify-between items-center lg:w-[50%] w-[90%] mx-auto px-4 sm:px-8 py-2 bg-white/5 rounded-4xl mt-8 border border-white/20 backdrop-blur-sm">
          <div className='flex gap-2 items-center justify-center'>
            <img src='/bookmark-square-svgrepo-com.svg' alt='logo'/>

            <h1 className="text-2xl font-semibold">StashMark</h1>
          </div>
          
          <CTAButton variant="text" onClick={handleSignIn} className='text-white'>
            Sign In
          </CTAButton>
        </nav>

        {/* Hero Section */}
        <main className="flex flex-1 items-center justify-center px-8">
          <div className="max-w-2xl text-center flex flex-col gap-6 items-center">
            <h2 className="text-5xl font-bold leading-tight">
              Organize your web,
              <br />
              beautifully.
            </h2>

            <p className="text-lg text-white/80">
              Save, manage and access your bookmarks in real-time.
              Fast. Private. Elegant.
            </p>

            <div className='flex gap-6'>
              <CTAButton variant="solid" onClick={handleSignIn}>
                Get Started
              </CTAButton>

              <CTAButton variant="outline">
                <Link href="https://github.com/" target="_blank" className='flex gap-1.5 items-center'>
                  <span>GitHub</span>
                  <img src='/external-link.svg' alt='github link'/>
                </Link>
              </CTAButton>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

