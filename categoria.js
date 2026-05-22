const numeroWhatsApp = "595986338010";

// ── ESTILOS DEL CARRUSEL (Actualizados para evitar recortes) ────────────────
const style = document.createElement('style');
style.textContent = `
.carousel { 
    position: relative; 
    width: 100%; 
    aspect-ratio: 4 / 5; /* Mantiene proporción vertical estética */
    overflow: hidden; 
    background: #ffffff; 
}
.carousel-track { 
    display: flex; 
    height: 100%; 
    transition: transform 0.4s ease; 
}
.carousel-track img { 
    width: 100%; 
    height: 100%; 
    object-fit: contain; /* Muestra la imagen completa sin recortes */
    flex-shrink: 0; 
    background: #ffffff; 
}
.carousel-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(255,255,255,0.92); border: none; border-radius: 50%;
    width: 35px; height: 35px; cursor: pointer; font-size: 18px; line-height: 1;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.2s; z-index: 5; box-shadow: 0 2px 5px rgba(0,0,0,0.15);
}
.card:hover .carousel-btn { opacity: 1; }
.carousel-btn.prev { left: 8px; }
.carousel-btn.next { right: 8px; }
.carousel-dots {
    position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 6px; z-index: 5;
}
.carousel-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(0,0,0,0.2); border: none; cursor: pointer;
    padding: 0; transition: all 0.3s;
}
.carousel-dot.active { background: #506549; width: 12px; border-radius: 4px; }

/* Contenedor para fotos individuales para que respeten el mismo tamaño */
.img-container {
    width: 100%;
    aspect-ratio: 4 / 5;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
.img-container img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
`;
document.head.appendChild(style);

let carouselCount = 0;

// ── HELPERS ──────────────────────────────────────────────────
function stockTag(stock) {
    if (stock === 0) return { clase: 'sin-stock', texto: 'Sin stock' };
    if (stock === 1) return { clase: 'urgencia', texto: '\u00a1\u00daltima unidad!' };
    if (stock < 10) return { clase: 'urgencia', texto: `\u00a1\u00daltimas ${stock} unidades!` };
    return { clase: 'disponible', texto: `Stock: ${stock} unidades` };
}

// ── RENDER GRILLA ────────────────────────────────────────────
function renderGrid(productos, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    if (!productos || productos.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>Pr\u00f3ximamente m\u00e1s productos en esta categor\u00eda.</p></div>';
        return;
    }

    grid.innerHTML = productos.map(p => {
        const tag = stockTag(p.stock);

        const btn = p.stock === 0
            ? `<button class="btn btn-disabled" disabled>Agotado</button>`
            : `<button class="btn btn-buy" onclick="addToCart(${p.id}, '${p.nombre.replace(/'/g, "\\'")}', ${p.precio || 0})">Agregar a consulta</button>`;

        const precio = p.precio
            ? `<div class="card-price">Gs. ${p.precio.toLocaleString('de-DE')}</div>`
            : '';

        const fotos = p.fotos
            ? p.fotos.filter(f => f)
            : [p.foto1, p.foto2].filter(f => f);

        const cid = `c${carouselCount++}`;

        let imagenes = '';

        if (fotos.length <= 1) {
            imagenes = `
                <div class="img-container">
                    <img src="${fotos[0] || ''}" alt="${p.nombre}" onerror="this.style.opacity='0'">
                </div>`;
        } else {
            const imgs = fotos.map(f =>
                `<img src="${f}" alt="${p.nombre}" onerror="this.style.opacity='0'">`
            ).join('');
            
            const dots = `
                <div class="carousel-dots">
                    ${fotos.map((_, i) =>
                        `<button class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="event.stopPropagation(); goTo('${cid}', ${i})"></button>`
                    ).join('')}
                </div>`;

            imagenes = `
                <div class="carousel" id="${cid}">
                    <div class="carousel-track">${imgs}</div>
                    <button class="carousel-btn prev" onclick="event.stopPropagation(); slide('${cid}', -1)">&#8249;</button>
                    <button class="carousel-btn next" onclick="event.stopPropagation(); slide('${cid}', 1)">&#8250;</button>
                    ${dots}
                </div>`;
        }

        return `
            <div class="card">
                ${imagenes}
                <div class="card-info">
                    <span class="stock-tag ${tag.clase}">${tag.texto}</span>
                    <h3 class="card-title">${p.nombre}</h3>
                    ${precio}
                    ${btn}
                </div>
            </div>
        `;
    }).join('');
}

// ── CARRUSEL — controles (Mejorados con stopPropagation) ──────
function getCurrentIndex(cid) {
    const track = document.querySelector(`#${cid} .carousel-track`);
    if (!track) return 0;
    const val = track.style.transform;
    if (!val) return 0;
    const match = val.match(/-?([\d.]+)%/);
    return match ? Math.round(parseFloat(match[1]) / 100) : 0;
}

function slide(cid, dir) {
    const c = document.getElementById(cid);
    const track = c.querySelector('.carousel-track');
    const dots = c.querySelectorAll('.carousel-dot');
    const total = track.children.length;
    const current = getCurrentIndex(cid);
    const next = (current + dir + total) % total;
    track.style.transform = `translateX(-${next * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === next));
}

function goTo(cid, index) {
    const c = document.getElementById(cid);
    const track = c.querySelector('.carousel-track');
    const dots = c.querySelectorAll('.carousel-dot');
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

// ── CARRITO ───────────────────────────────────────────────────
function addToCart(id, nombre, precio) {
    carrito.push({ id, nombre, precio });
    const count = carrito.length;
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = `${count} item${count !== 1 ? 's' : ''}`;
    }

    document.querySelectorAll('.btn-buy').forEach(b => {
        if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(`addToCart(${id},`)) {
            const originalText = b.innerText;
            b.innerText = '\u00a1A\u00f1adido!';
            setTimeout(() => b.innerText = originalText, 1100);
        }
    });
}

function showTab(tabId, btn) {
    document.querySelectorAll('.subcat-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.subcat-tab').forEach(t => t.classList.remove('active'));
    const targetPanel = document.getElementById('panel-' + tabId);
    if (targetPanel) targetPanel.classList.add('active');
    if (btn) btn.classList.add('active');
}

function showSubTab(subtab, btn) {
    document.querySelectorAll('.sub-subcat-panel').forEach(p => p.classList.remove('active'));
    const panel = document.querySelector('#panel-' + subtab);
    if (panel) panel.classList.add('active');
    document.querySelectorAll('.sub-subcat-tab').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

function sendWhatsApp() {
    if (carrito.length === 0) return alert('No hay productos seleccionados.');

    const tienePrecios = carrito.some(p => p.precio > 0);
    let mensaje = `Hola! Quisiera consultar sobre los siguientes productos de *${CATEGORIA}*:%0A%0A`;

    carrito.forEach((p, i) => {
        const precioStr = p.precio > 0
            ? ` \u2014 Gs. ${p.precio.toLocaleString('de-DE')}`
            : '';
        mensaje += `${i + 1}. ${p.nombre}${precioStr}%0A`;
    });

    if (tienePrecios) {
        const total = carrito.reduce((sum, p) => sum + (p.precio || 0), 0);
        mensaje += `%0A*Total referencial: Gs. ${total.toLocaleString('de-DE')}*%0A`;
    }

    mensaje += `%0A\u00bfMe confirman disponibilidad?`;
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
}