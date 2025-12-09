import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { slug, destination, subdomain, delete: del } = await req.json();
    let redirects = (await kv.get("redirects")) || [];

    if (del) {
      // Delete redirect
      redirects = redirects.filter(r => r.slug !== slug);
      await kv.set("redirects", redirects);
      return res.status(200).json({ success: true });
    }

    // Add new redirect
    redirects.push({ slug, destination, subdomain, created: Date.now() });
    await kv.set("redirects", redirects);

    res.status(200).json({ success: true, slug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
