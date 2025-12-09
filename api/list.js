import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  console.log('List API called');
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    return res.status(500).json({ error: 'Supabase environment variables not set' });
  }

  try {
    const { data, error } = await supabase.from('redirects').select('*').order('id', { ascending: false });
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ redirects: data || [] });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: err.message });
  }
}
