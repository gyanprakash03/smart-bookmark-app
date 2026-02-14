import { z } from 'zod'

// Zod schema for validating bookmark input
export const bookmarkSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  url: z.url('Must be a valid URL'),
})

export type BookmarkInput = z.infer<typeof bookmarkSchema>
