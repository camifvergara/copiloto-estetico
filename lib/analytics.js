// lib/analytics.js
// Feature 001 · Principio VII (no PII)

export function track(eventName, props = {}) {
  if (typeof window === 'undefined' || typeof window.plausible !== 'function') {
    console.info('[TRACK]', eventName, props);
    return;
  }
  try {
    window.plausible(eventName, { props });
  } catch (err) {
    console.error('[TRACK-ERROR]', err);
  }
}

export function initSessionTimer() {
  if (!sessionStorage.getItem('demo_start')) {
    sessionStorage.setItem('demo_start', new Date().toISOString());
  }
}

export function clearSession() {
  sessionStorage.removeItem('demo_start');
  sessionStorage.removeItem('demo_answers');
}
