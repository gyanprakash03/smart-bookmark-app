import { createClient } from '@/lib/supabase/server'

export default async function Dashboard() {
  const supabase = await createClient()
  const response = await supabase.auth.getUser()
  const user = response.data.user

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">
        Welcome {user?.email}
      </h1>
    </div>
  )
}
