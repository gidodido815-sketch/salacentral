# 🗺️ Mapa Operativo Policial - D.G.C Santiago del Estero

**Versión:** 2.0 Mejorada  
**Fecha:** 2026-01-15  
**Provincia:** Santiago del Estero, Argentina

## 📋 Resumen

Mapa web profesional de dependencias policiales, zonas D.S.C y cámaras de seguridad. Hecho **por bloques independientes** para fácil mantenimiento y escalabilidad.

## 📊 Datos Incluidos

✅ **211 Puntos georreferenciados:**
- 67 Comisarías
- 10 Sub-Comisarías
- 62 Casillas
- 29 Garitas (🎉 TODAS GEORREFERENCIADAS)
- 43 Destacamentos Policiales

✅ **19 Distritos de Seguridad Ciudadana (D.S.C)**

✅ **Cámaras de seguridad** (ubicación y estado)

## 📂 Estructura de Carpetas

```
mapa-operativo/
├── index.html                    ← Página principal
├── css/
│   └── estilos.css             ← BLOQUE de estilos (reemplazable)
├── js/                          ← BLOQUES DE CÓDIGO (orden importa)
│   ├── 01-config.js            ← Clave admin, colores, config
│   ├── 02-iconos.js            ← Íconos SVG (escudo, cámara)
│   ├── 03-mapa.js              ← Mapa base Leaflet
│   ├── 04-capas.js             ← Dibujo de capas y popups
│   ├── 05-busqueda.js          ← Búsqueda de direcciones
│   ├── 06-admin.js             ← Login y edición
│   └── 07-init.js              ← Inicialización
├── data/                        ← BLOQUES DE DATOS (independientes)
│   ├── etiquetas.js            ← Nombres de D.S.C
│   ├── comisarias.js           ← 67 + 10 comisarías
│   ├── zonas.js                ← Polígonos D.S.C
│   ├── directorio.js           ← Casillas, garitas, dsto
│   └── camaras.js              ← Cámaras de seguridad
└── img/
    └── escudo.png              ← Logo D.G.C
```

## 🚀 Cómo Usar

### Opción 1: Local (Pruebas)

1. Descargá y extraé `mapa-operativo-mejorado.zip`
2. Abrí `index.html` en navegador
3. ✅ Funciona completamente offline

### Opción 2: GitHub Pages (En línea)

1. Crea cuenta en github.com (gratis)
2. New Repository → nombre: `mapa-dgc` → Public
3. Uploadea TODOS los archivos (estructura igual a ésta)
4. Settings → Pages → Source: main, folder: /(root) → Save
5. En 1-2 minutos obtenés: `https://TU-USUARIO.github.io/mapa-dgc/`

### Opción 3: Vercel (Automático desde GitHub)

1. Conectá tu repo de GitHub a Vercel
2. Deploy automático en cada push
3. URL personalizada disponible
4. Actualizaciones en 30 segundos

## 🔑 Clave de Administrador

Está en `js/01-config.js`, línea:
```javascript
ADMIN_PASS: 'dgc2026'
```

**IMPORTANTE:** Cambiala en producción.

## 🎯 Funcionalidades

### Para Todos (Público)
- ✅ Ver todas las dependencias en el mapa
- ✅ Búsqueda de direcciones
- ✅ Identificar D.S.C y Comisaría jurisdiccional
- ✅ Activar/desactivar capas
- ✅ Ver detalles (teléfono, dirección)

### Admin (Con clave)
- ✅ Agregar nuevas ubicaciones (click + formulario)
- ✅ Exportar bloques de datos actualizados
- ✅ Importar bloques (para sincronizar cambios)
- ✅ Editar datos en tiempo real

## 🔄 Actualizar Datos

### Cuando Cambian Comisarías/Direcciones

1. **Editar localmente:** `data/comisarias.js` o `data/directorio.js`
2. **O usar Admin:** Click "Agregar punto" → ubicá en mapa → guardar
3. **Exportar:** Admin → "Exportar bloques" (baja archivos actualizados)
4. **Subir a GitHub:** Reemplazá el archivo en `data/`
5. **Vercel:** Deploy automático en 30 segundos

### Cambios Masivos (Excel → JS)

Usá el script Python proporcionado:
```bash
python3 generar_bloques.py MAPA_OPERATIVO_BASE_DATOS.xlsx
```

Output: `data-comisarias.js`, `data-directorio.js`, `data-etiquetas.js`

## 📋 Cambios en v2.0

✅ **Datos Normalizados:** 211 puntos validados y georeferenciados  
✅ **Garitas Georreferenciadas:** Las 29 garitas ahora tienen coordenadas exactas  
✅ **Estructura Modular:** Mejor separación de datos y código  
✅ **Búsqueda Mejorada:** Más rápida y precisa  
✅ **Admin Robusto:** Agregar/editar puntos sin perder datos  
✅ **Documentación:** Completa y profesional  

## ⚠️ Pendientes

- 6 Cámaras sin coordenadas: ubicarlas con Admin o editar `data/camaras.js`
- Polígonos de D.S.C: optimizar zoom/renderizado
- Nuevas direcciones: agregar a medida que lleguen

## 🔧 Mantenimiento

### Agregar una Comisaría

1. Admin → "Agregar punto"
2. Click en el mapa
3. Completá: nombre, D.S.C, teléfono, dirección
4. Guardar
5. Admin → "Exportar bloques"
6. Subí a GitHub → Vercel redeploy

### Cambiar la Clave Admin

Editá `js/01-config.js`:
```javascript
ADMIN_PASS: 'TU-CLAVE-NUEVA'
```

## 📞 Soporte

**Administrador:** Guido (D.G.C.)  
**Email:** guido@dgc.gov.ar  
**Actualizado:** 2026-01-15  

---

## 📖 Documentación Detallada

Ver archivos adicionales:
- `GUIA_RAPIDA.md` - Paso a paso rápido
- `ESPECIFICACION_TECNICA.md` - Arquitectura completa
- `TROUBLESHOOTING.md` - Solución de problemas

---

**Hecho con ❤️ para la Policía de Santiago del Estero**
