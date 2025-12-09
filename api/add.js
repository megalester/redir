import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  console.log('Add API called');
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    return res.status(500).json({ error: 'Supabase environment variables not set' });
  }

  try {
    const { slug, destination, subdomain, delete: del } = req.body;

    if (del) {
      const { error: delErr } = await supabase.from('redirects').delete().eq('slug', slug);
      if (delErr) {
        console.error('Delete error:', delErr);
        return res.status(500).json({ error: delErr.message });
      }
      return res.status(200).json({ success: true });
    }

    // Prevent duplicates
    const { data: existing } = await supabase.from('redirects').select('*').eq('slug', slug).limit(1);
    if (existing && existing.length > 0) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const { data, error } = await supabase.from('redirects').insert([{ slug, destination, subdomain }]);
    if (error) {
      console.error('Insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true, slug });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: err.message });
  }
}
