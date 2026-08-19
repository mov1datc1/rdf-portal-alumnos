import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  Users,
  Play,
  Star,
  Check,
  BookOpen,
  ShieldCheck,
  Globe,
  User,
  Calendar,
  ChevronDown,
  Menu,
  Send,
  Phone,
  Mail,
  MapPin,
  Sun
} from 'lucide-react';
import './LandingPage.css';
import { useAuthStore } from '../store/authStore';

const FacebookIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill={color} />
  </svg>
);

const RedStarIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#D92534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
  </svg>
);

interface LevelData {
  code: string;
  title: string;
  sub: string;
  desc: string;
  bullets: string[];
}

const LEVELS: Record<string, LevelData> = {
  A1: {
    code: 'A1',
    title: 'Nivel A1 — Principiante',
    sub: 'Descubrimiento del Idioma',
    desc: 'Aprendes las bases del idioma, saludos, presentaciones y situaciones cotidianas sencillas. Desarrollas confianza desde el primer día.',
    bullets: [
      'Presentación personal y expresión de gustos y necesidades básicas',
      'Comprensión de oraciones simples y vocabulario de la vida diaria',
      'Primeras conversaciones guiadas con profesores nativos'
    ]
  },
  A2: {
    code: 'A2',
    title: 'Nivel A2 — Básico',
    sub: 'Supervivencia y Rutina',
    desc: 'Logras desenvolverte en tareas simples de la vida diaria, hablar de tu entorno, comprar, viajar y expresar necesidades inmediatas.',
    bullets: [
      'Manejo fluido de intercambios sociales breves y compras',
      'Descripción de tu pasado, rutina diaria y planes futuros',
      'Lectura y comprensión de textos e instrucciones sencillas'
    ]
  },
  B1: {
    code: 'B1',
    title: 'Nivel B1 — Intermedio',
    sub: 'Autonomía en Francés',
    desc: 'Desarrollas autonomía en el idioma para viajar con soltura, opinar sobre temas conocidos, redactar cartas y narrar acontecimientos.',
    bullets: [
      'Desenvolverse con fluidez en viajes a países francófonos',
      'Expresión clara de opiniones, ambiciones y explicaciones de proyectos',
      'Comprensión de los puntos principales de noticias e historias'
    ]
  },
  B2: {
    code: 'B2',
    title: 'Nivel B2 — Intermedio Alto',
    sub: 'Fluidez y Argumentación Avanzada',
    desc: 'Logras expresarte de forma fluida y espontánea en francés con hablantes nativos. Comprendes ideas complejas de textos tanto concretos como abstractos.',
    bullets: [
      'Fluidez avanzada en debates y conversaciones complejas',
      'Preparación completa para certificación oficial DELF B2',
      'Redacción profesional y gramática avanzada aplicada'
    ]
  },
  C1: {
    code: 'C1',
    title: 'Nivel C1 — Avanzado',
    sub: 'Dominio Operativo Efectivo',
    desc: 'Expresión fluida, bien estructurada y espontánea sobre temas complejos sociales, académicos y profesionales con rico vocabulario.',
    bullets: [
      'Comprensión de una amplia variedad de textos extensos y exigentes',
      'Uso flexible del idioma para fines sociales, académicos y profesionales',
      'Redacción clara y estructurada sobre temas de alta complejidad'
    ]
  },
  C2: {
    code: 'C2',
    title: 'Nivel C2 — Dominio',
    sub: 'Maestría del Idioma',
    desc: 'Comprensión y precisión completa del idioma, equivalente a un hablante nativo culto en cualquier contexto comunicativo.',
    bullets: [
      'Reconstrucción de argumentos y relatos de diversas fuentes habladas o escritas',
      'Expresión espontánea, muy fluida y precisa con matices finos de significado',
      'Dominio absoluto de la cultura y modismos francófonos'
    ]
  }
};

