// ============================================================
//  BLOQUE 4 · CAPAS Y POPUPS (MEJORADO)
//  Dibuja zonas D.S.C, comisarías, sub-comisarías, casillas, 
//  garitas, destacamentos y cámaras. Controla permisos.
// ============================================================
'use strict';

/* ---------- helpers de popup ---------- */
function popRow(icon,k,v){
  return v ? `<div class="row"><div class="i">${icon}</div><div class="x">
    <div class="k">${k}</div><div class="d">${v}</div></div></div>` : '';
}
function telLink(t){
  if(!t || t==='0' || /^no$/i.test(t)) return '';
  const c=String(t).replace(/[^0-9]/g,'');
  return `<a href="tel:${c}">${t}</a>`;
}

/* ---------- ZONAS D.S.C ---------- */
function renderZones(){
  LAYERS.zones.clearLayers();
  zonePolys.length=0;
  (window.DATA_ZONAS||[]).forEach(z=>{
    const latlngs = z.rings.map(r=>r.map(p=>[p[1],p[0]]));
    const col = colorFor(z.dscnum);
    const poly = L.polygon(latlngs,{
      color: col, weight:2, fillColor:col, fillOpacity:0.22, opacity:0.85
    });
    poly.bindTooltip(`<b>${z.name||''}</b><br>${dscName(z.dscnum)}`,{sticky:true});
    poly.addTo(LAYERS.zones);
    let tf=null;
    try{ tf = turf.polygon([z.rings[0].concat([z.rings[0][0]])]); }catch(e){}
    zonePolys.push({dscnum:z.dscnum, name:z.name, turf:tf, layer:poly, color:col});
  });
}

/* ---------- COMISARIAS ---------- */
function comisPopup(c){
  return `<div class="pop">
    <div class="ph"><div class="ty">${c.tipo === 'SUB_COMISARIA' ? 'SUB-COMISARÍA' : 'COMISARÍA'}</div>
      <div class="nm">${c.nombre}</div></div>
    ${popRow('📞','Teléfono', telLink(c.telefono) || '<span class="sd">s/d</span>')}
    ${popRow('📍','Dirección', c.direccion || '<span class="sd">s/d</span>')}
    ${popRow('🛡️','D.S.C', `<span class="dscb" style="color:${colorFor(c.dsc)}">${c.dsc_nombre || dscName(c.dsc)}</span>`)}
    ${popRow('🏛️','Departamental', c.departamental || `Departamental Nº ${c.dsc}`)}
  </div>`;
}

function renderComis(){
  LAYERS.comis.clearLayers();
  comisMarkers.length=0;
  
  (window.DATA_COMISARIAS||[]).forEach(c=>{
    // Filtrar por permisos
    let debeVerse = c.visible_publico;
    
    if (usuarioActual && usuarioActual.nivel === PERMISOS.USUARIO) {
      debeVerse = c.visible_usuario;
    } else if (usuarioActual && usuarioActual.nivel === PERMISOS.ADMIN) {
      debeVerse = true; // Admin ve todo
    }
    
    if (!debeVerse) return; // No mostrar si permisos lo impiden
    
    const m = L.marker([c.lat,c.lng],{icon:shieldIcon(c.dsc)}).bindPopup(comisPopup(c));
    m.addTo(LAYERS.comis);
    comisMarkers.push({data:c, marker:m});
  });
  
  const el=document.getElementById('ctComis');
  if(el) el.textContent=DATA_COMISARIAS.length;
  const st=document.getElementById('stComis');
  if(st) st.textContent = DATA_COMISARIAS.length + (window.DATA_DIRECTORIO?DATA_DIRECTORIO.length:0);
}

/* ---------- CASILLAS ---------- */
function casillasPopup(c){
  return `<div class="pop">
    <div class="ph"><div class="ty">CASILLA</div>
      <div class="nm">${c.nombre}</div></div>
    ${popRow('📞','Teléfono', telLink(c.telefono) || '<span class="sd">s/d</span>')}
    ${popRow('📍','Dirección', c.direccion || '<span class="sd">s/d</span>')}
    ${popRow('🛡️','D.S.C', `<span class="dscb" style="color:${colorFor(c.dsc)}">${c.dsc_nombre || dscName(c.dsc)}</span>`)}
    ${popRow('🏛️','Departamental', c.departamental || `Departamental Nº ${c.dsc}`)}
  </div>`;
}

