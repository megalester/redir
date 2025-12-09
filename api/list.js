import { supabase } from './supabaseClient.js';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase.from('redirects').select('*');
    if (error) throw error;
    res.status(200).json({ redirects: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
