// components/Validation.jsx
// v5 — 4 cifras de la encuesta propia (N=91), sin Promoestética
// Principios: II (datos reales), VI (transparencia), IX (lenguaje del usuario)

import React from 'react';

const stats = [
  {
    id: 'use_tool',
    number: '96%',
    headline: 'De personas encuestadas usaría una herramienta para analizar su decisión estética antes de pagar.',
    subtext: 'Existe demanda genuina por un análisis previo. La gente quiere decidir mejor, no solo más rápido.',
  },
  {
    id: 'risks_important',
    number: '89%',
    headline: 'Considera "muy importante" entender riesgos y alternativas antes de decidir.',
    subtext: 'No es un público apresurado. Es un público que ya entendió que la decisión merece reflexión.',
  },
  {
    id: 'time_dedicated',
    number: '68%',
    headline: 'Dedicaría 1 hora o más a analizar bien una decisión estética importante.',
    subtext: 'La decisión estética no es ligera. La herramienta de análisis tampoco tiene que serlo.',
  },
  {
    id: 'considering_now',
    number: '85%',
    headline: 'Está considerando un tratamiento estético actualmente.',
    subtext: 'El Copiloto llega al momento exacto en que se necesita: cuando la decisión está activa.',
  },
];

export default function Validation() {
  return (
    <section id="validation" style={{
      padding: '96px 24px',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F7FAFC 100%)',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: 56, maxWidth: 760, marginInline: 'auto' }}>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            color: '#028090',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Lo que dice la evidencia
          </p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: '#0A1929',
            margin: '12px 0 20px',
            lineHeight: 1.2,
          }}>
            Cuatro hallazgos que confirman por qué este copiloto tiene sentido ahora
          </h2>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 17,
            color: '#4A5568',
            lineHeight: 1.55,
            margin: 0,
          }}>
            Encuestamos a 91 mujeres en Colombia que están considerando o han
            considerado un tratamiento estético en el último año. Esto fue lo
            que nos dijeron.
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
        }}>
          {stats.map(s => (
            <article
              key={s.id}
              style={{
                background: 'rgba(2, 195, 154, 0.06)',
                borderLeft: '4px solid #02C39A',
                padding: '28px 24px',
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(40px, 6vw, 56px)',
                fontWeight: 700,
                color: '#02C39A',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                {s.number}
              </div>
              <h3 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 16,
                color: '#0A1929',
                lineHeight: 1.4,
                fontWeight: 600,
                margin: 0,
              }}>
                {s.headline}
              </h3>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
                color: '#4A5568',
                lineHeight: 1.5,
                margin: 0,
              }}>
                {s.subtext}
              </p>
            </article>
          ))}
        </div>

        <p style={{
          marginTop: 32,
          textAlign: 'center',
          fontSize: 12,
          color: '#718096',
          fontFamily: 'DM Sans, sans-serif',
          fontStyle: 'italic',
        }}>
          Fuente: Encuesta propia abril 2026 · 91 respuestas · Mujeres Colombia
        </p>
      </div>
    </section>
  );
}
