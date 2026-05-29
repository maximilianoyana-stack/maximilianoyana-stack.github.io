# Proyecto: Página Turística - Puno

Breve sitio estático para la promoción turística de Puno (HTML/CSS/JS). Esta carpeta contiene los recursos del curso "Desarrollo Basado en Plataformas I" — práctica calificada.

## Entregables
- Código Fuente: estructura organizada de carpetas (`/css`, `/js`, `/img`, `/data`).
- Documentación: plantilla de informe técnico en `Informe_Tecnico.md`.
- Presentación / Demo: sitio estático listo para desplegar en GitHub Pages.
- Funcionalidad: cumplimiento de requisitos del enunciado (heros, carousels, datos, i18n).

## Estructura del repositorio

- `index.html` — Página de inicio con hero (90vh) y CTA.
- `destinos.html`, `culturas.html`, `gastronomia.html`, `itinerario.html`, `blog.html` — páginas de contenido.
- `css/style.css` — estilos principales.
- `js/main.js` — lógica UI/datos (carga `data/*.json`).
- `js/idiomas.js` — diccionario y helpers de i18n.
- `data/` — archivos JSON con contenidos (destinos, gastronomía, etc.).
- `img/` — imágenes usadas en el sitio.

## Ejecutar localmente

1. Abrir `index.html` en el navegador (doble clic o servir con un servidor estático).
2. Para un servidor simple (Python 3):

```bash
python -m http.server 8000
# luego abrir http://localhost:8000
```

## Despliegue (GitHub Pages)

1. Crear un repo en GitHub e `push` del contenido.
2. En Settings → Pages seleccionar la rama `main` (o `gh-pages`) y la carpeta `/`.

## Informe técnico y presentación

Usar `Informe_Tecnico.md` como plantilla para generar el PDF final. Recomiendo convertir Markdown a PDF con Pandoc o exportar desde un editor (VSCode/Typora).

## Notas y checklist
- Verificar que `img/Destinos/` contiene todas las imágenes usadas.
- Confirmar que `data/destinos.json` contiene las entradas nuevas (Isla Amantani, Playa Charcas, Puerto Puno, etc.).
- QA visual: probar `index.html`, `destinos.html`, `culturas.html`, `gastronomia.html`, `itinerario.html`, `blog.html`.

---
Si quieres, puedo generar el PDF del informe a partir de la plantilla (necesitarás `pandoc` instalado localmente o puedo preparar comandos para que ejecutes).
# 🏔️ PUNO TURÍSTICO - PÁGINA WEB OFICIAL

Bienvenido a la Página Web Turística de Puno. Este proyecto promueve el turismo, la cultura y la gastronomía de la región más folclórica del Perú.

## 📋 Contenido

- ✅ 5 páginas HTML interconectadas
- ✅ Sistema multiidioma (Español, Inglés, Quechua, Aymara)
- ✅ Diseño responsivo con Bootstrap 5
- ✅ Integración de Google Maps
- ✅ Datos dinámicos en JSON
- ✅ Interfaz moderna e interactiva

## 🚀 Inicio Rápido

### 1. Descarga el Proyecto
```bash
git clone <url-del-repositorio>
cd Practica Calificada
```

### 2. Abre en Navegador

**Opción A - Servidor Local:**
```bash
# Si tienes Python 3
python -m http.server 8000

# Si tienes Node.js
npx http-server

# Si tienes PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000/index-nuevo.html`

**Opción B - Directamente**
- Abre `index-nuevo.html` en tu navegador web

## 📁 Estructura de Archivos

```
/
├── index-nuevo.html              # Página de inicio
├── destinos.html                 # Destinos turísticos
├── culturas.html                 # Culturas y tradiciones
├── gastronomia.html              # Gastronomía puneña
├── itinerario.html               # Itinerarios turísticos
├── ESPECIFICACIONES_TECNICAS.md  # Documentación técnica
├── README.md                     # Este archivo
│
├── css/
│   └── style.css                 # Estilos CSS
│
├── js/
│   ├── idiomas.js                # Sistema de idiomas
│   └── main.js                   # Funcionalidad JavaScript
│
├── data/
│   ├── destinos.json             # Datos de destinos
│   ├── culturas.json             # Datos de culturas
│   ├── gastronomia.json          # Datos de gastronomía
│   └── itinerarios.json          # Datos de itinerarios
│
└── img/
    ├── Pictures/                 # Imágenes de destinos
    ├── cards/                    # Imágenes de tarjetas
    └── Puno/                     # Imágenes generales
```

## 🌐 Características

### Navegación Principal
- **Inicio**: Carrusel interactivo con destinos principales
- **Destinos**: Catálogo completo con mapas
- **Culturas**: Tradiciones y expresiones culturales
- **Gastronomía**: Platos típicos con recetas
- **Itinerario**: Paquetes de viaje personalizados

### Sistema de Idiomas
Cambia de idioma en la esquina superior derecha:
- 🇪🇸 Español (ES)
- 🇬🇧 English (EN)
- 🕌 Quechua (QU)
- 🌄 Aymara (AY)

### Mapas Interactivos
- Ubicación de todos los destinos
- Markers georreferenciados
- Información en popup

### Formulario de Reserva
- Datos personales
- Selección de itinerario
- Fecha y cantidad de personas
- Confirmación inmediata

