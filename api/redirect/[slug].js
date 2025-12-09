import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { slug } = req.query;

    const { data, error } = await supabase
      .from('redirects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return res.status(404).send('Redirect not found');

    // Log analytics
    await supabase.from('analytics').insert([
      {
        slug,
        timestamp: new Date(),
        country: req.headers['x-vercel-ip-country'] || 'XX',
        ua: req.headers['user-agent'] || ''
      }
    ]);

    res.redirect(data.destination);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}
