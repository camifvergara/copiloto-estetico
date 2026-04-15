// components/DemoModal/Results.jsx
// v5 — Sin cifras propietarias, sin mencionar Promoestética
// Principios: VI (transparencia)

import React, { useState } from 'react';
import { track } from '../../lib/analytics';
import { SOFT_FLAG_MESSAGES } from '../../lib/redFlags';

function CircularScore({ score, label, description, color, contributors, orientation = 'normal' }) {
  const [expanded, setExpanded] = useState(false);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (orientation === 'inverted') {
      if (score >= 67) return '#02C39A';
      if (score >= 34) return '#F4A82A';
      return '#E07856';
    }
    if (score >= 67) return '#E07856';
    if (score >= 34) return '#F4A82A';
    return '#02C39A';
  };

  const displayColor = color || getColor();

  return (
    <div style={{ flex: '1 1 180px', minWidth: 180, background: '#F7FAFC', padding: 20, borderRadius: 12 }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="10" />
          <circle cx="65" cy="65" r={radius} fill="none" stroke={displayColor} strokeWidth="10"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 65 65)" />
          <text x="65" y="68" textAnchor="middle" fontSize="28" fontWeight="700" fill="#0A1929" fontFamily="Playfair Display, serif">
            {score}
          </text>
          <text x="65" y="85" textAnchor="middle" fontSize="9" fill="#718096" fontFamily="DM Sans, sans-serif">
            /100
          </text>
        </svg>
      </div>
      <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#0A1929', margin: '0 0 4px', textAlign: 'center', fontWeight: 600 }}>
        {label}
      </h4>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: displayColor, textAlign: 'center', margin: '0 0 10px', fontWeight: 600 }}>
        {description}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: 12,
          background: 'transparent',
          color: '#028090',
          border: '1px solid #02809030',
          borderRadius: 6,
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        {expanded ? 'Ocultar explicación' : '¿Por qué este número?'}
      </button>
      {expanded && (
        <ul style={{ marginTop: 12, paddingLeft: 16, fontSize: 12, color: '#4A5568', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}>
          {contributors.map((c, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              <strong style={{ color: '#0A1929' }}>{c.variable}</strong>
              <span style={{ color: c.impact > 0 ? '#E07856' : '#028090', marginLeft: 6 }}>
                ({c.impact > 0 ? '+' : ''}{c.impact})
              </span>
              <br />
              <span style={{ fontSize: 11 }}>{c.explanation}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Results({ answers, scores, softFlags, onClose }) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/?ref=${crypto.randomUUID().slice(0, 8)}`;
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      track('result_shared');
    } catch (err) {
      alert('Link: ' + url);
    }
  };

  return (
    <div>
      <h2 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 26,
        color: '#0A1929',
        margin: '16px 0 8px',
        lineHeight: 1.25,
      }}>
        Tu análisis está listo.
      </h2>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#4A5568', marginBottom: 24 }}>
        Tres scores. Cada uno con las variables que lo producen. Ninguno es un
        diagnóstico — son señales que pueden ayudarte a tomar tu decisión con
        más información.
      </p>

      {softFlags.length > 0 && (
        <div style={{
          background: '#FFF6E6',
          border: '1px solid #F4A82A',
          padding: 14,
          borderRadius: 8,
          marginBottom: 20,
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 13,
          color: '#8A5A00',
        }}>
          <strong>⚠️ Atención:</strong> {SOFT_FLAG_MESSAGES[softFlags[0]]}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <CircularScore
          score={scores.necesidad.score}
          label="Necesidad clínica"
          description={scores.necesidad.label}
          contributors={scores.necesidad.contributors}
          orientation="inverted"
        />
        <CircularScore
          score={scores.regret.score}
          label="Riesgo de arrepentimiento"
          description={scores.regret.label}
          contributors={scores.regret.contributors}
        />
        <CircularScore
          score={scores.urgencia.score}
          label="Timing del tratamiento"
          description={scores.urgencia.label}
          contributors={scores.urgencia.contributors}
        />
      </div>

      <div style={{ background: '#0A1929', color: '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 20 }}>
        <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#02C39A', margin: '0 0 12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Tres preguntas para hacerle a tu médico(a) en la consulta
        </h4>
        <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 1.6, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
          <li style={{ marginBottom: 8 }}>¿Qué porcentaje de tus pacientes con un perfil parecido al mío reportan resultado significativo? Pídele un número, no "casi todas".</li>
          <li style={{ marginBottom: 8 }}>Si solo pudiera hacerme la mitad de las sesiones que me propones, ¿qué resultado realista debería esperar?</li>
          <li>¿Qué producto específico (marca y dosis) me aplicarías y desde cuándo lo viene usando esta clínica?</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
        <button onClick={handleShare} style={{
          padding: '14px 20px', background: '#028090', color: '#FFFFFF',
          border: 'none', borderRadius: 10, fontSize: 15, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, cursor: 'pointer',
        }}>
          {shared ? '✓ Link copiado' : '🔗 Compartir con una amiga'}
        </button>
        <button onClick={onClose} style={{
          padding: '14px 20px', background: 'transparent', color: '#4A5568',
          border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
        }}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
