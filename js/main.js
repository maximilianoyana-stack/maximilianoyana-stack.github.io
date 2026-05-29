async function cargarDatos(archivo) {
    try {
        const response = await fetch(`data/${archivo}.json`);
        if (!response.ok) throw new Error(`Error cargando ${archivo}.json`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function construirQueryGoogleMaps(destino) {
    const nombre = destino?.nombre?.es || '';
    const ubicacion = destino?.ubicacion || '';
    return encodeURIComponent(`${nombre}, ${ubicacion}, Puno, Peru`);
}

async function mostrarDestinos() {
    const data = await cargarDatos('destinos');
    if (!data) return;

    const container = document.getElementById('destinos-container');
    if (!container) return;

    const idioma = obtenerIdioma();
    let html = '';

    
    const filtroSelect = document.getElementById('filtro-categoria');
    if (filtroSelect && filtroSelect.options.length <= 1) {
        const nombres = data.destinos.map(d => d.nombre['es']);
        const unique = Array.from(new Set(nombres));
        unique.forEach(nombre => {
            const opt = document.createElement('option');
            opt.value = nombre;
            opt.textContent = nombre;
            filtroSelect.appendChild(opt);
        });

        document.getElementById('buscar-destino')?.addEventListener('input', (e) => {
            mostrarDestinos();
        });
        filtroSelect.addEventListener('change', () => mostrarDestinos());
        document.getElementById('limpiar-filtros')?.addEventListener('click', () => {
            if (filtroSelect) filtroSelect.value = 'todos';
            const b = document.getElementById('buscar-destino'); if (b) b.value = '';
            mostrarDestinos();
        });
    }

    const filtroSeleccionado = document.getElementById('filtro-categoria')?.value || 'todos';
    const terminoBusqueda = document.getElementById('buscar-destino')?.value || '';

    data.destinos.forEach((destino, index) => {
        
        const nombreEs = destino.nombre['es'] || '';
        const descripcionEs = destino.descripcion['es'] || '';
        if (filtroSeleccionado !== 'todos' && !nombreEs.includes(filtroSeleccionado)) return;
        if (terminoBusqueda && !(nombreEs.toLowerCase().includes(terminoBusqueda.toLowerCase()) || descripcionEs.toLowerCase().includes(terminoBusqueda.toLowerCase()))) return;
        const primeraCaracteristica = destino.caracteristicas[0] ? destino.caracteristicas[0][idioma] : '';
        const mapsQuery = construirQueryGoogleMaps(destino);
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm" style="transition: all 0.3s ease; cursor: pointer;">
                    <img src="${destino.imagen}" class="card-img-top optimized-image" alt="${destino.nombre[idioma]}" loading="lazy" decoding="async" data-srcorig="${destino.imagen}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title text-primary"><i class="fas fa-map-pin"></i> ${destino.nombre[idioma]}</h5>
                        <p class="card-text small">${destino.descripcion[idioma].substring(0, 100)}...</p>
                        <p><small class="text-muted"><i class="fas fa-location-dot"></i> ${destino.ubicacion}</small></p>
                        <p><small class="text-info"><i class="fas fa-star"></i> ${primeraCaracteristica}</small></p>
                        <div class="d-grid gap-2">
                            <button class="btn btn-warning btn-sm fw-bold" onclick="mostrarDetalleDestino(${index})">
                                <i class="fas fa-info-circle"></i> Ver Detalles
                            </button>
                            <a href="https://maps.google.com/?q=${mapsQuery}" target="_blank" class="btn btn-danger btn-sm fw-bold">
                                <i class="fas fa-map"></i> Ir a Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    enhanceImages();
}
function inicializarFormularioItinerario() {
    const form = document.getElementById('reserva-form');
    if (!form) return;

    const precios = {
        'tour-clasico': 350,
        'aventura-completa': 650
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const itinerario = document.getElementById('itinerario').value;
        const personas = parseInt(document.getElementById('personas').value) || 1;
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!nombre || !email || !itinerario) {
            alert('Por favor, complete los campos requeridos.');
            return;
        }

        const precioBase = precios[itinerario] || 400;
        const total = precioBase * personas;

        const estimacionDiv = document.getElementById('estimacion-presupuesto');
        if (estimacionDiv) {
            estimacionDiv.style.display = 'block';
            estimacionDiv.innerHTML = `<div class="alert alert-info">Presupuesto estimado: <strong>S/ ${total}</strong> (${personas} persona(s) x S/ ${precioBase})</div>`;
        }

        
        setTimeout(() => {
            alert('Solicitud enviada correctamente. Revisaremos su solicitud y le contactaremos pronto.');
            form.reset();
            if (estimacionDiv) estimacionDiv.style.display = 'none';
        }, 800);
    });
}
async function mostrarDetalleDestino(index) {
    const data = await cargarDatos('destinos');
    if (!data || !data.destinos[index]) return;

    const destino = data.destinos[index];
    const idioma = obtenerIdioma();
    const mapsQuery = construirQueryGoogleMaps(destino);

    let caracteristicasHTML = destino.caracteristicas.map(c => `<li>${c[idioma]}</li>`).join('');
    let historiaHTML = destino.historia ? `<h6 class="mt-3">📜 ${idioma === 'es' ? 'Historia' : idioma === 'en' ? 'History' : 'Willakuy'}:</h6><p>${destino.historia[idioma]}</p>` : '';

    const modalBody = `
        <div class="row">
            <div class="col-md-6">
                <img src="${destino.imagen}" alt="${destino.nombre[idioma]}" class="img-fluid rounded mb-3">
                <div id="mapa-detalle" style="width: 100%; height: 300px; margin-top: 15px; border-radius: 8px;"></div>
            </div>
            <div class="col-md-6">
                <h5><i class="fas fa-map-pin text-danger"></i> ${destino.nombre[idioma]}</h5>
                <p><strong>${idioma === 'es' ? 'Ubicación:' : idioma === 'en' ? 'Location:' : 'Ñanqa:'}:</strong> ${destino.ubicacion}</p>
                
                <h6><i class="fas fa-info-circle text-primary"></i> ${idioma === 'es' ? 'Descripción' : idioma === 'en' ? 'Description' : 'Rimay'}:</h6>
                <p>${destino.descripcion[idioma]}</p>

                ${historiaHTML}

                <h6><i class="fas fa-star text-warning"></i> ${idioma === 'es' ? 'Características' : idioma === 'en' ? 'Features' : 'Kallpanakuna'}:</h6>
                <ul class="small">
                    ${caracteristicasHTML}
                </ul>
                
                <div class="d-grid gap-2 mt-4">
                    <a href="https://maps.google.com/?q=${mapsQuery}" target="_blank" class="btn btn-danger fw-bold">
                        <i class="fas fa-map"></i> Ir a ${destino.nombre[idioma]} en Google Maps
                    </a>
                </div>
            </div>
        </div>
    `;

    
    const modal = new bootstrap.Modal(document.getElementById('detalleModal') || crearModal(), {
        keyboard: true
    });

    const modalElement = document.getElementById('detalleModal') || crearModal();
    modalElement.querySelector('.modal-title').innerHTML = `<i class="fas fa-mountain"></i> ${destino.nombre[idioma]}`;
    modalElement.querySelector('.modal-body').innerHTML = modalBody;
    modal.show();

    
    if (typeof google !== 'undefined' && google.maps) {
        setTimeout(() => {
            const fallbackPosition = { lat: destino.mapa.lat, lng: destino.mapa.lng };
            const map = new google.maps.Map(document.getElementById('mapa-detalle'), {
                center: fallbackPosition,
                zoom: destino.mapa.zoom,
                styles: [
                    { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] }
                ]
            });

            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: decodeURIComponent(mapsQuery) }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const loc = results[0].geometry.location;
                    map.setCenter(loc);
                    new google.maps.Marker({
                        position: loc,
                        map: map,
                        title: destino.nombre[idioma],
                        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    });
                } else {
                    new google.maps.Marker({
                        position: fallbackPosition,
                        map: map,
                        title: destino.nombre[idioma],
                        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    });
                }
            });
        }, 100);
    }
}

 
function crearModal() {
    const modal = document.createElement('div');
    modal.id = 'detalleModal';
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Detalles</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

 
async function mostrarCulturas() {
    const data = await cargarDatos('culturas');
    if (!data) return;

    const container = document.getElementById('culturas-container');
    if (!container) return;

    const idioma = obtenerIdioma();
    let html = '';

    function extractName(item) {
        if (!item) return '';
        if (typeof item === 'string') return item;
        if (item.nombre && typeof item.nombre === 'string') return item.nombre;
        if (item.nombre && typeof item.nombre === 'object') {
            if (item.nombre[idioma]) return item.nombre[idioma];
            const firstKey = Object.keys(item.nombre).find(k => item.nombre[k]);
            return firstKey ? item.nombre[firstKey] : '';
        }
        return '';
    }

    const rendered = new Set();

    data.categorias.forEach((categoria, catIndex) => {
        const catName = (categoria.nombre ? (typeof categoria.nombre === 'string' ? categoria.nombre : (categoria.nombre[idioma] || Object.values(categoria.nombre)[0])) : '') || '';
        const catKey = extractName(categoria).toString().trim().toLowerCase();
        if (!catKey) return;
        if (catKey.includes('luces')) return; // exclude any entries mentioning 'luces'
        if (rendered.has(catKey)) return;
        rendered.add(catKey);

        html += `
            <div class="categoria-section">
                <div class="categoria-header-pattern" style="background-image: url('img/backgrounds/Fondo.jpg');">
                    <span class="categoria-title-icon"><i class="fas fa-star"></i></span>
                    <div>
                        <h2>${extractName(categoria)}</h2>
                        <p class="lead">${categoria.descripcion ? (categoria.descripcion[idioma] || Object.values(categoria.descripcion || {})[0] || '') : ''}</p>
                    </div>
                </div>
                <div class="row g-4">
        `;

        (categoria.subcategorias || []).forEach((subcat) => {
            const subNameKey = extractName(subcat).toString().trim().toLowerCase();
            if (!subNameKey || subNameKey.includes('luces')) return;

            const caracteristicasHTML = (subcat.caracteristicas || []).map(c => `<li>${c[idioma] || Object.values(c || {})[0] || ''}</li>`).join('');
            const imagenUrl = subcat.imagen ? `${subcat.imagen}` : categoria.imagen || '';

            html += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="subcat-card">
                        <div class="img-square" style="background: #f0f4f2; position: relative;">
                            <img src="${imagenUrl}" class="optimized-image" alt="${extractName(subcat)}" loading="lazy" decoding="async" data-srcorig="${imagenUrl}">
                            <div class="subcat-image-caption"><i class="fas fa-star"></i> ${extractName(subcat)}</div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${extractName(subcat)}</h5>
                            <p class="card-text">${subcat.descripcion ? (subcat.descripcion[idioma] || Object.values(subcat.descripcion || {})[0] || '') : ''}</p>
                            <div class="mb-3">
                                <span class="fecha-badge">📅 ${subcat.fechaAniversario || ''}</span>
                            </div>
                            <div class="caracteristicas-list">
                                <strong>✨ ${idioma === 'es' ? 'Características' : idioma === 'en' ? 'Features' : 'Kallpanakuna'}:</strong>
                                <ul>
                                    ${caracteristicasHTML}
                                </ul>
                            </div>
                            <div class="significado-box">
                                <strong>💡 ${idioma === 'es' ? 'Significado' : idioma === 'en' ? 'Meaning' : 'Rimay'}:</strong>
                                <p>${subcat.significado ? (subcat.significado[idioma] || Object.values(subcat.significado || {})[0] || '') : ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    enhanceImages();
}

 
async function expandirCultura(index) {
    const data = await cargarDatos('culturas');
    if (!data || !data.culturas[index]) return;

    const cultura = data.culturas[index];
    const idioma = obtenerIdioma();

    alert(`${cultura.nombre[idioma]}\n\n${cultura.significado[idioma]}`);
}

 
async function mostrarGastronomia() {
    const data = await cargarDatos('gastronomia');
    if (!data) return;

    const container = document.getElementById('gastronomia-container');
    if (!container) return;

    const idioma = obtenerIdioma();
    let html = '';

    data.categorias.forEach(categoria => {
        
        html += `
        <div class="categoria-gastronomia mb-5 fadeInUp">
            <div class="categoria-header-pattern mb-4" style="background-image: url('img/backgrounds/Fondo.jpg');">
                <span class="categoria-title-icon"><i class="fas fa-utensils"></i></span>
                <div>
                    <h2>${categoria.nombre[idioma]}</h2>
                    <p class="lead">${categoria.descripcion[idioma]}</p>
                </div>
            </div>
            <div class="row g-4">
        `;

        
        categoria.platos.forEach(plato => {
            html += `
                <div class="col-md-6 col-lg-6 mb-4">
                    <div class="plato-card shadow-lg border-0" style="border-radius: 16px; overflow: hidden; transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                        <div class="plato-image-container img-square" style="position: relative;">
                            <img src="${plato.imagen}" class="optimized-image" alt="${plato.nombre[idioma]}" loading="lazy" decoding="async" data-srcorig="${plato.imagen}" sizes="(max-width: 991px) 100vw, 40vw">
                            <div class="plato-image-caption"><i class="fas fa-star"></i> ${plato.nombre[idioma]}</div>
                            <div class="plato-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(196, 30, 58, 0.7); opacity: 0; transition: opacity 0.4s ease; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.3rem; text-align: center; padding: 20px;">
                                <span>${plato.origen[idioma]}</span>
                            </div>
                        </div>
                        <div class="card-body p-4">
                            <h5 class="card-title fw-bold mb-2" style="color: #ffffff; font-size: 1.4rem;">
                                <i class="fas fa-star"></i> ${plato.nombre[idioma]}
                            </h5>
                            <p class="card-text text-muted mb-3" style="font-style: italic; border-left: 4px solid #FFD700; padding-left: 12px;">
                                ${plato.descripcion[idioma]}
                            </p>
                            
                            <div class="mb-3" style="background-color: #f8f9fa; padding: 12px; border-radius: 8px;">
                                <p class="mb-2"><small><i class="fas fa-clock"></i> <strong>Preparación:</strong> ${plato.tiempo_preparacion}</small></p>
                                <p class="mb-2"><small><i class="fas fa-users"></i> <strong>Porciones:</strong> ${plato.porciones}</small></p>
                                <p class="mb-0"><small><i class="fas fa-thermometer"></i> <strong>Temperatura:</strong> ${plato.temperatura}</small></p>
                            </div>

                            <div class="mb-3">
                                <p class="fw-bold mb-2" style="color: #1a472a;"><i class="fas fa-leaf"></i> Ingredientes principales:</p>
                                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                    ${plato.ingredientes.slice(0, 4).map(ing => 
                                        `<span style="background-color: #e8f5e9; color: #1a472a; padding: 6px 10px; border-radius: 20px; font-size: 0.85rem;">
                                            ${ing[idioma]}
                                        </span>`
                                    ).join('')}
                                </div>
                            </div>

                            <div class="mb-3">
                                <p class="fw-bold mb-2" style="color: #004B87;"><i class="fas fa-sparkles"></i> Características:</p>
                                <ul style="padding-left: 20px; margin: 0; font-size: 0.9rem;">
                                    ${plato.caracteristicas.map(car => 
                                        `<li style="margin-bottom: 6px; color: #555;">${car[idioma]}</li>`
                                    ).join('')}
                                </ul>
                            </div>

                            <button class="btn btn-danger w-100 fw-bold btn-ver-completo" 
                                data-plato='${JSON.stringify(plato)}' 
                                data-idioma='${idioma}'>
                                <i class="fas fa-eye"></i> Ver Completo
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
            </div>
        </div>
        `;
    });

    container.innerHTML = html;

    
    const platoCards = container.querySelectorAll('.plato-card');
    platoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px)';
            this.style.boxShadow = '0 20px 40px rgba(196, 30, 58, 0.3)';
            const img = this.querySelector('img');
            if (img) img.style.transform = 'scale(1.1)';
            const overlay = this.querySelector('.plato-overlay');
            if (overlay) overlay.style.opacity = '1';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
            const img = this.querySelector('img');
            if (img) img.style.transform = 'scale(1)';
            const overlay = this.querySelector('.plato-overlay');
            if (overlay) overlay.style.opacity = '0';
        });
    });

    
    container.querySelectorAll('.btn-ver-completo').forEach(btn => {
        btn.addEventListener('click', function() {
            const platoData = JSON.parse(this.getAttribute('data-plato'));
            const idioma = this.getAttribute('data-idioma');
            mostrarDetallePlato(platoData.nombre[idioma], platoData, idioma);
        });
    });
}

 
async function enhanceImages() {
    const imgs = Array.from(document.querySelectorAll('img.optimized-image[data-srcorig]:not([data-optimized])'));
    if (!imgs.length) return;

    const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

    await Promise.all(imgs.map(async (img) => {
        img.setAttribute('data-optimized', '1');
        const orig = img.getAttribute('data-srcorig');
        if (!orig) return;

        
        const m = orig.match(/^(.*)(\.[a-zA-Z0-9]+)$/);
        if (!m) return;
        const candidate = `${m[1]}@2x${m[2]}`;

        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 1000);
            const resp = await fetch(candidate, { method: 'GET', cache: 'force-cache', credentials: 'same-origin', signal: controller.signal });
            clearTimeout(id);
            if (resp && resp.ok) {
                img.setAttribute('srcset', `${orig} 1x, ${candidate} 2x`);
                
                if (!img.getAttribute('sizes')) img.setAttribute('sizes', '(max-width: 991px) 100vw, 40vw');
            }
        } catch (e) {
            
        }
    }));
}

 
function mostrarReceta(btn) {
    const card = btn.closest('.card');
    const titulo = card.querySelector('.card-title').textContent;
    
    if (card.classList.contains('expanded')) {
        card.classList.remove('expanded');
        btn.textContent = 'Ver Receta';
    } else {
        card.classList.add('expanded');
        btn.textContent = 'Ocultar Receta';
        alert(`Receta de ${titulo}\n\nIngredientes y preparación disponibles. Contacte para más detalles.`);
    }
}

 
async function mostrarItinerarios() {
    const data = await cargarDatos('itinerarios');
    if (!data) return;

    const container = document.getElementById('itinerarios-container');
    if (!container) return;

    const idioma = obtenerIdioma();
    let html = '';

    data.itinerarios.forEach((itinerario, idx) => {
        html += `
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${itinerario.nombre[idioma]}</h5>
                        <p><strong>Duración:</strong> ${itinerario.duracion}</p>
                        <p><strong>Dificultad:</strong> ${itinerario.dificultad}</p>
                        <p><strong>Precio:</strong> ${itinerario.precio}</p>
                        <button class="btn btn-primary btn-sm" onclick="expandirItinerario(${idx})">
                            ${document.querySelector('[data-i18n="actividades"]')?.textContent || 'Ver detalles'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    enhanceImages();
}
 
async function expandirItinerario(index) {
    const data = await cargarDatos('itinerarios');
    if (!data || !data.itinerarios[index]) return;

    const itinerario = data.itinerarios[index];
    const idioma = obtenerIdioma();

    let detalles = `${itinerario.nombre[idioma]}\n\nDías:\n`;
    itinerario.dias.forEach(dia => {
        detalles += `\nDía ${dia.numero}: ${dia.titulo[idioma]}\n`;
    });

    alert(detalles);
}

function resolverTextoPorIdioma(value, idioma) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
        if (value[idioma]) return value[idioma];
        const first = Object.keys(value).find(k => value[k]);
        return first ? value[first] : '';
    }
    return '';
}

function normalizarItemsCarrusel(items) {
    const seen = new Set();
    const out = [];

    items.forEach(item => {
        const src = (item?.src || '').trim();
        if (!src) return;
        const key = src.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        out.push({
            src,
            title: item.title || '',
            subtitle: item.subtitle || ''
        });
    });

    return out;
}

function obtenerTituloCarruselPorPagina(pageId) {
    if (pageId === 'page-inicio') return 'Galeria Principal';
    if (pageId === 'page-destinos') return 'Galeria de Destinos';
    if (pageId === 'page-culturas') return 'Galeria de Culturas';
    if (pageId === 'page-gastronomia') return 'Galeria de Gastronomia';
    if (pageId === 'page-itinerario') return 'Galeria de Itinerarios';
    if (pageId === 'page-blog') return 'Galeria de Inspiracion';
    return 'Galeria de Imagenes';
}

function obtenerItemsHeroIndex() {
    const slides = Array.from(document.querySelectorAll('#carouselHero .carousel-item'));
    if (!slides.length) return [];

    const items = slides.map(slide => {
        const bg = slide.querySelector('.slide-background');
        const title = slide.querySelector('h1')?.textContent?.trim() || '';
        const subtitle = slide.querySelector('p')?.textContent?.trim() || '';
        const style = bg?.getAttribute('style') || '';
        const match = style.match(/url\(['"]?(.+?)['"]?\)/i);
        return {
            src: match ? match[1] : '',
            title,
            subtitle
        };
    });

    return normalizarItemsCarrusel(items);
}

async function obtenerItemsCarruselPorPagina(pageId) {
    const idioma = obtenerIdioma();

    if (pageId === 'page-destinos') {
        const data = await cargarDatos('destinos');
        if (!data?.destinos) return [];
        return normalizarItemsCarrusel(data.destinos.map(d => ({
            src: d.imagen,
            title: resolverTextoPorIdioma(d.nombre, idioma),
            subtitle: d.ubicacion || ''
        })));
    }

    if (pageId === 'page-culturas') {
        const data = await cargarDatos('culturas');
        if (!data?.categorias) return [];
        const items = [];
        data.categorias.forEach(cat => {
            items.push({
                src: cat.imagen,
                title: resolverTextoPorIdioma(cat.nombre, idioma),
                subtitle: 'Cultura de Puno'
            });
            (cat.subcategorias || []).forEach(sub => {
                items.push({
                    src: sub.imagen || cat.imagen,
                    title: resolverTextoPorIdioma(sub.nombre, idioma),
                    subtitle: sub.fechaAniversario || 'Tradición viva'
                });
            });
        });
        return normalizarItemsCarrusel(items);
    }

    if (pageId === 'page-gastronomia') {
        const data = await cargarDatos('gastronomia');
        if (!data?.categorias) return [];
        const items = [];
        data.categorias.forEach(cat => {
            items.push({
                src: cat.imagen,
                title: resolverTextoPorIdioma(cat.nombre, idioma),
                subtitle: resolverTextoPorIdioma(cat.descripcion, idioma)
            });
            (cat.platos || []).forEach(plato => {
                items.push({
                    src: plato.imagen,
                    title: resolverTextoPorIdioma(plato.nombre, idioma),
                    subtitle: resolverTextoPorIdioma(plato.origen, idioma)
                });
            });
        });
        return normalizarItemsCarrusel(items);
    }

    if (pageId === 'page-itinerario') {
        const destinos = await cargarDatos('destinos');
        const itinerarios = await cargarDatos('itinerarios');
        const items = [];

        (itinerarios?.itinerarios || []).forEach(it => {
            items.push({
                src: it.imagen,
                title: resolverTextoPorIdioma(it.nombre, idioma),
                subtitle: it.duracion || 'Itinerario'
            });
        });

        (destinos?.destinos || []).slice(0, 6).forEach(d => {
            items.push({
                src: d.imagen,
                title: resolverTextoPorIdioma(d.nombre, idioma),
                subtitle: d.ubicacion || ''
            });
        });

        return normalizarItemsCarrusel(items);
    }

    if (pageId === 'page-inicio') {
        return obtenerItemsHeroIndex();
    }

    if (pageId === 'page-blog') {
        const destinos = await cargarDatos('destinos');
        const culturas = await cargarDatos('culturas');
        const items = [];

        (destinos?.destinos || []).slice(0, 6).forEach(d => {
            items.push({
                src: d.imagen,
                title: resolverTextoPorIdioma(d.nombre, idioma),
                subtitle: d.ubicacion || ''
            });
        });

        (culturas?.categorias || []).slice(0, 6).forEach(c => {
            items.push({
                src: c.imagen,
                title: resolverTextoPorIdioma(c.nombre, idioma),
                subtitle: 'Cultura y Tradición'
            });
        });

        return normalizarItemsCarrusel(items);
    }

    return [];
}

function renderizarCarruselGlobal(items, titulo = 'Galeria de Imagenes', insertTop = false) {
    if (!items || items.length < 2) return;

    const carouselId = 'dynamic-page-carousel';
    let section = document.getElementById('dynamic-page-carousel-section');
    if (!section) {
        section = document.createElement('section');
        section.id = 'dynamic-page-carousel-section';
        section.className = 'py-5 page-gallery-section';
        if (insertTop && document.body) {
            document.body.insertBefore(section, document.body.firstChild);
        } else {
            
            const footer = document.querySelector('footer');
            if (footer && footer.parentNode) {
                footer.parentNode.insertBefore(section, footer);
            } else {
                document.body.appendChild(section);
            }
        }
    }

    const indicators = items.map((_, i) =>
        `<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}" ${i === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${i + 1}"></button>`
    ).join('');

    const slides = items.map((item, i) => `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
            <img src="${item.src}" class="d-block w-100 optimized-image" alt="${escaparHTML(item.title || 'Galería Puno')}" loading="lazy" decoding="async" data-srcorig="${item.src}">
            <div class="carousel-caption d-none d-md-block page-gallery-caption">
                <h5>${escaparHTML(item.title || 'Puno')}</h5>
                <p>${escaparHTML(item.subtitle || 'Explora los mejores lugares de Puno')}</p>
            </div>
        </div>
    `).join('');

    
    section.innerHTML = `
        <div class="container-fluid p-0">
            <div id="${carouselId}" class="carousel slide carousel-fade page-gallery-carousel" data-bs-ride="carousel" data-bs-interval="3800">
                <div class="carousel-indicators">${indicators}</div>
                <div class="carousel-inner">${slides}</div>
                <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Siguiente</span>
                </button>
            </div>
        </div>
    `;

    enhanceImages();
}

async function inicializarCarruselGlobalPagina() {
    const pageId = document.body?.id;
    if (!pageId) return;
    
    if (pageId === 'page-inicio') return;
    
    if (document.getElementById('carouselHeroDestinos') ||
        document.getElementById('carouselHeroCulturas') ||
        document.getElementById('carouselHeroGastronomia') ||
        document.getElementById('carouselHeroItinerario') ||
        document.getElementById('carouselHeroBlog') ||
        document.getElementById('carouselHero')) return;

    const insertTop = true;
    const items = await obtenerItemsCarruselPorPagina(pageId);
    const titulo = obtenerTituloCarruselPorPagina(pageId);
    renderizarCarruselGlobal(items, titulo, insertTop);
}

 
document.addEventListener('DOMContentLoaded', function() {
    
    const body = document.body;

    if (body.id === 'page-destinos') {
        mostrarDestinos();
    } else if (body.id === 'page-culturas') {
        mostrarCulturas();
    } else if (body.id === 'page-gastronomia') {
        mostrarGastronomia();
    } else if (body.id === 'page-itinerario') {
        mostrarItinerarios();
        inicializarFormularioItinerario();
    } else if (body.id === 'page-blog') {
        inicializarBlog();
    }

    
    if (body.id === 'page-inicio') {
        inicializarHeroIndex();
    }

    inicializarCarruselGlobalPagina();

    
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar-custom');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
});

 
async function inicializarHeroIndex() {
    const carouselEl = document.getElementById('carouselHero');
    if (!carouselEl) return;

    
    const HERO_MAX = 8;
    let items = [];
    try {
        const data = await cargarDatos('destinos');
        const idioma = obtenerIdioma();
        if (data?.destinos && data.destinos.length) {
            items = normalizarItemsCarrusel(data.destinos.slice(0, HERO_MAX).map(d => ({
                src: d.imagen,
                title: resolverTextoPorIdioma(d.nombre, idioma),
                subtitle: d.ubicacion || ''
            })));
        }
    } catch (e) {
        console.warn('No se pudo cargar destinos para hero:', e);
    }

    
    if (!items || items.length === 0) {
        items = await obtenerItemsCarruselPorPagina('page-inicio');
    }

    if (!items || !items.length) return;

    const inner = carouselEl.querySelector('.carousel-inner');
    const indicators = carouselEl.querySelector('.carousel-indicators');
    if (!inner) return;

    inner.innerHTML = '';
    if (indicators) indicators.innerHTML = '';

    items.forEach((it, idx) => {
        const div = document.createElement('div');
        div.className = 'carousel-item' + (idx === 0 ? ' active' : '');
        div.innerHTML = `
            <div class="slide-background" style="background-image: url('${it.src}');"></div>
            <div class="carousel-caption d-none d-md-block">
                <div class="content-left">
                    <h1 class="display-2 fw-bold">${it.title}</h1>
                    <p class="lead fs-3">${it.subtitle}</p>
                    <div class="hero-cta"><a href="itinerario.html" class="btn btn-cta btn-lg fw-bold">Viajar ahora</a></div>
                </div>
                <a href="destinos.html" class="btn btn-warning btn-lg btn-bottom-right fw-bold">Ver más</a>
            </div>
        `;
        inner.appendChild(div);

        if (indicators) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('data-bs-target', '#carouselHero');
            btn.setAttribute('data-bs-slide-to', String(idx));
            if (idx === 0) { btn.className = 'active'; btn.setAttribute('aria-current', 'true'); }
            btn.setAttribute('aria-label', `Slide ${idx + 1}`);
            indicators.appendChild(btn);
        }
    });

    
    try {
        if (window.bootstrap && carouselEl) {
            const inst = bootstrap.Carousel.getInstance(carouselEl);
            if (inst) inst.dispose();
            new bootstrap.Carousel(carouselEl, { interval: 4000, ride: 'carousel', touch: true, pause: 'hover' });
        }
    } catch (e) {
        console.warn('Error reiniciando carousel:', e);
    }
}

 
function actualizarPagina() {
    const body = document.body;
    if (body.id === 'page-destinos') {
        mostrarDestinos();
    } else if (body.id === 'page-culturas') {
        mostrarCulturas();
    } else if (body.id === 'page-gastronomia') {
        mostrarGastronomia();
    } else if (body.id === 'page-itinerario') {
        mostrarItinerarios();
    } else if (body.id === 'page-blog') {
        renderBlogComentarios();
    }

    inicializarCarruselGlobalPagina();
}

 
function mostrarDetallePlato(nombre, platoData, idioma) {
    
    let plato = typeof platoData === 'string' ? JSON.parse(platoData) : platoData;
    
    
    const modalId = 'modal-plato-' + Date.now();
    const ingredientesHTML = plato.ingredientes.map(ing => 
        `<li class="list-group-item">${ing[idioma]}</li>`
    ).join('');
    
    const caracteristicasHTML = plato.caracteristicas.map(car => 
        `<li class="list-group-item"><i class="fas fa-check" style="color: #C41E3A;"></i> ${car[idioma]}</li>`
    ).join('');

    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header" style="background: linear-gradient(135deg, #C41E3A 0%, #FFD700 100%); color: white;">
                        <h5 class="modal-title fw-bold">
                            <i class="fas fa-utensils"></i> ${plato.nombre[idioma]}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <img src="${plato.imagen}" alt="${plato.nombre[idioma]}" 
                                    style="width: 100%; height: 280px; object-fit: cover; border-radius: 12px;">
                            </div>
                            <div class="col-md-6">
                                <p class="mb-2"><strong style="color: #1a472a;">Origen:</strong> ${plato.origen[idioma]}</p>
                                <p class="mb-2"><strong style="color: #1a472a;">Descripción:</strong></p>
                                <p style="font-style: italic; color: #555;">${plato.descripcion[idioma]}</p>
                                <div class="alert alert-warning" role="alert">
                                    <p class="mb-1"><i class="fas fa-clock"></i> <strong>Tiempo:</strong> ${plato.tiempo_preparacion}</p>
                                    <p class="mb-1"><i class="fas fa-users"></i> <strong>Porciones:</strong> ${plato.porciones}</p>
                                    <p class="mb-0"><i class="fas fa-thermometer"></i> <strong>Temperatura:</strong> ${plato.temperatura}</p>
                                </div>
                            </div>
                        </div>
                        
                        <h6 class="fw-bold mt-4 mb-3" style="color: #C41E3A;">
                            <i class="fas fa-leaf"></i> Ingredientes Completos:
                        </h6>
                        <ul class="list-group mb-4">
                            ${ingredientesHTML}
                        </ul>

                        <h6 class="fw-bold mb-3" style="color: #1a472a;">
                            <i class="fas fa-sparkles"></i> Características del Plato:
                        </h6>
                        <ul class="list-group">
                            ${caracteristicasHTML}
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();

    
    document.getElementById(modalId).addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

const BLOG_COMMENTS_KEY = 'puno_blog_comments_v1';
const BLOG_POST_REACTIONS_KEY = 'puno_blog_post_reactions_v1';

function escaparHTML(texto) {
    return String(texto || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function leerComentariosBlog() {
    try {
        const raw = localStorage.getItem(BLOG_COMMENTS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function guardarComentariosBlog(comentarios) {
    localStorage.setItem(BLOG_COMMENTS_KEY, JSON.stringify(comentarios));
}

function leerReaccionesPosts() {
    try {
        const raw = localStorage.getItem(BLOG_POST_REACTIONS_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
        return {};
    }
}

function guardarReaccionesPosts(data) {
    localStorage.setItem(BLOG_POST_REACTIONS_KEY, JSON.stringify(data));
}

function formatearFecha(isoString) {
    try {
        return new Date(isoString).toLocaleString('es-PE', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return isoString;
    }
}

function renderBlogPosts() {
    const container = document.getElementById('blog-highlights');
    if (!container) return;

    const posts = [
        {
            id: 'festivales',
            titulo: 'Guia de Festivales en Puno',
            resumen: 'Fechas clave, consejos de vestimenta y zonas recomendadas para vivir la Candelaria.',
            etiqueta: 'Tradiciones'
        },
        {
            id: 'islas',
            titulo: 'Ruta Ideal por Uros, Taquile y Amantani',
            resumen: 'Como organizar un viaje de 1, 2 o 3 dias por el lago con presupuesto realista.',
            etiqueta: 'Destinos'
        },
        {
            id: 'sabores',
            titulo: 'Sabores Puneños que Debes Probar',
            resumen: 'Platos tradicionales, mercados locales y recomendaciones para turistas primerizos.',
            etiqueta: 'Gastronomia'
        }
    ];

    const reacciones = leerReaccionesPosts();
    container.innerHTML = posts.map(post => {
        const likes = Number(reacciones[post.id] || 0);
        return `
            <article class="blog-post-card">
                <span class="blog-tag">${escaparHTML(post.etiqueta)}</span>
                <h4>${escaparHTML(post.titulo)}</h4>
                <p>${escaparHTML(post.resumen)}</p>
                <button class="btn btn-outline-primary btn-sm blog-react-btn" data-post-id="${post.id}">
                    <i class="fas fa-heart"></i> Me interesa <span class="blog-react-count">${likes}</span>
                </button>
            </article>
        `;
    }).join('');
}

function renderBlogComentarios() {
    const container = document.getElementById('blog-comments-list');
    if (!container) return;

    const filtro = (document.getElementById('blog-search')?.value || '').trim().toLowerCase();
    const orden = document.getElementById('blog-sort')?.value || 'nuevos';
    let comentarios = leerComentariosBlog();

    if (filtro) {
        comentarios = comentarios.filter(c => {
            const base = `${c.nombre || ''} ${c.tema || ''} ${c.mensaje || ''}`.toLowerCase();
            return base.includes(filtro);
        });
    }

    comentarios.sort((a, b) => {
        if (orden === 'antiguos') return new Date(a.fecha) - new Date(b.fecha);
        if (orden === 'valorados') return Number(b.likes || 0) - Number(a.likes || 0);
        return new Date(b.fecha) - new Date(a.fecha);
    });

    if (!comentarios.length) {
        container.innerHTML = `
            <div class="blog-empty-state">
                <i class="fas fa-comments"></i>
                <p>Aun no hay comentarios para mostrar. Se el primero en compartir tu experiencia.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = comentarios.map(c => `
        <article class="blog-comment-card" data-id="${c.id}">
            <div class="blog-comment-head">
                <div>
                    <h6>${escaparHTML(c.nombre)}</h6>
                    <small>${escaparHTML(c.tema || 'General')} · ${formatearFecha(c.fecha)}</small>
                </div>
                <span class="badge bg-info text-dark">${escaparHTML(c.tipo || 'Comentario')}</span>
            </div>
            <p>${escaparHTML(c.mensaje)}</p>
            <div class="blog-comment-actions">
                <button class="btn btn-sm btn-outline-primary blog-like-comment" data-id="${c.id}">
                    <i class="fas fa-thumbs-up"></i> Util (${Number(c.likes || 0)})
                </button>
                <button class="btn btn-sm btn-outline-danger blog-delete-comment" data-id="${c.id}">
                    <i class="fas fa-trash"></i> Quitar
                </button>
            </div>
        </article>
    `).join('');
}

function inicializarBlog() {
    const form = document.getElementById('blog-comment-form');
    if (!form) return;

    renderBlogPosts();
    renderBlogComentarios();

    document.getElementById('blog-highlights')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.blog-react-btn');
        if (!btn) return;
        const postId = btn.getAttribute('data-post-id');
        if (!postId) return;
        const reacciones = leerReaccionesPosts();
        reacciones[postId] = Number(reacciones[postId] || 0) + 1;
        guardarReaccionesPosts(reacciones);
        renderBlogPosts();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('blog-nombre')?.value.trim();
        const tipo = document.getElementById('blog-tipo')?.value.trim();
        const tema = document.getElementById('blog-tema')?.value.trim();
        const mensaje = document.getElementById('blog-mensaje')?.value.trim();

        if (!nombre || !mensaje) {
            alert('Completa nombre y comentario antes de publicar.');
            return;
        }

        const comentarios = leerComentariosBlog();
        comentarios.push({
            id: Date.now().toString(),
            nombre,
            tipo: tipo || 'Comentario',
            tema: tema || 'General',
            mensaje,
            fecha: new Date().toISOString(),
            likes: 0
        });

        guardarComentariosBlog(comentarios);
        form.reset();
        renderBlogComentarios();
    });

    document.getElementById('blog-sort')?.addEventListener('change', renderBlogComentarios);
    document.getElementById('blog-search')?.addEventListener('input', renderBlogComentarios);

    document.getElementById('blog-comments-list')?.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.blog-like-comment');
        const deleteBtn = e.target.closest('.blog-delete-comment');

        if (likeBtn) {
            const id = likeBtn.getAttribute('data-id');
            const comentarios = leerComentariosBlog();
            const item = comentarios.find(c => c.id === id);
            if (item) {
                item.likes = Number(item.likes || 0) + 1;
                guardarComentariosBlog(comentarios);
                renderBlogComentarios();
            }
            return;
        }

        if (deleteBtn) {
            const id = deleteBtn.getAttribute('data-id');
            const comentarios = leerComentariosBlog().filter(c => c.id !== id);
            guardarComentariosBlog(comentarios);
            renderBlogComentarios();
        }
    });
}
