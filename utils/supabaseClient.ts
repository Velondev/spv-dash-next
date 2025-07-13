import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://DEIN_PROJEKT.supabase.co'
const supabaseAnonKey = 'DEIN_PUBLIC_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)