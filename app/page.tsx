import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const response = await supabase.auth.getUser()
  const user = response.data.user

  if (user) {
    redirect('/dashboard')
  }

  redirect('/login')
}
