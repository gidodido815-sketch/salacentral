// ============================================================
//  BLOQUE 7 · ARRANQUE (MEJORADO)
//  Carga todos los datos, renderiza todas las capas,
//  maneja permisos y toggles.
// ============================================================
'use strict';

/* Toggles de capa */
document.querySelectorAll('.toggle').forEach(t=>{
  t.onclick=()=>{
    const key=t.dataset.layer;
    
    // Validar permisos
    if (key === 'subcomis' && usuarioActual.nivel === PERMISOS.PUBLICO) {
      alert('⚠️ Solo usuarios logueados pueden ver Sub-Comisarías');
      return;
    }
    if ((key === 'casillas' || key === 'garitas' || key === 'dsto') && usuarioActual.nivel === PERMISOS.PUBLICO) {
      alert('⚠️ Solo usuarios logueados pueden ver esta capa');
      return;
    }
    
    t.classList.toggle('on');
    
    if(t.classList.contains('on')) {
      MAP.addLayer(LAYERS[key]);
    } else {
      MAP.removeLayer(LAYERS[key]);
    }
  };
});

/* Menú móvil */
const sidebar=document.getElementById('sidebar');
document.getElementById('menuBtn').onclick=()=>sidebar.classList.toggle('open');
document.getElementById('sbClose').onclick=()=>sidebar.classList.remove('open');
window.closeSidebarMobile=()=>{ 
  if(window.innerWidth<=780) sidebar.classList.remove('open'); 
};

/* ============================================================
   RENDERIZAR TODAS LAS CAPAS
   ============================================================ */

function renderizarTodo() {
  console.log('🔄 Renderizando todas las capas...');
  
  // Zonas (siempre)
  renderZones();
  
  // Comisarías (públicas) + Sub-comisarías (usuarios)
  renderComis();
  
  // Casillas, Garitas, Destacamentos (solo usuarios + admin)
  renderCasillas();
  renderGaritas();
  renderDsto();
  
  // Cámaras (siempre)
  renderCams();
  
  // Leyenda D.S.C
  renderLegend();
  
  console.log('✅ Todas las capas renderizadas');
}

/* Renderizar inicial */
renderizarTodo();

/* Ajustar vista a los datos */
const pts=(window.DATA_COMISARIAS||[]).map(c=>[c.lat,c.lng]);
if(pts.length) MAP.fitBounds(pts,{padding:[40,40]});

/* ============================================================
   ACTUALIZAR CAPAS AL CAMBIAR PERMISOS
   ============================================================ */

// Escuchar cambios de nivel de usuario (cada segundo)
setInterval(() => {
  // Actualizar visibilidad de toggles según permisos
  document.querySelectorAll('.toggle').forEach(t => {
    const layer = t.dataset.layer;
    
    // Deshabilitar toggles si no tienes permiso
    if ((layer === 'subcomis' || layer === 'casillas' || layer === 'garitas' || layer === 'dsto') 
        && usuarioActual.nivel === PERMISOS.PUBLICO) {
      t.style.opacity = '0.5';
      t.style.pointerEvents = 'none';
    } else {
      t.style.opacity = '1';
      t.style.pointerEvents = 'auto';
    }
  });
}, 500);

console.log('✅ Inicialización mejorada completa');
