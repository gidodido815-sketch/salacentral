// ============================================================
//  BLOQUE 6 · ADMINISTRADOR + SISTEMA DE PERMISOS
//  Login, permisos (público/usuario/admin), y capas dinámicas
// ============================================================
'use strict';

const body = document.body;
const adminBtn = document.getElementById('adminBtn');

// SISTEMA DE PERMISOS
window.PERMISOS = {
  PUBLICO: 'publico',
  USUARIO: 'usuario',
  ADMIN: 'admin'
};

window.usuarioActual = {
  nivel: PERMISOS.PUBLICO,
  logueado: false,
  nombre: 'Visitante'
};

// ============================================================
// MODALES
// ============================================================

function openModal(id) { 
  document.getElementById(id).classList.add('show'); 
}

function closeModal(id) { 
  document.getElementById(id).classList.remove('show'); 
}

// ============================================================
// LOGIN ADMIN
// ============================================================

adminBtn.onclick = () => {
  if (usuarioActual.nivel === PERMISOS.ADMIN) {
    logoutAdmin();
  } else {
    openModal('loginModal');
  }
};

document.getElementById('loginCancel').onclick = () => {
  closeModal('loginModal');
  document.getElementById('pwd').value = '';
  document.getElementById('pwdErr').textContent = '';
};

document.getElementById('loginOk').onclick = tryLogin;
document.getElementById('pwd').addEventListener('keydown', e => {
  if (e.key === 'Enter') tryLogin();
});

function tryLogin() {
  const p = document.getElementById('pwd').value;
  
  // ⚠️ Aquí iría autenticación real con servidor en producción
  if (p === CFG.ADMIN_PASS) {
    usuarioActual = {
      nivel: PERMISOS.ADMIN,
      logueado: true,
      nombre: 'Administrador'
    };
    
    body.classList.add('admin');
    adminBtn.classList.add('on');
    document.getElementById('adminBtnTx').textContent = 'Salir';
    adminBtn.querySelector('span').textContent = '🔓';
    document.getElementById('adminTag').style.display = 'block';
    
    // Actualizar capas visibles
    actualizarCapasVisibles();
    
    closeModal('loginModal');
    document.getElementById('pwd').value = '';
  } else {
    document.getElementById('pwdErr').textContent = 'Clave incorrecta.';
  }
}

function loginUsuario(usuario, contrasena) {
  // Aquí iría autenticación real con servidor
  // Por ahora solo cambiar nivel
  usuarioActual = {
    nivel: PERMISOS.USUARIO,
    logueado: true,
    nombre: usuario || 'Usuario'
  };
  
  actualizarCapasVisibles();
  console.log('✅ Login usuario: ' + usuario);
}

function logoutAdmin() {
  usuarioActual = {
    nivel: PERMISOS.PUBLICO,
    logueado: false,
    nombre: 'Visitante'
  };
  
  body.classList.remove('admin');
  adminBtn.classList.remove('on');
  document.getElementById('adminBtnTx').textContent = 'Admin';
  adminBtn.querySelector('span').textContent = '🔒';
  document.getElementById('adminTag').style.display = 'none';
  
  addMode = false;
  document.getElementById('aAdd').classList.remove('act');
  MAP.getContainer().style.cursor = '';
  
  // Actualizar capas visibles
  actualizarCapasVisibles();
  
  console.log('❌ Logout admin');
}

// ============================================================
// CONTROL DE CAPAS POR PERMISOS
// ============================================================

function actualizarCapasVisibles() {
  const permisos = usuarioActual.nivel;
  
  // COMISARIAS: siempre visible
  if (permisos === PERMISOS.PUBLICO || permisos === PERMISOS.USUARIO || permisos === PERMISOS.ADMIN) {
    // Mostrar solo Comisarías (no sub-comisarías si es público)
    comisMarkers.forEach(m => {
      const esSubComisaria = m.data.tipo === 'SUB_COMISARIA';
      const debeVerse = permisos === PERMISOS.PUBLICO ? !esSubComisaria : true;
      
      if (debeVerse) {
        if (!LAYERS.comis.hasLayer(m.marker)) LAYERS.comis.addLayer(m.marker);
      } else {
        LAYERS.comis.removeLayer(m.marker);
      }
    });
  }
  
  // SUB-COMISARIAS: solo usuarios y admin
  if (permisos === PERMISOS.USUARIO || permisos === PERMISOS.ADMIN) {
    // Ya están en comisMarkers, solo mostrar
  } else if (permisos === PERMISOS.PUBLICO) {
    // Ocultar sub-comisarías para público
  }
  
  // DIRECTORIO (casillas, garitas, dsto): solo usuarios y admin
  if (window.LAYERS.casillas && (permisos === PERMISOS.USUARIO || permisos === PERMISOS.ADMIN)) {
    MAP.addLayer(LAYERS.casillas);
    MAP.addLayer(LAYERS.garitas);
    MAP.addLayer(LAYERS.dsto);
  } else if (window.LAYERS.casillas && permisos === PERMISOS.PUBLICO) {
    MAP.removeLayer(LAYERS.casillas);
    MAP.removeLayer(LAYERS.garitas);
    MAP.removeLayer(LAYERS.dsto);
  }
  
  // Actualizar UI
  actualizarMenuCapas();
}

