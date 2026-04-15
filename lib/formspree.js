// lib/formspree.js
// Feature 001 · Principio VIII

// TODO Milo: reemplazar con endpoint real de Formspree
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REPLACE_WITH_REAL_ENDPOINT';

export async function submitSession(sessionObject) {
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(sessionObject),
    });
    if (!response.ok) throw new Error(`http_${response.status}`);
    // Backup en consola por si falla el forward a Google Sheets
    console.info('[DEMO-BACKUP]', JSON.stringify(sessionObject));
    return { ok: true };
  } catch (err) {
    console.error('[DEMO-ERROR]', err);
    console.info('[DEMO-BACKUP]', JSON.stringify(sessionObject));
    return { ok: false, error: err.message };
  }
}

export function buildSessionObject(answers, scores, flags, email = null, emailConsent = false) {
  return {
    session_id: crypto.randomUUID(),
    timestamp_start: sessionStorage.getItem('demo_start') || new Date().toISOString(),
    timestamp_end: new Date().toISOString(),
    duration_seconds: sessionStorage.getItem('demo_start')
      ? Math.round((Date.now() - new Date(sessionStorage.getItem('demo_start')).getTime()) / 1000)
      : null,
    referral_source: new URLSearchParams(window.location.search).get('ref') || 'direct',
    email,
    email_consent: emailConsent,
    user_agent_short: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
    answers,
    computed_scores: {
      necesidad: scores.necesidad.score,
      riesgo_regret: scores.regret.score,
      urgencia: scores.urgencia.score,
    },
    flags_triggered: [...flags.redFlags, ...flags.softFlags],
    version_schema: '1.0.0',
  };
}