## 📱 Responsividad

El sitio es completamente responsivo:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px)
- ✅ Tablet (768px)
- ✅ Móvil (375px+)

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Diseño y animaciones
- **Bootstrap 5** - Framework responsivo
- **JavaScript Vanilla** - Interactividad
- **Google Maps API** - Geolocalización
- **JSON** - Almacenamiento de datos

## 🎨 Paleta de Colores

```
Rojo Puno:     #8B0000
Oro:           #FFD700
Azul Titicaca: #004B87
Claro:         #F5F5F5
Oscuro:        #1a1a1a
```

## 🔐 Configuración de Google Maps

Para usar tu propia API Key de Google Maps:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Maps JavaScript API**
4. Crea una clave API
5. Reemplaza `AIzaSyDjKFkXFKhpyDkrLr9Sl2iiHmEGCOCQXdI` en:
   - `index-nuevo.html`
   - `destinos.html`

## 📊 Datos del Proyecto

### Destinos (4)
- Lago Titicaca
- Islas Uros
- Chullpas de Sillustani
- Reserva Nacional del Titicaca

### Culturas (5)
- Danza de los Negritos
- Diablada
- Himno de Puno
- Tejido Puneño
- Festividad de la Candelaria

### Gastronomía (5)
- Ceviche de Trucha
- Papa a la Huancaína
- Chuño
- Sopa de Quinua
- Uchucuta

### Itinerarios (2)
- Tour Clásico - 3 Días
- Aventura Completa - 5 Días

## 🌍 Ubicaciones en Google Maps

| Destino | Coordenadas | Link |
|---------|-------------|------|
| Lago Titicaca | -15.5075, -70.1327 | [Mapa](https://maps.google.com/?q=-15.5075,-70.1327) |
| Islas Uros | -15.5164, -70.1752 | [Mapa](https://maps.google.com/?q=-15.5164,-70.1752) |
| Sillustani | -15.4167, -70.2833 | [Mapa](https://maps.google.com/?q=-15.4167,-70.2833) |
| Reserva Titicaca | -15.3500, -70.1800 | [Mapa](https://maps.google.com/?q=-15.3500,-70.1800) |

## 🔧 Instalación de Dependencias

Este proyecto NO requiere instalación de dependencias npm. Todos los recursos se cargan desde CDN:

- Bootstrap 5: `cdn.jsdelivr.net`
- Font Awesome: `cdnjs.cloudflare.com`
- Google Maps: `maps.googleapis.com`

## 📖 Manual de Usuario Completo

Consulta el archivo `ESPECIFICACIONES_TECNICAS.md` para:
- Arquitectura detallada del proyecto
- Justificación de diseño
- Manual completo de usuario
- Información de todas las ubicaciones en Google Maps
- Guía de mantenimiento
- Consideraciones culturales

## ⚙️ Funcionalidades JavaScript

### Sistema de Idiomas
```javascript
cambiarIdioma('es')  // Cambiar a español
obtenerIdioma()      // Obtener idioma actual
actualizarTextos()   // Actualizar interfaz
```

### Carga de Datos
```javascript
cargarDatos('destinos')      // Cargar destinos
mostrarDestinos()            // Mostrar en página
mostrarDetalleDestino(index) // Mostrar detalle en modal
```

### Mapas
```javascript
// Automático en cada página
// Se inicializa al cargar
// Se actualizasiempre que cambia el idioma
```

## 🖼️ Imágenes Requeridas

Asegúrate de que existan las imágenes en:
```
img/Pictures/
  - lagotiticaca.gif
  - Uros.gif
  - sillustani.jpg

img/cards/
  - (imágenes adicionales de tarjetas)

img/Puno/
  - (imágenes generales)
```

## 🚨 Troubleshooting

### Mapas no cargan
- Verifica la API Key de Google
- Comprueba que Google Maps API esté habilitada
- Verifica restricciones de dominio

### Datos no cargan (JSON)
- Asegúrate de usar un servidor local
- Verifica rutas relativas de archivos
- Abre consola del navegador (F12) para errores

### Idiomas no cambian
- Limpia caché del navegador
- Verifica `js/idiomas.js`
- Comprueba atributos `data-i18n`

### Estilos no aplican
- Verifica ruta `css/style.css`
- Recarga la página (Ctrl+F5)
- Verifica Bootstrap CDN

## 📞 Contacto y Soporte

- **Desarrollador**: mxy_rmn
- **Email**: mxyrmn0@gmail.com
- **Instituto**: UNAP
- **Curso**: Desarrollo Basado en Plataformas I
- **Año**: 2026

## 📝 Licencia

Este proyecto es de código abierto y educativo. Se puede usar y modificar libremente.

## 🙏 Reconocimientos

- Región de Puno por su riqueza cultural
- Comunidades locales por preservar tradiciones
- UNAP por fomentar el desarrollo web

---

**¡Bienvenido a la Capital Folclórica del Perú! 🏔️**

Para más información sobre Puno, visita:
- [Gobierno Regional de Puno](https://www.puno.gob.pe/)
- [PromPerú](https://www.promperu.gob.pe/)
- [Wikipedia Puno](https://es.wikipedia.org/wiki/Puno)

