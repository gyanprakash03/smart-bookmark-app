'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <button
        onClick={handleLogin}
        className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 transition"
      >
        Sign in with Google
      </button>
    </div>
  )
}
