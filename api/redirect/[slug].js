import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    // Lookup redirect
    const { data, error } = await supabase
      .from('redirects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return res.status(404).send('Redirect not found');
    }

    // Log analytics
    const ua = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const country = req.headers['x-vercel-ip-country'] || 'XX';

    await supabase.from('analytics').insert([
      {
        slug,
        ua,
        ip,
        country,
        timestamp: new Date()
      }
    ]);

    // Redirect
    res.writeHead(302, { Location: data.destination });
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
