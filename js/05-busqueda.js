// ============================================================
//  BLOQUE 5 · BÚSQUEDA DE DIRECCIONES
//  Buscás una dirección (ej "Eduardo Miguel 863"):
//   1) la ubica en el mapa
//   2) en el desplegable muestra la dirección + D.S.C + Cría
//      a la que pertenece, con sus datos.
// ============================================================
'use strict';

const qEl   = document.getElementById('q');
const resEl = document.getElementById('results');
let searchTimer=null;

function clearResults(){ resEl.style.display='none'; resEl.innerHTML=''; }

qEl.addEventListener('input',()=>{
  const v=qEl.value.trim();
  clearTimeout(searchTimer);
  if(v.length<3){ clearResults(); return; }
  searchTimer=setTimeout(()=>runSearch(v), 320);
});
qEl.addEventListener('keydown',e=>{ if(e.key==='Enter'){ clearTimeout(searchTimer); runSearch(qEl.value.trim(),true);} });
document.getElementById('goBtn').onclick=()=>runSearch(qEl.value.trim(),true);
document.addEventListener('click',e=>{ if(!e.target.closest('.searchbox')) clearResults(); });

/* Coincidencias locales (dependencias por nombre) */
function localMatches(v){
  const nq=normalize(v); const out=[];
  (window.DATA_COMISARIAS||[]).forEach(c=>{ if(normalize(c.dependencia).includes(nq)) out.push({kind:'comis',c}); });
  (window.DATA_DIRECTORIO||[]).forEach(d=>{ if(d.direccion && normalize(d.dependencia).includes(nq)) out.push({kind:'dir',c:d}); });
  return out.slice(0,6);
}

async function runSearch(v, forceGeo){
  if(!v){ clearResults(); return; }
  const locals=localMatches(v);
  let html='';
  if(locals.length){
    html+='<div class="rgroup">Dependencias</div>';
    locals.forEach((o,i)=>{
      const c=o.c, col=colorFor(c.dscnum);
      html+=`<div class="ritem" data-i="${i}">
        <div class="ic" style="background:${col}22;color:${col}">🛡️</div>
        <div class="tx"><div class="t1">${c.dependencia}</div>
          <div class="t2">${dscName(c.dscnum)}</div></div></div>`;
    });
  }
  html+='<div class="rgroup">Direcciones en el mapa</div><div class="loading" id="geoLoad">Buscando dirección…</div>';
  resEl.innerHTML=html; resEl.style.display='block';

  resEl.querySelectorAll('.ritem').forEach(el=>{
    el.onclick=()=>{ const o=locals[+el.dataset.i]; clearResults();
      if(o.kind==='comis'){ const mk=comisMarkers.find(m=>m.data===o.c);
        MAP.setView([o.c.lat,o.c.lon],16); if(mk) mk.marker.openPopup(); }
      else { qEl.value=o.c.direccion; runSearch(o.c.direccion,true); }
      closeSidebarMobile(); };
  });

  try{
    const geo=await geocode(v);
    const ld=document.getElementById('geoLoad'); if(!ld) return;
    if(!geo.length){ ld.outerHTML='<div class="loading">Sin resultados de dirección</div>'; return; }
    let g='';
    geo.forEach((r,i)=>{ g+=`<div class="ritem geo" data-i="${i}">
      <div class="ic" style="background:#2f81f722;color:#2f81f7">📍</div>
      <div class="tx"><div class="t1">${r.short}</div><div class="t2">${r.context}</div></div></div>`; });
    ld.outerHTML=g;
    resEl.querySelectorAll('.geo').forEach(el=>{
      el.onclick=()=>{ const r=geo[+el.dataset.i]; clearResults(); qEl.value=r.short; analyzeAddress(r); closeSidebarMobile(); };
    });
  }catch(e){
    const ld=document.getElementById('geoLoad');
    if(ld) ld.outerHTML='<div class="loading">No se pudo conectar al buscador de direcciones</div>';
  }
}

