import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

// Supabase client

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // 세션 유지
    autoRefreshToken: true, // 토큰 자동 갱신
  },
});
