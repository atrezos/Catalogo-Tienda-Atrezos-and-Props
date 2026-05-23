// ─── PRECIOS DESDE precios.json ───────────────────────────────────────────────
// Pegá este bloque AL INICIO de categoria.js, antes de cualquier función.
// Lee precios.json una sola vez y los aplica en renderGrid automáticamente.

let PRECIOS        = {};  // precios normales  { id: valor }
let PRECIOS_FERIA  = {};  // precios de feria  { id: valor }
let PRECIOS_LISTOS = false;

fetch('precios.json')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
        PRECIOS       = data.normal || {};
        PRECIOS_FERIA = data.feria  || {};
        PRECIOS_LISTOS = true;
    })
    .catch(() => {
        // Si no existe el archivo aún, sigue sin precios (comportamiento actual)
        PRECIOS_LISTOS = true;
    });


// ─── EN renderGrid() — reemplazá la línea que arma `precio` ──────────────────
// ANTES (lo que tenés hoy):
//   const precio = p.precio
//       ? `<div class="card-price">Gs. ${p.precio.toLocaleString('de-DE')}</div>`
//       : '';
//
// DESPUÉS (reemplazalo por esto):

/*
    const esFeria   = typeof MODO_FERIA !== 'undefined' && MODO_FERIA;
    const precioVal = esFeria
        ? (PRECIOS_FERIA[p.id] || PRECIOS[p.id] || p.precio || 0)
        : (PRECIOS[p.id] || p.precio || 0);

    const precio = precioVal > 0
        ? `<div class="card-price${esFeria ? ' precio-feria' : ''}">Gs. ${precioVal.toLocaleString('de-DE')}</div>`
        : '';
*/


// ─── EN CADA PÁGINA HTML — definí MODO_FERIA antes de cargar categoria.js ────
// Ejemplo en newborn.html, antes del <script src="categoria.js">:
//
//   <script>
//     const MODO_FERIA = false;  // cambiá a true el día de feria
//   </script>
//   <script src="categoria.js"></script>


// ─── ESTILO OPCIONAL para el precio de feria (pegalo en categoria.js junto al style) ──
/*
.precio-feria {
    color: #b06030;
    font-weight: 600;
}
.precio-feria::before {
    content: '🏷 ';
    font-size: 0.8em;
}
*/
