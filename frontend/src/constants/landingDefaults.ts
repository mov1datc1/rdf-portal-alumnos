export interface LevelData {
  code: string;
  sub: string;
  subLabel: string;
  levelTag: string;
  titleLine1: string;
  titleLine2: string;
  iconDoodle: string;
  desc: string;
  bullets: Array<{ icon: string; title?: string; text: string }>;
  characterImage: string;
  characterAlt: string;
  ctaText?: string;
  durationBadge?: string;
}

export const DEFAULT_HERO_SLIDES = [
  { id: 'slide-1', src: '/imagenes-lp/hero_slide_3.webp', alt: 'Jóvenes Estudiantes Les Rois du Français', active: true },
  { id: 'slide-2', src: '/imagenes-lp/rey.webp', alt: 'Rey Oficial Les Rois du Français', active: true },
  { id: 'slide-3', src: '/imagenes-lp/hero_slide_1.webp', alt: 'Reina con Corona Les Rois du Français', active: true },
  { id: 'slide-4', src: '/imagenes-lp/hero_slide_2.webp', alt: 'Estudiante con Celular Les Rois du Français', active: true }
];


export const DEFAULT_TEACHERS = [
  {
    id: 'jean-luc',
    name: 'Jean-Luc',
    role: 'Profesor nativo de francés',
    specialty: 'CONVERSACIÓN Y FLUIDEZ',
    city: 'París',
    image: '/imagenes-lp/teacher_royal_jean_luc.webp',
    quote: 'Mi objetivo es que pierdas el miedo y empieces a expresarte en francés con naturalidad.'
  },
  {
    id: 'sophie',
    name: 'Sophie',
    role: 'Profesora nativa de francés',
    specialty: 'CULTURA Y VIDA COTIDIANA',
    city: 'Lyon',
    image: '/imagenes-lp/teacher_royal_sophie.webp',
    quote: 'Aprenderás el francés de verdad, el que se habla en las calles y cafés de Francia con elegancia.'
  },
  {
    id: 'pierre',
    name: 'Pierre',
    role: 'Profesor nativo de francés',
    specialty: 'ESTRUCTURA Y PRÁCTICA ORAL',
    city: 'Burdeos',
    image: '/imagenes-lp/teacher_royal_pierre.webp',
    quote: 'Olvídate de las clases aburridas; practicaremos para que hables con soltura y seguridad desde el primer día.'
  }
];

