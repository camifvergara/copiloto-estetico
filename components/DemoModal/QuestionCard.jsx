// components/DemoModal/QuestionCard.jsx
// Feature 001 · Componente genérico para cualquier tipo de pregunta

import React, { useState, useEffect } from 'react';

export default function QuestionCard({ question, value, allAnswers, onAnswer, onBack }) {
  const [localValue, setLocalValue] = useState(value ?? (question.type === 'multi_select' ? [] : ''));

  useEffect(() => {
    setLocalValue(value ?? (question.type === 'multi_select' ? [] : ''));
  }, [question.id]);

  // Resolver opciones (pueden ser dinámicas)
  let options = question.options || [];
  if (question.dynamicOptions) options = question.dynamicOptions(allAnswers);

  const normalizeOption = (opt) => typeof opt === 'string' ? { value: opt, label: opt } : opt;

  const canContinue = question.type === 'nps'
    ? true
    : question.type === 'numeric'
    ? localValue !== '' && !isNaN(localValue)
    : question.type === 'multi_select'
    ? localValue.length > 0
    : question.type === 'text'
    ? localValue.trim().length >= 3
    : !!localValue;

  const handleMultiToggle = (val, exclusive) => {
    if (exclusive) {
      setLocalValue([val]);
      return;
    }
    const current = localValue.filter(v => {
      // Deseleccionar opciones exclusivas si había
      const opt = options.map(normalizeOption).find(o => o.value === v);
      return !opt?.exclusive;
    });
    if (current.includes(val)) setLocalValue(current.filter(v => v !== val));
    else setLocalValue([...current, val]);
  };

  return (
    <div>
      <h3 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 'clamp(20px, 3vw, 24px)',
        color: '#0A1929',
        margin: '16px 0 8px',
        lineHeight: 1.3,
        fontWeight: 500,
      }}>
        {question.text}
      </h3>
      {question.helper && (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#718096', marginBottom: 20 }}>
          {question.helper}
        </p>
      )}

      <div style={{ marginBottom: 24 }}>
        {question.type === 'numeric' && (
          <input
            type="number"
            value={localValue}
            onChange={e => setLocalValue(Number(e.target.value))}
            min={question.min}
            max={question.max}
            autoFocus
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 18,
              border: '2px solid #E2E8F0',
              borderRadius: 10,
              fontFamily: 'DM Sans, sans-serif',
              outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = '#02C39A'}
          />
        )}

        {question.type === 'text' && (
          <textarea
            value={localValue}
            onChange={e => setLocalValue(e.target.value.slice(0, question.maxLength || 200))}
            rows={3}
            autoFocus
            placeholder="Escribe en tus palabras..."
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 15,
              border: '2px solid #E2E8F0',
              borderRadius: 10,
              fontFamily: 'DM Sans, sans-serif',
              outline: 'none',
              resize: 'vertical',
            }}
            onFocus={e => e.target.style.borderColor = '#02C39A'}
          />
        )}

        {question.type === 'single_select' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {options.map(normalizeOption).map(opt => (
              <button
                key={opt.value}
                onClick={() => setLocalValue(opt.value)}
                style={{
                  padding: '14px 18px',
                  fontSize: 15,
                  fontFamily: 'DM Sans, sans-serif',
                  textAlign: 'left',
                  border: `2px solid ${localValue === opt.value ? '#02C39A' : '#E2E8F0'}`,
                  background: localValue === opt.value ? 'rgba(2, 195, 154, 0.08)' : '#FFFFFF',
                  color: '#0A1929',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {question.type === 'multi_select' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {options.map(normalizeOption).map(opt => {
              const selected = localValue.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => handleMultiToggle(opt.value, opt.exclusive)}
                  style={{
                    padding: '14px 18px',
                    fontSize: 15,
                    fontFamily: 'DM Sans, sans-serif',
                    textAlign: 'left',
                    border: `2px solid ${selected ? '#02C39A' : '#E2E8F0'}`,
                    background: selected ? 'rgba(2, 195, 154, 0.08)' : '#FFFFFF',
                    color: '#0A1929',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span style={{
                    width: 20, height: 20, borderRadius: 4,
                    border: `2px solid ${selected ? '#02C39A' : '#CBD5E0'}`,
                    background: selected ? '#02C39A' : '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FFFFFF', fontSize: 14, fontWeight: 'bold',
                    flexShrink: 0,
                  }}>
                    {selected && '✓'}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'nps' && (
          <div>
            <input
              type="range" min="0" max="10" step="1"
              value={localValue === '' ? 5 : localValue}
              onChange={e => setLocalValue(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#02C39A' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#718096', marginTop: 6 }}>
              <span>0</span>
              <span style={{ fontSize: 28, color: '#02C39A', fontWeight: 700 }}>{localValue === '' ? 5 : localValue}</span>
              <span>10</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
        {onBack ? (
          <button onClick={onBack} style={{
            padding: '14px 22px', background: 'transparent', color: '#4A5568',
            border: '2px solid #E2E8F0', borderRadius: 10, fontSize: 15,
            fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
          }}>← Atrás</button>
        ) : <span />}
        <button
          onClick={() => onAnswer(localValue)}
          disabled={!canContinue}
          style={{
            padding: '14px 28px',
            background: canContinue ? '#02C39A' : '#CBD5E0',
            color: '#0A1929',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600,
            cursor: canContinue ? 'pointer' : 'not-allowed',
            flex: onBack ? '0 0 auto' : '1',
          }}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
