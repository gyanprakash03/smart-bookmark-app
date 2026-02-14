import { createClient } from '@/lib/supabase/server'
import BookmarkList from '@/components/BookmarkList'
import DashboardHeader from '@/components/DashboardHeader'

export default async function Dashboard() {
  const supabase = await createClient()

  const response = await supabase.auth.getUser()
  const user = response.data.user

  // fetching bookmarks
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-linear-to-b from-[#030015] via-[#10053a] to-[#590e64] fixed inset-0">
      <div className="p-8 lg:w-[84%] mx-auto overflow-y-auto h-screen">
        <DashboardHeader email={user?.email} />
        <BookmarkList 
        initialBookmarks={bookmarks ?? []} 
        userId={user!.id}
        />
      </div>
    </div>
  )
}

