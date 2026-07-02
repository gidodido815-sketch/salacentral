// ============================================================
//  BLOQUE 2 · ICONOS
//  Marcadores profesionales (escudo policial, cámara).
//  Para cambiar el estilo de un pin, se edita SOLO acá.
// ============================================================
'use strict';

// Escudo policial para Departamentales / Comisarías.
// Forma de placa con estrella central. Color = el de su D.S.C.
window.shieldIcon = function(num){
  const col = colorFor(num);
  const svg = `
  <svg width="34" height="40" viewBox="0 0 34 40" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="sh" x="-30%" y="-20%" width="160%" height="150%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="#000" flood-opacity="0.55"/>
    </filter></defs>
    <path d="M17 1.5 31 6v12.5C31 28 24.5 34.5 17 37.5 9.5 34.5 3 28 3 18.5V6z"
          fill="${col}" stroke="#fff" stroke-width="2" filter="url(#sh)"/>
    <path d="M17 6.5 27 9.6v9.4c0 6.9-4.7 11.7-10 14.1-5.3-2.4-10-7.2-10-14.1V9.6z"
          fill="none" stroke="#ffffff" stroke-width="1" opacity="0.55"/>
    <path d="M17 11.3l1.7 3.5 3.8.55-2.75 2.68.65 3.8L17 23.6l-3.4 1.0.65-3.8-2.75-2.68 3.8-.55z"
          fill="#fff"/>
  </svg>`;
  return L.divIcon({
    className:'pin-shield', html:svg,
    iconSize:[34,40], iconAnchor:[17,38], popupAnchor:[0,-34]
  });
};

// Punto de cámara. Verde funcionando, rojo QRT/fuera de servicio.
window.camIcon = function(estado){
  const qrt = /qrt|fuera|baja|robad/i.test(estado||'');
  const col = qrt ? '#e5484d' : '#2ea043';
  const ring = qrt ? 'rgba(229,72,77,.25)' : 'rgba(46,160,67,.25)';
  const svg = `
  <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="10" fill="${ring}"/>
    <circle cx="11" cy="11" r="6.5" fill="${col}" stroke="#fff" stroke-width="1.8"/>
    <rect x="8" y="9.3" width="5.2" height="3.4" rx="0.6" fill="#fff"/>
    <path d="M13.2 10.1l2 -1v3l-2 -1z" fill="#fff"/>
  </svg>`;
  return L.divIcon({
    className:'pin-cam', html:svg,
    iconSize:[22,22], iconAnchor:[11,11], popupAnchor:[0,-11]
  });
};

// Marcador de la dirección buscada (pulso azul)
window.searchIcon = function(){
  return L.divIcon({
    className:'pin-search',
    html:`<div class="pulse"></div><svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 1C7.8 1 2 6.8 2 14c0 9 13 23 13 23s13-14 13-23C28 6.8 22.2 1 15 1z"
            fill="#2f81f7" stroke="#fff" stroke-width="2.2"/>
      <circle cx="15" cy="14" r="5" fill="#fff"/></svg>`,
    iconSize:[30,38], iconAnchor:[15,37], popupAnchor:[0,-34]
  });
};
