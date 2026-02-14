'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import CTAButton from './ui/CTAButton'
import ShinyHeading from '@/components/ui/ShinyHeading'

type Props = {
  email?: string
}

export default function DashboardHeader({ email }: Props) {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex justify-between items-center mb-6 space-x-3">
      <ShinyHeading className="lg:text-5xl text-3xl font-semibold">
        {`Hello ${email?.split('@')[0] ?? 'User'}`}
      </ShinyHeading>

      <CTAButton variant="outline" onClick={handleSignOut}>
        Sign Out
      </CTAButton>
    </div>
  )
}
