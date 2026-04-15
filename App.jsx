import { useState, useEffect, useRef, useReducer } from "react";
import { questions, getVisibleQuestions, BLOCKS } from "./lib/questions";
import { computeAllScores } from "./lib/scoring";
import { evaluateFlags, RED_FLAG_MESSAGES, SOFT_FLAG_MESSAGES } from "./lib/redFlags";

// ─── Intersection Observer Hook ─────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); obs.unobserve(el); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, isVisible];
}

// ─── Animated Section Wrapper ───────────────────────────────
function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Icon Components ────────────────────────────────────────
const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconBrain = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
    <path d="M10 22h4"/><path d="M9 9h6"/><path d="M12 9v4"/>
  </svg>
);
const IconScale = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18"/><path d="M5 8l7-5 7 5"/><path d="M3 14l4-6 4 6"/><path d="M13 14l4-6 4 6"/>
    <circle cx="7" cy="14" r="3.5" fill="none"/><circle cx="17" cy="14" r="3.5" fill="none"/>
  </svg>
);
const IconEye = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconTarget = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#02C39A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconArrowDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M19 12l-7 7-7-7"/>
  </svg>
);


// ═══════════════════════════════════════════════════════════════
// ─── WIZARD OF OZ DEMO MODAL (v4 — 20 preguntas) ─────────────
// ═══════════════════════════════════════════════════════════════
function DemoModal({ isOpen, onClose }) {
  const STAGES = { WELCOME: 'welcome', QUESTIONS: 'questions', ANALYSIS: 'analysis', RESULTS: 'results', REDFLAG: 'redflag' };
  const [stage, setStage] = useState(STAGES.WELCOME);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [redFlagType, setRedFlagType] = useState(null);
  const [scores, setScores] = useState(null);
  const [consent, setConsent] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisPhase, setAnalysisPhase] = useState(0);

  const analysisMessages = [
    "Evaluando tu perfil de riesgo...",
    "Calibrando con datos del sector...",
    "Analizando alineación tratamiento-motivación...",
    "Evaluando tolerancia a resultados ambiguos...",
    "Generando tu análisis personalizado...",
  ];

  const visibleQs = getVisibleQuestions(answers);
  const currentQ = visibleQs[currentIdx];

  useEffect(() => {
    if (isOpen) {
      setStage(STAGES.WELCOME);
      setAnswers({});
      setCurrentIdx(0);
      setScores(null);
      setRedFlagType(null);
      setConsent(false);
      setAnalysisProgress(0);
      setAnalysisPhase(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (stage !== STAGES.ANALYSIS) return;
    setAnalysisProgress(0);
    setAnalysisPhase(0);
    const interval = setInterval(() => {
      setAnalysisProgress(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(() => {
          const computed = computeAllScores(answers);
          setScores(computed);
          setStage(STAGES.RESULTS);
        }, 400); return 100; }
        return p + 1;
      });
    }, 50);
    const phaseInterval = setInterval(() => {
      setAnalysisPhase(ph => ph < 4 ? ph + 1 : ph);
    }, 1000);
    return () => { clearInterval(interval); clearInterval(phaseInterval); };
  }, [stage]);

  const handleAnswer = (value) => {
    const updated = { ...answers, [currentQ.id]: value };
    setAnswers(updated);

    // Check red flags
    if (currentQ.redFlag) {
      const flag = currentQ.redFlag(value);
      if (flag && flag.level === 'RED') {
        setRedFlagType(flag.type);
        setStage(STAGES.REDFLAG);
        return;
      }
    }
    // Check multi_select red flags
    if (currentQ.type === 'multi_select' && Array.isArray(value)) {
      for (const opt of currentQ.options) {
        if (typeof opt === 'object' && opt.flag && opt.flag.level === 'RED' && value.includes(opt.value)) {
          setRedFlagType(opt.flag.type);
          setStage(STAGES.REDFLAG);
          return;
        }
      }
    }

    const newVisible = getVisibleQuestions(updated);
    const nextIdx = currentIdx + 1;
    if (nextIdx >= newVisible.length) {
      setStage(STAGES.ANALYSIS);
    } else {
      setCurrentIdx(nextIdx);
    }
  };

  const handleBack = () => { if (currentIdx > 0) setCurrentIdx(currentIdx - 1); };

  if (!isOpen) return null;

  const Btn = ({ onClick, children, secondary, disabled }) => (
    <button onClick={onClick} disabled={disabled} style={{
      background: secondary ? "transparent" : "linear-gradient(135deg,#028090,#02C39A)",
      color: secondary ? "#8BA3B8" : "#fff",
      border: secondary ? "1px solid rgba(255,255,255,0.1)" : "none",
      padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
      opacity: disabled ? 0.4 : 1, transition: "all 0.2s",
    }}>{children}</button>
  );

  const ScoreCircle = ({ value, label, color, size = 120, description }) => {
    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (value / 100) * circumference;
    return (
      <div style={{ textAlign: "center", flex: "1 1 140px" }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dashoffset 1.5s ease" }} />
          <text x="50" y="46" textAnchor="middle" fill={color} fontSize="26" fontWeight="700" fontFamily="'Playfair Display',serif">{value}</text>
          <text x="50" y="62" textAnchor="middle" fill="#6B8FA3" fontSize="8" fontWeight="500">/100</text>
        </svg>
        <div style={{ fontSize: 12, color: "#8BA3B8", marginTop: 4, fontWeight: 500 }}>{label}</div>
        {description && <div style={{ fontSize: 11, color, marginTop: 2, fontWeight: 600 }}>{description}</div>}
      </div>
    );
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
      background: "rgba(5,12,24,0.85)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, overflowY: "auto",
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#0D2137", border: "1px solid rgba(2,195,154,0.1)",
        borderRadius: 20, width: "100%", maxWidth: 580,
        padding: "32px 28px", position: "relative",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, background: "none", border: "none",
          color: "#5A7A8A", fontSize: 22, cursor: "pointer", lineHeight: 1,
        }}>✕</button>

        {/* Prototype banner */}
        <div style={{
          background: "rgba(244,168,42,0.08)", border: "1px solid rgba(244,168,42,0.2)",
          padding: "8px 16px", borderRadius: 8, marginBottom: 20,
          fontSize: 11, color: "#E8A820", textAlign: "center",
        }}>
          🧪 Prototipo en validación · Tus respuestas nos ayudan a mejorarlo
        </div>

        {/* Progress bar for questions */}
        {stage === STAGES.QUESTIONS && currentQ && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#02C39A", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                {currentQ.block}
              </span>
              <span style={{ fontSize: 11, color: "#5A7A8A" }}>
                {currentIdx + 1} de {visibleQs.length}
              </span>
            </div>
            <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${((currentIdx + 1) / visibleQs.length) * 100}%`, height: "100%", background: "linear-gradient(90deg,#028090,#02C39A)", borderRadius: 2, transition: "width 0.4s ease" }} />
            </div>
          </div>
        )}

        {/* ─── WELCOME ─── */}
        {stage === STAGES.WELCOME && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🧭</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "#fff", marginBottom: 12, fontWeight: 700 }}>
                Hola. Gracias por estar aquí.
              </h2>
              <p style={{ fontSize: 15, color: "#8BA3B8", lineHeight: 1.7, maxWidth: 420, margin: "0 auto" }}>
                Son alrededor de <strong style={{color:"#fff"}}>20 preguntas</strong> organizadas en 3 bloques cortos. Toma entre 5 y 8 minutos.
              </p>
            </div>
            <div style={{ background: "rgba(2,195,154,0.06)", border: "1px solid rgba(2,195,154,0.12)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 14, color: "#8BA3B8", lineHeight: 1.7 }}>
                <li style={{ marginBottom: 8, display: "flex", gap: 8 }}><span style={{color:"#02C39A"}}>→</span> No vendemos nada, no agendamos citas, <strong style={{color:"#fff"}}>no te vamos a llamar.</strong></li>
                <li style={{ display: "flex", gap: 8 }}><span style={{color:"#02C39A"}}>→</span> Las respuestas son privadas y se guardan de forma agregada.</li>
              </ul>
            </div>
            <label style={{
              display: "flex", gap: 10, alignItems: "flex-start",
              background: "rgba(255,255,255,0.03)", padding: 14, borderRadius: 8,
              marginBottom: 20, cursor: "pointer", fontSize: 13, color: "#8BA3B8",
            }}>
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: 2 }} />
              <span>Acepto que mis respuestas se guarden de forma agregada y anónima para mejorar el Copiloto.</span>
            </label>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Btn onClick={() => setStage(STAGES.QUESTIONS)} disabled={!consent}>Empezar el análisis →</Btn>
            </div>
          </div>
        )}

        {/* ─── QUESTIONS ─── */}
        {stage === STAGES.QUESTIONS && currentQ && (
          <QuestionRenderer
            question={currentQ}
            value={answers[currentQ.id]}
            allAnswers={answers}
            onAnswer={handleAnswer}
            onBack={currentIdx > 0 ? handleBack : null} currentIdx={currentIdx} totalQuestions={visibleQs.length}
            Btn={Btn}
          />
        )}

        {/* ─── ANALYSIS ─── */}
        {stage === STAGES.ANALYSIS && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{
                width: 80, height: 80, margin: "0 auto 24px", borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(2,128,144,0.15), rgba(2,195,154,0.1))",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "spin 3s linear infinite",
              }}>
                <div style={{ fontSize: 36 }}>🧠</div>
              </div>
              <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#fff", marginBottom: 8 }}>
                Calibrando tu análisis...
              </h3>
              <p style={{ fontSize: 14, color: "#02C39A", minHeight: 20, transition: "opacity 0.3s" }}>
                {analysisMessages[analysisPhase]}
              </p>
            </div>
            <div style={{ maxWidth: 300, margin: "0 auto" }}>
              <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${analysisProgress}%`, height: "100%", background: "linear-gradient(90deg,#028090,#02C39A)", borderRadius: 4, transition: "width 0.05s linear" }} />
              </div>
              <div style={{ fontSize: 12, color: "#5A7A8A", marginTop: 8 }}>{analysisProgress}%</div>
            </div>
          </div>
        )}

        {/* ─── RESULTS ─── */}
        {stage === STAGES.RESULTS && scores && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "#5A7A8A", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Tu análisis personalizado</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "#fff", marginBottom: 8 }}>Tu diagnóstico de decisión</h3>
              <p style={{ fontSize: 13, color: "#6B8FA3" }}>Tres scores. Cada uno con las variables que lo producen.</p>
            </div>

            {/* Soft flags */}
            {(() => {
              const { softFlags } = evaluateFlags(answers);
              return softFlags.length > 0 ? (
                <div style={{ background: "rgba(232,168,32,0.08)", border: "1px solid rgba(232,168,32,0.2)", padding: 14, borderRadius: 8, marginBottom: 20, fontSize: 13, color: "#E8A820" }}>
                  <strong>⚠️ Atención:</strong> {SOFT_FLAG_MESSAGES[softFlags[0]]}
                </div>
              ) : null;
            })()}

            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              <ScoreCircle
                value={scores.necesidad.score}
                label="Necesidad clínica"
                color={scores.necesidad.score >= 67 ? "#02C39A" : scores.necesidad.score >= 34 ? "#E8A820" : "#E85D5D"}
                description={scores.necesidad.label}
              />
              <ScoreCircle
                value={scores.regret.score}
                label="Riesgo de arrepentimiento"
                color={scores.regret.score >= 67 ? "#E85D5D" : scores.regret.score >= 34 ? "#E8A820" : "#02C39A"}
                description={scores.regret.label}
              />
              <ScoreCircle
                value={scores.urgencia.score}
                label="Timing"
                color={scores.urgencia.score >= 67 ? "#E85D5D" : scores.urgencia.score >= 34 ? "#E8A820" : "#02C39A"}
                description={scores.urgencia.label}
              />
            </div>

            {/* Top contributors */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: "#5A7A8A", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Hallazgos principales</div>
              {[...scores.necesidad.contributors.slice(0,1), ...scores.regret.contributors.slice(0,2)].map((c, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", marginBottom: 6,
                  background: c.impact > 0 ? "rgba(232,93,93,0.08)" : "rgba(2,195,154,0.08)",
                  borderLeft: `3px solid ${c.impact > 0 ? "#E85D5D" : "#02C39A"}`,
                  borderRadius: "0 8px 8px 0",
                }}>
                  <span style={{ flexShrink: 0 }}>{c.impact > 0 ? "⚠️" : "✓"}</span>
                  <div>
                    <div style={{ fontSize: 13, color: "#E0EAF0", fontWeight: 600, marginBottom: 2 }}>{c.variable}</div>
                    <div style={{ fontSize: 12, color: "#8BA3B8", lineHeight: 1.5 }}>{c.explanation}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Questions for the doctor */}
            <div style={{ background: "rgba(2,195,154,0.05)", border: "1px solid rgba(2,195,154,0.12)", borderRadius: 12, padding: 18, marginBottom: 28 }}>
              <div style={{ fontSize: 12, color: "#02C39A", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: 600 }}>
                3 preguntas para hacerle a tu médico(a)
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "¿Qué porcentaje de tus pacientes con un perfil como el mío reportan resultado significativo? Pídele un número.",
                  "Si solo pudiera hacerme la mitad de las sesiones, ¿qué resultado realista debería esperar?",
                  "¿Qué producto específico (marca y dosis) me aplicarías y desde cuándo lo viene usando esta clínica?",
                ].map((r, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ color: "#02C39A", flexShrink: 0, marginTop: 1 }}>→</span>
                    <span style={{ fontSize: 13, color: "#8BA3B8", lineHeight: 1.5 }}>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p style={{ fontSize: 11, color: "#4A6A7A", textAlign: "center", lineHeight: 1.6, marginBottom: 20 }}>
              Este diagnóstico es orientativo y forma parte de un prototipo en validación.
              No reemplaza el consejo de un profesional médico.
            </p>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Btn secondary onClick={onClose}>Cerrar</Btn>
              <Btn onClick={() => { onClose(); document.getElementById("acceso")?.scrollIntoView({behavior:"smooth"}); }}>
                Quiero el diagnóstico completo
              </Btn>
            </div>
          </div>
        )}

        {/* ─── RED FLAG ─── */}
        {stage === STAGES.REDFLAG && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛑</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#fff", marginBottom: 12 }}>
              Tu seguridad es lo primero
            </h3>
            <p style={{ fontSize: 15, color: "#8BA3B8", lineHeight: 1.7, marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
              {RED_FLAG_MESSAGES[redFlagType] || "Hemos detectado una condición que requiere atención médica directa antes de considerar cualquier procedimiento estético."}
            </p>
            <div style={{ background: "rgba(232,93,93,0.08)", border: "1px solid rgba(232,93,93,0.2)", borderRadius: 12, padding: 18, marginBottom: 28, textAlign: "left" }}>
              <div style={{ fontSize: 13, color: "#E85D5D", fontWeight: 600, marginBottom: 8 }}>Recomendación</div>
              <p style={{ fontSize: 13, color: "#8BA3B8", lineHeight: 1.6, margin: 0 }}>
                Consulta con tu médico tratante antes de considerar cualquier procedimiento estético.
                Este copiloto no puede continuar el análisis en estas condiciones porque tu seguridad está primero.
              </p>
            </div>
            <Btn onClick={onClose}>Entendido, cerrar</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Question Renderer ──────────────────────────────────────
function QuestionRenderer({ question, value, allAnswers, onAnswer, onBack, Btn, currentIdx, totalQuestions }) {
  const [localValue, setLocalValue] = useState(value || (question.type === 'multi_select' ? [] : ''));
  const [numericInput, setNumericInput] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || (question.type === 'multi_select' ? [] : ''));
    setNumericInput(value || '');
  }, [question.id, value]);

  const RadioOption = ({ label, selected, onClick, desc }) => (
    <button onClick={onClick} style={{
      display: "block", width: "100%", textAlign: "left",
      background: selected ? "rgba(2,195,154,0.08)" : "rgba(255,255,255,0.03)",
      border: selected ? "1px solid rgba(2,195,154,0.3)" : "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10, padding: "14px 18px", cursor: "pointer",
      transition: "all 0.2s", marginBottom: 8, fontFamily: "inherit",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 18, height: 18, borderRadius: question.type === 'multi_select' ? 4 : "50%",
          border: selected ? "2px solid #02C39A" : "2px solid rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {selected && <div style={{ width: 8, height: 8, borderRadius: question.type === 'multi_select' ? 2 : "50%", background: "#02C39A" }} />}
        </div>
        <div>
          <div style={{ fontSize: 14, color: "#E0EAF0", fontWeight: 500 }}>{label}</div>
          {desc && <div style={{ fontSize: 12, color: "#6B8FA3", marginTop: 2 }}>{desc}</div>}
        </div>
      </div>
    </button>
  );

  const canSubmit = () => {
    if (!question.required) return true;
    if (question.type === 'numeric') return numericInput !== '' && Number(numericInput) >= (question.min||0) && Number(numericInput) <= (question.max||999);
    if (question.type === 'multi_select') return localValue.length > 0;
    if (question.type === 'nps') return true;
    return localValue !== '';
  };

  const handleSubmit = () => {
    if (question.type === 'numeric') onAnswer(Number(numericInput));
    else if (question.type === 'nps') onAnswer(localValue || 5);
    else onAnswer(localValue);
  };

  const getOptions = () => {
    if (!question.options) return [];
    return question.options.map(o => typeof o === 'string' ? { value: o, label: o } : o);
  };

  return (
    <div>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: "#fff", marginBottom: 6 }}>
        {question.text}
      </h3>
      {question.helper && (
        <p style={{ fontSize: 13, color: "#6B8FA3", marginBottom: 20 }}>{question.helper}</p>
      )}

      {/* NUMERIC */}
      {question.type === 'numeric' && (
        <div style={{ marginBottom: 24 }}>
          <input
            type="number"
            value={numericInput}
            onChange={e => setNumericInput(e.target.value)}
            min={question.min} max={question.max}
            placeholder={`${question.min || ''} — ${question.max || ''}`}
            style={{
              width: "100%", padding: "14px 18px", fontSize: 18, borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
              color: "#fff", fontFamily: "inherit", textAlign: "center",
            }}
            onKeyDown={e => { if (e.key === 'Enter' && canSubmit()) handleSubmit(); }}
          />
        </div>
      )}

      {/* SINGLE SELECT */}
      {question.type === 'single_select' && (
        <div style={{ marginBottom: 24 }}>
          {getOptions().map(o => (
            <RadioOption
              key={o.value}
              label={o.label}
              selected={localValue === o.value}
              onClick={() => { setLocalValue(o.value); setTimeout(() => onAnswer(o.value), 200); }}
            />
          ))}
        </div>
      )}

      {/* MULTI SELECT */}
      {question.type === 'multi_select' && (
        <div style={{ marginBottom: 24 }}>
          {getOptions().map(o => {
            const isSelected = localValue.includes(o.value);
            const isExclusive = o.exclusive;
            return (
              <RadioOption
                key={o.value}
                label={o.label}
                selected={isSelected}
                onClick={() => {
                  let next;
                  if (isExclusive) {
                    next = isSelected ? [] : [o.value];
                  } else {
                    const withoutExclusive = localValue.filter(v => {
                      const opt = getOptions().find(x => x.value === v);
                      return !opt?.exclusive;
                    });
                    next = isSelected ? withoutExclusive.filter(v => v !== o.value) : [...withoutExclusive, o.value];
                  }
                  setLocalValue(next);
                }}
              />
            );
          })}
        </div>
      )}

      {/* TEXT SHORT */}
      {question.type === 'text_short' && (
        <div style={{ marginBottom: 24 }}>
          <textarea
            value={localValue}
            onChange={e => setLocalValue(e.target.value)}
            placeholder="Escribe tu respuesta..."
            rows={3}
            style={{
              width: "100%", padding: "14px 18px", fontSize: 14, borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
              color: "#fff", fontFamily: "inherit", resize: "vertical",
            }}
          />
        </div>
      )}

      {/* NPS */}
      {question.type === 'nps' && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
              <button key={n} onClick={() => setLocalValue(n)} style={{
                width: 40, height: 40, borderRadius: 8,
                background: localValue === n ? "rgba(2,195,154,0.2)" : "rgba(255,255,255,0.05)",
                border: localValue === n ? "2px solid #02C39A" : "1px solid rgba(255,255,255,0.1)",
                color: localValue === n ? "#02C39A" : "#8BA3B8",
                fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>{n}</button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#5A7A8A" }}>Nada probable</span>
            <span style={{ fontSize: 11, color: "#5A7A8A" }}>Muy probable</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      {question.type !== 'single_select' && (
        <div style={{ display: "flex", justifyContent: onBack ? "space-between" : "flex-end" }}>
          {onBack && <Btn secondary onClick={onBack}>Atrás</Btn>}
          <Btn onClick={handleSubmit} disabled={!canSubmit()}>
            {currentIdx >= totalQuestions - 1 ? "Ver mi análisis" : "Siguiente"}
          </Btn>
        </div>
      )}
      {question.type === 'single_select' && onBack && (
        <div style={{ marginTop: 8 }}>
          <Btn secondary onClick={onBack}>Atrás</Btn>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// ─── MAIN LANDING PAGE COMPONENT ──────────────────────────────
// ═══════════════════════════════════════════════════════════════
export default function CopilotoLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSubmit = () => {
    if (!email.includes("@")) return;
    const data = new FormData();
    data.append("EMAIL", email);
    fetch("https://us20.list-manage.com/subscribe/post?u=8f0b59d21d6f47bb53ef064b6&id=7833f3aa25", {
      method: "POST",
      body: data,
      mode: "no-cors"
    });
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#E0EAF0", background: "#0A1929", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        body { background: #0A1929; }

        .nav { position:fixed; top:0; left:0; right:0; z-index:100; transition: all 0.35s ease; }
        .nav-scrolled { background: rgba(10,25,41,0.92); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(2,195,154,0.08); }
        .nav-inner { max-width:1200px; margin:0 auto; padding:18px 28px; display:flex; align-items:center; justify-content:space-between; }
        .nav-logo { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:#fff; text-decoration:none; letter-spacing:-0.3px; }
        .nav-logo span { color:#02C39A; }
        .nav-links { display:flex; gap:32px; align-items:center; }
        .nav-link { color:#8BA3B8; font-size:14px; text-decoration:none; font-weight:500; transition:color 0.2s; cursor:pointer; }
        .nav-link:hover { color:#02C39A; }
        .nav-cta { background:linear-gradient(135deg,#028090,#02C39A); color:#fff; padding:10px 22px; border-radius:8px; font-size:13px; font-weight:600; text-decoration:none; border:none; cursor:pointer; transition:transform 0.2s, box-shadow 0.2s; }
        .nav-cta:hover { transform:translateY(-1px); box-shadow:0 4px 20px rgba(2,195,154,0.3); }
        .hamburger { display:none; background:none; border:none; cursor:pointer; padding:4px; }
        .hamburger span { display:block; width:22px; height:2px; background:#8BA3B8; margin:5px 0; transition:0.3s; }

        @media(max-width:768px) {
          .nav-links { display:none; }
          .hamburger { display:block; }
          .mobile-menu { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(10,25,41,0.98); z-index:99; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:28px; }
          .mobile-menu a { color:#E0EAF0; font-size:20px; text-decoration:none; font-weight:500; }
        }

        .section { max-width:1200px; margin:0 auto; padding:0 28px; }
        .hero { min-height:100vh; display:flex; flex-direction:column; justify-content:center; position:relative; overflow:hidden; }
        .hero-bg { position:absolute; top:0; left:0; right:0; bottom:0; background: radial-gradient(ellipse at 70% 20%, rgba(2,128,144,0.12) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(2,195,154,0.06) 0%, transparent 40%); }
        .hero-grid { position:absolute; top:0; left:0; right:0; bottom:0; background-image: linear-gradient(rgba(2,195,154,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(2,195,154,0.03) 1px, transparent 1px); background-size: 60px 60px; }
        .hero-content { position:relative; z-index:2; max-width:800px; }
        .hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(2,195,154,0.08); border:1px solid rgba(2,195,154,0.15); padding:6px 16px; border-radius:100px; font-size:12px; color:#02C39A; font-weight:500; margin-bottom:28px; letter-spacing:0.5px; text-transform:uppercase; }
        .hero-badge-dot { width:6px; height:6px; border-radius:50%; background:#02C39A; animation: pulse-dot 2s infinite; }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .hero h1 { font-family:'Playfair Display',serif; font-size:clamp(36px,5.5vw,64px); line-height:1.1; color:#fff; font-weight:700; margin-bottom:24px; letter-spacing:-1px; }
        .hero h1 em { font-style:italic; color:#02C39A; }
        .hero-sub { font-size:clamp(16px,2vw,20px); color:#8BA3B8; line-height:1.7; max-width:620px; margin-bottom:40px; font-weight:300; }
        .hero-actions { display:flex; gap:14px; flex-wrap:wrap; align-items:center; }
        .hero-input-wrap { display:flex; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:10px; overflow:hidden; }
        .hero-input { background:transparent; border:none; outline:none; padding:14px 18px; color:#fff; font-size:15px; width:260px; font-family:inherit; }
        .hero-input::placeholder { color:#5A7A8A; }
        .hero-btn { background:linear-gradient(135deg,#028090,#02C39A); color:#fff; padding:14px 28px; border:none; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.25s; font-family:inherit; }
        .hero-btn:hover { filter:brightness(1.1); }
        .hero-success { color:#02C39A; font-size:15px; font-weight:500; display:flex; align-items:center; gap:8px; }
        .hero-scroll { position:absolute; bottom:40px; left:50%; transform:translateX(-50%); color:#5A7A8A; animation: float 3s ease-in-out infinite; cursor:pointer; }
        @keyframes float { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        .hero-stats { display:flex; gap:40px; margin-top:48px; padding-top:32px; border-top:1px solid rgba(255,255,255,0.06); }
        .hero-stat-num { font-family:'Playfair Display',serif; font-size:32px; color:#02C39A; font-weight:700; }
        .hero-stat-label { font-size:12px; color:#5A7A8A; text-transform:uppercase; letter-spacing:1px; margin-top:4px; }
        .problem { padding:120px 0; position:relative; }
        .problem::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(2,195,154,0.15),transparent); }
        .section-label { font-size:11px; text-transform:uppercase; letter-spacing:3px; color:#028090; font-weight:600; margin-bottom:12px; }
        .section-title { font-family:'Playfair Display',serif; font-size:clamp(28px,4vw,44px); color:#fff; font-weight:700; line-height:1.2; margin-bottom:20px; letter-spacing:-0.5px; }
        .section-desc { font-size:17px; color:#6B8FA3; line-height:1.7; max-width:600px; margin-bottom:56px; font-weight:300; }
        .tensions-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(340px,1fr)); gap:20px; }
        .tension-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:14px; padding:32px; transition:all 0.3s; position:relative; overflow:hidden; }
        .tension-card:hover { border-color:rgba(2,195,154,0.2); background:rgba(2,195,154,0.03); transform:translateY(-2px); }
        .tension-num { font-family:'Playfair Display',serif; font-size:48px; color:rgba(2,195,154,0.1); font-weight:700; position:absolute; top:16px; right:24px; }
        .tension-icon { color:#028090; margin-bottom:16px; }
        .tension-title { font-size:16px; font-weight:600; color:#fff; margin-bottom:10px; }
        .tension-desc { font-size:14px; color:#6B8FA3; line-height:1.7; }
        .solution { padding:120px 0; position:relative; background:linear-gradient(180deg, transparent 0%, rgba(2,128,144,0.04) 50%, transparent 100%); }
        .solution-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
        @media(max-width:900px) { .solution-grid { grid-template-columns:1fr; gap:48px; } }
        .solution-visual { position:relative; }
        .solution-mockup { background:linear-gradient(135deg,rgba(2,128,144,0.08),rgba(2,195,154,0.05)); border:1px solid rgba(2,195,154,0.12); border-radius:20px; padding:40px; position:relative; }
        .mockup-header { display:flex; align-items:center; gap:8px; margin-bottom:28px; }
        .mockup-dot { width:10px; height:10px; border-radius:50%; }
        .mockup-bar { height:32px; border-radius:8px; margin-bottom:12px; }
        .mockup-scores { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:24px; }
        .mockup-score { background:rgba(255,255,255,0.04); border-radius:10px; padding:20px; text-align:center; }
        .mockup-score-val { font-family:'Playfair Display',serif; font-size:36px; font-weight:700; }
        .mockup-score-label { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#6B8FA3; margin-top:6px; }
        .mockup-glow { position:absolute; width:200px; height:200px; border-radius:50%; filter:blur(80px); opacity:0.2; }
        .solution-features { list-style:none; display:flex; flex-direction:column; gap:20px; margin-top:32px; }
        .solution-feature { display:flex; gap:14px; align-items:flex-start; }
        .solution-feature-text { font-size:15px; color:#8BA3B8; line-height:1.6; }
        .solution-feature-text strong { color:#fff; font-weight:600; }
        .how { padding:120px 0; }
        .steps { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; margin-top:60px; position:relative; }
        .steps::before { content:''; position:absolute; top:40px; left:12%; right:12%; height:1px; background:linear-gradient(90deg, rgba(2,195,154,0.3), rgba(2,128,144,0.1)); }
        @media(max-width:900px) { .steps { grid-template-columns:1fr 1fr; } .steps::before { display:none; } }
        @media(max-width:500px) { .steps { grid-template-columns:1fr; } }
        .step { text-align:center; position:relative; z-index:1; }
        .step-num { width:56px; height:56px; border-radius:50%; background:linear-gradient(135deg,#028090,#02C39A); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:#fff; box-shadow:0 0 30px rgba(2,195,154,0.2); }
        .step-title { font-size:15px; font-weight:600; color:#fff; margin-bottom:8px; }
        .step-desc { font-size:13px; color:#6B8FA3; line-height:1.6; max-width:220px; margin:0 auto; }
        .demo-section { padding:80px 0; position:relative; }
        .demo-card { background: linear-gradient(135deg, rgba(2,128,144,0.1), rgba(2,195,154,0.05)); border:1px solid rgba(2,195,154,0.15); border-radius:24px; padding:56px 40px; text-align:center; position:relative; overflow:hidden; }
        .demo-card::before { content:''; position:absolute; top:-100px; right:-100px; width:300px; height:300px; border-radius:50%; background:rgba(2,195,154,0.04); filter:blur(60px); }
        .demo-btn { background:linear-gradient(135deg,#028090,#02C39A); color:#fff; padding:16px 40px; border-radius:12px; font-size:17px; font-weight:700; border:none; cursor:pointer; font-family:inherit; transition:all 0.3s; box-shadow:0 4px 30px rgba(2,195,154,0.25); }
        .demo-btn:hover { transform:translateY(-2px); box-shadow:0 8px 40px rgba(2,195,154,0.35); }
        .validation { padding:120px 0; background:linear-gradient(180deg, transparent, rgba(2,128,144,0.03), transparent); }
        .val-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:24px; margin-top:48px; }
        .val-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:16px; padding:36px 28px; text-align:center; transition:all 0.3s; }
        .val-card:hover { border-color:rgba(2,195,154,0.2); transform:translateY(-3px); }
        .val-num { font-family:'Playfair Display',serif; font-size:48px; font-weight:700; background:linear-gradient(135deg,#02C39A,#028090); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1.1; }
        .val-label { font-size:14px; color:#8BA3B8; margin-top:10px; line-height:1.5; }
        .val-caption { margin-top:48px; font-size:14px; color:#5A7A8A; text-align:center; line-height:1.7; max-width:700px; margin-left:auto; margin-right:auto; font-style:italic; }
        .credibility { padding:100px 0; }
        .cred-card { background:linear-gradient(135deg,rgba(2,128,144,0.06),rgba(2,195,154,0.03)); border:1px solid rgba(2,195,154,0.1); border-radius:20px; padding:56px; display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
        @media(max-width:768px) { .cred-card { grid-template-columns:1fr; padding:36px 28px; } }
        .cred-stats { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        .cred-stat { text-align:center; }
        .cred-stat-num { font-family:'Playfair Display',serif; font-size:36px; font-weight:700; color:#02C39A; }
        .cred-stat-label { font-size:12px; color:#6B8FA3; text-transform:uppercase; letter-spacing:1px; margin-top:6px; }
        .cta-final { padding:120px 0; text-align:center; position:relative; }
        .cta-final::before { content:''; position:absolute; top:50%; left:50%; width:600px; height:600px; transform:translate(-50%,-50%); border-radius:50%; background:radial-gradient(circle,rgba(2,195,154,0.06),transparent 60%); }
        .cta-final .section-title { max-width:700px; margin:0 auto 20px; }
        .cta-final .section-desc { max-width:500px; margin:0 auto 40px; text-align:center; }
        .footer { border-top:1px solid rgba(255,255,255,0.05); padding:40px 0; }
        .footer-inner { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; }
        .footer-text { font-size:13px; color:#4A6A7A; }
        .footer-links { display:flex; gap:24px; }
        .footer-link { font-size:13px; color:#5A7A8A; text-decoration:none; transition:color 0.2s; }
        .footer-link:hover { color:#02C39A; }
      `}</style>

      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* NAV */}
      <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">Copiloto<span> Estético</span></a>
          <div className="nav-links">
            <a href="#problema" className="nav-link">El problema</a>
            <a href="#solucion" className="nav-link">La solución</a>
            <a href="#demo" className="nav-link">Diagnóstico</a>
            <a href="#validacion" className="nav-link">Validación</a>
            <button className="nav-cta" onClick={() => setDemoOpen(true)}>Evaluar mi decisión</button>
          </div>
          <button className="hamburger" onClick={() => setMobileMenu(!mobileMenu)}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {mobileMenu && (
        <div className="mobile-menu" onClick={() => setMobileMenu(false)}>
          <a href="#problema">El problema</a>
          <a href="#solucion">La solución</a>
          <a href="#demo">Diagnóstico</a>
          <a href="#validacion">Validación</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenu(false); setDemoOpen(true); }} style={{color:"#02C39A"}}>Evaluar mi decisión</a>
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"/>
        <div className="hero-grid"/>
        <div className="section hero-content">
          <FadeIn>
            <div className="hero-badge"><span className="hero-badge-dot"/> Disponible ahora</div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1>No dejes que una mala decisión<br/><em>te marque para siempre.</em></h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="hero-sub">
              La mayoría de personas toma decisiones estéticas sin entender los riesgos,
              las alternativas ni las consecuencias. El Copiloto Estético es la primera herramienta
              de análisis que te ayuda a entender si un procedimiento realmente tiene sentido para ti — antes de que sea tarde.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="hero-actions" style={{gap:14}}>
              <button className="demo-btn" onClick={() => setDemoOpen(true)} style={{padding:"14px 32px", fontSize:15, borderRadius:10}}>
                Evaluar mi decisión ahora
              </button>
              <a href="#acceso" style={{color:"#8BA3B8",fontSize:14,textDecoration:"none",fontWeight:500}}>
                o regístrate para acceso anticipado ↓
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">+15</div>
                <div className="hero-stat-label">Años en el sector</div>
              </div>
              <div>
                <div className="hero-stat-num">96%</div>
                <div className="hero-stat-label">Quiere esta herramienta</div>
              </div>
              <div>
                <div className="hero-stat-num">89%</div>
                <div className="hero-stat-label">Considera vital entender riesgos</div>
              </div>
            </div>
          </FadeIn>
        </div>
        <a href="#problema" className="hero-scroll"><IconArrowDown/></a>
      </section>

      {/* PROBLEM */}
      <section className="problem" id="problema">
        <div className="section">
          <FadeIn>
            <div className="section-label">El problema</div>
            <div className="section-title">
              En medicina estética, es fácil<br/>
              <em style={{fontFamily:"'Playfair Display',serif",color:"#02C39A",fontStyle:"italic"}}>decidir rápido</em> y arrepentirse después.
            </div>
            <div className="section-desc">
              Sobretratamiento. Arrepentimiento. Resultados inesperados.
              Más de una década observando estas decisiones revelaron cinco tensiones
              que casi nadie está resolviendo.
            </div>
          </FadeIn>
          <div className="tensions-grid">
            {[
              { icon: <IconScale/>, num: "01", title: "Incentivos a la sobreintervención", desc: "El ingreso del profesional crece con cada procedimiento realizado, no con la salud o satisfacción del paciente." },
              { icon: <IconEye/>, num: "02", title: "Asimetría de información", desc: "El paciente no sabe qué necesita. El médico sí — y tiene incentivos económicos para recomendar más, no menos." },
              { icon: <IconBrain/>, num: "03", title: "Sesgos cognitivos", desc: "Efecto framing, anclaje, aversión a la pérdida, presión social. Las decisiones estéticas rara vez son racionales." },
              { icon: <IconTarget/>, num: "04", title: "Sobre-diagnóstico", desc: "Mientras más se examina, más 'imperfecciones' aparecen. El sistema crea necesidades que antes no existían." },
              { icon: <IconShield/>, num: "05", title: "Sin herramientas neutrales", desc: "Hoy toda la información depende de quien vende el servicio. No existe un árbitro independiente del paciente." },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="tension-card">
                  <div className="tension-num">{t.num}</div>
                  <div className="tension-icon">{t.icon}</div>
                  <div className="tension-title">{t.title}</div>
                  <div className="tension-desc">{t.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="solution" id="solucion">
        <div className="section">
          <div className="solution-grid">
            <div>
              <FadeIn>
                <div className="section-label">La solución</div>
                <div className="section-title">Tu copiloto de decisión<br/>en medicina estética</div>
                <div className="section-desc">
                  No un marketplace. No un chatbot. Un árbitro racional en un mercado emocional
                  que te dice lo que nadie más te va a decir — incluyendo si NO deberías hacerte ese tratamiento.
                </div>
              </FadeIn>
              <FadeIn delay={0.15}>
                <ul className="solution-features">
                  {[
                    { title: "Análisis de riesgo personalizado", desc: "Evaluamos tu perfil, historial y motivaciones para identificar riesgos que la consulta tradicional no alcanza a cubrir." },
                    { title: "Evaluación de necesidad real", desc: "¿Realmente lo necesitas, o es un impulso? Te ayudamos a distinguir entre deseo informado y presión social." },
                    { title: "Alternativas que no conocías", desc: "Antes de decidir, ve todas las opciones — incluyendo no hacer nada." },
                    { title: "100% independiente", desc: "No vendemos procedimientos. No recibimos comisiones. Nuestra única misión es que tomes la mejor decisión posible." },
                  ].map((f, i) => (
                    <li key={i} className="solution-feature">
                      <div style={{flexShrink:0,marginTop:2}}><IconCheck/></div>
                      <div className="solution-feature-text"><strong>{f.title}.</strong> {f.desc}</div>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>
            <FadeIn delay={0.2}>
              <div className="solution-visual">
                <div className="solution-mockup">
                  <div className="mockup-glow" style={{top:"-40px",right:"-40px",background:"#028090"}}/>
                  <div className="mockup-glow" style={{bottom:"-40px",left:"-40px",background:"#02C39A"}}/>
                  <div className="mockup-header">
                    <div className="mockup-dot" style={{background:"#02C39A"}}/>
                    <span style={{fontSize:13,color:"#8BA3B8",fontWeight:500}}>Copiloto Estético</span>
                  </div>
                  <div style={{fontSize:11,color:"#5A7A8A",textTransform:"uppercase",letterSpacing:2,marginBottom:16}}>Resultado de tu análisis</div>
                  <div className="mockup-scores">
                    <div className="mockup-score">
                      <div className="mockup-score-val" style={{color:"#02C39A"}}>72</div>
                      <div className="mockup-score-label">Índice de riesgo</div>
                    </div>
                    <div className="mockup-score">
                      <div className="mockup-score-val" style={{color:"#028090"}}>45</div>
                      <div className="mockup-score-label">Necesidad real</div>
                    </div>
                  </div>
                  <div style={{marginTop:24}}>
                    {["Motivación principal: presión social","Expectativas: desalineadas con realidad clínica","Recomendación: explorar alternativas"].map((t,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                        <div style={{width:4,height:4,borderRadius:2,background:i===2?"#02C39A":"#028090",flexShrink:0}}/>
                        <span style={{fontSize:12,color:"#8BA3B8"}}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="como">
        <div className="section">
          <FadeIn>
            <div style={{textAlign:"center"}}>
              <div className="section-label">Cómo funciona</div>
              <div className="section-title">4 pasos hacia una decisión<br/>que no vas a lamentar</div>
            </div>
          </FadeIn>
          <div className="steps">
            {[
              { num: "1", title: "Cuéntanos sobre ti", desc: "Tu perfil de salud, historial estético y contexto personal." },
              { num: "2", title: "Define tu interés", desc: "¿Qué procedimiento consideras y cuál es tu motivación principal?" },
              { num: "3", title: "Análisis inteligente", desc: "Nuestro motor cruza tu perfil con evidencia clínica real y detecta señales de alerta." },
              { num: "4", title: "La verdad sobre tu decisión", desc: "Recibes un diagnóstico honesto: nivel de riesgo, necesidad real, y lo que nadie más te diría." },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="step">
                  <div className="step-num">{s.num}</div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO CTA */}
      <section className="demo-section" id="demo">
        <div className="section">
          <FadeIn>
            <div className="demo-card">
              <div style={{fontSize:48,marginBottom:16}}>🧭</div>
              <div className="section-title" style={{marginBottom:12}}>¿Estás a punto de tomar una mala decisión?</div>
              <p style={{fontSize:17,color:"#8BA3B8",lineHeight:1.7,maxWidth:500,margin:"0 auto 32px",fontWeight:300}}>
                Descúbrelo en menos de 8 minutos. Responde 20 preguntas y recibe
                un diagnóstico personalizado de tu decisión estética — con riesgos reales,
                no promesas vacías.
              </p>
              <button className="demo-btn" onClick={() => setDemoOpen(true)}>
                Evaluar si este tratamiento es para mí
              </button>
              <p style={{fontSize:12,color:"#4A6A7A",marginTop:16}}>Sin registro. Sin costo. Resultados inmediatos.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* VALIDATION */}
      <section className="validation" id="validacion">
        <div className="section">
          <FadeIn>
            <div style={{textAlign:"center"}}>
              <div className="section-label">Validación con usuarios reales</div>
              <div className="section-title">Validado con usuarios reales</div>
              <div className="section-desc" style={{maxWidth:600,margin:"0 auto 0"}}>
                No son proyecciones. Son respuestas reales de personas que están considerando
                procedimientos estéticos ahora mismo.
              </div>
            </div>
          </FadeIn>
          <div className="val-grid">
            {[
              { num: "96%", label: "usaría la herramienta antes de decidir un tratamiento" },
              { num: "89%", label: "considera muy importante entender riesgos antes de decidir" },
              { num: "68%", label: "dedicaría 1 hora o más a analizar su decisión" },
              { num: "85%", label: "está considerando un tratamiento estético actualmente" },
            ].map((v, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="val-card">
                  <div className="val-num">{v.num}</div>
                  <div className="val-label">{v.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div className="val-caption">
              "El 89% dice que entender riesgos es muy importante. Pero hoy, casi toda la información
              disponible viene de quien te vende el tratamiento. Esa contradicción es exactamente
              el problema que resolvemos."
              <br/><br/>
              <span style={{fontSize:12,fontStyle:"normal"}}>Fuente: Encuesta propia abril 2026 · 91 respuestas · Mujeres Colombia</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CREDIBILITY */}
      <section className="credibility">
        <div className="section">
          <FadeIn>
            <div className="cred-card">
              <div>
                <div className="section-label" style={{marginBottom:16}}>Quién está detrás</div>
                <div className="section-title" style={{fontSize:"clamp(24px,3vw,34px)",marginBottom:16}}>
                  Construido por alguien que ha visto<br/>miles de decisiones estéticas
                </div>
                <p style={{fontSize:15,color:"#8BA3B8",lineHeight:1.7}}>
                  Esta herramienta no nace de un laboratorio. Nace de la observación directa,
                  durante más de una década, de cómo se toman — y a veces se arrepienten —
                  decisiones estéticas en la vida real. El Copiloto Estético existe para mover
                  esa observación de la intuición de pocos al beneficio de muchos.
                </p>
              </div>
              <div className="cred-stats">
                <div className="cred-stat">
                  <div className="cred-stat-num">+15</div>
                  <div className="cred-stat-label">Años en el sector</div>
                </div>
                <div className="cred-stat">
                  <div className="cred-stat-num">4</div>
                  <div className="cred-stat-label">Disciplinas académicas</div>
                </div>
                <div className="cred-stat">
                  <div className="cred-stat-num">0</div>
                  <div className="cred-stat-label">Comisiones de clínicas</div>
                </div>
                <div className="cred-stat">
                  <div className="cred-stat-num">1</div>
                  <div className="cred-stat-label">Propósito: decidir bien</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final" id="acceso">
        <div className="section" style={{position:"relative",zIndex:2}}>
          <FadeIn>
            <div className="section-label">No te arriesgues</div>
            <div className="section-title">
              Antes de que alguien decida por ti,<br/>
              <em style={{fontFamily:"'Playfair Display',serif",color:"#02C39A",fontStyle:"italic"}}>evalúa tu decisión con claridad</em>
            </div>
            <div className="section-desc">
              Estamos construyendo la herramienta que todavía no existe en la industria estética.
              Si crees que mereces tomar decisiones informadas sobre tu propio cuerpo,
              únete ahora.
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            {!submitted ? (
              <div style={{display:"flex",justifyContent:"center"}}>
                <div className="hero-input-wrap">
                  <input className="hero-input" type="email" placeholder="Tu correo electrónico" value={email}
                    onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
                  <button className="hero-btn" onClick={handleSubmit}>Quiero proteger mi decisión</button>
                </div>
              </div>
            ) : (
              <div className="hero-success" style={{justifyContent:"center"}}>
                <IconCheck /> ¡Listo! Te avisaremos cuando lancemos.
              </div>
            )}
          </FadeIn>
          <FadeIn delay={0.25}>
            <p style={{fontSize:12,color:"#4A6A7A",marginTop:16}}>Sin spam. Sin compromisos. Solo acceso prioritario cuando lancemos.</p>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="section">
          <div className="footer-inner">
            <div>
              <a href="#" className="nav-logo" style={{fontSize:18}}>Copiloto<span> Estético</span></a>
              <div className="footer-text" style={{marginTop:8}}>Democratizando el análisis de las decisiones.</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="footer-text">
                Un proyecto con el acompañamiento y la asesoría de <a href="https://promoestetica.com" style={{color:"#02C39A",textDecoration:"none"}} target="_blank" rel="noopener">Promoestética</a>
              </div>
              <div className="footer-text" style={{marginTop:4}}>
                © {new Date().getFullYear()} Copiloto Estético. Bogotá, Colombia.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
