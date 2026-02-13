import { createClient } from '@/lib/supabase/server'
import BookmarkList from '@/components/BookmarkList'

export default async function Dashboard() {
  const supabase = await createClient()

  const response = await supabase.auth.getUser()
  const user = response.data.user

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Welcome {user?.email}
      </h1>

      <BookmarkList initialBookmarks={bookmarks ?? []} />
    </div>
  )
}

