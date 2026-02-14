'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import BookmarkItem from './BookmarkItem'
import BookmarkForm from './BookmarkForm'
import { Database } from '@/types/database.types'
import EmptyState from './ui/EmptyState'

// bookmark type based on database schema
type Bookmark = Database['public']['Tables']['bookmarks']['Row']

type Props = {
  initialBookmarks: Bookmark[]
}

export default function BookmarkList({ initialBookmarks }: Props) {
  const supabase = createClient()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)

  // Listen for changes in the bookmarks table and update the state accordingly
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>

    const setupSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      channel = supabase
        .channel('bookmarks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newBookmark = payload.new as Bookmark

              setBookmarks((prev) => {
                if (prev.some((b) => b.id === newBookmark.id)) {
                  return prev
                }
                return [newBookmark, ...prev]
              })
            }

            if (payload.eventType === 'DELETE') {
              setBookmarks((prev) =>
                prev.filter((b) => b.id !== payload.old.id)
              )
            }

            if (payload.eventType === 'UPDATE') {
              const updatedBookmark = payload.new as Bookmark

              setBookmarks((prev) =>
                prev.map((b) =>
                  b.id === updatedBookmark.id ? updatedBookmark : b
                )
              )
            }
          }
        )
        .subscribe()
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])


  return (
    <div className='grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 pt-8 w-full'>
      <BookmarkForm />

      <div className="flex flex-wrap gap-4 content-start items-start justify-center lg:justify-end lg:overflow-y-auto lg:h-[70vh] pr-2 scrollbar-custom">
        {bookmarks.length === 0 ? (
          <EmptyState />
        ) : (
          bookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              id={bookmark.id}
              title={bookmark.title}
              url={bookmark.url}
            />
          ))
        )}
      </div>
    </div>
  )
}
