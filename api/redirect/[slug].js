import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    const redirects = (await kv.get("redirects")) || [];
    const redirect = redirects.find(r => r.slug === slug);

    if (!redirect) return res.status(404).send("Redirect not found");

    // Log click
    let analytics = (await kv.get("analytics")) || [];
    analytics.push({
      slug,
      timestamp: Date.now(),
      ua: req.headers["user-agent"] || "",
      country: req.headers["x-vercel-ip-country"] || "XX",
    });
    // Keep only last 200 clicks
    analytics = analytics.slice(-200);
    await kv.set("analytics", analytics);

    // Redirect
    res.redirect(302, redirect.destination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
