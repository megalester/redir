import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    const analytics = (await kv.get("analytics")) || [];
    res.status(200).json({ analytics });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
