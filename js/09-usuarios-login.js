// ============================================================
//  BLOQUE 9 · SISTEMA DE USUARIOS Y LOGIN
//  Usuarios pueden loguearse y ver capas adicionales
// ============================================================
'use strict';

window.USUARIOS_DB = {
  // Usuarios precargados (admin puede agregar más)
  usuarios: [
    { username: 'usuario', password: 'usuario123', nombre: 'Usuario Demo' },
    { username: 'policia', password: 'policia123', nombre: 'Oficial Policía' }
  ]
};

// Cargar usuarios del localStorage
function cargarUsuarios() {
  try {
    const saved = localStorage.getItem('mapa_usuarios_db');
    if (saved) {
      window.USUARIOS_DB.usuarios = JSON.parse(saved);
      console.log('✅ Usuarios cargados desde localStorage');
    }
  } catch (e) {
    console.warn('⚠️ Error cargando usuarios:', e);
  }
}

// Guardar usuarios en localStorage
function guardarUsuarios() {
  try {
    localStorage.setItem('mapa_usuarios_db', JSON.stringify(USUARIOS_DB.usuarios));
    console.log('✅ Usuarios guardados en localStorage');
  } catch (e) {
    console.warn('⚠️ Error guardando usuarios:', e);
  }
}

// Cargar al iniciar
cargarUsuarios();

// ============================================================
// BOTÓN LOGIN EN TOP-BAR
// ============================================================

function agregarBotonLogin() {
  const topbar = document.getElementById('topbar');
  if (!topbar) return;
  
  const btnLogin = document.createElement('button');
  btnLogin.id = 'loginBtn';
  btnLogin.innerHTML = '👤 Ingresar';
  btnLogin.title = 'Ingresar como usuario';
  btnLogin.style.cssText = `
    background: var(--panel2);
    border: 1px solid var(--line);
    color: var(--txt);
    padding: 9px 14px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    margin-right: 10px;
  `;
  
  // Insertar antes del botón Admin
  const adminBtn = document.getElementById('adminBtn');
  adminBtn.parentNode.insertBefore(btnLogin, adminBtn);
  
  btnLogin.onclick = () => {
    if (usuarioActual.nivel === PERMISOS.USUARIO && usuarioActual.logueado) {
      logoutUsuario();
    } else {
      openModal('loginUsuarioModal');
    }
  };
  
  // Actualizar estado
  setInterval(() => {
    if (usuarioActual.nivel === PERMISOS.USUARIO && usuarioActual.logueado) {
      btnLogin.innerHTML = `👤 ${usuarioActual.nombre}`;
      btnLogin.style.background = '#2ea043';
      btnLogin.title = 'Click para salir';
    } else {
      btnLogin.innerHTML = '👤 Ingresar';
      btnLogin.style.background = 'var(--panel2)';
      btnLogin.title = 'Ingresar como usuario';
    }
  }, 500);
}

// ============================================================
// MODAL LOGIN USUARIO
// ============================================================

