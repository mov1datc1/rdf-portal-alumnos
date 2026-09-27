import { useState, useEffect } from 'react';
import {
  Loader2,
  Save,
  Settings,
  Users,
  GraduationCap,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  Eye,
  ChevronRight,
  Crown,
  MapPin,
  UploadCloud,
  RotateCcw
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { showSuccess, showError } from '../../utils/alerts';
import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_TEACHERS,
  DEFAULT_LEVELS,
} from '../../constants/landingDefaults';

// Official default image lookup tables for instant restore / reset
const DEFAULT_HERO_SLIDE_IMAGES = [
  '/imagenes-lp/hero_slide_3.webp',
  '/imagenes-lp/rey.webp',
  '/imagenes-lp/hero_slide_1.webp',
  '/imagenes-lp/hero_slide_2.webp',
];

const DEFAULT_TEACHER_IMAGES: Record<string, string> = {
  'jean-luc': '/imagenes-lp/teacher_royal_jean_luc.webp',
  'sophie': '/imagenes-lp/teacher_royal_sophie.webp',
  'pierre': '/imagenes-lp/teacher_royal_pierre.webp',
};

const DEFAULT_LEVEL_CHAR_IMAGES: Record<string, string> = {
  A1: '/imagenes-lp/estudiante_con_portatil_y_auriculares.webp',
  A2: '/imagenes-lp/estudiante_sonriente_con_mochila_y_cuadernos.webp',
  'A2+': '/imagenes-lp/estudiante_celebrando_frente_al_portatil.webp',
  B1: '/imagenes-lp/joven_conversando_con_portatil_y_cuaderno.webp',
  'B1+': '/imagenes-lp/profesora_remota_explicando_ante_su_portatil.webp',
  B2: '/imagenes-lp/hombre_estudiando_con_portatil_y_libros.webp',
  'B2-C1': '/imagenes-lp/estudiante_conversacion_perfeccionamiento_b2_c1.webp',
};

// Preset options for easy selection in admin
const HERO_IMAGE_PRESETS = [
  { label: 'Rey Oficial con Corona', value: '/imagenes-lp/rey.webp' },
  { label: 'Reina con Corona (Slide 1)', value: '/imagenes-lp/hero_slide_1.webp' },
  { label: 'Estudiante Celular (Slide 2)', value: '/imagenes-lp/hero_slide_2.webp' },
  { label: 'Comunidad Les Rois (Slide 3)', value: '/imagenes-lp/hero_slide_3.webp' },
  { label: 'Rey Versailles Grabado', value: '/imagenes-lp/hero_clean_versailles_king.webp' },
  { label: 'Rey Traje Rojo Royal', value: '/imagenes-lp/king_royal_red.webp' },
];

const TEACHER_IMAGE_PRESETS = [
  { label: 'Prof. Jean-Luc (París)', value: '/imagenes-lp/teacher_royal_jean_luc.webp' },
  { label: 'Prof. Sophie (Lyon)', value: '/imagenes-lp/teacher_royal_sophie.webp' },
  { label: 'Prof. Pierre (Burdeos)', value: '/imagenes-lp/teacher_royal_pierre.webp' },
];

const LEVEL_CHAR_PRESETS = [
  { label: 'Chica con Audífonos y Laptop (A1)', value: '/imagenes-lp/estudiante_con_portatil_y_auriculares.webp' },
  { label: 'Chico con Mochila y Cuadernos (A2)', value: '/imagenes-lp/estudiante_sonriente_con_mochila_y_cuadernos.webp' },
  { label: 'Joven con Camisa Verde y Cuaderno (A2+)', value: '/imagenes-lp/estudiante_celebrando_frente_al_portatil.webp' },
  { label: 'Joven con Camisa Azul y Laptop (B1)', value: '/imagenes-lp/joven_conversando_con_portatil_y_cuaderno.webp' },
  { label: 'Profesora con Blazer Beige (B1+)', value: '/imagenes-lp/profesora_remota_explicando_ante_su_portatil.webp' },
  { label: 'Hombre Maduro con Lentes y Libros (B2)', value: '/imagenes-lp/hombre_estudiando_con_portatil_y_libros.webp' },
];

const BULLET_ICON_OPTIONS = [
  { label: '💬 Chat / Conversación', value: 'chat' },
  { label: '🏆 Trofeo / Logro', value: 'trophy' },
  { label: '📖 Libro / Estudio', value: 'book' },
  { label: '👥 Personas / Inmersión', value: 'people' },
];

