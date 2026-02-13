'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'

const urlSchema = z.url('Must be a valid URL')

type Props = {
  id: string
  title: string
  url: string
}

export default function BookmarkItem({ id, title, url }: Props) {
  const supabase = createClient()

  const [editing, setEditing] = useState(false)
  const [newUrl, setNewUrl] = useState(url)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }
  }

  const handleUpdate = async () => {
    setError(null)

    const result = urlSchema.safeParse(newUrl)

    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('bookmarks')
      .update({ url: newUrl })
      .eq('id', id)

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setEditing(false)
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-2">
      <h2 className="font-medium">{title}</h2>

      {editing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full border p-2 rounded"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-black text-white px-3 py-1 rounded"
            >
              Save
            </button>

            <button
              onClick={() => {
                setEditing(false)
                setNewUrl(url)
              }}
              className="border px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <a
            href={url}
            target="_blank"
            className="text-blue-600 text-sm break-all"
          >
            {url}
          </a>

          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="text-sm border px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </>
      )}
    </div>
  )
}
