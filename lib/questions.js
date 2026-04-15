// lib/questions.js
// Feature 001 · Las 20 preguntas del Mago de Oz v4
// Source of truth: specs/001-landing-wizard-de-oz/data-model.md
// Principios constitucionales: II (datos reales), III (expectativa antes que opciones), IV (seguridad clínica), IX (lenguaje)

export const BLOCKS = {
  CONTEXT: 'Contexto personal',
  TREATMENT: 'Tratamiento y motivación',
  EXPECTATION: 'Expectativa y decisión',
};

export const questions = [
  // ═══════════════════════ BLOQUE 1 — CONTEXTO (Q01-Q07) ═══════════════════════
  {
    id: 'q01_age',
    block: BLOCKS.CONTEXT,
    order: 1,
    type: 'numeric',
    text: '¿Qué edad tienes?',
    helper: 'Necesitamos esto para calibrar con gente de tu rango de edad.',
    required: true,
    min: 13,
    max: 90,
    redFlag: (v) => {
      if (v < 18) return { level: 'RED', type: 'MINOR' };
      if (v > 75) return { level: 'SOFT', type: 'ELDER' };
      return null;
    },
  },
  {
    id: 'q02_gender',
    block: BLOCKS.CONTEXT,
    order: 2,
    type: 'single_select',
    text: '¿Con qué género te identificas?',
    options: ['Mujer', 'Hombre', 'No binario / Prefiero no responder'],
    required: true,
  },
  {
    id: 'q03_medical',
    block: BLOCKS.CONTEXT,
    order: 3,
    type: 'multi_select',
    text: '¿Alguna de estas situaciones aplica a ti actualmente?',
    helper: 'Puedes seleccionar varias. Esto es lo más importante para tu seguridad.',
    options: [
      { value: 'pregnancy', label: 'Estoy embarazada o podría estarlo', flag: { level: 'RED', type: 'PREGNANCY' } },
      { value: 'breastfeeding', label: 'Estoy en período de lactancia', flag: { level: 'RED', type: 'BREASTFEEDING' } },
      { value: 'autoimmune', label: 'Tengo una enfermedad autoinmune (lupus, artritis reumatoide, psoriasis)', flag: { level: 'SOFT', type: 'AUTOIMMUNE' } },
      { value: 'allergy_history', label: 'Tengo antecedentes de reacciones alérgicas a medicamentos o cosméticos' },
      { value: 'anticoagulant', label: 'Tomo anticoagulantes (warfarina, rivaroxabán, etc.)', flag: { level: 'SOFT', type: 'ANTICOAGULANT' } },
      { value: 'recent_surgery', label: 'Tuve una cirugía en los últimos 3 meses', flag: { level: 'SOFT', type: 'RECENT_SURGERY' } },
      { value: 'none', label: 'Ninguna de las anteriores', exclusive: true },
    ],
    required: true,
  },
  {
    id: 'q04_allergy_detail',
    block: BLOCKS.CONTEXT,
    order: 4,
    type: 'multi_select',
    text: 'Mencionaste antecedentes alérgicos. ¿A cuál de estos has reaccionado?',
    conditional: (answers) => (answers.q03_medical || []).includes('allergy_history'),
    options: [
      'Anestésicos locales (lidocaína, etc.)',
      'Antibióticos',
      'Cosméticos o cremas faciales',
      'Alimentos específicos (mariscos, frutos secos, huevo)',
      'Picaduras de insectos',
      'No estoy segura / No recuerdo',
      'Otro — por favor consulta con tu médico antes de continuar',
    ],
    required: true,
  },
  {
    id: 'q05_city',
    block: BLOCKS.CONTEXT,
    order: 5,
    type: 'single_select',
    text: '¿En qué ciudad estás?',
    options: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Otra ciudad de Colombia', 'Fuera de Colombia'],
    required: true,
  },
  {
    id: 'q06_prior_experience',
    block: BLOCKS.CONTEXT,
    order: 6,
    type: 'single_select',
    text: '¿Has hecho antes algún tratamiento estético NO quirúrgico?',
    options: [
      'Nunca',
      'Una o dos veces (ocasional)',
      'Tres o más veces (regular)',
      'Muchas veces, es parte de mi rutina',
    ],
    required: true,
  },
  {
    id: 'q07_channel',
    block: BLOCKS.CONTEXT,
    order: 7,
    type: 'single_select',
    text: '¿Cómo empezaste a considerar hacerte este tratamiento?',
    helper: 'Esta es la pregunta que más nos ayuda a calibrar tu análisis.',
    options: [
      { value: 'social', label: 'Lo vi en redes sociales (Instagram, TikTok, Reels)' },
      { value: 'referral', label: 'Me lo recomendó una amiga / familiar' },
      { value: 'medical', label: 'Me lo sugirió un(a) médico(a) o esteticista' },
      { value: 'self', label: 'Lo busqué yo por un problema específico que tengo' },
      { value: 'ad', label: 'Lo vi en una publicidad o promoción' },
    ],
    required: true,
  },

  // ═══════════════════════ BLOQUE 2 — TRATAMIENTO (Q08-Q14) ═══════════════════════
  {
    id: 'q08_treatment',
    block: BLOCKS.TREATMENT,
    order: 8,
    type: 'single_select',
    text: '¿Cuál tratamiento estás considerando ahora mismo?',
    options: [
      { value: 'ah', label: 'Ácido hialurónico (relleno facial: labios, surcos, pómulos)', category: 'inyectable' },
      { value: 'toxin', label: 'Toxina botulínica / Bótox', category: 'inyectable' },
      { value: 'rf', label: 'Radiofrecuencia / Venus / Tensamax (corporal o facial)', category: 'aparatologia' },
      { value: 'hypersculpt', label: 'Hypersculpt / tonificación muscular corporal', category: 'aparatologia' },
      { value: 'laser', label: 'Depilación láser', category: 'depilacion' },
      { value: 'other', label: 'Otro tratamiento — cuéntame brevemente' },
    ],
    required: true,
  },
  {
    id: 'q09_zone',
    block: BLOCKS.TREATMENT,
    order: 9,
    type: 'single_select',
    text: '¿En qué zona quieres aplicártelo?',
    conditional: (answers) => !!answers.q08_treatment,
    dynamicOptions: (answers) => {
      const tx = answers.q08_treatment;
      if (tx === 'ah') return ['Labios', 'Pómulos / mejillas', 'Surcos nasogenianos', 'Ojeras', 'Mentón', 'Otra zona'];
      if (tx === 'toxin') return ['Frente / entrecejo', 'Patas de gallo', 'Mandíbula / bruxismo', 'Cuello', 'Otra zona'];
      if (tx === 'rf' || tx === 'hypersculpt') return ['Abdomen', 'Glúteos', 'Piernas / muslos', 'Brazos', 'Rostro', 'Cuello y papada'];
      if (tx === 'laser') return ['Piernas completas', 'Bikini', 'Axilas', 'Rostro', 'Brazos', 'Cuerpo completo'];
      return ['Por favor especifica'];
    },
    required: true,
  },
  {
    id: 'q10_motivation_text',
    block: BLOCKS.TREATMENT,
    order: 10,
    type: 'text',
    text: 'En una frase, ¿qué te gustaría cambiar o mejorar?',
    helper: 'En tus palabras. No hay respuestas "correctas".',
    maxLength: 200,
    required: true,
  },
  {
    id: 'q11_motivation_category',
    block: BLOCKS.TREATMENT,
    order: 11,
    type: 'single_select',
    text: 'Y si tuvieras que escoger la motivación principal, ¿cuál se parece más a lo tuyo?',
    options: [
      'Reducir celulitis o adiposidad localizada',
      'Rejuvenecimiento facial / reafirmación',
      'Tonificar o reafirmar el cuerpo',
      'Eliminar vello no deseado',
      'Corregir una característica específica (tamaño, forma, simetría)',
      'Mantenerme en buen estado / mantenimiento preventivo',
    ],
    required: true,
  },
  {
    id: 'q12_expected_sessions',
    block: BLOCKS.TREATMENT,
    order: 12,
    type: 'single_select',
    text: '¿Cuántas sesiones te han mencionado que necesitarías?',
    helper: 'Si no te han dicho, no te preocupes.',
    options: ['1 sola sesión', '2-3 sesiones', '4-6 sesiones', '7-10 sesiones', 'Más de 10 sesiones', 'No me han dicho / no sé'],
    required: true,
  },
  {
    id: 'q13_budget',
    block: BLOCKS.TREATMENT,
    order: 13,
    type: 'single_select',
    text: 'Sin exactitud, ¿qué rango de inversión total estás considerando?',
    options: [
      'Menos de $500.000 COP',
      '$500.000 - $1.500.000 COP',
      '$1.500.000 - $3.000.000 COP',
      '$3.000.000 - $6.000.000 COP',
      'Más de $6.000.000 COP',
      'Aún no lo he pensado',
    ],
    required: true,
  },
  {
    id: 'q14_urgency',
    block: BLOCKS.TREATMENT,
    order: 14,
    type: 'single_select',
    text: '¿Cuándo te gustaría ver resultados?',
    options: [
      { value: 'urgent', label: 'Ya, lo necesito en menos de 1 mes' },
      { value: 'short', label: 'En los próximos 1-3 meses' },
      { value: 'medium', label: 'En los próximos 3-6 meses' },
      { value: 'flexible', label: 'No hay prisa, cuando sea el momento adecuado' },
    ],
    required: true,
  },

  // ═══════════════════════ BLOQUE 3 — EXPECTATIVA (Q15-Q20) ═══════════════════════
  {
    id: 'q15_expectation',
    block: BLOCKS.EXPECTATION,
    order: 15,
    type: 'single_select',
    text: 'Cuando imaginas tu resultado, ¿qué se parece más a lo que esperas?',
    options: [
      { value: 'dramatic', label: 'Un cambio dramático, claramente visible para todos' },
      { value: 'notable', label: 'Un cambio notable pero natural, que la gente cercana note' },
      { value: 'subtle', label: 'Un cambio sutil, que solo yo note' },
      { value: 'prevention', label: 'Prevenir que empeore lo que tengo' },
    ],
    required: true,
  },
  {
    id: 'q16_tolerance',
    block: BLOCKS.EXPECTATION,
    order: 16,
    type: 'single_select',
    text: 'Si después de 2 semanas del tratamiento, el cambio es sutil pero notable solo para ti, ¿cómo te sentirías?',
    options: [
      { value: 'satisfied', label: 'Satisfecha — confío en el proceso' },
      { value: 'patient', label: 'Un poco decepcionada pero esperaría más tiempo' },
      { value: 'frustrated', label: 'Frustrada y cuestionaría la decisión' },
      { value: 'demanding', label: 'Pediría que me reembolsaran o aplicaran más producto' },
    ],
    required: true,
  },
  {
    id: 'q17_professional',
    block: BLOCKS.EXPECTATION,
    order: 17,
    type: 'single_select',
    text: 'Sobre el profesional que te atendería, ¿qué sabes?',
    options: [
      { value: 'known', label: 'Tengo médico(a) de confianza que ya conozco de antes' },
      { value: 'recommended', label: 'Me lo recomendaron específicamente' },
      { value: 'social', label: 'Conocí la clínica por redes y no he hablado con el médico(a)' },
      { value: 'unknown', label: 'Aún no sé dónde me lo aplicaría' },
    ],
    required: true,
  },
  {
    id: 'q18_product_knowledge',
    block: BLOCKS.EXPECTATION,
    order: 18,
    type: 'single_select',
    text: '¿Sabes qué marca, lote y dosis específicos te aplicarían?',
    conditional: (answers) => {
      const tx = answers.q08_treatment;
      return tx === 'ah' || tx === 'toxin';
    },
    options: [
      { value: 'full', label: 'Sí, sé exactamente qué producto es' },
      { value: 'partial', label: 'Sé la marca pero no la dosis exacta' },
      { value: 'none', label: 'No sé — confío en lo que me recomienden' },
    ],
    required: true,
  },
  {
    id: 'q19_minimum_acceptable',
    block: BLOCKS.EXPECTATION,
    order: 19,
    type: 'single_select',
    text: 'Si después del tratamiento completo, solo lograras un 50% del resultado que imaginas, ¿valdría la pena para ti?',
    options: [
      { value: 'yes_content', label: 'Sí, con eso estaría contenta' },
      { value: 'probably', label: 'Probablemente sí, aunque me quedaría con ganas' },
      { value: 'no_cheated', label: 'No, me sentiría estafada' },
      { value: 'depends', label: 'Depende — nunca había pensado en eso' },
    ],
    required: true,
  },
  {
    id: 'q20_nps',
    block: BLOCKS.EXPECTATION,
    order: 20,
    type: 'nps',
    text: 'Antes de mostrarte el análisis: ¿qué tan probable es que recomiendes esta herramienta a una amiga?',
    helper: '0 = nada probable · 10 = muy probable',
    required: false,
  },
];

// Total visible questions (considering conditionals) — for progress bar
export function getVisibleQuestions(answers) {
  return questions.filter(q => !q.conditional || q.conditional(answers));
}