function renderCasillas(){
  if(!LAYERS.casillas) LAYERS.casillas = L.layerGroup();
  LAYERS.casillas.clearLayers();
  
  (window.DATA_DIRECTORIO||[]).filter(d=>d.tipo==='CASILLA').forEach(c=>{
    const icon = L.icon({
      iconUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%2300aa00" stroke="white" stroke-width="2"/><text x="12" y="15" font-size="12" fill="white" text-anchor="middle">C</text></svg>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
    
    const m = L.marker([c.lat,c.lng],{icon:icon}).bindPopup(casillasPopup(c));
    m.addTo(LAYERS.casillas);
  });
}

/* ---------- GARITAS ---------- */
function garitasPopup(c){
  return `<div class="pop">
    <div class="ph"><div class="ty">GARITA</div>
      <div class="nm">${c.nombre}</div></div>
    ${popRow('📞','Teléfono', telLink(c.telefono) || '<span class="sd">s/d</span>')}
    ${popRow('📍','Dirección', c.direccion || '<span class="sd">s/d</span>')}
    ${popRow('🛡️','D.S.C', `<span class="dscb" style="color:${colorFor(c.dsc)}">${c.dsc_nombre || dscName(c.dsc)}</span>`)}
    ${popRow('🏛️','Departamental', c.departamental || `Departamental Nº ${c.dsc}`)}
  </div>`;
}

function renderGaritas(){
  if(!LAYERS.garitas) LAYERS.garitas = L.layerGroup();
  LAYERS.garitas.clearLayers();
  
  (window.DATA_DIRECTORIO||[]).filter(d=>d.tipo==='GARITA').forEach(c=>{
    const icon = L.icon({
      iconUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23ff9900" stroke="white" stroke-width="2"/><text x="12" y="15" font-size="12" fill="white" text-anchor="middle">G</text></svg>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
    
    const m = L.marker([c.lat,c.lng],{icon:icon}).bindPopup(garitasPopup(c));
    m.addTo(LAYERS.garitas);
  });
}

/* ---------- DESTACAMENTOS ---------- */
function dstoPopup(c){
  return `<div class="pop">
    <div class="ph"><div class="ty">DESTACAMENTO</div>
      <div class="nm">${c.nombre}</div></div>
    ${popRow('📞','Teléfono', telLink(c.telefono) || '<span class="sd">s/d</span>')}
    ${popRow('📍','Dirección', c.direccion || '<span class="sd">s/d</span>')}
    ${popRow('🛡️','D.S.C', `<span class="dscb" style="color:${colorFor(c.dsc)}">${c.dsc_nombre || dscName(c.dsc)}</span>`)}
    ${popRow('🏛️','Departamental', c.departamental || `Departamental Nº ${c.dsc}`)}
  </div>`;
}

function renderDsto(){
  if(!LAYERS.dsto) LAYERS.dsto = L.layerGroup();
  LAYERS.dsto.clearLayers();
  
  (window.DATA_DIRECTORIO||[]).filter(d=>d.tipo==='DESTACAMENTO').forEach(c=>{
    const icon = L.icon({
      iconUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%239900ff" stroke="white" stroke-width="2"/><text x="12" y="15" font-size="12" fill="white" text-anchor="middle">D</text></svg>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
    
    const m = L.marker([c.lat,c.lng],{icon:icon}).bindPopup(dstoPopup(c));
    m.addTo(LAYERS.dsto);
  });
}

/* ---------- CÁMARAS ---------- */
function camPopup(c){
  const qrt=/qrt|fuera|baja/i.test(c.estado||'');
  return `<div class="pop">
    <div class="ph"><div class="ty">Cámara ${c.tipo?('· '+c.tipo):''}</div>
      <div class="nm">N° ${c.id}</div></div>
    ${popRow('📍','Ubicación', c.ubicacion)}
    ${popRow(qrt?'🔴':'🟢','Estado', `<b style="color:${qrt?'#e5484d':'#2ea043'}">${c.estado||'—'}</b>`)}
    ${c.obs?popRow('📝','Obs.', c.obs):''}
    ${c.lat===null?'<div class="row"><div class="i">⚠️</div><div class="x"><div class="d" style="color:#d29922">Ubicación pendiente</div></div></div>':''}
  </div>`;
}

function renderCams(){
  LAYERS.cam.clearLayers();
  let sinCoord=0;
  (window.DATA_CAMARAS||[]).forEach(c=>{
    if(c.lat===null || c.lat===undefined){ sinCoord++; return; }
    LAYERS.cam.addLayer(L.marker([c.lat,c.lon],{icon:camIcon(c.estado)}).bindPopup(camPopup(c)));
  });
  const el=document.getElementById('ctCam');
  if(el) el.textContent=DATA_CAMARAS.length;
  const st=document.getElementById('stCam');
  if(st) st.textContent=DATA_CAMARAS.length;
}

/* ---------- LEYENDA D.S.C ---------- */
const hiddenDsc = new Set();

function renderLegend(){
  const box=document.getElementById('legend');
  if(!box) return;
  box.innerHTML='';
  Object.keys(window.DATA_DSC||{}).map(Number).sort((a,b)=>a-b).forEach(n=>{
    const d=document.createElement('div');
    d.className='lgi';
    d.dataset.dsc=n;
    d.innerHTML=`<span class="sq" style="background:${colorFor(n)}"></span><span class="nm">${dscName(n)}</span>`;
    d.onclick=()=>{
      if(hiddenDsc.has(n)){hiddenDsc.delete(n);d.classList.remove('off');}
      else{hiddenDsc.add(n);d.classList.add('off');}
      applyDscFilter();
    };
    box.appendChild(d);
  });
}

function applyDscFilter(){
  comisMarkers.forEach(o=>{
    const vis=!hiddenDsc.has(o.data.dsc);
    if(vis){ if(!LAYERS.comis.hasLayer(o.marker)) LAYERS.comis.addLayer(o.marker); }
    else LAYERS.comis.removeLayer(o.marker);
  });
  zonePolys.forEach(z=>{
    const vis=!hiddenDsc.has(z.dscnum);
    z.layer.setStyle({opacity:vis?0.85:0, fillOpacity:vis?0.22:0});
  });
}

console.log('✅ Capas mejoradas cargadas');