function actualizarMenuCapas() {
  const permisos = usuarioActual.nivel;
  const toggles = document.querySelectorAll('.toggle');
  
  toggles.forEach(t => {
    const layer = t.dataset.layer;
    
    // Deshabilitar toggles que el usuario no puede ver
    if (layer === 'subcomis' && permisos === PERMISOS.PUBLICO) {
      t.style.opacity = '0.5';
      t.style.pointerEvents = 'none';
    } else if ((layer === 'casillas' || layer === 'garitas' || layer === 'dsto') && permisos === PERMISOS.PUBLICO) {
      t.style.opacity = '0.5';
      t.style.pointerEvents = 'none';
    } else {
      t.style.opacity = '1';
      t.style.pointerEvents = 'auto';
    }
  });
}

// ============================================================
// AGREGAR PUNTO (ADMIN)
// ============================================================

let addMode = false, pendingLatLng = null;

document.getElementById('aAdd').onclick = () => {
  if (usuarioActual.nivel !== PERMISOS.ADMIN) {
    alert('Solo el administrador puede agregar puntos');
    return;
  }
  
  addMode = !addMode;
  document.getElementById('aAdd').classList.toggle('act', addMode);
  MAP.getContainer().style.cursor = addMode ? 'crosshair' : '';
};

MAP.on('click', e => {
  if (!addMode || usuarioActual.nivel !== PERMISOS.ADMIN) return;
  
  pendingLatLng = e.latlng;
  ['eDep', 'eTel', 'eDir', 'eDsc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('eTipo').value = 'COMISARIA';
  openModal('editModal');
});

document.getElementById('editCancel').onclick = () => closeModal('editModal');
document.getElementById('editSave').onclick = () => {
  if (!pendingLatLng || usuarioActual.nivel !== PERMISOS.ADMIN) return;
  
  const dn = parseInt(document.getElementById('eDsc').value) || 1;
  const c = {
    dependencia: document.getElementById('eDep').value || '(sin nombre)',
    tipo: document.getElementById('eTipo').value,
    dscnum: dn,
    departamental: depName(dn),
    telefono: document.getElementById('eTel').value,
    direccion: document.getElementById('eDir').value,
    lat: pendingLatLng.lat,
    lon: pendingLatLng.lng
  };
  
  DATA_COMISARIAS.push(c);
  const m = L.marker([c.lat, c.lon], { icon: shieldIcon(c.dscnum) }).bindPopup(comisPopup(c));
  m.addTo(LAYERS.comis);
  comisMarkers.push({ data: c, marker: m });
  m.openPopup();
  
  closeModal('editModal');
  addMode = false;
  document.getElementById('aAdd').classList.remove('act');
  MAP.getContainer().style.cursor = '';
  
  const st = document.getElementById('stComis');
  if (st) st.textContent = DATA_COMISARIAS.length + (window.DATA_DIRECTORIO ? DATA_DIRECTORIO.length : 0);
};

// ============================================================
// EXPORTAR / IMPORTAR BLOQUES
// ============================================================

function downloadBlock(varname, obj, filename) {
  const blob = new Blob(
    [`// === BLOQUE: ${filename} ===\nwindow.${varname} = ${JSON.stringify(obj)};\n`],
    { type: 'text/javascript' }
  );
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

document.getElementById('aExport').onclick = () => {
  if (usuarioActual.nivel !== PERMISOS.ADMIN) {
    alert('Solo el administrador puede exportar');
    return;
  }
  downloadBlock('DATA_COMISARIAS', DATA_COMISARIAS, 'comisarias.js');
  downloadBlock('DATA_CAMARAS', DATA_CAMARAS, 'camaras.js');
};

document.getElementById('aImport').onclick = () => {
  if (usuarioActual.nivel !== PERMISOS.ADMIN) {
    alert('Solo el administrador puede importar');
    return;
  }
  document.getElementById('aFile').click();
};

document.getElementById('aFile').onchange = e => {
  const f = e.target.files[0];
  if (!f) return;
  
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const t = rd.result;
      if (/DATA_CAMARAS/.test(t)) {
        const m = t.match(/=\s*([\s\S]*?);?\s*$/);
        window.DATA_CAMARAS = JSON.parse(m[1]);
        renderCams();
      } else if (/DATA_COMISARIAS/.test(t)) {
        const m = t.match(/=\s*([\s\S]*?);?\s*$/);
        window.DATA_COMISARIAS = JSON.parse(m[1]);
        renderComis();
        applyDscFilter();
      } else {
        alert('No reconozco ese bloque. Subí comisarias.js o camaras.js.');
        return;
      }
      alert('Bloque importado correctamente.');
    } catch (err) {
      alert('Archivo inválido: ' + err.message);
    }
  };
  rd.readAsText(f);
};

console.log('✅ Admin + Permisos cargado');
