import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DivinationRecord {
  id?: string;
  created_at?: string;
  user_id: string;
  date: string;
  question: string;
  original_numbers: string;
  corresponding_numbers: string;
  hexagram: string;
  line_change: string;
  asker_column: string;
  statement: string;
  line_statement: string;
}
