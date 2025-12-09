import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { slug, destination, subdomain, delete: del } = req.body;

    // Log environment variables for debugging
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase env vars');
      return res.status(500).json({ error: 'Supabase environment variables not set' });
    }

    if (del) {
      const { error } = await supabase.from('redirects').delete().eq('slug', slug);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    const { error } = await supabase.from('redirects').insert([{ slug, destination, subdomain }]);
    if (error) throw error;

    return res.status(200).json({ success: true, slug });
  } catch (err) {
    console.error('Supabase error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
