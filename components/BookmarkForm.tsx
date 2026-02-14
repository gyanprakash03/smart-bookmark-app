'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { bookmarkSchema } from '@/lib/validations'
import CTAButton from './ui/CTAButton'
import toast from 'react-hot-toast'

export default function BookmarkForm() {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // validate input using zod schema
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
        toast.error('User not authenticated')
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
      toast.error('Failed to add bookmark')
      return
    }

    toast.success('Bookmark added')
    setTitle('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center shrink-0 text-white pt-6 lg:pt-0 justify-center">

      <div className='text-2xl'>Create New Bookmark</div>

      <input
        type="text"
        placeholder="Title"
        className="w-full border border-white/70 p-2 rounded-xl"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="https://example.com"
        className="w-full border border-white/70 p-2 rounded-xl"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <CTAButton
        type={'submit'}
        disabled={loading}
        variant="solid"
      >
        {loading ? 'Adding...' : 'Add Bookmark'}
      </CTAButton>
    </form>
  )
}
