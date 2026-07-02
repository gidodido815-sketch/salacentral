// ============================================================
//  BLOQUE 1 · CONFIGURACIÓN
//  D.G.C - Mapa Operativo Policial · Santiago del Estero
//  Último cambio: 2026-01-15
// ============================================================
'use strict';

window.CFG = {
  // ⚙️ CLAVE DE ADMINISTRADOR - CAMBIA ESTO EN PRODUCCIÓN
  ADMIN_PASS: 'dgc2026',

  // 📍 Vista inicial del mapa
  CENTER: [-27.79, -64.26],
  ZOOM: 13,

  // 🎨 Colores por D.S.C (1-19)
  DSC_COLORS: {
    1:'#f57c00', 2:'#0288d1', 3:'#8e24aa', 4:'#7b1fa2', 5:'#2e7d32',
    6:'#00897b', 7:'#5d4037', 8:'#c2185b', 9:'#6a1b9a', 10:'#388e3c',
    11:'#1565c0', 12:'#ef6c00', 13:'#ad1457', 14:'#00695c', 15:'#4527a0',
    16:'#283593', 17:'#f9a825', 18:'#bf360c', 19:'#b71c1c'
  },

  // 📛 Nombres de Departamentales
  DEP_NAMES: {
    1:'Departamental Nº 1 — Zona Norte', 2:'Departamental Nº 2 — Zona Centro',
    3:'Departamental Nº 3 — Zona Sur', 4:'Departamental Nº 4 — La Banda (Oeste)',
    5:'Departamental Nº 5 — La Banda (Este)', 6:'Departamental Nº 6 — Termas de Río Hondo',
    7:'Departamental Nº 7 — Frías', 8:'Departamental Nº 8 — Fernández',
    9:'Departamental Nº 9 — Loreto', 10:'Departamental Nº 10 — Nueva Esperanza',
    11:'Departamental Nº 11 — Monte Quemado', 12:'Departamental Nº 12 — Quimilí',
    13:'Departamental Nº 13 — Añatuya', 14:'Departamental Nº 14 — Pinto',
    15:'Departamental Nº 15 — Ojo de Agua', 16:'Departamental Nº 16 — B° Los Flores',
    17:'Departamental Nº 17 — B° Belén', 18:'Departamental Nº 18 — Herrera',
    19:'Departamental Nº 19 — Villa del Carmen'
  }
};

// 🔧 Helpers globales (usado en todos los bloques)
window.colorFor = n => CFG.DSC_COLORS[n] || '#607d8b';
window.dscName = n => (window.DATA_DSC && DATA_DSC[String(n)]) || ('D.S.C Nº ' + (n||'?'));
window.depName = n => CFG.DEP_NAMES[n] || ('Departamental Nº ' + (n||'?'));
window.normalize = s => (s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

// 📐 Distancia haversine en metros
window.hav = (la1,lo1,la2,lo2)=>{
  const R=6371000, r=Math.PI/180;
  const dLa=(la2-la1)*r, dLo=(lo2-lo1)*r;
  const a=Math.sin(dLa/2)**2+Math.cos(la1*r)*Math.cos(la2*r)*Math.sin(dLo/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
};

console.log('✅ Config cargada: ' + CFG.ADMIN_PASS.length + ' caracteres de clave');
