// ─────────────────────────────────────────────────────────────────────────────
//  CATÁLOGO DE FONDOS DE TELA — Atrezos & Props
//  Editá este archivo para agregar, quitar o modificar fondos.
//  Cada fondo tiene: id, nombre, tematica, colores[], foto (URL de OwnCloud)
//  Para agregar un fondo: copiá un bloque { ... } y pegalo con los datos reales.
// ─────────────────────────────────────────────────────────────────────────────

const FONDOS_CATALOGO = [

    // ── INFANTIL ─────────────────────────────────────────────────────────────
    {
        id: 1001,
        nombre: "Ositos de Peluche",
        tematica: "infantil",
        colores: ["beige", "celeste"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },
    {
        id: 1002,
        nombre: "Dinosaurios",
        tematica: "infantil",
        colores: ["verde", "blanco"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },
    {
        id: 1003,
        nombre: "Unicornios Pastel",
        tematica: "infantil",
        colores: ["rosa", "lila", "blanco"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },
    {
        id: 1004,
        nombre: "Estrellas Azules",
        tematica: "infantil",
        colores: ["azul", "blanco"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },

    // ── NAVIDAD ──────────────────────────────────────────────────────────────
    {
        id: 2001,
        nombre: "Pinos Nevados",
        tematica: "navidad",
        colores: ["verde", "blanco"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },
    {
        id: 2002,
        nombre: "Ho Ho Ho Rojo",
        tematica: "navidad",
        colores: ["rojo", "verde", "dorado"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },
    {
        id: 2003,
        nombre: "Copos de Nieve Plateados",
        tematica: "navidad",
        colores: ["blanco", "plateado"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },
    {
        id: 2004,
        nombre: "Navidad Dorada",
        tematica: "navidad",
        colores: ["dorado", "negro"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },

    // ── PASCUAS ──────────────────────────────────────────────────────────────
    {
        id: 3001,
        nombre: "Conejitos Pastel",
        tematica: "pascuas",
        colores: ["rosa", "celeste", "amarillo"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },
    {
        id: 3002,
        nombre: "Huevos de Pascua",
        tematica: "pascuas",
        colores: ["multicolor"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },

    // ── DÍA DE LA MADRE ──────────────────────────────────────────────────────
    {
        id: 4001,
        nombre: "Flores Rosas",
        tematica: "dia-madre",
        colores: ["rosa", "verde", "blanco"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },
    {
        id: 4002,
        nombre: "Rosas Vintage",
        tematica: "dia-madre",
        colores: ["rosa", "beige"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },

    // ── RETRATO / NEUTRAL ────────────────────────────────────────────────────
    {
        id: 5001,
        nombre: "Textura Arena",
        tematica: "retrato",
        colores: ["beige", "crema"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },
    {
        id: 5002,
        nombre: "Gris Cemento",
        tematica: "retrato",
        colores: ["gris"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },
    {
        id: 5003,
        nombre: "Marmolado Blanco",
        tematica: "retrato",
        colores: ["blanco", "gris"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },
    {
        id: 5004,
        nombre: "Verde Bosque",
        tematica: "retrato",
        colores: ["verde"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },

    // ── CUMPLEAÑOS ───────────────────────────────────────────────────────────
    {
        id: 6001,
        nombre: "Globos Coloridos",
        tematica: "cumpleanos",
        colores: ["multicolor"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },
    {
        id: 6002,
        nombre: "Confetti Dorado",
        tematica: "cumpleanos",
        colores: ["dorado", "blanco"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    },
    {
        id: 6003,
        nombre: "Rosa Brillante",
        tematica: "cumpleanos",
        colores: ["rosa", "dorado"],
        foto: "https://tu-owncloud.com/s/TU_LINK_AQUI/preview"
    }
];

// ── Temáticas disponibles (label para mostrar en filtros) ────────────────────
const TEMATICAS = [
    { id: "todas",      label: "Todas" },
    { id: "infantil",   label: "Infantil" },
    { id: "navidad",    label: "Navidad" },
    { id: "pascuas",    label: "Pascuas" },
    { id: "dia-madre",  label: "Día de la Madre" },
    { id: "retrato",    label: "Retrato / Neutral" },
    { id: "cumpleanos", label: "Cumpleaños" }
];

// ── Colores disponibles para filtro ──────────────────────────────────────────
const COLORES_FILTRO = [
    { id: "todos",      label: "Todos los colores", hex: null },
    { id: "blanco",     label: "Blanco",     hex: "#f5f0ea" },
    { id: "beige",      label: "Beige",      hex: "#d1c6b4" },
    { id: "crema",      label: "Crema",      hex: "#e8e0d5" },
    { id: "rosa",       label: "Rosa",       hex: "#f0a0b8" },
    { id: "lila",       label: "Lila",       hex: "#c9a8dc" },
    { id: "celeste",    label: "Celeste",    hex: "#a8d4e6" },
    { id: "azul",       label: "Azul",       hex: "#5a8fc0" },
    { id: "verde",      label: "Verde",      hex: "#7a9e6e" },
    { id: "gris",       label: "Gris",       hex: "#a0a0a0" },
    { id: "rojo",       label: "Rojo",       hex: "#c04a4a" },
    { id: "dorado",     label: "Dorado",     hex: "#c8a840" },
    { id: "plateado",   label: "Plateado",   hex: "#b0b8c0" },
    { id: "amarillo",   label: "Amarillo",   hex: "#e0c855" },
    { id: "negro",      label: "Negro",      hex: "#2a2a2a" },
    { id: "multicolor", label: "Multicolor", hex: null }
];
