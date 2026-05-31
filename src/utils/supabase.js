import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qedfektpsyjsaeupffkl.supabase.co'
const SUPABASE_KEY = 'sb_publishable_VMIyo9XIj566yTt3PqspFA_fUqVhQ15'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)