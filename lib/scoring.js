// lib/scoring.js
// v5 — Scoring determinístico de los 3 scores del Copiloto
// Explicaciones reescritas SIN cifras propietarias específicas.
// Source of truth: specs/001-landing-wizard-de-oz/data-model.md §4
// Principios: II (datos reales), VI (transparencia)

// ─────────────────────────────────────────────────────────────────────────
// SCORE 1 — NECESIDAD CLÍNICA
// ─────────────────────────────────────────────────────────────────────────

const TREATMENT_MOTIVATION_FIT = {
  ah: { 'Rejuvenecimiento facial / reafirmación': 25, 'Corregir una característica específica (tamaño, forma, simetría)': 20 },
  toxin: { 'Rejuvenecimiento facial / reafirmación': 25, 'Mantenerme en buen estado / mantenimiento preventivo': 15 },
  rf: { 'Tonificar o reafirmar el cuerpo': 20, 'Reducir celulitis o adiposidad localizada': 18, 'Rejuvenecimiento facial / reafirmación': 15 },
  hypersculpt: { 'Tonificar o reafirmar el cuerpo': 25, 'Reducir celulitis o adiposidad localizada': 10 },
  laser: { 'Eliminar vello no deseado': 30 },
};

const OPTIMAL_SESSIONS = {
  ah: { min: 1, max: 3 },
  toxin: { min: 1, max: 2 },
  rf: { min: 8, max: 12 },
  hypersculpt: { min: 6, max: 10 },
  laser: { min: 6, max: 8 },
};

const SESSION_LABEL_TO_N = {
  '1 sola sesión': 1,
  '2-3 sesiones': 2.5,
  '4-6 sesiones': 5,
  '7-10 sesiones': 8.5,
  'Más de 10 sesiones': 12,
  'No me han dicho / no sé': null,
};

const URGENCY_REALISTIC_WINDOWS = {
  ah: ['urgent', 'short', 'medium', 'flexible'],
  toxin: ['urgent', 'short', 'medium', 'flexible'],
  rf: ['medium', 'flexible'],
  hypersculpt: ['medium', 'flexible'],
  laser: ['flexible'],
};

export function computeNecesidad(answers) {
  let score = 50;
  const contributors = [];

  const tx = answers.q08_treatment;
  const mot = answers.q11_motivation_category;
  const fit = TREATMENT_MOTIVATION_FIT[tx]?.[mot] ?? -15;
  score += fit;
  contributors.push({
    variable: 'Alineación tratamiento ↔ motivación',
    impact: fit,
    explanation: fit > 0
      ? `Tu motivación ("${mot}") es de las que mejor responden a este tratamiento.`
      : `Hay mejor ajuste entre tu motivación ("${mot}") y otros tratamientos. Vale la pena considerarlos.`,
  });

  const expectedN = SESSION_LABEL_TO_N[answers.q12_expected_sessions];
  const optimal = OPTIMAL_SESSIONS[tx];
  if (expectedN !== null && optimal) {
    if (expectedN < optimal.min) {
      score -= 20;
      contributors.push({
        variable: 'Dosis esperada vs. dosis óptima',
        impact: -20,
        explanation: `Crees que necesitas ${answers.q12_expected_sessions}, pero este tratamiento normalmente requiere entre ${optimal.min} y ${optimal.max} sesiones para mostrar resultado consistente.`,
      });
    } else if (expectedN > optimal.max + 2) {
      score -= 15;
      contributors.push({
        variable: 'Dosis esperada vs. dosis óptima',
        impact: -15,
        explanation: `La dosis que te mencionaron (${answers.q12_expected_sessions}) excede el rango óptimo recomendado (${optimal.min}-${optimal.max} sesiones).`,
      });
    } else {
      score += 10;
      contributors.push({
        variable: 'Dosis esperada vs. dosis óptima',
        impact: +10,
        explanation: `La dosis que te mencionaron (${answers.q12_expected_sessions}) está alineada con el rango óptimo para este tratamiento.`,
      });
    }
  }

  const urgency = answers.q14_urgency;
  const realisticWindows = URGENCY_REALISTIC_WINDOWS[tx] || [];
  if (!realisticWindows.includes(urgency)) {
    score -= 25;
    contributors.push({
      variable: 'Urgencia vs. tiempo real',
      impact: -25,
      explanation: `Este tratamiento normalmente toma más tiempo del que tienes disponible para ver resultado. Existe riesgo alto de frustración por timing.`,
    });
  }

  score = Math.max(0, Math.min(100, score));
  return { score, contributors: contributors.slice(0, 3), label: interpretNecesidad(score) };
}

function interpretNecesidad(score) {
  if (score >= 67) return 'Tiene sentido clínico proceder';
  if (score >= 34) return 'Proceder con cautela';
  return 'Reconsiderar si vale la pena';
}

// ─────────────────────────────────────────────────────────────────────────
// SCORE 2 — RIESGO DE REGRET
// ─────────────────────────────────────────────────────────────────────────

