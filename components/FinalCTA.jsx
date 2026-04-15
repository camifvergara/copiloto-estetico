// components/FinalCTA.jsx
// Feature 001 · Principios I, IX — NO "agendar cita", NO "ver precios"

import React from 'react';
import { track } from '../lib/analytics';

export default function FinalCTA({ onOpenDemo }) {
  return (
    <section style={{
      padding: '96px 24px',
      background: 'linear-gradient(135deg, #028090 0%, #02C39A 100%)',
      color: '#0A1929',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(28px, 4vw, 44px)',
          margin: '0 0 16px',
          lineHeight: 1.2,
          fontWeight: 500,
        }}>
          Hacer el análisis gratis toma menos que ver dos reels.
        </h2>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 17,
          lineHeight: 1.55,
          margin: '0 0 32px',
          color: 'rgba(10, 25, 41, 0.82)',
        }}>
          No tienes que registrarte, no tienes que dar teléfono, no te vamos a llamar.
          Si al final decides que el tratamiento no es para ti, esa también es una respuesta válida.
        </p>
        <button
          onClick={() => {
            track('demo_started', { source: 'final_cta' });
            onOpenDemo();
          }}
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 18,
            fontWeight: 600,
            background: '#0A1929',
            color: '#02C39A',
            padding: '18px 40px',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Empezar el análisis →
        </button>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 13,
          marginTop: 24,
          color: 'rgba(10, 25, 41, 0.65)',
        }}>
          🧪 Prototipo en validación · Tu participación ayuda a calibrar la herramienta para futuras personas.
        </p>
      </div>
    </section>
  );
}
