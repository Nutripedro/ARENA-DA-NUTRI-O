import { Question } from '../types';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'q1',
    category: 'Saúde Óssea e Mineral',
    difficulty: 1,
    question: 'Qual é a principal função estrutural do cálcio no organismo humano?',
    options: [
      'Produzir hormônios tireoidianos na glândula tireoide',
      'Formar e manter a matriz mineral de ossos e dentes',
      'Transportar oxigênio juntamente com a hemoglobina no sangue',
      'Sintetizar vitamina C no tecido hepático'
    ],
    correctAnswer: 1,
    explanation: 'O cálcio é o mineral mais abundante no corpo humano, com cerca de 99% armazenado nos ossos e dentes, conferindo rigidez e suporte estrutural.',
    tip: 'Pense no principal mineral que compõe a estrutura esquelética.'
  },
  {
    id: 'q2',
    category: 'Fontes Alimentares',
    difficulty: 1,
    question: 'Qual destes grupos alimentares é reconhecido como fonte excelente de magnésio biodisponível?',
    options: [
      'Sementes oleaginosas, folhas verde-escuras e grãos integrais',
      'Açúcar refinado e xarope de milho de alta frutose',
      'Refrigerantes e bebidas carbonatadas açucaradas',
      'Balas de gelatina e confeitos artificiais'
    ],
    correctAnswer: 0,
    explanation: 'Sementes (como abóbora e girassol), castanhas e vegetais verde-escuros (ricos em clorofila, cujo núcleo é magnésio) são excelentes fontes.',
    tip: 'Busque o grupo de alimentos menos processados e ricos em clorofila.'
  },
  {
    id: 'q3',
    category: 'Absorção e Biodisponibilidade',
    difficulty: 1,
    question: 'Qual vitamina é essencial para otimizar a absorção intestinal de cálcio?',
    options: ['Vitamina B12', 'Vitamina C', 'Vitamina D (Calcitriol)', 'Vitamina A'],
    correctAnswer: 2,
    explanation: 'A forma ativa da vitamina D (1,25-dihidroxivitamina D ou calcitriol) induz a síntese de proteínas de transporte de cálcio no enterócito.',
    tip: 'É a vitamina cuja principal fonte natural de ativação é a exposição solar.'
  },
  {
    id: 'q4',
    category: 'Fontes Alimentares',
    difficulty: 1,
    question: 'Qual destes alimentos tradicionais apresenta o maior teor de cálcio altamente biodisponível?',
    options: ['Iogurte natural e queijos', 'Arroz branco polido', 'Azeite de oliva extra virgem', 'Maçã gala com casca'],
    correctAnswer: 0,
    explanation: 'Leite e derivados fermentados fornecem cálcio em alta concentração e com excelente taxa de absorção intestinal.',
    tip: 'Pense na categoria clássica de laticínios recomendada na infância e geriatria.'
  },
  {
    id: 'q5',
    category: 'Metabolismo Energético',
    difficulty: 1,
    question: 'O magnésio atua como um cofator indispensável em centenas de reações enzimáticas por formar um complexo direto com qual molécula energética?',
    options: ['ATP (Trifosfato de Adenosina)', 'Colesterol LDL', 'Glicogênio hepático', 'Ácido úrico'],
    correctAnswer: 0,
    explanation: 'Praticamente todas as enzimas que utilizam ou sintetizam ATP requerem íons de magnésio (complexo Mg-ATP) para sua atividade catalítica.',
    tip: 'É a principal moeda energética celular.'
  },
  {
    id: 'q6',
    category: 'Coagulação Sanguínea',
    difficulty: 1,
    question: 'Na cascata clássica de coagulação sanguínea, qual íon atua como o Fator IV?',
    options: ['Magnésio', 'Cálcio (Ca²⁺)', 'Potássio', 'Sódio'],
    correctAnswer: 1,
    explanation: 'O íon cálcio é o Fator IV da coagulação, sendo fundamental para a adesão de fatores dependentes de vitamina K às fosfolipases plaquetárias.',
    tip: 'É o mesmo mineral essencial para ossos e contração muscular.'
  },
  {
    id: 'q7',
    category: 'Contração Muscular',
    difficulty: 2,
    question: 'Qual é a relação fisiológica entre cálcio e magnésio na contração e relaxamento muscular?',
    options: ['Eles possuem exatamente a mesma função metabólica', 'O cálcio promove a contração (ligação à troponina), enquanto o magnésio atua no relaxamento neuromuscular', 'O magnésio bloqueia permanentemente qualquer movimento muscular', 'Nenhum deles participa da fisiologia muscular'],
    correctAnswer: 1,
    explanation: 'O influxo de cálcio dispara o deslizamento de actina e miosina (contração). O magnésio atua como antagonista fisiológico natural, facilitando o relaxamento.',
    tip: 'Um contrai e o outro relaxa.'
  },
  {
    id: 'q8',
    category: 'Fatores Antinutricionais',
    difficulty: 2,
    question: 'Qual substância presente em vegetais como o espinafre forma complexos insolúveis com o cálcio, reduzindo sua absorção?',
    options: ['Ácido oxálico (Oxalato)', 'Vitamina K', 'Ácido ascórbico', 'Lactose'],
    correctAnswer: 0,
    explanation: 'O oxalato liga-se fortemente ao cálcio no lúmen intestinal, formando oxalato de cálcio pouco absorvível.',
    tip: 'Inicia com a letra O e é conhecido por formar cálculos renais em excesso.'
  },
  {
    id: 'q9',
    category: 'Bioquímica Clínica',
    difficulty: 2,
    question: 'Qual quadro clínico está frequentemente associado à hipomagnesemia crônica?',
    options: ['Câimbras musculares dolorosas, tremores e fadiga neuromuscular', 'Aumento drástico da acuidade visual noturna', 'Enrijecimento ósseo excessivo e hipercalcemia', 'Redução acentuada da frequência cardíaca em repouso absoluto'],
    correctAnswer: 0,
    explanation: 'A deficiência de magnésio gera hiperexcitabilidade neuromuscular, resultando em cãimbras, espasmos e tremores.',
    tip: 'Pense nos sintomas clássicos de fadiga e contrações involuntárias nas panturrilhas.'
  },
  {
    id: 'q10',
    category: 'Hormônios e Homeostase',
    difficulty: 2,
    question: 'Qual hormônio secretado pelas glândulas paratireoides eleva o cálcio sérico em resposta à hipocalcemia?',
    options: ['Paratormônio (PTH)', 'Insulina', 'Calcitonina', 'Tireoxina (T4)'],
    correctAnswer: 0,
    explanation: 'O PTH estimula a reabsorção óssea pelos osteoclastos, a reabsorção renal de cálcio e a ativação da vitamina D nos rins.',
    tip: 'O nome deriva das glândulas que o produzem atrás da tireoide.'
  },
  {
    id: 'q11',
    category: 'Distribuição Corporal',
    difficulty: 2,
    question: 'Onde se localiza a maior proporção (~50% a 60%) do magnésio total do corpo humano?',
    options: ['No plasma sanguíneo e soro', 'Nos ossos e dentes', 'Nos eritrócitos circulantes', 'Na saliva e suor'],
    correctAnswer: 1,
    explanation: 'Cerca de 50-60% do magnésio corpóreo está na matriz óssea, 39% nos tecidos moles e apenas ~1% no fluido extracelular.',
    tip: 'Assim como o cálcio, a maior parte guarda reserva na matriz esquelética.'
  },
  {
    id: 'q12',
    category: 'Interferências Nutricionais',
    difficulty: 3,
    question: 'Como os fitatos (ácido fítico), encontrados em grãos integrais e leguminosas cruas, afetam os minerais?',
    options: ['Aumentam em 200% a absorção de ferro', 'Formam sais insolúveis (quelatos) com minerais bivalentes como cálcio, magnésio e zinco', 'Transformam minerais em vitaminas do complexo B', 'Inibem exclusivamente a absorção de água'],
    correctAnswer: 1,
    explanation: 'O fitato possui alta afinidade por cátions divalentes e trivalentres, diminuindo sua biodisponibilidade digestiva, efeito mitigado pelo molho e fermentação.',
    tip: 'Pense em "quelar" ou aprisionar os minerais.'
  },
  {
    id: 'q13',
    category: 'Fisiologia Cardiovascular',
    difficulty: 3,
    question: 'No acoplamento excitação-contração do miocárdio, o cálcio que entra via canais de L na membrana celular ativa:',
    options: ['O bloqueio total da sístole', 'A liberação adicional de cálcio pelo retículo sarcoplasmático (CICR)', 'A conversão do tecido cardíaco em tecido adiposo', 'A diminuição instantânea da pressão arterial'],
    correctAnswer: 1,
    explanation: 'O mecanismo de liberação de cálcio induzida por cálcio (Calcium-Induced Calcium Release) é o gatilho central para a contração cardíaca.',
    tip: 'O retículo armazena uma enorme quantidade de cálcio pronta para ser liberada.'
  },
  {
    id: 'q14',
    category: 'Farmacologia Nutricional',
    difficulty: 3,
    question: 'Qual é o papel do magnésio frente aos canais de cálcio dependentes de voltagem e receptores NMDA no tecido neuronal?',
    options: ['Atua como um antagonista fisiológico bloqueador de canais, prevenindo excitotoxicidade', 'Substitui permanentemente o sódio nas sinapses', 'Acelera a morte neuronal por excesso de estímulo', 'Inibe a produção de serotonina'],
    correctAnswer: 0,
    explanation: 'O magnésio atua fisiologicamente bloqueando o canal NMDA em repouso, impedindo o influxo excessivo e tóxico de cálcio.',
    tip: 'Ele modula e protege o neurônio contra o excesso de cálcio.'
  },
  {
    id: 'q15',
    category: 'Homeostase Avançada',
    difficulty: 3,
    question: 'Qual enzima renal é diretamente estimulada pelo PTH para converter a 25-hidroxivitamina D em calcitriol ativo?',
    options: ['1-alfa-hidroxilase (CYP27B1)', 'Amilase pancreática', 'Lactase intestinal', 'Glicose-6-fosfatase'],
    correctAnswer: 0,
    explanation: 'A enzima renal 1-alfa-hidroxilase realiza a hidroxilação final que produz a forma hormonalmente ativa da vitamina D.',
    tip: 'Enzima localizada nos rins que ativa a vitamina D.'
  }
];
