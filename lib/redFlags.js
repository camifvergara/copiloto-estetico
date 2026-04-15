// lib/redFlags.js
// Feature 001 · Principio IV (seguridad clínica sobre conversión)
// Source of truth: docs/clinical/red-flags.md

export const RED_FLAG_MESSAGES = {
  MINOR: {
    title: 'Esta herramienta está diseñada para adultos',
    body: 'Si eres menor de edad, por favor consulta con un tutor responsable y un médico antes de considerar cualquier procedimiento estético. Los procedimientos estéticos en menores tienen consideraciones especiales que este Copiloto no puede evaluar.',
    cta: 'Entendido',
  },
  PREGNANCY: {
    title: 'Este no es el momento',
    body: 'Durante el embarazo y hasta el postparto, la mayoría de tratamientos estéticos no están recomendados. Tu cuerpo está haciendo algo mucho más importante. Te recomendamos consultar directamente con tu ginecólogo(a) antes de considerar cualquier tratamiento.',
    cta: 'Volver al inicio',
  },
  BREASTFEEDING: {
    title: 'Mejor esperar un poco',
    body: 'Durante la lactancia, varios activos usados en tratamientos estéticos pueden pasar a la leche materna. Recomendamos esperar al destete o consultar específicamente con tu pediatra y ginecólogo(a) antes de proceder.',
    cta: 'Volver al inicio',
  },
};

export const SOFT_FLAG_MESSAGES = {
  AUTOIMMUNE: 'Por tu condición autoinmune, te recomendamos que este análisis sea validado con tu médico tratante antes de agendar cualquier procedimiento.',
  ANTICOAGULANT: 'El uso de anticoagulantes requiere protocolos específicos en varios tratamientos. Asegúrate de mencionarlo explícitamente antes de la cita.',
  RECENT_SURGERY: 'Una cirugía reciente (<3 meses) generalmente requiere esperar antes de tratamientos estéticos. Consulta con el cirujano que te operó.',
  UNCLEAR_ALLERGY: 'Tus antecedentes alérgicos requieren un chequeo más detallado con un médico antes de proceder.',
  ELDER: 'Para personas mayores de 75, recomendamos que este análisis sea complementado con una consulta médica presencial.',
};

export function evaluateFlags(answers) {
  const redFlags = [];
  const softFlags = [];

  // Edad
  if (answers.q01_age !== undefined) {
    if (answers.q01_age < 18) redFlags.push('MINOR');
    else if (answers.q01_age > 75) softFlags.push('ELDER');
  }

  // Condiciones médicas
  const medical = answers.q03_medical || [];
  if (medical.includes('pregnancy')) redFlags.push('PREGNANCY');
  if (medical.includes('breastfeeding')) redFlags.push('BREASTFEEDING');
  if (medical.includes('autoimmune')) softFlags.push('AUTOIMMUNE');
  if (medical.includes('anticoagulant')) softFlags.push('ANTICOAGULANT');
  if (medical.includes('recent_surgery')) softFlags.push('RECENT_SURGERY');

  // Alergias específicas poco claras
  const allergyDetail = answers.q04_allergy_detail || [];
  if (allergyDetail.some(a => a.startsWith('Otro'))) softFlags.push('UNCLEAR_ALLERGY');

  return { redFlags, softFlags };
}