export function SettingsManager() {
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'teachers' | 'levels'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Helper to read cached settings synchronously so there is 0ms flash of defaults
  const getInitialCachedSettings = () => {
    try {
      const cached = localStorage.getItem('rdf_saved_settings_cache');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return null;
  };
  const cachedInitial = getInitialCachedSettings();

  // Form State
  const [schoolName, setSchoolName] = useState(cachedInitial?.schoolName || 'Les Rois du Français');
  const [googleAdsBudget, setGoogleAdsBudget] = useState(cachedInitial?.googleAdsBudget ?? 10000);
  const [metaAdsBudget, setMetaAdsBudget] = useState(cachedInitial?.metaAdsBudget ?? 3000);
  const [heroSlides, setHeroSlides] = useState<any[]>(() => {
    if (cachedInitial?.heroSlides && Array.isArray(cachedInitial.heroSlides) && cachedInitial.heroSlides.length > 0) {
      return cachedInitial.heroSlides.map((s: any, idx: number) => ({
        ...(DEFAULT_HERO_SLIDES[idx] || {}),
        ...s
      }));
    }
    return DEFAULT_HERO_SLIDES;
  });
  const [teachers, setTeachers] = useState<any[]>(() => {
    if (cachedInitial?.teachers && Array.isArray(cachedInitial.teachers) && cachedInitial.teachers.length > 0) {
      return cachedInitial.teachers.map((t: any, idx: number) => ({
        ...(DEFAULT_TEACHERS[idx] || {}),
        ...t
      }));
    }
    return DEFAULT_TEACHERS;
  });
  const [levelsData, setLevelsData] = useState<Record<string, any>>(() => {
    if (cachedInitial?.levelsData && typeof cachedInitial.levelsData === 'object' && Object.keys(cachedInitial.levelsData).length > 0) {
      const merged: Record<string, any> = { ...DEFAULT_LEVELS };
      Object.keys(DEFAULT_LEVELS).forEach(lvlKey => {
        if (cachedInitial.levelsData[lvlKey]) {
          merged[lvlKey] = { ...DEFAULT_LEVELS[lvlKey], ...cachedInitial.levelsData[lvlKey] };
        }
      });
      return merged;
    }
    return DEFAULT_LEVELS;
  });

  // Persistent Custom Images Memory (Permanent memory of user's uploaded custom photos)
  const [customTeacherImages, setCustomTeacherImages] = useState<Record<string, string>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rdf_custom_teacher_images') || '{}');
      DEFAULT_TEACHERS.forEach(dt => {
        const currentT = cachedInitial?.teachers?.find((t: any) => t.id === dt.id);
        if (currentT?.image && currentT.image !== DEFAULT_TEACHER_IMAGES[dt.id]) {
          saved[dt.id] = currentT.image;
        }
      });
      return saved;
    } catch {
      return {};
    }
  });

  const [customHeroImages, setCustomHeroImages] = useState<Record<number, string>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rdf_custom_hero_images') || '{}');
      DEFAULT_HERO_SLIDE_IMAGES.forEach((defSrc, idx) => {
        const slide = cachedInitial?.heroSlides?.[idx];
        if (slide?.src && slide.src !== defSrc) {
          saved[idx] = slide.src;
        }
      });
      return saved;
    } catch {
      return {};
    }
  });

  const [customLevelImages, setCustomLevelImages] = useState<Record<string, string>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rdf_custom_level_images') || '{}');
      Object.keys(DEFAULT_LEVEL_CHAR_IMAGES).forEach(key => {
        const lvl = cachedInitial?.levelsData?.[key];
        if (lvl?.characterImage && lvl.characterImage !== DEFAULT_LEVEL_CHAR_IMAGES[key]) {
          saved[key] = lvl.characterImage;
        }
      });
      return saved;
    } catch {
      return {};
    }
  });

  // History memory for instant undo / revert to immediate previous image
  const [previousHeroImages, setPreviousHeroImages] = useState<Record<number, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('rdf_previous_hero_images') || '{}');
    } catch {
      return {};
    }
  });
  const [previousTeacherImages, setPreviousTeacherImages] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('rdf_previous_teacher_images') || '{}');
    } catch {
      return {};
    }
  });
  const [previousLevelImages, setPreviousLevelImages] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('rdf_previous_level_images') || '{}');
    } catch {
      return {};
    }
  });

  // Sub-selection states
  const [selectedTeacherIndex, setSelectedTeacherIndex] = useState<number>(0);
  const [selectedLevelKey, setSelectedLevelKey] = useState<string>('A1');
  const [previewLevelTab, setPreviewLevelTab] = useState<'competencias' | 'enfoque'>('competencias');

  // Preload all default assets into browser cache for instant 0ms tab switching
  useEffect(() => {
    DEFAULT_HERO_SLIDE_IMAGES.forEach(src => { const img = new Image(); img.src = src; });
    Object.values(DEFAULT_TEACHER_IMAGES).forEach(src => { const img = new Image(); img.src = src; });
    Object.values(DEFAULT_LEVEL_CHAR_IMAGES).forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  const session = useAuthStore(state => state.session);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const headers = {
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json'
  };

  const [savedSnapshot, setSavedSnapshot] = useState<any>(cachedInitial);

  // Fetch initial settings with Supabase-first priority and 0ms cache backing
  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      try {
        let data: any = null;

        // 1. Supabase directo (prioridad #1 absoluta: ~50ms, disponible 24/7 y fuente de verdad)
        try {
          const { data: sbData, error: sbErr } = await supabase
            .from('AppSettings')
            .select('*')
            .eq('id', 'global')
            .maybeSingle();
          if (!sbErr && sbData && typeof sbData === 'object' && !sbData.statusCode) {
            data = sbData;
          }
        } catch (_) {}

        // 2. Fallback backend admin o landing-config con timeout rápido si Supabase no respondió
        if (!data || data.statusCode) {
          try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 2000);
            const pubRes = await fetch(`${apiUrl}/landing-config?t=${Date.now()}`, {
              signal: controller.signal,
              headers: { 'Cache-Control': 'no-cache' }
            });
            clearTimeout(timer);
            if (pubRes.ok) {
              const pubJson = await pubRes.json();
              if (pubJson && !pubJson.statusCode) {
                data = pubJson;
              }
            }
          } catch (_) {}
        }

        // 3. Fallback a endpoint autenticado admin con timeout rápido
        if ((!data || data.statusCode) && session?.access_token) {
          try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`${apiUrl}/admin/settings`, { headers, signal: controller.signal });
            clearTimeout(timer);
            if (res.ok) {
              const resJson = await res.json();
              if (resJson && !resJson.statusCode) {
                data = resJson;
              }
            }
          } catch (_) {}
        }

        // 4. Si la red falló, recurrir al cache de localStorage
        if (!data || data.statusCode) {
          const cached = getInitialCachedSettings();
          if (cached) data = cached;
        }

        if (isMounted && data && typeof data === 'object' && !data.statusCode) {
          if (data.schoolName) setSchoolName(data.schoolName);
          if (data.googleAdsBudget != null) setGoogleAdsBudget(data.googleAdsBudget);
          if (data.metaAdsBudget != null) setMetaAdsBudget(data.metaAdsBudget);

          // Combinar con defaults para garantizar que ningún campo quede vacío o roto
          if (Array.isArray(data.heroSlides) && data.heroSlides.length > 0) {
            const mergedSlides = data.heroSlides.map((s: any, idx: number) => ({
              ...(DEFAULT_HERO_SLIDES[idx] || {}),
              ...s
            }));
            setHeroSlides(mergedSlides);
            setCustomHeroImages(prev => {
              const next = { ...prev };
              mergedSlides.forEach((s: any, idx: number) => {
                if (s.src && s.src !== DEFAULT_HERO_SLIDE_IMAGES[idx]) {
                  next[idx] = s.src;
                }
              });
              try { localStorage.setItem('rdf_custom_hero_images', JSON.stringify(next)); } catch (_) {}
              return next;
            });
          }

          if (Array.isArray(data.teachers) && data.teachers.length > 0) {
            const mergedTeachers = data.teachers.map((t: any, idx: number) => ({
              ...(DEFAULT_TEACHERS[idx] || {}),
              ...t
            }));
            setTeachers(mergedTeachers);
            setCustomTeacherImages(prev => {
              const next = { ...prev };
              mergedTeachers.forEach((t: any) => {
                if (t.id && t.image && t.image !== DEFAULT_TEACHER_IMAGES[t.id]) {
                  next[t.id] = t.image;
                }
              });
              try { localStorage.setItem('rdf_custom_teacher_images', JSON.stringify(next)); } catch (_) {}
              return next;
            });
          }

          if (data.levelsData && typeof data.levelsData === 'object' && Object.keys(data.levelsData).length > 0) {
            const mergedLevels: Record<string, any> = { ...DEFAULT_LEVELS };
            Object.keys(DEFAULT_LEVELS).forEach(lvlKey => {
              if (data.levelsData[lvlKey]) {
                mergedLevels[lvlKey] = {
                  ...DEFAULT_LEVELS[lvlKey],
                  ...data.levelsData[lvlKey]
                };
              }
            });
            setLevelsData(mergedLevels);
            setCustomLevelImages(prev => {
              const next = { ...prev };
              Object.keys(mergedLevels).forEach(lvlKey => {
                const img = mergedLevels[lvlKey]?.characterImage;
                if (img && img !== DEFAULT_LEVEL_CHAR_IMAGES[lvlKey]) {
                  next[lvlKey] = img;
                }
              });
              try { localStorage.setItem('rdf_custom_level_images', JSON.stringify(next)); } catch (_) {}
              return next;
            });
          }

          setSavedSnapshot(JSON.parse(JSON.stringify(data)));
          try {
            localStorage.setItem('rdf_saved_settings_cache', JSON.stringify(data));
          } catch (_) {}
        } else if (isMounted && !cachedInitial) {
          // Solo usar fábrica si es la primera vez absoluta y no hay nada en cache
          setSchoolName('Les Rois du Français');
          setGoogleAdsBudget(10000);
          setMetaAdsBudget(3000);
          setHeroSlides(DEFAULT_HERO_SLIDES);
          setTeachers(DEFAULT_TEACHERS);
          setLevelsData(DEFAULT_LEVELS);
          setSavedSnapshot({
            schoolName: 'Les Rois du Français',
            googleAdsBudget: 10000,
            metaAdsBudget: 3000,
            heroSlides: DEFAULT_HERO_SLIDES,
            teachers: DEFAULT_TEACHERS,
            levelsData: DEFAULT_LEVELS,
          });
        }
      } catch (err) {
        console.warn('Error loading settings, keeping cache:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSettings();

    // Sincronización en tiempo real entre pestañas y al volver a enfocar la ventana
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'rdf_landing_config_updated') {
        loadSettings();
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', loadSettings);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', loadSettings);
    };
  }, []);

  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  // Cache of instant base64 data for uploaded URLs to guarantee 0ms preview without 404 delays
  const [previewOverrides, setPreviewOverrides] = useState<Record<string, string>>({});

  const getImageSrc = (url?: string, fallback = '') => {
    if (!url) return fallback;
    if (previewOverrides[url]) return previewOverrides[url];
    try {
      const cached = sessionStorage.getItem('rdf_preview_' + url);
      if (cached) return cached;
    } catch (_) {}
    return url;
  };

  const handleImageError = (fallbackOrEvent?: string | React.SyntheticEvent<HTMLImageElement>, explicitFallback = '') => {
    if (fallbackOrEvent && typeof fallbackOrEvent === 'object' && 'currentTarget' in fallbackOrEvent) {
      const e = fallbackOrEvent as React.SyntheticEvent<HTMLImageElement>;
      const img = e.currentTarget;
      if (!img.dataset.hasFailed) {
        img.dataset.hasFailed = 'true';
        if (explicitFallback && img.src !== explicitFallback) {
          img.src = explicitFallback;
        }
      }
      return;
    }
    const fallbackUrl = typeof fallbackOrEvent === 'string' ? fallbackOrEvent : explicitFallback;
    return (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (!img.dataset.hasFailed) {
        img.dataset.hasFailed = 'true';
        if (fallbackUrl && img.src !== fallbackUrl) {
          img.src = fallbackUrl;
        }
      }
    };
  };

  const markDirty = () => {
    setHasUnsavedChanges(true);
  };

  // Revert all unsaved changes to saved state
  const revertAllUnsavedChanges = () => {
    if (!savedSnapshot) return;
    setSchoolName(savedSnapshot.schoolName || 'Les Rois du Français');
    setGoogleAdsBudget(savedSnapshot.googleAdsBudget ?? 10000);
    setMetaAdsBudget(savedSnapshot.metaAdsBudget ?? 3000);
    if (savedSnapshot.heroSlides) setHeroSlides(JSON.parse(JSON.stringify(savedSnapshot.heroSlides)));
    if (savedSnapshot.teachers) setTeachers(JSON.parse(JSON.stringify(savedSnapshot.teachers)));
    if (savedSnapshot.levelsData) setLevelsData(JSON.parse(JSON.stringify(savedSnapshot.levelsData)));
    setHasUnsavedChanges(false);
    showSuccess('Cambios revertidos', 'Se cancelaron todos los cambios y se volvió a como estaba.');
  };

  // Listen for Ctrl+Z keyboard shortcut when not typing inside input/textarea
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          if (hasUnsavedChanges && savedSnapshot) {
            e.preventDefault();
            revertAllUnsavedChanges();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, savedSnapshot]);

  // Helper to compress and convert images to WebP client-side before upload
  const compressImageForWeb = (file: File, maxDim = 1200, quality = 0.85): Promise<{ base64: string; filename: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Error al procesar la imagen'));
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve({ base64: reader.result as string, filename: file.name });
          }

          ctx.drawImage(img, 0, 0, width, height);

          const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');

          try {
            const webpData = canvas.toDataURL('image/webp', quality);
            if (webpData.startsWith('data:image/webp')) {
              return resolve({
                base64: webpData,
                filename: `${baseName}.webp`,
              });
            }
          } catch (_) {}

          const jpegData = canvas.toDataURL('image/jpeg', quality);
          resolve({
            base64: jpegData,
            filename: `${baseName}.jpg`,
          });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Helper to trigger native file dialog and upload image from PC with automatic WebP optimization
  const handleUploadFromPC = (targetLabel: string, onSuccess: (url: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showError('Formato no válido', 'Por favor selecciona un archivo de imagen (PNG, JPG, WEBP, etc.)');
        return;
      }

      setUploadingTarget(targetLabel);
      try {
        const { base64, filename } = await compressImageForWeb(file, 1200, 0.85);

        try {
          const res = await fetch(`${apiUrl}/admin/upload-image`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              filename,
              base64,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            setPreviewOverrides(prev => ({
              ...prev,
              [data.url]: base64,
            }));
            try {
              sessionStorage.setItem('rdf_preview_' + data.url, base64);
            } catch (_) {}
            onSuccess(data.url);
            showSuccess('¡Imagen cargada!', `Se optimizó a WebP y se actualizó la vista previa. Haz clic en "Guardar Configuración" para aplicar.`);
            markDirty();
          } else {
            // Fallback directo a base64 para garantizar preview 100% inmediata
            setPreviewOverrides(prev => ({
              ...prev,
              [base64]: base64,
            }));
            onSuccess(base64);
            showSuccess('¡Imagen cargada!', `Se actualizó la foto en la vista previa. Haz clic en "Guardar Configuración" para aplicar.`);
            markDirty();
          }
        } catch (err) {
          setPreviewOverrides(prev => ({
            ...prev,
            [base64]: base64,
          }));
          onSuccess(base64);
          showSuccess('¡Imagen cargada!', `Se actualizó la foto en la vista previa. Haz clic en "Guardar Configuración" para aplicar.`);
          markDirty();
        } finally {
          setUploadingTarget(null);
        }
      } catch (err) {
        setUploadingTarget(null);
        showError('Error', 'No se pudo leer ni optimizar el archivo de imagen.');
      }
    };
    input.click();
  };

  // Restore all Hero slides to official factory defaults
  const restoreAllHeroToDefault = () => {
    heroSlides.forEach((s, idx) => {
      if (s.src && s.src !== DEFAULT_HERO_SLIDE_IMAGES[idx]) {
        setCustomHeroImages(prev => {
          const next = { ...prev, [idx]: s.src };
          try { localStorage.setItem('rdf_custom_hero_images', JSON.stringify(next)); } catch (_) {}
          return next;
        });
      }
    });
    setHeroSlides(JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES)));
    markDirty();
    showSuccess('Hero restaurado', 'Se restablecieron las 4 diapositivas a las imágenes oficiales. Haz clic en "Guardar" para aplicar.');
  };

  // Restore all Teachers to official factory defaults
  const restoreAllTeachersToDefault = () => {
    teachers.forEach(t => {
      const teacherId = t.id;
      if (t.image && t.image !== DEFAULT_TEACHER_IMAGES[teacherId]) {
        setCustomTeacherImages(prev => {
          const next = { ...prev, [teacherId]: t.image };
          try { localStorage.setItem('rdf_custom_teacher_images', JSON.stringify(next)); } catch (_) {}
          return next;
        });
      }
    });
    setTeachers(JSON.parse(JSON.stringify(DEFAULT_TEACHERS)));
    markDirty();
    showSuccess('Profesores restaurados', 'Se restablecieron las fotos de todos los profesores a las oficiales. Haz clic en "Guardar" para aplicar.');
  };

  // Restore all Level characters to official factory defaults
  const restoreAllLevelsToDefault = () => {
    Object.keys(levelsData).forEach(lvlKey => {
      const img = levelsData[lvlKey]?.characterImage;
      if (img && img !== DEFAULT_LEVEL_CHAR_IMAGES[lvlKey]) {
        setCustomLevelImages(prev => {
          const next = { ...prev, [lvlKey]: img };
          try { localStorage.setItem('rdf_custom_level_images', JSON.stringify(next)); } catch (_) {}
          return next;
        });
      }
    });
    setLevelsData(JSON.parse(JSON.stringify(DEFAULT_LEVELS)));
    markDirty();
    showSuccess('Niveles restaurados', 'Se restablecieron los personajes de todos los niveles a las siluetas oficiales. Haz clic en "Guardar" para aplicar.');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        schoolName,
        googleAdsBudget: Number(googleAdsBudget),
        metaAdsBudget: Number(metaAdsBudget),
        heroSlides,
        teachers,
        levelsData,
      };

      let saved = false;

      // 1. Intentar endpoint autenticado en backend
      try {
        const res = await fetch(`${apiUrl}/admin/settings`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          saved = true;
        }
      } catch (_) {}

      // 2. Fallback resiliente directo a Supabase si el backend no responde (ej. deploy en Vercel)
      if (!saved) {
        try {
          const { error } = await supabase
            .from('AppSettings')
            .upsert({
              id: 'global',
              ...payload,
              updatedAt: new Date().toISOString()
            });
          if (!error) {
            saved = true;
          }
        } catch (_) {}
      }

      if (saved) {
        showSuccess('¡Configuración guardada!', 'Los cambios se han sincronizado en la base de datos y en la Landing Page pública.');
        setSavedSnapshot(JSON.parse(JSON.stringify(payload)));
        setHasUnsavedChanges(false);
        try {
          localStorage.setItem('rdf_saved_settings_cache', JSON.stringify(payload));
          localStorage.setItem('rdf_landing_config_updated', String(Date.now()));
        } catch {
          // ignore
        }
      } else {
        showError('Error al guardar', 'No se pudo sincronizar la configuración con el servidor ni con la base de datos.');
      }
    } catch (e) {
      showError('Error de conexión', 'No se pudo conectar con el servidor.');
    } finally {
      setSaving(false);
    }
  };

  // ── Hero Slide Handlers ──
  const handleHeroSlideChange = (index: number, field: string, value: any) => {
    if (field === 'src') {
      const currentSrc = heroSlides[index]?.src || DEFAULT_HERO_SLIDE_IMAGES[index];
      if (currentSrc && currentSrc !== value) {
        setPreviousHeroImages(prev => {
          const next = { ...prev, [index]: currentSrc };
          try { localStorage.setItem('rdf_previous_hero_images', JSON.stringify(next)); } catch (_) {}
          return next;
        });
      }
      if (value && value !== DEFAULT_HERO_SLIDE_IMAGES[index]) {
        setCustomHeroImages(prev => {
          const next = { ...prev, [index]: value };
          try { localStorage.setItem('rdf_custom_hero_images', JSON.stringify(next)); } catch (_) {}
          return next;
        });
      }
    }
    const updated = [...heroSlides];
    updated[index] = { ...(DEFAULT_HERO_SLIDES[index] || {}), ...updated[index], [field]: value };
    setHeroSlides(updated);
    markDirty();
  };

  // ── Teacher Handlers ──
  const handleTeacherChange = (index: number, field: string, value: any) => {
    const teacherId = teachers[index]?.id || DEFAULT_TEACHERS[index]?.id;
    if (field === 'image' && teacherId) {
      const currentImg = teachers[index]?.image || DEFAULT_TEACHERS[index]?.image;
      if (currentImg && currentImg !== value) {
        setPreviousTeacherImages(prev => {
          const next = { ...prev, [teacherId]: currentImg };
          try { localStorage.setItem('rdf_previous_teacher_images', JSON.stringify(next)); } catch (_) {}
          return next;
        });
      }
      if (value && value !== DEFAULT_TEACHER_IMAGES[teacherId]) {
        setCustomTeacherImages(prev => {
          const next = { ...prev, [teacherId]: value };
          try { localStorage.setItem('rdf_custom_teacher_images', JSON.stringify(next)); } catch (_) {}
          return next;
        });
      }
    }
    const updated = [...teachers];
    updated[index] = {
      ...(DEFAULT_TEACHERS[index] || {}),
      ...updated[index],
      [field]: value
    };
    setTeachers(updated);
    markDirty();
  };

  const handleTeacherBulletChange = (teacherIndex: number, bulletIndex: number, value: string) => {
    const updated = [...teachers];
    const newBullets = [...(updated[teacherIndex].bullets || [])];
    newBullets[bulletIndex] = value;
    updated[teacherIndex] = { ...updated[teacherIndex], bullets: newBullets };
    setTeachers(updated);
    markDirty();
  };

  const handleAddTeacherBullet = (teacherIndex: number) => {
    const updated = [...teachers];
    const newBullets = [...(updated[teacherIndex].bullets || []), 'Nuevo beneficio personalizado'];
    updated[teacherIndex] = { ...updated[teacherIndex], bullets: newBullets };
    setTeachers(updated);
    markDirty();
  };

  const handleRemoveTeacherBullet = (teacherIndex: number, bulletIndex: number) => {
    const updated = [...teachers];
    const newBullets = (updated[teacherIndex].bullets || []).filter((_: any, idx: number) => idx !== bulletIndex);
    updated[teacherIndex] = { ...updated[teacherIndex], bullets: newBullets };
    setTeachers(updated);
    markDirty();
  };

  // ── Level Handlers ──
  const handleLevelChange = (lvlKey: string, field: string, value: any) => {
    if (field === 'characterImage') {
      const currentImg = levelsData[lvlKey]?.characterImage || DEFAULT_LEVELS[lvlKey]?.characterImage;
      if (currentImg && currentImg !== value) {
        setPreviousLevelImages(prev => {
          const next = { ...prev, [lvlKey]: currentImg };
          try { localStorage.setItem('rdf_previous_level_images', JSON.stringify(next)); } catch (_) {}
          return next;
        });
      }
      if (value && value !== DEFAULT_LEVEL_CHAR_IMAGES[lvlKey]) {
        setCustomLevelImages(prev => {
          const next = { ...prev, [lvlKey]: value };
          try { localStorage.setItem('rdf_custom_level_images', JSON.stringify(next)); } catch (_) {}
          return next;
        });
      }
    }
    setLevelsData(prev => ({
      ...prev,
      [lvlKey]: {
        ...(DEFAULT_LEVELS[lvlKey] || {}),
        ...prev[lvlKey],
        [field]: value
      }
    }));
    markDirty();
  };

  const handleLevelBulletChange = (lvlKey: string, bulletIndex: number, field: 'icon' | 'text', value: string) => {
    const currentLvl = levelsData[lvlKey] || {};
    const updatedBullets = [...(currentLvl.bullets || [])];
    if (updatedBullets[bulletIndex]) {
      updatedBullets[bulletIndex] = { ...updatedBullets[bulletIndex], [field]: value };
      handleLevelChange(lvlKey, 'bullets', updatedBullets);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#1D3A8A]" />
        <p className="text-sm font-semibold text-slate-500">Cargando configuración del portal...</p>
      </div>
    );
  }

  const currentTeacher = {
    ...(DEFAULT_TEACHERS[selectedTeacherIndex] || DEFAULT_TEACHERS[0] || {}),
    ...(teachers[selectedTeacherIndex] || teachers[0] || {})
  };
  const currentLevel = {
    ...(DEFAULT_LEVELS[selectedLevelKey] || {}),
    ...(levelsData[selectedLevelKey] || {})
  };

  return (
    <div className="space-y-6 max-w-6xl pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#1D3A8A] text-white text-xs font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
              Control Center
            </span>
            {hasUnsavedChanges && (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-amber-300">
                ⚠️ Cambios sin guardar
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-[#001B50] tracking-tight mt-1 flex items-center gap-2">
            Configuración del Portal & Landing
          </h1>
          <p className="text-slate-500 text-sm">
            Edita en vivo textos, imágenes y presupuestos visibles en la Landing Page pública y en el sistema.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold shadow-sm transition-all"
          >
            <Eye className="w-4 h-4 text-slate-500" /> Ver Landing en Vivo
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={revertAllUnsavedChanges}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-bold shadow-sm transition-all"
              title="Descartar cambios y volver a como estaba (Ctrl+Z)"
            >
              <RotateCcw className="w-4 h-4" /> Deshacer (Ctrl+Z)
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-white shadow-md transition-all ${
              hasUnsavedChanges
                ? 'bg-[#1D3A8A] hover:bg-blue-900 ring-4 ring-blue-200 shadow-blue-500/20'
                : 'bg-[#1D3A8A] hover:bg-blue-900 opacity-90'
            } disabled:opacity-50`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100/60 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'general'
              ? 'bg-white text-[#1D3A8A] shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Settings className="w-4 h-4" /> General & Presupuestos
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'hero'
              ? 'bg-white text-[#1D3A8A] shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Crown className="w-4 h-4 text-[#D59B28]" /> Hero Slideshow (4 Imágenes)
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'teachers'
              ? 'bg-white text-[#1D3A8A] shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Users className="w-4 h-4 text-rose-600" /> Profesores Reales (3)
        </button>

        <button
          onClick={() => setActiveTab('levels')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'levels'
              ? 'bg-white text-[#1D3A8A] shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-[#1D3A8A]" /> Niveles & Personajes (A1 - B2)
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: GENERAL & ADS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6 max-w-3xl">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#1D3A8A]" /> Datos Generales de la Escuela
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identidad base del portal administrativo y cálculo de rentabilidad del CRM.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Nombre de la Institución</label>
            <input
              type="text"
              value={schoolName}
              onChange={e => { setSchoolName(e.target.value); markDirty(); }}
              className="w-full border border-slate-200 rounded-xl py-2.5 px-3.5 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
            />
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
              💰 Presupuestos Publicitarios Mensuales (MXN)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Estos presupuestos se dividen automáticamente entre los prospectos captados para mostrar el Costo por Lead (CPL) en el CRM.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Presupuesto Google Ads
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min={0}
                    value={googleAdsBudget}
                    onChange={e => { setGoogleAdsBudget(Number(e.target.value)); markDirty(); }}
                    className="w-full border border-slate-200 rounded-xl py-2 pl-8 pr-3.5 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Presupuesto Meta Ads (FB & IG)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min={0}
                    value={metaAdsBudget}
                    onChange={e => { setMetaAdsBudget(Number(e.target.value)); markDirty(); }}
                    className="w-full border border-slate-200 rounded-xl py-2 pl-8 pr-3.5 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: HERO SLIDESHOW (4 IMÁGENES)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-5 flex items-start gap-3">
            <Crown className="w-6 h-6 text-[#1D3A8A] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-black text-[#001B50]">
                Carrusel Principal de Bienvenida (Hero Section)
              </h3>
              <p className="text-xs text-slate-600">
                La Landing Page rota estas 4 imágenes automáticamente cada 5 segundos con un efecto suave de fundido cruzado (*cross-fade*). Puedes cambiar la imagen, la descripción SEO (*alt text*) o desactivar temporalmente alguna diapositiva.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-3 py-1.5 rounded-lg border border-amber-300">
                  🛡️ <b>Prueba con tranquilidad:</b> Sube cualquier imagen y dale Guardar para verla en la Landing. Siempre puedes pulsar <b>"Restaurar fotos de fábrica"</b> o <b>Ctrl+Z</b> para regresar a como estaba.
                </span>
                {heroSlides.some((s, i) => s.src !== DEFAULT_HERO_SLIDE_IMAGES[i]) && (
                  <button
                    type="button"
                    onClick={restoreAllHeroToDefault}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-xs border border-amber-300 shadow-xs transition-all cursor-pointer"
                    title="Restablecer las 4 diapositivas a las imágenes originales de fábrica"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restaurar las 4 fotos oficiales de fábrica
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 relative hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#1D3A8A]/10 text-[#1D3A8A]">
                    Diapositiva #{idx + 1}
                  </span>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slide.active !== false}
                      onChange={e => handleHeroSlideChange(idx, 'active', e.target.checked)}
                      className="rounded border-slate-300 text-[#1D3A8A] focus:ring-[#1D3A8A] w-4 h-4 cursor-pointer"
                    />
                    Visible en Landing
                  </label>
                </div>

                {/* Image Preview Window (Navy Royal background like Hero) */}
                <div className="relative w-full h-52 rounded-xl overflow-hidden bg-gradient-to-b from-[#001B50] to-[#0A2668] flex items-end justify-center p-2 border border-slate-200 shadow-inner">
                  <img
                    key={slide.src}
                    src={getImageSrc(slide.src, DEFAULT_HERO_SLIDE_IMAGES[idx])}
                    alt={slide.alt || `Slide ${idx + 1}`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-xl transition-all"
                    onError={handleImageError(DEFAULT_HERO_SLIDE_IMAGES[idx])}
                  />
                  <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-[10px] text-white font-mono px-2 py-0.5 rounded">
                    Preview en vivo
                  </span>
                </div>

                {/* Preset Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seleccionar Imagen Oficial Predefinida
                  </label>
                  <select
                    value={HERO_IMAGE_PRESETS.some(p => p.value === slide.src) ? slide.src : 'custom'}
                    onChange={e => {
                      if (e.target.value === 'upload') {
                        handleUploadFromPC(`Diapositiva #${idx + 1}`, url => handleHeroSlideChange(idx, 'src', url));
                      } else if (e.target.value !== 'custom') {
                        handleHeroSlideChange(idx, 'src', e.target.value);
                      }
                    }}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  >
                    {HERO_IMAGE_PRESETS.map(preset => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                    <option value="upload">📁 Subir desde tu PC (Abrir archivos)...</option>
                    <option value="custom">-- Ruta o URL personalizada --</option>
                  </select>

                  <button
                    type="button"
                    disabled={uploadingTarget !== null}
                    onClick={() => handleUploadFromPC(`Diapositiva #${idx + 1}`, url => handleHeroSlideChange(idx, 'src', url))}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-[#1D3A8A] bg-blue-50/70 hover:bg-blue-100 text-[#1D3A8A] text-xs font-bold transition-all shadow-xs mt-2"
                  >
                    <UploadCloud className="w-4 h-4" />
                    {uploadingTarget === `Diapositiva #${idx + 1}` ? 'Subiendo imagen...' : '📁 Subir imagen desde tu PC'}
                  </button>

                  {/* Action buttons for Undo previous / Restore factory default / Return to custom */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                    {slide.src !== DEFAULT_HERO_SLIDE_IMAGES[idx] && (
                      <button
                        type="button"
                        onClick={() => handleHeroSlideChange(idx, 'src', DEFAULT_HERO_SLIDE_IMAGES[idx])}
                        className="flex-1 w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
                        title="Restaurar a la imagen oficial por defecto"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-700" /> 🔄 Restaurar oficial #{idx + 1}
                      </button>
                    )}
                    {slide.src === DEFAULT_HERO_SLIDE_IMAGES[idx] && customHeroImages[idx] && (
                      <button
                        type="button"
                        onClick={() => handleHeroSlideChange(idx, 'src', customHeroImages[idx])}
                        className="flex-1 w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
                        title="Volver a poner tu imagen personalizada"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-purple-700" /> ↩️ Volver a foto personalizada
                      </button>
                    )}
                    {previousHeroImages[idx] &&
                     previousHeroImages[idx] !== slide.src &&
                     previousHeroImages[idx] !== DEFAULT_HERO_SLIDE_IMAGES[idx] &&
                     previousHeroImages[idx] !== customHeroImages[idx] && (
                      <button
                        type="button"
                        onClick={() => handleHeroSlideChange(idx, 'src', previousHeroImages[idx])}
                        className="flex-1 w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-[#1D3A8A] text-xs font-bold transition-all shadow-xs cursor-pointer"
                        title="Volver a la foto que tenías antes de este cambio"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#1D3A8A]" /> ↩️ Deshacer cambio
                      </button>
                    )}
                    {slide.src === DEFAULT_HERO_SLIDE_IMAGES[idx] && !customHeroImages[idx] && (
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 py-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Foto oficial activa
                      </span>
                    )}
                  </div>
                </div>

                {/* Custom Path/URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ruta del Archivo o URL
                  </label>
                  <input
                    type="text"
                    value={slide.src || ''}
                    onChange={e => handleHeroSlideChange(idx, 'src', e.target.value)}
                    placeholder="/imagenes-lp/nombre.webp o https://..."
                    className="w-full text-xs font-mono border border-slate-200 rounded-lg py-2 px-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>

                {/* Alt text */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Texto Descriptivo (Alt SEO)
                  </label>
                  <input
                    type="text"
                    value={slide.alt || ''}
                    onChange={e => handleHeroSlideChange(idx, 'alt', e.target.value)}
                    placeholder="Descripción de la imagen para SEO..."
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: PROFESORES REALES (3 MAESTROS)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-5 flex items-start gap-3">
            <Users className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-black text-rose-950">
                Sección de Profesores Nativos de Francia (3 Maestros)
              </h3>
              <p className="text-xs text-slate-600">
                Personaliza la foto de perfil, ciudad de origen, cita célebre y lista de beneficios de cada profesor para la Landing Page pública.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-3 py-1.5 rounded-lg border border-amber-300">
                  🛡️ <b>Prueba con tranquilidad:</b> Sube cualquier foto y dale Guardar para verla en la Landing. Siempre puedes pulsar <b>"Restaurar fotos de fábrica"</b> o <b>Ctrl+Z</b> para regresar a como estaba.
                </span>
                {teachers.some(t => t.image !== DEFAULT_TEACHER_IMAGES[t.id]) && (
                  <button
                    type="button"
                    onClick={restoreAllTeachersToDefault}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-xs border border-amber-300 shadow-xs transition-all cursor-pointer"
                    title="Restablecer las fotos de los 3 profesores a sus fotos oficiales de fábrica"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restaurar las fotos oficiales de los 3 profesores
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sub-selector pills for teachers */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {teachers.map((teacher, idx) => (
              <button
                key={teacher.id || idx}
                onClick={() => setSelectedTeacherIndex(idx)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all ${
                  selectedTeacherIndex === idx
                    ? 'border-[#1D3A8A] bg-blue-50/70 shadow-sm ring-2 ring-blue-100'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <img
                  key={teacher.image}
                  src={getImageSrc(teacher.image, DEFAULT_TEACHER_IMAGES[teacher.id] || '/imagenes-lp/teacher_royal_jean_luc.webp')}
                  alt={teacher.name}
                  onError={handleImageError(DEFAULT_TEACHER_IMAGES[teacher.id] || '/imagenes-lp/teacher_royal_jean_luc.webp')}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="text-left">
                  <div className="text-xs font-black text-[#001B50]">
                    Prof. {teacher.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {teacher.city}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Teacher Editor + Live Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-[#001B50] flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-600" />
                  Editando a Prof. {currentTeacher?.name}
                </h2>
                <span className="text-xs font-bold text-slate-400">
                  ID: {currentTeacher?.id}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={currentTeacher?.name || ''}
                    onChange={e => handleTeacherChange(selectedTeacherIndex, 'name', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad / Región</label>
                  <input
                    type="text"
                    value={currentTeacher?.city || ''}
                    onChange={e => handleTeacherChange(selectedTeacherIndex, 'city', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rol / Especialidad</label>
                  <input
                    type="text"
                    value={currentTeacher?.role || ''}
                    onChange={e => handleTeacherChange(selectedTeacherIndex, 'role', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Años de Experiencia</label>
                  <input
                    type="text"
                    value={currentTeacher?.exp || ''}
                    onChange={e => handleTeacherChange(selectedTeacherIndex, 'exp', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Insignia / Badge</label>
                  <input
                    type="text"
                    value={currentTeacher?.badge || ''}
                    onChange={e => handleTeacherChange(selectedTeacherIndex, 'badge', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hashtag de Marca</label>
                  <input
                    type="text"
                    value={currentTeacher?.hashtag || ''}
                    onChange={e => handleTeacherChange(selectedTeacherIndex, 'hashtag', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>
              </div>

              {/* Teacher Image */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700">Foto del Profesor</label>
                <div className="flex gap-2">
                  <select
                    value={TEACHER_IMAGE_PRESETS.some(p => p.value === currentTeacher?.image) ? currentTeacher?.image : 'custom'}
                    onChange={e => {
                      if (e.target.value === 'upload') {
                        handleUploadFromPC(`Prof. ${currentTeacher?.name}`, url => handleTeacherChange(selectedTeacherIndex, 'image', url));
                      } else if (e.target.value !== 'custom') {
                        handleTeacherChange(selectedTeacherIndex, 'image', e.target.value);
                      }
                    }}
                    className="text-xs font-medium border border-slate-200 rounded-lg py-2 px-2.5 bg-slate-50 flex-1 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  >
                    {TEACHER_IMAGE_PRESETS.map(preset => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                    <option value="upload">📁 Subir foto desde tu PC (Abrir archivos)...</option>
                    <option value="custom">-- URL personalizada --</option>
                  </select>
                  <input
                    type="text"
                    value={currentTeacher?.image || ''}
                    onChange={e => handleTeacherChange(selectedTeacherIndex, 'image', e.target.value)}
                    placeholder="/imagenes-lp/... o https://..."
                    className="text-xs font-mono border border-slate-200 rounded-lg py-2 px-2.5 bg-white flex-1 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>

                <button
                  type="button"
                  disabled={uploadingTarget !== null}
                  onClick={() => handleUploadFromPC(`Prof. ${currentTeacher?.name}`, url => handleTeacherChange(selectedTeacherIndex, 'image', url))}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-rose-400 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-xs"
                >
                  <UploadCloud className="w-4 h-4" />
                  {uploadingTarget === `Prof. ${currentTeacher?.name}` ? 'Subiendo foto...' : `📁 Subir foto de ${currentTeacher?.name} desde tu PC`}
                </button>

                {/* Botones de acción: Deshacer cambio / Restaurar oficial / Volver a personalizada */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  {/* Si la foto actual NO es la oficial de fábrica: botón para restaurar la oficial */}
                  {currentTeacher?.image !== DEFAULT_TEACHER_IMAGES[currentTeacher?.id] && (
                    <button
                      type="button"
                      onClick={() => handleTeacherChange(selectedTeacherIndex, 'image', DEFAULT_TEACHER_IMAGES[currentTeacher?.id])}
                      className="flex-1 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
                      title="Restaurar a la foto oficial original de fábrica"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-700" /> 🔄 Restaurar foto oficial ({currentTeacher?.name})
                    </button>
                  )}

                  {/* Si la foto actual ES la oficial pero hay foto personalizada: botón para volver a la personalizada */}
                  {currentTeacher?.image === DEFAULT_TEACHER_IMAGES[currentTeacher?.id] && customTeacherImages[currentTeacher?.id] && (
                    <button
                      type="button"
                      onClick={() => handleTeacherChange(selectedTeacherIndex, 'image', customTeacherImages[currentTeacher?.id])}
                      className="flex-1 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
                      title="Volver a poner tu foto personalizada subida"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-purple-700" /> ↩️ Volver a tu foto personalizada
                    </button>
                  )}

                  {/* Si hay una foto anterior diferente a la actual, a la oficial y a la personalizada: Deshacer */}
                  {previousTeacherImages[currentTeacher?.id] &&
                   previousTeacherImages[currentTeacher?.id] !== currentTeacher?.image &&
                   previousTeacherImages[currentTeacher?.id] !== DEFAULT_TEACHER_IMAGES[currentTeacher?.id] &&
                   previousTeacherImages[currentTeacher?.id] !== customTeacherImages[currentTeacher?.id] && (
                    <button
                      type="button"
                      onClick={() => handleTeacherChange(selectedTeacherIndex, 'image', previousTeacherImages[currentTeacher?.id])}
                      className="flex-1 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-[#1D3A8A] text-xs font-bold transition-all shadow-xs cursor-pointer"
                      title="Volver a la foto que tenías antes de este cambio"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#1D3A8A]" /> ↩️ Deshacer cambio
                    </button>
                  )}

                  {/* Indicador de foto oficial activa si no hay foto personalizada registrada */}
                  {currentTeacher?.image === DEFAULT_TEACHER_IMAGES[currentTeacher?.id] && !customTeacherImages[currentTeacher?.id] && (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 py-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Foto oficial activa ({currentTeacher?.name})
                    </span>
                  )}
                </div>
              </div>

              {/* Teacher Quote */}
              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cita Personalizada / Mensaje Inspirador
                </label>
                <textarea
                  rows={3}
                  value={currentTeacher?.quote || ''}
                  onChange={e => handleTeacherChange(selectedTeacherIndex, 'quote', e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                />
              </div>

              {/* Bullets List */}
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Beneficios de estudiar con {currentTeacher?.name} ({currentTeacher?.bullets?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddTeacherBullet(selectedTeacherIndex)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1D3A8A] hover:text-blue-900"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar beneficio
                  </button>
                </div>

                <div className="space-y-2">
                  {(currentTeacher?.bullets || []).map((b: string, bIdx: number) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {bIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={b}
                        onChange={e => handleTeacherBulletChange(selectedTeacherIndex, bIdx, e.target.value)}
                        className="w-full text-xs font-medium border border-slate-200 rounded-lg py-1.5 px-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTeacherBullet(selectedTeacherIndex, bIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview Column (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Vista Previa en Vivo (Landing Page)
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  100% interactivo
                </span>
              </div>

              {/* Exact Landing Page Card Recreation */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      key={currentTeacher?.image}
                      src={getImageSrc(currentTeacher?.image, DEFAULT_TEACHER_IMAGES[currentTeacher?.id] || '/imagenes-lp/teacher_royal_jean_luc.webp')}
                      alt={currentTeacher?.name}
                      onError={handleImageError(DEFAULT_TEACHER_IMAGES[currentTeacher?.id] || '/imagenes-lp/teacher_royal_jean_luc.webp')}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-100 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-[#D92534] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
                      NATIVO
                    </span>
                  </div>
                  <div>
                    <span className="inline-block bg-rose-50 text-[#D92534] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1">
                      {currentTeacher?.badge || 'Actitud Royal'}
                    </span>
                    <h3 className="text-xl font-black text-[#001B50]">
                      Prof. {currentTeacher?.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      {currentTeacher?.role}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {currentTeacher?.city} • {currentTeacher?.exp}
                    </p>
                  </div>
                </div>

                {/* Quote Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative">
                  <span className="text-3xl text-rose-300 font-serif leading-none absolute -top-1 left-2">“</span>
                  <p className="text-xs italic text-slate-700 pt-2 pl-3">
                    {currentTeacher?.quote}
                  </p>
                </div>

                {/* Bullets preview */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    Beneficios con {currentTeacher?.name}:
                  </div>
                  <div className="space-y-1">
                    {(currentTeacher?.bullets || []).map((b: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-[#D92534] flex-shrink-0 mt-0.5" strokeWidth={3} />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mock CTA Button */}
                <button
                  type="button"
                  disabled
                  className="w-full py-3 rounded-xl font-black text-xs text-white bg-[#D92534] shadow-md flex items-center justify-center gap-1.5 uppercase tracking-wider opacity-95"
                >
                  ¡QUIERO APRENDER CON {currentTeacher?.name?.toUpperCase()}!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: NIVELES Y PERSONAJES (6 NIVELES)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'levels' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-3">
            <GraduationCap className="w-6 h-6 text-[#1D3A8A] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-black text-[#001B50]">
                Escala de 6 Niveles CEFR & Personajes Exclusivos (A1 a B2)
              </h3>
              <p className="text-xs text-slate-600">
                Ajusta las competencias académicas, títulos y el personaje que viste la tarjeta Royal en la Landing Page.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-3 py-1.5 rounded-lg border border-amber-300">
                  🛡️ <b>Prueba con tranquilidad:</b> Sube cualquier silueta y dale Guardar para verla en la Landing. Siempre puedes pulsar <b>"Restaurar personajes de fábrica"</b> o <b>Ctrl+Z</b> para regresar a como estaba.
                </span>
                {Object.entries(DEFAULT_LEVEL_CHAR_IMAGES).some(([k, v]) => levelsData[k]?.characterImage !== v) && (
                  <button
                    type="button"
                    onClick={restoreAllLevelsToDefault}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-xs border border-amber-300 shadow-xs transition-all cursor-pointer"
                    title="Restablecer los personajes de todos los niveles a sus siluetas oficiales de fábrica"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restaurar personajes oficiales de todos los niveles
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Stepper Selection Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['A1', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2-C1'].map(lvlKey => {
              const lvl = levelsData[lvlKey] || {};
              const isActive = selectedLevelKey === lvlKey;
              return (
                <button
                  key={lvlKey}
                  onClick={() => setSelectedLevelKey(lvlKey)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all ${
                    isActive
                      ? 'border-[#1D3A8A] bg-[#001B50] text-white shadow-md'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`text-base font-black ${isActive ? 'text-[#D59B28]' : 'text-[#001B50]'}`}>
                    {lvlKey}
                  </span>
                  <span className={`text-xs font-bold ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
                    {lvl.subLabel || lvl.sub || lvlKey}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Level Editor + Live Royal Navy Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[#001B50] text-[#D59B28] flex items-center justify-center font-black text-sm">
                    {selectedLevelKey}
                  </span>
                  <h2 className="text-lg font-black text-[#001B50]">
                    Configurar Nivel {selectedLevelKey} ({currentLevel?.subLabel || currentLevel?.sub})
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  CEFR Escala Oficial
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Corto / Subtítulo</label>
                  <input
                    type="text"
                    value={currentLevel?.subLabel || currentLevel?.sub || ''}
                    onChange={e => {
                      handleLevelChange(selectedLevelKey, 'subLabel', e.target.value);
                      handleLevelChange(selectedLevelKey, 'sub', e.target.value);
                    }}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Etiqueta Completa de Nivel</label>
                  <input
                    type="text"
                    value={currentLevel?.levelTag || ''}
                    onChange={e => handleLevelChange(selectedLevelKey, 'levelTag', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título Línea 1</label>
                  <input
                    type="text"
                    value={currentLevel?.titleLine1 || ''}
                    onChange={e => handleLevelChange(selectedLevelKey, 'titleLine1', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título Línea 2 (Énfasis Dorado)</label>
                  <input
                    type="text"
                    value={currentLevel?.titleLine2 || ''}
                    onChange={e => handleLevelChange(selectedLevelKey, 'titleLine2', e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>
              </div>

              {/* Character Image Picker */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700">
                  Personaje Exclusivo del Nivel ({selectedLevelKey})
                </label>
                <div className="flex gap-2">
                  <select
                    value={LEVEL_CHAR_PRESETS.some(p => p.value === currentLevel?.characterImage) ? currentLevel?.characterImage : 'custom'}
                    onChange={e => {
                      if (e.target.value === 'upload') {
                        handleUploadFromPC(`Personaje Nivel ${selectedLevelKey}`, url => handleLevelChange(selectedLevelKey, 'characterImage', url));
                      } else if (e.target.value !== 'custom') {
                        handleLevelChange(selectedLevelKey, 'characterImage', e.target.value);
                      }
                    }}
                    className="text-xs font-medium border border-slate-200 rounded-lg py-2 px-2.5 bg-slate-50 flex-1 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  >
                    {LEVEL_CHAR_PRESETS.map(preset => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                    <option value="upload">📁 Subir personaje desde tu PC (Abrir archivos)...</option>
                    <option value="custom">-- Ruta o URL personalizada --</option>
                  </select>
                  <input
                    type="text"
                    value={currentLevel?.characterImage || ''}
                    onChange={e => handleLevelChange(selectedLevelKey, 'characterImage', e.target.value)}
                    placeholder="/imagenes-lp/level_char_... o https://..."
                    className="text-xs font-mono border border-slate-200 rounded-lg py-2 px-2.5 bg-white flex-1 focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                  />
                </div>

                <button
                  type="button"
                  disabled={uploadingTarget !== null}
                  onClick={() => handleUploadFromPC(`Personaje Nivel ${selectedLevelKey}`, url => handleLevelChange(selectedLevelKey, 'characterImage', url))}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-[#1D3A8A] bg-blue-50/70 hover:bg-blue-100 text-[#1D3A8A] text-xs font-bold transition-all shadow-xs"
                >
                  <UploadCloud className="w-4 h-4" />
                  {uploadingTarget === `Personaje Nivel ${selectedLevelKey}` ? 'Subiendo personaje...' : `📁 Subir personaje de Nivel ${selectedLevelKey} desde tu PC`}
                </button>

                {/* Botones de acción: Deshacer cambio / Restaurar oficial / Volver a personalizada */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  {/* Si el personaje actual NO es el oficial de fábrica: botón para restaurar */}
                  {currentLevel?.characterImage !== DEFAULT_LEVEL_CHAR_IMAGES[selectedLevelKey] && (
                    <button
                      type="button"
                      onClick={() => handleLevelChange(selectedLevelKey, 'characterImage', DEFAULT_LEVEL_CHAR_IMAGES[selectedLevelKey])}
                      className="flex-1 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
                      title="Restaurar a la silueta oficial original de fábrica"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-700" /> 🔄 Restaurar personaje oficial ({selectedLevelKey})
                    </button>
                  )}

                  {/* Si el personaje actual ES el oficial pero hay personaje personalizado: botón para volver */}
                  {currentLevel?.characterImage === DEFAULT_LEVEL_CHAR_IMAGES[selectedLevelKey] && customLevelImages[selectedLevelKey] && (
                    <button
                      type="button"
                      onClick={() => handleLevelChange(selectedLevelKey, 'characterImage', customLevelImages[selectedLevelKey])}
                      className="flex-1 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
                      title="Volver a poner tu personaje personalizado"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-purple-700" /> ↩️ Volver a personaje personalizado
                    </button>
                  )}

                  {/* Si hay un personaje anterior diferente al actual, al oficial y al personalizado: Deshacer */}
                  {previousLevelImages[selectedLevelKey] &&
                   previousLevelImages[selectedLevelKey] !== currentLevel?.characterImage &&
                   previousLevelImages[selectedLevelKey] !== DEFAULT_LEVEL_CHAR_IMAGES[selectedLevelKey] &&
                   previousLevelImages[selectedLevelKey] !== customLevelImages[selectedLevelKey] && (
                    <button
                      type="button"
                      onClick={() => handleLevelChange(selectedLevelKey, 'characterImage', previousLevelImages[selectedLevelKey])}
                      className="flex-1 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-[#1D3A8A] text-xs font-bold transition-all shadow-xs cursor-pointer"
                      title="Volver al personaje que tenías antes de este cambio"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#1D3A8A]" /> ↩️ Deshacer cambio
                    </button>
                  )}

                  {/* Indicador de silueta oficial activa si no hay personaje personalizado registrado */}
                  {currentLevel?.characterImage === DEFAULT_LEVEL_CHAR_IMAGES[selectedLevelKey] && !customLevelImages[selectedLevelKey] && (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 py-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Silueta oficial activa ({selectedLevelKey})
                    </span>
                  )}
                </div>
              </div>

              {/* Alt description for character image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Texto Descriptivo del Personaje (Alt SEO)
                </label>
                <input
                  type="text"
                  value={currentLevel?.characterAlt || ''}
                  onChange={e => handleLevelChange(selectedLevelKey, 'characterAlt', e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                />
              </div>

              {/* Academic Description Textarea */}
              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción Oficial / Enfoque Académico del Nivel
                </label>
                <textarea
                  rows={4}
                  value={currentLevel?.desc || ''}
                  onChange={e => handleLevelChange(selectedLevelKey, 'desc', e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                />
              </div>

              {/* 4 Competencias Clave Bullets */}
              <div className="border-t border-slate-100 pt-3 space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Las 4 Competencias Clave del Nivel
                </label>
                <div className="space-y-2.5">
                  {(currentLevel?.bullets || []).map((bullet: any, bIdx: number) => (
                    <div key={bIdx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <select
                        value={bullet.icon || 'chat'}
                        onChange={e => handleLevelBulletChange(selectedLevelKey, bIdx, 'icon', e.target.value)}
                        className="text-xs font-medium border border-slate-200 rounded-lg py-1 px-2 bg-white flex-shrink-0"
                      >
                        {BULLET_ICON_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={bullet.text || ''}
                        onChange={e => handleLevelBulletChange(selectedLevelKey, bIdx, 'text', e.target.value)}
                        className="w-full text-xs font-medium border border-slate-200 rounded-lg py-1 px-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#1D3A8A]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Navy Royal Card Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Tarjeta Royal de Nivel (Landing Page)
                </span>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                  Fondo Azul Real #001B50
                </span>
              </div>

              {/* Royal Navy Card Mock */}
              <div className="bg-[#001B50] rounded-3xl p-6 text-white space-y-4 shadow-2xl relative overflow-hidden border border-[#D59B28]/20">
                {/* Stamp & Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="inline-block bg-[#D92534] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                      {currentLevel?.levelTag || `${selectedLevelKey} • 4 Meses`}
                    </span>
                    <h3 className="text-xl font-black leading-snug">
                      {currentLevel?.titleLine1 || 'Fundamentos'} <br />
                      <span className="text-[#D59B28] italic font-serif text-lg">
                        {currentLevel?.titleLine2 || '¡Empieza a hablar!'}
                      </span>
                    </h3>
                  </div>

                  {/* Stamp Badge */}
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#D92534] flex flex-col items-center justify-center bg-[#D92534]/20 flex-shrink-0">
                    <span className="text-[8px] font-bold text-red-200 uppercase">NIVEL</span>
                    <span className="text-sm font-black text-white">{selectedLevelKey}</span>
                  </div>
                </div>

                {/* Tab Switcher Preview */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <button
                    type="button"
                    onClick={() => setPreviewLevelTab('competencias')}
                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                      previewLevelTab === 'competencias'
                        ? 'bg-white/20 text-white font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ✨ 4 Competencias
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLevelTab('enfoque')}
                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                      previewLevelTab === 'enfoque'
                        ? 'bg-white/20 text-white font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    📖 Enfoque
                  </button>
                </div>

                {/* Tab Content Box */}
                <div className="min-h-[140px] text-xs">
                  {previewLevelTab === 'competencias' ? (
                    <div className="space-y-2">
                      {(currentLevel?.bullets || []).map((b: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-200">
                          <span className="text-amber-400 font-bold">★</span>
                          <span className="text-[11px] leading-relaxed">{b.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-200 text-xs leading-relaxed italic">
                      {currentLevel?.desc}
                    </p>
                  )}
                </div>

                {/* Character Silhouette Preview Area */}
                <div className="relative w-full h-44 rounded-2xl bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center overflow-hidden border border-white/10">
                  <img
                    key={currentLevel?.characterImage}
                    src={getImageSrc(currentLevel?.characterImage, DEFAULT_LEVEL_CHAR_IMAGES[selectedLevelKey] || '/imagenes-lp/level_char_a1.webp')}
                    alt={currentLevel?.characterAlt || 'Personaje'}
                    onError={handleImageError(DEFAULT_LEVEL_CHAR_IMAGES[selectedLevelKey] || '/imagenes-lp/level_char_a1.webp')}
                    className="max-h-full object-contain filter drop-shadow-2xl transition-all"
                  />
                  <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded">
                    Personaje: {currentLevel?.subLabel || selectedLevelKey}
                  </div>
                </div>

                {/* Mock Action */}
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 rounded-xl font-black text-xs text-white bg-[#D92534] shadow-md flex items-center justify-center gap-1 uppercase tracking-wider"
                >
                  QUIERO SUBIR DE NIVEL <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar when there are unsaved changes */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-[#001B50] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D59B28]/40 flex flex-wrap items-center justify-between gap-3 animate-bounce-short">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-xs font-bold text-slate-200">Tienes cambios sin guardar</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={revertAllUnsavedChanges}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
              title="Descartar los cambios y volver a como estaba"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-300" /> Deshacer (Ctrl+Z)
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#D59B28] hover:bg-amber-500 text-[#001B50] font-black text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Guardar Ahora
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
