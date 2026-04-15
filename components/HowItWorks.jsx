// components/HowItWorks.jsx
// Feature 001 · v4 refresh · Principios III, VI

import React from 'react';

const steps = [
  {
    n: '1',
    title: 'Cuéntanos tu contexto — sin juicio.',
    body: 'Edad, experiencia previa, cómo descubriste el tratamiento, cómo te sientes con respecto a lo que quieres cambiar. 7 preguntas rápidas. Todo privado.',
    duration: '~2 min',
  },
  {
    n: '2',
    title: 'Identifica qué esperas lograr exactamente — en tus palabras.',
    body: 'El tratamiento, la zona, las sesiones que te mencionaron, cuándo esperas ver resultado. Y sobre todo: qué imagen mental tienes del resultado.',
    duration: '~2 min',
  },
  {
    n: '3',
    title: 'Te mostramos la realidad — la distribución de resultados reales.',
    body: 'De cada 10 personas con tu perfil que se hicieron este tratamiento, cuántas reportaron resultado "significativo" según la data. Sin promesas de marketing, sin filtros.',
    duration: '~1 min',
  },
  {
    n: '4',
    title: 'Tú decides — con información, no con presión.',
    body: 'Tres scores (necesidad, riesgo de arrepentimiento, urgencia) con las variables que los producen a la vista. Más tres preguntas concretas para tu médico. El Copiloto no agenda nada — eso lo haces tú, donde quieras.',
    duration: '~3 min',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{
      padding: '96px 24px',
      background: '#F7FAFC',
    }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: 64, maxWidth: 700, marginInline: 'auto' }}>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            color: '#02C39A',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Cómo funciona
          </p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: '#0A1929',
            margin: '12px 0 16px',
            lineHeight: 1.2,
          }}>
            Cuatro pasos. Entre 5 y 8 minutos. Sin llamadas, sin agendas, sin vendedores.
          </h2>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 17,
            color: '#4A5568',
            lineHeight: 1.55,
            margin: 0,
          }}>
            El Copiloto no es un marketplace. No es un chatbot. Es un árbitro neutral que te ayuda
            a articular tu decisión con datos reales de 8 años de pacientes.
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
        }}>
          {steps.map(s => (
            <div key={s.n} style={{
              background: '#FFFFFF',
              padding: '32px 24px',
              borderRadius: 12,
              border: '1px solid #E2E8F0',
              position: 'relative',
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#02C39A',
                color: '#0A1929',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Playfair Display, serif',
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 16,
              }}>
                {s.n}
              </div>
              <h3 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 17,
                color: '#0A1929',
                margin: '0 0 10px',
                lineHeight: 1.35,
                fontWeight: 600,
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 14,
                color: '#4A5568',
                lineHeight: 1.5,
                margin: '0 0 16px',
              }}>
                {s.body}
              </p>
              <span style={{
                fontSize: 12,
                color: '#028090',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
              }}>
                {s.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
