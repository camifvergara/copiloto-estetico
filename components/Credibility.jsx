// components/Credibility.jsx
// v5 — 4 credenciales cualitativas, sin mencionar Promoestética, sin S.A.S.
// Los textos "0 comisiones" y "1 propósito" son placeholders temporales
// y serán reemplazados por credenciales más impactantes basadas en LinkedIn.
// Principios: I (neutralidad)

import React from 'react';

const credentials = [
  {
    number: '+15',
    label: 'años en el sector',
    description: 'De experiencia en medicina estética en Colombia, desde 2011.',
  },
  {
    number: '4',
    label: 'disciplinas académicas',
    description: 'Economía de la salud, economía del comportamiento, diseño de mecanismos e inteligencia artificial.',
  },
  {
    number: '0',
    label: 'comisiones de clínicas',
    description: 'Modelo neutral: el Copiloto no recibe pago por recomendar ningún proveedor.',
  },
  {
    number: '1',
    label: 'propósito',
    description: 'Ayudarte a tomar una decisión adulta. Nada más, nada menos.',
  },
];

export default function Credibility() {
  return (
    <section style={{
      padding: '96px 24px',
      background: '#F7FAFC',
      borderTop: '1px solid #E2E8F0',
      borderBottom: '1px solid #E2E8F0',
    }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: 56, maxWidth: 700, marginInline: 'auto' }}>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            color: '#028090',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Quién está detrás
          </p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: '#0A1929',
            margin: '12px 0 16px',
            lineHeight: 1.2,
            fontWeight: 500,
          }}>
            Construido por alguien que ha visto miles de decisiones estéticas, desde adentro
          </h2>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 17,
            color: '#4A5568',
            lineHeight: 1.55,
            margin: 0,
          }}>
            Esta herramienta no nace de un laboratorio. Nace de la observación
            directa de cómo se toman —y a veces se arrepienten— decisiones
            estéticas en la vida real.
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24,
        }}>
          {credentials.map((c, idx) => (
            <div key={idx} style={{
              background: '#FFFFFF',
              padding: '32px 24px',
              borderRadius: 12,
              border: '1px solid #E2E8F0',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(40px, 6vw, 52px)',
                color: '#02C39A',
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: 8,
              }}>
                {c.number}
              </div>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
                color: '#028090',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 600,
                margin: '0 0 12px',
              }}>
                {c.label}
              </p>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
                color: '#4A5568',
                lineHeight: 1.5,
                margin: 0,
              }}>
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
