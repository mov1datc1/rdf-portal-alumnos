import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  Users,
  Play,
  Star,
  Check,
  ShieldCheck,
  Globe,
  User,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Video,
  MessageSquare,
  Clock,
  Calendar,
  Sparkles,
  Zap,
  BookOpen,
  ExternalLink,
  Radio,
  MessageCircle,
  UsersRound,
  BadgeCheck,
  LayoutDashboard,
  TrendingUp,
  GraduationCap,
  Lock,
  FileText
} from 'lucide-react';
import './LandingPage.css';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

const FacebookIcon = ({ size = 14, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 14, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 14, color = '#FFFFFF' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill={color} />
  </svg>
);

interface LevelData {
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

export const DEFAULT_LEVELS: Record<string, LevelData> = {
  A1: {
    code: 'A1',
    sub: 'Basique 1',
    subLabel: 'Basique 1',
    levelTag: 'Básico 1 – Fundamentos • 4 Meses',
    titleLine1: 'Fundamentos del francés.',
    titleLine2: '¡Empieza a hablar!',
    iconDoodle: '/imagenes-lp/beret_doodle_a1.webp',
    desc: 'En este nivel, los estudiantes se introducen en los fundamentos del francés. Aprenden el alfabeto, la pronunciación básica, la familia, la hora, la descripción física y las frases esenciales para la comunicación diaria. El objetivo principal es desarrollar la capacidad de comprender y usar expresiones cotidianas y frases sencillas para satisfacer necesidades inmediatas. Los alumnos empiezan a formar oraciones simples y a familiarizarse con la gramática elemental.',
    bullets: [
      { icon: 'chat', text: 'Presentación personal, saludos y situaciones cotidianas' },
      { icon: 'trophy', text: 'Desarrollo de las 4 competencias: habla, escucha, lectura y escritura' },
      { icon: 'book', text: '4 unidades (~1 mes c/u) con libro de actividades 100% gratis' },
      { icon: 'people', text: 'Examen escrito y oral al finalizar con certificado del nivel' }
    ],
    characterImage: '/imagenes-lp/estudiante_con_portatil_y_auriculares.webp',
    characterAlt: 'Chica adolescente con audífonos blancos, laptop y cuaderno - Nivel A1'
  },
  A2: {
    code: 'A2',
    sub: 'Basique 2',
    subLabel: 'Basique 2',
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
    sub: 'Intermédiaire 1',
    subLabel: 'Intermédiaire 1',
    levelTag: 'Intermedio 1 – Exploración y Fluidez • 4 Meses',
    titleLine1: 'Explora temas complejos.',
    titleLine2: '¡Gana fluidez y precisión!',
    iconDoodle: '/imagenes-lp/chat_bubble_doodle_b1.webp',
    desc: 'En el nivel Intermedio 1, los estudiantes ya tienen una base sólida y empiezan a explorar temas más complejos. Se trabaja intensamente en la gramática y en la ampliación del vocabulario (los pasatiempos, los deportes, ir al médico, invitar a alguien a salir...). Los alumnos aprenden a expresarse con mayor fluidez y precisión, pudiendo hablar sobre experiencias personales, describir eventos y expresar opiniones en presente, pasado y futuro. La comprensión de textos escritos más largos y complejos también es un objetivo clave en este nivel.',
    bullets: [
      { icon: 'chat', text: 'Autonomía para viajar y desenvolverte en países francófonos' },
      { icon: 'people', text: 'Expresión fluida de opiniones, ambiciones, proyectos y relatos' },
      { icon: 'book', text: '4 unidades de estudio práctico con material pedagógico gratuito' },
      { icon: 'trophy', text: 'Acreditación mediante examen oral y escrito con certificado del nivel' }
    ],
    characterImage: '/imagenes-lp/estudiante_celebrando_frente_al_portatil.webp',
    characterAlt: 'Joven con camisa verde, laptop y cuaderno - Nivel A2+'
  },
  B1: {
    code: 'B1',
    sub: 'Intermédiaire 2',
    subLabel: 'Intermédiaire 2',
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
    sub: 'Avancé 1',
    subLabel: 'Avancé 1',
    levelTag: 'Avanzado 1 – Argumentación y Dominio • 4 Meses',
    titleLine1: 'Argumenta con claridad.',
    titleLine2: '¡Comunica con soltura!',
    iconDoodle: '/imagenes-lp/star_doodle_c1.webp',
    desc: 'En el nivel Avanzado 1, los estudiantes alcanzan un alto grado de competencia en el idioma. Son capaces de comprender y producir textos detallados y bien estructurados sobre temas complejos. Se les enseña a argumentar con claridad y coherencia, utilizando una variedad de estructuras gramaticales y vocabulario avanzado. La interacción en discusiones formales e informales se convierte en una parte esencial del aprendizaje.',
    bullets: [
      { icon: 'chat', text: 'Debates sobre temas complejos, culturales, profesionales y abstractos' },
      { icon: 'people', text: 'Comprensión auditiva completa de nativos y modismos cotidianos' },
      { icon: 'book', text: '4 unidades avanzadas con dinámicas interactivas y roleplays' },
      { icon: 'trophy', text: 'Examen oral y escrito riguroso con certificado del nivel' }
    ],
    characterImage: '/imagenes-lp/profesora_remota_explicando_ante_su_portatil.webp',
    characterAlt: 'Alumna adulta en clase online con laptop y libreta - Nivel B1+'
  },
  B2: {
    code: 'B2',
    sub: 'Avancé 2',
    subLabel: 'Avancé 2',
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
    sub: 'Perfectionnement',
    subLabel: 'Perfectionnement',
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

export const LEVELS = DEFAULT_LEVELS;

const DEFAULT_TEACHERS = [
  {
    id: 'fanny',
    name: 'Fanny',
    role: 'Profesora de francés',
    specialty: 'FRANCÉS REAL Y CONFIANZA',
    city: 'Toulouse',
    image: '/imagenes-lp/teacher_fanny.webp',
    video: '/videos/teacher_fanny.mp4',
    quote: "Mi objetivo es que aprendas el francés de verdad y que no tengas miedo de expresarte. En mis clases siempre habrá un ambiente de confianza."
  },
  {
    id: 'jeremy',
    name: 'Jérémy',
    role: 'Profesor de francés',
    specialty: 'EXPRESIÓN NATURAL Y CONVERSACIÓN',
    city: 'Bordeaux',
    image: '/imagenes-lp/teacher_jeremy.webp',
    video: '/videos/teacher_jeremy.mp4',
    quote: "Mi objetivo es que empieces a expresarte en francés de forma natural."
  },
  {
    id: 'sophie',
    name: 'Sophie',
    role: 'Profesora de francés',
    specialty: 'CULTURA Y VIDA COTIDIANA',
    city: 'Lyon',
    image: '/imagenes-lp/teacher_sophie.webp',
    video: '/videos/teacher_sophie.mp4',
    quote: "Te espero para aprender francés con alegría y buen humor. ¡Gastronomía, cultura y conjugación!"
  },
  {
    id: 'itzel',
    name: 'Itzel',
    role: 'Profesora de francés',
    specialty: 'PACIENCIA Y APRENDIZAJE CERCANO',
    city: 'Bordeaux',
    image: '/imagenes-lp/teacher_itzel.webp',
    video: '/videos/teacher_itzel.mp4',
    quote: "Soy curiosa, paciente y disfruto de las cosas sencillas. Me gusta enseñar con calma y buen humor."
  },
  {
    id: 'fabien',
    name: 'Fabien',
    role: 'Profesor de francés',
    specialty: 'APRENDIZAJE DINÁMICO Y DIVERTIDO',
    city: 'Paris',
    image: '/imagenes-lp/teacher_fabien.webp',
    video: '/videos/teacher_fabien.mp4',
    quote: "Olvídate de las clases aburridas; conmigo aprenderás mientras te diviertes."
  },
  {
    id: 'pauline',
    name: 'Pauline',
    role: 'Profesora de francés',
    specialty: 'CONFIANZA Y PROGRESO A TU RITMO',
    city: 'Lyon',
    image: '/imagenes-lp/teacher_pauline.webp',
    video: '/videos/teacher_pauline.mp4',
    quote: "Me encantará acompañarte para que avances a tu ritmo y ganes confianza en tu francés."
  },
  {
    id: 'camille',
    name: 'Camille',
    role: 'Profesora de francés',
    specialty: 'FRANCÉS REAL Y CULTURA FRANCESA',
    city: 'Lyon',
    image: '/imagenes-lp/teacher_camille.webp',
    video: '/videos/teacher_camille.mp4',
    quote: "Aprenderás el francés de verdad, el que escuchas en los cafés, con la elegancia francesa."
  }
];

const DEFAULT_HERO_SLIDES = [
  { id: 'slide-1', src: '/imagenes-lp/hero_slide_3.webp', alt: 'Jóvenes Estudiantes Les Rois du Français' },
  { id: 'slide-2', src: '/imagenes-lp/rey.webp', alt: 'Rey Oficial Les Rois du Français' },
  { id: 'slide-3', src: '/imagenes-lp/hero_slide_1.webp', alt: 'Reina con Corona Les Rois du Français' },
  { id: 'slide-4', src: '/imagenes-lp/hero_slide_2.webp', alt: 'Estudiante con Celular Les Rois du Français' }
];


const GRID_LEVELS = [
  {
    code: 'A1',
    rank: 'BASIQUE 1',
    title: 'Fundamentos del francés',
    quote: '“Empieza a hablar.”',
    badgeBg: '#001844',
    bullets: [
      'Presentarte y desenvolverte en situaciones cotidianas',
      'Vocabulario y gramática básica',
      'Hablar, escuchar, leer y escribir'
    ]
  },
  {
    code: 'A2',
    rank: 'BASIQUE 2',
    title: 'Comunicación en francés',
    quote: '“Exprésate con confianza.”',
    badgeBg: '#D92534',
    bullets: [
      'Hablar de rutina, gustos y experiencias',
      'Comprender y construir frases más completas',
      'Mejorar comunicación oral y escrita'
    ]
  },
  {
    code: 'A2+',
    rank: 'INTERMÉDIAIRE 1',
    title: 'Gana fluidez',
    quote: '“Comunícate cada vez mejor.”',
    badgeBg: '#001844',
    bullets: [
      'Contar experiencias y hablar del pasado y futuro',
      'Comprender conversaciones cotidianas',
      'Expresarte con mayor facilidad'
    ]
  },
  {
    code: 'B1',
    rank: 'INTERMÉDIAIRE 2',
    title: 'Francés independiente',
    quote: '“Habla con más autonomía.”',
    badgeBg: '#D92534',
    bullets: [
      'Expresar opiniones y contar historias',
      'Comprender textos y conversaciones más complejas',
      'Comunicarte con mayor espontaneidad'
    ]
  },
  {
    code: 'B1+',
    rank: 'AVANCÉ 1',
    title: 'Consolida tu francés',
    quote: '“Afina tu expresión.”',
    badgeBg: '#001844',
    bullets: [
      'Argumentar y debatir',
      'Comprender documentos más elaborados',
      'Expresarte con mayor precisión'
    ]
  },
  {
    code: 'B2',
    rank: 'AVANCÉ 2',
    title: 'Domina el francés',
    quote: '“Comunícate con soltura.”',
    badgeBg: '#D92534',
    bullets: [
      'Defender ideas y participar en debates',
      'Comprender contenidos complejos',
      'Expresarte con fluidez y precisión'
    ]
  },
  {
    code: 'B2-C1',
    rank: 'PERFECTIONNEMENT',
    title: 'Perfecciona tu francés',
    quote: '“Habla, argumenta y certifícate.”',
    badgeBg: '#D59B28',
    bullets: [
      'Conversación avanzada',
      'Fluidez y precisión',
      'Preparación DELF, DALF y TCF'
    ]
  }
];

export function LandingPage() {
  const { user, isAdmin, isTeacher } = useAuthStore();
  const accountPortalLink = !user ? '/login' : isAdmin ? '/admin/groups' : isTeacher ? '/teacher' : '/dashboard';
  const [heroSlideIndex, setHeroSlideIndex] = useState<number>(0);

  // Dynamic Landing Page Config (Loaded from Supabase with instant fallback)
  const [heroSlides, setHeroSlides] = useState<any[]>(DEFAULT_HERO_SLIDES);
  const [teachers, setTeachers] = useState<any[]>(DEFAULT_TEACHERS);
  const [levelsData, setLevelsData] = useState<Record<string, LevelData>>(DEFAULT_LEVELS);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const loadConfig = async () => {
      let cfg: any = null;
      try {
        const res = await fetch(`${apiUrl}/landing-config?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
        });
        if (res.ok) {
          cfg = await res.json();
        }
      } catch (_) {}

      // Fallback directo a Supabase si el backend no responde (ej. deploy en Vercel)
      if (!cfg || cfg.statusCode) {
        try {
          const { data: sbData } = await supabase
            .from('AppSettings')
            .select('*')
            .eq('id', 'global')
            .maybeSingle();
          if (sbData) {
            cfg = sbData;
          }
        } catch (_) {}
      }

      if (cfg && typeof cfg === 'object') {
        if (Array.isArray(cfg.heroSlides) && cfg.heroSlides.length > 0) {
          const active = cfg.heroSlides.filter((s: any) => s.active !== false);
          if (active.length > 0) setHeroSlides(active);
        }
        if (Array.isArray(cfg.teachers) && cfg.teachers.length > 0) {
          setTeachers(cfg.teachers);
        }
        if (cfg.levelsData && typeof cfg.levelsData === 'object' && Object.keys(cfg.levelsData).length > 0) {
          const sanitized = { ...cfg.levelsData };
          Object.keys(sanitized).forEach(k => {
            if (sanitized[k]?.characterImage?.includes('french_guy_pointing')) {
              sanitized[k].characterImage = DEFAULT_LEVELS[k]?.characterImage;
              sanitized[k].characterAlt = DEFAULT_LEVELS[k]?.characterAlt;
            }
          });
          setLevelsData(prev => ({ ...prev, ...sanitized }));
        }
      }
    };

    loadConfig();

    // 1. Cross-tab real-time sync: when admin saves in another tab, update immediately
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'rdf_landing_config_updated') {
        loadConfig();
      }
    };
    window.addEventListener('storage', handleStorage);

    // 2. Re-fetch when user switches back to this tab
    const handleFocus = () => {
      loadConfig();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Preload all 7 level character silhouettes immediately into browser memory for 0ms lag-free tabs
  useEffect(() => {
    const levelKeys = ['A1', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2-C1'];
    levelKeys.forEach((lvlKey) => {
      const charImg = levelsData[lvlKey]?.characterImage || DEFAULT_LEVELS[lvlKey]?.characterImage;
      if (charImg) {
        const img = new Image();
        img.src = charImg;
      }
    });
  }, [levelsData]);

  // Auto-cycle hero character slides every 5 seconds with slow smooth cross-fade
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setHeroSlideIndex(prev => (prev + 1) % heroSlides.length);
    }, 30000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPlayingClassVideo, setIsPlayingClassVideo] = useState(false);
  const classVideoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayClassVideo = () => {
    if (classVideoRef.current) {
      if (isPlayingClassVideo) {
        classVideoRef.current.pause();
        setIsPlayingClassVideo(false);
      } else {
        classVideoRef.current.play();
        setIsPlayingClassVideo(true);
      }
    }
  };
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeTeacherVideo, setActiveTeacherVideo] = useState<{
    id: string;
    name: string;
    video: string;
    role: string;
    city: string;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeTeacherVideo) setActiveTeacherVideo(null);
        if (videoModalOpen) setVideoModalOpen(false);
      }
    };
    if (activeTeacherVideo || videoModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeTeacherVideo, videoModalOpen]);
  const [pricingTab, setPricingTab] = useState<'grupales' | 'particulares'>('grupales');
  const [selectedGroupPlan, setSelectedGroupPlan] = useState<'regular' | 'sabatino' | 'intensivo' | null>(null);
  const [selectedPrivateType, setSelectedPrivateType] = useState<'individual' | 'duo'>('individual');
  const [selectedPrivateRate, setSelectedPrivateRate] = useState<number>(3);
  const [selectedDuoRate, setSelectedDuoRate] = useState<number>(2);
  const [selectedPromoMonths, setSelectedPromoMonths] = useState<3 | 6 | 9>(6);

  // MRAF Section State
  const [activeMrafIndex, setActiveMrafIndex] = useState<number>(0);

  const WHATSAPP_PHONE = '522223437074';

  const openLeadModal = (origin?: string) => {
    let message = 'Hola, me gustaría solicitar mi clase de prueba gratis.';
    if (origin) {
      if (origin.includes('Sabatino')) {
        message = 'Hola, me gustaría solicitar mi clase de prueba gratis para la modalidad Sabatino.';
      } else if (origin.includes('Regular')) {
        message = 'Hola, me gustaría solicitar mi clase de prueba gratis para la modalidad Regular.';
      } else if (origin.includes('Intensivo')) {
        message = 'Hola, me gustaría solicitar mi clase de prueba gratis para la modalidad Intensivo.';
      } else if (origin.includes('Particulares') || origin.includes('Part Duo')) {
        message = `Hola, me gustaría solicitar informes para clases ${origin.includes('Part Duo') ? 'Part Duo' : 'Particulares'}.`;
      } else if (origin.includes('Promoción')) {
        message = `Hola, me gustaría solicitar informes para la ${origin}.`;
      } else if (origin.includes('Nivel')) {
        message = `Hola, me gustaría solicitar informes para el ${origin}.`;
      }
    }
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleNavAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setIsMobileMenuOpen(false);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  const handleCourseNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: 'cursos' | 'precios',
    tab?: 'grupales' | 'particulares'
  ) => {
    setIsMobileMenuOpen(false);
    if (tab) {
      setPricingTab(tab);
    }
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  return (
    <div className="lrd-landing">
      {/* Hero Section Container with Transparent Header Overlay */}
      <section className="lrd-hero-section-chateau" id="hero">
        {/* Photorealistic Chateau Sunset Background Image */}
        <img
          src="/imagenes-lp/chateau_sunset_bg.webp"
          alt="Château de Chambord al atardecer"
          className="lrd-hero-bg-chateau"
          decoding="async"
          fetchPriority="high"
        />
        {/* Soft Dark Subtle Overlay for legibility without obscuring photo colors */}
        <div className="lrd-hero-overlay-subtle"></div>

        {/* Transparent Header Navbar Directly Over Chateau Image */}
        <header className="lrd-header-transparent">
          <div className="lrd-container lrd-nav-container-clean">
            {/* Original Official Logo (Exact Logo Untouched) */}
            <Link to="/landing" className="lrd-brand-logo">
              <img
                src="/imagenes-lp/logo_official.webp"
                alt="Les Rois du Français"
                className="lrd-brand-logo-img"
                decoding="async"
                fetchPriority="high"
              />
            </Link>

            {/* Mobile Backdrop Overlay */}
            <div
              className={`lrd-mobile-backdrop ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Navigation Menu Links */}
            <nav className={`lrd-nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
              <ul className="lrd-nav-list-clean">
                <li className="lrd-nav-item">
                  <a href="#cursos" className="lrd-nav-link-clean" onClick={(e) => handleCourseNavClick(e, 'cursos')}>
                    CURSOS <ChevronDown size={12} color="#FFFFFF" />
                  </a>
                  <ul className="lrd-dropdown-menu">
                    <li><a href="#cursos" onClick={(e) => handleCourseNavClick(e, 'cursos')}>7 Niveles Oficiales (Basique a Perfectionnement)</a></li>
                    <li><a href="#precios" onClick={(e) => handleCourseNavClick(e, 'precios', 'grupales')}>Clases Grupales (Regular, Sabatino, Intensivo)</a></li>
                    <li><a href="#precios" onClick={(e) => handleCourseNavClick(e, 'precios', 'particulares')}>Clases Particulares & Part Duo</a></li>
                  </ul>
                </li>
                <li className="lrd-nav-item">
                  <a href="#precios" className="lrd-nav-link-clean" onClick={() => setIsMobileMenuOpen(false)}>PRECIOS Y HORARIOS</a>
                </li>
                <li className="lrd-nav-item">
                  <a href="#metodo" className="lrd-nav-link-clean" onClick={() => setIsMobileMenuOpen(false)}>MÉTODO MRAF®</a>
                </li>
                <li className="lrd-nav-item">
                  <a href="#promos" className="lrd-nav-link-clean" onClick={() => setIsMobileMenuOpen(false)}>PROMOCIONES</a>
                </li>
                <li className="lrd-nav-item">
                  <a href="#nosotros" className="lrd-nav-link-clean" onClick={() => setIsMobileMenuOpen(false)}>SOBRE NOSOTROS</a>
                </li>
                <li className="lrd-nav-item">
                  <a
                    href="#contacto"
                    className="lrd-nav-link-clean"
                    onClick={(e) => handleNavAnchorClick(e, 'contacto')}
                  >
                    CONTACTO
                  </a>
                </li>
              </ul>

              <div className="lrd-mobile-nav-cta">
                <Link
                  to={accountPortalLink}
                  className="lrd-btn-mobile-portal-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={15} /> ACCEDER A MI CUENTA
                </Link>
                <button
                  className="lrd-btn-cta-red-compact lrd-full-width"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openLeadModal('Clase de Prueba Gratis (Móvil)');
                  }}
                >
                  CLASE DE PRUEBA GRATIS
                </button>
              </div>
            </nav>

            {/* Right Side Header Actions: Account (Top Right) + Social & Red CTA Button (Bottom Right) */}
            <div className="lrd-nav-actions-clean">
              {/* Botón directo de Acceso para Móvil y Tablet */}
              <Link to={accountPortalLink} className="lrd-btn-header-account-pill">
                <User size={13} color="#FFFFFF" />
                <span className="lrd-pill-txt-short">MI CUENTA</span>
                <span className="lrd-pill-txt-full">ACCEDER A MI CUENTA</span>
              </Link>

              <div className="lrd-header-right-stacked">
                <div className="lrd-account-row-top">
                  <Link to={accountPortalLink} className="lrd-btn-top-account-clean">
                    <User size={13} color="#FFFFFF" /> ACCEDER A MI CUENTA
                  </Link>
                </div>

                <div className="lrd-header-actions-row">
                  <div className="lrd-social-icons-clean">
                    <a href="https://www.facebook.com/people/Les-Rois-du-Fran%C3%A7ais/61554418860885/" target="_blank" rel="noreferrer" className="lrd-social-icon-clean" aria-label="Facebook">
                      <FacebookIcon size={14} color="#001b50" />
                    </a>
                    <a href="https://www.instagram.com/lesroisdufrancais?igsh=MTNxbWR1OHM1Z2h6dA==" target="_blank" rel="noreferrer" className="lrd-social-icon-clean" aria-label="Instagram">
                      <InstagramIcon size={14} color="#001b50" />
                    </a>
                    <a href="https://www.youtube.com/@RoisduFrancais" target="_blank" rel="noreferrer" className="lrd-social-icon-clean" aria-label="YouTube">
                      <YoutubeIcon size={14} color="#001b50" />
                    </a>
                  </div>

                  {/* Compact Red CTA Button */}
                  <button className="lrd-btn-cta-red-compact lrd-desktop-only-btn" onClick={() => openLeadModal('Clase de Prueba Gratis Header')}>
                    CLASE DE PRUEBA GRATIS
                  </button>
                </div>
              </div>

              <button
                className="lrd-hamburger"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X size={24} color="#FFFFFF" /> : <Menu size={24} color="#FFFFFF" />}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Content Container */}
        <div className="lrd-container lrd-hero-container-clean">
          {/* Left Content Side */}
          <div className="lrd-hero-left-clean">
            {/* Corona Oficial e Insignia VIP de Alta Gama: Profesores Nativos + 100% Online */}
            <div className="lrd-hero-crown-badge-row">
              <img
                src="/imagenes-lp/hero_crown_red.webp"
                alt="Corona Les Rois du Français"
                className="lrd-crown-red-img"
                decoding="async"
                fetchPriority="high"
              />
              <div className="lrd-hero-vip-badge">
                <span className="lrd-vip-badge-text-main">
                  Profesores franceses
                </span>

                <span className="lrd-vip-badge-star" aria-hidden="true">•</span>

                <span className="lrd-vip-badge-text-sub">
                  100% online en vivo
                </span>
              </div>
            </div>

            {/* Main Title: Tu reinado del / francés (Red) / en línea */}
            <h1 className="lrd-hero-title-serif">
              Tu reinado del<br />
              <span className="lrd-hero-red-word">francés</span> en línea
            </h1>

            {/* Supporting Hero Message */}
            <div className="lrd-hero-method-text">
              <p className="lrd-method-line1">
                Cualquiera puede hablar francés
              </p>
            </div>

            {/* Horizontally Aligned Buttons: COMENZAR AHORA (Red) & VER VIDEO (Transparent outline) */}
            <div className="lrd-hero-buttons-row">
              <button className="lrd-btn-red-main" onClick={() => openLeadModal('Comenzar Ahora Hero')}>
                COMENZAR AHORA
              </button>
              <button className="lrd-btn-outline-white" onClick={() => setVideoModalOpen(true)}>
                <Play size={14} fill="#FFFFFF" color="#FFFFFF" style={{ marginRight: '6px' }} /> VER VIDEO
              </button>
            </div>

            {/* Bullet Highlights */}
            <div className="lrd-hero-bullets-row">
              <span className="lrd-bullet-item">
                <Check size={16} color="#D59B28" strokeWidth={2.6} /> Sin compromiso
              </span>
              <span className="lrd-bullet-item">
                <Check size={16} color="#D59B28" strokeWidth={2.6} /> Grupos reducidos
              </span>
              <span className="lrd-bullet-item">
                <Check size={16} color="#D59B28" strokeWidth={2.6} /> Clases en vivo
              </span>
            </div>
          </div>

          {/* Right Content Side: Royal Characters Slideshow (4 images with cross-fade) */}
          <div className="lrd-hero-right-prince">
            {heroSlides.map((slide, idx) => (
              <img
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                className={`lrd-king-img-prominent lrd-hero-slide-item ${idx === heroSlideIndex ? 'active' : ''}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'low'}
                decoding="async"
              />
            ))}
          </div>
        </div>

        {/* Bottom Painted Brush Stroke Edge Divider */}
        <img
          src="/imagenes-lp/hero_bottom_brush.svg"
          alt="Pincelada de acabado"
          className="lrd-hero-brush-bottom"
        />
      </section>

      {/* Stats Counter Bar Section */}
      <section className="lrd-stats-bar-section">
        <div className="lrd-container">
          <div className="lrd-stats-card">
            <div className="lrd-stat-col">
              <div className="lrd-stat-icon-wrap">
                <Crown size={26} color="#FFFFFF" />
              </div>
              <div className="lrd-stat-info">
                <span className="lrd-stat-val">20+</span>
                <span className="lrd-stat-lbl">AÑOS DE EXPERIENCIA</span>
              </div>
            </div>

            <div className="lrd-stat-col">
              <div className="lrd-stat-icon-wrap">
                <Users size={26} color="#FFFFFF" />
              </div>
              <div className="lrd-stat-info">
                <span className="lrd-stat-val">+1,000</span>
                <span className="lrd-stat-lbl">ALUMNOS FELICES</span>
              </div>
            </div>

            <div className="lrd-stat-col">
              <div className="lrd-stat-icon-wrap">
                <Video size={26} color="#FFFFFF" />
              </div>
              <div className="lrd-stat-info">
                <span className="lrd-stat-val">+150,000</span>
                <span className="lrd-stat-lbl">CLASES IMPARTIDAS ONLINE</span>
              </div>
            </div>

            <div className="lrd-stat-col">
              <div className="lrd-stat-icon-wrap">
                <Star size={26} color="#FFFFFF" />
              </div>
              <div className="lrd-stat-info">
                <span className="lrd-stat-val">4.9/5</span>
                <span className="lrd-stat-lbl">EN GOOGLE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 1: NUESTRO MÉTODO MRAF® - EDICIÓN REALEZA REBELDE (CRISP VECTOR CODE) */}
      <section className="lrd-section-mraf-new lrd-mraf-showcase-deluxe" id="metodo">
        {/* Ilus de Fondo: Castillo Francés Izquierda, Retrato Reina Derecha y Flor Floral Derecha Abajo */}
        <img loading="lazy" decoding="async" src="/imagenes-lp/castle_sketch_hd.webp?v=5"
          alt="Castillo Francés Grabado"
          className="lrd-bg-sketch-castle"
        />
        <img loading="lazy" decoding="async" src="/imagenes-lp/queen_frame_hd.webp?v=3"
          alt="Retrato Reina Grabado"
          className="lrd-bg-sketch-queen"
        />
        <img loading="lazy" decoding="async" src="/imagenes-lp/flora_fleur_sketch_hd.webp?v=999999"
          alt="Flor Floral Grabado"
          className="lrd-bg-sketch-flora"
        />

        <div className="lrd-container lrd-mraf-container-relative">
          {/* Header Método MRAF */}
          <div className="lrd-mraf-header-deluxe">
            <h2 className="lrd-mraf-clean-title">
              <span className="lrd-mraf-title-line1">EL MÉTODO PARA HABLAR</span>
              <span className="lrd-mraf-title-line2">
                <span className="lrd-text-red">FRANCÉS</span>{' '}
                <span className="lrd-text-navy">SIN SUFRIR</span>
              </span>
            </h2>

            <div className="lrd-mraf-ribbon-wrap">
              <span className="lrd-mraf-ribbon-pill">
                MRAF® – Méthode Rapide d'Apprentissage du Français
              </span>
            </div>

            {/* Distintivo de Edad: Desde los 12 años · Sin límite de edad */}
            <div className="lrd-mraf-age-badge-wrap">
              <div className="lrd-mraf-age-pill">
                <Users size={16} color="#D59B28" strokeWidth={2.4} />
                <span className="lrd-mraf-age-pill-main">DESDE LOS 12 AÑOS · SIN LÍMITE DE EDAD</span>
              </div>
            </div>
          </div>

          {/* Grid de 4 Tarjetas Interactivas M - R - A - F */}
          <div className="lrd-mraf-grid-deluxe">


            {/* Card 1: M - MÉTODO */}
            <div
              className={`lrd-mraf-card-deluxe lrd-card-m ${activeMrafIndex === 0 ? 'lrd-active-deluxe' : ''}`}
              onClick={() => setActiveMrafIndex(0)}
              onMouseEnter={() => setActiveMrafIndex(0)}
            >
              <div className="lrd-card-top-icon">
                <img loading="lazy" decoding="async" src="/imagenes-lp/crown_m.webp?v=2" alt="Corona M" className="lrd-crown-icon-sm" />
              </div>
              <span className="lrd-giant-letter lrd-navy-letter">M</span>
              <h3 className="lrd-mraf-title-label">MÉTODO</h3>
              
              {/* Dos Líneas Doradas con Bolita Central */}
              <div className="lrd-gold-divider-dots">
                <span className="lrd-gline"></span>
                <span className="lrd-gdot"></span>
                <span className="lrd-gline"></span>
              </div>

              <p className="lrd-mraf-desc-text lrd-desc-card-m">
                Aquí sí vienes a <span className="lrd-text-gold-highlight-bold">hablar</span>, <br />
                <strong className="lrd-text-navy-strong">no a memorizar.</strong>
              </p>

              {/* Doble Subrayado Rojo */}
              <div className="lrd-double-red-lines">
                <span className="lrd-rline-long"></span>
                <span className="lrd-rline-short"></span>
              </div>

              <span className="lrd-hashtag-badge lrd-navy-badge">#PrácticaReal</span>
            </div>

            {/* Card 2: R - RÁPIDO */}
            <div
              className={`lrd-mraf-card-deluxe lrd-card-r ${activeMrafIndex === 1 ? 'lrd-active-deluxe' : ''}`}
              onClick={() => setActiveMrafIndex(1)}
              onMouseEnter={() => setActiveMrafIndex(1)}
            >
              <div className="lrd-card-top-icon">
                <img loading="lazy" decoding="async" src="/imagenes-lp/crown_r.webp" alt="Corona R" className="lrd-crown-icon-sm" />
              </div>
              <div className="lrd-letter-wrap-r">
                <span className="lrd-giant-letter lrd-red-letter">R</span>
              </div>
              <h3 className="lrd-mraf-title-label">RÁPIDO</h3>
              <p className="lrd-mraf-desc-text">
                Sí, vas a hablar francés desde el <strong className="lrd-text-red-bold">día 1</strong>. No, no es magia.
              </p>
              <span className="lrd-hashtag-badge lrd-red-badge">#HablaDesdeElDía1</span>
            </div>

            {/* Card 3: A - APRENDIZAJE (LA FAVORITA) */}
            <div
              className={`lrd-mraf-card-deluxe lrd-card-a-featured ${activeMrafIndex === 2 ? 'lrd-active-deluxe' : ''}`}
              onClick={() => setActiveMrafIndex(2)}
              onMouseEnter={() => setActiveMrafIndex(2)}
            >
              <div className="lrd-card-top-icon">
                <img loading="lazy" decoding="async" src="/imagenes-lp/crown_a.webp?v=999999" alt="Corona A" className="lrd-crown-icon-sm" />
              </div>
              <div className="lrd-letter-wrap-a">
                <span className="lrd-giant-letter lrd-gold-letter">A</span>
              </div>
              <h3 className="lrd-mraf-title-label lrd-gold-title">APRENDIZAJE</h3>
              <p className="lrd-mraf-desc-text lrd-white-desc">
                <strong className="lrd-text-gold-highlight">4 habilidades clave</strong> para que entiendas, pienses y hables de forma natural.
              </p>
              <span className="lrd-hashtag-badge lrd-gold-badge">#4Habilidades</span>
            </div>

            {/* Card 4: F - FRANCÉS */}
            <div
              className={`lrd-mraf-card-deluxe lrd-card-f ${activeMrafIndex === 3 ? 'lrd-active-deluxe' : ''}`}
              onClick={() => setActiveMrafIndex(3)}
              onMouseEnter={() => setActiveMrafIndex(3)}
            >
              <div className="lrd-card-top-icon">
                <img loading="lazy" decoding="async" src="/imagenes-lp/crown_f_nobg.webp?v=99999" alt="Corona F" className="lrd-crown-icon-sm" />
              </div>
              <div className="lrd-letter-wrap-f">
                <span className="lrd-giant-letter lrd-navy-letter">F</span>
              </div>
              <div className="lrd-title-wrap-f">
                <h3 className="lrd-mraf-title-label">FRANCÉS</h3>
                <span className="lrd-doodle-lines-f">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#001b50" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="3" y1="10" x2="8" y2="10" />
                    <line x1="4" y1="4" x2="8" y2="7" />
                    <line x1="4" y1="16" x2="8" y2="13" />
                  </svg>
                </span>
              </div>
              <p className="lrd-mraf-desc-text">
                Francés <strong className="lrd-text-red-bold">de verdad</strong>, no el del libro de texto de <span className="lrd-underline-1998">1998</span>.
              </p>
              <span className="lrd-hashtag-badge lrd-red-badge">#100%Nativo</span>
            </div>


          </div>

          {/* Conclusión del Método: Enfoque Intuitivo y Práctico */}
          <div className="lrd-mraf-conclusion-box">
            <p className="lrd-mraf-conclusion-intro">
              Un método intuitivo donde aprendes francés usándolo: conversación, interacción y participación activa en cada clase.
            </p>

            <div className="lrd-mraf-principles-row">
              <div className="lrd-mraf-principle-item">
                <div className="lrd-mraf-principle-icon lrd-principle-icon-red">
                  <MessageSquare size={18} color="#D92534" strokeWidth={2.2} />
                </div>
                <div className="lrd-mraf-principle-text">
                  <h4 className="lrd-mraf-principle-title">CONVERSACIÓN REAL</h4>
                  <p className="lrd-mraf-principle-desc">Hablas francés desde el primer día.</p>
                </div>
              </div>

              <div className="lrd-mraf-principle-item">
                <div className="lrd-mraf-principle-icon lrd-principle-icon-gold">
                  <MessageCircle size={18} color="#D59B28" strokeWidth={2.2} />
                </div>
                <div className="lrd-mraf-principle-text">
                  <h4 className="lrd-mraf-principle-title">INTERACCIÓN CONSTANTE</h4>
                  <p className="lrd-mraf-principle-desc">Preguntas, respondes y recibes correcciones.</p>
                </div>
              </div>

              <div className="lrd-mraf-principle-item">
                <div className="lrd-mraf-principle-icon lrd-principle-icon-sparkle">
                  <Sparkles size={18} color="#D59B28" strokeWidth={2.2} />
                </div>
                <div className="lrd-mraf-principle-text">
                  <h4 className="lrd-mraf-principle-title">PARTICIPACIÓN ACTIVA</h4>
                  <p className="lrd-mraf-principle-desc">Practicas, opinas y te involucras en cada sesión.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subtítulo Inferior Vectorial Elegante & Botón Rojo CTA Centrado */}
          <div className="lrd-mraf-bottom-cta-block">
            <div className="lrd-mraf-cta-typography-clean">
              <div className="lrd-mraf-cta-pre-row">
                <span className="lrd-mraf-cta-question">¿Y LO MEJOR?</span>
              </div>
              <h3 className="lrd-mraf-cta-main-headline">
                No necesitas ser un genio para aprender francés.
              </h3>
              <div className="lrd-mraf-cta-sub-wrap">
                <span className="lrd-mraf-cta-sub-text">
                  Solo necesitas <strong className="lrd-mraf-cta-accent-red">empezar.</strong>
                </span>
                <div className="lrd-mraf-cta-gold-brush-line"></div>
              </div>
            </div>

            <div className="lrd-cta-btn-arrow-row">
              <button
                className="lrd-btn-red-main lrd-btn-cta-royal-mraf"
                onClick={() => openLeadModal('Probar el Método MRAF®')}
              >
                QUIERO PROBAR EL MÉTODO <Crown size={16} fill="#D59B28" color="#D59B28" style={{ display: 'inline', marginLeft: '6px', verticalAlign: 'middle' }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN INTERACTIVA: CONOCE A NUESTROS PROFESORES */}
      {/* SECCIÓN: CONOCE A NUESTROS PROFESORES (GRID DE 3 PROFESORES CON MÁXIMO PROTAGONISMO) */}
      <section className="lrd-teachers-section-interactive" id="profesores">
        <div className="lrd-container">
          {/* Encabezado Principal Humanizado & Royal */}
          <div className="lrd-teachers-header-center">
            <h2 className="lrd-teachers-main-title">
              CONOCE A NUESTROS <span className="lrd-text-red-gradient">PROFESORES</span>
            </h2>
            <p className="lrd-teachers-concept-phrase">
              Profesores franceses que harán que el francés cobre vida.
            </p>
            <p className="lrd-teachers-human-sub">
              Conoce a las personas que estarán contigo clase a clase.
            </p>
          </div>

          {/* GRID DE 7 PROFESORES VISIBLES (ALTO PROTAGONISMO Y ORDEN EQUILIBRADO) */}
          <div className="lrd-teachers-royal-grid">
            {teachers.map((teacher, index) => {
              const isFemale = ['fanny', 'sophie', 'itzel', 'pauline', 'camille'].includes(teacher.id) ||
                teacher.role?.toLowerCase().includes('profesora');
              const nativeCondition = isFemale ? 'Profesora de francés' : 'Profesor de francés';
              const confirmedSpecialty = teacher.specialty || 'FRANCÉS REAL Y CONVERSACIÓN';
              const personalPresentation = teacher.quote ? teacher.quote.replace(/^[“"']|[”"']$/g, '') : '';
              const cleanCity = teacher.city ? teacher.city.replace(', Francia', '').trim() : '';
              const teacherImg = teacher.image || `/imagenes-lp/teacher_${teacher.id}.webp`;
              const teacherVideo = teacher.video || `/videos/teacher_${teacher.id}.mp4`;

              const handleOpenTeacherVideo = () => {
                setActiveTeacherVideo({
                  id: teacher.id,
                  name: teacher.name,
                  video: teacherVideo,
                  role: nativeCondition,
                  city: cleanCity
                });
              };

              return (
                <article key={teacher.id || index} className={`lrd-teacher-royal-card lrd-teacher-card-${teacher.id}`}>
                  {/* Fotografía Principal (Protagonismo Visual Con Proporción Optimizada) */}
                  <div className="lrd-teacher-card-photo-wrap" onClick={handleOpenTeacherVideo} style={{ cursor: 'pointer' }}>
                    <img
                      loading="lazy"
                      decoding="async"
                      src={teacherImg}
                      alt={`Prof. ${teacher.name} - ${nativeCondition}`}
                      className={`lrd-teacher-card-img lrd-teacher-img-${teacher.id}`}
                    />

                    {/* Espacio sutil interactivo: Ver presentación */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenTeacherVideo();
                      }}
                      className="lrd-teacher-video-teaser"
                      title={`Ver video de presentación de Prof. ${teacher.name}`}
                    >
                      <Play size={11} fill="#FFFFFF" color="#FFFFFF" />
                      <span>Ver presentación</span>
                    </button>
                  </div>

                  {/* Cuerpo Informativo Limpio, Humano y Jerárquico */}
                  <div className="lrd-teacher-card-body">
                    {/* Nombre del Profesor */}
                    <h3 className="lrd-teacher-card-name">
                      Prof. {teacher.name}
                    </h3>

                    {/* Procedencia y Condición */}
                    <p className="lrd-teacher-card-meta">
                      <span className="lrd-meta-native-text">{nativeCondition}</span>
                      {cleanCity && (
                        <span className="lrd-meta-city-text"> · {cleanCity}</span>
                      )}
                    </p>

                    {/* Etiqueta de Enfoque */}
                    {confirmedSpecialty && (
                      <div className="lrd-teacher-specialty-badge">
                        <span>{confirmedSpecialty}</span>
                      </div>
                    )}

                    {/* Presentación Personal Breve */}
                    {personalPresentation && (
                      <p className="lrd-teacher-card-quote-text">
                        “{personalPresentation}”
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Barra de Reaseguro y Diferenciales del Staff */}
          <div className="lrd-teachers-trust-footer">
            <div className="lrd-trust-badge-item">
              <div className="lrd-trust-icon-box lrd-trust-box-french" title="100% Nativos de Francia">
                {/* Escudo Oficial Frances Tricolor Vectorial */}
                <svg width="22" height="24" viewBox="0 0 24 26" fill="none">
                  <path d="M12 2L4 5.2v6.5c0 5.8 3.4 11.2 8 12.8 4.6-1.6 8-7 8-12.8V5.2L12 2z" fill="#FFFFFF" />
                  <path d="M4 6.8v4.9c0 5.5 3.2 10.6 8 12.3V2.4L4 6.8z" fill="#002664" />
                  <path d="M12 24c4.8-1.7 8-6.8 8-12.3V6.8l-8-4.4V24z" fill="#ED2939" />
                  <path d="M9 3.8h6v19.4H9V3.8z" fill="#FFFFFF" />
                  <path d="M12 2L4 5.2v6.5c0 5.8 3.4 11.2 8 12.8 4.6-1.6 8-7 8-12.8V5.2L12 2z" stroke="#001844" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="lrd-trust-text-col">
                <strong>100% Nativos de Francia</strong>
                <span>Acentos reales de París, Lyon, Burdeos y Toulouse</span>
              </div>
            </div>

            <div className="lrd-trust-badge-item">
              <div className="lrd-trust-icon-box lrd-trust-box-red" title="Máximo 8 Alumnos por Grupo">
                {/* Icono Vectorial Grupos Reducidos / Atención VIP */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D92534" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" fill="#D92534" fillOpacity="0.12" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="lrd-trust-text-col">
                <strong>Máximo 8 Alumnos por Grupo</strong>
                <span>Atención cercana y corrección personalizada</span>
              </div>
            </div>

            <div className="lrd-trust-badge-item">
              <div className="lrd-trust-icon-box lrd-trust-box-gold" title="Rotación Real de Acentos">
                {/* Icono Vectorial Acústico de Rotación de Acentos */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D59B28" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" fill="#D59B28" fillOpacity="0.18" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              </div>
              <div className="lrd-trust-text-col">
                <strong>Clases con Diferentes Profesores Franceses</strong>
                <span>Acostúmbrate a escuchar distintos acentos del francés</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal / Lightbox de Presentación de Profesores */}
        {activeTeacherVideo && (
          <div
            className="lrd-video-modal-overlay"
            onClick={() => setActiveTeacherVideo(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Video de presentación - Prof. ${activeTeacherVideo.name}`}
          >
            <div
              className="lrd-video-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cabecera del Lightbox */}
              <div className="lrd-video-modal-header">
                <div className="lrd-video-modal-info">
                  <span className="lrd-video-modal-badge">PRESENTACIÓN OFICIAL</span>
                  <h3 className="lrd-video-modal-title">Prof. {activeTeacherVideo.name}</h3>
                  <p className="lrd-video-modal-sub">
                    {activeTeacherVideo.role} · {activeTeacherVideo.city}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTeacherVideo(null)}
                  className="lrd-video-modal-close-btn"
                  aria-label="Cerrar video"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Reproductor de Video */}
              <div className="lrd-video-modal-player-wrap">
                <video
                  key={activeTeacherVideo.video}
                  src={activeTeacherVideo.video}
                  controls
                  autoPlay={false}
                  preload="metadata"
                  playsInline
                  className="lrd-video-modal-player"
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECCIÓN: ASÍ SE VIVE UNA CLASE EN VIVO (EVIDENCIA REAL Y EXPERIENCIA) */}
      <section className="lrd-live-class-section" id="clase-en-vivo">
        <div className="lrd-container">
          <div className="lrd-live-class-grid">
            {/* Columna Izquierda: Contenido Editorial y Beneficios */}
            <div className="lrd-live-class-text-col">
              <div className="lrd-live-class-header-block">
                {/* Eyebrow con indicador de transmisión en vivo */}
                <div className="lrd-live-class-eyebrow-wrap">
                  <span className="lrd-live-class-eyebrow">
                    <Radio size={15} color="#D92534" strokeWidth={2.2} className="lrd-eyebrow-live-icon" />
                    CLASES REALES · 100% EN VIVO
                  </span>
                </div>

                {/* Título Principal de Gran Jerarquía */}
                <h2 className="lrd-live-class-main-title">
                  ASÍ SE VIVE UNA <span className="lrd-text-red-gradient lrd-nowrap">CLASE EN VIVO</span>
                  <br />
                  EN LES ROIS DU FRANÇAIS
                </h2>

                {/* Frase Concepto y Subtítulo */}
                <p className="lrd-live-class-concept-phrase">
                  No solo aprendes francés. Lo hablas.
                </p>
              </div>

              {/* 3 Beneficios Ligeros con Iconos SVG Minimalistas */}
              <div className="lrd-live-class-benefits-list">
                {/* 1. Conversación Real */}
                <div className="lrd-live-benefit-item">
                  <div className="lrd-live-benefit-icon-box">
                    <MessageCircle size={20} color="#001844" strokeWidth={2} />
                  </div>
                  <div className="lrd-live-benefit-content">
                    <h3 className="lrd-live-benefit-title">CONVERSACIÓN REAL</h3>
                  </div>
                </div>

                {/* 2. Interacción en Vivo */}
                <div className="lrd-live-benefit-item">
                  <div className="lrd-live-benefit-icon-box">
                    <Video size={20} color="#001844" strokeWidth={2} />
                  </div>
                  <div className="lrd-live-benefit-content">
                    <h3 className="lrd-live-benefit-title">INTERACCIÓN EN VIVO</h3>
                  </div>
                </div>

                {/* 3. Grupos Reducidos */}
                <div className="lrd-live-benefit-item">
                  <div className="lrd-live-benefit-icon-box">
                    <UsersRound size={20} color="#001844" strokeWidth={2} />
                  </div>
                  <div className="lrd-live-benefit-content">
                    <h3 className="lrd-live-benefit-title">GRUPOS REDUCIDOS</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Video Real Vertical con Mayor Protagonismo */}
            <div className="lrd-live-class-video-col">
              <div className={`lrd-live-class-video-card ${isPlayingClassVideo ? 'is-playing' : ''}`}>
                <video
                  ref={classVideoRef}
                  src="/videos/clase_real_prueba.mp4"
                  className="lrd-live-class-video-element"
                  playsInline
                  controls={isPlayingClassVideo}
                  onPlay={() => setIsPlayingClassVideo(true)}
                  onPause={() => setIsPlayingClassVideo(false)}
                  onEnded={() => setIsPlayingClassVideo(false)}
                  preload="metadata"
                />

                {/* Overlay Interactivo con badge único CLASE REAL y botón de reproducción */}
                {!isPlayingClassVideo && (
                  <div className="lrd-live-video-overlay" onClick={handlePlayClassVideo}>
                    <div className="lrd-live-video-top-badges">
                      <span className="lrd-live-badge-pill">
                        <BadgeCheck size={14} color="#D59B28" strokeWidth={2} />
                        CLASE REAL
                      </span>
                    </div>

                    <div className="lrd-live-play-cta-wrapper">
                      <button
                        type="button"
                        className="lrd-live-play-btn"
                        aria-label="Reproducir video de clase real"
                      >
                        <span className="lrd-play-icon-circle">
                          <Play size={20} fill="#001844" color="#001844" strokeWidth={2} style={{ marginLeft: '2px' }} />
                        </span>
                        <span className="lrd-play-btn-text">Mira una clase real</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Frase Final de Cierre Centrada y Elegante */}
          <div className="lrd-live-class-footer-row">
            <p className="lrd-live-closing-phrase">
              <span>Profesores reales</span>
              <span className="lrd-gold-diamond">◆</span>
              <span>Alumnos reales</span>
              <span className="lrd-gold-diamond">◆</span>
              <span>Francés en práctica.</span>
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN: PORTAL DEL ALUMNO (TU ESPACIO DIGITAL) */}
      <section className="lrd-portal-section" id="portal-alumno">
        <div className="lrd-container">
          <div className="lrd-portal-grid">
            
            {/* Columna Izquierda: Contenido Editorial y Beneficios */}
            <div className="lrd-portal-text-col">
              <div className="lrd-portal-header-block">
                {/* Eyebrow tecnológico en rojo Les Rois */}
                <div className="lrd-portal-eyebrow-wrap">
                  <span className="lrd-portal-eyebrow">
                    <LayoutDashboard size={14} color="#D92534" strokeWidth={2.2} />
                    TU ESPACIO DIGITAL
                  </span>
                </div>

                {/* Título Principal de Gran Jerarquía */}
                <h2 className="lrd-portal-main-title">
                  TU FRANCÉS,
                  <br />
                  <span className="lrd-portal-title-highlight">TODO EN UN SOLO LUGAR</span>
                </h2>

                <p className="lrd-portal-desc">
                  Accede a tus clases, materiales y progreso desde un mismo portal.
                </p>
              </div>

              {/* 3 Beneficios Ligeros con Iconos SVG Minimalistas */}
              <div className="lrd-portal-benefits-list">
                {/* Beneficio 1 */}
                <div className="lrd-portal-benefit-item">
                  <div className="lrd-portal-benefit-icon-box">
                    <LayoutDashboard size={20} color="#001b50" strokeWidth={2} />
                  </div>
                  <div className="lrd-portal-benefit-content">
                    <h3 className="lrd-portal-benefit-title">TODO EN UN SOLO LUGAR</h3>
                  </div>
                </div>

                {/* Beneficio 2 */}
                <div className="lrd-portal-benefit-item">
                  <div className="lrd-portal-benefit-icon-box">
                    <TrendingUp size={20} color="#001b50" strokeWidth={2} />
                  </div>
                  <div className="lrd-portal-benefit-content">
                    <h3 className="lrd-portal-benefit-title">SIGUE TU PROGRESO</h3>
                  </div>
                </div>

                {/* Beneficio 3 */}
                <div className="lrd-portal-benefit-item">
                  <div className="lrd-portal-benefit-icon-box">
                    <BookOpen size={20} color="#001b50" strokeWidth={2} />
                  </div>
                  <div className="lrd-portal-benefit-content">
                    <h3 className="lrd-portal-benefit-title">RECURSOS DISPONIBLES</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Captura REAL del Portal en Marco Estilo Navegador */}
            <div className="lrd-portal-preview-col">
              <div className="lrd-portal-browser-frame">
                {/* Barra Superior Estilo Navegador */}
                <div className="lrd-portal-browser-header">
                  <div className="lrd-browser-dots">
                    <span className="lrd-browser-dot lrd-dot-red"></span>
                    <span className="lrd-browser-dot lrd-dot-yellow"></span>
                    <span className="lrd-browser-dot lrd-dot-green"></span>
                  </div>
                  <div className="lrd-browser-address-bar">
                    <Lock size={12} className="lrd-browser-lock-icon" strokeWidth={2.4} />
                    <span className="lrd-browser-url-text">portal.lesroisdufrancais.com</span>
                  </div>
                </div>

                {/* Cuerpo del Navegador con Captura Real del Dashboard */}
                <div className="lrd-portal-browser-body">
                  <img
                    src="/imagenes-lp/portal_alumno_dashboard.webp"
                    alt="Captura real del Portal Académico del Alumno en Les Rois du Français"
                    className="lrd-portal-screenshot-img"
                    loading="eager"
                    decoding="async"
                  />
                  
                  {/* Badge Discreto de Experiencia */}
                  <div className="lrd-portal-floating-tag">
                    <span className="lrd-tag-live-dot"></span>
                    <span>INCLUIDO CON TU EXPERIENCIA</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN 2: TODOS LOS NIVELES - REDISEÑO VISUAL LIMPIO Y ELEGANTE */}
      <section className="lrd-section-levels-grid" id="cursos">
        <div className="lrd-container lrd-levels-relative-container">
          {/* Header de la sección */}
          <div className="lrd-levels-header-stepper">
            <div className="lrd-levels-headline-wrap">
              <div className="lrd-levels-tag-badge">
                TODOS LOS NIVELES
              </div>

              <h2 className="lrd-levels-main-title">
                DEL “¿QUÉ DIJO?” <br className="lrd-br-desktop-only" />
                AL <span className="lrd-title-red-highlight">“JE PARLE FRANÇAIS”.</span>
              </h2>
            </div>

            <p className="lrd-levels-subtitle">
              Encuentra tu nivel y empieza a avanzar con claridad.
            </p>
          </div>

          {/* Cuadrícula de Tarjetas Elegantes y Compactas */}
          <div className="lrd-levels-cards-wrap">
            {GRID_LEVELS.map((lvl) => (
              <div key={lvl.code} className="lrd-level-card-clean">
                {/* Header: Badge a la izquierda + Categoría y Título a la derecha */}
                <div className="lrd-card-header-clean">
                  <div
                    className={`lrd-card-badge-box ${lvl.code === 'B2-C1' ? 'is-code-b2c1' : ''}`}
                    style={{ backgroundColor: lvl.badgeBg }}
                  >
                    <span className={`lrd-card-badge-code ${lvl.code === 'B2-C1' ? 'is-code-b2c1-text' : ''}`}>
                      {lvl.code}
                    </span>
                  </div>
                  <div className="lrd-card-header-text">
                    <span className="lrd-card-category">{lvl.rank}</span>
                    <h3 className="lrd-card-title">{lvl.title}</h3>
                  </div>
                </div>

                {/* Frase corta oficial en dorado */}
                <p className="lrd-card-quote">{lvl.quote}</p>

                {/* Exactamente 3 puntos clave con checks dorados */}
                <ul className="lrd-card-bullets">
                  {lvl.bullets.map((point, idx) => (
                    <li key={idx} className="lrd-card-bullet-item">
                      <Check size={16} strokeWidth={2.8} className="lrd-card-check-icon" />
                      <span className="lrd-card-bullet-text">{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Botón CTA Elegir nivel en rojo oficial hacia WhatsApp */}
                <button
                  type="button"
                  className="lrd-card-cta-btn"
                  onClick={() => openLeadModal(`Nivel ${lvl.code} - ${lvl.title}`)}
                >
                  <span>Elegir nivel</span>
                  <ChevronRight size={15} strokeWidth={2.6} />
                </button>
              </div>
            ))}
          </div>

          {/* Franja horizontal compacta: Todos los niveles incluyen */}
          <div className="lrd-levels-strip-compact">
            <div className="lrd-strip-title">Todos los niveles incluyen:</div>
            <div className="lrd-strip-items">
              <div className="lrd-strip-item">
                <BookOpen size={20} className="lrd-strip-icon-red" strokeWidth={2.2} />
                <span>4 unidades de aprendizaje</span>
              </div>
              <div className="lrd-strip-divider" />
              <div className="lrd-strip-item">
                <FileText size={20} className="lrd-strip-icon-gold" strokeWidth={2.2} />
                <span>Libro de actividades incluido</span>
              </div>
              <div className="lrd-strip-divider" />
              <div className="lrd-strip-item">
                <GraduationCap size={20} className="lrd-strip-icon-red" strokeWidth={2.2} />
                <span>Evaluación final</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN PRECIOS, HORARIOS Y MODALIDADES REALES - ESTILO ROYAL INTERACTIVO */}
      <section className="lrd-pricing-royal-section" id="precios">
        <div className="lrd-container lrd-pricing-container-rel">
          {/* Header de Sección de Lujo */}
          <div className="lrd-pricing-header-wrap">
            <h2 className="lrd-pricing-title">
              ELIGE TU PLAN REAL <span className="lrd-text-gold-highlight">A TU RITMO</span>
            </h2>

            <div className="lrd-pricing-underline-wrap">
              <svg className="lrd-pricing-red-underline-exact" width="280" height="14" viewBox="0 0 280 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 6 8 C 70 3, 170 3, 274 7 C 200 10, 100 11, 20 12" stroke="#D92534" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <p className="lrd-pricing-subtitle">
              Clases online en vivo con diferentes profesores franceses para acostumbrarte a escuchar distintos acentos del francés.
            </p>
          </div>

          {/* Selector de Modalidad: Grupales vs Particulares */}
          <div className="lrd-pricing-tabs-container">
            <button
              className={`lrd-pricing-tab-btn ${pricingTab === 'grupales' ? 'active' : ''}`}
              onClick={() => setPricingTab('grupales')}
            >
              <Users size={16} /> Clases Grupales (Máx. 8 Alumnos)
            </button>
            <button
              className={`lrd-pricing-tab-btn ${pricingTab === 'particulares' ? 'active' : ''}`}
              onClick={() => setPricingTab('particulares')}
            >
              <Sparkles size={16} /> Clases Particulares & Part Duo
            </button>
          </div>

          {/* Distintivo General: Inscripción 100% Gratuita */}
          <div className="lrd-pricing-free-enrollment-banner">
            <div className="lrd-free-enrollment-badge">
              <BadgeCheck size={18} color="#D59B28" strokeWidth={2.4} />
              <span className="lrd-free-enrollment-main">INSCRIPCIÓN 100% GRATUITA</span>
            </div>
          </div>

          {/* TAB 1: MODALIDADES GRUPALES CON TARJETA CENTRAL DESTACADA EN RELIEVE 3D */}
          {pricingTab === 'grupales' && (
            <div className="lrd-pricing-cards-grid lrd-grid-royal-3d">
              {/* Card 1 (Izquierda): Modalidad Sabatino */}
              <div
                className={`lrd-pricing-card lrd-card-sabatino ${selectedGroupPlan === 'sabatino' ? 'lrd-pcard-active' : ''}`}
                onClick={() => setSelectedGroupPlan('sabatino')}
              >
                <div className="lrd-pcard-top-tag lrd-tag-navy">
                  <Clock size={12} style={{ marginRight: '5px' }} /> FIN DE SEMANA
                </div>

                <div className="lrd-pcard-header-clean">
                  <div className="lrd-pcard-icon-pill lrd-icon-navy">
                    <Calendar size={24} color="#FFFFFF" strokeWidth={2.2} />
                  </div>
                  <div className="lrd-pcard-title-col">
                    <span className="lrd-pcard-cat-label">CURSO SABATINO</span>
                    <h3 className="lrd-pcard-name-clean">Modalidad Sabatino</h3>
                  </div>
                </div>

                {/* Precio */}
                <div className="lrd-pcard-price-row">
                  <span className="lrd-pcard-price-currency">$</span>
                  <span className="lrd-pcard-price-main">1,650</span>
                  <span className="lrd-pcard-price-suffix">MXN / mes</span>
                </div>

                {/* Máximo 3 Beneficios Sabatino */}
                <ul className="lrd-pcard-benefits-clean">
                  <li>
                    <Check size={15} color="#001844" strokeWidth={3} />
                    <span>1 sesión semanal de 2 h 50 min</span>
                  </li>
                  <li>
                    <Check size={15} color="#001844" strokeWidth={3} />
                    <span>Máximo 8 alumnos</span>
                  </li>
                  <li>
                    <Check size={15} color="#001844" strokeWidth={3} />
                    <span>Profesor francés + material incluido</span>
                  </li>
                </ul>

                <button
                  className={`lrd-btn-pcard-clean lrd-btn-navy-subtle ${selectedGroupPlan === 'sabatino' ? 'lrd-btn-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGroupPlan('sabatino');
                    openLeadModal('Modalidad Sabatino');
                  }}
                >
                  {selectedGroupPlan === 'sabatino' ? '✓ SABATINO SELECCIONADO' : 'ELEGIR PLAN SABATINO'}
                </button>
              </div>

              {/* Card 2 (CENTRAL): Modalidad Regular */}
              <div
                className={`lrd-pricing-card lrd-card-regular ${selectedGroupPlan === 'regular' ? 'lrd-pcard-active' : ''}`}
                onClick={() => setSelectedGroupPlan('regular')}
              >
                {/* Corona y Listón Dorado VIP */}
                <div className="lrd-pcard-top-tag lrd-tag-gold">
                  <Crown size={13} fill="#FFFFFF" color="#FFFFFF" style={{ marginRight: '5px' }} /> RECOMENDADO • MÁS POPULAR
                </div>

                <div className="lrd-pcard-header-clean">
                  <div className="lrd-pcard-icon-pill lrd-icon-gold">
                    <Crown size={26} color="#D59B28" strokeWidth={2.4} />
                  </div>
                  <div className="lrd-pcard-title-col">
                    <span className="lrd-pcard-cat-label lrd-text-gold">3 CLASES POR SEMANA</span>
                    <h3 className="lrd-pcard-name-clean lrd-regular-card-title">Modalidad Regular</h3>
                  </div>
                </div>

                {/* Precio */}
                <div className="lrd-pcard-price-row">
                  <span className="lrd-pcard-price-currency">$</span>
                  <span className="lrd-pcard-price-main">1,490</span>
                  <span className="lrd-pcard-price-suffix">MXN / mes</span>
                </div>

                {/* Máximo 3 Beneficios Regular */}
                <ul className="lrd-pcard-benefits-clean lrd-hero-benefits">
                  <li>
                    <Check size={16} color="#D92534" strokeWidth={3} />
                    <span>3 clases por semana</span>
                  </li>
                  <li>
                    <Check size={16} color="#D92534" strokeWidth={3} />
                    <span>Clases de 50 minutos</span>
                  </li>
                  <li>
                    <Check size={16} color="#D92534" strokeWidth={3} />
                    <span>Máximo 8 alumnos</span>
                  </li>
                  <li>
                    <Check size={16} color="#D92534" strokeWidth={3} />
                    <span>Diferentes profesores franceses + material incluido</span>
                  </li>
                </ul>

                <button
                  className={`lrd-btn-pcard-clean lrd-btn-gold-subtle ${selectedGroupPlan === 'regular' ? 'lrd-btn-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGroupPlan('regular');
                    openLeadModal('Modalidad Regular');
                  }}
                >
                  <Crown size={16} fill="#FFFFFF" color="#FFFFFF" style={{ marginRight: '6px' }} />
                  {selectedGroupPlan === 'regular' ? '✓ REGULAR SELECCIONADO' : 'ELEGIR PLAN REGULAR'}
                </button>
              </div>

              {/* Card 3 (Derecha): Modalidad Intensivo */}
              <div
                className={`lrd-pricing-card lrd-card-intensivo ${selectedGroupPlan === 'intensivo' ? 'lrd-pcard-active' : ''}`}
                onClick={() => setSelectedGroupPlan('intensivo')}
              >
                <div className="lrd-pcard-top-tag lrd-tag-red">
                  <Zap size={12} fill="#FFFFFF" color="#FFFFFF" style={{ marginRight: '5px' }} /> MÁXIMA VELOCIDAD
                </div>

                <div className="lrd-pcard-header-clean">
                  <div className="lrd-pcard-icon-pill lrd-icon-red">
                    <Zap size={24} fill="#FFFFFF" color="#FFFFFF" />
                  </div>
                  <div className="lrd-pcard-title-col">
                    <span className="lrd-pcard-cat-label lrd-text-red">5 CLASES POR SEMANA</span>
                    <h3 className="lrd-pcard-name-clean">Modalidad Intensivo</h3>
                  </div>
                </div>

                {/* Precio */}
                <div className="lrd-pcard-price-row">
                  <span className="lrd-pcard-price-currency">$</span>
                  <span className="lrd-pcard-price-main">2,550</span>
                  <span className="lrd-pcard-price-suffix">MXN / mes</span>
                </div>

                {/* Máximo 3 Beneficios Intensivo */}
                <ul className="lrd-pcard-benefits-clean">
                  <li>
                    <Check size={15} color="#D92534" strokeWidth={3} />
                    <span>5 clases por semana</span>
                  </li>
                  <li>
                    <Check size={15} color="#D92534" strokeWidth={3} />
                    <span>Clases de 50 minutos</span>
                  </li>
                  <li>
                    <Check size={15} color="#D92534" strokeWidth={3} />
                    <span>Máximo 8 alumnos</span>
                  </li>
                  <li>
                    <Check size={15} color="#D92534" strokeWidth={3} />
                    <span>Diferentes profesores franceses + material incluido</span>
                  </li>
                </ul>

                <button
                  className={`lrd-btn-pcard-clean lrd-btn-red-subtle ${selectedGroupPlan === 'intensivo' ? 'lrd-btn-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGroupPlan('intensivo');
                    openLeadModal('Modalidad Intensivo');
                  }}
                >
                  <Zap size={15} fill="#FFFFFF" color="#FFFFFF" style={{ marginRight: '6px' }} />
                  {selectedGroupPlan === 'intensivo' ? '✓ INTENSIVO SELECCIONADO' : 'ELEGIR PLAN INTENSIVO'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MODALIDADES PARTICULARES Y PART DUO */}
          {pricingTab === 'particulares' && (
            <>
              <div className="lrd-private-pricing-container">
              {/* Tarjeta 1: Clases Particulares Individuales */}
              <div
                className={`lrd-private-card ${selectedPrivateType === 'individual' ? 'lrd-private-active' : ''}`}
                onClick={() => setSelectedPrivateType('individual')}
              >
                <div className="lrd-private-card-header">
                  <div className="lrd-private-tag">1 A 1 PERSONALIZADO</div>
                  <h3 className="lrd-private-title">Clases Particulares Individuales</h3>
                  <p className="lrd-private-desc">
                    1 alumno con profesores franceses y horarios 100% a tu medida.
                  </p>
                </div>

                <div className="lrd-private-rates-grid">
                  <div
                    className={`lrd-rate-box ${selectedPrivateRate === 1 ? 'lrd-rate-selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedPrivateRate(1); setSelectedPrivateType('individual'); }}
                  >
                    {selectedPrivateRate === 1 && <span className="lrd-rate-badge-mini">Seleccionado</span>}
                    <span className="lrd-rate-freq">1 clase / sem</span>
                    <span className="lrd-rate-price">$1,500 <small>MXN/mes</small></span>
                  </div>
                  <div
                    className={`lrd-rate-box ${selectedPrivateRate === 2 ? 'lrd-rate-selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedPrivateRate(2); setSelectedPrivateType('individual'); }}
                  >
                    {selectedPrivateRate === 2 && <span className="lrd-rate-badge-mini">Seleccionado</span>}
                    <span className="lrd-rate-freq">2 clases / sem</span>
                    <span className="lrd-rate-price">$2,500 <small>MXN/mes</small></span>
                  </div>
                  <div
                    className={`lrd-rate-box ${selectedPrivateRate === 3 ? 'lrd-rate-selected lrd-rate-popular' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedPrivateRate(3); setSelectedPrivateType('individual'); }}
                  >
                    <span className="lrd-rate-badge-mini">{selectedPrivateRate === 3 ? '✓ Seleccionado' : 'Recomendado'}</span>
                    <span className="lrd-rate-freq">3 clases / sem</span>
                    <span className="lrd-rate-price">$3,750 <small>MXN/mes</small></span>
                  </div>
                  <div
                    className={`lrd-rate-box ${selectedPrivateRate === 5 ? 'lrd-rate-selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedPrivateRate(5); setSelectedPrivateType('individual'); }}
                  >
                    {selectedPrivateRate === 5 && <span className="lrd-rate-badge-mini">Seleccionado</span>}
                    <span className="lrd-rate-freq">5 clases / sem</span>
                    <span className="lrd-rate-price">$6,500 <small>MXN/mes</small></span>
                  </div>
                </div>

                <ul className="lrd-private-features-list">
                  <li><Check size={15} color="#D92534" strokeWidth={2.5} /> <span>Clases 1 a 1 con diferentes profesores franceses</span></li>
                  <li><Check size={15} color="#D92534" strokeWidth={2.5} /> <span>Horarios y reprogramación a tu medida</span></li>
                  <li><Check size={15} color="#D92534" strokeWidth={2.5} /> <span>Material pedagógico y certificado del nivel incluidos</span></li>
                </ul>

                <button
                  className={`lrd-btn-pcard-clean lrd-btn-red-subtle ${selectedPrivateType === 'individual' ? 'lrd-btn-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPrivateType('individual');
                    openLeadModal(`Clases Particulares (${selectedPrivateRate} clase${selectedPrivateRate > 1 ? 's' : ''}/sem)`);
                  }}
                >
                  {selectedPrivateType === 'individual' ? `✓ COTIZAR PLAN ${selectedPrivateRate} CLASE${selectedPrivateRate > 1 ? 'S' : ''}/SEM` : `COTIZAR PLAN ${selectedPrivateRate} CLASE${selectedPrivateRate > 1 ? 'S' : ''}/SEM`}
                </button>
              </div>

              {/* Tarjeta 2: Modalidad Part Duo */}
              <div
                className={`lrd-duo-card ${selectedPrivateType === 'duo' ? 'lrd-duo-active' : ''}`}
                onClick={() => setSelectedPrivateType('duo')}
              >
                <div className="lrd-duo-ribbon-tag">DUPLA EXCLUSIVA</div>
                <div className="lrd-duo-header">
                  <Users size={24} color="#D59B28" />
                  <h3 className="lrd-duo-title">Modalidad Part Duo</h3>
                  <p className="lrd-duo-desc">
                    2 alumnos por clase con profesores franceses. Ideal para parejas o amigos.
                  </p>
                </div>

                <div className="lrd-private-rates-grid lrd-duo-rates-grid">
                  <div
                    className={`lrd-rate-box ${selectedDuoRate === 1 ? 'lrd-rate-selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedDuoRate(1); setSelectedPrivateType('duo'); }}
                  >
                    {selectedDuoRate === 1 && <span className="lrd-rate-badge-mini">Seleccionado</span>}
                    <span className="lrd-rate-freq">1 clase / sem</span>
                    <span className="lrd-rate-price">$2,000 <small>MXN/mes</small></span>
                  </div>
                  <div
                    className={`lrd-rate-box ${selectedDuoRate === 2 ? 'lrd-rate-selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedDuoRate(2); setSelectedPrivateType('duo'); }}
                  >
                    {selectedDuoRate === 2 && <span className="lrd-rate-badge-mini">Seleccionado</span>}
                    <span className="lrd-rate-freq">2 clases / sem</span>
                    <span className="lrd-rate-price">$3,500 <small>MXN/mes</small></span>
                  </div>
                  <div
                    className={`lrd-rate-box ${selectedDuoRate === 3 ? 'lrd-rate-selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedDuoRate(3); setSelectedPrivateType('duo'); }}
                  >
                    {selectedDuoRate === 3 && <span className="lrd-rate-badge-mini">Seleccionado</span>}
                    <span className="lrd-rate-freq">3 clases / sem</span>
                    <span className="lrd-rate-price">$5,240 <small>MXN/mes</small></span>
                  </div>
                  <div
                    className={`lrd-rate-box ${selectedDuoRate === 5 ? 'lrd-rate-selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedDuoRate(5); setSelectedPrivateType('duo'); }}
                  >
                    {selectedDuoRate === 5 && <span className="lrd-rate-badge-mini">Seleccionado</span>}
                    <span className="lrd-rate-freq">5 clases / sem</span>
                    <span className="lrd-rate-price">$9,000 <small>MXN/mes</small></span>
                  </div>
                </div>

                <ul className="lrd-private-features-list">
                  <li><Check size={15} color="#001844" strokeWidth={2.5} /> <span>Mismo horario de clase para ambos</span></li>
                  <li><Check size={15} color="#001844" strokeWidth={2.5} /> <span>Práctica conversacional activa en pareja</span></li>
                  <li><Check size={15} color="#001844" strokeWidth={2.5} /> <span>Diferentes profesores franceses + material y certificado del nivel</span></li>
                </ul>

                <button
                  className={`lrd-btn-pcard-clean lrd-btn-gold-subtle ${selectedPrivateType === 'duo' ? 'lrd-btn-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPrivateType('duo');
                    openLeadModal(`Modalidad Part Duo (${selectedDuoRate} clase${selectedDuoRate > 1 ? 's' : ''}/sem)`);
                  }}
                >
                  {selectedPrivateType === 'duo'
                    ? `✓ COTIZAR PLAN PART DUO · ${selectedDuoRate} CLASE${selectedDuoRate > 1 ? 'S' : ''}/SEM`
                    : `COTIZAR PLAN PART DUO · ${selectedDuoRate} CLASE${selectedDuoRate > 1 ? 'S' : ''}/SEM`}
                </button>
              </div>
            </div>

            {/* Bloque Compartido: Preparación para Exámenes Oficiales */}
            <div className="lrd-private-shared-exam-bar">
              <div className="lrd-pexam-bar-left">
                <div className="lrd-pexam-icon-circle">
                  <GraduationCap size={24} color="#D92534" strokeWidth={2.2} />
                </div>
                <div className="lrd-pexam-bar-text-group">
                  <div className="lrd-pexam-bar-header">
                    <span className="lrd-pexam-bar-tag">DISPONIBLE EN CLASES PART</span>
                    <h4 className="lrd-pexam-bar-title">PREPARACIÓN PARA EXÁMENES OFICIALES</h4>
                  </div>
                  <p className="lrd-pexam-bar-desc">
                    Ejercicios prácticos y acompañamiento enfocados en DELF, DALF, TCF y otras certificaciones oficiales.
                  </p>
                </div>
              </div>

              <div className="lrd-pexam-bar-right">
                <div className="lrd-private-exam-pills">
                  <span>DELF</span>
                  <span className="lrd-private-exam-sep">·</span>
                  <span>DALF</span>
                  <span className="lrd-private-exam-sep">·</span>
                  <span>TCF</span>
                </div>
              </div>
            </div>
          </>
          )}

          {/* BANNER DE PROMOCIONES MULTI-MES (#promos) */}
          <div className="lrd-promos-banner-container" id="promos">
            <div className="lrd-promos-content">
              <div className="lrd-promos-text-col">
                <span className="lrd-promos-pill">AHORRO REAL DE LA REALEZA</span>
                <h3 className="lrd-promos-title">¿Prefieres asegurar tu nivel o pagar por adelantado?</h3>
                <p className="lrd-promos-sub">
                  Aprovecha nuestros descuentos especiales en pagos multi-mes válidos para cualquier modalidad y horario.
                </p>
              </div>

              <div className="lrd-promos-badges-row">
                <div
                  className={`lrd-promo-badge-item ${selectedPromoMonths === 3 ? 'lrd-promo-highlight' : ''}`}
                  onClick={() => setSelectedPromoMonths(3)}
                >
                  {selectedPromoMonths === 3 && (
                    <span className="lrd-promo-top-label">✓ Seleccionado</span>
                  )}
                  <span className="lrd-promo-duration">3 MESES</span>
                  <span className="lrd-promo-discount">15% DTO.</span>
                  <span className="lrd-promo-note">En cualquier horario</span>
                </div>

                <div
                  className={`lrd-promo-badge-item ${selectedPromoMonths === 6 ? 'lrd-promo-highlight' : ''}`}
                  onClick={() => setSelectedPromoMonths(6)}
                >
                  {selectedPromoMonths === 6 && (
                    <span className="lrd-promo-top-label">★ Más Elegido</span>
                  )}
                  <span className="lrd-promo-duration">6 MESES</span>
                  <span className="lrd-promo-discount">20% DTO.</span>
                  <span className="lrd-promo-note">En cualquier horario</span>
                </div>

                <div
                  className={`lrd-promo-badge-item ${selectedPromoMonths === 9 ? 'lrd-promo-highlight' : ''}`}
                  onClick={() => setSelectedPromoMonths(9)}
                >
                  {selectedPromoMonths === 9 && (
                    <span className="lrd-promo-top-label">✓ Máximo Ahorro</span>
                  )}
                  <span className="lrd-promo-duration">9 MESES</span>
                  <span className="lrd-promo-discount">25% DTO.</span>
                  <span className="lrd-promo-note">En cualquier horario</span>
                </div>
              </div>

              <div className="lrd-promos-action-col">
                <button
                  className="lrd-btn-red-main lrd-btn-promo-cta"
                  onClick={() => openLeadModal(`Promoción ${selectedPromoMonths} Meses (${selectedPromoMonths === 3 ? '15%' : selectedPromoMonths === 6 ? '20%' : '25%'} DTO)`)}
                >
                  APLICAR MI {selectedPromoMonths === 3 ? '15%' : selectedPromoMonths === 6 ? '20%' : '25%'} DE DESCUENTO
                </button>
              </div>
            </div>
          </div>

          {/* BARRA DE GARANTÍA Y CONFIANZA DE LA ESCUELA */}
          <div className="lrd-pricing-guarantee-bar">
            <div className="lrd-guarantee-top-row">
              <div className="lrd-guarantee-col">
                <ShieldCheck size={20} color="#D59B28" />
                <span>Inscripción 100% gratuita</span>
              </div>
              <div className="lrd-guarantee-col">
                <Check size={20} color="#D59B28" />
                <span>Libro de actividades y material digital 100% gratis</span>
              </div>
              <div className="lrd-guarantee-col">
                <Globe size={20} color="#D59B28" />
                <span>Clases en vivo por Zoom con enlace permanente</span>
              </div>
            </div>

            <div className="lrd-guarantee-bottom-row">
              <div className="lrd-guarantee-col">
                <Crown size={20} color="#D59B28" />
                <span>Certificado del nivel</span>
              </div>
              <div className="lrd-guarantee-col">
                <Users size={20} color="#D59B28" />
                <span>Clases con diferentes profesores franceses para acostumbrarte a distintos acentos del francés</span>
              </div>
            </div>
          </div>

          {/* BANNER CLASE DE PRUEBA GRATIS DE REFUERZO */}
          <div className="lrd-trial-callout-box">
            <div className="lrd-trial-text">
              <h4 className="lrd-trial-title">¿AÚN TIENES DUDAS SOBRE TU NIVEL O METODOLOGÍA?</h4>
              <p className="lrd-trial-desc">
                Prueba una clase gratis y descubre qué modalidad es ideal para ti.
              </p>
            </div>
            <button
              className="lrd-btn-trial-action"
              onClick={() => openLeadModal('Clase de Prueba Gratis')}
            >
              AGENDAR MI CLASE GRATIS
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: BENEFICIOS DE LA REALEZA (¿POR QUÉ ELEGIR LES ROIS DU FRANÇAIS?) */}
      <section className="lrd-section-why-new" id="nosotros">
        {/* Gráfico de onda roja inferior derecha */}
        <img loading="lazy" decoding="async" src="/imagenes-lp/red_wave_transparent.webp"
          alt="Decoración Realeza"
          className="lrd-why-bottom-red-wave"
        />

        <div className="lrd-container lrd-why-container-rel">
          {/* Composición Gráfica del Título Principal */}
          <div className="lrd-why-header-composition">
            <div className="lrd-why-header-text-block">
              <h2 className="lrd-why-heading-title">
                <span className="lrd-why-title-left-group">
                  BENEFICIOS DE LA
                </span>{' '}
                <span className="lrd-why-title-red-group">
                  REALEZA
                </span>
              </h2>
              <p className="lrd-why-heading-sub">
                Aprende francés de forma práctica y cercana.
              </p>
            </div>
          </div>

          {/* Bloque Principal: Columna izquierda (Escritorio / Laptop / Libreta) + Columna derecha (Grid de 4 Tarjetas) */}
          <div className="lrd-why-main-layout">
            {/* Columna Izquierda: Foto de Estudio / Laptop con Logo, Taza, Libreta "Parle. Comprends. Conquiers." */}
            <div className="lrd-why-desk-col">
              {/* Halftone azul detrás de la laptop */}
              <img loading="lazy" decoding="async" src="/imagenes-lp/navy_halftone_dots.webp"
                alt="Puntos decorativos laptop"
                className="lrd-why-halftone-laptop"
              />
              <div className="lrd-why-desk-inner">
                <img loading="lazy" decoding="async" src="/imagenes-lp/beneficios_desk_laptop.webp"
                  alt="Estudio Les Rois du Français - Parle, Comprends, Conquiers"
                  className="lrd-why-desk-photo"
                />
              </div>
            </div>

            {/* Columna Derecha: 4 Tarjetas en Grid 2x2 */}
            <div className="lrd-why-cards-col">
              <div className="lrd-why-cards-grid-4">
                {/* Card 1: Método Propio MRAF */}
                <div className="lrd-bcard-v2 lrd-bcard-accent-gold">
                  <div className="lrd-bcard-icon-badge lrd-bbadge-gold">
                    <Crown size={26} color="#FFFFFF" strokeWidth={2.4} />
                  </div>
                  <h4 className="lrd-bcard-title">MÉTODO PROPIO MRAF®</h4>
                  <p className="lrd-bcard-desc">
                    Aprende con una metodología práctica y estructurada.
                  </p>
                </div>

                {/* Card 2: Enfoque Práctico */}
                <div className="lrd-bcard-v2 lrd-bcard-accent-red">
                  <div className="lrd-bcard-icon-badge lrd-bbadge-red">
                    <MessageSquare size={26} color="#FFFFFF" strokeWidth={2.4} />
                  </div>
                  <h4 className="lrd-bcard-title">ENFOQUE PRÁCTICO</h4>
                  <p className="lrd-bcard-desc">
                    Habla francés desde el primer día.
                  </p>
                </div>

                {/* Card 3: Resultados Acelerados */}
                <div className="lrd-bcard-v2 lrd-bcard-accent-navy">
                  <div className="lrd-bcard-icon-badge lrd-bbadge-navy">
                    <TrendingUp size={26} color="#FFFFFF" strokeWidth={2.4} />
                  </div>
                  <h4 className="lrd-bcard-title">RESULTADOS ACELERADOS</h4>
                  <p className="lrd-bcard-desc">
                    Avanza con práctica constante y situaciones reales.
                  </p>
                </div>

                {/* Card 4: Comunidad Real */}
                <div className="lrd-bcard-v2 lrd-bcard-accent-community">
                  <div className="lrd-bcard-icon-badge lrd-bbadge-navy">
                    <Users size={26} color="#FFFFFF" strokeWidth={2.4} />
                  </div>
                  <h4 className="lrd-bcard-title">COMUNIDAD REAL</h4>
                  <p className="lrd-bcard-desc">
                    Practica con alumnos de distintos lugares.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: LO QUE DICEN NUESTROS ALUMNOS */}
      <section className="lrd-section-testimonials-new" id="testimonios">
        {/* Background decorative watermark */}
        <div className="lrd-testi-bg-accents" aria-hidden="true">
          <img loading="lazy" decoding="async" src="/imagenes-lp/petit_a_petit_stamp.webp"
            alt=""
            className="lrd-testi-stamp-decor"
          />
        </div>

        <div className="lrd-container">
          {/* Header Real & Chic */}
          <div className="lrd-testimonials-header-v2">
            <h2 className="lrd-testimonials-title-v2">
              LO QUE DICEN NUESTROS ALUMNOS
            </h2>
            <img loading="lazy" decoding="async" src="/imagenes-lp/sketch_red_underline.svg"
              alt="Subrayado rojo"
              className="lrd-testi-red-underline"
            />
            {/* Social Proof Trust Bar */}
            <div className="lrd-testi-trust-bar">
              <div className="lrd-testi-trust-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#D59B28" color="#D59B28" />
                ))}
              </div>
              <span className="lrd-testi-trust-score">4.9 / 5</span>
              <span className="lrd-testi-trust-dot">•</span>
              <span className="lrd-testi-trust-text">
                Valoración promedio de <strong>+1,000 alumnos</strong> en más de 15 países
              </span>
            </div>
          </div>

          {/* Cards Grid: 3 Real Students */}
          <div className="lrd-testimonials-cards-grid-v2">
            {/* Card 1: Mariana G. (Gold Accent) */}
            <div className="lrd-testi-card-v2 lrd-testi-card-gold">
              <div className="lrd-testi-card-top-row">
                <span className="lrd-testi-tag lrd-testi-tag-gold">
                  #FluidezEn3Meses
                </span>
                <span className="lrd-testi-quote-symbol" aria-hidden="true">“</span>
              </div>

              <div className="lrd-testi-rating-row">
                <div className="lrd-testi-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#D59B28" color="#D59B28" />
                  ))}
                </div>
                <span className="lrd-testi-rating-label">5.0 Excelente</span>
              </div>

              <p className="lrd-testi-quote-text">
                "Gracias al método MRAF® en solo 3 meses ya podía mantener conversaciones reales en francés con fluidez y sin pena. ¡Totalmente recomendado!"
              </p>

              <div className="lrd-testi-card-divider" />

              <div className="lrd-testi-author-row">
                <div className="lrd-testi-avatar-frame lrd-avatar-ring-gold">
                  <img loading="lazy" decoding="async" src="/imagenes-lp/avatar_mariana_clean.webp"
                    alt="Mariana G."
                    className="lrd-testi-avatar-img"
                  />
                </div>
                <div className="lrd-testi-author-info">
                  <div className="lrd-testi-author-name-wrap">
                    <h4 className="lrd-testi-author-name">Mariana G.</h4>
                    <img loading="lazy" decoding="async" src="/imagenes-lp/flag_mx.svg"
                      alt="México"
                      className="lrd-testi-flag-standalone"
                      title="México"
                    />
                  </div>
                  <span className="lrd-testi-level-sub">Nivel Intermédiaire 2 • México</span>
                </div>
              </div>
            </div>

            {/* Card 2: Carlos T. (Red Accent) */}
            <div className="lrd-testi-card-v2 lrd-testi-card-red">
              <div className="lrd-testi-card-top-row">
                <span className="lrd-testi-tag lrd-testi-tag-red">
                  #HablaSinPena
                </span>
                <span className="lrd-testi-quote-symbol" aria-hidden="true">“</span>
              </div>

              <div className="lrd-testi-rating-row">
                <div className="lrd-testi-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#D59B28" color="#D59B28" />
                  ))}
                </div>
                <span className="lrd-testi-rating-label">5.0 Excelente</span>
              </div>

              <p className="lrd-testi-quote-text">
                "Profesores increíbles y clases súper dinámicas. Aprender francés se volvió mi momento favorito del día, cero reglas aburridas y 100% práctica."
              </p>

              <div className="lrd-testi-card-divider" />

              <div className="lrd-testi-author-row">
                <div className="lrd-testi-avatar-frame lrd-avatar-ring-red">
                  <img loading="lazy" decoding="async" src="/imagenes-lp/avatar_carlos_clean.webp"
                    alt="Carlos T."
                    className="lrd-testi-avatar-img"
                  />
                </div>
                <div className="lrd-testi-author-info">
                  <div className="lrd-testi-author-name-wrap">
                    <h4 className="lrd-testi-author-name">Carlos T.</h4>
                    <img loading="lazy" decoding="async" src="/imagenes-lp/flag_es.svg"
                      alt="España"
                      className="lrd-testi-flag-standalone"
                      title="España"
                    />
                  </div>
                  <span className="lrd-testi-level-sub">Nivel Basique 2 • España</span>
                </div>
              </div>
            </div>

            {/* Card 3: Sofía R. (Navy Accent) */}
            <div className="lrd-testi-card-v2 lrd-testi-card-navy">
              <div className="lrd-testi-card-top-row">
                <span className="lrd-testi-tag lrd-testi-tag-navy">
                  #CeroAburrimiento
                </span>
                <span className="lrd-testi-quote-symbol" aria-hidden="true">“</span>
              </div>

              <div className="lrd-testi-rating-row">
                <div className="lrd-testi-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#D59B28" color="#D59B28" />
                  ))}
                </div>
                <span className="lrd-testi-rating-label">5.0 Excelente</span>
              </div>

              <p className="lrd-testi-quote-text">
                "La mejor academia en línea por mucho. Flexibilidad total de horarios, calidad humana de los profes y resultados reales desde la primera semana."
              </p>

              <div className="lrd-testi-card-divider" />

              <div className="lrd-testi-author-row">
                <div className="lrd-testi-avatar-frame lrd-avatar-ring-navy">
                  <img loading="lazy" decoding="async" src="/imagenes-lp/avatar_sofia_clean.webp"
                    alt="Sofía R."
                    className="lrd-testi-avatar-img"
                  />
                </div>
                <div className="lrd-testi-author-info">
                  <div className="lrd-testi-author-name-wrap">
                    <h4 className="lrd-testi-author-name">Sofía R.</h4>
                    <img loading="lazy" decoding="async" src="/imagenes-lp/flag_ar.svg"
                      alt="Argentina"
                      className="lrd-testi-flag-standalone"
                      title="Argentina"
                    />
                  </div>
                  <span className="lrd-testi-level-sub">Nivel Avancé 1 • Argentina</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator Slider */}
          <div className="lrd-slider-dots-center">
            <span className="lrd-dot-item active" aria-label="Slide 1"></span>
            <span className="lrd-dot-item" aria-label="Slide 2"></span>
            <span className="lrd-dot-item" aria-label="Slide 3"></span>
            <span className="lrd-dot-item" aria-label="Slide 4"></span>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5: FOOTER AZUL MARINO PROFUNDO */}
      <footer className="lrd-footer-dark-new" id="contacto">
        <div className="lrd-container lrd-footer-flex-container">
          {/* Columna 1: Marca */}
          <div className="lrd-footer-col-brand">
            <img loading="lazy" decoding="async" src="/imagenes-lp/logo_official.webp" alt="Les Rois du Français" className="lrd-footer-brand-logo" />
            <p className="lrd-footer-brand-desc">
              Aprende francés de forma práctica, cercana y en vivo.
            </p>
          </div>

          {/* Columna 2: Contáctanos */}
          <div className="lrd-footer-col-contact">
            <h4 className="lrd-footer-heading">CONTÁCTANOS</h4>
            <ul className="lrd-contact-details">
              <li><Phone size={15} /> 222 343 7074</li>
              <li><Mail size={15} /> info@lesroisdufrancais.com</li>
              <li><MapPin size={15} /> Clases 100% Online · Sede: Puebla, México</li>
            </ul>
            <div className="lrd-footer-socials-row">
              <a href="https://www.facebook.com/people/Les-Rois-du-Fran%C3%A7ais/61554418860885/" target="_blank" rel="noreferrer" className="lrd-social-btn" aria-label="Facebook"><FacebookIcon size={14} color="#FFFFFF" /></a>
              <a href="https://www.instagram.com/lesroisdufrancais?igsh=MTNxbWR1OHM1Z2h6dA==" target="_blank" rel="noreferrer" className="lrd-social-btn" aria-label="Instagram"><InstagramIcon size={14} color="#FFFFFF" /></a>
              <a href="https://www.youtube.com/@RoisduFrancais" target="_blank" rel="noreferrer" className="lrd-social-btn" aria-label="YouTube"><YoutubeIcon size={14} color="#FFFFFF" /></a>
            </div>
          </div>
        </div>

        <div className="lrd-footer-copyright-bar">
          <div className="lrd-container lrd-copyright-flex">
            <span>Políticas de privacidad</span>
            <span>Términos y condiciones</span>
            <span>Aviso de privacidad</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://api.whatsapp.com/send?phone=522223437074&text=Hola!%20Me%20interesa%20la%20Clase%20de%20Prueba%20Gratis"
        target="_blank"
        rel="noreferrer"
        className="lrd-whatsapp-float"
        aria-label="WhatsApp"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.488-8.413z"/>
        </svg>
      </a>



      {videoModalOpen && (
        <div
          className="lrd-video-modal-backdrop"
          onClick={() => setVideoModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Video Promocional Les Rois du Français"
        >
          <div
            className="lrd-video-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Top Control Bar */}
            <div className="lrd-video-modal-header">
              <div className="lrd-video-modal-badge">
                <Crown size={15} color="#D59B28" />
                <span className="lrd-vm-brand">LES ROIS DU FRANÇAIS</span>
                <span className="lrd-vm-divider">•</span>
                <span className="lrd-vm-label">Video Promocional Oficial</span>
              </div>

              <div className="lrd-video-modal-actions">
                {/* Abrir en YouTube (Nueva Pestaña) */}
                <a
                  href="https://www.youtube.com/watch?v=T_uYP1uYkhE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lrd-vm-btn-external"
                  title="Abrir en YouTube en una nueva pestaña"
                >
                  <ExternalLink size={13} />
                  <span>Ver en otra pestaña</span>
                </a>

                {/* Botón X para quitar */}
                <button
                  type="button"
                  className="lrd-vm-btn-close"
                  onClick={() => setVideoModalOpen(false)}
                  title="Cerrar video (Esc)"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Tricolor French Accent Line */}
            <div className="lrd-vm-tricolor">
              <div className="lrd-vm-tri-blue"></div>
              <div className="lrd-vm-tri-gold"></div>
              <div className="lrd-vm-tri-red"></div>
            </div>

            {/* Video Player Box (16:9 Aspect Ratio) */}
            <div className="lrd-video-player-wrap">
              <iframe
                src="https://www.youtube.com/embed/T_uYP1uYkhE?autoplay=1&rel=0&modestbranding=1&playsinline=1"
                title="Video Promocional - Les Rois du Français"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                className="lrd-video-iframe"
              ></iframe>
            </div>

            {/* Footer Bar with Conversion Hook */}
            <div className="lrd-video-modal-footer">
              <div className="lrd-vm-footer-info">
                <Sparkles size={16} color="#D59B28" className="lrd-vm-sparkle" />
                <span>¿Quieres vivir la experiencia en vivo con profesores nativos?</span>
              </div>
              <div className="lrd-vm-footer-buttons">
                <button
                  type="button"
                  className="lrd-vm-cta-btn"
                  onClick={() => {
                    setVideoModalOpen(false);
                    openLeadModal('Video Promocional Hero');
                  }}
                >
                  COMENZAR AHORA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
