// components/Hero.jsx
// v5 — Sin 360°, sin S.A.S., sin Promoestética, sin cifras propietarias
// Principios: I (neutralidad), IX (lenguaje del usuario)

import React, { useState } from 'react';
import { subscribeEmail } from '../lib/mailchimp';
import { track } from '../lib/analytics';

export default function Hero({ onOpenDemo }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !consent) return;
    setStatus('submitting');
    try {
      await subscribeEmail(email, ['hero_capture']);
      track('email_captured', { source: 'hero' });
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section style={{
      minHeight: '92vh',
      padding: '96px 24px 64px',
      background: 'linear-gradient(135deg, #0A1929 0%, #102B42 100%)',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', width: '100%' }}>
        <div style={{ maxWidth: 820 }}>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 14,
            color: '#02C39A',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
            fontWeight: 600,
          }}>
            Copiloto Estético
          </p>

          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(36px, 6vw, 64px)',
            lineHeight: 1.1,
            margin: '16px 0 24px',
            fontWeight: 500,
            letterSpacing: '-0.02em',
          }}>
            Antes de pagar un tratamiento estético,<br/>
            <span style={{ color: '#02C39A' }}>analízalo con rigor.</span>
          </h1>

          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(16px, 2vw, 19px)',
            lineHeight: 1.55,
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: 36,
            maxWidth: 680,
          }}>
            La mayoría de las personas toma decisiones estéticas sin un análisis
            objetivo sobre si el tratamiento realmente se ajusta a lo que quieren
            lograr. Este copiloto existe para ayudarte a tomar una decisión
            adulta, con tus propios criterios. No vendemos nada, no agendamos
            citas, no te vamos a llamar.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 48 }}>
            <button
              onClick={() => {
                track('demo_started', { source: 'hero_cta' });
                onOpenDemo();
              }}
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 16,
                fontWeight: 600,
                background: '#02C39A',
                color: '#0A1929',
                padding: '16px 32px',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Probar el análisis gratis →
            </button>
            <a
              href="#how-it-works"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 16,
                color: 'rgba(255, 255, 255, 0.8)',
                padding: '16px 24px',
                textDecoration: 'underline',
              }}
            >
              Ver cómo funciona
            </a>
          </div>

          <form onSubmit={handleSubmit} style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: 20,
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            maxWidth: 520,
          }}>
            <label style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 13,
              color: 'rgba(255, 255, 255, 0.75)',
              display: 'block',
              marginBottom: 8,
            }}>
              ¿Prefieres recibir el link en tu email y probarlo después?
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                aria-label="Email"
                style={{
                  flex: '1 1 200px',
                  padding: '12px 14px',
                  fontSize: 15,
                  borderRadius: 8,
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              />
              <button
                type="submit"
                disabled={status === 'submitting' || !consent}
                style={{
                  padding: '12px 22px',
                  borderRadius: 8,
                  background: consent ? '#028090' : 'rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: consent ? 'pointer' : 'not-allowed',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {status === 'submitting' ? 'Enviando...' : status === 'success' ? '✓ Enviado' : 'Recibir link'}
              </button>
            </div>
            <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'rgba(255, 255, 255, 0.65)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                style={{ marginTop: 2 }}
              />
              <span>
                Acepto recibir emails de Copiloto Estético. No compartimos tu
                información con terceros.
              </span>
            </label>
            {status === 'success' && (
              <p style={{ color: '#02C39A', fontSize: 13, marginTop: 12, marginBottom: 0 }}>
                Revisa tu email (y la carpeta de spam) en los próximos minutos.
              </p>
            )}
          </form>

          <p style={{
            marginTop: 40,
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.55)',
            fontStyle: 'italic',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            🧪 Este es un prototipo en validación. Tus respuestas nos ayudan a mejorarlo.
          </p>
        </div>
      </div>
    </section>
  );
}
