import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase env vars missing' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { slug, destination, subdomain, delete: toDelete } = JSON.parse(req.body);

    if (toDelete) {
      const { error } = await supabase.from('redirects').delete().eq('slug', slug);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    const { error } = await supabase.from('redirects').insert([{ slug, destination, subdomain }]);
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ success: true, slug });
  } catch (err) {
    console.error('Add redirect error:', err);
    return res.status(500).json({ error: err.message });
  }
}
