// lib/mailchimp.js
// Feature 001 · Principio VII (protección datos), VIII (simplicidad)

const MAILCHIMP_USER_ID = '8f0b59d21d6f47bb53ef064b6';
const MAILCHIMP_AUDIENCE_ID = '7833f3aa25';
const MAILCHIMP_SERVER = 'us20';
const MAILCHIMP_URL = `https://${MAILCHIMP_SERVER}.list-manage.com/subscribe/post-json?u=${MAILCHIMP_USER_ID}&id=${MAILCHIMP_AUDIENCE_ID}`;

let lastSubmitAt = 0;
const THROTTLE_MS = 60000; // 1/minuto

export async function subscribeEmail(email, tags = []) {
  const now = Date.now();
  if (now - lastSubmitAt < THROTTLE_MS) {
    throw new Error('rate_limit');
  }
  lastSubmitAt = now;

  const params = new URLSearchParams();
  params.append('EMAIL', email);
  tags.forEach((t, i) => params.append(`tags[${i}]`, t));

  try {
    await fetch(`${MAILCHIMP_URL}&${params.toString()}`, { method: 'GET', mode: 'no-cors' });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
