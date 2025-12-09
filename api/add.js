import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log env vars for debugging
console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey?.slice(0, 4) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slug, destination, subdomain, delete: del } = req.body;

    if (del) {
      const { error } = await supabase.from('redirects').delete().eq('slug', slug);
      if (error) {
        console.error('Delete error:', error);
        return res.status(500).json({ error: error.message });
      }
      return res.json({ success: true });
    }

    if (!slug || !destination) {
      return res.status(400).json({ error: 'Missing slug or destination' });
    }

    const { data, error } = await supabase
      .from('redirects')
      .insert([{ slug, destination, subdomain }])
      .select();

    if (error) {
      console.error('Insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, slug: data[0].slug });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: err.message });
  }
}