export function LandingPage() {
  const { user } = useAuthStore();
  const [activeLevel, setActiveLevel] = useState<string>('B2');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadOrigin, setLeadOrigin] = useState('Clase de Prueba Gratis');
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const openLeadModal = (origin: string) => {
    setLeadOrigin(origin);
    setFormSubmitted(false);
    setLeadModalOpen(true);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setLeadModalOpen(false);
      setFormData({ name: '', email: '', phone: '' });
    }, 2500);
  };

  return (
    <div className="lrd-landing">
      {/* Top Announcement Bar */}
      <div className="lrd-top-bar">
        <div className="lrd-container lrd-top-bar-content">
          <div className="lrd-top-left">
            <RedStarIcon size={16} />
            <strong className="lrd-top-bold">¡Nueva plataforma de aprendizaje!</strong>
            <span className="lrd-top-divider">|</span>
            <span className="lrd-top-sub">Accede a tu cuenta y continúa aprendiendo.</span>
          </div>
          <div className="lrd-top-right">
            {user ? (
              <Link to="/" className="lrd-btn-top-account">
                <User size={14} /> ACCEDER A MI CUENTA
              </Link>
            ) : (
              <Link to="/login" className="lrd-btn-top-account">
                <User size={14} /> ACCEDER A MI CUENTA
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Navbar */}
      <header className="lrd-header">
        <div className="lrd-container lrd-nav-container">
          <Link to="/landing" className="lrd-brand-logo">
            <img
              src="/imagenes-lp/logo_official.webp"
              alt="Les Rois du Français"
              className="lrd-brand-logo-img"
              decoding="async"
            />
          </Link>

          <nav className="lrd-nav-menu">
            <ul className="lrd-nav-list">
              <li className="lrd-nav-item">
                <a href="#cursos" className="lrd-nav-link">
                  CURSOS <ChevronDown size={14} />
                </a>
                <ul className="lrd-dropdown-menu">
                  <li><a href="#cursos">Francés General</a></li>
                  <li><a href="#cursos">Conversación Intensiva</a></li>
                  <li><a href="#cursos">Preparación DELF / DALF</a></li>
                  <li><a href="#cursos">Clases Particulares</a></li>
                </ul>
              </li>
              <li className="lrd-nav-item">
                <a href="#precios" className="lrd-nav-link">PRECIOS Y HORARIOS</a>
              </li>
              <li className="lrd-nav-item">
                <a href="#metodo" className="lrd-nav-link">MÉTODO MRAF</a>
              </li>
              <li className="lrd-nav-item">
                <a href="#promos" className="lrd-nav-link">PROMOCIONES</a>
              </li>
              <li className="lrd-nav-item">
                <a href="#nosotros" className="lrd-nav-link">SOBRE NOSOTROS</a>
              </li>
              <li className="lrd-nav-item">
                <a href="#contacto" className="lrd-nav-link">CONTACTO</a>
              </li>
            </ul>
          </nav>

          <div className="lrd-nav-actions">
            <div className="lrd-social-icons">
              <a href="https://www.facebook.com/people/Les-Rois-du-Fran%C3%A7ais/61554418860885/" target="_blank" rel="noreferrer" className="lrd-social-icon" aria-label="Facebook">
                <FacebookIcon size={14} color="#092B6B" />
              </a>
              <a href="https://www.instagram.com/lesroisdufrancais?igsh=MTNxbWR1OHM1Z2h6dA==" target="_blank" rel="noreferrer" className="lrd-social-icon" aria-label="Instagram">
                <InstagramIcon size={14} color="#092B6B" />
              </a>
            </div>

            <button className="lrd-btn-cta-red" onClick={() => openLeadModal('Clase de Prueba Gratis')}>
              CLASE DE PRUEBA GRATIS
            </button>

            <button
              className="lrd-hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="lrd-hero-section" id="hero">
        <img
          src="/imagenes-lp/eiffel_tower_hero_full.webp"
          alt="Eiffel Tower Background"
          className="lrd-hero-bg-eiffel"
          decoding="async"
        />

        <div className="lrd-container lrd-hero-container">
          <div className="lrd-hero-content">
            <div className="lrd-crown-draw">
              <img src="/imagenes-lp/hero_crown_red.webp" alt="Corona Les Rois du Français" className="lrd-hero-crown-img" decoding="async" />
            </div>

            <h1 className="lrd-hero-title">
              Tu reinado del<br />francés en línea
            </h1>

            <div className="lrd-hero-subtitle">
              <p className="lrd-hero-sub1">
                El método <span className="lrd-highlight-mraf">MRAF®</span>.
              </p>
              <p className="lrd-hero-sub2">El método que te hace hablar francés.</p>
            </div>

            <div className="lrd-hero-buttons">
              <button className="lrd-btn-hero-red" onClick={() => openLeadModal('Comenzar Ahora')}>
                COMENZAR AHORA
              </button>
              <button className="lrd-btn-hero-video" onClick={() => setVideoModalOpen(true)}>
                <span className="lrd-play-circle"><Play size={12} fill="#0B2545" /></span> VER VIDEO
              </button>
            </div>

            <div className="lrd-hero-bullets">
              <span className="lrd-hero-bullet-item">
                <ShieldCheck className="lrd-bullet-icon" size={18} color="#FFFFFF" /> Sin compromiso
              </span>
              <span className="lrd-hero-bullet-item">
                <Globe className="lrd-bullet-icon" size={18} color="#FFFFFF" /> 100% online
              </span>
              <span className="lrd-hero-bullet-item">
                <User className="lrd-bullet-icon" size={18} color="#FFFFFF" /> Profesores nativos
              </span>
            </div>
          </div>

          <div className="lrd-hero-king-wrapper">
            <img
              src="/imagenes-lp/rey.webp"
              alt="El Rey de Les Rois du Français"
              className="lrd-king-img"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Stats Counter Bar Section */}
      <section className="lrd-stats-bar-section">
        <div className="lrd-container">
          <div className="lrd-stats-card">
            <div className="lrd-stat-col">
              <div className="lrd-stat-icon-wrap">
                <Crown size={24} />
              </div>
              <div className="lrd-stat-info">
                <span className="lrd-stat-val">20+</span>
                <span className="lrd-stat-lbl">AÑOS DE EXPERIENCIA</span>
              </div>
            </div>

            <div className="lrd-stat-col">
              <div className="lrd-stat-icon-wrap">
                <Users size={24} />
              </div>
              <div className="lrd-stat-info">
                <span className="lrd-stat-val">+1,000</span>
                <span className="lrd-stat-lbl">ALUMNOS FELICES</span>
              </div>
            </div>

            <div className="lrd-stat-col">
              <div className="lrd-stat-icon-wrap">
                <Play size={24} />
              </div>
              <div className="lrd-stat-info">
                <span className="lrd-stat-val">+150,000</span>
                <span className="lrd-stat-lbl">CLASES IMPARTIDAS ONLINE</span>
              </div>
            </div>

            <div className="lrd-stat-col">
              <div className="lrd-stat-icon-wrap">
                <Star size={24} />
              </div>
              <div className="lrd-stat-info">
                <span className="lrd-stat-val">4.9/5</span>
                <span className="lrd-stat-lbl">EN GOOGLE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Method MRAF® Section */}
      <section className="lrd-method-section" id="metodo">
        <div className="lrd-container">
          <div className="lrd-method-layout">
            <div className="lrd-method-left">
              <span className="lrd-tag-red">NUESTRO MÉTODO</span>
              <h2 className="lrd-mraf-main-logo">MRAF<sup>®</sup></h2>
              <p className="lrd-mraf-french-sub">
                Méthode Rapide d'Apprentissage<br />du Français
              </p>
            </div>

            <div className="lrd-mraf-grid">
              {/* M */}
              <div className="lrd-mraf-col">
                <div className="lrd-mraf-crown-wrap">
                  <img src="/imagenes-lp/crown_m.webp" alt="Corona M" className="lrd-mraf-crown-img" loading="lazy" decoding="async" />
                </div>
                <div className="lrd-mraf-letter">M</div>
                <h4 className="lrd-mraf-word">MÉTODO</h4>
                <p className="lrd-mraf-desc">
                  Metodología registrada basada en la práctica comunicativa y situaciones reales.
                </p>
              </div>

              {/* R */}
              <div className="lrd-mraf-col">
                <div className="lrd-mraf-crown-wrap">
                  <img src="/imagenes-lp/crown_r.webp" alt="Corona R" className="lrd-mraf-crown-img" loading="lazy" decoding="async" />
                </div>
                <div className="lrd-mraf-letter">R</div>
                <h4 className="lrd-mraf-word">RÁPIDO</h4>
                <p className="lrd-mraf-desc">
                  Empiezas a hablar desde la primera clase con un avance acelerado.
                </p>
              </div>

              {/* A */}
              <div className="lrd-mraf-col">
                <div className="lrd-mraf-crown-wrap">
                  <img src="/imagenes-lp/crown_a.webp" alt="Corona A" className="lrd-mraf-crown-img" loading="lazy" decoding="async" />
                </div>
                <div className="lrd-mraf-letter">A</div>
                <h4 className="lrd-mraf-word">APRENDIZAJE</h4>
                <p className="lrd-mraf-desc">
                  Desarrollas las 4 habilidades: hablar, escuchar, leer y escribir.
                </p>
              </div>

              {/* F */}
              <div className="lrd-mraf-col">
                <div className="lrd-mraf-crown-wrap">
                  <img src="/imagenes-lp/crown_f.webp" alt="Corona F" className="lrd-mraf-crown-img" loading="lazy" decoding="async" />
                </div>
                <div className="lrd-mraf-letter">F</div>
                <h4 className="lrd-mraf-word">FRANCÉS</h4>
                <p className="lrd-mraf-desc">
                  Francés auténtico con profesores nativos y cultura francesa en cada clase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing and Plans Section */}
      <section className="lrd-pricing-section" id="precios">
        <div className="lrd-container">
          <div className="lrd-section-header">
            <span className="lrd-tag-blue-uppercase">PLANES QUE SE ADAPTAN A TI</span>
            <h2 className="lrd-title-serif">Elige tu reinado</h2>
          </div>

          <div className="lrd-plans-grid">
            {/* 3 Meses */}
            <div className="lrd-plan-card">
              <div className="lrd-plan-num">3</div>
              <div className="lrd-plan-unit">MESES</div>
              <div className="lrd-plan-discount">15% DTO.</div>
              <p className="lrd-plan-schedule">
                En cualquier horario<br />(regular, intensivo o sabatino)
              </p>
            </div>

            {/* 6 Meses */}
            <div className="lrd-plan-card">
              <div className="lrd-plan-num">6</div>
              <div className="lrd-plan-unit">MESES</div>
              <div className="lrd-plan-discount">20% DTO.</div>
              <p className="lrd-plan-schedule">
                En cualquier horario<br />(regular, intensivo o sabatino)
              </p>
            </div>

            {/* 9 Meses */}
            <div className="lrd-plan-card">
              <div className="lrd-plan-num">9</div>
              <div className="lrd-plan-unit">MESES</div>
              <div className="lrd-plan-discount">25% DTO.</div>
              <p className="lrd-plan-schedule">
                En cualquier horario<br />(regular, intensivo o sabatino)
              </p>
            </div>

            {/* Summer Course */}
            <div className="lrd-plan-card summer-card" id="promos">
              <div className="lrd-summer-header-row">
                <h3 className="lrd-summer-title">CURSO DE<br />VERANO</h3>
                <Sun size={48} color="#FFFFFF" strokeWidth={2} className="lrd-summer-sun-icon" />
              </div>
              <div className="lrd-summer-sub">4 SEMANAS DE FRANCÉS</div>
              <p className="lrd-summer-text">Clases dinámicas, nativos y conversación real.</p>
              <button className="lrd-btn-summer-action" onClick={() => openLeadModal('Curso de Verano')}>
                VER PROMOS
              </button>
            </div>
          </div>

          <div className="lrd-text-center lrd-margin-top-40">
            <button className="lrd-btn-view-schedules" onClick={() => openLeadModal('Ver Precios y Horarios')}>
              <Calendar size={18} /> VER PRECIOS Y HORARIOS
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="lrd-why-section" id="nosotros">
        <div className="lrd-why-full-row">
          {/* Left Column: Title, 5 Icons, Comparison Table */}
          <div className="lrd-why-left-side">
            <div className="lrd-why-header-align-left">
              <span className="lrd-tag-blue-uppercase">¿POR QUÉ ELEGIR</span>
              <h2 className="lrd-why-title-red">LES ROIS DU FRANÇAIS?</h2>
            </div>

            {/* 5 Icons Row */}
            <div className="lrd-why-icons-grid">
              <div className="lrd-why-icon-item">
                <img src="/imagenes-lp/why_icon1.webp" alt="Método MRAF" className="lrd-why-icon-img" loading="lazy" decoding="async" />
                <span className="lrd-why-icon-label">Método MRAF®<br />único y efectivo</span>
              </div>
              <div className="lrd-why-icon-item">
                <img src="/imagenes-lp/why_icon2.webp" alt="Profesores nativos" className="lrd-why-icon-img" loading="lazy" decoding="async" />
                <span className="lrd-why-icon-label">Profesores nativos<br />y certificados</span>
              </div>
              <div className="lrd-why-icon-item">
                <img src="/imagenes-lp/why_icon3.webp" alt="Clases en vivo" className="lrd-why-icon-img" loading="lazy" decoding="async" />
                <span className="lrd-why-icon-label">Clases en vivo<br />100% online</span>
              </div>
              <div className="lrd-why-icon-item">
                <img src="/imagenes-lp/why_icon4.webp" alt="Cultura francesa" className="lrd-why-icon-img" loading="lazy" decoding="async" />
                <span className="lrd-why-icon-label">Cultura francesa<br />en cada clase</span>
              </div>
              <div className="lrd-why-icon-item">
                <img src="/imagenes-lp/why_icon5.webp" alt="Comunidad global" className="lrd-why-icon-img" loading="lazy" decoding="async" />
                <span className="lrd-why-icon-label">Comunidad global<br />de estudiantes</span>
              </div>
            </div>

            {/* Comparison Table Card */}
            <div className="lrd-vs-table-card">
              {/* Other Schools Column */}
              <div className="lrd-vs-col other-col">
                <div className="lrd-vs-pill-dark">OTRAS ESCUELAS</div>
                <ul className="lrd-vs-list">
                  <li><span className="lrd-icon-x">✕</span> Memorizar reglas y verbos por meses</li>
                  <li><span className="lrd-icon-x">✕</span> Poca práctica de conversación</li>
                  <li><span className="lrd-icon-x">✕</span> Grupos numerosos</li>
                  <li><span className="lrd-icon-x">✕</span> Clases aburridas y teóricas</li>
                </ul>
              </div>

              {/* VS Center Divider */}
              <div className="lrd-vs-divider-center">
                <img src="/imagenes-lp/blue_crown_vs.webp" alt="Corona VS" className="lrd-vs-crown-img" loading="lazy" decoding="async" />
                <span className="lrd-vs-text-blue">VS</span>
              </div>

              {/* Les Rois du Français Column */}
              <div className="lrd-vs-col rois-col">
                <div className="lrd-vs-pill-red">LES ROIS DU FRANÇAIS</div>
                <ul className="lrd-vs-list">
                  <li><span className="lrd-icon-check-circle">✓</span> Hablas desde la primera clase</li>
                  <li><span className="lrd-icon-check-circle">✓</span> Francés auténtico en situaciones reales</li>
                  <li><span className="lrd-icon-check-circle">✓</span> Grupos pequeños e interactivos</li>
                  <li><span className="lrd-icon-check-circle">✓</span> Clases dinámicas y divertidas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Banner Side (Full 50% split) */}
          <div className="lrd-why-right-side">
            <img
              src="/imagenes-lp/why_girl_banner.webp"
              alt="Aprender francés nunca ha sido tan divertido"
              className="lrd-why-girl-full"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Combined Levels & Testimonials Section */}
      <section className="lrd-combined-levels-testimonials-section" id="cursos">
        <div className="lrd-container lrd-combined-container">
          {/* Section Header */}
          <div className="lrd-section-header lrd-text-center">
            <span className="lrd-tag-blue">TODOS LOS NIVELES</span>
            <h2 className="lrd-title-serif lrd-title-blue">
              De principiante a <span className="lrd-text-red-serif">avanzado</span>
            </h2>
            <p className="lrd-subtitle-blue">Un camino claro para alcanzar tus metas</p>
          </div>

          {/* Levels Content Grid */}
          <div className="lrd-levels-content-grid">
            <div className="lrd-levels-image-col">
              <img
                src="/imagenes-lp/student_laptop.webp"
                alt="Estudiante en clase de francés en laptop"
                className="lrd-student-img"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="lrd-levels-tabs-col">
              {/* Level Selector Row */}
              <div className="lrd-level-selector-row">
                {[
                  { code: 'A1', label: 'Principiante' },
                  { code: 'A2', label: 'Básico' },
                  { code: 'B1', label: 'Intermedio' },
                  { code: 'B2', label: 'Intermedio alto' },
                  { code: 'C1', label: 'Avanzado' },
                  { code: 'C2', label: 'Dominio' }
                ].map((lvl) => (
                  <div
                    key={lvl.code}
                    className={`lrd-lvl-tab ${activeLevel === lvl.code ? 'active' : ''}`}
                    onClick={() => setActiveLevel(lvl.code)}
                  >
                    <span className="lrd-tab-code">{lvl.code}</span>
                    <span className="lrd-tab-label">{lvl.label}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="lrd-text-center lrd-margin-bottom-24">
                <button className="lrd-btn-program-outline" onClick={() => openLeadModal('Conoce nuestro programa')}>
                  <BookOpen className="lrd-blue-book-icon" size={18} /> CONOCE NUESTRO PROGRAMA
                </button>
              </div>

              {/* Expandable Level Info Details Box */}
              <div className="lrd-level-info-box">
                <h3>{LEVELS[activeLevel].title}</h3>
                <p>{LEVELS[activeLevel].desc}</p>
                <ul className="lrd-lvl-check-list">
                  {LEVELS[activeLevel].bullets.map((b, idx) => (
                    <li key={idx}>
                      <Check size={16} color="#D92534" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Testimonials and Free Guide */}
          <div className="lrd-testimonials-wrapper">
            <div className="lrd-section-header lrd-text-center lrd-margin-top-60">
              <span className="lrd-tag-blue-uppercase">LO QUE DICEN NUESTROS ALUMNOS</span>
            </div>

            <div className="lrd-testimonials-flex">
              {/* Free Ebook Promo Book Card */}
              <div className="lrd-ebook-card">
                <img src="/imagenes-lp/hero_crown_red.webp" alt="Corona" className="lrd-ebook-crown-img" loading="lazy" decoding="async" />
                <span className="lrd-ebook-tag">GUÍA GRATUITA</span>
                <div className="lrd-ebook-num">25</div>
                <div className="lrd-ebook-word">ERRORES</div>
                <p className="lrd-ebook-desc">QUE TE IMPIDEN HABLAR FRANCÉS (Y CÓMO EVITARLOS)</p>
                <button className="lrd-btn-download-red" onClick={() => openLeadModal('Descargar Guía 25 Errores')}>
                  DESCARGAR AHORA
                </button>
              </div>

              {/* Testimonials Grid */}
              <div className="lrd-testimonials-grid">
                <div className="lrd-testimonial-card">
                  <div className="lrd-quote-mark">“</div>
                  <p className="lrd-quote-body">
                    Gracias al método MRAF® en 3 meses ya podía mantener conversaciones reales. ¡Totalmente recomendado!
                  </p>
                  <div className="lrd-author-line">
                    <span>— Mariana G.</span> <img src="/imagenes-lp/flag_mx.svg" alt="México" className="lrd-flag-img" />
                  </div>
                </div>

                <div className="lrd-testimonial-card">
                  <div className="lrd-quote-mark">“</div>
                  <p className="lrd-quote-body">
                    Profesores increíbles y clases muy dinámicas. Aprender francés se volvió mi parte favorita del día.
                  </p>
                  <div className="lrd-author-line">
                    <span>— Carlos T.</span> <img src="/imagenes-lp/flag_es.svg" alt="España" className="lrd-flag-img" />
                  </div>
                </div>

                <div className="lrd-testimonial-card">
                  <div className="lrd-quote-mark">“</div>
                  <p className="lrd-quote-body">
                    La mejor escuela en línea. Flexibilidad, calidad y sobre todo, resultados comprobados.
                  </p>
                  <div className="lrd-author-line">
                    <span>— Sofía R.</span> <img src="/imagenes-lp/flag_ar.svg" alt="Argentina" className="lrd-flag-img" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lrd-dots-row">
              <span className="lrd-dot-item active"></span>
              <span className="lrd-dot-item"></span>
              <span className="lrd-dot-item"></span>
              <span className="lrd-dot-item"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lrd-footer" id="contacto">
        <div className="lrd-container lrd-footer-grid">
          <div className="lrd-footer-col-brand">
            <h4 className="lrd-footer-brand-title">Les Rois du Français</h4>
            <p className="lrd-footer-tagline">
              Te prometemos un aprendizaje estructurado, rápido y lleno de humor y conversaciones para este hermoso idioma.
            </p>
          </div>

          <div className="lrd-footer-col-contact">
            <h5 className="lrd-footer-col-title">CONTÁCTANOS</h5>
            <ul className="lrd-contact-list">
              <li>
                <Phone size={14} /> <a href="tel:2223437074">222 343 7074</a>
              </li>
              <li>
                <Mail size={14} /> <a href="mailto:info@lesroisdufrancais.com">info@lesroisdufrancais.com</a>
              </li>
              <li>
                <MapPin size={14} /> Puebla, México
              </li>
            </ul>
            <div className="lrd-footer-social-row">
              <a href="https://www.facebook.com/people/Les-Rois-du-Fran%C3%A7ais/61554418860885/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <FacebookIcon size={16} />
              </a>
              <a href="https://www.instagram.com/lesroisdufrancais?igsh=MTNxbWR1OHM1Z2h6dA==" target="_blank" rel="noreferrer" aria-label="Instagram">
                <InstagramIcon size={16} />
              </a>
              <a href="https://www.youtube.com/watch?v=T_uYP1uYkhE" target="_blank" rel="noreferrer" aria-label="YouTube">
                <YoutubeIcon size={16} />
              </a>
            </div>
          </div>

          <div className="lrd-footer-col-newsletter">
            <h5 className="lrd-footer-col-title">BOLETÍN</h5>
            <p className="lrd-newsletter-sub">Recibe promos exclusivas y tips para aprender francés.</p>
            <form className="lrd-newsletter-box" onSubmit={(e) => { e.preventDefault(); alert('¡Gracias por suscribirte!'); }}>
              <input type="email" placeholder="Tu correo electrónico" required />
              <button type="submit" aria-label="Enviar"><Send size={14} /></button>
            </form>
          </div>
        </div>

        <div className="lrd-footer-bottom">
          <div className="lrd-container lrd-bottom-flex">
            <span>© 2026 Les Rois du Français. Todos los derechos reservados.</span>
            <div className="lrd-legal-links">
              <a href="#contacto">Políticas de privacidad</a>
              <a href="#contacto">Términos y condiciones</a>
              <a href="#contacto">Aviso de privacidad</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://api.whatsapp.com/send?phone=522223437074&text=Hola!%20Me%20interesa%20informaci%C3%B3n"
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
          <div className="lrd-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="lrd-modal-close" onClick={() => setLeadModalOpen(false)}>&times;</button>
            <div className="lrd-lead-head">
              <Crown color="#F5A623" size={28} />
              <h3>Comienza Tu Reinado en Francés</h3>
              <p>Déjanos tus datos y un asesor se pondrá en contacto contigo.</p>
            </div>

            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#0F2C59', fontWeight: 'bold' }}>
                <Check size={48} color="#D92534" style={{ margin: '0 auto 10px' }} />
                <p>¡Gracias! Hemos recibido tus datos. Te contactaremos pronto por WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit}>
                <div className="lrd-input-group">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="lrd-input-group">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="lrd-input-group">
                  <label>Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="222 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <button type="submit" className="lrd-btn-submit-red">
                  SOLICITAR INFORMACIÓN ({leadOrigin})
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {videoModalOpen && (
        <div className="lrd-modal-backdrop" onClick={() => setVideoModalOpen(false)}>
          <div className="lrd-modal-card video-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="lrd-modal-close" style={{ color: '#fff', zIndex: 10 }} onClick={() => setVideoModalOpen(false)}>
              &times;
            </button>
            <div className="lrd-iframe-wrap">
              <iframe
                src="https://www.youtube.com/embed/T_uYP1uYkhE?autoplay=1"
                title="Video Promocional Les Rois du Français"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
