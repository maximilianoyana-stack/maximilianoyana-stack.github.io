# Informe Técnico — Proyecto "Puno Turístico"

## 1. Portada
- Título: Página Turística de Puno
- Autor(es): [Nombres]
- Curso: Desarrollo Basado en Plataformas I
- Fecha: [dd/mm/2026]

## 2. Resumen (Abstract)
Breve descripción del sitio, objetivos y alcance.

## 3. Arquitectura y estructura
- Diagrama de arquitectura (breve): archivos principales, flujo de datos `data/*.json` → `js/main.js` → DOM.
- Estructura de carpetas y responsabilidad de cada una.

## 4. Diseño y decisiones técnicas
- Por qué elegir Bootstrap 5 y CSS personalizado.
- Manejo de i18n con `js/idiomas.js` y `data/`.
- Justificación del héroe full-bleed en `index.html` (90vh) y per-page heroes.

## 5. Implementación funcional
- Descripción de las funciones principales en `js/main.js`:
  - `cargarDatos()`
  - `mostrarDestinos()`
  - `inicializarHeroIndex()`
  - `renderizarCarruselGlobal()`
  - `enhanceImages()`

## 6. Pruebas y verificación
- QA visual: lista de páginas a revisar.
- Pasos para reproducir y casos de prueba manuales (links, imágenes, idioma, formulario).

## 7. Imágenes y datos
- Lista de imágenes agregadas bajo `img/Destinos/`.
- Mapa de correspondencia `data/destinos.json` → imágenes.

## 8. Despliegue
- Instrucciones para GitHub Pages y exportar/compilar recursos.

## 9. Limitaciones y trabajo futuro
- Items pendientes (optimización, SEO, accesibilidad, pruebas automatizadas).

## 10. Anexos
- Comandos útiles (convertir a PDF):

```bash
# Convertir a PDF con pandoc
pandoc Informe_Tecnico.md -o Informe_Tecnico.pdf --toc --pdf-engine=wkhtmltopdf
```

---
Peso de entregables (referencia):
- Código Fuente: 25%
- Documentación: 20%
- Presentación: 20%
- Funcionalidad: 25%
- Creatividad: 10%