export const DEFAULT_LEVELS: Record<string, LevelData> = {
  A1: {
    code: 'A1',
    sub: 'Básico 1',
    subLabel: 'Básico 1',
    levelTag: 'Básico 1 – Fundamentos • 4 Meses',
    titleLine1: 'Fundamentos del francés.',
    titleLine2: '¡Empieza a hablar!',
    iconDoodle: '/imagenes-lp/beret_doodle_a1.webp',
    desc: 'En este nivel, los estudiantes se introducen en los fundamentos del francés. Aprenden el alfabeto, la pronunciación básica, la familia, la hora, la descripción física y las frases esenciales para la comunicación diaria. El objetivo principal es desarrollar la capacidad de comprender y usar expresiones cotidianas y frases sencillas para satisfacer necesidades inmediatas. Los alumnos empiezan a formar oraciones simples y a familiarizarse con la gramática elemental.',
    bullets: [
      { icon: 'chat', text: 'Presentación personal, saludos y situaciones cotidianas' },
      { icon: 'trophy', text: 'Desarrollo de las 4 competencias: habla, escucha, lectura y escritura' },
      { icon: 'book', text: '4 unidades (~1 mes c/u) con libro de actividades 100% gratis' },
      { icon: 'people', text: 'Examen escrito y oral al finalizar con certificación oficial' }
    ],
    characterImage: '/imagenes-lp/estudiante_con_portatil_y_auriculares.webp',
    characterAlt: 'Chica adolescente con audífonos blancos, laptop y cuaderno - Nivel A1'
  },
  A2: {
    code: 'A2',
    sub: 'Básico 2',
    subLabel: 'Básico 2',
    levelTag: 'Básico 2 – Supervivencia y Rutina • 4 Meses',
    titleLine1: 'Profundiza tu comunicación.',
    titleLine2: '¡Conéctate con Francia!',
    iconDoodle: '/imagenes-lp/coffee_cup_doodle.webp',
    desc: 'El nivel Básico 2 profundiza en los conocimientos adquiridos previamente. Los estudiantes amplían su vocabulario y mejoran su capacidad de comunicación en situaciones más variadas. Se enfocan en construir oraciones más complejas en presente y pasado y en comprender conversaciones sencillas. Este nivel refuerza la comprensión auditiva y la expresión oral, permitiendo a los alumnos interactuar en contextos cotidianos con mayor confianza.',
    bullets: [
      { icon: 'chat', text: 'Conversación sobre rutina diaria, compras, viajes y entorno' },
      { icon: 'people', text: 'Clases en vivo por Zoom con grupos reducidos (máx. 8 alumnos)' },
      { icon: 'trophy', text: 'Rotación con profesores nativos de distintas regiones de Francia' },
      { icon: 'book', text: '4 unidades temáticas, evaluación oral y escrita con certificado' }
    ],
    characterImage: '/imagenes-lp/estudiante_sonriente_con_mochila_y_cuadernos.webp',
    characterAlt: 'Chico adolescente con sudadera azul, mochila, cuadernos y celular - Nivel A2'
  },
  'A2+': {
    code: 'A2+',
    sub: 'Intermedio 1',
    subLabel: 'Intermedio 1',
    levelTag: 'Intermedio 1 – Exploración y Fluidez • 4 Meses',
    titleLine1: 'Explora temas complejos.',
    titleLine2: '¡Gana fluidez y precisión!',
    iconDoodle: '/imagenes-lp/chat_bubble_doodle_b1.webp',
    desc: 'En el nivel Intermedio 1, los estudiantes ya tienen una base sólida y empiezan a explorar temas más complejos. Se trabaja intensamente en la gramática y en la ampliación del vocabulario (los pasatiempos, los deportes, ir al médico, invitar a alguien a salir...). Los alumnos aprenden a expresarse con mayor fluidez y precisión, pudiendo hablar sobre experiencias personales, describir eventos y expresar opiniones en presente, pasado y futuro. La comprensión de textos escritos más largos y complejos también es un objetivo clave en este nivel.',
    bullets: [
      { icon: 'chat', text: 'Autonomía para viajar y desenvolverte en países francófonos' },
      { icon: 'people', text: 'Expresión fluida de opiniones, ambiciones, proyectos y relatos' },
      { icon: 'book', text: '4 unidades de estudio práctico con material pedagógico gratuito' },
      { icon: 'trophy', text: 'Acreditación oficial mediante examen oral y escrito final' }
    ],
    characterImage: '/imagenes-lp/estudiante_celebrando_frente_al_portatil.webp',
    characterAlt: 'Joven con camisa verde, laptop y cuaderno - Nivel A2+'
  },
  B1: {
    code: 'B1',
    sub: 'Intermedio 2',
    subLabel: 'Intermedio 2',
    levelTag: 'Intermedio 2 – Consolidación y Debate • 4 Meses',
    titleLine1: 'Consolida tu autonomía.',
    titleLine2: '¡Debate y exprésate!',
    iconDoodle: '/imagenes-lp/gold_crown_icon.webp',
    desc: 'Este nivel está diseñado para consolidar y expandir las habilidades intermedias. Los estudiantes trabajan en la comprensión y producción de textos más detallados y en la participación en conversaciones más fluidas. Se enfoca en el desarrollo de habilidades para debatir temas abstractos y complejos (vocabulario del trabajo, describir una historia en pasado...), así como en la mejora de la pronunciación y la entonación. Los alumnos también se familiarizan con expresiones idiomáticas y el lenguaje formal e informal.',
    bullets: [
      { icon: 'chat', text: 'Conversaciones espontáneas en contextos laborales y sociales' },
      { icon: 'trophy', text: 'Dominio de estructuras complejas con método MRAF® sin rodeos' },
      { icon: 'people', text: 'Inmersión cultural con múltiples acentos regionales franceses' },
      { icon: 'book', text: 'Certificado de nivel intermedio y pase directo a nivel Avanzado' }
    ],
    characterImage: '/imagenes-lp/joven_conversando_con_portatil_y_cuaderno.webp',
    characterAlt: 'Joven adulto con camisa azul, laptop y libreta conversando - Nivel B1'
  },
  'B1+': {
    code: 'B1+',
    sub: 'Avanzado 1',
    subLabel: 'Avanzado 1',
    levelTag: 'Avanzado 1 – Argumentación y Dominio • 4 Meses',
    titleLine1: 'Argumenta con claridad.',
    titleLine2: '¡Comunica con soltura!',
    iconDoodle: '/imagenes-lp/star_doodle_c1.webp',
    desc: 'En el nivel Avanzado 1, los estudiantes alcanzan un alto grado de competencia en el idioma. Son capaces de comprender y producir textos detallados y bien estructurados sobre temas complejos. Se les enseña a argumentar con claridad y coherencia, utilizando una variedad de estructuras gramaticales y vocabulario avanzado. La interacción en discusiones formales e informales se convierte en una parte esencial del aprendizaje.',
    bullets: [
      { icon: 'chat', text: 'Debates sobre temas complejos, culturales, profesionales y abstractos' },
      { icon: 'people', text: 'Comprensión auditiva completa de nativos y modismos cotidianos' },
      { icon: 'book', text: '4 unidades avanzadas con dinámicas interactivas y roleplays' },
      { icon: 'trophy', text: 'Examen oral y escrito riguroso con certificado avalado' }
    ],
    characterImage: '/imagenes-lp/profesora_remota_explicando_ante_su_portatil.webp',
    characterAlt: 'Alumna adulta en clase online con laptop y libreta - Nivel B1+'
  },
  B2: {
    code: 'B2',
    sub: 'Avanzado 2',
    subLabel: 'Avanzado 2',
    levelTag: 'Avanzado 2 – Perfeccionamiento y Certificación • 4 Meses',
    titleLine1: 'Fluidez y precisión nativa.',
    titleLine2: '¡Sé un verdadero rey!',
    iconDoodle: '/imagenes-lp/diamond_doodle_c2.webp',
    desc: 'El nivel Avanzado 2 es el más alto ofrecido por Les Rois du Français. Aquí, los estudiantes perfeccionan sus habilidades lingüísticas, alcanzando una fluidez y precisión casi nativas. Son capaces de comprender prácticamente todo lo que leen y escuchan, y pueden expresarse de manera espontánea, muy fluida y precisa, incluso en situaciones complejas. Este nivel también prepara a los estudiantes para exámenes de certificación avanzada y para el uso del francés en entornos profesionales y académicos.',
    bullets: [
      { icon: 'chat', text: 'Bilingüismo y precisión comunicativa equivalente a hablante nativo' },
      { icon: 'trophy', text: 'Certificación de máxima maestría y graduación oficial de la escuela' },
      { icon: 'people', text: 'Argumentación espontánea, negociación y expresión de alto nivel' },
      { icon: 'book', text: 'Maestría total de la lengua, modismos, cultura y humor francés' }
    ],
    characterImage: '/imagenes-lp/hombre_estudiando_con_portatil_y_libros.webp',
    characterAlt: 'Hombre adulto con lentes, laptop, libros y libreta - Nivel B2'
  },
  'B2-C1': {
    code: 'B2-C1',
    sub: 'Perfeccionamiento',
    subLabel: 'Perfeccionamiento',
    levelTag: 'Perfeccionamiento • Conversación y certificación',
    durationBadge: '4 meses',
    titleLine1: 'Perfecciona tu francés.',
    titleLine2: 'Habla, argumenta y certifícate.',
    iconDoodle: '/imagenes-lp/diamond_doodle_c2.webp',
    desc: 'Este nivel está dirigido a alumnos con una base sólida de francés que desean perfeccionar su comunicación mediante conversación avanzada y práctica orientada a exámenes oficiales.',
    bullets: [
      {
        icon: 'chat',
        title: 'CONVERSACIÓN AVANZADA',
        text: 'Debates y conversación sobre actualidad, cultura, estudios y trabajo.'
      },
      {
        icon: 'people',
        title: 'FLUIDEZ Y PRECISIÓN',
        text: 'Mejora pronunciación, vocabulario y naturalidad al expresarte.'
      },
      {
        icon: 'trophy',
        title: 'PREPARACIÓN PARA EXÁMENES',
        text: 'Ejercicios prácticos para DELF, DALF, TCF y certificaciones oficiales.'
      },
      {
        icon: 'book',
        title: 'PRÁCTICA ORAL Y ESCRITA',
        text: 'Comprensión, expresión oral, escritura y simulaciones de examen.'
      }
    ],
    characterImage: '/imagenes-lp/estudiante_conversacion_perfeccionamiento_b2_c1.webp',
    characterAlt: 'Alumna en clase de conversación y perfeccionamiento B2-C1',
    ctaText: 'QUIERO PERFECCIONAR MI FRANCÉS'
  }
};
