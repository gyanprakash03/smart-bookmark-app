import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { Database } from '@/types/database.types'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const response = NextResponse.redirect(
    new URL('/dashboard', requestUrl.origin)
  )

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.headers.get('cookie')
            ?.split(';')
            .map((c) => {
              const [name, value] = c.trim().split('=')
              return { name, value }
            }) ?? []
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const code = requestUrl.searchParams.get('code')

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  return response
}
