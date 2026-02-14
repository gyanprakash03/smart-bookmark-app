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
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // console.log('INSERT EVENT', payload)
            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
          }

          if (payload.eventType === 'DELETE') {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            )
          }

          if (payload.eventType === 'UPDATE') {
            setBookmarks((prev) =>
              prev.map((b) =>
                b.id === payload.new.id ? payload.new as Bookmark : b
              )
            )
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, bookmarks, setBookmarks])

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
