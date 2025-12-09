import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { slug, destination } = JSON.parse(req.body);

    // Get existing redirects from KV
    const redirects = (await kv.get("redirects")) || [];

    // Add new redirect
    redirects.push({
      slug,
      destination,
      created: new Date().toISOString(),
    });

    // Save back to KV
    await kv.set("redirects", redirects);

    return res.status(200).json({ success: true, slug });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
