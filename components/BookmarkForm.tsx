'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { bookmarkSchema } from '@/lib/validations'

export default function BookmarkForm() {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const result = bookmarkSchema.safeParse({ title, url })

    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    setLoading(true)

    const response = await supabase.auth.getUser();
    const user = response.data.user;
    if (!user) {
        setError('User not authenticated')
        return
    }

    const { error } = await supabase.from('bookmarks').insert({
      title,
      url,
      user_id: user.id,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setTitle('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Title"
        className="w-full border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="https://example.com"
        className="w-full border p-2 rounded"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Bookmark'}
      </button>
    </form>
  )
}
