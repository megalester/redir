// /api/add.js
import { supabase } from './supabaseClient.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { slug, destination, subdomain, delete: del } = req.body;

    if (del) {
      const { error } = await supabase.from('redirects').delete().eq('slug', slug);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    const { data, error } = await supabase.from('redirects').insert([{ slug, destination, subdomain }]);
    if (error) throw error;

    res.status(200).json({ success: true, slug: data[0].slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
