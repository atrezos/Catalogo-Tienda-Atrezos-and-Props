const numeroWhatsApp = "595986338010";

// ── PRECIOS DESDE precios.json ────────────────────────────────
// FERIA_MODE viene de config.js (true/false)
let _precios = {}, _preciosFeria = {};
fetch('precios.json')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
        _precios      = data.normal || {};
        _preciosFeria = data.feria  || {};
        // Re-renderizar grillas con precios ya cargados
        if (typeof _renderQueue !== 'undefined') {
            _renderQueue.forEach(([arr, id]) => renderGrid(arr, id));
            _renderQueue = [];
        }
    })
    .catch(() => {});

// Cola para re-renderizar si los precios llegan después del DOM
let _renderQueue = [];

// ── ESTILOS DEL CARRUSEL ────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
.carousel { 
    position: relative; 
    width: 100%; 
    aspect-ratio: 4 / 5;
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
    object-fit: contain;
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

/* Modo feria */
.precio-feria { color: #b06030 !important; font-weight: 700; }
.btn-buy.feria-mode { background: #506549; color: #fff; }
.btn-buy.feria-mode:hover { background: #3d4f37; }

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

/* ── PANEL LATERAL DEL CARRITO ────────────────────────────── */
.cart-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 998;
    opacity: 0; pointer-events: none;
    transition: opacity 0.25s;
}
.cart-overlay.open { opacity: 1; pointer-events: all; }

.cart-panel {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: min(400px, 100vw);
    background: #fff;
    z-index: 999;
    transform: translateX(100%);
    transition: transform 0.32s cubic-bezier(.4,0,.2,1);
    display: flex; flex-direction: column;
    box-shadow: -6px 0 32px rgba(0,0,0,0.13);
    font-family: 'Jost', sans-serif;
}
.cart-panel.open { transform: translateX(0); }

.cart-panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 22px 18px;
    border-bottom: 1px solid #ece9e4;
}
.cart-panel-header h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem; font-weight: 600;
    color: #2a2a2a; margin: 0;
}
.cart-panel-close {
    background: #f5f3f0; border: none; border-radius: 50%;
    width: 34px; height: 34px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: #555;
    transition: background 0.2s;
}
.cart-panel-close:hover { background: #ece9e4; }

.cart-panel-items {
    flex: 1; overflow-y: auto; padding: 16px 22px;
}

.cart-panel-empty {
    text-align: center; padding: 52px 20px; color: #999;
}
.cart-panel-empty p { font-size: 0.88rem; margin-top: 8px; }

.cart-panel-item {
    display: flex; gap: 13px;
    padding: 13px 0;
    border-bottom: 1px solid #f0ede9;
    align-items: flex-start;
}
.cart-panel-item img {
    width: 62px; height: 62px;
    object-fit: cover; border-radius: 6px;
    background: #f5f3f0; flex-shrink: 0;
}
.cart-panel-item-info { flex: 1; min-width: 0; }
.cart-panel-item-name {
    font-size: 0.85rem; font-weight: 500;
    color: #2a2a2a; line-height: 1.35;
}
.cart-panel-item-cat {
    font-size: 0.75rem; color: #999; margin-top: 2px;
}
.cart-panel-item-controls {
    display: flex; align-items: center; gap: 8px; margin-top: 8px;
}
.qty-btn {
    width: 26px; height: 26px; border-radius: 50%;
    border: 1.5px solid #ddd; background: #fff;
    cursor: pointer; font-size: 1rem; color: #555;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.15s, color 0.15s;
    line-height: 1;
}
.qty-btn:hover { border-color: #506549; color: #506549; }
.qty-num { font-size: 0.85rem; font-weight: 600; min-width: 18px; text-align: center; color: #2a2a2a; }
.cart-item-remove {
    background: none; border: none; cursor: pointer;
    color: #bbb; font-size: 0.75rem; padding: 0; margin-left: auto;
    transition: color 0.15s;
}
.cart-item-remove:hover { color: #c0392b; }

.cart-panel-footer {
    padding: 18px 22px 22px;
    border-top: 1px solid #ece9e4;
}
.cart-panel-hint {
    font-size: 0.78rem; color: #888;
    margin-bottom: 14px; line-height: 1.4;
}
.cart-panel-wa-btn {
    width: 100%;
    background: #25d366; color: #fff;
    border: none; border-radius: 50px;
    padding: 14px 20px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    cursor: pointer; font-size: 0.92rem; font-weight: 600;
    font-family: 'Jost', sans-serif;
    transition: background 0.2s;
}
.cart-panel-wa-btn:hover { background: #1ebe5d; }
.cart-panel-wa-btn svg { width: 20px; height: 20px; fill: #fff; flex-shrink: 0; }

/* Toast */
.cart-toast {
    position: fixed; bottom: 80px; left: 50%;
    transform: translateX(-50%) translateY(16px);
    background: #2a2a2a; color: #fff;
    padding: 9px 20px; border-radius: 50px;
    font-size: 0.82rem; font-weight: 500;
    font-family: 'Jost', sans-serif;
    z-index: 1100; opacity: 0; pointer-events: none;
    transition: opacity 0.25s, transform 0.25s;
    white-space: nowrap;
}
.cart-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* Total en panel carrito */
.cart-panel-total {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 0 14px;
    font-size: 0.95rem; font-weight: 700;
    border-bottom: 1px solid #ece9e4;
    margin-bottom: 14px;
    color: #2a2a2a;
}
.cart-panel-total span:last-child { color: #506549; }
.cart-item-precio {
    font-size: 0.8rem; font-weight: 600;
    color: #506549; margin-top: 3px;
}
.cart-item-unit { font-weight: 400; color: #999; font-size: 0.75rem; }

/* Botón flotante — animación bump */
@keyframes cart-bump { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
.cart-float-bump { animation: cart-bump 0.3s ease; }
`;
document.head.appendChild(style);

// ── INYECTAR PANEL + OVERLAY ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', `
        <div class="cart-overlay" id="cartOverlay" onclick="cerrarPanel()"></div>
        <div class="cart-panel" id="cartPanel">
            <div class="cart-panel-header">
                <h2>Tu consulta</h2>
                <button class="cart-panel-close" onclick="cerrarPanel()" aria-label="Cerrar">✕</button>
            </div>
            <div class="cart-panel-items" id="cartPanelItems"></div>
            <div class="cart-panel-footer" id="cartPanelFooter" style="display:none">
                <p class="cart-panel-hint">Estos productos se enviarán como lista a WhatsApp. Podés pedir disponibilidad, precios o hacer una reserva.</p>
                <button class="cart-panel-wa-btn" onclick="sendWhatsApp()">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.093.539 4.062 1.485 5.772L0 24l6.382-1.473C8.044 23.447 9.99 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.628-.494-5.145-1.358l-.368-.212-3.791.874.907-3.695-.237-.384C2.516 15.613 2 13.863 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                    <span>Consultar por WhatsApp</span>
                </button>
            </div>
        </div>
        <div class="cart-toast" id="cartToast"></div>
    `);

    // Redirigir el botón flotante existente para que abra el panel
    const floatBtn = document.querySelector('.cart-float');
    if (floatBtn) {
        floatBtn.onclick = abrirPanel;
    }

    renderPanelItems();
});

// ── PANEL — abrir / cerrar ────────────────────────────────────
function abrirPanel() {
    document.getElementById('cartPanel').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
}
function cerrarPanel() {
    document.getElementById('cartPanel').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
}

// ── RENDER DEL PANEL ─────────────────────────────────────────
function renderPanelItems() {
    const itemsEl = document.getElementById('cartPanelItems');
    const footerEl = document.getElementById('cartPanelFooter');
    if (!itemsEl) return;

    if (!carrito || carrito.length === 0) {
        itemsEl.innerHTML = `<div class="cart-panel-empty">🛒<p>Todavía no agregaste productos.<br>Tocá "Agregar a consulta" en los que te interesen.</p></div>`;
        if (footerEl) footerEl.style.display = 'none';
        return;
    }

    if (footerEl) footerEl.style.display = 'block';

    // Agrupar por id para manejar cantidades
    const agrupado = {};
    carrito.forEach(p => {
        if (agrupado[p.id]) agrupado[p.id].qty++;
        else agrupado[p.id] = { ...p, qty: 1 };
    });

    const esFeria = typeof FERIA_MODE !== 'undefined' && FERIA_MODE;
    const items   = Object.values(agrupado);
    const total   = items.reduce((s, i) => s + (i.precio || 0) * i.qty, 0);

    itemsEl.innerHTML = items.map(item => {
        const subtotal = (item.precio || 0) * item.qty;
        const precioLine = item.precio > 0
            ? `<div class="cart-item-precio">Gs. ${subtotal.toLocaleString('de-DE')}${item.qty > 1 ? ` <span class="cart-item-unit">(${item.precio.toLocaleString('de-DE')} c/u)</span>` : ''}</div>`
            : '';
        return `
        <div class="cart-panel-item">
            <img src="${item.foto || ''}" alt="${item.nombre}" onerror="this.style.opacity='0.15'">
            <div class="cart-panel-item-info">
                <div class="cart-panel-item-name">${item.nombre}</div>
                <div class="cart-panel-item-cat">${CATEGORIA}</div>
                ${precioLine}
                <div class="cart-panel-item-controls">
                    <button class="qty-btn" onclick="cambiarQty(${item.id}, -1)">−</button>
                    <span class="qty-num">${item.qty}</span>
                    <button class="qty-btn" onclick="cambiarQty(${item.id}, 1)">+</button>
                    <button class="cart-item-remove" onclick="quitarItem(${item.id})">Quitar</button>
                </div>
            </div>
        </div>`;
    }).join('');

    // Total y hint según modo
    const hintEl  = footerEl.querySelector('.cart-panel-hint');
    const totalEl = footerEl.querySelector('.cart-panel-total');
    const btnEl   = footerEl.querySelector('.cart-panel-wa-btn span');

    if (esFeria && total > 0) {
        if (!footerEl.querySelector('.cart-panel-total')) {
            footerEl.insertAdjacentHTML('afterbegin',
                `<div class="cart-panel-total">
                    <span>Total</span>
                    <span id="cartTotal">Gs. ${total.toLocaleString('de-DE')}</span>
                </div>`
            );
        } else {
            document.getElementById('cartTotal').textContent = 'Gs. ' + total.toLocaleString('de-DE');
        }
        if (hintEl) hintEl.textContent = 'Precios de feria. El total es referencial.';
        if (btnEl)  btnEl.textContent  = 'Pedir por WhatsApp';
    } else {
        const t = footerEl.querySelector('.cart-panel-total');
        if (t) t.remove();
        if (hintEl) hintEl.textContent = 'Estos productos se enviarán como lista a WhatsApp. Podés pedir disponibilidad, precios o hacer una reserva.';
        if (btnEl)  btnEl.textContent  = 'Consultar por WhatsApp';
    }
}

// ── CANTIDAD ─────────────────────────────────────────────────
function cambiarQty(id, delta) {
    const idx = delta < 0
        ? carrito.findLastIndex ? carrito.findLastIndex(p => p.id === id) : [...carrito].reverse().findIndex(p => p.id === id)
        : -1;

    if (delta > 0) {
        const base = carrito.find(p => p.id === id);
        if (base) carrito.push({ ...base });
    } else {
        // quitar una sola ocurrencia
        const i = carrito.map(p => p.id).lastIndexOf(id);
        if (i !== -1) carrito.splice(i, 1);
    }
    actualizarContador();
    renderPanelItems();
}

function quitarItem(id) {
    carrito = carrito.filter(p => p.id !== id);
    actualizarContador();
    renderPanelItems();
}

// ── ACTUALIZAR CONTADOR (botón flotante) ──────────────────────
function actualizarContador() {
    const count = carrito.length;
    const el = document.getElementById('cart-count');
    if (el) {
        el.innerText = `${count} item${count !== 1 ? 's' : ''}`;
        el.closest('.cart-float')?.classList.remove('cart-float-bump');
        void el.closest('.cart-float')?.offsetWidth;
        el.closest('.cart-float')?.classList.add('cart-float-bump');
    }
}

// ── TOAST ─────────────────────────────────────────────────────
function mostrarToast(msg) {
    const t = document.getElementById('cartToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
}

// ── CARRUSEL ─────────────────────────────────────────────────
let carouselCount = 0;

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

// ── HELPERS ──────────────────────────────────────────────────
function stockTag(stock) {
    if (stock === 0) return { clase: 'sin-stock', texto: 'Sin stock' };
    if (stock === 1) return { clase: 'urgencia', texto: '¡Última unidad!' };
    if (stock < 10) return { clase: 'urgencia', texto: `¡Últimas ${stock} unidades!` };
    return { clase: 'disponible', texto: `Stock: ${stock} unidades` };
}

// ── RENDER GRILLA ────────────────────────────────────────────
function renderGrid(productos, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    if (!productos || productos.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>Próximamente más productos en esta categoría.</p></div>';
        return;
    }

    grid.innerHTML = productos.map(p => {
        const tag = stockTag(p.stock);

        // Precio desde precios.json según FERIA_MODE (definido en config.js)
        const esFeria = typeof FERIA_MODE !== 'undefined' && FERIA_MODE;
        // Buscar por clave compuesta "pagina_id" primero, luego por id solo (compatibilidad)
        const _pcat = typeof CATEGORIA !== 'undefined' ? CATEGORIA.toLowerCase() : '';
        const _key  = _pcat + '_' + p.id;
        const precioVal = esFeria
            ? (_preciosFeria[_key] || _preciosFeria[p.id] || _precios[_key] || _precios[p.id] || p.precio || 0)
            : (_precios[_key] || _precios[p.id] || p.precio || 0);

        const btn = p.stock === 0
            ? `<button class="btn btn-disabled" disabled>Agotado</button>`
            : `<button class="btn btn-buy${esFeria ? ' feria-mode' : ''}"
                onclick="addToCart(${p.id}, '${p.nombre.replace(/'/g, "\'")}', ${precioVal}, '${(p.fotos ? p.fotos.find(f => f) : p.foto1) || ''}')">
                ${esFeria ? '+ Agregar' : '&#9825; Me interesa'}
               </button>`;

        const precio = precioVal > 0
            ? `<div class="card-price${esFeria ? ' precio-feria' : ''}">Gs. ${precioVal.toLocaleString('de-DE')}</div>`
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

// ── CARRITO ───────────────────────────────────────────────────
function addToCart(id, nombre, precio, foto) {
    carrito.push({ id, nombre, precio, foto });
    actualizarContador();
    renderPanelItems();
    mostrarToast(`"${nombre.length > 28 ? nombre.slice(0,28)+'…' : nombre}" agregado`);
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

// ── ENVIAR POR WHATSAPP ───────────────────────────────────────
function sendWhatsApp() {
    if (!carrito || carrito.length === 0) {
        mostrarToast('No hay productos en tu consulta.');
        return;
    }

    // Agrupar por id
    const agrupado = {};
    carrito.forEach(p => {
        if (agrupado[p.id]) agrupado[p.id].qty++;
        else agrupado[p.id] = { ...p, qty: 1 };
    });

    const items = Object.values(agrupado);
    const tienePrecios = items.some(p => p.precio > 0);

    let lineas = items.map((p, i) => {
        const precioStr = p.precio > 0
            ? ` — Gs. ${(p.precio * p.qty).toLocaleString('de-DE')}`
            : '';
        const cantStr = p.qty > 1 ? ` (x${p.qty})` : '';
        return `${i + 1}. ${p.nombre}${cantStr}${precioStr}`;
    }).join('\n');

    let mensaje = `Hola! Quisiera consultar sobre los siguientes productos de *${CATEGORIA}*:\n\n${lineas}`;

    if (tienePrecios) {
        const total = carrito.reduce((sum, p) => sum + (p.precio || 0), 0);
        mensaje += `\n\n*Total referencial: Gs. ${total.toLocaleString('de-DE')}*`;
    }

    mensaje += `\n\n¿Me confirman disponibilidad?`;

    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`, '_blank');
}