async function geocode(q){
  const vb='-65.6,-25.5,-61.7,-30.2'; // bbox provincia
  const url=`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&accept-language=es`
    +`&countrycodes=ar&viewbox=${vb}&bounded=1&q=${encodeURIComponent(q+', Santiago del Estero, Argentina')}`;
  const r=await fetch(url,{headers:{'Accept':'application/json'}});
  const j=await r.json();
  return j.map(x=>({
    lat:+x.lat, lon:+x.lon,
    short:(x.display_name||'').split(',').slice(0,2).join(', '),
    context:(x.display_name||'').split(',').slice(2,5).join(', ')
  }));
}

/* Analiza la dirección: ¿a qué D.S.C / Departamental / Cría pertenece? */
function analyzeAddress(r){
  if(searchMarker) MAP.removeLayer(searchMarker);
  searchMarker=L.marker([r.lat,r.lon],{icon:searchIcon()}).addTo(MAP);
  MAP.setView([r.lat,r.lon],15);

  const pt=turf.point([r.lon,r.lat]);
  let zoneHit=null;
  for(const z of zonePolys){ if(z.turf && turf.booleanPointInPolygon(pt,z.turf)){ zoneHit=z; break; } }

  let nearest=null, nd=1e12;
  comisMarkers.forEach(o=>{ const d=hav(r.lat,r.lon,o.data.lat,o.data.lon); if(d<nd){nd=d;nearest=o.data;} });

  let dscnum, source, cria=nearest;
  if(zoneHit){
    dscnum=zoneHit.dscnum; source='jurisdiccion';
    const key=normalize((zoneHit.name||'').replace(/cria\.?\s*com\.?/i,'').replace(/[°º]/g,'').trim());
    const byName=comisMarkers.find(o=> o.data.dscnum===dscnum && key && normalize(o.data.dependencia).includes(key));
    if(byName) cria=byName.data;
  } else if(nearest){ dscnum=nearest.dscnum; source='cercania'; }

  const distToCria = cria ? hav(r.lat,r.lon,cria.lat,cria.lon) : nd;
  renderResultCard(r, dscnum, cria, distToCria, source);
}

function renderResultCard(r, dscnum, cria, distM, source){
  const col=colorFor(dscnum);
  const area=document.getElementById('resultArea');
  const distTxt = distM<1000? Math.round(distM)+' m' : (distM/1000).toFixed(1)+' km';
  area.innerHTML=`
   <div class="section-t">Resultado de búsqueda</div>
   <div class="card">
     <div class="card-head" style="border-left-color:${col}">
       <div class="addr">📍 ${r.short}</div>
       <div class="sub">${r.lat.toFixed(5)}, ${r.lon.toFixed(5)}</div>
     </div>
     <div class="kv"><div class="k">Dirección buscada</div><div class="v">${r.short}</div></div>
     <div class="kv"><div class="k">Distrito de Seguridad Ciudadana</div>
        <div class="v dsc" style="color:${col}">${dscName(dscnum)}</div></div>
     <div class="kv"><div class="k">Departamental</div><div class="v">${depName(dscnum)}</div></div>
     <div class="kv"><div class="k">Comisaría jurisdiccional ${source==='cercania'?'(más cercana)':''}</div>
        <div class="v">${cria?cria.dependencia:'—'}</div>
        ${cria?`<div class="cria-extra">
            ${telLink(cria.telefono)?`<span>📞 ${telLink(cria.telefono)}</span>`:''}
            <span class="dist">↔ ${distTxt}</span></div>`:''}
        ${cria&&cria.direccion?`<div class="cria-addr">📍 ${cria.direccion}</div>`:''}
     </div>
     ${source==='cercania'?`<div class="kv warn"><div class="v">⚠ Esta zona no tiene polígono de jurisdicción cargado. Se asignó la dependencia <b>más cercana</b>.</div></div>`:''}
   </div>`;
  area.scrollIntoView({behavior:'smooth',block:'start'});
}
