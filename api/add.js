import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { slug, destination, subdomain, delete: toDelete } = body;

    // Get existing redirects from KV
    let redirects = (await kv.get("redirects")) || [];

    if (toDelete) {
      // Delete redirect
      redirects = redirects.filter(r => r.slug !== slug);
      await kv.set("redirects", redirects);
      return res.status(200).json({ success: true, slug });
    }

    if (!slug || !destination) {
      return res.status(400).json({ success: false, error: "Missing slug or destination" });
    }

    // Add new redirect
    redirects.push({
      slug,
      destination,
      subdomain: subdomain || "gd2",
      created: new Date().toISOString()
    });

    await kv.set("redirects", redirects);

    return res.status(200).json({ success: true, slug });

  } catch (err) {
    // Always return a JSON object
    return res.status(500).json({ success: false, error: err.message || String(err) });
  }
}
