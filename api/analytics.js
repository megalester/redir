import { supabase } from './supabaseClient.js';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('clicks')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(200);

    if (error) throw error;

    res.status(200).json({ analytics: data });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: err.message });
  }
}
