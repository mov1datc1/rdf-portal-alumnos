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
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Send,
  Phone,
  Mail,
  MapPin,
  Video,
  MessageSquare,
  Heart,
  Clock,
  Calendar,
  Sparkles,
  Zap,
  ExternalLink
} from 'lucide-react';
import './LandingPage.css';
import { useAuthStore } from '../store/authStore';

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
  levelTag: string;
  titleLine1: string;
  titleLine2: string;
  iconDoodle: string;
  bullets: Array<{ icon: string; text: string }>;
}

export const LEVELS: Record<string, LevelData> = {
  B1: {
    code: 'B1',
    sub: 'Básico 1',
    levelTag: 'Básico 1 – Principiante • 4 Meses',
    titleLine1: 'Pierde el miedo.',
    titleLine2: '¡Empieza a hablar!',
    iconDoodle: '/imagenes-lp/beret_doodle_a1.webp',
    bullets: [
      { icon: 'chat', text: 'Presentación personal, saludos y situaciones cotidianas' },
      { icon: 'trophy', text: 'Desarrollo de las 4 competencias: habla, escucha, lectura y escritura' },
      { icon: 'book', text: '4 unidades (~1 mes c/u) con libro de actividades 100% gratis' },
      { icon: 'people', text: 'Examen escrito y oral al finalizar con certificación oficial' }
    ]
  },
  B2: {
    code: 'B2',
    sub: 'Básico 2',
    levelTag: 'Básico 2 – Elemental • 4 Meses',
    titleLine1: 'Desenvuélvete libremente.',
    titleLine2: '¡Conéctate con Francia!',
    iconDoodle: '/imagenes-lp/coffee_cup_doodle.webp',
    bullets: [
      { icon: 'chat', text: 'Conversación sobre rutina diaria, compras, viajes y entorno' },
      { icon: 'people', text: 'Clases en vivo por Zoom con grupos reducidos (máx. 8 alumnos)' },
      { icon: 'trophy', text: 'Rotación con profesores nativos de distintas regiones de Francia' },
      { icon: 'book', text: '4 unidades temáticas, evaluación oral y escrita con certificado' }
    ]
  },
  I1: {
    code: 'I1',
    sub: 'Intermedio 1',
    levelTag: 'Intermedio 1 – Autonomía • 4 Meses',
    titleLine1: 'Viaja y opina con soltura.',
    titleLine2: '¡Sé autónomo!',
    iconDoodle: '/imagenes-lp/chat_bubble_doodle_b1.webp',
    bullets: [
      { icon: 'chat', text: 'Autonomía para viajar y desenvolverte en países francófonos' },
      { icon: 'people', text: 'Expresión fluida de opiniones, ambiciones, proyectos y relatos' },
      { icon: 'book', text: '4 unidades de estudio práctico con material pedagógico gratuito' },
      { icon: 'trophy', text: 'Acreditación oficial mediante examen oral y escrito final' }
    ]
  },
  I2: {
    code: 'I2',
    sub: 'Intermedio 2',
    levelTag: 'Intermedio 2 – Fluidez • 4 Meses',
    titleLine1: 'Ya no traduzcas.',
    titleLine2: '¡Habla con confianza!',
    iconDoodle: '/imagenes-lp/gold_crown_icon.webp',
    bullets: [
      { icon: 'chat', text: 'Conversaciones espontáneas en contextos laborales y sociales' },
      { icon: 'trophy', text: 'Dominio de estructuras complejas con método MRAF® sin rodeos' },
      { icon: 'people', text: 'Inmersión cultural con múltiples acentos regionales franceses' },
      { icon: 'book', text: 'Certificado de nivel intermedio y pase directo a nivel Avanzado' }
    ]
  },
  A1: {
    code: 'A1',
    sub: 'Avanzado 1',
    levelTag: 'Avanzado 1 – Dominio • 4 Meses',
    titleLine1: 'Fluidez y precisión.',
    titleLine2: '¡Comunica con soltura!',
    iconDoodle: '/imagenes-lp/star_doodle_c1.webp',
    bullets: [
      { icon: 'chat', text: 'Debates sobre temas complejos, culturales, profesionales y abstractos' },
      { icon: 'people', text: 'Comprensión auditiva completa de nativos y modismos cotidianos' },
      { icon: 'book', text: '4 unidades avanzadas con dinámicas interactivas y roleplays' },
      { icon: 'trophy', text: 'Examen oral y escrito riguroso con certificado avalado' }
    ]
  },
  A2: {
    code: 'A2',
    sub: 'Avanzado 2',
    levelTag: 'Avanzado 2 – Bilingüismo • 4 Meses',
    titleLine1: 'Nivel nativo absoluto.',
    titleLine2: '¡Sé un verdadero rey!',
    iconDoodle: '/imagenes-lp/diamond_doodle_c2.webp',
    bullets: [
      { icon: 'chat', text: 'Bilingüismo y precisión comunicativa equivalente a hablante nativo' },
      { icon: 'trophy', text: 'Certificación de máxima maestría y graduación oficial de la escuela' },
      { icon: 'people', text: 'Argumentación espontánea, negociación y expresión de alto nivel' },
      { icon: 'book', text: 'Maestría total de la lengua, modismos, cultura y humor francés' }
    ]
  }
};

const TEACHERS = [
  {
    id: 'jean-luc',
    name: 'Jean-Luc',
    role: 'Le Roi du Fun & Conversación',
    city: 'París, Francia',
    exp: '8 años de experiencia',
    image: '/imagenes-lp/teacher_royal_jean_luc.webp',
    badge: 'Actitud Royal',
    hashtag: '#ReyDelFrancés',
    quote: '¡Bonjour! Mi misión es que hables francés con total confianza, soltura y cero miedo a equivocarte.',
    bullets: ['100% Hablante Nativo de París', 'Especialista en Metodología MRAF® y Fluidez', 'Clases interactivas en vivo con grupos máx. 8']
  },
  {
    id: 'sophie',
    name: 'Sophie',
    role: 'La Reine de la Culture & Estilo',
    city: 'Lyon, Francia',
    exp: '6 años de experiencia',
    image: '/imagenes-lp/teacher_royal_sophie.webp',
    badge: 'Cero Aburrimiento',
    hashtag: '#FrancésDivertido',
    quote: '¡C\'est la vie! Aprenderás el francés de verdad, el que se habla en las calles y cafés de Francia con elegancia.',
    bullets: ['Nativa de Lyon, Francia', 'Rotación de acentos y cultura francófona viva', 'Práctica comunicativa para viajes y vida diaria']
  },
  {
    id: 'pierre',
    name: 'Pierre',
    role: 'El Gran Canciller del Francés',
    city: 'Burdeos, Francia',
    exp: '10 años de experiencia',
    image: '/imagenes-lp/teacher_royal_pierre.webp',
    badge: 'Savoir-Faire Royal',
    hashtag: '#AprendeComoRey',
    quote: '¡Le français, c\'est cool! Olvídate de las clases tradicionales y aburridas. Tu coronación en francés empieza aquí.',
    bullets: ['Evaluador de Exámenes Escritos y Orales', 'Dominio del idioma sin estrés ni tecnicismos', 'Puntualidad y atención 100% personalizada']
  }
];

