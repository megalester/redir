import { supabase } from './supabaseClient.js';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('redirects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ redirects: data });
  } catch (err) {
    console.error('Error fetching redirects:', err);
    res.status(500).json({ error: err.message });
  }
}
