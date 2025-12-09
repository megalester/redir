import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(200);

    if (error) throw error;

    res.status(200).json({ analytics: data || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
