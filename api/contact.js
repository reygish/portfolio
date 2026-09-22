// Vercel Serverless Function: POST /api/contact
//
// This is a ready-to-wire stub. By default it validates the payload and
// returns success without sending an email, so the form works locally
// (via `vercel dev`) and in production immediately.
//
// To actually deliver email, set a RESEND_API_KEY environment variable in
// Vercel and uncomment the Resend block below (install with `npm i resend`).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, company } = req.body ?? {};

  // Honeypot: if filled, silently accept and drop.
  if (company) {
    return res.status(200).json({ ok: true });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof email !== 'string' ||
    !emailRe.test(email) ||
    typeof message !== 'string' ||
    message.trim().length < 10
  ) {
    return res.status(400).json({ error: 'Invalid form data' });
  }

  // --- Email delivery (optional) ---
  // Uncomment after `npm i resend` and setting RESEND_API_KEY + TO_EMAIL.
  //
  // if (process.env.RESEND_API_KEY) {
  //   const { Resend } = await import('resend');
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: 'Portfolio <onboarding@resend.dev>',
  //     to: process.env.TO_EMAIL,
  //     replyTo: email,
  //     subject: `New message from ${name}`,
  //     text: message,
  //   });
  // }

  return res.status(200).json({ ok: true });
}