export function LandingPage() {
  const { user, isAdmin, isTeacher } = useAuthStore();
  const accountPortalLink = !user ? '/login' : isAdmin ? '/admin/groups' : isTeacher ? '/teacher' : '/dashboard';
  const [activeLevel, setActiveLevel] = useState<string>('B1');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadOrigin, setLeadOrigin] = useState('Clase de Prueba Gratis');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [pricingTab, setPricingTab] = useState<'grupales' | 'particulares'>('grupales');
  const [selectedGroupPlan, setSelectedGroupPlan] = useState<'regular' | 'sabatino' | 'intensivo' | null>(null);
  const [selectedPrivateType, setSelectedPrivateType] = useState<'individual' | 'duo'>('individual');
  const [selectedPrivateRate, setSelectedPrivateRate] = useState<number>(3);
  const [selectedPromoMonths, setSelectedPromoMonths] = useState<3 | 6 | 9>(6);
  const [regularDays, setRegularDays] = useState<'LMV' | 'MJV'>('LMV');
  const [regularShift, setRegularShift] = useState<'matutino' | 'vespertino'>('matutino');
  const [sabatinoShift, setSabatinoShift] = useState<'08:00' | '11:00' | '14:00'>('11:00');
  const [intensivoShift, setIntensivoShift] = useState<'matutino' | 'vespertino'>('matutino');

  // Teachers Section State
  const [activeTeacherIndex, setActiveTeacherIndex] = useState<number>(0);
  const [teacherScrollRatio, setTeacherScrollRatio] = useState<number>(0);
  const [activeMrafIndex, setActiveMrafIndex] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const sectionEl = document.getElementById('profesores');
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = windowHeight + rect.height;
      const currentDist = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentDist / totalDist));
      setTeacherScrollRatio(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (videoModalOpen) setVideoModalOpen(false);
        if (leadModalOpen) setLeadModalOpen(false);
      }
    };
    if (videoModalOpen || leadModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoModalOpen, leadModalOpen]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    schedule: 'Regular'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const openLeadModal = (origin: string) => {
    setLeadOrigin(origin);
    let detectedSchedule = 'Regular';
    if (origin.toLowerCase().includes('sabatino')) detectedSchedule = 'Sabatino';
    else if (origin.toLowerCase().includes('intensivo')) detectedSchedule = 'Intensivo';
    else if (origin.toLowerCase().includes('particular') || origin.toLowerCase().includes('duo')) detectedSchedule = 'Particular';
    setFormData(prev => ({ ...prev, schedule: detectedSchedule }));
    setFormSubmitted(false);
    setLeadModalOpen(true);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    const msg = encodeURIComponent(
      `¡Hola Les Rois du Français! 🇫🇷\n\nQuiero reservar mi Clase de Prueba Gratis.\n\n👤 *Nombre:* ${formData.name}\n📧 *Correo:* ${formData.email}\n📱 *WhatsApp:* ${formData.phone}\n📚 *Plan elegido:* ${leadOrigin || formData.schedule}\n\n¿Me pueden confirmar los detalles de mi acceso a Zoom por favor?`
    );
    window.open(`https://api.whatsapp.com/send?phone=522223437074&text=${msg}`, '_blank');
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
                  <a href="#cursos" className="lrd-nav-link-clean" onClick={() => setIsMobileMenuOpen(false)}>
                    CURSOS <ChevronDown size={12} color="#FFFFFF" />
                  </a>
                  <ul className="lrd-dropdown-menu">
                    <li><a href="#cursos" onClick={() => setIsMobileMenuOpen(false)}>6 Niveles Oficiales (Básico a Avanzado)</a></li>
                    <li><a href="#cursos" onClick={() => setIsMobileMenuOpen(false)}>Clases Grupales (Regular, Sabatino, Intensivo)</a></li>
                    <li><a href="#cursos" onClick={() => setIsMobileMenuOpen(false)}>Clases Particulares & Part Duo</a></li>
                  </ul>
                </li>
                <li className="lrd-nav-item">
                  <a href="#precios" className="lrd-nav-link-clean" onClick={() => setIsMobileMenuOpen(false)}>PRECIOS Y HORARIOS</a>
                </li>
                <li className="lrd-nav-item">
                  <a href="#metodo" className="lrd-nav-link-clean" onClick={() => setIsMobileMenuOpen(false)}>MÉTODO MRAF</a>
                </li>
                <li className="lrd-nav-item">
                  <a href="#promos" className="lrd-nav-link-clean" onClick={() => setIsMobileMenuOpen(false)}>PROMOCIONES</a>
                </li>
                <li className="lrd-nav-item">
                  <a href="#nosotros" className="lrd-nav-link-clean" onClick={() => setIsMobileMenuOpen(false)}>SOBRE NOSOTROS</a>
                </li>
                <li className="lrd-nav-item">
                  <a href="#contacto" className="lrd-nav-link-clean" onClick={() => setIsMobileMenuOpen(false)}>CONTACTO</a>
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
            {/* Small Red Crown above title */}
            <div className="lrd-crown-header-wrap">
              <img
                src="/imagenes-lp/hero_crown_red.webp"
                alt="Corona Les Rois du Français"
                className="lrd-crown-red-img"
                decoding="async"
              />
            </div>

            {/* Main Title: Tu reinado del / francés (Red) / en línea */}
            <h1 className="lrd-hero-title-serif">
              Tu reinado del<br />
              <span className="lrd-hero-red-word">francés</span> en línea
            </h1>

            {/* Method Text */}
            <div className="lrd-hero-method-text">
              <p className="lrd-method-line1">
                El método <span className="lrd-mraf-red">MRAF®</span>.
              </p>
              <p className="lrd-method-line2">
                El método que te hace hablar francés.
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
                <ShieldCheck size={16} color="#FFFFFF" /> Sin compromiso
              </span>
              <span className="lrd-bullet-item">
                <Globe size={16} color="#FFFFFF" /> 100% online
              </span>
              <span className="lrd-bullet-item">
                <User size={16} color="#FFFFFF" /> Profesores nativos
              </span>
            </div>
          </div>

          {/* Right Content Side: Prince Character (Large & Prominent) */}
          <div className="lrd-hero-right-prince">
            <img
              src="/imagenes-lp/rey.webp"
              alt="Príncipe Les Rois du Français"
              className="lrd-king-img-prominent"
              loading="lazy"
              decoding="async"
            />
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
        <img
          src="/imagenes-lp/castle_sketch_hd.webp?v=2"
          alt="Castillo Francés Grabado"
          className="lrd-bg-sketch-castle"
        />
        <img
          src="/imagenes-lp/queen_frame_hd.webp?v=2"
          alt="Retrato Reina Grabado"
          className="lrd-bg-sketch-queen"
        />
        <img
          src="/imagenes-lp/flora_fleur_sketch_hd.webp?v=999999"
          alt="Flor Floral Grabado"
          className="lrd-bg-sketch-flora"
        />

        <div className="lrd-container lrd-mraf-container-relative">
          {/* Header Ilustrado HD Oficial */}
          <div className="lrd-mraf-header-deluxe">
            <img
              src="/imagenes-lp/mraf_header_official_hd.webp?v=2"
              alt="Método para hablar Francés sin sufrir MRAF®"
              className="lrd-mraf-official-header-img"
            />
          </div>

          {/* Grid de 4 Tarjetas Interactivas M - R - A - F */}
          <div className="lrd-mraf-grid-deluxe">

            {/* Sticker Flotante Príncipe Izquierda */}
            <div className="lrd-floating-sticker-anchor lrd-sticker-prince-pos">
              <img
                src="/imagenes-lp/prince_real_cutout.webp?v=10"
                alt="Príncipe Les Rois du Français"
                className="lrd-sticker-img-cutout lrd-prince-tilted"
              />
            </div>

            {/* Sticker Manuscrito: Aquí se habla de verdad */}
            <div className="lrd-floating-handwriting-anchor lrd-sticker-habla-verdad-pos">
              <img
                src="/imagenes-lp/sticker_habla_de_verdad.webp?v=2"
                alt="Aquí se habla de verdad"
                className="lrd-handwriting-sticker-img"
              />
            </div>

            {/* Card 1: M - MÉTODO */}
            <div
              className={`lrd-mraf-card-deluxe lrd-card-m ${activeMrafIndex === 0 ? 'lrd-active-deluxe' : ''}`}
              onClick={() => setActiveMrafIndex(0)}
              onMouseEnter={() => setActiveMrafIndex(0)}
            >
              <div className="lrd-card-tape-blue-corner"></div>
              <div className="lrd-card-top-icon">
                <img src="/imagenes-lp/crown_m.webp?v=2" alt="Corona M" className="lrd-crown-icon-sm" />
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
              <div className="lrd-card-paperclip-gold"></div>
              <div className="lrd-card-top-icon">
                <img src="/imagenes-lp/crown_r.webp" alt="Corona R" className="lrd-crown-icon-sm" />
              </div>
              <div className="lrd-letter-wrap-r">
                <span className="lrd-giant-letter lrd-red-letter">R</span>
                <img
                  src="/imagenes-lp/lightning_doodle_pure.webp?v=88888"
                  alt="Rayo Rojo"
                  className="lrd-lightning-doodle-img"
                />
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
              <div className="lrd-ribbon-tag-gold">
                LA FAVORITA <Heart size={12} fill="#D92534" color="#D92534" style={{ display: 'inline', marginLeft: '3px', verticalAlign: 'middle' }} />
              </div>
              <div className="lrd-card-top-icon">
                <img src="/imagenes-lp/crown_a.webp?v=999999" alt="Corona A" className="lrd-crown-icon-sm" />
              </div>
              <div className="lrd-letter-wrap-a">
                <img
                  src="/imagenes-lp/heart_doodle.webp?v=20"
                  alt="Corazón Blanco"
                  className="lrd-heart-doodle-img"
                />
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
                <img src="/imagenes-lp/crown_f_nobg.webp?v=99999" alt="Corona F" className="lrd-crown-icon-sm" />
              </div>
              <div className="lrd-letter-wrap-f">
                <span className="lrd-giant-letter lrd-navy-letter">F</span>
                <img
                  src="/imagenes-lp/beret_doodle_navy.webp?v=77777"
                  alt="Gorrito Francés"
                  className="lrd-beret-doodle-img"
                />
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

            {/* Sticker Manuscrito: Cero francés aburrido */}
            <div className="lrd-floating-handwriting-anchor lrd-sticker-cero-aburrido-pos">
              <img
                src="/imagenes-lp/sticker_cero_aburrido.webp?v=2"
                alt="Cero francés aburrido"
                className="lrd-handwriting-sticker-img"
              />
            </div>

            {/* Sticker Flotante Chica Boina Derecha */}
            <div className="lrd-floating-sticker-anchor lrd-sticker-girl-pos">
              <img
                src="/imagenes-lp/girl_real_cutout.webp?v=10"
                alt="Chica Francesa Les Rois du Français"
                className="lrd-sticker-img-cutout"
              />
            </div>
          </div>

          {/* Subtítulo Inferior HD Oficial & Botón Rojo CTA al lado de la Flecha Azul */}
          <div className="lrd-mraf-bottom-cta-block">
            <img
              src="/imagenes-lp/mraf_bottom_cta_hd.webp?v=2"
              alt="¿Y lo mejor? No necesitas ser un genio para aprender francés. Solo necesitas empezar."
              className="lrd-mraf-official-bottom-cta-img"
            />
            <div className="lrd-cta-btn-arrow-row">
              <button
                className="lrd-btn-red-main lrd-btn-cta-royal-mraf"
                onClick={() => openLeadModal('Probar el Método MRAF')}
              >
                QUIERO PROBAR EL MÉTODO <Crown size={16} fill="#D59B28" color="#D59B28" style={{ display: 'inline', marginLeft: '6px', verticalAlign: 'middle' }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN INTERACTIVA: CONOCE A NUESTROS MAESTROS REALES */}
      <section className="lrd-teachers-section-interactive" id="profesores">
        <div className="lrd-container">
          {/* Encabezado Principal */}
          <div className="lrd-teachers-header-center">
            <h2 className="lrd-teachers-main-title">
              NUESTROS MAESTROS <span className="lrd-text-red-gradient">REALES</span>
              <img src="/imagenes-lp/crown_clean.webp" alt="Corona Marca" className="lrd-title-crown-brand" />
            </h2>
            <div className="lrd-teachers-badge-row">
              <span className="lrd-hashtag-pill">#ReyDelFrancés</span>
              <span className="lrd-hashtag-pill lrd-pill-red">Actitud Royal, Cero Aburrimiento</span>
            </div>
            <p className="lrd-teachers-subtitle">
              Profesores 100% nativos franceses de diversas regiones (París, Lyon, Burdeos). Disfruta de una auténtica rotación de acentos en grupos de máximo 8 alumnos.
            </p>
          </div>

          {/* Banner con los 3 Maestros Reales Juntos & Scroll Reveal Effect */}
          <div className="lrd-scroll-reveal-wrapper">
            <div
              className="lrd-scroll-reveal-card lrd-card-team-together"
              style={{
                height: `${Math.max(160, Math.min(420, 420 - Math.max(0, (teacherScrollRatio - 0.2) * 450)))}px`,
                transform: `scale(${1 - Math.max(0, (teacherScrollRatio - 0.25) * 0.15)})`,
                opacity: Math.max(0.65, 1 - Math.max(0, (teacherScrollRatio - 0.5) * 0.8)),
                borderRadius: '28px',
                overflow: 'hidden'
              }}
            >
              {/* Overlay de texto limpio */}
              <div className="lrd-reveal-overlay-clean">
                <h3 className="lrd-reveal-title-clean">"El aprendizaje de reyes no sigue reglas aburridas"</h3>
              </div>

              {/* Mosaico de los 3 profesores juntos sin nombres superpuestos */}
              <div className="lrd-team-collage-grid">
                <div className="lrd-team-member-col">
                  <img src="/imagenes-lp/teacher_royal_jean_luc.webp" alt="Prof. Jean-Luc" className="lrd-team-member-img" />
                </div>
                <div className="lrd-team-member-col">
                  <img src="/imagenes-lp/teacher_royal_sophie.webp" alt="Prof. Sophie" className="lrd-team-member-img" />
                </div>
                <div className="lrd-team-member-col">
                  <img src="/imagenes-lp/teacher_royal_pierre.webp" alt="Prof. Pierre" className="lrd-team-member-img" />
                </div>
              </div>
            </div>
          </div>

          {/* Selector de Profesores (Tabs / Avatares) */}
          <div className="lrd-teachers-carousel-container">
            <div className="lrd-teacher-tabs-bar">
              {TEACHERS.map((teacher, index) => (
                <button
                  key={teacher.id}
                  className={`lrd-teacher-tab-item ${activeTeacherIndex === index ? 'lrd-tab-active' : ''}`}
                  onClick={() => setActiveTeacherIndex(index)}
                >
                  <div className="lrd-tab-avatar-frame">
                    <img src={teacher.image} alt={teacher.name} className="lrd-tab-avatar-img" />
                  </div>
                  <div className="lrd-tab-text-wrap">
                    <span className="lrd-tab-teacher-name">{teacher.name}</span>
                    <span className="lrd-tab-teacher-city">{teacher.city}</span>
                  </div>
                  <span className="lrd-tab-status-badge">{teacher.badge}</span>
                </button>
              ))}
            </div>

            {/* Ficha Principal de Profesor Activo */}
            <div className="lrd-active-teacher-showcase">
              <div className="lrd-showcase-photo-col">
                <div className="lrd-showcase-image-wrap">
                  <img
                    src={TEACHERS[activeTeacherIndex].image}
                    alt={TEACHERS[activeTeacherIndex].name}
                    className="lrd-showcase-main-img"
                  />
                  <div className="lrd-floating-sticker lrd-sticker-tr">
                    {TEACHERS[activeTeacherIndex].badge}
                  </div>
                  <div className="lrd-floating-sticker lrd-sticker-bl">
                    {TEACHERS[activeTeacherIndex].hashtag}
                  </div>
                </div>

                {/* Flechas de Navegación del Carrusel */}
                <div className="lrd-carousel-arrows-row">
                  <button
                    className="lrd-carousel-arrow-btn"
                    onClick={() => setActiveTeacherIndex((prev) => (prev === 0 ? TEACHERS.length - 1 : prev - 1))}
                    aria-label="Profesor Anterior"
                  >
                    <ChevronLeft size={20} color="#001b50" />
                  </button>
                  <span className="lrd-carousel-index-text">
                    {activeTeacherIndex + 1} / {TEACHERS.length}
                  </span>
                  <button
                    className="lrd-carousel-arrow-btn"
                    onClick={() => setActiveTeacherIndex((prev) => (prev === TEACHERS.length - 1 ? 0 : prev + 1))}
                    aria-label="Siguiente Profesor"
                  >
                    <ChevronRight size={20} color="#001b50" />
                  </button>
                </div>
              </div>

              <div className="lrd-showcase-info-col">
                <div className="lrd-showcase-pills-top">
                  <span className="lrd-pill-item-blue">
                    {TEACHERS[activeTeacherIndex].city}
                  </span>
                  <span className="lrd-pill-item-red">
                    {TEACHERS[activeTeacherIndex].exp}
                  </span>
                </div>

                <h3 className="lrd-showcase-fullname">
                  Prof. {TEACHERS[activeTeacherIndex].name}
                </h3>
                <p className="lrd-showcase-role">{TEACHERS[activeTeacherIndex].role}</p>

                <div className="lrd-showcase-quote-card">
                  <span className="lrd-quote-icon-mark">“</span>
                  <p className="lrd-quote-text">{TEACHERS[activeTeacherIndex].quote}</p>
                </div>

                <div className="lrd-showcase-bullets-block">
                  <h4 className="lrd-bullets-heading">Beneficios de estudiar con {TEACHERS[activeTeacherIndex].name}:</h4>
                  <ul className="lrd-bullets-list">
                    {TEACHERS[activeTeacherIndex].bullets.map((bullet, idx) => (
                      <li key={idx}>
                        <Check size={16} color="#D92534" strokeWidth={3} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className="lrd-btn-red-main lrd-showcase-cta-btn"
                  onClick={() => openLeadModal(`Clase con Prof. ${TEACHERS[activeTeacherIndex].name}`)}
                >
                  ¡QUIERO APRENDER CON {TEACHERS[activeTeacherIndex].name.toUpperCase()}!
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: TODOS LOS NIVELES - SHOWCASE INTERACTIVO (REDISEÑO MAQUETA) */}
      <section className="lrd-section-levels-new" id="cursos">
        {/* Adorno de esquina barroco en la parte superior izquierda del fondo */}
        <img
          src="/imagenes-lp/corner_flourish_bg.webp?v=888"
          alt="Adorno Fondo"
          className="lrd-levels-corner-flourish"
        />

        {/* Ilustración de Mapa de Francia en el fondo superior derecho (En reemplazo de Torre Eiffel) */}
        <img
          src="/imagenes-lp/france_map_adventure_bg.webp"
          alt="Le français, ton aventure"
          className="lrd-levels-france-map-bg"
        />

        <div className="lrd-container lrd-levels-relative-container">
          {/* Header de la sección */}
          <div className="lrd-levels-header-stepper">
            <div className="lrd-levels-headline-wrap">
              {/* Badge "TODOS LOS NIVELES" arriba del título a la izquierda */}
              <div className="lrd-levels-tag-badge">
                <img src="/imagenes-lp/gold_crown_icon.webp" alt="Corona" className="lrd-tag-crown-mini" />
                <span className="lrd-tag-text-red">TODOS LOS NIVELES</span>
              </div>

              <h2 className="lrd-levels-main-title">
                Del “¿qué dijo?” <br className="lrd-br-desktop-only" />
                al <span className="lrd-title-red-highlight">“je parle français”</span>.
              </h2>

              {/* Speech bubble flotante "parle, parle, parle !" */}
              <div className="lrd-speech-bubble-float-pos">
                <img
                  src="/imagenes-lp/parle_parle_speech_bubble.webp?v=999"
                  alt="parle, parle, parle !"
                  className="lrd-parle-bubble-img"
                />
              </div>

              {/* Doodle croissant flotante a la derecha del título */}
              <div className="lrd-croissant-doodle-pos">
                <img
                  src="/imagenes-lp/croissant_doodle.webp"
                  alt="Croissant"
                  className="lrd-croissant-img"
                />
              </div>

              {/* Doodle corazón flotante */}
              <div className="lrd-heart-sketch-pos">
                <svg width="24" height="22" viewBox="0 0 24 24" fill="none" stroke="#001b50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
            </div>

            <p className="lrd-levels-subtitle">
              Encuentra tu nivel y empieza a subir de rango. <span className="lrd-fleur-de-lis">⚜️</span>
            </p>
          </div>

          {/* Stepper Horizontal Interactivo de 6 Niveles con Doodles en Esquinas y Puntos en Línea */}
          <div className="lrd-levels-stepper-container">
            <div className="lrd-stepper-connecting-line"></div>

            <div className="lrd-stepper-items-row">
              {['B1', 'B2', 'I1', 'I2', 'A1', 'A2'].map((lvlKey) => {
                const lvlData = LEVELS[lvlKey];
                const isActive = activeLevel === lvlKey;

                return (
                  <div
                    key={lvlKey}
                    className={`lrd-stepper-node-item ${isActive ? 'lrd-node-active' : ''}`}
                    onClick={() => setActiveLevel(lvlKey)}
                  >
                    {/* Tarjeta del Nivel con Doodle superpuesto en su esquina correspondiente */}
                    <div className={`lrd-stepper-card-box ${isActive ? 'lrd-box-active-red' : ''}`}>
                      {/* Doodle en la esquina correspondiente */}
                      {lvlKey === 'B1' && (
                        <img
                          src="/imagenes-lp/beret_doodle_a1.webp"
                          alt="Boina Básico 1"
                          className="lrd-corner-doodle lrd-doodle-a1-left"
                        />
                      )}
                      {lvlKey === 'B2' && (
                        <img
                          src="/imagenes-lp/coffee_cup_doodle.webp"
                          alt="Taza Básico 2"
                          className="lrd-corner-doodle lrd-doodle-a2-right"
                        />
                      )}
                      {lvlKey === 'I1' && (
                        <img
                          src="/imagenes-lp/chat_bubble_doodle_b1.webp"
                          alt="Bubble Intermedio 1"
                          className="lrd-corner-doodle lrd-doodle-b1-right"
                        />
                      )}
                      {lvlKey === 'I2' && (
                        <img
                          src="/imagenes-lp/gold_crown_icon.webp"
                          alt="Corona Intermedio 2"
                          className="lrd-corner-doodle lrd-doodle-b2-crown"
                        />
                      )}
                      {lvlKey === 'A1' && (
                        <img
                          src="/imagenes-lp/star_doodle_c1.webp"
                          alt="Estrella Avanzado 1"
                          className="lrd-corner-doodle lrd-doodle-c1-right"
                        />
                      )}
                      {lvlKey === 'A2' && (
                        <img
                          src="/imagenes-lp/diamond_doodle_c2.webp"
                          alt="Diamante Avanzado 2"
                          className="lrd-corner-doodle lrd-doodle-c2-right"
                        />
                      )}

                      <span className="lrd-stepper-code-text">{lvlData.code}</span>
                      <span className="lrd-stepper-sub-text">{lvlData.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tarjeta Principal Interactiva Royal Navy de Nivel Activo */}
          {LEVELS[activeLevel] && (
            <div className="lrd-royal-level-card-dark">
              {/* Contenido Izquierdo */}
              <div className="lrd-card-dark-left">
                {/* Sello Circular Rojo del Nivel */}
                <div className="lrd-level-red-stamp">
                  <span className="lrd-stamp-nivel-label">NIVEL</span>
                  <span className="lrd-stamp-code">{LEVELS[activeLevel].code}</span>
                  <span className="lrd-stamp-stars">★★★</span>
                </div>

                {/* Encabezado del Nivel */}
                <div className="lrd-card-dark-header">
                  <span className="lrd-level-subtag-red">{LEVELS[activeLevel].levelTag}</span>
                  <h3 className="lrd-level-card-main-title">
                    {LEVELS[activeLevel].titleLine1} <br />
                    <span className="lrd-text-gold-handwriting">{LEVELS[activeLevel].titleLine2}</span>
                  </h3>
                </div>

                {/* Grid de 4 Bullets con Íconos Dorados Exactos */}
                <div className="lrd-level-bullets-2x2">
                  {LEVELS[activeLevel].bullets.map((b, idx) => (
                    <div className="lrd-bullet-item-dark" key={idx}>
                      <div className="lrd-bullet-icon-box">
                        {b.icon === 'chat' && (
                          <img src="/imagenes-lp/gold_speech_bubble_icon.webp?v=555" alt="Chat" className="lrd-gold-bullet-icon" />
                        )}
                        {b.icon === 'trophy' && (
                          <img src="/imagenes-lp/gold_trophy_icon.webp?v=555" alt="Trophy" className="lrd-gold-bullet-icon" />
                        )}
                        {b.icon === 'people' && (
                          <img src="/imagenes-lp/gold_person_speaking_icon.webp?v=555" alt="People" className="lrd-gold-bullet-icon" />
                        )}
                        {b.icon === 'book' && (
                          <img src="/imagenes-lp/gold_open_book_icon.webp?v=555" alt="Book" className="lrd-gold-bullet-icon" />
                        )}
                      </div>
                      <span className="lrd-bullet-text-dark">{b.text}</span>
                    </div>
                  ))}
                </div>

                {/* Botón CTA + Sello Circular Dorado Petit à Petit */}
                <div className="lrd-card-dark-bottom-row">
                  <button
                    className="lrd-btn-red-main lrd-btn-level-cta"
                    onClick={() => openLeadModal(`Inscripción ${LEVELS[activeLevel].sub}`)}
                  >
                    QUIERO SUBIR DE NIVEL <ChevronRight size={18} style={{ marginLeft: '4px' }} />
                  </button>

                  <div className="lrd-petit-stamp-wrap">
                    <img
                      src="/imagenes-lp/petit_a_petit_stamp.webp"
                      alt="Petit à petit on y arrive"
                      className="lrd-petit-stamp-img"
                    />
                  </div>
                </div>
              </div>

              {/* Contenido Derecho: Profesor en Boina + Texto Dorado On Y Va */}
              <div className="lrd-card-dark-right">

                {/* Imagen Cutout del Profesor Guiñando el Ojo */}
                <div className="lrd-french-guy-photo-wrap">
                  <img
                    src="/imagenes-lp/french_guy_pointing.webp?v=1111"
                    alt="Profesor de Francés Les Rois du Français"
                    className="lrd-french-guy-img"
                  />
                </div>
              </div>

              {/* Sticker Flotante Esquina Inferior Izquierda: Je peux le faire! */}
              <div className="lrd-sticker-note-je-peux">
                <img
                  src="/imagenes-lp/je_peux_le_faire_note.webp?v=7777"
                  alt="Je peux le faire !"
                  className="lrd-sticker-note-img"
                />
              </div>

              {/* Sticker Flotante Esquina Inferior Derecha: J'❤️ LE FRANÇAIS */}
              <div className="lrd-sticker-j-adore">
                <img
                  src="/imagenes-lp/j_adore_le_francais.webp"
                  alt="J'adore le français"
                  className="lrd-sticker-j-adore-img"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN PRECIOS, HORARIOS Y MODALIDADES REALES - ESTILO ROYAL INTERACTIVO */}
      <section className="lrd-pricing-royal-section" id="precios">
        <div className="lrd-container lrd-pricing-container-rel">
          {/* Header de Sección de Lujo */}
          <div className="lrd-pricing-header-wrap">
            <div className="lrd-pricing-badge-pill">
              <Crown size={15} color="#D59B28" fill="#D59B28" />
              <span>PLANES Y HORARIOS OFICIALES • GRUPOS MÁXIMO 8 ALUMNOS</span>
            </div>

            <h2 className="lrd-pricing-title">
              ELIGE TU PLAN REAL <span className="lrd-text-gold-highlight">A TU RITMO</span>
            </h2>

            <div className="lrd-pricing-underline-wrap">
              <svg className="lrd-pricing-red-underline-exact" width="280" height="14" viewBox="0 0 280 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 6 8 C 70 3, 170 3, 274 7 C 200 10, 100 11, 20 12" stroke="#D92534" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <p className="lrd-pricing-subtitle">
              Clases 100% en vivo por Zoom con profesores nativos de Francia (París, Lyon, Burdeos). Personaliza tus días y turnos favoritos con total flexibilidad.
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

                <p className="lrd-pcard-pace-clean">Avanza en una sola sesión semanal intensiva sin interferir con tu trabajo o estudios.</p>

                {/* Precio */}
                <div className="lrd-pcard-price-row">
                  <span className="lrd-pcard-price-currency">$</span>
                  <span className="lrd-pcard-price-main">1,650</span>
                  <span className="lrd-pcard-price-suffix">MXN / mes</span>
                </div>

                {/* Selector Interactivo de Horario Sabatino */}
                <div className="lrd-schedule-selector-box">
                  <span className="lrd-schedule-selector-title">
                    <Clock size={13} color="#001b50" /> Selecciona tu turno en sábado:
                  </span>
                  <div className="lrd-schedule-options-row">
                    <button
                      type="button"
                      className={`lrd-opt-pill ${sabatinoShift === '08:00' ? 'selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSabatinoShift('08:00'); setSelectedGroupPlan('sabatino'); }}
                    >
                      08:00 - 10:50
                    </button>
                    <button
                      type="button"
                      className={`lrd-opt-pill ${sabatinoShift === '11:00' ? 'selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSabatinoShift('11:00'); setSelectedGroupPlan('sabatino'); }}
                    >
                      11:00 - 13:50
                    </button>
                    <button
                      type="button"
                      className={`lrd-opt-pill ${sabatinoShift === '14:00' ? 'selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setSabatinoShift('14:00'); setSelectedGroupPlan('sabatino'); }}
                    >
                      14:00 - 16:50
                    </button>
                  </div>
                </div>

                <ul className="lrd-pcard-benefits-clean">
                  <li>
                    <Check size={15} color="#001b50" strokeWidth={3} />
                    <span><strong>1 sesión intensiva</strong> semanal de 2h 50 min</span>
                  </li>
                  <li>
                    <Check size={15} color="#001b50" strokeWidth={3} />
                    <span>Grupos reducidos de <strong>máx. 8 alumnos</strong></span>
                  </li>
                  <li>
                    <Check size={15} color="#001b50" strokeWidth={3} />
                    <span>Profesor 100% nativo con dinámicas orales</span>
                  </li>
                  <li>
                    <Check size={15} color="#001b50" strokeWidth={3} />
                    <span>Libro de actividades y material <strong>GRATIS</strong></span>
                  </li>
                  <li>
                    <Check size={15} color="#001b50" strokeWidth={3} />
                    <span>Evaluación dual y diploma oficial de nivel</span>
                  </li>
                </ul>

                <button
                  className={`lrd-btn-pcard-clean lrd-btn-navy-subtle ${selectedGroupPlan === 'sabatino' ? 'lrd-btn-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGroupPlan('sabatino');
                    openLeadModal(`Modalidad Sabatino (Turno ${sabatinoShift})`);
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
                    <span className="lrd-pcard-cat-label lrd-text-gold">MÁXIMA CONSTANCIA</span>
                    <h3 className="lrd-pcard-name-clean lrd-regular-card-title">Modalidad Regular</h3>
                  </div>
                </div>

                <p className="lrd-pcard-pace-clean">El ritmo ideal para hablar con fluidez natural sin sobrecargar tu semana.</p>

                {/* Precio */}
                <div className="lrd-pcard-price-row">
                  <span className="lrd-pcard-price-currency">$</span>
                  <span className="lrd-pcard-price-main">1,490</span>
                  <span className="lrd-pcard-price-suffix">MXN / mes</span>
                </div>

                {/* Selectores Interactivos de Días y Horarios */}
                <div className="lrd-schedule-selector-box lrd-hero-selector-box">
                  {/* Fila 1: Días de Clase */}
                  <div className="lrd-selector-subrow">
                    <span className="lrd-schedule-selector-title">
                      <Calendar size={13} color="#D59B28" /> Elige tus días de clase:
                    </span>
                    <div className="lrd-schedule-options-row">
                      <button
                        type="button"
                        className={`lrd-opt-pill lrd-opt-gold ${regularDays === 'LMV' ? 'selected' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setRegularDays('LMV'); setSelectedGroupPlan('regular'); }}
                      >
                        Lun - Mié - Vie
                      </button>
                      <button
                        type="button"
                        className={`lrd-opt-pill lrd-opt-gold ${regularDays === 'MJV' ? 'selected' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setRegularDays('MJV'); setSelectedGroupPlan('regular'); }}
                      >
                        Mié - Jue - Vie
                      </button>
                    </div>
                  </div>

                  {/* Fila 2: Turno Horario */}
                  <div className="lrd-selector-subrow">
                    <span className="lrd-schedule-selector-title">
                      <Clock size={13} color="#D59B28" /> Franja horaria:
                    </span>
                    <div className="lrd-schedule-options-row">
                      <button
                        type="button"
                        className={`lrd-opt-pill lrd-opt-gold ${regularShift === 'matutino' ? 'selected' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setRegularShift('matutino'); setSelectedGroupPlan('regular'); }}
                      >
                        Matutino (08:00 - 12:00)
                      </button>
                      <button
                        type="button"
                        className={`lrd-opt-pill lrd-opt-gold ${regularShift === 'vespertino' ? 'selected' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setRegularShift('vespertino'); setSelectedGroupPlan('regular'); }}
                      >
                        Vespertino (16:00 - 21:00)
                      </button>
                    </div>
                  </div>
                </div>

                <ul className="lrd-pcard-benefits-clean lrd-hero-benefits">
                  <li>
                    <Check size={16} color="#D92534" strokeWidth={3} />
                    <span><strong>3 clases en vivo</strong> por semana (50 min c/u)</span>
                  </li>
                  <li>
                    <Check size={16} color="#D92534" strokeWidth={3} />
                    <span>Grupos reducidos VIP: <strong>máximo 8 alumnos</strong></span>
                  </li>
                  <li>
                    <Check size={16} color="#D92534" strokeWidth={3} />
                    <span>Profesores nativos con <strong>rotación de acentos</strong></span>
                  </li>
                  <li>
                    <Check size={16} color="#D92534" strokeWidth={3} />
                    <span>Libro de actividades y audios <strong>100% GRATIS</strong></span>
                  </li>
                  <li>
                    <Check size={16} color="#D92534" strokeWidth={3} />
                    <span>Evaluación dual y <strong>certificado oficial avalado</strong></span>
                  </li>
                  <li>
                    <Check size={16} color="#D92534" strokeWidth={3} />
                    <span>Enlace permanente y grabaciones de respaldo</span>
                  </li>
                </ul>

                <button
                  className={`lrd-btn-pcard-clean lrd-btn-gold-subtle ${selectedGroupPlan === 'regular' ? 'lrd-btn-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGroupPlan('regular');
                    openLeadModal(`Modalidad Regular (${regularDays === 'LMV' ? 'Lun-Mié-Vie' : 'Mié-Jue-Vie'} - Turno ${regularShift})`);
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
                    <span className="lrd-pcard-cat-label lrd-text-red">INMERSIÓN DIARIA</span>
                    <h3 className="lrd-pcard-name-clean">Modalidad Intensivo</h3>
                  </div>
                </div>

                <p className="lrd-pcard-pace-clean">Aprende al doble de velocidad con práctica conversacional diaria de lunes a viernes.</p>

                {/* Precio */}
                <div className="lrd-pcard-price-row">
                  <span className="lrd-pcard-price-currency">$</span>
                  <span className="lrd-pcard-price-main">2,550</span>
                  <span className="lrd-pcard-price-suffix">MXN / mes</span>
                </div>

                {/* Selector Interactivo de Turno Intensivo */}
                <div className="lrd-schedule-selector-box">
                  <span className="lrd-schedule-selector-title">
                    <Clock size={13} color="#D92534" /> 5 clases/sem (Lun a Vie) - Elige turno:
                  </span>
                  <div className="lrd-schedule-options-row">
                    <button
                      type="button"
                      className={`lrd-opt-pill lrd-opt-red ${intensivoShift === 'matutino' ? 'selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setIntensivoShift('matutino'); setSelectedGroupPlan('intensivo'); }}
                    >
                      Matutino (08:00 - 12:00)
                    </button>
                    <button
                      type="button"
                      className={`lrd-opt-pill lrd-opt-red ${intensivoShift === 'vespertino' ? 'selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setIntensivoShift('vespertino'); setSelectedGroupPlan('intensivo'); }}
                    >
                      Vespertino (18:00 - 21:00)
                    </button>
                  </div>
                </div>

                <ul className="lrd-pcard-benefits-clean">
                  <li>
                    <Check size={15} color="#D92534" strokeWidth={3} />
                    <span><strong>5 clases por semana</strong> (50 min c/u diaria)</span>
                  </li>
                  <li>
                    <Check size={15} color="#D92534" strokeWidth={3} />
                    <span>Inmersión total: termina el nivel en la mitad del tiempo</span>
                  </li>
                  <li>
                    <Check size={15} color="#D92534" strokeWidth={3} />
                    <span>Rotación activa con profesores 100% nativos</span>
                  </li>
                  <li>
                    <Check size={15} color="#D92534" strokeWidth={3} />
                    <span>Todo el material digital y libro pedagógico <strong>GRATIS</strong></span>
                  </li>
                  <li>
                    <Check size={15} color="#D92534" strokeWidth={3} />
                    <span>Evaluación dual y diploma oficial de nivel</span>
                  </li>
                </ul>

                <button
                  className={`lrd-btn-pcard-clean lrd-btn-red-subtle ${selectedGroupPlan === 'intensivo' ? 'lrd-btn-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGroupPlan('intensivo');
                    openLeadModal(`Modalidad Intensivo (Turno ${intensivoShift})`);
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
                    1 alumno con profesor nativo exclusivo. El ritmo, objetivos (viajes, negocios, preparación DELF/DALF) y horarios se adaptan 100% a tu disponibilidad.
                  </p>
                </div>

                <div className="lrd-private-rates-grid">
                  <div
                    className={`lrd-rate-box ${selectedPrivateRate === 1 ? 'lrd-rate-selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedPrivateRate(1); setSelectedPrivateType('individual'); }}
                  >
                    {selectedPrivateRate === 1 && <span className="lrd-rate-badge-mini">Seleccionado</span>}
                    <span className="lrd-rate-freq">1 clase / semana</span>
                    <span className="lrd-rate-price">$1,500 <small>MXN/mes</small></span>
                    <span className="lrd-rate-detail">4 clases al mes</span>
                  </div>
                  <div
                    className={`lrd-rate-box ${selectedPrivateRate === 2 ? 'lrd-rate-selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedPrivateRate(2); setSelectedPrivateType('individual'); }}
                  >
                    {selectedPrivateRate === 2 && <span className="lrd-rate-badge-mini">Seleccionado</span>}
                    <span className="lrd-rate-freq">2 clases / semana</span>
                    <span className="lrd-rate-price">$2,500 <small>MXN/mes</small></span>
                    <span className="lrd-rate-detail">8 clases al mes</span>
                  </div>
                  <div
                    className={`lrd-rate-box ${selectedPrivateRate === 3 ? 'lrd-rate-selected lrd-rate-popular' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedPrivateRate(3); setSelectedPrivateType('individual'); }}
                  >
                    <span className="lrd-rate-badge-mini">{selectedPrivateRate === 3 ? '✓ Seleccionado' : 'Recomendado'}</span>
                    <span className="lrd-rate-freq">3 clases / sem (Regular)</span>
                    <span className="lrd-rate-price">$3,750 <small>MXN/mes</small></span>
                    <span className="lrd-rate-detail">12 clases al mes</span>
                  </div>
                  <div
                    className={`lrd-rate-box ${selectedPrivateRate === 5 ? 'lrd-rate-selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedPrivateRate(5); setSelectedPrivateType('individual'); }}
                  >
                    {selectedPrivateRate === 5 && <span className="lrd-rate-badge-mini">Seleccionado</span>}
                    <span className="lrd-rate-freq">5 clases / sem (Intensiva)</span>
                    <span className="lrd-rate-price">$6,500 <small>MXN/mes</small></span>
                    <span className="lrd-rate-detail">20 clases al mes</span>
                  </div>
                </div>

                <ul className="lrd-private-features-list">
                  <li><Check size={16} color="#D92534" /> <span>Profesor nativo dedicado a tus objetivos específicos</span></li>
                  <li><Check size={16} color="#D92534" /> <span>Horarios coordinados a tu medida de lunes a sábado</span></li>
                  <li><Check size={16} color="#D92534" /> <span>Flexibilidad de reprogramación de clases con aviso previo</span></li>
                  <li><Check size={16} color="#D92534" /> <span>Material pedagógico, libros y certificaciones oficiales incluidos</span></li>
                </ul>

                <button
                  className={`${selectedPrivateType === 'individual' ? 'lrd-btn-red-main' : 'lrd-btn-navy-pcard'} lrd-btn-pcard-action`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPrivateType('individual');
                    openLeadModal(`Clases Particulares (${selectedPrivateRate} clase${selectedPrivateRate > 1 ? 's' : ''}/sem)`);
                  }}
                >
                  {selectedPrivateType === 'individual' ? `✓ COTIZAR PLAN ${selectedPrivateRate} CLASE${selectedPrivateRate > 1 ? 'S' : ''}/SEM` : 'COTIZAR CLASES PARTICULARES'}
                </button>
              </div>

              {/* Tarjeta 2: Modalidad Part Duo */}
              <div
                className={`lrd-duo-card ${selectedPrivateType === 'duo' ? 'lrd-duo-active' : ''}`}
                onClick={() => setSelectedPrivateType('duo')}
              >
                <div className="lrd-duo-ribbon-tag">DUPLA EXCLUSIVA</div>
                <div className="lrd-duo-header">
                  <Users size={28} color="#D59B28" />
                  <h3 className="lrd-duo-title">Modalidad Part Duo</h3>
                  <p className="lrd-duo-desc">
                    2 alumnos que toman clases juntos con el mismo profesor y horario personalizado. Ideal para parejas, amigos, colegas de trabajo o familiares.
                  </p>
                </div>

                <div className="lrd-duo-highlight-banner">
                  <span className="lrd-duo-badge">Ahorro Compartido</span>
                  <p className="lrd-duo-banner-text">
                    Disfruten de la atención de una clase particular pagando una tarifa reducida al estudiar en pareja.
                  </p>
                </div>

                <ul className="lrd-private-features-list">
                  <li><Check size={16} color="#001b50" /> <span>Mismo horario y profesor asignado para ambos</span></li>
                  <li><Check size={16} color="#001b50" /> <span>Práctica conversacional activa y roleplays en pareja</span></li>
                  <li><Check size={16} color="#001b50" /> <span>Libros de actividades individuales gratuitos para cada alumno</span></li>
                  <li><Check size={16} color="#001b50" /> <span>Certificado oficial individual para cada estudiante al finalizar</span></li>
                </ul>

                <button
                  className={`${selectedPrivateType === 'duo' ? 'lrd-btn-red-main' : 'lrd-btn-navy-pcard'} lrd-btn-pcard-action`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPrivateType('duo');
                    openLeadModal('Modalidad Part Duo (2 Alumnos)');
                  }}
                >
                  {selectedPrivateType === 'duo' ? '✓ COTIZAR PLAN PART DUO' : 'COTIZAR PLAN PART DUO'}
                </button>
              </div>
            </div>
          )}

          {/* BANNER DE PROMOCIONES MULTI-MES (#promos) */}
          <div className="lrd-promos-banner-container" id="promos">
            <div className="lrd-promos-content">
              <div className="lrd-promos-text-col">
                <span className="lrd-promos-pill">🏷️ AHORRO REAL DE LA REALEZA</span>
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
                <span>Sin costos de inscripción ocultos</span>
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
                <span>Certificado oficial avalado con evaluación dual</span>
              </div>
            </div>
          </div>

          {/* BANNER CLASE DE PRUEBA GRATIS DE REFUERZO */}
          <div className="lrd-trial-callout-box">
            <div className="lrd-trial-text">
              <h4 className="lrd-trial-title">¿Aún tienes dudas sobre tu nivel o la metodología?</h4>
              <p className="lrd-trial-desc">
                Toma una <strong>Clase de Prueba 100% GRATIS</strong> y sin compromiso con uno de nuestros profesores nativos para conocer la plataforma y resolver todas tus preguntas.
              </p>
            </div>
            <button
              className="lrd-btn-trial-action"
              onClick={() => openLeadModal('Clase de Prueba Gratis desde Precios')}
            >
              AGENDAR MI CLASE GRATIS
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: BENEFICIOS DE LA REALEZA (¿POR QUÉ ELEGIR LES ROIS DU FRANÇAIS?) */}
      <section className="lrd-section-why-new" id="nosotros">
        {/* Gráfico de onda roja inferior derecha */}
        <img
          src="/imagenes-lp/red_wave_transparent.webp"
          alt="Decoración Realeza"
          className="lrd-why-bottom-red-wave"
        />

        <div className="lrd-container lrd-why-container-rel">
          {/* Composición Gráfica del Título Principal + Stickers y Doodles Exactos a la Referencia */}
          <div className="lrd-why-header-composition">
            {/* Sticker 3D Salut flotante con sus estrellas doradas */}
            <div className="lrd-why-floating-salut">
              <img
                src="/imagenes-lp/salut_3d_bubble.webp"
                alt="Salut!"
                className="lrd-why-salut-bubble"
              />
              <div className="lrd-why-salut-stars">
                <svg width="60" height="60" viewBox="0 0 50 50" fill="none">
                  <path d="M 22 4 Q 22 22 40 22 Q 22 22 22 40 Q 22 22 4 22 Q 22 22 22 4 Z" stroke="#D59B28" strokeWidth="3.2" strokeLinejoin="round" />
                  <path d="M 38 32 Q 38 40 46 40 Q 38 40 38 48 Q 38 40 30 40 Q 38 40 38 32 Z" stroke="#D59B28" strokeWidth="2.5" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Sticker Avión de Papel con estela punteada a la derecha */}
            <img
              src="/imagenes-lp/paper_plane_loop_trail.webp"
              alt="Avión de papel"
              className="lrd-why-paper-plane-trail"
            />

            {/* Sticker Burbuja Roja 3D "Ça va?" */}
            <img
              src="/imagenes-lp/ca_va_bubble_red.webp"
              alt="Ça va?"
              className="lrd-why-ca-va-bubble"
            />

            {/* Título Principal Nítido en HTML/CSS Vectorial */}
            <div className="lrd-why-header-text-block">
              <h2 className="lrd-why-heading-title">
                <span className="lrd-why-title-left-group">
                  <img
                    src="/imagenes-lp/red_burst_diagonal.webp"
                    alt="Destellos"
                    className="lrd-why-burst-above-b"
                  />
                  BENEFICIOS DE LA
                </span>{' '}
                <span className="lrd-why-title-red-group">
                  REALEZA
                  <img
                    src="/imagenes-lp/crown_doodle_yellow.webp"
                    alt="Corona"
                    className="lrd-why-crown-above-a"
                  />
                </span>
              </h2>
              <p className="lrd-why-heading-sub">
                ¿Por qué miles de alumnos eligen estudiar con Les Rois du Français?
              </p>
              <div className="lrd-why-heading-results-wrap">
                <img
                  src="/imagenes-lp/red_burst_vertical.webp"
                  alt="Destellos"
                  className="lrd-why-results-burst-left"
                />
                <div className="lrd-why-handwritten-block">
                  <span className="lrd-why-results-handwritten">¡Resultados Reales!</span>
                  <img
                    src="/imagenes-lp/sketch_red_underline.svg"
                    alt="Subrayado"
                    className="lrd-why-handwritten-underline"
                  />
                </div>
                <img
                  src="/imagenes-lp/red_burst_vertical.webp"
                  alt="Destellos"
                  className="lrd-why-results-burst-right"
                />
              </div>
            </div>
          </div>

          {/* Bloque Principal: Columna izquierda (Escritorio / Laptop / Libreta) + Columna derecha (Grid de 5 Tarjetas) */}
          <div className="lrd-why-main-layout">
            {/* Columna Izquierda: Foto de Estudio / Laptop con Logo, Taza, Libreta "Parle. Comprends. Conquiers. ❤️" */}
            <div className="lrd-why-desk-col">
              {/* Halftone azul detrás de la laptop */}
              <img
                src="/imagenes-lp/navy_halftone_dots.webp"
                alt="Puntos decorativos laptop"
                className="lrd-why-halftone-laptop"
              />
              {/* Dashes azules sobre la planta */}
              <img
                src="/imagenes-lp/blue_dashes_splash.webp"
                alt="Dashes"
                className="lrd-why-laptop-blue-dashes"
              />
              <div className="lrd-why-desk-inner">
                <img
                  src="/imagenes-lp/beneficios_desk_laptop.webp"
                  alt="Estudio Les Rois du Français - Parle, Comprends, Conquiers"
                  className="lrd-why-desk-photo"
                />
              </div>
            </div>

            {/* Columna Derecha: 5 Tarjetas en 2 Filas */}
            <div className="lrd-why-cards-col">
              {/* Fila 1: 3 Tarjetas (Método propio MRAF, Enfoque 100% Práctico, Resultados Acelerados) */}
              <div className="lrd-why-cards-row1">
                {/* Card 1: Método propio MRAF® */}
                <div className="lrd-bcard-v2 lrd-bcard-accent-gold">
                  <div className="lrd-bcard-icon-badge lrd-bbadge-gold">
                    <Crown size={26} color="#FFFFFF" strokeWidth={2.4} />
                  </div>
                  <h4 className="lrd-bcard-title">
                    <span>Método propio</span>
                    <span className="lrd-bcard-sub">MRAF®</span>
                  </h4>
                  <p className="lrd-bcard-desc">
                    Diseñado exclusivamente para hispanohablantes. Aprendes sin rodeos, con estructura clara y resultados reales desde tu primera clase.
                  </p>
                  <div className="lrd-bcard-footer">
                    <span className="lrd-bcard-tag lrd-btag-red">#MétodoRegistrado</span>
                    {/* Patrón de puntos dorados */}
                    <svg className="lrd-bcard-dots lrd-dots-gold" width="45" height="32" viewBox="0 0 45 32" fill="none">
                      <circle cx="6" cy="24" r="2.2" fill="#D59B28" opacity="0.75" />
                      <circle cx="16" cy="24" r="2.2" fill="#D59B28" opacity="0.75" />
                      <circle cx="26" cy="24" r="2.2" fill="#D59B28" opacity="0.75" />
                      <circle cx="36" cy="24" r="2.2" fill="#D59B28" opacity="0.75" />
                      <circle cx="16" cy="14" r="2.2" fill="#D59B28" opacity="0.75" />
                      <circle cx="26" cy="14" r="2.2" fill="#D59B28" opacity="0.75" />
                      <circle cx="36" cy="14" r="2.2" fill="#D59B28" opacity="0.75" />
                      <circle cx="26" cy="4" r="2.2" fill="#D59B28" opacity="0.75" />
                      <circle cx="36" cy="4" r="2.2" fill="#D59B28" opacity="0.75" />
                    </svg>
                  </div>
                </div>

                {/* Card 2: Enfoque 100% Práctico */}
                <div className="lrd-bcard-v2 lrd-bcard-accent-red">
                  {/* Estrella roja flotante encima a la derecha */}
                  <img
                    src="/imagenes-lp/red_star_target_doodle.webp"
                    alt="Star Doodle"
                    className="lrd-bcard-doodle-star-red"
                  />
                  <div className="lrd-bcard-icon-badge lrd-bbadge-red">
                    <MessageSquare size={26} color="#FFFFFF" strokeWidth={2.4} />
                  </div>
                  <h4 className="lrd-bcard-title">
                    <span>Enfoque 100%</span>
                    <span className="lrd-bcard-sub lrd-text-red">Práctico</span>
                  </h4>
                  <p className="lrd-bcard-desc">
                    Hablas francés desde el día 1. Olvídate del miedo al error y empieza a conversar con total confianza y fluidez real.
                  </p>
                  <div className="lrd-bcard-footer">
                    <span className="lrd-bcard-tag lrd-btag-navy">#HablaSinPena</span>
                    {/* Patrón de puntos rojos */}
                    <svg className="lrd-bcard-dots lrd-dots-red" width="45" height="32" viewBox="0 0 45 32" fill="none">
                      <circle cx="6" cy="24" r="2.2" fill="#D92534" opacity="0.75" />
                      <circle cx="16" cy="24" r="2.2" fill="#D92534" opacity="0.75" />
                      <circle cx="26" cy="24" r="2.2" fill="#D92534" opacity="0.75" />
                      <circle cx="36" cy="24" r="2.2" fill="#D92534" opacity="0.75" />
                      <circle cx="16" cy="14" r="2.2" fill="#D92534" opacity="0.75" />
                      <circle cx="26" cy="14" r="2.2" fill="#D92534" opacity="0.75" />
                      <circle cx="36" cy="14" r="2.2" fill="#D92534" opacity="0.75" />
                      <circle cx="26" cy="4" r="2.2" fill="#D92534" opacity="0.75" />
                      <circle cx="36" cy="4" r="2.2" fill="#D92534" opacity="0.75" />
                    </svg>
                  </div>
                </div>

                {/* Card 3: Resultados Acelerados */}
                <div className="lrd-bcard-wrapper-card3">
                  <div className="lrd-bcard-v2 lrd-bcard-accent-navy">
                    {/* Rayo amarillo 3D flotante encima a la derecha */}
                    <img
                      src="/imagenes-lp/yellow_lightning_doodle.webp"
                      alt="Lightning Doodle"
                      className="lrd-bcard-doodle-lightning-yellow"
                    />
                  <div className="lrd-bcard-icon-badge lrd-bbadge-navy">
                    {/* Rocket / Speed energy icon */}
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-4 11a22.35 22.35 0 0 1-4 2z"/>
                      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                    </svg>
                  </div>
                  <h4 className="lrd-bcard-title">
                    <span>Resultados</span>
                    <span className="lrd-bcard-sub lrd-text-red">Acelerados</span>
                  </h4>
                  <p className="lrd-bcard-desc">
                    Avanza hasta 3 veces más rápido que en escuelas tradicionales con situaciones dinámicas de la vida real y roleplays.
                  </p>
                  <div className="lrd-bcard-footer">
                    <span className="lrd-bcard-tag lrd-btag-gold">#FluidezRápida</span>
                  </div>
                </div>
              </div>
            </div>

              {/* Fila 2: 2 Tarjetas (Comunidad Real [1 Col] + Trato VIP & Realeza [2 Cols]) */}
              <div className="lrd-why-cards-row2">
                {/* Card 4: Comunidad Real */}
                <div className="lrd-bcard-v2 lrd-bcard-accent-community">
                  <div className="lrd-bcard-icon-badge lrd-bbadge-navy">
                    <Users size={26} color="#FFFFFF" strokeWidth={2.4} />
                  </div>
                  <h4 className="lrd-bcard-title">
                    <span>Comunidad</span>
                    <span className="lrd-bcard-sub lrd-text-red">Real</span>
                  </h4>
                  <p className="lrd-bcard-desc">
                    Conecta con compañeros motivados de todo el mundo y practica francés en un ambiente cercano y divertido.
                  </p>
                  <div className="lrd-bcard-footer-community">
                    {/* Doodle doble corazón en azul marino */}
                    <svg className="lrd-hearts-doodle" width="48" height="34" viewBox="0 0 48 34" fill="none" stroke="#001b50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 28 C8 24, 2 17, 2 11 C2 5, 7 2, 12 7 C17 2, 22 5, 22 11 C22 17, 16 24, 12 28 Z" transform="rotate(-15 12 15)" />
                      <path d="M32 26 C29 23, 24 17, 24 12 C24 7, 28 4, 32 8 C36 4, 40 7, 40 12 C40 17, 35 23, 32 26 Z" transform="rotate(10 32 15) scale(0.85)" />
                    </svg>
                  </div>
                </div>

                {/* Card 5: Trato VIP & Realeza (Ancha - Ocupa 2 Columnas) */}
                <div className="lrd-bcard-v2 lrd-bcard-vip-featured">
                  {/* Listón dorado diagonal 100% NATIVOS */}
                  <div className="lrd-vip-ribbon-tag">100% NATIVOS</div>

                  <div className="lrd-vip-card-body">
                    <div className="lrd-vip-header-flex">
                      {/* Badge con diamante de destellos */}
                      <div className="lrd-bcard-icon-badge lrd-bbadge-gold-diamond">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 3h12l4 6-10 12L2 9z"/>
                          <path d="M2 9h20"/>
                          <path d="m6 3 4 6 2 12"/>
                          <path d="m18 3-4 6-2 12"/>
                          <line x1="2" y1="4" x2="4" y2="4" strokeWidth="2" />
                          <line x1="20" y1="4" x2="22" y2="4" strokeWidth="2" />
                          <line x1="12" y1="0.5" x2="12" y2="2" strokeWidth="2" />
                        </svg>
                      </div>

                      <div className="lrd-vip-text-content">
                        <h4 className="lrd-vip-title">Trato VIP & Realeza ✨</h4>
                        <p className="lrd-vip-desc">
                          Profesores nativos franceses con actitud royal, cero aburrimiento y atención personalizada digna de un verdadero rey.
                        </p>
                      </div>
                    </div>

                    {/* Fila horizontal con los 3 beneficios clave */}
                    <div className="lrd-vip-bullets-row">
                      <div className="lrd-vip-bullet-item">
                        <Crown size={18} color="#D59B28" strokeWidth={2.4} />
                        <span>Atención personalizada</span>
                      </div>
                      <div className="lrd-vip-bullet-item">
                        <Star size={18} color="#D59B28" strokeWidth={2.4} />
                        <span>Clases dinámicas y divertidas</span>
                      </div>
                      <div className="lrd-vip-bullet-item">
                        <Heart size={18} color="#D59B28" strokeWidth={2.4} />
                        <span>Apoyo constante en tu camino</span>
                      </div>
                    </div>
                  </div>
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
          <img
            src="/imagenes-lp/petit_a_petit_stamp.webp"
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
            <img
              src="/imagenes-lp/sketch_red_underline.svg"
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
                  <img
                    src="/imagenes-lp/avatar_mariana_clean.webp"
                    alt="Mariana G."
                    className="lrd-testi-avatar-img"
                  />
                </div>
                <div className="lrd-testi-author-info">
                  <div className="lrd-testi-author-name-wrap">
                    <h4 className="lrd-testi-author-name">Mariana G.</h4>
                    <img
                      src="/imagenes-lp/flag_mx.svg"
                      alt="México"
                      className="lrd-testi-flag-standalone"
                      title="México"
                    />
                  </div>
                  <span className="lrd-testi-level-sub">Nivel Intermedio 2 • México</span>
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
                  <img
                    src="/imagenes-lp/avatar_carlos_clean.webp"
                    alt="Carlos T."
                    className="lrd-testi-avatar-img"
                  />
                </div>
                <div className="lrd-testi-author-info">
                  <div className="lrd-testi-author-name-wrap">
                    <h4 className="lrd-testi-author-name">Carlos T.</h4>
                    <img
                      src="/imagenes-lp/flag_es.svg"
                      alt="España"
                      className="lrd-testi-flag-standalone"
                      title="España"
                    />
                  </div>
                  <span className="lrd-testi-level-sub">Nivel Básico 2 • España</span>
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
                  <img
                    src="/imagenes-lp/avatar_sofia_clean.webp"
                    alt="Sofía R."
                    className="lrd-testi-avatar-img"
                  />
                </div>
                <div className="lrd-testi-author-info">
                  <div className="lrd-testi-author-name-wrap">
                    <h4 className="lrd-testi-author-name">Sofía R.</h4>
                    <img
                      src="/imagenes-lp/flag_ar.svg"
                      alt="Argentina"
                      className="lrd-testi-flag-standalone"
                      title="Argentina"
                    />
                  </div>
                  <span className="lrd-testi-level-sub">Nivel Avanzado 1 • Argentina</span>
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
      <footer className="lrd-footer-dark-new">
        <div className="lrd-container lrd-footer-flex-container">
          {/* Columna 1: Marca */}
          <div className="lrd-footer-col-brand">
            <img src="/imagenes-lp/logo_official.webp" alt="Les Rois du Français" className="lrd-footer-brand-logo" />
            <p className="lrd-footer-brand-desc">
              Te prometemos un aprendizaje estructurado, rápido y lleno de humor y conversaciones para este hermoso idioma.
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
              <a href="https://www.facebook.com/people/Les-Rois-du-Fran%C3%A7ais/61554418860885/" target="_blank" rel="noreferrer" className="lrd-social-btn"><FacebookIcon size={14} color="#FFFFFF" /></a>
              <a href="https://www.instagram.com/lesroisdufrancais?igsh=MTNxbWR1OHM1Z2h6dA==" target="_blank" rel="noreferrer" className="lrd-social-btn"><InstagramIcon size={14} color="#FFFFFF" /></a>
              <a href="https://www.youtube.com/@RoisduFrancais" target="_blank" rel="noreferrer" className="lrd-social-btn"><YoutubeIcon size={14} color="#FFFFFF" /></a>
            </div>
          </div>

          {/* Columna 3: Boletín */}
          <div className="lrd-footer-col-newsletter">
            <h4 className="lrd-footer-heading">BOLETÍN</h4>
            <p className="lrd-newsletter-desc">Recibe promos exclusivas y tips para aprender francés.</p>
            <form className="lrd-newsletter-form-flex" onSubmit={(e) => { e.preventDefault(); alert('¡Gracias por suscribirte!'); }}>
              <input type="email" placeholder="Tu correo electrónico" required />
              <button type="submit" className="lrd-newsletter-btn" aria-label="Enviar">
                <Send size={18} color="#FFFFFF" />
              </button>
            </form>
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

      {/* Modals */}
      {leadModalOpen && (
        <div className="lrd-modal-backdrop" onClick={() => setLeadModalOpen(false)}>
          <div className="lrd-modal-card lrd-lead-modal-pro" onClick={(e) => e.stopPropagation()}>
            {/* Barra Tricolor Francesa & Oro Real en el borde superior */}
            <div className="lrd-modal-tricolor-bar">
              <span className="lrd-tbar-blue"></span>
              <span className="lrd-tbar-gold"></span>
              <span className="lrd-tbar-red"></span>
            </div>

            {/* Botón de Cierre Elegante */}
            <button
              className="lrd-modal-close-btn"
              onClick={() => setLeadModalOpen(false)}
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>

            {formSubmitted ? (
              <div className="lrd-modal-success-wrap">
                <div className="lrd-success-badge-icon">
                  <Check size={40} strokeWidth={3} color="#FFFFFF" />
                </div>
                <span className="lrd-success-tag">¡RÉSERVATION CONFIRMÉE!</span>
                <h3 className="lrd-success-title">¡Félicitations, {formData.name || 'Futuro Alumno'}!</h3>
                <p className="lrd-success-desc">
                  Pre-registramos tu lugar para la <strong>Clase de Prueba Diagnóstica en Vivo</strong>. Tu asesor académico exclusivo te contactará por WhatsApp para coordinar el acceso a Zoom y entregarte el libro de actividades sin costo.
                </p>

                {/* Plan Summary Card */}
                <div className="lrd-success-plan-box">
                  <div className="lrd-splan-icon">
                    <Crown size={20} color="#D59B28" />
                  </div>
                  <div className="lrd-splan-text">
                    <span className="lrd-splan-label">MODALIDAD DE INTERÉS</span>
                    <strong className="lrd-splan-name">{leadOrigin || formData.schedule}</strong>
                  </div>
                </div>

                <a
                  href={`https://api.whatsapp.com/send?phone=522223437074&text=${encodeURIComponent(
                    `¡Hola Les Rois du Français! 🇫🇷\n\nAcabo de registrarme para la Clase de Prueba Gratis.\n👤 *Nombre:* ${formData.name}\n📚 *Plan:* ${leadOrigin || formData.schedule}\n\n¿Me pueden confirmar los detalles por favor?`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="lrd-btn-whatsapp-direct"
                >
                  <MessageSquare size={18} fill="#FFFFFF" color="#FFFFFF" />
                  CONTINUAR EN WHATSAPP AHORA
                </a>

                <button
                  type="button"
                  className="lrd-btn-close-clean"
                  onClick={() => setLeadModalOpen(false)}
                >
                  Cerrar ventana
                </button>
              </div>
            ) : (
              <>
                {/* Header Pro con Escudo/Corona Royal */}
                <div className="lrd-lead-modal-header">
                  <div className="lrd-lead-crest-wrap">
                    <div className="lrd-lead-crest-circle">
                      <Crown size={22} color="#D59B28" strokeWidth={2.4} />
                    </div>
                  </div>

                  <div className="lrd-lead-badge-pill">
                    <Sparkles size={13} color="#D59B28" />
                    <span>PLAZAS LIMITADAS • MÁX. 8 ALUMNOS</span>
                  </div>

                  <h3 className="lrd-lead-title">
                    Reserva Tu Clase de Prueba <span className="lrd-text-red-strong">GRATIS</span>
                  </h3>
                  <p className="lrd-lead-subtitle">
                    Habla francés desde tu primera sesión en vivo con profesores 100% nativos.
                  </p>
                </div>

                {/* Banner de Modalidad / Nivel Seleccionado en tiempo real */}
                {leadOrigin && leadOrigin !== 'Clase de Prueba Gratis' && (
                  <div className="lrd-lead-selected-plan-banner">
                    <div className="lrd-plan-banner-icon">
                      <Crown size={18} color="#D59B28" strokeWidth={2.4} />
                    </div>
                    <div className="lrd-plan-banner-info">
                      <span className="lrd-pbi-tag">Tu selección actual:</span>
                      <strong className="lrd-pbi-name">{leadOrigin}</strong>
                    </div>
                    <div className="lrd-plan-banner-check">
                      <Check size={14} color="#001b50" strokeWidth={3.2} />
                    </div>
                  </div>
                )}

                {/* Formulario Pro */}
                <form onSubmit={handleLeadSubmit} className="lrd-lead-form-pro">
                  {/* Campo 1: Nombre */}
                  <div className="lrd-pro-field-wrap">
                    <label className="lrd-pro-label">
                      <span>Nombre completo</span>
                      <span className="lrd-req-star">*</span>
                    </label>
                    <div className="lrd-pro-input-container">
                      <span className="lrd-pro-input-icon">
                        <User size={18} color="#64748B" />
                      </span>
                      <input
                        type="text"
                        required
                        className="lrd-pro-input"
                        placeholder="Ej. Ana María López"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Campo 2: Correo */}
                  <div className="lrd-pro-field-wrap">
                    <label className="lrd-pro-label">
                      <span>Correo electrónico</span>
                      <span className="lrd-req-star">*</span>
                    </label>
                    <div className="lrd-pro-input-container">
                      <span className="lrd-pro-input-icon">
                        <Mail size={18} color="#64748B" />
                      </span>
                      <input
                        type="email"
                        required
                        className="lrd-pro-input"
                        placeholder="tu@correo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Campo 3: WhatsApp */}
                  <div className="lrd-pro-field-wrap">
                    <label className="lrd-pro-label">
                      <span>WhatsApp (para enviarte el acceso a Zoom)</span>
                      <span className="lrd-req-star">*</span>
                    </label>
                    <div className="lrd-pro-input-container">
                      <span className="lrd-pro-prefix-pill">
                        🇲🇽 +52
                      </span>
                      <input
                        type="tel"
                        required
                        className="lrd-pro-input lrd-pro-input-phone"
                        placeholder="222 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Campo 4: Modalidad Preferida */}
                  <div className="lrd-pro-field-wrap">
                    <label className="lrd-pro-label">
                      <span>Modalidad de preferencia</span>
                    </label>
                    <div className="lrd-pro-input-container">
                      <span className="lrd-pro-input-icon">
                        <Clock size={18} color="#64748B" />
                      </span>
                      <select
                        className="lrd-pro-select"
                        value={formData.schedule}
                        onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                      >
                        <option value="Regular">Modalidad Regular · 3 clases/sem (Lun-Mié-Vie o Mié-Jue-Vie)</option>
                        <option value="Sabatino">Modalidad Sabatino · 1 sesión semanal (Sábados 2h 50 min)</option>
                        <option value="Intensivo">Modalidad Intensivo · 5 clases/sem (Lun a Vie)</option>
                        <option value="Particular">Clases Particulares 1 a 1 o Part Duo (A tu ritmo)</option>
                      </select>
                    </div>
                  </div>

                  {/* Botón CTA Master Pro */}
                  <button type="submit" className="lrd-btn-submit-master">
                    <span className="lrd-btn-sub-spark">
                      <Sparkles size={17} fill="#FFFFFF" color="#FFFFFF" />
                    </span>
                    <span className="lrd-btn-sub-text">CONFIRMAR MI CLASE GRATIS</span>
                    <span className="lrd-btn-sub-arrow">
                      <ChevronRight size={18} strokeWidth={2.8} />
                    </span>
                  </button>

                  {/* Microcopy & Trust Badges */}
                  <div className="lrd-lead-trust-row">
                    <div className="lrd-trust-item">
                      <ShieldCheck size={14} color="#16A34A" />
                      <span>100% Gratuito</span>
                    </div>
                    <span className="lrd-trust-dot">•</span>
                    <div className="lrd-trust-item">
                      <MessageSquare size={14} color="#001b50" />
                      <span>Confirmación inmediata</span>
                    </div>
                    <span className="lrd-trust-dot">•</span>
                    <div className="lrd-trust-item">
                      <Crown size={14} color="#D59B28" />
                      <span>Profesor nativo</span>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

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
