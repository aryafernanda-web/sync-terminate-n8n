// Vercel Serverless Function: meneruskan data dari aplikasi ke webhook n8n.
// URL webhook disimpan di Environment Variable N8N_WEBHOOK_URL (tidak terlihat di browser).
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Gunakan POST' });
  // Prioritas: Environment Variable di Vercel. Kalau tidak ada, pakai alamat di bawah ini.
  const target = process.env.N8N_WEBHOOK_URL || 'http://103.89.1.117:5678/webhook/tla-ndoglek27';
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const r = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
      signal: ctrl.signal,
    });
    const text = await r.text();
    return res.status(r.status).send(text);
  } catch (e) {
    const why = e.name === 'AbortError' ? 'timeout, cek firewall/port n8n' : e.message;
    return res.status(502).json({ error: 'Vercel tidak bisa menghubungi n8n: ' + why });
  } finally {
    clearTimeout(timer);
  }
};
