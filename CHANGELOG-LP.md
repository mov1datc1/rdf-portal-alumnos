# Changelog — Landing Page Les Rois du Français

Todos los cambios notables de la **Landing Page** de *Les Rois du Français* serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y se adhiere al [Versionado Semántico](https://semver.org/lang/es/).

---

## [2.1.2] — 2026-08-18

### Cambiado
- **Reemplazo Definitivo de la Imagen de la Chica en Banner Azul (`why_girl_banner.png` y `woman_tiara.png`):**
  - Se procesó y guardó la **nueva foto recortada sin barras sobrantes** enviada por el cliente (`media__1787023239417.png`), actualizándola en `frontend/public/imagenes-lp/`, `imagenes-lp/` y `scratch/les-rois-du-francais/assets/`.

---

## [2.1.1] — 2026-08-18

### Cambiado
- **Limpieza de Ícono y Estilo Gris (`imagenes-lp/why_icon1.png` a `why_icon5.png`):**
  - **Eliminado artefacto izquierdo en la Torre Eiffel (`why_icon4.png`):** Se limpió la imagen removiendo la línea vertical lateral sobrante y centrando la Torre Eiffel en color **Gris Oscuro elegante (`#555555`)** a una altura proporcionada de `34px`.
- **Integración Continua de 1 Solo Bloque 50/50 (`LandingPage.tsx` y `LandingPage.css`):**
  - Removidos los contenedores aislados de tarjetas. Ahora la parte izquierda con los íconos y la tabla comparativa convive a la par en un 50% perfecto con el banner azul completo de la chica con tiara (`why_girl_banner.png`), luciendo como una sola sección unificada sin espacios vacíos.

---

## [2.1.0] — 2026-08-18

### Cambiado
- **Ajustes Exactos de la Sección "¿Por Qué Elegir...?" (`LandingPage.tsx` y `LandingPage.css`):**
  - **Maquetación Mitad y Mitad (50% / 50%):** Eliminada la brecha excesiva entre la información de la izquierda y la foto de la derecha (`grid-template-columns: 1fr 1fr; gap: 24px`).
  - **Título Naranja:** Título *LES ROIS DU FRANÇAIS?* configurado en color naranja vibrante (`#F24E1E`).
  - **Íconos del Menú Más Grandes y Claros:** Re-recortados los 5 íconos sin márgenes vacíos e incrementado su tamaño relativo (`height: 46px`).
  - **Íconos de Listas:**
    - Équis `✕` en OTRAS ESCUELAS configuradas en color **Azul (`#092B6B`)**.
    - Palomitas `✓` en LES ROIS DU FRANÇAIS configuradas en **Rojo dentro de un Círculo Rojo sin Relleno**.
  - **Alineación del VS:**
    - Corona azul agrandada (`36px`) y pegada directamente al texto **VS**.
    - Eliminadas las líneas verticales punteadas grises del divisor central.

---

## [2.0.0] — 2026-08-18

### Agregado & Reconstruido
- **Reconstrucción Total de la Sección "¿Por Qué Elegir Les Rois du Français?" (`LandingPage.tsx`, `LandingPage.css` y `style.css`):**
  - **Imagen de Chica Modelo en Banner Derecho (`imagenes-lp/why_girl_banner.png`):** Integrada la imagen oficial en alta resolución de la chica con tiara sobre fondo azul real apuntando hacia la tabla comparativa.
  - **Encabezado con Colores Oficiales:** Subtítulo *¿POR QUÉ ELEGIR* en Azul Real (`#092B6B`) y Título *LES ROIS DU FRANÇAIS?* en Rojo Carmesí (`#D92534`).
  - **Fila de 5 Íconos Oficiales Extraídos (`why_icon1.png` a `why_icon5.png`):** Extraída la fila de íconos vectoriales en alta resolución colocados verticalmente (ícono arriba, etiqueta en azul debajo).
  - **Tabla Comparativa Rediseñada:**
    - Píldora de encabezado para *OTRAS ESCUELAS* en fondo oscuro (`#202636`) y píldora para *LES ROIS DU FRANÇAIS* en fondo rojo (`#D92534`).
    - Íconos de lista `✕` y `✓` en rojo destacados con tipografía en azul.
  - **Separador Central VS con Corona Azul (`imagenes-lp/blue_crown_vs.png`):** Extraída la corona azul oficial del cliente posicionada sobre el texto **VS**.

---

## [1.9.0] — 2026-08-17

### Cambiado
- **Homologación de Colores Azul Marino Corporativo (`LandingPage.css` y `style.css`):**
  - **Fondo de la Tarjeta "Curso de Verano":** Se cambió el tono azul oscuro anterior por la gradiente azul marino profunda idéntica a la barra de estadísticas (`linear-gradient(135deg, #092B6B 0%, #001D5C 100%)`).
  - **Letras Grandes Método MRAF®:** Se unificó el tono azul del logo principal *MRAF®*, la descripción en francés y las letras gigantes (*M, R, A, F*) al tono azul marino real oficial (`#092B6B`).

---

## [1.8.1] — 2026-08-17

### Cambiado
- **Sobresalimiento y Tamaño de la Tarjeta "Curso de Verano" (`LandingPage.tsx` y `LandingPage.css`):**
  - **Efecto Pop-Out:** La tarjeta oscura de *Curso de Verano* ahora sobresale por encima de los otros tres planes (`transform: scale(1.06)`), con una sombra más pronunciada (`box-shadow: 0 16px 38px rgba(9, 29, 62, 0.35)`) y padding mayor (`34px 22px`).
  - **Sol Más Grande y Cercano:** Se incrementó el tamaño del ícono del Sol (`size={48}`) y se posicionó inmediatamente al lado del título *CURSO DE VERANO* (`gap: 12px`).

---

## [1.8.0] — 2026-08-17

### Cambiado
- **Rediseño de la Sección de Planes y Precios (`LandingPage.tsx` y `LandingPage.css`):**
  - **Eliminación de Coronas:** Removidas las coronas doradas de la parte superior de los 3 planes principales (3, 6 y 9 meses).
  - **Descuentos en Texto Plano Rojo/Naranja:** Los porcentajes de descuento (`15% DTO.`, `20% DTO.`, `25% DTO.`) pasaron de píldoras rellenas a texto plano destacado en color rojo/naranja (`#D92534`).
  - **Textos de Horarios en Azul:** La descripción debajo del descuento (`En cualquier horario...`) se configuró en tono **Azul Rey Corporativo** (`#002882`).
  - **Tarjeta Curso de Verano 100% Blanca:** Todos los textos de la tarjeta oscura (*CURSO DE VERANO*, *4 SEMANAS DE FRANCÉS* y descripción) se unificaron en blanco puro (`#FFFFFF`).
  - **Ícono del Sol a la Derecha:** Se removió el ícono de destellos/estrella y se integró el **ícono del Sol (`Sun`) en color blanco a la derecha del título** *CURSO DE VERANO*.

---

## [1.7.2] — 2026-08-17

### Cambiado
- **Ajuste Milimétrico de la Imagen del Rey (`LandingPage.css` y `style.css`):**
  - Deslizada la figura del Rey unos píxeles adicionales hacia abajo (`translateY(48px)`), eliminando el milimétrico espacio inferior para que haga contacto perfecto con la sección siguiente.

---

## [1.7.1] — 2026-08-17

### Cambiado
- **Ajuste Fino de la Posición del Rey (`LandingPage.tsx` y `LandingPage.css`):**
  - Restablecida la imagen recortada original preferida por el usuario (`rey.png`).
  - Restaurada la maquetación base del Hero (`padding: 50px 0 90px`) y deslizada sutilmente la figura del Rey unos píxeles más abajo (`transform: translateY(35px)`) para lograr una apariencia limpia y equilibrada.

---

## [1.7.0] — 2026-08-17

### Cambiado
- **Alineación Perfecta del Rey en el Hero (`LandingPage.tsx` y `LandingPage.css`):**
  - **Eliminación del Espacio Inferior (Gap):** Eliminado el padding inferior en `.lrd-hero-section` y ajustada la transformación del Rey (`transform: translateY(60px); margin-bottom: -60px`).
  - **Superposición Continua:** La figura recortada del Rey en alta definición (`king_cutout_perfect.png`) ahora se extiende hasta el borde inferior exacto de la sección Hero, desapareciendo de forma limpia por detrás de la tarjeta de estadísticas (*Stats Bar*), sin ningún espacio ni corte visible.

---

## [1.6.0] — 2026-08-17

### Agregado
- **Corona Roja Oficial del Hero (`imagenes-lp/hero_crown_red.png`):**
  - Extracción y aislamiento en alta resolución del ícono de corona roja dibujada a mano suministrado en la captura del cliente.
  - Generación de transparencia sin artefactos y conversión a Base64 (`imagenes-lp/hero_crown_red_b64.txt`).
- **Actualización del Hero (`LandingPage.tsx`, `LandingPage.css` y `elementor_copy_paste.html`):**
  - Reemplazado el gráfico de trazado SVG genérico por la imagen oficial de la corona roja (`hero_crown_red.png`), posicionada perfectamente sobre el título *"Tu reinado del francés en línea"*.

---

## [1.5.0] — 2026-08-17

### Cambiado
- **Extracción Exacta de Coronas de la Imagen Oficial (`imagenes-lp/crown_m.png`, `crown_r.png`, `crown_a.png`, `crown_f.png`):**
  - Se recortaron y aislaron los 4 íconos de coronas exactamente desde la imagen proporcionada (Azul, Roja, Azul con destellos, Roja con destellos) con fondo transparente limpio para garantizar 100% de coincidencia gráfica.
- **Eliminación Total de Bloques / Tarjetas en Método MRAF® (`LandingPage.css`):**
  - Se removió por completo cualquier fondo de tarjeta (`background: none`), bordes redondeados globales y sombras. Las columnas se ubican directamente sobre el fondo limpio del sitio, separadas únicamente por una delgada línea divisora gris vertical (`border-right: 1px solid rgba(0, 40, 130, 0.15)`).

---

## [1.4.0] — 2026-08-17

### Cambiado
- **Rediseño de la Sección Método MRAF® (`LandingPage.tsx` y `LandingPage.css`):**
  - **Subtítulo en Azul Corporativo:** Las letras de *"Méthode Rapide d'Apprentissage du Français"* pasaron de gris/atenuado a **Azul Rey Corporativo** (`#002882`).
  - **Coronas Rellenas Sólidas:** Las coronas superiores de las 4 columnas cambiaron a formato relleno sólido (`fill="#002882"` para M/A y `fill="#D92534"` para R/F).
  - **Letras MRAF 100% en Azul:** Todas las iniciales (**M, R, A, F**) se unificaron en color **Azul Rey** (`#002882`), eliminando el tono rojo en las letras R y F.
  - **Textos Descriptivos en Azul:** Todo el texto descriptivo interior de las tarjetas de método cambió a **Azul Rey** (`#002882`).
  - **Maquetación Limpia con Líneas Divisoras:** Eliminado el efecto de "cajitas/bloques flotantes". Ahora el contenedor es plano con fondo blanco/traslúcido, utilizando delgadas líneas divisoras verticales en color gris (`border-right: 1px solid #E2E8F0`) entre cada columna.

---

## [1.3.0] — 2026-08-17

### Cambiado
- **Rediseño de la Barra de Estadísticas (`LandingPage.css` y `style.css`):**
  - **Fondo Azul Marino:** El contenedor de estadísticas pasó de blanco a un gradiente azul marino continuo (`#092B6B` a `#001D5C`) con bordes sutiles traslúcidos.
  - **Color de Texto e Íconos a Blanco:** Todos los valores numéricos, etiquetas informativas e íconos cambiaron de color azul/gris a Blanco Puro (`#FFFFFF`) y blanco semi-traslúcido (`rgba(255,255,255,0.9)`).
  - **Disposición Vertical (Íconos arriba de los números):** Cambio de maquetación en `.lrd-stat-col` a `flex-direction: column` para posicionar cada ícono centrado directamente arriba de las cifras numéricas y sus descripciones, eliminando la alineación a la izquierda.

---

## [1.2.0] — 2026-08-17

### Agregado
- **Imagen Panorámica de la Torre Eiffel (`imagenes-lp/eiffel_tower_hero_full.png`):**
  - Implementación de la nueva imagen panorámica en alta resolución proporcionada para el fondo de la sección Hero.
  - La imagen incluye la Torre Eiffel completa posicionada a la derecha y el horizonte estilizado (skyline) de la ciudad en tonos azules vectoriales.
  - Copiada e integrada en la carpeta oficial del proyecto `imagenes-lp/` y en `frontend/public/imagenes-lp/`.
- **Integración de Código Base64 (`imagenes-lp/eiffel_hero_b64.txt`):**
  - Conversión e inclusión de la nueva imagen panorámica en formato Base64 para garantizar la portabilidad sin dependencias externas al copiar en WordPress.

### Cambiado
- **Estilos CSS Hero (`LandingPage.css` y `style.css`):**
  - Configurado `.lrd-hero-bg-eiffel` con `object-fit: cover` y `object-position: right center` para asegurar que la Torre Eiffel no se corte vertical u horizontalmente en monitores ultrapanorámicos ni dispositivos móviles.
- **Enrutamiento Público (`App.tsx`):**
  - La ruta raíz `/` y la ruta pública `/landing` ahora cargan directamente la Landing Page sin solicitar inicio de sesión.
  - El portal del alumno fue reubicado a la ruta `/dashboard`.
- **Plantilla Elementor Pro (`elementor_copy_paste.html`):**
  - Actualizado el widget de HTML único de Elementor con el nuevo fondo panorámico Base64 de la Torre Eiffel y la imagen recortada del Rey.

---

## [1.1.0] — 2026-08-16

### Agregado
- **Recorte Profesional del Rey (`imagenes-lp/king_cutout_perfect.png`):**
  - Extracción limpia de fondo (cutout) de la mascota oficial (Rey de Les Rois du Français) eliminando artefactos de pantalla verde.
- **Componentes Interactivos de Niveles MCER (A1 - C2):**
  - Sistema de pestañas dinámicas en React para conmutar la información pedagógica entre niveles (A1, A2, B1, B2, C1, C2).
- **Planes de Precios y Tabla Comparativa:**
  - Sección de precios con insignias de descuento, modalidades de pago y tabla comparativa "Método MRAF® vs Métodos Tradicionales".
- **Modales de Captación:**
  - Modal de captura de Leads para clase de prueba gratuita y modal interactivo para reproducción de video demo.

---

## [1.0.0] — 2026-08-10

### Agregado
- **Diseño Inicial de la Landing Page:**
  - Maquetación inicial responsive con paleta de colores corporativa: Azul Rey (#002882), Rojo Carmesí (#D92534) y Blanco (#FFFFFF).
  - Tipografías oficiales integradas desde Google Fonts: *Cinzel*, *Playfair Display*, *Outfit* y *Caveat*.
