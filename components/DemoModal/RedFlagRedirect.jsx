// components/DemoModal/RedFlagRedirect.jsx
// Feature 001 · Principio IV (seguridad clínica sobre conversión)

import React from 'react';
import { RED_FLAG_MESSAGES } from '../../lib/redFlags';

export default function RedFlagRedirect({ type, onClose }) {
  const msg = RED_FLAG_MESSAGES[type];
  if (!msg) return null;

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>💚</div>
      <h2 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 26,
        color: '#0A1929',
        margin: '0 0 16px',
        lineHeight: 1.3,
      }}>
        {msg.title}
      </h2>
      <p style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 16,
        color: '#4A5568',
        lineHeight: 1.6,
        marginBottom: 32,
        maxWidth: 480,
        marginInline: 'auto',
      }}>
        {msg.body}
      </p>
      <button onClick={onClose} style={{
        padding: '14px 28px',
        background: '#02C39A',
        color: '#0A1929',
        border: 'none',
        borderRadius: 10,
        fontSize: 15,
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: 600,
        cursor: 'pointer',
      }}>
        {msg.cta}
      </button>
      <p style={{ fontSize: 12, color: '#718096', marginTop: 24, fontFamily: 'DM Sans, sans-serif', fontStyle: 'italic' }}>
        No guardamos respuestas cuando el flujo se interrumpe por razones de seguridad.
      </p>
    </div>
  );
}
