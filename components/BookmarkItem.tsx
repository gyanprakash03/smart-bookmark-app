'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'
import BookmarkCard from '@/components/ui/BookmarkCard'
import CTAButton from './ui/CTAButton'
import toast from 'react-hot-toast'

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
  const [useLetter, setUseLetter] = useState(false)
  
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return ''
    }
  }
  
  const domain = getDomain(url)
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  const firstLetter = title ? title.charAt(0).toUpperCase() : '?'

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
      toast.error('Failed to delete bookmark')
      return
    }
    toast.success('Bookmark deleted')
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
    <BookmarkCard>

      {editing ? (
        <div className="flex flex-col gap-5 text-white/60">
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full border border-white/60 p-2 rounded-xl text-white"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-black/80 text-white px-3 py-1 rounded cursor-pointer hover:bg-black transition-all duration-200 disabled:opacity-50"
            >
              Save
            </button>

            <button
              onClick={() => {
                setEditing(false)
                setNewUrl(url)
              }}
              className="border px-3 py-1 rounded cursor-pointer hover:bg-white/10 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className='flex gap-1 justify-center'>

            {useLetter ? (
              <div className="w-14 h-14 shrink-0 rounded-lg bg-white flex items-center justify-center text-blue-950 font-semibold text-4xl">
                {firstLetter}
              </div>
            ) : (
              <img
                src={faviconUrl}
                alt={domain}
                className="w-14 h-14 rounded-lg bg-white p-1 object-contain"
                onLoad={(e) => {
                  const img = e.currentTarget

                  if (img.naturalWidth <= 32) {
                    setUseLetter(true)
                  }
                }}
                onError={() => {
                  setUseLetter(true)
                }}
              />
            )}

            <div className='flex flex-col gap-2'>
              <a href={url} target='_blank' className="group flex-1 min-w-0 pl-4">
                <h2 className="font-medium text-xl text-white truncate">
                  {title}
                </h2>
                <p className="text-sm text-blue-300 truncate group-hover:underline">
                  {domain}...
                </p>
              </a>

              <div className="flex gap-2 justify-center items-center">
                <CTAButton
                  onClick={() => setEditing(true)}
                  variant='text'
                  className="text-sm text-white px-3 py-1 rounded opacity-70"
                >
                  Edit
                </CTAButton>

                <CTAButton
                  onClick={handleDelete}
                  disabled={loading}
                  variant='text'
                  className="text-sm text-red-600 px-3 py-2 rounded-lg"
                >
                  Delete
                </CTAButton>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </>
      )}
    </BookmarkCard>
  )
}
