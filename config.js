// ── MODO FERIA ────────────────────────────────────────────────
const FERIA_MODE = false;  // true = feria activa, false = catálogo normal

// Alias para compatibilidad (categoria.js usa FERIA_MODE directamente)
const MODO_FERIA = FERIA_MODE;

// ── CARGA DE PRECIOS ──────────────────────────────────────────
function cargarPrecios(arr) {
    const data       = JSON.parse(localStorage.getItem('ap_precios') || '{}');
    const normales   = data.normal || data;
    const feria      = data.feria  || JSON.parse(localStorage.getItem('ap_precios_feria') || '{}');
    arr.forEach(prod => {
        const pNormal = normales[prod.id] || 0;
        const pFeria  = feria[prod.id]    || null;
        prod.precioNormal = pNormal;
        prod.precioFeria  = pFeria;
        prod.precio       = FERIA_MODE && pFeria ? pFeria : pNormal;
    });
}