import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabaseProxyUrl =
  typeof window !== 'undefined'
    ? `${window.location.origin}/supabase`
    : supabaseUrl

export const supabase = createClient(supabaseProxyUrl, supabaseAnonKey)
