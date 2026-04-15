// components/Problem.jsx
// v5 — 5 tensiones reescritas como observaciones generales del sector
// Sin cifras propietarias, sin mencionar Promoestética
// Principios: I (neutralidad), IX (lenguaje del usuario)

import React from 'react';

const tensions = [
  {
    number: '01',
    title: 'Lo que ves en redes ya no es lo que es realista esperar.',
    body: 'Los filtros visuales y la IA generativa han movido el listón de "cómo se ve un buen resultado". El cambio real de un tratamiento es menos espectacular que el feed que lo inspiró. Esa brecha es la que produce la mayoría de la insatisfacción.',
    tag: 'Cultura visual',
  },
  {
    number: '02',
    title: 'Los tratamientos más promocionados no son siempre los más adecuados para ti.',
    body: 'La oferta del sector responde a tendencias y márgenes, no a tu motivación específica. Lo que mejor se vende en redes no necesariamente es lo que mejor se ajusta a lo que quieres lograr.',
    tag: 'Asimetría de información',
  },
  {
    number: '03',
    title: 'Una conversación honesta con alguien de confianza vale más que diez asesorías comerciales.',
    body: 'Las personas que reciben un tratamiento estético después de hablarlo con alguien de confianza —no con un vendedor— consistentemente quedan más satisfechas. Llegan con expectativas calibradas. Este Copiloto reproduce esa conversación, a escala.',
    tag: 'Calibración',
  },
  {
    number: '04',
    title: 'La gente no está más insatisfecha. Está más ambivalente.',
    body: 'El sentimiento más común post-tratamiento ya no es "quedé feliz" ni "quedé mal". Es "no estoy segura". La ambigüedad post-tratamiento es eco de la ambigüedad pre-decisión. Tu Copiloto rompe ese primer eco.',
    tag: 'Insight clave',
  },
  {
    number: '05',
    title: 'Cada año salen tecnologías nuevas con menos historial clínico.',
    body: 'Las tecnologías y productos introducidos recientemente tienen tasas de reacción adversa más altas y menos data acumulada para predecir resultados. Saber qué te van a aplicar y desde cuándo existe en el mercado es información básica que pocas veces se discute.',
    tag: 'Alerta clínica',
  },
];

export default function Problem() {
  return (
    <section id="problem" style={{
      padding: '96px 24px',
      background: '#FFFFFF',
    }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <header style={{ marginBottom: 56, maxWidth: 760 }}>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            color: '#E07856',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Por qué decidir sola es cada vez más difícil
          </p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: '#0A1929',
            margin: '12px 0 0',
            lineHeight: 1.2,
          }}>
            Cinco tensiones estructurales que ningún asesor comercial te va a explicar
          </h2>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {tensions.map(t => (
            <article key={t.number} style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 24,
              paddingBottom: 28,
              borderBottom: '1px solid #E2E8F0',
            }}>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 40,
                color: '#028090',
                fontWeight: 700,
                lineHeight: 1,
                opacity: 0.6,
              }}>
                {t.number}
              </div>
              <div>
                <span style={{
                  display: 'inline-block',
                  fontSize: 11,
                  fontFamily: 'DM Sans, sans-serif',
                  color: '#028090',
                  background: 'rgba(2, 128, 144, 0.08)',
                  padding: '3px 10px',
                  borderRadius: 4,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: 12,
                }}>
                  {t.tag}
                </span>
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(20px, 2.5vw, 24px)',
                  color: '#0A1929',
                  margin: '0 0 10px',
                  lineHeight: 1.3,
                  fontWeight: 500,
                }}>
                  {t.title}
                </h3>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 16,
                  color: '#4A5568',
                  lineHeight: 1.55,
                  margin: 0,
                }}>
                  {t.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
