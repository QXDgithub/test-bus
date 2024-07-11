import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qmiqaccuizpojpivsoly.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtaXFhY2N1aXpwb2pwaXZzb2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA3MTczNTEsImV4cCI6MjAzNjI5MzM1MX0.c6MsuRUr5uK6tKwkfC-H3wGBceyxoMVBZlmMgYpKcZA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)