export function computeRegret(answers) {
  let score = 30;
  const contributors = [];

  const channel = answers.q07_channel;
  const channelImpact = { social: 15, ad: 10, self: 0, medical: -5, referral: -10 };
  const c = channelImpact[channel] ?? 0;
  score += c;
  contributors.push({
    variable: 'Canal por el que conociste el tratamiento',
    impact: c,
    explanation: channel === 'social' || channel === 'ad'
      ? 'Llegar a un tratamiento estético por redes sociales o publicidad correlaciona con expectativas más altas que la realidad clínica. El filtro visual cambia lo que esperamos.'
      : channel === 'referral'
      ? 'Llegar referida por una amiga correlaciona con expectativas mejor calibradas, porque alguien cercana ya pasó por el proceso y te lo explicó honestamente.'
      : 'Canal neutral en términos de calibración de expectativas.',
  });

  const exp = answers.q15_expectation;
  const tx = answers.q08_treatment;
  const isAparatologia = tx === 'rf' || tx === 'hypersculpt';
  if (exp === 'dramatic') {
    score += 20;
    if (isAparatologia) {
      score += 10;
      contributors.push({
        variable: 'Expectativa vs. realidad del tratamiento',
        impact: +30,
        explanation: 'Esperas un cambio dramático, pero la aparatología (radiofrecuencia, Hypersculpt) produce cambios progresivos y notables, no dramáticos. Existe alto riesgo de mismatch.',
      });
    } else {
      contributors.push({
        variable: 'Expectativa vs. realidad',
        impact: +20,
        explanation: 'Expectativa alta — posible brecha entre lo que imaginas y lo que el tratamiento realmente logra.',
      });
    }
  } else if (exp === 'subtle') {
    score -= 15;
    contributors.push({
      variable: 'Expectativa vs. realidad',
      impact: -15,
      explanation: 'Expectativa bien calibrada. Alta probabilidad de salir satisfecha con el resultado.',
    });
  }

  const tol = answers.q16_tolerance;
  if (tol === 'frustrated' || tol === 'demanding') {
    score += 25;
    contributors.push({
      variable: 'Tolerancia a un resultado sutil inicial',
      impact: +25,
      explanation: 'Baja tolerancia a resultados ambiguos o que toman tiempo. Muchos tratamientos muestran resultado pleno solo después de varias semanas.',
    });
  }

  const prof = answers.q17_professional;
  const profImpact = { known: -10, recommended: -5, social: +10, unknown: +15 };
  if (profImpact[prof]) {
    score += profImpact[prof];
    contributors.push({
      variable: 'Relación con el profesional',
      impact: profImpact[prof],
      explanation: prof === 'unknown'
        ? 'No saber dónde te aplicarían el tratamiento es un factor operacional importante de riesgo. La variabilidad de resultados entre profesionales puede ser muy alta.'
        : prof === 'known'
        ? 'Tener un profesional de confianza es uno de los factores más protectores. Estás en buena posición.'
        : 'Relación moderadamente calibrada con el profesional.',
    });
  }

  if ((tx === 'ah' || tx === 'toxin') && answers.q18_product_knowledge === 'none') {
    score += 15;
    contributors.push({
      variable: 'Conocimiento del producto específico',
      impact: +15,
      explanation: 'En inyectables, no saber qué marca, dosis o lote te aplicarían es una asimetría informativa relevante. Vale la pena preguntar antes de la cita.',
    });
  }

  const medical = answers.q03_medical || [];
  if (medical.includes('autoimmune')) score += 10;
  if (medical.includes('anticoagulant')) score += 10;

  if (answers.q19_minimum_acceptable === 'no_cheated') {
    score += 20;
    contributors.push({
      variable: 'Realismo del mínimo aceptable',
      impact: +20,
      explanation: 'Declararías sentirte estafada con la mitad del resultado imaginado. Existe alta probabilidad de regret si el resultado real no alcanza tu expectativa mental.',
    });
  } else if (answers.q19_minimum_acceptable === 'yes_content') {
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));
  contributors.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  return { score, contributors: contributors.slice(0, 3), label: interpretRegret(score) };
}

function interpretRegret(score) {
  if (score >= 67) return 'Riesgo alto — revisa con cuidado';
  if (score >= 34) return 'Riesgo moderado';
  return 'Riesgo bajo';
}

// ─────────────────────────────────────────────────────────────────────────
// SCORE 3 — URGENCIA / VENTANA TEMPORAL
// ─────────────────────────────────────────────────────────────────────────

const TIME_TO_PLATEAU_DAYS = {
  ah: 14, toxin: 14, rf: 90, hypersculpt: 90, laser: 180,
};

const EXPECTED_WINDOW_DAYS = {
  urgent: 30, short: 90, medium: 180, flexible: 365,
};

export function computeUrgencia(answers) {
  const tx = answers.q08_treatment;
  const urg = answers.q14_urgency;
  const plateau = TIME_TO_PLATEAU_DAYS[tx];
  const window = EXPECTED_WINDOW_DAYS[urg];
  if (!plateau || !window) return { score: 50, contributors: [], label: 'Sin datos suficientes' };

  const ratio = plateau / window;
  let score;
  let explanation;
  if (ratio > 1.5) {
    score = 80;
    explanation = 'El tiempo que este tratamiento necesita para mostrar resultado es muy superior a tu ventana. Alta probabilidad de frustración por timing.';
  } else if (ratio > 1.0) {
    score = 55;
    explanation = 'Ventana temporal ajustada. Es posible que veas resultado, pero justo al límite.';
  } else if (ratio > 0.5) {
    score = 30;
    explanation = 'Ventana razonable para este tratamiento.';
  } else {
    score = 15;
    explanation = 'Tienes tiempo de sobra. Puedes avanzar sin presión.';
  }

  return {
    score,
    contributors: [{ variable: 'Tiempo del tratamiento vs. tu expectativa de tiempo', impact: score, explanation }],
    label: score >= 67 ? 'Timing mal calibrado' : score >= 34 ? 'Timing ajustado' : 'Timing cómodo',
  };
}

export function computeAllScores(answers) {
  return {
    necesidad: computeNecesidad(answers),
    regret: computeRegret(answers),
    urgencia: computeUrgencia(answers),
  };
}
