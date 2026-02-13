'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import BookmarkItem from './BookmarkItem'
import BookmarkForm from './BookmarkForm'
import { Database } from '@/types/database.types'

type Bookmark =
  Database['public']['Tables']['bookmarks']['Row']

type Props = {
  initialBookmarks: Bookmark[]
}

export default function BookmarkList({ initialBookmarks }: Props) {
  const supabase = createClient()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)

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
            console.log('INSERT EVENT', payload)
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
  }, [])

  return (
    <div>
      <BookmarkForm />

      <div className="mt-6 space-y-4">
        {bookmarks.map((bookmark) => (
          <BookmarkItem
            key={bookmark.id}
            id={bookmark.id}
            title={bookmark.title}
            url={bookmark.url}
          />
        ))}
      </div>
    </div>
  )
}
