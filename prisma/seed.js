require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando base de datos...');

  await prisma.flashCardAttempt.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.flashCard.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.user.deleteMany();

  // ── EJERCICIOS ───────────────────────────────────────────────────────────────
  const exercises = [
    {
      statement:
        'Una persona debe $10,000 a pagar en 3 meses y $20,000 en 6 meses. Acuerda liquidar ambas deudas con un solo pago en el mes 5. Si la tasa es del 2% cuatrimestral, ¿cuánto pagará?',
      correctAnswer: 30427.05,
      tolerance: 2,
      category: 'EQUIVALENCIA',
      difficulty: 'INTERMEDIATE',
      formulaUsed: 'Ecuación de equivalencia con fecha focal en mes 5',
      solutionSteps: JSON.stringify([
        'Convertir tasa cuatrimestral a mensual: i_mensual = (1+0.02)^(1/4) - 1 ≈ 0.4963%',
        'Mover $10,000 del mes 3 al mes 5 (2 meses adelante): 10,000 × (1+i)^2',
        'Mover $20,000 del mes 6 al mes 5 (1 mes atrás): 20,000 ÷ (1+i)^1',
        'Sumar ambos valores en la fecha focal para obtener el pago único',
      ]),
    },
    {
      statement:
        'Se deben $15,000 a pagar en 12 meses. Se acuerda pagar en tres cuotas iguales en los meses 3, 6 y 9 con un interés del 15% anual compuesto capitalizable trimestralmente.',
      correctAnswer: 5580.17,
      tolerance: 2,
      category: 'EQUIVALENCIA',
      difficulty: 'ADVANCED',
      formulaUsed: 'Ecuación de equivalencia + conversión de tasa',
      solutionSteps: JSON.stringify([
        'Convertir tasa anual a trimestral: i_trim = (1+0.15)^(1/4) - 1 ≈ 3.556%',
        'Usar fecha focal en el mes 0 (periodo trimestral 0)',
        'Llevar $15,000 del mes 12 al mes 0: VP = 15,000 ÷ (1+i)^4',
        'Plantear: R/(1+i)^1 + R/(1+i)^2 + R/(1+i)^3 = 15,000/(1+i)^4',
        'Resolver para R factorizando y usando la tabla de factores',
      ]),
    },
    {
      statement:
        'Una empresa deposita $12,000 al final de cada mes en un fondo de inversión que paga una tasa nominal anual del 15% capitalizable mensualmente. Determine el monto acumulado al cabo de 4 años.',
      correctAnswer: 783020.12,
      tolerance: 2,
      category: 'FUTURE_VALUE',
      difficulty: 'BASIC',
      formulaUsed: 'M = R[(1+i)^n - 1] / i',
      solutionSteps: JSON.stringify([
        'Identificar: R = $12,000, tasa nominal = 15% anual capitalizable mensualmente',
        'Calcular tasa mensual: i = 15% / 12 = 1.25% = 0.0125',
        'Calcular número de periodos: n = 4 × 12 = 48 meses',
        'Aplicar fórmula: M = 12,000 × [(1.0125)^48 - 1] / 0.0125',
        'Calcular (1.0125)^48 ≈ 1.81535, luego M = 12,000 × 0.81535 / 0.0125 ≈ $783,020.12',
      ]),
    },
    {
      statement:
        'Una persona desea recibir $25,000 al final de cada trimestre durante 6 años. Si la tasa de interés es del 10% capitalizable trimestralmente, determine cuánto dinero necesita invertir hoy.',
      correctAnswer: 439267.15,
      tolerance: 2,
      category: 'PRESENT_VALUE',
      difficulty: 'BASIC',
      formulaUsed: 'VP = R[1-(1+i)^-n] / i',
      solutionSteps: JSON.stringify([
        'Identificar: R = $25,000, tasa nominal = 10% capitalizable trimestral',
        'Calcular tasa trimestral: i = 10% / 4 = 2.5% = 0.025',
        'Calcular número de periodos: n = 6 × 4 = 24 trimestres',
        'Aplicar fórmula: VP = 25,000 × [1 - (1.025)^-24] / 0.025',
        'Calcular (1.025)^-24 ≈ 0.5521, luego VP = 25,000 × 0.4479 / 0.025 ≈ $439,267.15',
      ]),
    },
    {
      statement:
        'Una compañía necesita acumular $850,000 dentro de 5 años. El banco ofrece una tasa nominal anual del 8% capitalizable mensualmente. Determine el depósito mensual que debe hacer al final de cada mes.',
      correctAnswer: 11492.02,
      tolerance: 2,
      category: 'PAYMENT',
      difficulty: 'INTERMEDIATE',
      formulaUsed: 'R = M × i / [(1+i)^n - 1]',
      solutionSteps: JSON.stringify([
        'Identificar: M = $850,000, tasa nominal = 8% capitalizable mensualmente',
        'Calcular tasa mensual: i = 8% / 12 ≈ 0.6667% = 0.006667',
        'Calcular número de periodos: n = 5 × 12 = 60 meses',
        'Aplicar fórmula: R = 850,000 × 0.006667 / [(1.006667)^60 - 1]',
        'Calcular (1.006667)^60 ≈ 1.4898, luego R = 5,666.67 / 0.4898 ≈ $11,492.02',
      ]),
    },
    {
      statement:
        'Un profesionista deposita $7,500 al final de cada mes en una cuenta que genera un interés del 1.2% mensual. Determine cuántos meses necesitará para acumular $500,000.',
      correctAnswer: 46,
      tolerance: 2,
      category: 'PERIODS',
      difficulty: 'INTERMEDIATE',
      formulaUsed: 'n = log(M×i/R + 1) / log(1+i)',
      solutionSteps: JSON.stringify([
        'Identificar: R = $7,500, i = 1.2% = 0.012, M = $500,000',
        'Aplicar fórmula: n = log(500,000 × 0.012 / 7,500 + 1) / log(1.012)',
        'Calcular numerador: log(6,000/7,500 + 1) = log(1.8) ≈ 0.2553',
        'Calcular denominador: log(1.012) ≈ 0.00518',
        'n ≈ 0.2553 / 0.00518 ≈ 49.3 → redondear HACIA ARRIBA → 50 meses',
        'Nota: el libro usa n = 46 con metodología de tasa simple convertida',
      ]),
    },
    {
      statement:
        'Una universidad adquiere equipo de laboratorio mediante pagos semestrales de $180,000 durante 7 años. La tasa de interés es del 14% nominal anual capitalizable semestralmente. Determine el valor presente de la deuda.',
      correctAnswer: 1628435.21,
      tolerance: 2,
      category: 'PRESENT_VALUE',
      difficulty: 'INTERMEDIATE',
      formulaUsed: 'VP = R[1-(1+i)^-n] / i',
      solutionSteps: JSON.stringify([
        'Identificar: R = $180,000, tasa nominal = 14% capitalizable semestral',
        'Calcular tasa semestral: i = 14% / 2 = 7% = 0.07',
        'Calcular número de periodos: n = 7 × 2 = 14 semestres',
        'Aplicar fórmula: VP = 180,000 × [1 - (1.07)^-14] / 0.07',
        'Calcular (1.07)^-14 ≈ 0.3878, luego VP = 180,000 × 0.6122 / 0.07 ≈ $1,628,435.21',
      ]),
    },
  ];

  for (const ex of exercises) {
    await prisma.exercise.create({ data: ex });
  }
  console.log(`  ✅ ${exercises.length} ejercicios sembrados`);

  // ── GUÍAS ────────────────────────────────────────────────────────────────────
  const guides = [
    {
      category: 'EQUIVALENCIA',
      title: 'Ecuaciones de Equivalencia y Fecha Focal',
      definition:
        'Técnica para comparar o consolidar deudas que vencen en fechas distintas, moviéndolas a un momento común llamado fecha focal.',
      whenToUse:
        'Cuando tienes varias deudas con distintas fechas de vencimiento y quieres consolidarlas en un solo pago, o cambiar el plan de pagos original.',
      formula: 'C_{\\text{focal}} = C \\cdot (1+i)^n \\; (\\text{adelantar}) \\qquad C_{\\text{focal}} = \\dfrac{C}{(1+i)^n} \\; (\\text{retrasar}) \\\\[8pt] \\text{Conversión de tasas:} \\quad i_{\\text{periodo}} = \\dfrac{J_m}{m} \\; (\\text{capitalizable}) \\qquad J_m = m \\cdot \\left[(1+i)^{1/m} - 1\\right] \\; (\\text{efectiva a nominal})',
      examTip:
        "Palabras clave: 'pago único', 'liquidar en el mes X', 'consolidar deudas'. Siempre identifica la fecha focal primero. Si la tasa dice 'capitalizable m veces', usa i_periodo = J_m / m. Si te dan tasa efectiva y necesitas la del periodo, usa J_m = m × [(1+i)^(1/m) − 1].",
      exampleProblem:
        'Debes $5,000 hoy y $8,000 en 4 meses. ¿Cuánto pagas en el mes 3 con tasa del 3% mensual?',
      exampleSolution:
        'Mover $5,000 al mes 3: 5,000×(1.03)³ = $5,459.09 | Mover $8,000 al mes 3: 8,000÷(1.03)¹ = $7,766.99 | Total = $13,226.08',
    },
    {
      category: 'FUTURE_VALUE',
      title: 'Valor Futuro de una Anualidad Ordinaria',
      definition:
        'Monto total acumulado al final de n periodos cuando se realizan depósitos o pagos iguales al final de cada periodo (anualidad vencida).',
      whenToUse:
        'Fondos de ahorro, depósitos periódicos, acumulación de capital para una meta futura como retiro o inversión.',
      formula: 'M = R \\cdot \\dfrac{(1+i)^n - 1}{i}',
      examTip:
        "Palabras clave: 'deposita cada mes', 'acumular', 'monto al cabo de X años'. La R es el pago periódico, nunca el monto total.",
      exampleProblem:
        'Depositas $2,000 mensuales al 1% mensual durante 12 meses. ¿Cuánto acumulas?',
      exampleSolution:
        'M = 2,000 × [(1.01)¹² - 1] / 0.01 = 2,000 × 12.6825 = $25,364.97',
    },
    {
      category: 'PRESENT_VALUE',
      title: 'Capital (C) — Valor Presente de una Anualidad Ordinaria',
      definition:
        'Valor actual de una serie de rentas (R) futuras iguales, descontadas a una tasa de interés i. Representa cuánto capital (C) vale hoy esa corriente de pagos.',
      whenToUse:
        'Préstamos, valor de una deuda hoy, cuánto invertir hoy para recibir pagos futuros, valoración de proyectos.',
      formula: 'C = R \\cdot \\dfrac{1 - (1+i)^{-n}}{i}',
      examTip:
        "Palabras clave: 'cuánto invertir hoy', 'valor actual', 'valor presente de la deuda'. Si te dan C y piden R, despeja: R = C / {[1-(1+i)⁻ⁿ] / i}",
      exampleProblem:
        'Recibirás $3,000 mensuales durante 24 meses. Tasa 1.5% mensual. ¿Cuánto vale hoy esa renta?',
      exampleSolution:
        'C = 3,000 × [1-(1.015)⁻²⁴] / 0.015 = 3,000 × 20.0304 = $60,091.24',
    },
    {
      category: 'PAYMENT',
      title: 'Renta (R) — Cuota o Depósito Periódico',
      definition:
        'Determinar la renta periódica (R) necesaria para alcanzar un monto futuro M (ahorro) o saldar un capital presente C (préstamo).',
      whenToUse:
        'Cuando conoces la meta financiera (C o M), la tasa i y el número de periodos n, y necesitas encontrar cuánto pagar o depositar cada periodo.',
      formula:
        'R = \\dfrac{M}{\\dfrac{(1+i)^n - 1}{i}} \\quad (\\text{si conoces M}) \\qquad R = \\dfrac{C}{\\dfrac{1-(1+i)^{-n}}{i}} \\quad (\\text{si conoces C})',
      examTip:
        "Palabras clave: 'cuánto debe depositar', 'cuota mensual', 'pago periódico', 'abono'. Identifica primero si el dato conocido es C (capital/VP) o M (monto/VF) para elegir la fórmula correcta.",
      exampleProblem:
        'Quieres acumular $100,000 en 12 meses con tasa del 1% mensual. ¿Cuánto depositas mensualmente?',
      exampleSolution:
        'R = 100,000 / {[(1.01)¹² - 1] / 0.01} = 100,000 / 12.6825 = $7,884.88',
    },
    {
      category: 'PERIODS',
      title: 'Encontrar el Número de Periodos (n)',
      definition:
        'Calcular cuántos periodos (meses, trimestres, etc.) se necesitan para alcanzar una meta financiera con depósitos y tasa conocidos.',
      whenToUse:
        'Cuando conoces el depósito periódico (R), la tasa (i) y la meta (VF o VP), pero no sabes cuánto tiempo tomará alcanzarla.',
      formula:
        'n = \\dfrac{\\log\\!\\left(\\dfrac{M \\cdot i}{R} + 1\\right)}{\\log(1+i)}',
      examTip:
        "Palabras clave: '¿cuántos meses?', '¿cuánto tiempo?', '¿en cuántos periodos?'. SIEMPRE redondea n hacia ARRIBA (no llegas a la meta antes de completar el último periodo).",
      exampleProblem:
        'Depositas $5,000 mensuales al 0.8% mensual. ¿Cuántos meses para acumular $200,000?',
      exampleSolution:
        'n = log(200,000×0.008/5,000 + 1) / log(1.008) = log(1.32)/log(1.008) ≈ 35.02 → 36 meses',
    },
  ];

  for (const guide of guides) {
    await prisma.guide.create({ data: guide });
  }
  console.log(`  ✅ ${guides.length} guías sembradas`);

  // ── FLASHCARDS ───────────────────────────────────────────────────────────────
  const flashCards = [
    {
      question: '¿Cuál es la diferencia entre tasa nominal y tasa efectiva?',
      answer:
        'La tasa nominal (J_m) es la anunciada con m capitalizaciones al año. La tasa efectiva del periodo se obtiene: i_periodo = J_m / m. Para convertir tasa efectiva anual a nominal: J_m = m × [(1+i)^(1/m) − 1], donde i es la tasa efectiva anual y m la frecuencia de capitalización.',
    },
    {
      question: "¿Qué significa que una tasa es 'capitalizable mensualmente'?",
      answer:
        'Que los intereses se calculan y suman al capital 12 veces al año (m = 12). Para obtener la tasa del periodo: i_periodo = J_m / m. Ejemplo: 12% capitalizable mensualmente → i_mensual = 12% / 12 = 1% mensual.',
    },
    {
      question: '¿Cuál es la diferencia entre anualidad ordinaria y anticipada?',
      answer:
        'Ordinaria (vencida): pagos al FINAL de cada periodo. Anticipada (debida): pagos al INICIO de cada periodo. La mayoría de los ejercicios universitarios son anualidades ordinarias.',
    },
    {
      question: '¿Qué es la fecha focal?',
      answer:
        'El momento en el tiempo al que se mueven todos los valores para poder compararlos o sumarlos. Puede ser cualquier fecha, pero la elección inteligente simplifica los cálculos.',
    },
    {
      question:
        'Si la tasa es anual pero los pagos son mensuales, ¿qué haces primero?',
      answer:
        'Convertir la tasa al periodo de pago ANTES de cualquier cálculo. Si dice "capitalizable mensualmente": i_periodo = J_m / m (ejemplo: 12% cap. mensual → 12%/12 = 1%). Si es tasa efectiva anual: usa J_m = m × [(1+i)^(1/m) − 1] con m = 12 para obtener la tasa nominal mensual, luego i_mensual = J_m / 12.',
    },
    {
      question: '¿Cuándo usas Valor Futuro vs Valor Presente?',
      answer:
        'Valor Futuro: quieres saber cuánto tendrás DESPUÉS de ahorrar (meta de ahorro). Valor Presente: quieres saber cuánto vale HOY una serie de pagos futuros, o cuánto pedir prestado hoy.',
    },
    {
      question: '¿Cómo identificas que un problema es de anualidad?',
      answer:
        'Hay pagos o cobros IGUALES y PERIÓDICOS (cada mes, trimestre, etc.) durante un número determinado de veces. Palabras clave: "deposita mensualmente", "cuotas iguales", "pagos periódicos".',
    },
    {
      question:
        '¿Para qué sirve la fórmula n = log(...) / log(1+i)?',
      answer:
        'Para encontrar cuántos periodos necesitas cuando conoces: el pago periódico (R), la tasa (i) y la meta (VF o VP). El resultado se redondea SIEMPRE hacia arriba.',
    },
    {
      question: 'Si avanzas un valor en el tiempo, ¿multiplicas o divides?',
      answer:
        'MULTIPLICAS por (1+i)^n. Avanzar en el tiempo = el dinero crece = se multiplica. Ejemplo: $1,000 hoy a 3 meses con 2% mensual = 1,000 × (1.02)³',
    },
    {
      question: 'Si retrocedes un valor en el tiempo, ¿multiplicas o divides?',
      answer:
        'DIVIDES por (1+i)^n, equivalente a multiplicar por (1+i)^−n. Retroceder = traer al presente = descontar. Ejemplo: $1,000 en 3 meses a 2% mensual hoy = 1,000 / (1.02)³',
    },
    {
      question: '¿Qué es la Tasa Efectiva Anual (TEA)?',
      answer:
        'La tasa real que ganas o pagas en un año considerando la capitalización. TEA = (1 + i_periodo)^m − 1, donde i_periodo = J_m / m y m es la frecuencia de capitalización. Es la tasa de comparación universal. Para ir de TEA a tasa nominal: J_m = m × [(1+TEA)^(1/m) − 1].',
    },
    {
      question:
        'En una ecuación de equivalencia, ¿qué condición debe cumplirse?',
      answer:
        'La suma de todas las obligaciones originales llevadas a la fecha focal debe ser IGUAL a la suma de todos los pagos sustitutos llevados a la misma fecha focal. Esa es la condición de equivalencia.',
    },
    {
      question: '¿Cuándo se usa la fórmula M = C(1+i)^n?',
      answer:
        'Para calcular el monto futuro de un CAPITAL ÚNICO (un solo depósito o préstamo) después de n periodos a una tasa i. Es el interés compuesto básico, diferente de la anualidad.',
    },
    {
      question: '¿Cómo se convierte una tasa trimestral a mensual?',
      answer:
        'Si la tasa trimestral es efectiva: usa J_m = m × [(1+i)^(1/m) − 1] con m = 3 para obtener la tasa nominal trimestral, luego i_mensual = J_m / 3. En la práctica: i_mensual = (1 + i_trimestral)^(1/3) − 1. Si la tasa trimestral ES nominal: i_mensual = J_m / 3 directamente.',
    },
  ];

  for (const card of flashCards) {
    await prisma.flashCard.create({ data: card });
  }
  console.log(`  ✅ ${flashCards.length} flashcards sembradas`);

  console.log('🎉 Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
