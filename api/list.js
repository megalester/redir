import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    const redirects = (await kv.get("redirects")) || [];
    res.status(200).json({ redirects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
