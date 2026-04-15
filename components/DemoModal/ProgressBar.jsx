// components/DemoModal/ProgressBar.jsx

import React from 'react';

export default function ProgressBar({ current, total, block }) {
  const pct = (current / total) * 100;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#718096', fontFamily: 'DM Sans, sans-serif', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        <span>{block}</span>
        <span>Pregunta {current} de {total}</span>
      </div>
      <div style={{ width: '100%', height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: '#02C39A', transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
}
