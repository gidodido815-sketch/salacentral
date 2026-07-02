// ============================================================
//  BLOQUE 3 · MAPA BASE
//  Inicializa el mapa, las capas base y los grupos de capas.
// ============================================================
'use strict';

window.MAP = L.map('map', { zoomControl:false, attributionControl:true })
  .setView(CFG.CENTER, CFG.ZOOM);

L.control.zoom({ position:'bottomright' }).addTo(MAP);

const baseStreets = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  { maxZoom:19, attribution:'© OpenStreetMap © CARTO' });

const baseDark = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  { maxZoom:19, attribution:'© OpenStreetMap © CARTO' });

const baseSat = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { maxZoom:19, attribution:'© Esri' });

baseStreets.addTo(MAP);
L.control.layers(
  { 'Calles':baseStreets, 'Oscuro':baseDark, 'Satélite':baseSat },
  null, { position:'bottomright' }
).addTo(MAP);

// Grupos de capas (cada uno es un "bloque" prendible/apagable)
window.LAYERS = {
  zones: L.layerGroup().addTo(MAP),
  comis: L.layerGroup().addTo(MAP),
  cam:   L.markerClusterGroup({ chunkedLoading:true, maxClusterRadius:50, disableClusteringAtZoom:17 })
};

// Referencias que usan otros bloques
window.zonePolys   = [];   // {dscnum, name, turf, layer}
window.comisMarkers= [];   // {data, marker}
window.searchMarker= null;