function crearModalLoginUsuario() {
  const modal = document.createElement('div');
  modal.id = 'loginUsuarioModal';
  modal.className = 'modal-bg';
  modal.innerHTML = `
    <div class="modal">
      <h3>Ingresar como usuario</h3>
      <p>Ingresá tu usuario y contraseña para ver capas adicionales.</p>
      
      <label>Usuario</label>
      <input id="uUser" type="text" placeholder="usuario">
      
      <label>Contraseña</label>
      <input id="uPass" type="password" placeholder="••••••">
      
      <div class="err" id="uErr"></div>
      
      <div class="mrow">
        <button class="mb-ghost" onclick="closeModal('loginUsuarioModal')">Cancelar</button>
        <button class="mb-primary" onclick="tryLoginUsuario()">Ingresar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Enter key
  document.getElementById('uPass').addEventListener('keydown', e => {
    if (e.key === 'Enter') tryLoginUsuario();
  });
}

function tryLoginUsuario() {
  const user = document.getElementById('uUser').value.trim();
  const pass = document.getElementById('uPass').value;
  
  const err = document.getElementById('uErr');
  err.textContent = '';
  
  if (!user || !pass) {
    err.textContent = 'Ingresá usuario y contraseña.';
    return;
  }
  
  // Buscar usuario
  const usuarioEncontrado = USUARIOS_DB.usuarios.find(
    u => u.username === user && u.password === pass
  );
  
  if (!usuarioEncontrado) {
    err.textContent = 'Usuario o contraseña incorrectos.';
    return;
  }
  
  // Login exitoso
  usuarioActual = {
    nivel: PERMISOS.USUARIO,
    logueado: true,
    nombre: usuarioEncontrado.nombre || user,
    username: user
  };
  
  // Actualizar UI
  actualizarCapasVisibles();
  
  closeModal('loginUsuarioModal');
  document.getElementById('uUser').value = '';
  document.getElementById('uPass').value = '';
  
  console.log('✅ Login usuario: ' + user);
}

function logoutUsuario() {
  usuarioActual = {
    nivel: PERMISOS.PUBLICO,
    logueado: false,
    nombre: 'Visitante'
  };
  
  actualizarCapasVisibles();
  console.log('❌ Logout usuario');
}

// ============================================================
// PANEL ADMIN: AGREGAR USUARIOS
// ============================================================

function crearModalAgregarUsuario() {
  const modal = document.createElement('div');
  modal.id = 'agregarUsuarioModal';
  modal.className = 'modal-bg';
  modal.innerHTML = `
    <div class="modal">
      <h3>Agregar nuevo usuario</h3>
      <p>Solo administrador puede crear nuevos usuarios.</p>
      
      <label>Nombre</label>
      <input id="nNombre" type="text" placeholder="Nombre del usuario">
      
      <label>Usuario (login)</label>
      <input id="nUser" type="text" placeholder="usuario">
      
      <label>Contraseña</label>
      <input id="nPass" type="password" placeholder="••••••">
      
      <div class="err" id="nErr"></div>
      
      <div class="mrow">
        <button class="mb-ghost" onclick="closeModal('agregarUsuarioModal')">Cancelar</button>
        <button class="mb-primary" onclick="crearUsuario()">Crear usuario</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function crearUsuario() {
  if (usuarioActual.nivel !== PERMISOS.ADMIN) {
    alert('⚠️ Solo admin puede crear usuarios');
    return;
  }
  
  const nombre = document.getElementById('nNombre').value.trim();
  const user = document.getElementById('nUser').value.trim();
  const pass = document.getElementById('nPass').value;
  
  const err = document.getElementById('nErr');
  err.textContent = '';
  
  if (!nombre || !user || !pass) {
    err.textContent = 'Completa todos los campos.';
    return;
  }
  
  if (user.length < 3) {
    err.textContent = 'Usuario debe tener al menos 3 caracteres.';
    return;
  }
  
  if (pass.length < 6) {
    err.textContent = 'Contraseña debe tener al menos 6 caracteres.';
    return;
  }
  
  // Verificar si ya existe
  if (USUARIOS_DB.usuarios.find(u => u.username === user)) {
    err.textContent = 'Este usuario ya existe.';
    return;
  }
  
  // Agregar usuario
  USUARIOS_DB.usuarios.push({
    username: user,
    password: pass,
    nombre: nombre
  });
  
  guardarUsuarios();
  
  closeModal('agregarUsuarioModal');
  document.getElementById('nNombre').value = '';
  document.getElementById('nUser').value = '';
  document.getElementById('nPass').value = '';
  
  alert(`✅ Usuario '${user}' creado correctamente.`);
  console.log('✅ Usuario creado: ' + user);
}

// ============================================================
// BOTÓN AGREGAR USUARIO (en panel admin)
// ============================================================

function agregarBotonNuevoUsuario() {
  const adminBar = document.getElementById('adminBar');
  if (!adminBar) return;
  
  const btn = document.createElement('button');
  btn.className = 'abtn';
  btn.innerHTML = '👥 Agregar usuario';
  btn.onclick = () => {
    if (usuarioActual.nivel !== PERMISOS.ADMIN) {
      alert('⚠️ Solo admin puede agregar usuarios');
      return;
    }
    openModal('agregarUsuarioModal');
  };
  
  adminBar.appendChild(btn);
}

// ============================================================
// LISTAR USUARIOS (para admin)
// ============================================================

function listarUsuarios() {
  console.log('👥 USUARIOS REGISTRADOS:');
  USUARIOS_DB.usuarios.forEach((u, i) => {
    console.log(`  ${i+1}. ${u.nombre} (${u.username})`);
  });
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

window.addEventListener('load', () => {
  setTimeout(() => {
    crearModalLoginUsuario();
    crearModalAgregarUsuario();
    agregarBotonLogin();
    agregarBotonNuevoUsuario();
    console.log('✅ Sistema de usuarios cargado');
    console.log(`📊 Usuarios disponibles: ${USUARIOS_DB.usuarios.length}`);
  }, 500);
});

console.log('✅ Usuarios y login cargado');
