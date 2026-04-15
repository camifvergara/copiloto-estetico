// components/DemoModal/DemoModal.jsx
// v5 — Mago de Oz · Analysis loader sin "8 años de datos reales"
// Principios: III, IV, V, VI, IX

import React, { useState, useEffect, useReducer } from 'react';
import { questions, getVisibleQuestions } from '../../lib/questions';
import { computeAllScores } from '../../lib/scoring';
import { evaluateFlags, RED_FLAG_MESSAGES, SOFT_FLAG_MESSAGES } from '../../lib/redFlags';
import { submitSession, buildSessionObject } from '../../lib/formspree';
import { track, initSessionTimer, clearSession } from '../../lib/analytics';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import Results from './Results';
import RedFlagRedirect from './RedFlagRedirect';

const STAGES = { WELCOME: 'welcome', QUESTIONS: 'questions', ANALYSIS: 'analysis', RESULTS: 'results', REDFLAG: 'redflag' };

function answersReducer(state, action) {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.questionId]: action.value };
    case 'RESET':
      return {};
    default:
      return state;
  }
}

export default function DemoModal({ isOpen, onClose }) {
  const [stage, setStage] = useState(STAGES.WELCOME);
  const [answers, dispatchAnswers] = useReducer(answersReducer, {});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [redFlagType, setRedFlagType] = useState(null);
  const [scores, setScores] = useState(null);
  const [consent, setConsent] = useState(false);

  const visibleQs = getVisibleQuestions(answers);
  const currentQ = visibleQs[currentIdx];

  useEffect(() => {
    if (isOpen && stage === STAGES.WELCOME) initSessionTimer();
  }, [isOpen, stage]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      sessionStorage.setItem('demo_answers', JSON.stringify(answers));
    }
  }, [answers]);

  const handleStart = () => {
    track('demo_started', { consent });
    setStage(STAGES.QUESTIONS);
  };

  const handleAnswer = (value) => {
    dispatchAnswers({ type: 'SET', questionId: currentQ.id, value });
    const updatedAnswers = { ...answers, [currentQ.id]: value };
    const { redFlags } = evaluateFlags(updatedAnswers);
    if (redFlags.length > 0) {
      setRedFlagType(redFlags[0]);
      setStage(STAGES.REDFLAG);
      track('red_flag_triggered', { type: redFlags[0] });
      return;
    }
    const newVisibleQs = getVisibleQuestions(updatedAnswers);
    const nextIdx = currentIdx + 1;
    if (nextIdx >= newVisibleQs.length) {
      setStage(STAGES.ANALYSIS);
      runAnalysis(updatedAnswers);
    } else {
      setCurrentIdx(nextIdx);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const runAnalysis = async (finalAnswers) => {
    await new Promise(r => setTimeout(r, 2500));
    const computedScores = computeAllScores(finalAnswers);
    const flags = evaluateFlags(finalAnswers);
    setScores(computedScores);
    const session = buildSessionObject(finalAnswers, computedScores, flags, null, consent);
    await submitSession(session);
    track('demo_completed', { duration: session.duration_seconds });
    setStage(STAGES.RESULTS);
  };

  const handleClose = () => {
    clearSession();
    setStage(STAGES.WELCOME);
    setCurrentIdx(0);
    dispatchAnswers({ type: 'RESET' });
    setScores(null);
    setRedFlagType(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10, 25, 41, 0.82)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      overflowY: 'auto',
    }} role="dialog" aria-modal="true" aria-labelledby="demo-title">
      <div style={{
        background: '#FFFFFF',
        borderRadius: 16,
        maxWidth: 640,
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.24)',
      }}>
        <button
          onClick={handleClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            color: '#4A5568',
            width: 40,
            height: 40,
            borderRadius: '50%',
            zIndex: 2,
          }}
        >×</button>

        <div style={{
          background: '#FFF6E6',
          color: '#8A5A00',
          padding: '10px 24px',
          fontSize: 12,
          fontFamily: 'DM Sans, sans-serif',
          textAlign: 'center',
          borderBottom: '1px solid #F4E4B8',
        }}>
          🧪 Prototipo en validación · Tus respuestas nos ayudan a mejorarlo · Privadas y agregadas
        </div>

        <div style={{ padding: '32px 28px 40px' }}>
          {stage === STAGES.WELCOME && (
            <WelcomeScreen consent={consent} setConsent={setConsent} onStart={handleStart} />
          )}

          {stage === STAGES.QUESTIONS && currentQ && (
            <>
              <ProgressBar current={currentIdx + 1} total={visibleQs.length} block={currentQ.block} />
              <QuestionCard
                question={currentQ}
                value={answers[currentQ.id]}
                allAnswers={answers}
                onAnswer={handleAnswer}
                onBack={currentIdx > 0 ? handleBack : null}
              />
            </>
          )}

          {stage === STAGES.ANALYSIS && <AnalysisLoader />}

          {stage === STAGES.RESULTS && scores && (
            <Results
              answers={answers}
              scores={scores}
              softFlags={evaluateFlags(answers).softFlags}
              onClose={handleClose}
            />
          )}

          {stage === STAGES.REDFLAG && redFlagType && (
            <RedFlagRedirect type={redFlagType} onClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ consent, setConsent, onStart }) {
  return (
    <div>
      <h2 id="demo-title" style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 28,
        color: '#0A1929',
        margin: '0 0 16px',
        lineHeight: 1.25,
      }}>
        Hola. Gracias por estar aquí.
      </h2>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: '#4A5568', lineHeight: 1.6, marginBottom: 16 }}>
        Antes de empezar, tres cosas:
      </p>
      <ul style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#4A5568', lineHeight: 1.65, paddingLeft: 20, marginBottom: 24 }}>
        <li style={{ marginBottom: 8 }}>Son alrededor de <strong>20 preguntas</strong> organizadas en 3 bloques cortos. Toma entre 5 y 8 minutos.</li>
        <li style={{ marginBottom: 8 }}>No vendemos nada, no agendamos citas, <strong>no te vamos a llamar.</strong></li>
        <li>Las respuestas son privadas y se guardan de forma agregada para mejorar el Copiloto.</li>
      </ul>

      <label style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        background: '#F7FAFC',
        padding: 14,
        borderRadius: 8,
        marginBottom: 20,
        cursor: 'pointer',
        fontSize: 13,
        color: '#4A5568',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: 2 }} />
        <span>
          Acepto que mis respuestas se guarden de forma agregada y anónima para
          mejorar el Copiloto.
        </span>
      </label>

      <button
        onClick={onStart}
        disabled={!consent}
        style={{
          width: '100%',
          padding: '16px 24px',
          background: consent ? '#02C39A' : '#CBD5E0',
          color: '#0A1929',
          border: 'none',
          borderRadius: 10,
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 16,
          fontWeight: 600,
          cursor: consent ? 'pointer' : 'not-allowed',
        }}
      >
        Empezar el análisis →
      </button>
    </div>
  );
}

function AnalysisLoader() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{
        width: 60,
        height: 60,
        border: '4px solid #E2E8F0',
        borderTopColor: '#02C39A',
        borderRadius: '50%',
        margin: '0 auto 24px',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#0A1929', marginBottom: 12 }}>
        Calibrando tu análisis
      </h3>
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#4A5568' }}>
        Procesando tus respuestas con la lógica del Copiloto...
      </p>
    </div>
  );
}
