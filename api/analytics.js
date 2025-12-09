import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  console.log('Analytics API called');
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    return res.status(500).json({ error: 'Supabase environment variables not set' });
  }

  try {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(200);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ analytics: data || [] });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: err.message });
  }
}
