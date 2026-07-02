// ============================================================
//  BLOQUE 8 · GPS Y UBICACIÓN EN TIEMPO REAL
//  Muestra tu ubicación actual en el mapa (mobile con permisos)
// ============================================================
'use strict';

window.GPS = {
  activo: false,
  marker: null,
  watchId: null,
  circulo: null
};

// Detectar si es mobile
window.isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// ============================================================
// INICIAR GPS
// ============================================================

function iniciarGPS() {
  if (!navigator.geolocation) {
    console.warn('Geolocalización no disponible en este navegador');
    return;
  }
  
  if (GPS.activo) {
    detenerGPS();
    return;
  }
  
  console.log('🔍 Pidiendo permisos de ubicación...');
  
  const opciones = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };
  
  GPS.watchId = navigator.geolocation.watchPosition(
    (posicion) => {
      const lat = posicion.coords.latitude;
      const lng = posicion.coords.longitude;
      const accuracy = posicion.coords.accuracy;
      
      mostrarUbicacionEnMapa(lat, lng, accuracy);
      console.log(`✅ GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)} (± ${accuracy.toFixed(0)}m)`);
    },
    (error) => {
      console.error('❌ Error GPS:', error.message);
      mostrarErrorGPS(error);
    },
    opciones
  );
  
  GPS.activo = true;
}

function detenerGPS() {
  if (GPS.watchId !== null) {
    navigator.geolocation.clearWatch(GPS.watchId);
    GPS.watchId = null;
  }
  
  if (GPS.marker) {
    MAP.removeLayer(GPS.marker);
    GPS.marker = null;
  }
  
  if (GPS.circulo) {
    MAP.removeLayer(GPS.circulo);
    GPS.circulo = null;
  }
  
  GPS.activo = false;
  console.log('🛑 GPS detenido');
}

function mostrarUbicacionEnMapa(lat, lng, accuracy) {
  // Remover marcador anterior
  if (GPS.marker) {
    MAP.removeLayer(GPS.marker);
  }
  if (GPS.circulo) {
    MAP.removeLayer(GPS.circulo);
  }
  
  // Crear marcador (punto azul)
  GPS.marker = L.circleMarker([lat, lng], {
    radius: 8,
    fillColor: '#2f81f7',
    color: '#fff',
    weight: 3,
    opacity: 1,
    fillOpacity: 0.9
  }).addTo(MAP);
  
  GPS.marker.bindPopup(`
    <div class="pop">
      <div class="ph"><div class="ty">Tu Ubicación</div>
        <div class="nm">📍 En tiempo real</div></div>
      <div class="row"><div class="i">🎯</div><div class="x">
        <div class="k">Precisión</div><div class="d">± ${accuracy.toFixed(0)} metros</div></div></div>
      <div class="row"><div class="i">📡</div><div class="x">
        <div class="k">Coordenadas</div><div class="d">${lat.toFixed(5)}, ${lng.toFixed(5)}</div></div></div>
    </div>
  `);
  
  // Círculo de precisión (azul translúcido)
  GPS.circulo = L.circle([lat, lng], {
    radius: accuracy,
    color: '#2f81f7',
    fillColor: '#2f81f7',
    fillOpacity: 0.1,
    weight: 1,
    dashArray: '5, 5'
  }).addTo(MAP);
  
  // Centrar mapa en tu ubicación
  MAP.setView([lat, lng], 17);
}

function mostrarErrorGPS(error) {
  let msg = '';
  
  switch (error.code) {
    case error.PERMISSION_DENIED:
      msg = 'Permiso de ubicación denegado. Habilita GPS en los ajustes.';
      break;
    case error.POSITION_UNAVAILABLE:
      msg = 'Ubicación no disponible. Intenta en un lugar abierto.';
      break;
    case error.TIMEOUT:
      msg = 'Timeout al obtener ubicación. Intenta de nuevo.';
      break;
  }
  
  console.error('❌ GPS Error: ' + msg);
  alert('⚠️ GPS: ' + msg);
}

// ============================================================
// BOTÓN GPS EN TOP-BAR
// ============================================================

function agregarBotonGPS() {
  if (!isMobile()) return; // Solo en mobile
  
  const topbar = document.getElementById('topbar');
  if (!topbar) return;
  
  // Crear botón
  const btnGPS = document.createElement('button');
  btnGPS.id = 'gpsBtn';
  btnGPS.innerHTML = '📍';
  btnGPS.title = 'Tu ubicación (GPS)';
  btnGPS.style.cssText = `
    background: var(--panel2);
    border: 1px solid var(--line);
    color: var(--txt);
    padding: 9px 14px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    margin-right: 10px;
  `;
  
  // Insertar antes del botón Admin
  const adminBtn = document.getElementById('adminBtn');
  adminBtn.parentNode.insertBefore(btnGPS, adminBtn);
  
  // Click
  btnGPS.onclick = () => {
    iniciarGPS();
    btnGPS.classList.toggle('on', GPS.activo);
  };
  
  // Actualizar cuando cambie estado
  setInterval(() => {
    btnGPS.classList.toggle('on', GPS.activo);
  }, 500);
}

// ============================================================
// AUTO-INICIAR EN MOBILE
// ============================================================

window.addEventListener('load', () => {
  // Solo agregar botón en mobile
  if (isMobile()) {
    setTimeout(agregarBotonGPS, 1000); // Esperar a que cargue el DOM
    console.log('📱 Detectado mobile - Botón GPS agregado');
  }
});

console.log('✅ GPS y ubicación en tiempo real cargado');
