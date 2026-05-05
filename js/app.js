// =====================================================
// CURSO DE CRIANZA - 28 DÍAS - VERSIÓN PROFESIONAL COMPLETA
// CON TEORÍAS FORMATEADAS Y MODALES MEJORADOS
// =====================================================

// --- ESTADO DEL CURSO ---
let cursoEstado = {
  diaActual: 1,
  completados: [],
  estiloCrianza: null,
  racha: 0,
  ultimoCompletado: null,
  medallas: [],
  estadisticas: {
    tiempoTotalMinutos: 0,
    ultimoAcceso: null,
    diasMasProductivos: {}
  }
};
// =====================================================
// SISTEMA DE LICENCIA - DEMO (7 días) / PRO (33 días)
// Precio: $59 MXN / anual
// =====================================================

// Estado de licencia
let licencia = {
  tipo: "demo",     // "demo" o "pro"
  activa: true,
  expira: null,
  email: null
};
let usuarioActual = null;
let usuarioId = null;


// =====================================================
// FUNCIONES DE AUTH Y LICENCIA CON FIREBASE
// =====================================================
async function cargarLicenciaFirebase() {
  const email = localStorage.getItem("emailLicencia");
  if (!email) return false;
  
  try {
    const docRef = db.collection("licencias").doc(email);
    const doc = await docRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      if (data.tipo === "pro" && new Date(data.expira) > new Date()) {
        licencia.tipo = "pro";
        licencia.expira = data.expira;
        licencia.email = data.email;
        guardarLicenciaLocal();
        return true;
      }
    }
  } catch (error) {
    console.log("Error cargando licencia:", error);
  }
  return false;
}
async function guardarProgresoFirebase() {
  const email = localStorage.getItem("emailLicencia");
  if (!email || licencia.tipo !== "pro") return;
  
  try {
    await db.collection("progreso").doc(email).set({
      diaActual: cursoEstado.diaActual,
      completados: cursoEstado.completados,
      estiloCrianza: cursoEstado.estiloCrianza,
      racha: cursoEstado.racha,
      ultimoCompletado: cursoEstado.ultimoCompletado,
      medallas: cursoEstado.medallas,
      estadisticas: cursoEstado.estadisticas,
      actualizado: new Date().toISOString()
    });
  } catch (error) {
    console.log("Error guardando progreso:", error);
  }
}

async function cargarProgresoFirebase() {
  const email = localStorage.getItem("emailLicencia");
  if (!email || licencia.tipo !== "pro") return;
  
  try {
    const docRef = db.collection("progreso").doc(email);
    const doc = await docRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      cursoEstado = {
        ...cursoEstado,
        ...data,
        completados: data.completados || [],
        medallas: data.medallas || []
      };
      guardarProgresoLocal();
    }
  } catch (error) {
    console.log("Error cargando progreso:", error);
  }
}


function guardarLicenciaLocal() {
  localStorage.setItem("licenciaCrianza", JSON.stringify({
    tipo: licencia.tipo,
    expira: licencia.expira,
    email: licencia.email
  }));
  if (licencia.email) localStorage.setItem("emailLicencia", licencia.email);
}


function guardarProgresoLocal() {
  localStorage.setItem("cursoCrianzaProfesional", JSON.stringify(cursoEstado));
}

function cargarProgresoLocal() {
  const guardado = localStorage.getItem("cursoCrianzaProfesional");
  if (guardado) {
    const temp = JSON.parse(guardado);
    cursoEstado = { ...cursoEstado, ...temp };
  }
}

// Activar licencia con código
async function activarProConCodigo(codigo, email) {
  if (!usuarioId) {
    return { valido: false, mensaje: "❌ Debes iniciar sesión primero. Usa el botón 'Iniciar sesión'." };
  }
  
  try {
    const codigosRef = db.collection("codigos");
    const query = await codigosRef.where("codigo", "==", codigo).get();
    
    if (query.empty) {
      return { valido: false, mensaje: "❌ Código inválido" };
    }
    
    const docCodigo = query.docs[0];
    const codigoData = docCodigo.data();
    
    if (codigoData.usado) {
      return { valido: false, mensaje: "❌ Este código ya fue usado" };
    }
    
    if (new Date(codigoData.expira) < new Date()) {
      return { valido: false, mensaje: "❌ Código expirado" };
    }
    
    await docCodigo.ref.update({
      usado: true,
      usadoPor: usuarioId,
      usadoEn: new Date().toISOString(),
      email: email
    });
    
    const expira = new Date();
    expira.setFullYear(expira.getFullYear() + 1);
    
    await db.collection("licencias").doc(usuarioId).set({
      tipo: "pro",
      expira: expira.toISOString(),
      email: email,
      activadoEn: new Date().toISOString()
    });
    
    licencia.tipo = "pro";
    licencia.expira = expira.toISOString();
    licencia.email = email;
    guardarLicenciaLocal();
    
    return { valido: true, mensaje: "✅ ¡Licencia Pro activada! Funciona en todos tus dispositivos." };
    
  } catch (error) {
    console.error(error);
    return { valido: false, mensaje: "❌ Error al activar. Intenta de nuevo." };
  }
}

// Verificar si el usuario puede acceder a un día específico
function puedeAccederADia(dia) {
  if (licencia.tipo === "pro") return true;
  return dia <= 7;
}


// =====================================================
// PANEL ADMIN (generar códigos)
// =====================================================

async function mostrarPanelAdmin() {
  const clave = prompt("🔐 Contraseña de administrador:");
  if (clave !== "admin123") {
    alert("Acceso denegado");
    mostrarPantallaPrincipal();
    return;
  }
  
  const codigosSnapshot = await db.collection("codigos").get();
  let listaCodigos = "";
  codigosSnapshot.forEach(doc => {
    const data = doc.data();
    listaCodigos += `
      <tr>
        <td style="border:1px solid #ddd; padding:8px; font-family:monospace;">${data.codigo}</td>
        <td style="border:1px solid #ddd; padding:8px;">${data.usado ? '✅ Usado' : '🟢 Disponible'}</td>
        <td style="border:1px solid #ddd; padding:8px;">${data.usadoPor || '—'}</td>
        <td style="border:1px solid #ddd; padding:8px;">${new Date(data.expira).toLocaleDateString()}</td>
      </tr>
    `;
  });
  
  const html = `
    <div class="card">
      <h2>🔧 Panel Admin</h2>
      <button id="btnGenerarCodigo" class="juego">➕ Generar código (1 año)</button>
      <div style="margin-top:1rem; overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse;">
          <tr style="background:#4CAF50; color:white;">
            <th>Código</th><th>Estado</th><th>Usado por</th><th>Expira</th>
          </tr>
          ${listaCodigos || '<tr><td colspan="4">No hay códigos</td></tr>'}
        </table>
      </div>
      <button id="btnVolverAdmin" class="juego">Volver</button>
    </div>
  `;
  
  document.getElementById("contenido").innerHTML = html;
  
  document.getElementById("btnGenerarCodigo")?.addEventListener("click", async () => {
    const codigo = "CRIANZA-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const expira = new Date();
    expira.setFullYear(expira.getFullYear() + 1);
    
    await db.collection("codigos").doc(codigo).set({
      codigo: codigo,
      usado: false,
      expira: expira.toISOString(),
      creado: new Date().toISOString()
    });
    
    alert(`✅ Código generado:\n\n${codigo}\n\nCópialo y envíalo al usuario.`);
    mostrarPanelAdmin();
  });
  
  document.getElementById("btnVolverAdmin")?.addEventListener("click", mostrarPantallaPrincipal);
}

// =====================================================
// MOSTRAR OFERTA PRO CON LOGIN
// =====================================================

function mostrarOfertaPro() {
  const html = `
    <div class="card" style="text-align:center; max-width:500px; margin:0 auto;">
      <span style="font-size:3rem;">🌟</span>
      <h2>Desbloquea el curso completo</h2>
      <p>Accede a los <strong>33 días</strong> del curso de crianza consciente</p>
      
      <div style="background:linear-gradient(135deg, #4CAF50, #2e7d32); color:white; padding:1.5rem; border-radius:1.5rem; margin:1.5rem 0; position:relative;">
        <div style="position:absolute; top:-10px; right:0; background:#ff9800; color:#333; padding:4px 12px; border-radius:20px; font-size:0.7rem; font-weight:bold;">
          🔥 70% DESCUENTO
        </div>
        <div style="font-size:0.8rem; text-decoration:line-through; opacity:0.7;">$199 MXN</div>
        <div style="font-size:3rem; font-weight:bold;">$59</div>
        <div>MXN / año</div>
        <div style="font-size:0.7rem; margin-top:0.5rem;">⚡ Precio especial. En julio 2026 sube a $199</div>
      </div>
      
      
      <div style="margin:1.5rem 0; padding:1rem; background:#f5f5f5; border-radius:1rem;">
        <h3>🔑 Activar licencia Pro</h3>
        <input type="email" id="emailLicenciaInput" placeholder="Tu correo electrónico" style="width:100%; padding:0.8rem; border-radius:1rem; border:1px solid #ccc; margin-bottom:0.5rem;">
        <input type="text" id="codigoLicenciaInput" placeholder="Código de licencia" style="width:100%; padding:0.8rem; border-radius:1rem; border:1px solid #ccc;">
        <button id="btnActivarLicencia" class="juego" style="margin-top:0.5rem;">✅ Activar licencia</button>
        <p id="mensajeActivacion" style="margin-top:0.5rem;"></p>
      </div>
      
      <div style="margin:1rem 0;">
        <p><strong>¿No tienes código?</strong></p>
        <button id="btnComprarWP" class="juego" style="background:#25D366;">📱 Comprar por WhatsApp</button>
      </div>
        <p style="font-size:0.7rem; margin-top:0.5rem;">🎯 Oferta por tiempo limitado. Aprovecha el 70% de descuento.</p>
      
      <button id="btnVolverOferta" class="juego" style="background:#ccc;">Volver al curso demo</button>
    </div>
  `;
  
  document.getElementById("contenido").innerHTML = html;

  
  document.getElementById("btnActivarLicencia")?.addEventListener("click", async () => {
    const email = document.getElementById("emailLicenciaInput").value.trim();
    const codigo = document.getElementById("codigoLicenciaInput").value.trim().toUpperCase();
    const mensajeDiv = document.getElementById("mensajeActivacion");
    
    if (!email || !codigo) {
      mensajeDiv.innerHTML = "<span style='color:#f44336;'>❌ Ingresa email y código</span>";
      return;
    }
    
    mensajeDiv.innerHTML = "<span style='color:#2196F3;'>⏳ Validando...</span>";
    const resultado = await activarLicenciaPorEmail(codigo, email);
    mensajeDiv.innerHTML = `<span style='color:${resultado.valido ? '#4CAF50' : '#f44336'}'>${resultado.mensaje}</span>`;
    
    if (resultado.valido) {
      setTimeout(() => mostrarPantallaPrincipal(), 2000);
    }
  });
  
  document.getElementById("btnComprarWP")?.addEventListener("click", () => {
    const numeroWhatsApp = "524641177116";
    const mensaje = encodeURIComponent(
      "Hola, quiero comprar la licencia Pro del curso de crianza ($59 MXN - 70% descuento). Mi correo para activar la licencia es: [ESCRIBE AQUÍ TU CORREO]. ¿Me envías los datos para pagar? Gracias."
    );
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, "_blank");
  });
  
  document.getElementById("btnVolverOferta")?.addEventListener("click", mostrarPantallaPrincipal);
  asignarEventosNavegacion();
}

// =====================================================
// SISTEMA DE LICENCIA SIMPLIFICADO - UNA SOLA VARIABLE
// =====================================================

// Activar licencia usando email + código
async function activarLicenciaPorEmail(codigo, email) {
  if (!email || !codigo) {
    return { valido: false, mensaje: "❌ Ingresa email y código" };
  }
  
  if (!email.includes("@") || !email.includes(".")) {
    return { valido: false, mensaje: "❌ Ingresa un email válido" };
  }
  
  try {
    // Buscar código en Firestore
    const codigosRef = db.collection("codigos");
    const query = await codigosRef.where("codigo", "==", codigo.toUpperCase()).get();
    
    if (query.empty) {
      return { valido: false, mensaje: "❌ Código inválido" };
    }
    
    const docCodigo = query.docs[0];
    const codigoData = docCodigo.data();
    
    if (codigoData.usado) {
      return { valido: false, mensaje: "❌ Este código ya fue usado por otro email" };
    }
    
    if (new Date(codigoData.expira) < new Date()) {
      return { valido: false, mensaje: "❌ Código expirado" };
    }
    
    // Marcar código como usado
    await docCodigo.ref.update({
      usado: true,
      usadoPor: email,
      usadoEn: new Date().toISOString()
    });
    
    // Activar licencia
    const expira = new Date();
    expira.setFullYear(expira.getFullYear() + 1);
    
    licencia = {
      tipo: "pro",
      activa: true,
      expira: expira.toISOString(),
      email: email
    };
    
    // ✅ UNIFICADO: Solo usamos "emailPro" para todo
    localStorage.setItem("emailPro", email);
    localStorage.setItem("licenciaPro", JSON.stringify({
      tipo: licencia.tipo,
      expira: licencia.expira,
      email: licencia.email
    }));
    
    // Guardar en Firestore
    await db.collection("licencias").doc(email).set({
      tipo: "pro",
      expira: expira.toISOString(),
      email: email,
      activadoEn: new Date().toISOString(),
      codigoUsado: codigo.toUpperCase()
    });
    
    return { valido: true, mensaje: "✅ ¡Licencia Pro activada! Puedes cerrar y volver a entrar sin código." };
    
  } catch (error) {
    console.error("Error activando licencia:", error);
    return { valido: false, mensaje: "❌ Error al activar. Verifica tu conexión." };
  }
}

// Recuperar licencia automáticamente (se llama al iniciar la app)
async function recuperarLicenciaAutomatica() {
  // ✅ Buscar el email guardado con la variable UNIFICADA
  const email = localStorage.getItem("emailPro");
  
  if (!email) {
    console.log("📧 No hay email guardado, modo demo");
    return false;
  }
  
  try {
    const docRef = db.collection("licencias").doc(email);
    const doc = await docRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      if (data.tipo === "pro" && new Date(data.expira) > new Date()) {
        licencia = {
          tipo: "pro",
          activa: true,
          expira: data.expira,
          email: email
        };
        // ✅ Actualizar localStorage (por si acaso)
        localStorage.setItem("licenciaPro", JSON.stringify({
          tipo: licencia.tipo,
          expira: licencia.expira,
          email: licencia.email
        }));
        console.log("✅ Licencia Pro recuperada para:", email);
        return true;
      } else {
        console.log("⚠️ Licencia expirada para:", email);
        localStorage.removeItem("emailPro");
        localStorage.removeItem("licenciaPro");
      }
    } else {
      console.log("📧 No se encontró licencia para:", email);
    }
  } catch (error) {
    console.log("Error recuperando licencia:", error);
  }
  return false;
}

// --- CONFIGURACIÓN ---
let modoOscuro = localStorage.getItem("modoOscuro") === "true";
let vozActiva = localStorage.getItem("vozActiva") === "true";

// --- FUNCIONES DE PROGRESO ---
function cargarProgreso() {
  const guardado = localStorage.getItem("cursoCrianzaProfesional");
  if (guardado) {
    cursoEstado = JSON.parse(guardado);
  }
  if (!cursoEstado.medallas) cursoEstado.medallas = [];
  if (!cursoEstado.estadisticas) cursoEstado.estadisticas = { tiempoTotalMinutos: 0, ultimoAcceso: null, diasMasProductivos: {} };
  // VALIDACIÓN: si diaActual excede 33, corregir
  if (cursoEstado.diaActual > 33) cursoEstado.diaActual = 33;
  actualizarMedallas();
}

function guardarProgreso() {
  localStorage.setItem("cursoCrianzaProfesional", JSON.stringify(cursoEstado));
  localStorage.setItem("modoOscuro", modoOscuro);
  localStorage.setItem("vozActiva", vozActiva);
  if (modoOscuro) document.body.classList.add("dark-mode");
  else document.body.classList.remove("dark-mode");
}

function actualizarMedallas() {
  const completados = cursoEstado.completados.length;
  
  if (completados >= 1 && !cursoEstado.medallas.includes("primer_paso")) {
    cursoEstado.medallas.push("primer_paso");
    mostrarNotificacion("🏅 ¡Medalla desbloqueada! PRIMER PASO - Completaste tu primer día.");
  }
  if (completados >= 7 && !cursoEstado.medallas.includes("semana_completa")) {
    cursoEstado.medallas.push("semana_completa");
    mostrarNotificacion("🏅 ¡Medalla desbloqueada! SEMANA COMPLETA - 7 días de compromiso.");
  }
  if (cursoEstado.racha >= 7 && !cursoEstado.medallas.includes("racha_7")) {
    cursoEstado.medallas.push("racha_7");
    mostrarNotificacion("🏅 ¡Medalla desbloqueada! RACHA DE FUEGO - 7 días seguidos practicando.");
  }
  if (completados >= 14 && !cursoEstado.medallas.includes("mitad_camino")) {
    cursoEstado.medallas.push("mitad_camino");
    mostrarNotificacion("🏅 ¡Medalla desbloqueada! MITAD DE CAMINO - 14 días completados.");
  }
  if (completados >= 21 && !cursoEstado.medallas.includes("cerca_meta")) {
    cursoEstado.medallas.push("cerca_meta");
    mostrarNotificacion("🏅 ¡Medalla desbloqueada! CERCA DE LA META - 21 días, el final está cerca.");
  }
  if (completados >= 28 && !cursoEstado.medallas.includes("compromiso_28")) {
    cursoEstado.medallas.push("compromiso_28");
    mostrarNotificacion("🏅 ¡Medalla desbloqueada! COMPROMISO - 28 días completados.");
  }
  if (completados >= 33 && !cursoEstado.medallas.includes("maestro_parental")) {
    cursoEstado.medallas.push("maestro_parental");
    mostrarNotificacion("🏅 ¡MEDALLA MÁXIMA! MAESTRO PARENTAL - Completaste los 33 días. ¡Eres un ejemplo!");
  }
  guardarProgreso();
}

function mostrarNotificacion(mensaje) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Curso de Crianza", { body: mensaje, icon: "icons/icon-192.png" });
  }
  const toast = document.createElement("div");
  toast.textContent = mensaje;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.backgroundColor = "#4CAF50";
  toast.style.color = "white";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "40px";
  toast.style.zIndex = "1000";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function completarDia(dia) {
  if (!cursoEstado.completados.includes(dia)) {
    cursoEstado.completados.push(dia);
    
    const hoy = new Date().toDateString();
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    
    if (cursoEstado.ultimoCompletado === hoy) {
      // Ya completó hoy
    } else if (cursoEstado.ultimoCompletado === ayer.toDateString()) {
      cursoEstado.racha++;
    } else {
      cursoEstado.racha = 1;
    }
    cursoEstado.ultimoCompletado = hoy;
    
    const diaSemana = new Date().getDay();
    cursoEstado.estadisticas.diasMasProductivos[diaSemana] = (cursoEstado.estadisticas.diasMasProductivos[diaSemana] || 0) + 1;
    
    if (dia === cursoEstado.diaActual) {
      cursoEstado.diaActual++;
    }
    
    actualizarMedallas();
    guardarProgreso();
    programarRecordatorio();
  }
}

function programarRecordatorio() {
  if ("Notification" in window && Notification.permission === "granted") {
    setTimeout(() => {
      new Notification("📅 ¡No olvides tu día de crianza!", { 
        body: `Hoy es el Día ${cursoEstado.diaActual} del curso. ¡Sigue tu racha de ${cursoEstado.racha} días!`,
        icon: "icons/icon-192.png"
      });
    }, 24 * 60 * 60 * 1000);
  }
}

function hablar(texto) {
  if (!vozActiva) return;
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}

// --- FUNCIÓN PARA FORMATEAR TEORÍAS AUTOMÁTICAMENTE ---
function formatearTeoria(texto) {
  if (!texto) return "";
  if (texto.includes("<p>") || texto.includes("<ul>") || texto.includes("<ol>")) {
    return texto;
  }
  
  let formateado = texto;
  
  // Reemplazar saltos de línea dobles por párrafos
  formateado = formateado.replace(/\n\n/g, '</p><p>');
  formateado = formateado.replace(/\n/g, '<br>');
  
  // Convertir listas numeradas (1️⃣, 2️⃣, etc.)
  if (formateado.match(/\d️⃣/g)) {
    let items = formateado.split(/(?=\d️⃣)/g);
    let listaItems = [];
    for (let item of items) {
      if (item.match(/\d️⃣/)) {
        listaItems.push(`<li>${item.trim()}</li>`);
      } else if (item.trim() && !item.includes("<li>")) {
        formateado = `<p>${item.trim()}</p>`;
      }
    }
    if (listaItems.length > 0) {
      formateado = `<ol>${listaItems.join('')}</ol>`;
    }
  }
  
  // Convertir viñetas con emojis
  if (formateado.match(/[✅🔴🟢🟡⚫📌💡⭐]/) && !formateado.includes("<li>")) {
    let lines = formateado.split('<br>');
    let listaItems = [];
    for (let line of lines) {
      if (line.match(/[✅🔴🟢🟡⚫📌💡⭐]/)) {
        listaItems.push(`<li>${line}</li>`);
      } else if (line.trim() && !line.includes("<li>") && !line.includes("<p>")) {
        formateado = `<p>${line}</p>`;
      }
    }
    if (listaItems.length > 0) {
      formateado = `<ul>${listaItems.join('')}</ul>`;
    }
  }
  
  // Añadir párrafos si no tiene
  if (!formateado.startsWith('<') && formateado.trim()) {
    formateado = `<p>${formateado}</p>`;
  }
  
  // Limpiar etiquetas duplicadas
  formateado = formateado.replace(/<\/p><p><\/p>/g, '</p>');
  formateado = formateado.replace(/<p><\/p>/g, '');
  
  return formateado;
}

// --- CONTENIDO DE LOS 28 DÍAS ---
const lecciones = {};

// DÍA 1 - TEORÍA FORMATEADA
lecciones[1] = {
  titulo: "🎯 Día 1: Conoce tu estilo de crianza",
  objetivo: "Identificar tu estilo actual para poder mejorarlo.",
  teoria: `
    <p>Los estilos de crianza se definen por DOS ejes: <strong>AFECTO</strong> (calidez, respuesta emocional) y <strong>CONTROL</strong> (exigencia, disciplina). Combinándolos obtenemos 4 estilos:</p>
    
    <ul>
      <li><strong>🔴 AUTORITARIO:</strong> Alto control, bajo afecto. Reglas rígidas, castigos, poca validación. El niño obedece por miedo.</li>
      <li><strong>🟢 DEMOCRÁTICO/ASERTIVO:</strong> Alto control + alto afecto. Límites claros pero flexibles, diálogo, consecuencias lógicas. <strong>Es el estilo recomendado.</strong></li>
      <li><strong>🟡 PERMISIVO:</strong> Bajo control, alto afecto. Pocos límites, evitan el conflicto. El niño no tolera la frustración.</li>
      <li><strong>⚫ NEGLIGENTE:</strong> Bajo control, bajo afecto. Desinterés, ausencia. El niño se siente abandonado.</li>
    </ul>
    
    <p>El estilo <strong>DEMOCRÁTICO</strong> es el que mejores resultados da: hijos seguros, autónomos, con alta autoestima y autocontrol. Hoy descubrirás cuál es tu estilo.</p>
  `,
  ejemplos: [
    "👎 AUTORITARIO: '¡Hazlo porque lo digo yo y punto! Si lloras, peor.'",
    "👍 DEMOCRÁTICO: 'Sé que estás enojado porque querías seguir jugando. Te doy 5 minutos más y luego apagas tú. ¿Trato?'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Responde el TEST DE ESTILO que está al final de esta lección. Anota tu resultado.",
    "🎲 ACTIVIDAD 2: Hoy, observa una interacción tuya con tu hijo y pregúntate: ¿qué estilo usé?",
    "🎲 ACTIVIDAD 3: Pide a alguien cercano que te describa cómo te ve en momentos de conflicto con tu hijo."
  ],
  tecnicas: ["Observación metacognitiva", "Pausa antes de reaccionar"],
  habilidades: ["Autoconciencia parental", "Regulación emocional del adulto"],
  errores: ["❌ Confundir firmeza con dureza (autoritario)", "❌ Confundir ternura con ausencia de límites (permisivo)"],
  frases: ["'Hoy voy a observar mi reacción antes de juzgarla.'", "'Mi estilo no es mi destino, puedo mejorar.'"],
  herramientas: ["Diario de crianza", "Test de estilo (abajo)"],
  tieneTest: true
};

// DÍA 2 - TEORÍA FORMATEADA
lecciones[2] = {
  titulo: "📜 Día 2: Los 10 mandamientos de la crianza positiva",
  objetivo: "Interiorizar los principios que guían una crianza respetuosa y efectiva.",
  teoria: `
    <p>Los <strong>10 mandamientos</strong> son el pilar ético de la crianza consciente:</p>
    
    <ol>
      <li><strong>🔗 CONECTA ANTES DE CORREGIR</strong> - El vínculo es la base. Un niño conectado escucha mejor.</li>
      <li><strong>👂 ESCUCHA SIN JUZGAR</strong> - Valida la emoción primero, luego aborda el comportamiento.</li>
      <li><strong>🧱 PON LÍMITES FIRMES PERO AMABLES</strong> - No necesitas gritar para ser firme.</li>
      <li><strong>💖 VALIDA TODAS LAS EMOCIONES</strong> - Ninguna emoción es mala, solo algunas acciones.</li>
      <li><strong>🤐 NO PEGUES, NO GRITES</strong> - La violencia genera más violencia y daña el vínculo.</li>
      <li><strong>👑 SÉ EL EJEMPLO QUE QUIERES VER</strong> - Los niños aprenden de lo que haces, no de lo que dices.</li>
      <li><strong>🐢 CADA NIÑO TIENE SU RITMO</strong> - No compares. Respeta los tiempos de desarrollo.</li>
      <li><strong>🎮 EL JUEGO ES EL MEJOR APRENDIZAJE</strong> - A través del juego se conecta y se enseña.</li>
      <li><strong>🌟 EL ERROR ES OPORTUNIDAD</strong> - No castigues, enseña. El error bien manejado construye resiliencia.</li>
      <li><strong>🧘 CUIDATE PARA PODER CUIDAR</strong> - El autocuidado no es egoísmo, es la base.</li>
    </ol>
    
    <p>📌 <em>Imprime estos mandamientos y ponlos en tu nevera como recordatorio diario.</em></p>
  `,
  ejemplos: [
    "📖 Ejemplo de conectar antes de corregir: Tu hijo tira un juguete. Te arrodillas y dices: 'Veo que estás frustrado. Los juguetes no se tiran. ¿Cómo podemos solucionarlo?'",
    "📖 Ejemplo de validar sin ceder: 'Entiendo que quieras el helado, pero ya comimos. Está bien estar triste. Mañana podemos planear uno.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Escribe los 3 mandamientos que más se te olvidan y pon el papel en la nevera.",
    "🎲 ACTIVIDAD 2: Hoy, antes de corregir, respira 3 veces y pregúntate: ¿estoy conectando?",
    "🎲 ACTIVIDAD 3: Comparte los mandamientos con tu pareja o co-cuidador y elijan 1 para practicar juntos esta semana."
  ],
  tecnicas: ["Pausa de 3 respiraciones", "Reencuadre del error como oportunidad"],
  habilidades: ["Empatía", "Consistencia", "Autorregulación"],
  errores: ["❌ Corregir en caliente sin haber conectado primero", "❌ Usar frases como 'siempre haces lo mismo'"],
  frases: ["'Primero conecto, luego corrijo.'", "'Tu emoción es válida, tu acción necesita cambio.'"],
  herramientas: ["Póster de los 10 mandamientos", "Temporizador de pausa"]
};

// DÍA 3 - TEORÍA FORMATEADA
lecciones[3] = {
  titulo: "🧩 Día 3: Los 4 pilares del hogar",
  objetivo: "Identificar qué pilar está más débil en tu familia para fortalecerlo.",
  teoria: `
    <p>Una crianza sólida descansa sobre <strong>4 pilares</strong>. Si uno falla, todo el sistema se resiente:</p>
    
    <ul>
      <li><strong>🧱 PILAR 1: VÍNCULO SEGURO</strong><br>El niño sabe que puede contar contigo. Se construye con presencia, contacto físico, respuesta consistente.</li>
      <li><strong>🗣️ PILAR 2: COMUNICACIÓN RESPETUOSA</strong><br>Escuchar activamente, hablar sin etiquetas, usar mensajes "yo siento" en lugar de "tú eres".</li>
      <li><strong>🔒 PILAR 3: LÍMITES CLAROS</strong><br>Normas predecibles, consecuencias lógicas, no negociables en temas de seguridad y salud.</li>
      <li><strong>🧘 PILAR 4: AUTOCUIDADO DEL ADULTO</strong><br>No puedes dar lo que no tienes. Un adulto agotado o irritable no puede regular a un niño.</li>
    </ul>
    
    <p>💡 <em>"No puedo llenar su vaso si el mío está vacío"</em></p>
  `,
  ejemplos: [
    "📖 Vínculo seguro: Al llegar del trabajo, 10 minutos de juego ininterrumpido antes de mirar el teléfono.",
    "📖 Comunicación respetuosa: En lugar de 'eres un desordenado', decir: 'veo tu ropa en el suelo, necesito que la guardes'."
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Dibuja una rueda con 4 sectores. Puntúa cada pilar del 1 al 10. El más bajo es tu foco.",
    "🎲 ACTIVIDAD 2: Hoy refuerza tu pilar más débil con una acción concreta.",
    "🎲 ACTIVIDAD 3: Pregunta a tu hijo: '¿qué crees que necesitamos mejorar en casa?'"
  ],
  tecnicas: ["Rueda de pilares", "Checklist semanal de pilares"],
  habilidades: ["Evaluación sistémica", "Priorización"],
  errores: ["❌ Descuidar el autocuidado por culpa", "❌ Centrarse solo en límites olvidando el vínculo"],
  frases: ["'No puedo llenar su vaso si el mío está vacío.'", "'Hoy fortaleceré mi pilar más débil.'"],
  herramientas: ["Rueda imprimible", "Diario de pilares"]
};

// DÍA 4 - TEORÍA FORMATEADA
lecciones[4] = {
  titulo: "💖 Día 4: Validación emocional",
  objetivo: "Aprender a responder a las emociones difíciles sin negarlas ni minimizarlas.",
  teoria: `
    <p><strong>Validar NO es dar la razón.</strong> Es reconocer la emoción del otro como legítima y digna de ser escuchada.</p>
    
    <p><strong>PASOS PARA VALIDAR:</strong></p>
    <ol>
      <li><strong>DETENTE</strong> - Deja lo que estás haciendo y escucha sin interrumpir.</li>
      <li><strong>NOMBRA LA EMOCIÓN</strong> - "Veo que estás enfadado/triste/frustrado"</li>
      <li><strong>ACEPTA SIN CONDICIONES</strong> - "Está bien sentir eso, todas las emociones son válidas"</li>
      <li><strong>NO INTENTES RESOLVER INMEDIATAMENTE</strong> - A veces solo necesitan compañía, no una solución.</li>
      <li><strong>OFRECE PRESENCIA</strong> - "Estoy aquí contigo, no estás solo/a"</li>
    </ol>
    
    <p>La validación <strong>reduce la intensidad emocional a la mitad</strong> y enseña inteligencia emocional.</p>
    
    <p>📌 <em>Validar no es: minimizar ("no es para tanto"), resolver rápido ("ya te compro algo"), comparar ("a otros les va peor").</em></p>
  `,
  ejemplos: [
    "📖 Niño de 4 años llora porque su castillo se cayó. Decir: 'Qué frustrante que se cayó. ¿Quieres que intentemos hacer otro?'",
    "📖 Adolescente: '¡Odio a mi profesor!' Decir: 'Parece que estás muy enfadado. Cuéntame qué pasó.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Hoy, ante cualquier emoción 'negativa', practica nombrarla.",
    "🎲 ACTIVIDAD 2: Escribe 3 frases de validación para usar esta semana.",
    "🎲 ACTIVIDAD 3: Pídele a tu hijo que nombre sus emociones 3 veces hoy."
  ],
  tecnicas: ["Nombrar la emoción", "Escucha reflectante", "Silencio activo"],
  habilidades: ["Empatía", "Regulación emocional", "Comunicación no violenta"],
  errores: ["❌ Minimizar: 'no es para tanto'", "❌ Resolver rápido: 'ya está, te compro algo'"],
  frases: ["'Veo que estás enojado. Está bien enojarse. Yo estoy aquí.'", "'No me gusta tu comportamiento, pero entiendo tu emoción.'"],
  herramientas: ["Póster de emociones", "Tarjetas de validación", "Bote de la calma"]
};

// DÍA 5
lecciones[5] = {
  titulo: "🔒 Día 5: Límites claros sin gritos",
  objetivo: "Poner límites firmes manteniendo la calma.",
  teoria: `
    <p>Un <strong>límite efectivo</strong> tiene 3 características:</p>
    <ul>
      <li><strong>BREVE:</strong> una frase corta, fácil de recordar.</li>
      <li><strong>CLARO:</strong> qué sí y qué no está permitido.</li>
      <li><strong>EJECUTABLE:</strong> depende de ti, no de la voluntad del niño.</li>
    </ul>
    <p>La fórmula: <strong>"Cuando [conducta], entonces [consecuencia lógica]"</strong></p>
    <p>No necesitas gritar. Un límite dicho en <strong>voz baja pero con convicción</strong> es más poderoso que un grito.</p>
    <p>💡 <em>Ejemplo: "Si sigues corriendo en el supermercado, te subiré al carrito. Tú decides."</em></p>
  `,
  ejemplos: [
    "📖 Ejemplo: Niño golpea la mesa. Te acercas, contacto visual, voz baja: 'Las mesas no se golpean. Si vuelves a golpear, te sentarás 2 minutos en la silla de calma.'",
    "📖 Ejemplo en supermercado: 'Si sigues corriendo, te subiré al carrito. Tú decides.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Identifica 1 límite que te cueste poner. Escríbelo y ensáyalo en voz baja.",
    "🎲 ACTIVIDAD 2: Hoy, cada vez que quieras gritar, respira, baja la voz y di el límite más despacio.",
    "🎲 ACTIVIDAD 3: Pide a tu hijo que repita el límite (para asegurar comprensión)."
  ],
  tecnicas: ["Voz baja y firme", "Consecuencia lógica", "Tiempo fuera positivo"],
  habilidades: ["Firmeza amable", "Consistencia", "Previsibilidad"],
  errores: ["❌ Gritar el límite (pierde efecto)", "❌ Poner límites que no estás dispuesto a cumplir"],
  frases: ["'Las reglas no cambian porque llores. Yo te acompaño.'", "'No voy a gritar. Tú decides.'"],
  herramientas: ["Rutina visual", "Temporizador", "Silla de calma"]
};

// DÍA 6
lecciones[6] = {
  titulo: "⚡ Día 6: Consecuencias lógicas",
  objetivo: "Usar consecuencias relacionadas con el acto, no arbitrarias.",
  teoria: `
    <p><strong>Diferencia clave entre castigo y consecuencia lógica:</strong></p>
    <ul>
      <li><strong>CASTIGO:</strong> arbitrario, humillante, no relacionado con el acto. Ej: "no ordenaste → sin tele 3 días"</li>
      <li><strong>CONSECUENCIA LÓGICA:</strong> relacionada, respetuosa, enseña. Ej: "ensuciaste → limpias"</li>
    </ul>
    <p>Una consecuencia lógica debe ser:</p>
    <ul>
      <li>Relacionada con la acción</li>
      <li>Razonable en duración/intensidad</li>
      <li>Aplicada con calma</li>
      <li>Explicada antes si es posible</li>
    </ul>
    <p>💡 <em>"No es un castigo, es lo que toca hacer cuando ocurre esto."</em></p>
  `,
  ejemplos: [
    "📖 Si tira la comida al suelo → recoge la comida (con ayuda si es pequeño).",
    "📖 Si no guarda los juguetes → pierde acceso a ellos por 1 hora."
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Hoy, en lugar de castigar, aplica 1 consecuencia lógica.",
    "🎲 ACTIVIDAD 2: Pregúntale a tu hijo: '¿Qué crees que debería pasar cuando alguien hace X?'",
    "🎲 ACTIVIDAD 3: Escribe 3 castigos que usas y transfórmalos en consecuencias lógicas."
  ],
  tecnicas: ["Consecuencia por elección", "Reparación del daño", "Pérdida de privilegio relacionada"],
  habilidades: ["Justicia restaurativa", "Creatividad pedagógica"],
  errores: ["❌ Consecuencias desproporcionadas", "❌ Confundir consecuencia con venganza"],
  frases: ["'No es un castigo, es lo que toca hacer.'"],
  herramientas: ["Tabla de consecuencias lógicas", "Rincón de reparación"]
};

// DÍA 7
lecciones[7] = {
  titulo: "🧘 Día 7: Autocuidado del adulto",
  objetivo: "Reconocer que cuidarte es parte esencial de la crianza.",
  teoria: `
    <p>El <strong>autocuidado NO es egoísmo</strong>. Es la base para poder regular emocionalmente a tu hijo.</p>
    <p>Un adulto agotado, irritable o deprimido no puede ofrecer una crianza consciente.</p>
    
    <p><strong>Áreas de autocuidado:</strong></p>
    <ul>
      <li><strong>Físico:</strong> dormir lo que puedas, comer algo nutritivo, moverte</li>
      <li><strong>Emocional:</strong> validarte a ti mismo, pedir ayuda, permitirte sentir</li>
      <li><strong>Social:</strong> tiempo con amigos, pareja, grupos de apoyo</li>
      <li><strong>Personal:</strong> hobbies, silencio, 15 minutos al día para ti</li>
    </ul>
    <p>💡 <em>"No puedo llenar su vaso si el mío está vacío. Cuidarme es la mejor herencia para mis hijos."</em></p>
  `,
  ejemplos: [
    "📖 Pedir 15 minutos a solas al llegar del trabajo antes de atender a los niños.",
    "📖 Ir a terapia o a un grupo de apoyo parental (no es de débiles)."
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Haz algo solo para ti durante 15 minutos (sin pantallas, sin hijos).",
    "🎲 ACTIVIDAD 2: Escribe una lista de 5 pequeñas cosas que te recargan.",
    "🎲 ACTIVIDAD 3: Pide ayuda a alguien hoy (pareja, familiar, amigo)."
  ],
  tecnicas: ["Microdescansos", "Respiración consciente", "Delegar sin culpa"],
  habilidades: ["Autocompasión", "Establecer límites personales"],
  errores: ["❌ Esperar a estar agotado para cuidarte", "❌ Sentir culpa por tomarte un tiempo"],
  frases: ["'No puedo llenar su vaso si el mío está vacío.'", "'Cuidarme es la mejor herencia.'"],
  herramientas: ["Alarma de autocuidado", "Lista de placeres simples"]
};

// DÍA 8
lecciones[8] = {
  titulo: "🌟 Día 8: Autoestima en acción",
  objetivo: "Fortalecer la autoestima de tu hijo con acciones concretas.",
  teoria: `
    <p>La <strong>autoestima</strong> no se da con halagos vacíos ("eres el mejor", "qué bonito eres"). Se construye con:</p>
    <ul>
      <li><strong>Mensajes incondicionales:</strong> "Te quiero aunque te equivoques"</li>
      <li><strong>Valorar el esfuerzo:</strong> "Me encanta cómo lo intentaste" (no solo el resultado)</li>
      <li><strong>Responsabilidades reales:</strong> dar tareas que aporten a la familia</li>
      <li><strong>Evitar comparaciones:</strong> con hermanos, primos o compañeros</li>
    </ul>
    <p>💡 <em>"Te quiero porque eres tú, no por lo que haces o dejas de hacer."</em></p>
  `,
  ejemplos: [
    "📖 Elogiar el esfuerzo: 'pasaste mucho tiempo ordenando, qué dedicación' vs 'qué bien ordenaste'",
    "📖 Fallo manejado: 'fallaste, ¿qué aprendiste?'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Dale una responsabilidad real (poner la mesa, regar una planta)",
    "🎲 ACTIVIDAD 2: Di 'te quiero' sin condición alguna hoy",
    "🎲 ACTIVIDAD 3: Haz un 'álbum de logros' con dibujos/fotos"
  ],
  tecnicas: ["Elogio descriptivo", "Delegar tareas"],
  habilidades: ["Autoestima contingente", "Evitar comparaciones"],
  errores: ["❌ Halagos vacíos", "❌ Comparar con hermanos"],
  frases: ["'Te quiero porque eres tú, no por lo que haces.'"],
  herramientas: ["Diario de logros", "Frases para el espejo"]
};

// DÍA 9
lecciones[9] = {
  titulo: "⏳ Día 9: Enseñar autocontrol",
  objetivo: "Entrenar la pausa entre emoción y acción.",
  teoria: `
    <p>El <strong>autocontrol</strong> se entrena, no se nace con él. Se modela y se practica.</p>
    
    <p><strong>Técnica del SEMÁFORO DE EMOCIONES:</strong></p>
    <ul>
      <li><strong>🔴 ROJO:</strong> PARA - Respira, detente, no actúes impulsivamente</li>
      <li><strong>🟡 AMARILLO:</strong> PIENSA - Nombra la emoción, piensa en opciones</li>
      <li><strong>🟢 VERDE:</strong> ACTÚA - Elige la mejor opción</li>
    </ul>
    <p><strong>Juegos que entrenan autocontrol:</strong> estatua musical, simón dice, esperar turnos, el juego del silencio.</p>
    <p>💡 <em>"Puedes estar enojado, pero no pegas. Respira conmigo."</em></p>
  `,
  ejemplos: [
    "📖 Jugar a 'estatuas musicales' - detenerse al azar.",
    "📖 Semáforo: cuando se enoja, rojo 3 respiraciones."
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Juego de espera: 'contamos hasta 10 antes de abrir el regalo'",
    "🎲 ACTIVIDAD 2: Dibujar semáforo en un papel",
    "🎲 ACTIVIDAD 3: Modelar: 'voy a respirar porque estoy enojado'"
  ],
  tecnicas: ["Semáforo emocional", "Respiración globo"],
  habilidades: ["Autorregulación", "Tolerancia a la frustración"],
  errores: ["❌ Castigar por falta de autocontrol", "❌ No practicar en calma"],
  frases: ["'Puedes estar enojado, pero no pegas. Respira conmigo.'"],
  herramientas: ["Tarjeta semáforo", "Temporizador visual"]
};

// DÍA 10
lecciones[10] = {
  titulo: "🚀 Día 10: Desarrollar liderazgo",
  objetivo: "Dar oportunidades para que tu hijo lidere.",
  teoria: `
    <p>El <strong>liderazgo</strong> no es mandar. Es iniciativa + responsabilidad + empatía.</p>
    
    <p><strong>Cómo desarrollar liderazgo en casa:</strong></p>
    <ul>
      <li><strong>Dejar elegir:</strong> "¿qué cenamos, pasta o arroz?" (opciones reales)</li>
      <li><strong>Turnar roles:</strong> "hoy tú eres el líder del juego, explicas las reglas"</li>
      <li><strong>Pedir su opinión:</strong> "¿cómo solucionarías este problema familiar?"</li>
      <li><strong>Dar tareas con mando:</strong> "eres el encargado de repartir los turnos"</li>
    </ul>
    <p>💡 <em>"Confío en ti. Tú puedes liderar esta actividad."</em></p>
  `,
  ejemplos: [
    "📖 Niño decide qué cenar (entre 2 opciones sanas)",
    "📖 Niño lidera un juego explicando reglas"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Hoy que sea 'jefe de una tarea' (ej. repartir turnos)",
    "🎲 ACTIVIDAD 2: Pregúntale '¿cómo solucionarías este problema?'",
    "🎲 ACTIVIDAD 3: Juego de roles: 'eres el capitán del barco'"
  ],
  tecnicas: ["Delegación de mando", "Asamblea familiar"],
  habilidades: ["Toma de decisiones", "Empatía"],
  errores: ["❌ Dar solo órdenes sin opciones", "❌ No escuchar su propuesta"],
  frases: ["'Hoy tú decides. Yo confío en ti.'"],
  herramientas: ["Corona de líder", "Planificador semanal de tareas"]
};

// =====================================================
// DÍAS 11 AL 20 - CRIANZA EN DIFERENTES CONTEXTOS
// =====================================================

// DÍA 11 - Crianza y pantallas
lecciones[11] = {
  titulo: "📱 Día 11: Crianza y pantallas - acuerdos digitales sin lucha",
  objetivo: "Establecer límites saludables con la tecnología sin generar conflictos diarios.",
  teoria: `
    <p>Las <strong>pantallas</strong> son parte de la vida moderna, pero su uso sin límites afecta el sueño, la atención y la regulación emocional.</p>
    
    <p><strong>📌 RECOMENDACIONES POR EDAD (AAP):</strong></p>
    <ul>
      <li><strong>0-2 años:</strong> Cero pantallas (excepto videollamadas familiares)</li>
      <li><strong>2-5 años:</strong> Máximo 1 hora al día, siempre acompañado de un adulto</li>
      <li><strong>6-12 años:</strong> Límites consistentes, priorizar actividades al aire libre y juego físico</li>
      <li><strong>Adolescentes:</strong> Negociar horarios, zonas libres de pantallas (dormitorio, cena)</li>
    </ul>
    
    <p><strong>🔑 CLAVES PARA ACUERDOS SIN LUCHA:</strong></p>
    <ul>
      <li><strong>Zonas libres:</strong> Sin pantallas en la mesa, en el dormitorio, 1 hora antes de dormir</li>
      <li><strong>Temporizador visible:</strong> Usa un reloj o timer para que el niño vea cuánto tiempo queda</li>
      <li><strong>Modelo parental:</strong> Si tú estás siempre con el teléfono, él también querrá</li>
      <li><strong>Alternativas atractivas:</strong> Prepara actividades divertidas para el tiempo sin pantallas</li>
      <li><strong>Acordar antes:</strong> "Vamos a ver 20 minutos. Cuando suene el timer, apagas tú."</li>
    </ul>
    
    <p><strong>🚨 SEÑALES DE ALARMA:</strong></p>
    <ul>
      <li>Rabieta extrema al apagar la pantalla</li>
      <li>Pérdida de interés en otras actividades</li>
      <li>Problemas de sueño o irritabilidad constante</li>
      <li>Conflictos diarios por el uso</li>
    </ul>
    
    <p>💡 <em>"La mejor regla: nada de pantallas 1 hora antes de dormir. El cerebro necesita desconectar."</em></p>
  `,
  ejemplos: [
    "📖 Antes de encender la tele: 'Hoy puedes ver 20 minutos. Te pongo el timer. Cuando suene, apagas tú y luego jugamos a lo que tú elijas. ¿Trato?'",
    "📖 Niño de 5 años no quiere apagar la tablet: Respiras, te agachas y dices: 'El tiempo se acabó. Sé que te gusta mucho. Apagamos juntos. Mañana habrá otro momento. ¿Quieres guardarla tú o la guardo yo?'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Crea un 'acuerdo de pantallas' escrito con tu hijo (y dibujos si es pequeño). Pónganlo en la nevera.",
    "🎲 ACTIVIDAD 2: Durante una semana, tú también respeta las zonas sin pantallas (nada de teléfono en la mesa o en la habitación del niño).",
    "🎲 ACTIVIDAD 3: Prepara una 'cesta de alternativas' con juegos, cuentos, plastilina, puzzles para ofrecer cuando se acabe el tiempo de pantalla."
  ],
  tecnicas: ["Temporizador visual", "Acuerdo por escrito", "Zonas libres de pantallas", "Modelado parental"],
  habilidades: ["Consistencia", "Creatividad para alternativas", "Autorregulación del adulto"],
  errores: [
    "❌ Usar la pantalla como premio o castigo ('si te portas bien, te dejo ver tele')",
    "❌ Gritar cuando no quiere apagar",
    "❌ Decir 'apaga ya' sin aviso previo",
    "❌ Tener la tele encendida de fondo todo el día"
  ],
  frases: [
    "'Las pantallas se apagan con cariño, no con gritos. ¿Apagamos juntos?'",
    "'Tú decides cómo usas tu tiempo de pantalla: ¿juego o dibujo? Después de la pantalla, hacemos algo divertido.'"
  ],
  herramientas: ["Temporizador", "Acuerdo de pantallas impreso", "Cesta de alternativas", "App de control parental (Family Link)"]
};

// DÍA 12 - Rivalidad entre hermanos
lecciones[12] = {
  titulo: "👥 Día 12: Rivalidad entre hermanos - mediar sin tomar partido",
  objetivo: "Ayudar a los hermanos a resolver sus conflictos de manera pacífica y autónoma.",
  teoria: `
    <p>La <strong>rivalidad entre hermanos</strong> es normal y esperable. Competencia por la atención, los recursos, la territorialidad. No hay que eliminarla, sino <strong>gestionarla</strong>.</p>
    
    <p><strong>🔑 PRINCIPIOS PARA MEDIAR:</strong></p>
    <ul>
      <li><strong>No hay un culpable</strong> - Escucha a cada uno sin juzgar de entrada</li>
      <li><strong>No compares</strong> - "Por qué no eres como tu hermano" es veneno</li>
      <li><strong>Tiempo individual con cada hijo</strong> - La mayoría de peleas buscan atención</li>
      <li><strong>Enseña a resolver</strong> - No des la solución, ayúdalos a encontrarla</li>
      <li><strong>Interviene solo si hay peligro físico</strong> - Si no, dales espacio para negociar</li>
    </ul>
    
    <p><strong>📝 PASOS PARA MEDIAR (método de los 4 pasos):</strong></p>
    <ol>
      <li><strong>Calma la situación</strong> - Respira, separa suavemente si es necesario</li>
      <li><strong>Escucha a cada uno SIN INTERRUMPIR</strong> - "Tú cuentas, luego tú"</li>
      <li><strong>Refleja lo que escuchaste</strong> - "Entonces, tú te sentiste frustrado porque tu hermano te quitó el juguete sin pedir"</li>
      <li><strong>Pregunta: "¿Cómo pueden solucionarlo?"</strong> - No des la respuesta, ellos pueden</li>
    </ol>
    
    <p><strong>⚠️ ERROR GRAVE:</strong> No hagas de juez. El que "gana" y el que "pierde" se resentirán. Todos ganan cuando encuentran juntos la solución.</p>
    
    <p>💡 <em>"No hay un culpable, hay una oportunidad de aprender a resolver conflictos."</em></p>
  `,
  ejemplos: [
    "📖 Dos hermanos pelean por un juguete. En lugar de 'suelta eso ahora', dices: 'Veo que los dos quieren la misma pelota. ¿Qué podemos hacer? ¿Jugar juntos? ¿Turnos de 5 minutos? ¿Buscar otra pelota? Ustedes deciden.'",
    "📖 Un hijo le pega al otro. Separar, respirar y decir: 'No se pega en esta casa. Estoy aquí para ayudarles a resolver. Dime, ¿qué pasó? Tú cuentas primero, luego tú.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Crea el 'rincón de la paz' con cojines, papel y colores. Cuando haya conflicto, pueden ir allí a dibujar su versión.",
    "🎲 ACTIVIDAD 2: Dedica 15 minutos diarios a cada hijo por separado (sin el otro). Verás cómo disminuyen las peleas.",
    "🎲 ACTIVIDAD 3: Ensaya con ellos la frase: 'Cuando tú haces X, yo me siento Y. ¿Podemos hablar?' Enséñales a expresar sin pegar."
  ],
  tecnicas: ["Escucha activa sin interrumpir", "Reflejo de emociones", "Pregunta para resolver", "Tiempo individual con cada hijo"],
  habilidades: ["Mediación", "Empatía", "Paciencia", "No comparación"],
  errores: [
    "❌ Decir 'tú empieza siempre' o 'tú eres el más conflictivo' (etiquetas)",
    "❌ Castigar a ambos sin escuchar",
    "❌ Intervenir siempre (no aprenden a resolver solos)",
    "❌ Comparar: 'mira cómo se porta tu hermana, tú no'"
  ],
  frases: [
    "'Aquí no hay un bueno y un malo. Hay una situación que podemos resolver juntos.'",
    "'¿Cómo crees que se sintió tu hermano cuando hiciste eso?'",
    "'Ustedes pueden encontrar una solución. Yo confío en ustedes.'"
  ],
  herramientas: ["Rincón de la paz", "Temporizador para turnos", "Cuentos sobre hermanos", "Calendario de tiempo individual"]
};

// DÍA 13 - Sueño respetuoso
lecciones[13] = {
  titulo: "😴 Día 13: Sueño respetuoso - rutinas sin castigo",
  objetivo: "Establecer hábitos de sueño saludables basados en la conexión, no en la imposición.",
  teoria: `
    <p>El <strong>sueño</strong> es una necesidad fisiológica, no un comportamiento a castigar o premiar. Las dificultades para dormir tienen causas (hambre, miedo, falta de rutina, estimulación excesiva).</p>
    
    <p><strong>🌙 RUTINA IDEAL PARA DORMIR (30-45 minutos):</strong></p>
    <ol>
      <li><strong>Desconexión digital</strong> - Nada de pantallas 1 hora antes</li>
      <li><strong>Baño o lavado de dientes</strong> - Transición suave</li>
      <li><strong>Masaje o pijama</strong> - Contacto físico relajante</li>
      <li><strong>Cuento o canción</strong> - Voz suave, ambiente tranquilo</li>
      <li><strong>Abrazo y 'buenas noches'</strong> - Cierre predecible</li>
    </ol>
    
    <p><strong>🔑 CLAVES PARA SUEÑO RESPETUOSO:</strong></p>
    <ul>
      <li><strong>Consistencia</strong> - Mismo horario y rutina todos los días (incluyendo fines de semana)</li>
      <li><strong>Ambiente</strong> - Habitación oscura, fresca, sin ruidos</li>
      <li><strong>No castigar con 'te quedas sin cuento'</strong> - El cuento es conexión, no premio</li>
      <li><strong>Si se despierta de noche</strong> - Acompaña, no ignores. El miedo es real para ellos</li>
      <li><strong>Modelo</strong> - Si tú trasnochas, él también querrá</li>
    </ul>
    
    <p><strong>🚫 QUÉ NO HACER:</strong> Método 'déjalo llorar' (CIO - Cry It Out) daña la confianza y el vínculo. Los niños no lloran para manipular, lloran porque necesitan.</p>
    
    <p>💡 <em>"El sueño no se negocia, se acompaña. La cama no es un castigo, es un lugar seguro."</em></p>
  `,
  ejemplos: [
    "📖 Niño de 3 años se despierta llorando a medianoche. En lugar de 'duérmete solo', dices: 'Estoy aquí. Tuviste una pesadilla. Te abrazo, respiramos juntos y te quedas conmigo hasta que te sientas tranquilo.'",
    "📖 Niño no quiere dormir, pide 'otro cuento'. Dices: 'Ya leímos el cuento. Es hora de dormir. Mañana te leo dos si quieres. Te pongo tu música suave y me quedo un momentito. Cierro los ojos contigo.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Crea una 'tabla visual de la rutina de noche' con dibujos: baño, pijama, cuento, abrazo, dormir. Que tu hijo la siga cada noche.",
    "🎲 ACTIVIDAD 2: Durante una semana, apaga todas las pantallas 1 hora antes de dormir (incluyendo las tuyas). Observa cambios.",
    "🎲 ACTIVIDAD 3: Prepara un 'ritual de calma': una cajita con un peluche para abrazar, una piedra lisa para apretar, un bote de calma (agua + purpurina)."
  ],
  tecnicas: ["Rutina visual", "Ritual de calma", "Acompañamiento en despertares", "Ambiente preparado"],
  habilidades: ["Consistencia", "Empatía nocturna", "Autorregulación del adulto cansado"],
  errores: [
    "❌ Dejar llorar al niño ('que aprenda a dormir solo')",
    "❌ Castigar con 'te acuesto sin cuento'",
    "❌ Usar pantallas como 'relajación' antes de dormir",
    "❌ Horarios diferentes cada día"
  ],
  frases: [
    "'Te acompaño hasta que te duermas. No estás solo/a.'",
    "'Cerramos los ojos, respiramos hondo y soñamos cosas bonitas.'",
    "'La oscuridad no da miedo cuando estoy contigo.'"
  ],
  herramientas: ["Tabla visual de rutina", "Bote de calma", "Música relajante o ruido blanco", "Luz nocturna suave"]
};

// DÍA 14 - Alimentación sin lucha
lecciones[14] = {
  titulo: "🍽️ Día 14: Alimentación sin lucha - tú ofreces, ellos eligen",
  objetivo: "Acabar con la guerra de la comida y fomentar una relación saludable con la alimentación.",
  teoria: `
    <p>Las <strong>luchas por la comida</strong> son una de las fuentes de estrés más comunes en la crianza. La buena noticia: pueden evitarse con un cambio de enfoque.</p>
    
    <p><strong>🥕 PRINCIPIO CLAVE (Ellyn Satter - 'Division of Responsibility'):</strong></p>
    <ul>
      <li><strong>Los padres deciden:</strong> QUÉ, CUÁNDO y DÓNDE se come</li>
      <li><strong>Los niños deciden:</strong> SI comen y CUÁNTO comen</li>
    </ul>
    
    <p><strong>🔑 CÓMO APLICARLO:</strong></p>
    <ul>
      <li><strong>No obligar a terminar el plato</strong> - Ellos regulan su hambre mejor que tú</li>
      <li><strong>No usar la comida como premio o castigo</strong> - "Si comes, te doy helado" crea mala relación</li>
      <li><strong>Ofrece variedad sin presión</strong> - Un alimento nuevo junto a otros que ya conoce</li>
      <li><strong>Come en familia</strong> - El ejemplo es lo que más enseña</li>
      <li><strong>Sin distracciones</strong> - Nada de tele, tablet o juguetes en la mesa</li>
      <li><strong>Paciencia</strong> - Un niño puede necesitar ver un alimento 15 veces antes de probarlo</li>
    </ul>
    
    <p><strong>🚫 NUNCA HACER:</strong> Forzar a probar, castigar por no comer, decir 'está rico, pruébalo' (no confían), hacer platos separados solo para él.</p>
    
    <p>💡 <em>"Tu trabajo es ofrecer comida sana y variada. Su trabajo es decidir cuánto comer. Confía en su cuerpo."</em></p>
  `,
  ejemplos: [
    "📖 Niño de 4 años dice 'no me gusta el brócoli'. En lugar de 'pruébalo, está rico', dices: 'No te gusta hoy. Está bien. Aquí tienes también zanahoria y arroz. Comes lo que quieras.'",
    "📖 Niño no come nada en la cena. En lugar de castigar o insistir, dices: 'Ya guardamos la comida. Si tienes hambre antes de dormir, puedes elegir fruta o pan. Mañana desayunamos.' (Sin ofrecer alternativas ultraprocesadas)"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Durante una semana, aplica la 'división de responsabilidades'. Observa si reduces tu ansiedad y si él come más variado sin presión.",
    "🎲 ACTIVIDAD 2: Cocina con tu hijo. Que toque los alimentos, los lave, los mezcle. El contacto previo aumenta la probabilidad de que los pruebe.",
    "🎲 ACTIVIDAD 3: Crea un 'plato arcoíris' - cada día un color diferente de verduras/frutas. Que él elija el color."
  ],
  tecnicas: ["División de responsabilidades", "Exposición repetida sin presión", "Cocinar juntos", "Plato arcoíris"],
  habilidades: ["Paciencia", "Confianza en la regulación del niño", "Creatividad culinaria"],
  errores: [
    "❌ Decir 'come tres cucharadas más o no hay postre'",
    "❌ Hacer platos especiales para cada niño",
    "❌ Distraer con pantallas para que coma sin darse cuenta",
    "❌ Comparar 'mira cómo come tu primo'"
  ],
  frases: [
    "'No te gusta hoy. Mañana tal vez. Aquí tienes lo que hay.'",
    "'Tu cuerpo sabe cuánto necesita. Confío en ti.'",
    "'No hace falta que termines. Cuando estés lleno, dímelo.'"
  ],
  herramientas: ["Plato arcoíris", "Tabla de exposición a nuevos alimentos", "Recetas para cocinar juntos", "Calendario de 'probé algo nuevo'"]
};

// DÍA 15 - Manejo de rabietas (avanzado)
lecciones[15] = {
  titulo: "😤 Día 15: Manejo de rabietas - técnica avanzada",
  objetivo: "Responder a las rabietas sin escalar el conflicto y enseñando regulación emocional.",
  teoria: `
    <p>Las <strong>rabietas</strong> son normales en niños de 1 a 6 años. Su cerebro aún no tiene desarrollada la corteza prefrontal (control de impulsos). No son manipulaciones, son crisis emocionales.</p>
    
    <p><strong>🔴 QUÉ NO HACER (lo que empeora):</strong></p>
    <ul>
      <li>No gritar ni castigar (activa su amígdala, empeora la regulación)</li>
      <li>No ceder al chantaje (enseña que la rabieta funciona)</li>
      <li>No dejar al niño solo (necesita tu presencia para co-regularse)</li>
      <li>No razonar en el momento álgido (no te escucha, su cerebro está secuestrado)</li>
    </ul>
    
    <p><strong>🟢 LOS 9 PASOS PARA MANEJAR UNA RABIETA:</strong></p>
    <ol>
      <li><strong>RESPIRA</strong> - Regúlate primero tú. Si tú explotas, él no puede calmarse</li>
      <li><strong>ARRODÍLLATE</strong> - Ponte a su altura visual (reduce la sensación de amenaza)</li>
      <li><strong>NOMBRA LA EMOCIÓN</strong> - "Veo que estás muy enojado/frustrado/triste"</li>
      <li><strong>VALIDA SIN CEDER</strong> - "Está bien estar enojado. Entiendo que quieras el helado, pero hoy no."</li>
      <li><strong>OFRECE CALMA FÍSICA</strong> - Un abrazo si lo acepta. Si no, solo presencia</li>
      <li><strong>ESPERA EL PICO</strong> - No hables. Acompaña en silencio. El pico dura 1-2 minutos</li>
      <li><strong>LÍMITE BREVE</strong> - "Cuando te calmes, hablamos. Estoy aquí."</li>
      <li><strong>REDIRIGE</strong> - Después del pico, ofrece una alternativa atractiva</li>
      <li><strong>RECONECTA</strong> - Abrazo, conversación breve sobre lo que pasó, y a seguir</li>
    </ol>
    
    <p><strong>📌 DESPUÉS DE LA RABIETA (cuando está calmado):</strong> Valida su esfuerzo: "Lograste calmarte. Eso fue difícil. Estoy orgullosa/o de ti."</p>
    
    <p>💡 <em>"La rabieta no es una emergencia. Es una oportunidad para enseñar regulación emocional."</em></p>
  `,
  ejemplos: [
    "📖 Rabieta en supermercado: Niño de 4 años grita y se tira al suelo. Mamá respira, se agacha y dice: 'Veo que estás muy enojado porque no te compré el chocolate. Está bien enojarse. Te voy a cargar y vamos afuera un momento.' (Sale del lugar, espera, luego redirige: 'Ya pasó. ¿Quieres ayudar a poner las frutas en la bolsa?')",
    "📖 Rabieta por apagar la tele: 'Sé que te gusta mucho ver dibujos. Está bien sentirse triste cuando se acaba. Apagamos juntos. Cuando estés listo, podemos pintar o jugar con los bloques. Tú eliges.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Practica los 9 pasos con un peluche o en tu mente antes de que ocurra la próxima rabieta. Ensaya la voz baja y las frases.",
    "🎲 ACTIVIDAD 2: Crea un 'rincón de calma' en casa: cojines, un peluche, un papel con emociones, un bote de calma.",
    "🎲 ACTIVIDAD 3: Lleva un registro: ¿Qué desencadenó la rabieta? ¿Qué funcionó? ¿Qué no? Encuentra patrones."
  ],
  tecnicas: ["9 pasos para rabietas", "Rincón de calma", "Nombrar la emoción", "Redirección post-crisis"],
  habilidades: ["Regulación emocional del adulto", "Paciencia activa", "Contención emocional", "Observación de desencadenantes"],
  errores: [
    "❌ Gritar '¡cállate!' o '¡deja de llorar!'",
    "❌ Ceder para que pare rápido (aprenderá que la rabieta funciona)",
    "❌ Dejar al niño solo en su habitación ('que se calme solo')",
    "❌ Razonar mientras grita ('no te escucha')"
  ],
  frases: [
    "'Veo que estás enojado. Está bien. Estoy aquí contigo hasta que pase.'",
    "'No estás solo en esto. Respiramos juntos.'",
    "'Cuando el enojo se vaya, te voy a abrazar fuerte.'"
  ],
  herramientas: ["Rincón de calma", "Bote de calma", "Temporizador visual", "Póster del semáforo de emociones"]
};

// DÍA 16 - Comunicación no violenta
lecciones[16] = {
  titulo: "🗣️ Día 16: Comunicación no violenta con niños",
  objetivo: "Hablar sin etiquetas, juicios ni críticas que dañen la autoestima.",
  teoria: `
    <p>La <strong>comunicación no violenta (CNV)</strong> de Marshall Rosenberg nos ayuda a expresar lo que sentimos y necesitamos sin atacar al otro.</p>
    
    <p><strong>📝 LA FÓRMULA CNV (4 pasos):</strong></p>
    <ul>
      <li><strong>OBSERVACIÓN:</strong> Describo lo que veo sin juzgar (NO "eres un desordenado", SÍ "veo tu ropa en el suelo")</li>
      <li><strong>SENTIMIENTO:</strong> Expreso cómo me siente (NO "me molestas", SÍ "me siento frustrada")</li>
      <li><strong>NECESIDAD:</strong> Identifico lo que necesito (NO "necesito que obedezcas", SÍ "necesito orden en casa")</li>
      <li><strong>PETICIÓN:</strong> Pido algo concreto y positivo (NO "no dejes tirada la ropa", SÍ "¿puedes guardar tu ropa en el cesto antes de la cena?")</li>
    </ul>
    
    <p><strong>🔑 FRASES QUE DAÑAN (evítalas):</strong></p>
    <ul>
      <li>"Eres un niño malo" (etiqueta) → Mejor: "Esa acción no estuvo bien"</li>
      <li>"Siempre haces lo mismo" (absoluto) → Mejor: "Hoy decidiste no hacer la tarea"</li>
      <li>"Mira a tu primo, él sí se porta bien" (comparación) → Mejor: "Cada uno tiene su ritmo"</li>
      <li>"Me tienes harta/o" (ataque) → Mejor: "Me siento agotada cuando tengo que repetir lo mismo"</li>
    </ul>
    
    <p><strong>🌟 CNV ADAPTADA PARA NIÑOS PEQUEÑOS:</strong> Usa frases cortas, nombra la emoción, ofrece opciones.</p>
    
    <p>💡 <em>"Separa la acción de la persona: 'no me gusta que grites' no 'eres gritón'. Así proteges su autoestima mientras pones límites."</em></p>
  `,
  ejemplos: [
    "📖 En lugar de 'eres un mentiroso', decir: 'Me dijiste que habías hecho la tarea y veo que no. Me siento preocupada porque confío en ti. ¿Qué pasó? ¿Necesitas ayuda?'",
    "📖 En lugar de 'no grites', decir: 'Veo que estás alzando la voz. Me cuesta escucharte así. Cuando hables más bajito, te escucho con atención.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Durante un día, anota cada vez que uses un 'tú eres...' (juicio). Al final, reescribe la frase en CNV.",
    "🎲 ACTIVIDAD 2: Practica la fórmula CNV con tu pareja o un amigo antes de usarla con tu hijo.",
    "🎲 ACTIVIDAD 3: Crea un 'póster de frases CNV' y ponlo en la nevera: 'Observo... Siento... Necesito... ¿Podrías...?'"
  ],
  tecnicas: ["Fórmula CNV", "Observación vs juicio", "Peticiones positivas", "Eliminar absolutos"],
  habilidades: ["Comunicación asertiva", "Empatía", "Autoconciencia emocional"],
  errores: [
    "❌ Usar 'tú eres...' (etiquetas estigmatizantes)",
    "❌ Decir 'siempre' o 'nunca'",
    "❌ Comparar con otros niños",
    "❌ Hablar desde el enojo sin respirar"
  ],
  frases: [
    "'Cuando veo [acción], me siento [emoción] porque necesito [necesidad]. ¿Podrías [petición concreta]?'",
    "'No me gusta tu comportamiento, pero te quiero a ti.'",
    "'Hablemos cuando ambos estemos tranquilos.'"
  ],
  herramientas: ["Póster CNV", "Tarjetas de emociones", "Diario de comunicación", "Frases para el espejo"]
};

// DÍA 17 - Disciplina positiva
lecciones[17] = {
  titulo: "🎮 Día 17: Disciplina positiva - enseñar sin castigar",
  objetivo: "Aplicar los 7 principios de Jane Nelsen para disciplinar desde el respeto.",
  teoria: `
    <p>La <strong>disciplina positiva</strong> de Jane Nelsen NO es permisividad. Es firmeza con amabilidad. Enseña, no humilla.</p>
    
    <p><strong>🌟 LOS 7 PRINCIPIOS DE LA DISCIPLINA POSITIVA:</strong></p>
    <ol>
      <li><strong>Firme y amable a la vez</strong> - Respetuoso con el niño y con la situación</li>
      <li><strong>Ayuda al niño a sentir pertenencia e importancia</strong> - Todos necesitan sentirse valorados</li>
      <li><strong>Efectiva a largo plazo</strong> - Considera lo que el niño piensa, siente, aprende y decide</li>
      <li><strong>Enseña valiosas habilidades sociales y de vida</strong> - Respeto, solución de problemas, cooperación</li>
      <li><strong>Invita a los niños a descubrir sus capacidades</strong> - Fomenta la autonomía</li>
      <li><strong>Se enfoca en soluciones</strong> - No culpas, no castigos, soluciones juntos</li>
      <li><strong>Usa reuniones familiares</strong> - Para resolver problemas democráticamente</li>
    </ol>
    
    <p><strong>🆚 DIFERENCIA CLAVE:</strong></p>
    <ul>
      <li><strong>Castigo:</strong> "Te quedas sin postre por pegaste a tu hermana" (sin relación, humillante)</li>
      <li><strong>Disciplina positiva:</strong> "Pegar duele y no resuelve. ¿Qué puedes hacer la próxima vez que te enojes? ¿Cómo puedes reparar con tu hermana?" (enseña, conecta)</li>
    </ul>
    
    <p><strong>🏠 REUNIONES FAMILIARES (niños +4 años):</strong> Semanalmente, sentarse a hablar: 1) Algo que salió bien esta semana. 2) Un problema a resolver. 3) Una solución entre todos.</p>
    
    <p>💡 <em>"La disciplina enseña, el castigo humilla. ¿Qué quieres que aprenda tu hijo?"</em></p>
  `,
  ejemplos: [
    "📖 Niño de 6 años no recoge los juguetes. En lugar de castigar, decir: 'Veo los juguetes en el suelo. En esta casa recogemos antes de cenar. ¿Cómo podemos recordarlo? ¿Una alarma? ¿Un dibujo? Tú eliges la solución.'",
    "📖 Niño le pega a un amigo. En lugar de 'vete a tu cuarto', decir: 'Pegar no está bien. Vamos a preguntarle a tu amigo cómo se siente. ¿Qué puedes hacer para que se sienta mejor? ¿Pedir disculpas? ¿Dibujarle algo?'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Esta semana, convoca una 'reunión familiar' (aunque sea de 10 minutos). Que cada uno diga algo positivo y un problema a resolver juntos.",
    "🎲 ACTIVIDAD 2: Reemplaza un castigo habitual por un enfoque de disciplina positiva. Escribe la diferencia.",
    "🎲 ACTIVIDAD 3: Crea una 'rueda de soluciones' con tu hijo: dibujen opciones para cuando hay conflicto (respirar, pedir ayuda, turnarse, etc.)"
  ],
  tecnicas: ["Reuniones familiares", "Rueda de soluciones", "Enfoque en reparación, no castigo", "Firmeza amable"],
  habilidades: ["Liderazgo democrático", "Solución de problemas", "Empatía", "Paciencia"],
  errores: [
    "❌ Confundir disciplina positiva con ser permisivo ('no le pongo límites')",
    "❌ Usar castigos disfrazados de consecuencias",
    "❌ No ser consistente",
    "❌ Hablar desde la ira"
  ],
  frases: [
    "'Los errores son oportunidades para aprender. ¿Qué aprendiste?'",
    "'¿Cómo podemos solucionar esto juntos?'",
    "'En esta familia, todos nos equivocamos y todos aprendemos.'"
  ],
  herramientas: ["Rueda de soluciones", "Agenda de reuniones familiares", "Póster de disciplina positiva", "Frases reparadoras"]
};

// DÍA 18 - Inteligencia emocional
lecciones[18] = {
  titulo: "❤️ Día 18: Inteligencia emocional - cómo nombrar y gestionar emociones",
  objetivo: "Ayudar a los niños a identificar, nombrar y regular sus emociones desde pequeños.",
  teoria: `
    <p>La <strong>inteligencia emocional</strong> es la capacidad de reconocer, comprender y gestionar las emociones propias y ajenas. Se entrena, no es innata.</p>
    
    <p><strong>📌 CÓMO ENSEÑAR INTELIGENCIA EMOCIONAL:</strong></p>
    <ul>
      <li><strong>Nombrar en el momento:</strong> "Veo que estás frustrado porque no te sale el dibujo"</li>
      <li><strong>Enseñar vocabulario emocional:</strong> No solo "triste" y "feliz". Usa: frustrado, decepcionado, celoso, nervioso, avergonzado, emocionado</li>
      <li><strong>Preguntar sobre sensaciones corporales:</strong> "¿Dónde sientes el enojo? ¿En las manos? ¿En la panza?"</li>
      <li><strong>Validar siempre:</strong> "Todas las emociones están bien. Lo que hacemos con ellas puede mejorar."</li>
      <li><strong>Modelar:</strong> "Yo también me siento frustrada a veces. Mira, voy a respirar hondo."</li>
    </ul>
    
    <p><strong>🎨 HERRAMIENTAS PRÁCTICAS:</strong></p>
    <ul>
      <li><strong>Ruleta de emociones:</strong> Dibuja un círculo con 6 emociones. Cada mañana, el niño señala cómo se siente</li>
      <li><strong>Termómetro de emociones:</strong> Del 1 (calma) al 5 (explosión). Ayuda a identificar intensidad</li>
      <li><strong>Cuentos de emociones:</strong> "El monstruo de colores", "Así es mi corazón", "Cuando estoy enojado"</li>
      <li><strong>Juego de caras:</strong> Imitar emociones frente al espejo, adivinar cómo se siente el otro</li>
    </ul>
    
    <p><strong>🔑 LA CLAVE:</strong> No rescates al niño de la emoción. Acompáñalo. "Está bien estar triste. Yo estoy aquí. La tristeza se irá."</p>
    
    <p>💡 <em>"El cerebro emocional se entrena con nombre y presencia. Si nombras la emoción, la domesticas."</em></p>
  `,
  ejemplos: [
    "📖 Niño llora porque se le perdió su juguete favorito. En lugar de 'no llores, te compro otro', decir: 'Veo que estás muy triste. Ese juguete era especial para ti. Está bien llorar. ¿Quieres que lo busquemos juntos?'",
    "📖 Adolescente está enojado. En lugar de 'no te pongas así', decir: 'Noto que estás muy enojado. ¿Quieres hablar? Si no, respetaré tu espacio. Cuando quieras, estoy aquí.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Crea una 'ruleta de emociones' con cartulina y un clip giratorio. Úsenla cada mañana y cada noche.",
    "🎲 ACTIVIDAD 2: Lee un cuento sobre emociones hoy. Pregunta: '¿Cómo se siente el personaje? ¿Por qué? ¿Alguna vez te has sentido así?'",
    "🎲 ACTIVIDAD 3: Juego de 'adivina la emoción': haz una cara y que tu hijo adivine cómo te sientes. Luego cambian roles."
  ],
  tecnicas: ["Nombrar en caliente", "Ruleta de emociones", "Termómetro emocional", "Validación sin rescate"],
  habilidades: ["Inteligencia emocional", "Empatía", "Autorregulación", "Comunicación de necesidades"],
  errores: [
    "❌ Decir 'no estés triste/enojado' (invalida la emoción)",
    "❌ Resolver rápido con premios para que 'no sienta'",
    "❌ Ignorar la emoción",
    "❌ Castigar la expresión emocional ('a tu cuarto si lloras')"
  ],
  frases: [
    "'Todas las emociones son bienvenidas en esta casa. Dime cómo te sientes.'",
    "'¿Dónde sientes el enojo? ¿En tus manos? ¿Quieres apretar algo?'",
    "'Las emociones vienen y van. Esta también pasará.'"
  ],
  herramientas: ["Ruleta de emociones", "Termómetro imprimible", "Cuentos de emociones", "Espejo para imitar caras"]
};

// DÍA 19 - Rutinas que funcionan
lecciones[19] = {
  titulo: "🏠 Día 19: Rutinas que funcionan - estructura sin rigidez",
  objetivo: "Establecer rutinas predecibles que den seguridad sin volverse opresivas.",
  teoria: `
    <p>Las <strong>rutinas</strong> son el andamiaje emocional de los niños. Les permiten anticipar, sentirse seguros y cooperar con menos resistencia.</p>
    
    <p><strong>🔑 BENEFICIOS DE LAS RUTINAS:</strong></p>
    <ul>
      <li>Reducen la ansiedad (saben qué viene después)</li>
      <li>Disminuyen las luchas de poder (no negocian lo predecible)</li>
      <li>Fomentan la autonomía (saben qué hacer sin que les digas)</li>
      <li>Mejoran el sueño, la alimentación y la regulación</li>
    </ul>
    
    <p><strong>📝 CÓMO CREAR RUTINAS EFECTIVAS:</strong></p>
    <ol>
      <li><strong>Visuales:</strong> Usa dibujos o fotos (los niños preescolares entienden mejor lo que ven)</li>
      <li><strong>Secuencia lógica:</strong> Siempre el mismo orden (ej: cena → baño → pijama → cuento → cama)</li>
      <li><strong>Flexibles pero consistentes:</strong> Mismo horario general, pero puede haber excepciones previstas</li>
      <li><strong>Participación del niño:</strong> Que pegue los stickers o señale los pasos</li>
      <li><strong>Avisos previos:</strong> "En 10 minutos empezamos la rutina de la noche"</li>
    </ol>
    
    <p><strong>📋 EJEMPLOS DE RUTINAS VISUALES:</strong></p>
    <ul>
      <li><strong>Mañana:</strong> 1) Levantarse, 2) Ir al baño, 3) Desayunar, 4) Vestirse, 5) Lavarse dientes, 6) Salir</li>
      <li><strong>Noche:</strong> 1) Recoger juguetes, 2) Baño, 3) Pijama, 4) Cuento, 5) Abrazo, 6) Dormir</li>
    </ul>
    
    <p><strong>⚠️ ATENCIÓN:</strong> Las rutinas no son rígidas. Si el niño está muy cansado o enfermo, la flexibilidad es parte de la inteligencia parental.</p>
    
    <p>💡 <em>"Los niños se sienten seguros cuando saben qué viene después. La rutina es el mapa de su día."</em></p>
  `,
  ejemplos: [
    "📖 Niña de 3 años no quiere ir a la cama. La rutina visual ayuda: 'Mira, ya hicimos baño y pijama. Ahora toca cuento. ¿Cuál quieres? Después del cuento, apagamos la luz.'",
    "📖 Niño de 5 años se resiste a vestirse. En lugar de negociar cada prenda, seguir la rutina visual: 'La rutina dice: después de desayunar, nos vestimos. ¿Quieres ponerte la camisa roja o la azul? Tú eliges dentro de la rutina.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Dibuja con tu hijo una 'tabla de rutina de la mañana' con dibujos simples. Pégala en su habitación o en el baño.",
    "🎲 ACTIVIDAD 2: Usa un temporizador para las transiciones: 'En 5 minutos empezamos a recoger para la cena. Cuando suene el timer, guardamos los juguetes.'",
    "🎲 ACTIVIDAD 3: Durante una semana, respeta el mismo horario de comidas y sueño. Observa si hay cambios en el comportamiento."
  ],
  tecnicas: ["Rutinas visuales", "Avisos previos", "Temporizador para transiciones", "Participación del niño"],
  habilidades: ["Organización", "Consistencia", "Creatividad visual", "Paciencia en transiciones"],
  errores: [
    "❌ Cambiar la rutina cada día (confunde)",
    "❌ No tener rutina para los momentos difíciles (mañana acostada, noche)",
    "❌ Usar la rutina como control, no como apoyo",
    "❌ No avisar con tiempo los cambios"
  ],
  frases: [
    "'La rutina dice que ahora toca... ¿Qué sigue después?'",
    "'Cuando termine el timer, guardamos los juguetes. ¿Preparados?'",
    "'Tú puedes seguir la rutina solo. Mira el dibujo.'"
  ],
  herramientas: ["Tabla visual de rutinas", "Temporizador", "Stickers de recompensa", "Calendario semanal"]
};

// DÍA 20 - Crianza y neurodivergencia
lecciones[20] = {
  titulo: "🧠 Día 20: Crianza y neurodivergencia - adaptar técnicas a cada niño",
  objetivo: "Comprender que no todos los niños responden igual y ajustar las estrategias.",
  teoria: `
    <p>La <strong>neurodivergencia</strong> incluye TDAH, autismo, dislexia, altas capacidades, entre otras. Cada cerebro funciona diferente. Lo que funciona para un niño puede no funcionar para otro.</p>
    
    <p><strong>🔑 PRINCIPIOS PARA CRIAR CON NEURODIVERGENCIA:</strong></p>
    <ul>
      <li><strong>Observa, no etiquetes:</strong> "Le cuesta regularse" no "es malo". Busca el 'por qué' detrás del comportamiento</li>
      <li><strong>Ajusta el entorno, no al niño:</strong> Si se sobreestimula, reduce ruidos/luces. Si se aburre, ofrece desafíos</li>
      <li><strong>Anticipa:</strong> Usa agendas visuales, avisos previos, rutinas muy predecibles</li>
      <li><strong>Comunicación clara:</strong> Frases cortas, literal (para TEA), sin dobles sentidos</li>
      <li><strong>Flexibilidad en las consecuencias:</strong> El castigo tradicional no funciona en TDAH/TEA (su cerebro no conecta acción-consecuencia como otros)</li>
    </ul>
    
    <p><strong>📌 ADAPTACIONES ESPECÍFICAS:</strong></p>
    <ul>
      <li><strong>TDAH:</strong> Micro-objetivos, descansos frecuentes, ayudas visuales, mucho refuerzo positivo inmediato</li>
      <li><strong>TEA (autismo):</strong> Anticipación visual, evitar sobrecarga sensorial, respetar intereses especiales, rutinas muy estables</li>
      <li><strong>Altas capacidades:</strong> Desafío intelectual, validar su intensidad emocional, evitar la presión</li>
      <li><strong>Sensibilidad sensorial:</strong> Observar qué detona (etiquetas de ropa, ruidos, luces) y adaptar</li>
    </ul>
    
    <p><strong>⚠️ NO USAR:</strong> Técnicas de modificación de conducta que humillan, tiempo fuera sin explicación, castigos físicos o gritos. Son especialmente dañinos en neurodivergencia.</p>
    
    <p>💡 <em>"Lo que funciona para uno, no funciona para otro. Observa a tu hijo y adapta. El problema no es el niño, es que la neurotípico no encaja en su neurotipo."</em></p>
  `,
  ejemplos: [
    "📖 Niño con TDAH no puede terminar la tarea. En lugar de 'concéntrate', divide: 'Hacemos 5 minutos de tarea, luego 2 de descanso para moverte. Pongo el timer.'",
    "📖 Niño con TEA tiene una crisis sensorial en un lugar ruidoso. En lugar de 'cálmate', retirarse a un lugar tranquilo, ofrecer cascos de ruido o un objeto de regulación (pesado, textura)."
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Observa a tu hijo durante una semana. ¿Qué situaciones desencadenan dificultad? ¿Qué ayuda? Haz un registro.",
    "🎲 ACTIVIDAD 2: Busca un profesional (neurólogo, psicólogo, terapeuta ocupacional) si sospechas neurodivergencia. El diagnóstico abre puertas a adaptaciones.",
    "🎲 ACTIVIDAD 3: Crea un 'kit sensorial' con objetos que regulen a tu hijo: pelota antiestrés, trozo de tela suave, auriculares, peso en los hombros."
  ],
  tecnicas: ["Anticipación visual", "Descomposición de tareas", "Descansos sensoriales", "Entorno adaptado"],
  habilidades: ["Observación clínica", "Empatía neurodivergente", "Flexibilidad", "Abogacía"],
  errores: [
    "❌ Forzar al niño a 'portarse normal' sin adaptar el entorno",
    "❌ Usar castigos para conductas que no controla",
    "❌ Comparar con otros niños neurotípicos",
    "❌ Ignorar señales de sobrecarga sensorial"
  ],
  frases: [
    "'Tu cerebro funciona diferente, no mal. Aprendamos juntos cómo te ayuda.'",
    "'No pasa nada por necesitar ayuda. Yo te ayudo.'",
    "'Vamos a encontrar la manera que funcione para ti.'"
  ],
  herramientas: ["Agenda visual", "Kit sensorial", "Auriculares de cancelación de ruido", "Peso (mantas, chalecos)", "Temporizador visual"]
};

// =====================================================
// MÓDULO PREESCOLARES (3-5 AÑOS) - DÍAS 21 al 25
// =====================================================

lecciones[21] = {
  titulo: "🛒 Día 21: Rabietas en público - cómo actuar sin vergüenza",
  objetivo: "Manejar rabietas en espacios públicos con confianza y sin ceder al chantaje social.",
  teoria: `
    <p>Las <strong>rabietas en público</strong> son especialmente difíciles porque sentimos la presión de "qué dirán". Pero los principios son los mismos que en casa.</p>
    
    <p><strong>🔑 CLAVES PARA RABIETAS EN PÚBLICO:</strong></p>
    <ul>
      <li><strong>Respira primero:</strong> La vergüenza es tuya, no del niño</li>
      <li><strong>Sal del lugar si puedes:</strong> Afuera del supermercado, al baño, al coche</li>
      <li><strong>No cedas al chantaje social:</strong> Comprar algo para que se calle enseña que la rabieta funciona</li>
      <li><strong>Ignora las miradas:</strong> La gente que juzga no cría a tu hijo</li>
      <li><strong>Validación breve:</strong> "Veo que estás enojado. Te acompaño hasta que se pase"</li>
    </ul>
    
    <p>💡 <em>"La mirada de un desconocido no cría a tu hijo. Tú eres su referente, no el público."</em></p>
  `,
  ejemplos: [
    "📖 En el supermercado: niño grita en el piso. Respiras, lo cargas, sales afuera y dices: 'Veo que estás muy enojado. Te tengo. Cuando te calmes, volvemos.'",
    "📖 En el parque: no quiere irse. Dices en voz baja: 'Sé que quieres seguir jugando. Nos vamos en 5 minutos. Pongo el timer.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Practica la frase 'Qué amable que te preocupes, pero yo sé criar a mi hijo' para responder a miradas o comentarios.",
    "🎲 ACTIVIDAD 2: Lleva siempre un 'kit de emergencia' para rabietas: agua, snack, peluche pequeño, timer.",
    "🎲 ACTIVIDAD 3: Ensaya en casa cómo saldrías de un lugar público con tu hijo en brazos sin perder la calma."
  ],
  tecnicas: ["Salida estratégica", "Kit de emergencia", "Ignorar el público", "Validación breve"],
  habilidades: ["Manejo de presión social", "Firmeza amable", "Respiración bajo estrés"],
  errores: [
    "❌ Ceder por vergüenza ('toma el chocolate, pero cállate')",
    "❌ Gritar más fuerte que el niño",
    "❌ Decir 'mira cómo te mira la señora' (usa la vergüenza como herramienta)"
  ],
  frases: [
    "'Tú no eres el problema. La gente que juzga no nos conoce.'",
    "'Vamos a un lugar tranquilo a respirar juntos.'"
  ],
  herramientas: ["Kit de emergencia", "Timer de bolsillo", "Tarjeta de validación rápida"]
};

// DÍA 22 - Control de esfínteres
lecciones[22] = {
  titulo: "🚽 Día 22: Control de esfínteres sin presión",
  objetivo: "Acompañar el proceso de dejar el pañal con respeto y paciencia.",
  teoria: `
    <p>El <strong>control de esfínteres</strong> es un hito del desarrollo. No se fuerza. La mayoría de niños están listos entre los 2 y 4 años.</p>
    
    <p><strong>🔴 SEÑALES DE QUE ESTÁ LISTO:</strong></p>
    <ul>
      <li>Se mantiene seco por 2 horas seguidas</li>
      <li>Le molesta el pañal sucio</li>
      <li>Puede subirse y bajarse los pantalones solo</li>
      <li>Muestra interés por ir al baño como los adultos</li>
    </ul>
    
    <p><strong>🟢 CÓMO ACOMPAÑAR:</strong></p>
    <ul>
      <li>Nunca castigar los accidentes (son parte del aprendizaje)</li>
      <li>Usar bacinica o adaptador, no forzar sentarse</li>
      <li>Rutinas: sentarlo en horarios clave (después de comer, antes de dormir)</li>
      <li>Refuerzo positivo: "¡Lo lograste! ¡Qué orgullo!"</li>
      <li>Paciencia: los retrocesos son normales (un viaje, un cambio de rutina)</li>
    </ul>
    
    <p>💡 <em>El control de esfínteres es del niño, no del adulto. Nuestra tarea es acompañar, no apurar.</em></p>
  `,
  ejemplos: [
    "📖 Niño de 3 años tiene un accidente mientras juega. En lugar de enojarse, decir con calma: 'Uy, se te escapó. No pasa nada. Vamos a cambiarte y la próxima podemos intentar llegar al baño. ¿Te ayudo?'",
    "📖 Niño logra hacer pipí en la bacinica por primera vez. Celebrar: '¡Lo lograste! ¡Qué bien! Tú solito. ¿Cómo te sientes? ¡Estoy muy orgulloso de ti!'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Crea un 'calendario de logros' con stickers. Cada vez que use el baño, pega un sticker.",
    "🎲 ACTIVIDAD 2: Busca un cuento sobre control de esfínteres ('Mi bacinica' o similares) y léelo con tu hijo.",
    "🎲 ACTIVIDAD 3: Practica la paciencia: durante una semana, no preguntes '¿quieres ir al baño?' (presión), sino 'avísame cuando sientas ganas'."
  ],
  tecnicas: ["Rutina de baño", "Calendario de stickers", "Refuerzo positivo"],
  habilidades: ["Paciencia", "Observación de señales", "Contención de la ansiedad"],
  errores: ["❌ Castigar por accidentes", "❌ Comparar con otros niños", "❌ Forzar sentarse en la bacinica", "❌ Quitar el pañal de golpe sin preparación"],
  frases: ["'Los accidentes pasan. Aprendemos juntos.'", "'¡Qué bien! Tú solito. Estoy muy orgulloso.'"],
  herramientas: ["Bacinica o adaptador", "Calendario de stickers", "Cuentos sobre control de esfínteres"]
};

// DÍA 23 - Primeros límites y rutinas
lecciones[23] = {
  titulo: "🔒 Día 23: Primeros límites y rutinas para preescolares",
  objetivo: "Establecer límites claros y rutinas predecibles para niños de 3-5 años.",
  teoria: `
    <p>A esta edad, los niños necesitan <strong>límites claros</strong> para sentirse seguros. Los límites no son castigos, son protección.</p>
    
    <p><strong>📌 LÍMITES NO NEGOCIABLES (seguridad):</strong></p>
    <ul>
      <li>Cinturón de seguridad en el coche</li>
      <li>No cruzar la calle solo</li>
      <li>No tocar cosas peligrosas (enchufes, cuchillos, medicinas)</li>
      <li>No pegar ni morder</li>
    </ul>
    
    <p><strong>📌 RUTINAS QUE DAN SEGURIDAD:</strong></p>
    <ul>
      <li><strong>Mañana:</strong> levantarse, desayunar, vestirse, lavarse dientes</li>
      <li><strong>Comida:</strong> lavar manos, comer juntos, recoger la mesa</li>
      <li><strong>Siesta/Noche:</strong> baño, cuento, canción, dormir</li>
    </ul>
    
    <p><strong>🔑 CLAVE:</strong> Usar <strong>tablas visuales</strong> (dibujos de cada paso). Los niños preescolares entienden mejor lo que ven.</p>
    
    <p>💡 <em>Los límites dichos con calma son más efectivos que los gritos. 'En este coche, todos usamos cinturón' es un límite claro.</em></p>
  `,
  ejemplos: [
    "📖 Límite en el supermercado: 'En el supermercado caminamos agarrados de la mano o vas en el carrito. Tú eliges.'",
    "📖 Rutina visual: Dibujar en una cartulina: 1) lavarse manos, 2) sentarse en la mesa, 3) comer, 4) lavarse los dientes. Cada paso se tapa con un sticker al completarlo."
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Dibuja una tabla visual de la rutina de la mañana con tu hijo. Pega dibujos o imprime imágenes.",
    "🎲 ACTIVIDAD 2: Elige UN límite que te cueste poner esta semana y escríbelo. Practica decirlo en voz baja pero firme.",
    "🎲 ACTIVIDAD 3: Crea un 'semáforo de comportamiento': verde (bien), amarillo (aviso), rojo (consecuencia). Úsalo con calma."
  ],
  tecnicas: ["Tablas visuales", "Límite con opción", "Semáforo de comportamiento"],
  habilidades: ["Firmeza amable", "Consistencia", " Creatividad pedagógica"],
  errores: ["❌ Decir 'no' sin alternativa", "❌ Cambiar los límites según el humor del adulto", "❌ Gritar el límite"],
  frases: ["'Los límites no son un castigo, son para protegerte.'", "'Tú decides dentro de lo seguro.'"],
  herramientas: ["Tabla visual imprimible", "Temporizador", "Semáforo de cartulina"]
};

// DÍA 24 - Juego como herramienta de crianza
lecciones[24] = {
  titulo: "🎮 Día 24: El juego como herramienta de crianza",
  objetivo: "Usar el juego para conectar, enseñar y resolver conflictos.",
  teoria: `
    <p>El <strong>juego</strong> es el lenguaje natural de los niños. A través del juego:</p>
    <ul>
      <li>Se fortalece el vínculo</li>
      <li>Se regulan emociones</li>
      <li>Se aprenden habilidades sociales</li>
      <li>Se resuelven conflictos</li>
    </ul>
    
    <p><strong>🎲 TÉCNICAS DE JUEGO:</strong></p>
    <ul>
      <li><strong>Juego de roles:</strong> simular situaciones difíciles (ir al médico, compartir juguetes) con muñecos</li>
      <li><strong>Juego de risa:</strong> cosquillas, persecuciones, imitar animales → libera tensión</li>
      <li><strong>Juego de regulación:</strong> respirar como un dragón, inflar un globo imaginario</li>
      <li><strong>Juego de cooperación:</strong> construir algo juntos, resolver puzzles</li>
    </ul>
    
    <p>💡 <em>10 minutos de juego ininterrumpido al día (sin teléfono, sin prisas) transforman la relación.</em></p>
  `,
  ejemplos: [
    "📖 Niño tiene miedo al doctor: Jugar con un muñeco a 'curarlo'. El niño es el médico, luego cambian roles. Reduce la ansiedad.",
    "📖 Niño frustrado porque no sabe armar un puzzle: convertirlo en juego '¿quién encuentra la pieza roja más rápido?'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Dedica 15 minutos hoy a jugar lo que tu hijo elija. Sin pantallas, sin correcciones. Solo presencia.",
    "🎲 ACTIVIDAD 2: Inventa un juego para una transición difícil (¡a ver quién se pone los zapatos más rápido cantando una canción!).",
    "🎲 ACTIVIDAD 3: Usa muñecos para representar una situación que fue conflicto ayer. Pregunta a tu hijo: '¿cómo crees que podrían resolverlo?'"
  ],
  tecnicas: ["Juego de roles", "Transiciones jugadas", "Juego de risa"],
  habilidades: ["Creatividad", "Conexión lúdica", "Regulación a través del juego"],
  errores: ["❌ Convertir el juego en enseñanza ('ahora aprende las letras')", "❌ Usar pantallas como único juego", "❌ No participar, solo observar"],
  frases: ["'Hoy juegas tú a lo que quieras. Yo solo te acompaño.'", "'¿Cómo podemos convertir esto en un juego?'"],
  herramientas: ["Muñecos o figuras", "Temporizador divertido", "Globos para respirar"]
};

// DÍA 25 - Emociones y vocabulario emocional
lecciones[25] = {
  titulo: "💖 Día 25: Enseñar inteligencia emocional a preescolares",
  objetivo: "Ayudar a los niños a identificar y nombrar sus emociones.",
  teoria: `
    <p>Los niños preescolares <strong>sienten todas las emociones</strong> pero no saben nombrarlas. Nuestro trabajo es darles <strong>vocabulario emocional</strong>.</p>
    
    <p><strong>📌 CÓMO ENSEÑAR EMOCIONES:</strong></p>
    <ul>
      <li><strong>Nombrar en el momento:</strong> "Veo que estás frustrado porque no te sale el dibujo"</li>
      <li><strong>Usar cuentos:</strong> libros sobre emociones (El monstruo de colores, Así es mi corazón)</li>
      <li><strong>Juego de caras:</strong> imitar emociones con el espejo o dibujar caritas</li>
      <li><strong>Tarjetas de emociones:</strong> mostrar diferentes caras y preguntar "¿cómo se siente?"</li>
    </ul>
    
    <p><strong>🎨 RULETA DE EMOCIONES:</strong> Dibuja un círculo con 4-6 emociones básicas (alegría, tristeza, enojo, miedo, calma). Cada mañana, el niño señala cómo se siente.</p>
    
    <p>💡 <em>"Nombrar la emoción es el primer paso para regularla."</em></p>
  `,
  ejemplos: [
    "📖 Niño llora porque se le cayó un dibujo. En lugar de 'no llores', decir: 'Veo que estás triste porque se dañó tu dibujo. Está bien estar triste. ¿Quieres que intentemos hacer otro?'",
    "📖 Juego antes de dormir: '¿Cómo te sentiste hoy? Señala en la ruleta. ¿Qué fue lo que más te gustó? ¿Qué fue difícil?'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Crea una 'ruleta de emociones' con cartulina y un clip giratorio. Úsala cada mañana y cada noche.",
    "🎲 ACTIVIDAD 2: Lee un cuento sobre emociones hoy. Pregunta: '¿Cómo se siente el personaje? ¿Por qué?'",
    "🎲 ACTIVIDAD 3: Juego de 'adivina la emoción': haz una cara y que tu hijo adivine cómo te sientes. Luego cambian roles."
  ],
  tecnicas: ["Nombrar la emoción en caliente", "Ruleta de emociones", "Cuentos emocionales"],
  habilidades: ["Inteligencia emocional", "Empatía", "Comunicación"],
  errores: ["❌ Decir 'no estés triste/enojado'", "❌ Ignorar la emoción", "❌ Resolver rápido con premios"],
  frases: ["'Todas las emociones están bien. Lo que hacemos con ellas puede mejorar.'", "'Dime cómo te sientes y te ayudo a ponerle nombre.'"],
  herramientas: ["Ruleta de emociones descargable", "Espejo para imitar caras", "Libros de emociones"]
};
// =====================================================
// DÍAS 26 AL 33 - TEMAS AVANZADOS (COMPLETOS)
// =====================================================

lecciones[26] = {
  titulo: "👪 Día 26: Co-parentalidad - consistencia entre adultos",
  objetivo: "Establecer acuerdos claros entre todos los cuidadores para una crianza coherente.",
  teoria: `
    <p>La <strong>co-parentalidad</strong> es la capacidad de dos o más adultos (papás, mamás, abuelos, cuidadores) de criar juntos de manera consistente, incluso si no viven juntos o no tienen la misma relación.</p>
    
    <p><strong>🔑 CLAVES PARA UNA CO-PARENTALIDAD SALUDABLE:</strong></p>
    <ul>
      <li><strong>Acuerdos escritos:</strong> Pongan por escrito las normas básicas (horarios, límites, consecuencias) para no contradecirse</li>
      <li><strong>Comunicación respetuosa:</strong> Hablen en privado los desacuerdos. Nunca delante del niño</li>
      <li><strong>No desautorizar al otro:</strong> "Tu papá dijo que no, entonces no" (aunque no estés de acuerdo, se habla después)</li>
      <li><strong>Frente unificado:</strong> Los niños necesitan ver que los adultos están alineados</li>
      <li><strong>Reuniones regulares:</strong> Semanal o quincenal para ajustar lo que no funciona</li>
    </ul>
    
    <p><strong>⚠️ EN CASO DE SEPARACIÓN/DIVORCIO:</strong></p>
    <ul>
      <li>Nunca hables mal del otro progenitor delante del niño</li>
      <li>El niño no es mensajero ("dile a tu papá que...")</li>
      <li>El niño no es aliado ("tú y yo contra él/ella")</li>
      <li>Mantén rutinas similares en ambas casas</li>
    </ul>
    
    <p>💡 <em>"La peor herencia que puedes dejarle a tu hijo es la inconsistencia entre adultos. Un frente unificado da seguridad."</em></p>
  `,
  ejemplos: [
    "📖 Mamá dice 'no más tele'. Papá llega y dice 'está bien, un ratito más'. Error. Deberían hablar en privado y mantener la misma regla.",
    "📖 Acuerdo escrito: 'En ambas casas, la regla es: pantallas 1 hora al día, nada en la mesa ni antes de dormir.' Así el niño no negocia entre adultos."
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Reúne a todos los cuidadores y escriban juntos las 5 reglas básicas de la casa. Pónganlas en la nevera.",
    "🎲 ACTIVIDAD 2: Si hay desacuerdo, programa una 'reunión de adultos' semanal para hablar sin el niño presente.",
    "🎲 ACTIVIDAD 3: Practica la frase: 'Voy a hablarlo con tu papá/mamá y te respondemos juntos.' (no responder diferente cada uno)"
  ],
  tecnicas: ["Acuerdos por escrito", "Reuniones de adultos", "Frente unificado", "Comunicación privada"],
  habilidades: ["Negociación entre adultos", "Consistencia", "Respeto mutuo"],
  errores: [
    "❌ Desautorizar al otro frente al niño",
    "❌ Usar al niño como mensajero",
    "❌ Criticar al otro progenitor",
    "❌ Tener reglas diferentes en cada casa sin acordar"
  ],
  frases: [
    "'Voy a hablarlo con tu papá/mamá y te damos la respuesta juntos.'",
    "'En esta casa, mamá y papá tomamos las decisiones juntos.'"
  ],
  herramientas: ["Acuerdo de co-parentalidad escrito", "Calendario compartido", "App de comunicación coparental (OurFamilyWizard)"]
};

lecciones[27] = {
  titulo: "🛡️ Día 27: Prevención de abuso - enseñar límites corporales",
  objetivo: "Proteger a tus hijos del abuso enseñándoles que su cuerpo es suyo y cómo pedir ayuda.",
  teoria: `
    <p>La <strong>prevención del abuso sexual infantil</strong> comienza en casa. No con miedo, sino con educación en límites corporales.</p>
    
    <p><strong>🔑 CONCEPTOS CLAVE PARA ENSEÑAR (desde los 2 años):</strong></p>
    <ul>
      <li><strong>"Mi cuerpo es mío"</strong> - Nadie puede tocarlo sin mi permiso</li>
      <li><strong>Partes íntimas tienen nombre real</strong> - Vulva, pene, ano. Usar nombres reales (no apodos) empodera y previene</li>
      <li><strong>Secretos buenos y malos</strong> - Buenos: una sorpresa de cumpleaños. Malos: los que piden no contar algo que te hace sentir incómodo</li>
      <li><strong>Decir NO a adultos</strong> - Enseña que puede decir "no" a un abrazo o beso, aunque sea un familiar</li>
      <li><strong>Pedir ayuda</strong> - Identificar adultos de confianza (mamá, papá, maestra, abuela) a quien contarle siempre</li>
    </ul>
    
    <p><strong>📌 CÓMO ENSEÑAR SIN MIEDO:</strong></p>
    <ul>
      <li>Usa canciones ('Mi cuerpo es mío'), cuentos, juegos de roles</li>
      <li>Practica: "¿Qué harías si alguien te pide que guardes un secreto que te hace sentir raro?"</li>
      <li>Nunca fuerces a dar besos o abrazos. Puede saludar con la mano o chocar los cinco</li>
      <li>Normaliza las conversaciones sobre el cuerpo y los límites</li>
    </ul>
    
    <p><strong>🚨 SEÑALES DE ALARMA (cambios repentinos):</strong> Pesadillas, no querer estar con alguien, cambios en el comportamiento, lenguaje sexual inapropiado para su edad.</p>
    
    <p>💡 <em>"Enseña a tu hijo: 'tu cuerpo es tuyo y nadie puede tocarlo sin tu permiso. Nunca es tarde para contar un secreto que te hace mal.'"</em></p>
  `,
  ejemplos: [
    "📖 En lugar de 'anda, dale un beso a la tía', decir: '¿Cómo quieres saludar a la tía? ¿Con un abrazo, chocar los cinco o con la mano? Tú eliges.'",
    "📖 Usar un cuento: 'Había una vez un niño que alguien le pidió guardar un secreto. Él le contó a su mamá y ella lo ayudó.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Enséñale a tu hijo la canción 'Mi cuerpo es mío' (busca en YouTube). Cántenla juntos.",
    "🎲 ACTIVIDAD 2: Practica la frase: 'Si alguien te toca donde no quieres o te pide un secreto que te hace sentir mal, me lo puedes contar a mí. Nunca me enojaré.'",
    "🎲 ACTIVIDAD 3: Identifiquen 3 adultos de confianza (además de ti) a quienes pueda contar algo importante."
  ],
  tecnicas: ["Nombres reales de partes íntimas", "Regla de los secretos", "Empoderamiento para decir NO", "Adultos de confianza"],
  habilidades: ["Comunicación abierta", "Detección temprana", "Empoderamiento infantil"],
  errores: [
    "❌ Usar apodos para partes íntimas ('colita', 'pito') - confunde y dificulta contar",
    "❌ Forzar besos o abrazos",
    "❌ Decir 'si no obedeces, te llevará el hombre del saco' (genera miedo a pedir ayuda)",
    "❌ Ignorar cambios de comportamiento"
  ],
  frases: [
    "'Tu cuerpo es tuyo. Tú decides quién lo toca y cómo.'",
    "'No hay secretos que no puedas contarme. Pase lo que pase, yo te voy a creer y te voy a ayudar.'"
  ],
  herramientas: ["Cuentos sobre prevención de abuso", "Canción 'Mi cuerpo es mío'", "Lista de adultos de confianza"]
};

lecciones[28] = {
  titulo: "🎭 Día 28: Crianza en divorcio - proteger el vínculo",
  objetivo: "Cuidar la salud emocional de los hijos durante y después de una separación.",
  teoria: `
    <p>El <strong>divorcio o separación</strong> es un duelo para toda la familia. Los hijos no tienen que elegir bandos. Tu tarea es proteger su vínculo con ambos padres.</p>
    
    <p><strong>🔑 REGLAS DE ORO EN DIVORCIO:</strong></p>
    <ul>
      <li><strong>No hables mal del otro progenitor</strong> - Ni siquiera "en broma". El niño lo vive como un ataque a una parte de sí mismo</li>
      <li><strong>El niño NO es mensajero</strong> - "Dile a tu papá que..." NO. Comunícate directamente con el otro adulto</li>
      <li><strong>El niño NO es aliado</strong> - "Tú y yo contra él/ella" es una carga enorme. El niño necesita amar a ambos</li>
      <li><strong>No interrogues</strong> - "¿Qué hizo tu mamá en su casa?" no es sano</li>
      <li><strong>Rutinas similares</strong> - Si es posible, mantén horarios, reglas y límites parecidos en ambas casas</li>
    </ul>
    
    <p><strong>📌 CÓMO ACOMPAÑAR LAS EMOCIONES DEL NIÑO:</strong></p>
    <ul>
      <li>Valida su tristeza, enojo, confusión: "Sé que esto es difícil. Está bien sentirte así."</li>
      <li>No mientas, pero adapta la información a su edad</li>
      <li>Reafirma el amor: "Tu papá y yo ya no vivimos juntos, pero los dos te queremos muchísimo. Eso no va a cambiar nunca."</li>
      <li>Busca apoyo profesional (terapia familiar) si hay conflictos intensos</li>
    </ul>
    
    <p>💡 <em>"Tu hijo no necesita elegir entre amarte a ti o al otro progenitor. Necesita poder amar a ambos sin culpa."</em></p>
  `,
  ejemplos: [
    "📖 En lugar de 'tu papá nunca viene a buscarte', decir: 'Tu papá te quiere mucho. A veces los adultos tenemos dificultades, pero eso no es tu culpa.'",
    "📖 Niños pregunta: '¿Por qué ya no viven juntos?'. Respuesta adecuada a su edad: 'Los adultos a veces decidimos vivir separados porque nos llevamos mejor así. Los dos te queremos igual.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Si estás en divorcio, escribe una carta a tu ex-pareja (sin enviar si es necesario) comprometiéndote a no hablar mal delante del niño.",
    "🎲 ACTIVIDAD 2: Crea un 'calendario de transiciones' visual para que el niño sepa cuándo está con cada progenitor.",
    "🎲 ACTIVIDAD 3: Practica la frase: 'Eso se lo preguntas a tu papá/mamá directamente' (en lugar de transmitir mensajes)."
  ],
  tecnicas: ["Comunicación directa entre adultos", "Calendario de transiciones", "Validación emocional", "Mensajes unificados"],
  habilidades: ["Comunicación respetuosa con ex-pareja", "Protección del vínculo", "Validación emocional"],
  errores: [
    "❌ Hablar mal del otro progenitor",
    "❌ Usar al niño como espía o mensajero",
    "❌ Competir por el amor del niño (regalos, permisos especiales)",
    "❌ Poner al niño en medio de discusiones"
  ],
  frases: [
    "'Tu papá/mamá te quiere mucho. Eso no cambia.'",
    "'Los problemas entre adultos no son tu responsabilidad.'",
    "'Puedes querer a los dos. No tienes que elegir.'"
  ],
  herramientas: ["Calendario de crianza compartida", "App de comunicación coparental", "Terapia familiar"]
};

lecciones[29] = {
  titulo: "🌱 Día 29: Adolescencia respetuosa - autonomía con guía",
  objetivo: "Acompañar la adolescencia con respeto, negociación y límites flexibles.",
  teoria: `
    <p>La <strong>adolescencia</strong> es el ensayo para la adultez. Los adolescentes necesitan autonomía para equivocarse en pequeño y aprender.</p>
    
    <p><strong>🔑 PRINCIPIOS PARA LA ADOLESCENCIA:</strong></p>
    <ul>
      <li><strong>Negocia, no impongas</strong> - Las reglas unilaterales generan rebeldía. Negocia horarios, límites, consecuencias</li>
      <li><strong>Escucha más de lo que hablas</strong> - Pregunta, no sermons. "¿Qué piensas sobre...?"</li>
      <li><strong>Elige tus batallas</strong> - No todo merece un conflicto. ¿Es peligroso o solo no te gusta?</li>
      <li><strong>Valida sus emociones intensas</strong> - El cerebro adolescente es emocional. No minimices: "entiendo que te sientas así"</li>
      <li><strong>Confía (con supervisión)</strong> - Dale responsabilidades progresivas. Si falla, no le retires toda la confianza</li>
    </ul>
    
    <p><strong>📌 TEMAS CLAVE A NEGOCIAR:</strong></p>
    <ul>
      <li>Horario de llegada (negociable según edad y confianza)</li>
      <li>Uso de pantallas y redes sociales</li>
      <li>Ayuda en casa (responsabilidades)</li>
      <li>Decisiones sobre estudios o actividades</li>
    </ul>
    
    <p>💡 <em>"La adolescencia es el ensayo para la adultez. Permite errores pequeños para que aprendan a resolver los grandes."</em></p>
  `,
  ejemplos: [
    "📖 En lugar de 'llegas a las 9 y punto', decir: 'Hablemos del horario. ¿Qué te parece llegar a las 10 los viernes, pero a cambio me mandas un mensaje cuando llegues y respondes los mensajes? ¿Cómo lo ves?'",
    "📖 Adolescente llega tarde. En lugar de gritar, decir: 'Me preocupé. Hablemos de qué pasó y cómo podemos evitar que vuelva a pasar. También hablemos de una consecuencia lógica para la próxima.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Esta semana, programa una 'conversación sin juicios' con tu adolescente. Solo escucha, no interrumpas, no des consejos a menos que te los pida.",
    "🎲 ACTIVIDAD 2: Elige UNA regla que puedas negociar. Siéntense y escuchen su propuesta.",
    "🎲 ACTIVIDAD 3: Pregúntale directamente: '¿Cómo preferirías que te ponga límites? ¿Qué funciona para ti?' (los adolescentes tienen buenas ideas)."
  ],
  tecnicas: ["Negociación democrática", "Escucha activa", "Elección de batallas", "Consecuencias lógicas pactadas"],
  habilidades: ["Escucha", "Negociación", "Flexibilidad", "Confianza"],
  errores: [
    "❌ Sermonear en lugar de preguntar",
    "❌ No negociar nada (todo impuesto)",
    "❌ Ignorar sus emociones ('exageras')",
    "❌ Retirar toda confianza tras un error"
  ],
  frases: [
    "'¿Qué piensas sobre...? Me interesa tu opinión.'",
    "'Confío en ti. Vamos a probar lo que acordamos y ajustamos si no funciona.'",
    "'No estoy de acuerdo, pero quiero escuchar tu punto de vista.'"
  ],
  herramientas: ["Acuerdo de convivencia escrito", "Calendario familiar", "App de localización (si se acuerda)"]
};

lecciones[30] = {
  titulo: "🧘 Día 30: Mindfulness parental - respirar antes de reaccionar",
  objetivo: "Entrenar la presencia plena y la pausa antes de responder impulsivamente.",
  teoria: `
    <p>El <strong>mindfulness parental</strong> es la práctica de estar presente, sin juzgar, en cada interacción con tus hijos. No significa ser perfecto, significa volver a respirar cuando te desregulas.</p>
    
    <p><strong>🌿 TÉCNICAS DE MINDFULNESS PARA PADRES:</strong></p>
    <ul>
      <li><strong>Respiración 3-3-3:</strong> Inhalas 3 segundos, sostienes 3, exhalas 3. Repite 3 veces antes de responder</li>
      <li><strong>Escaneo corporal rápido:</strong> Antes de reaccionar, nota: ¿tensión en los hombros? ¿mandíbula apretada? Relaja</li>
      <li><strong>Pausa de 5 segundos:</strong> Antes de hablar, cuenta hasta 5 en silencio. Eso evita el 80% de los gritos</li>
      <li><strong>Anclaje visual:</strong> Mira algo neutro (una pared, una planta) y respira antes de enfrentar la situación</li>
    </ul>
    
    <p><strong>🔑 POR QUÉ FUNCIONA:</strong> La respiración activa el sistema nervioso parasimpático (calma). Cuando estás regulado, tu hijo también se regula (contagio emocional).</p>
    
    <p><strong>📌 MINDFULNESS EN EL DÍA A DÍA:</strong></p>
    <ul>
      <li>Al despertar: 3 respiraciones antes de levantarte</li>
      <li>Antes de entrar a casa después del trabajo: respira 5 veces en el coche</li>
      <li>Antes de poner un límite: pausa de 5 segundos</li>
      <li>Cuando te sientes a punto de gritar: sal de la habitación, respira, vuelve</li>
    </ul>
    
    <p>💡 <em>"Tu calma es su ancla. Si tú te desregulas, él también. Respira antes de reaccionar."</em></p>
  `,
  ejemplos: [
    "📖 Niño tira la comida al suelo. En lugar de reaccionar con ira, respiras 3 veces, luego dices con voz baja: 'La comida no se tira. Recogemos juntos.'",
    "📖 Estás al límite después de un día agotador y tu hijo pide atención. Tomas una pausa: respiras, luego dices: 'Mamá necesita respirar un momento. Dame 5 minutos y luego jugamos.'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Pon una alarma en tu teléfono que suene 3 veces al día. Cuando suene, respira 3 veces profundamente.",
    "🎲 ACTIVIDAD 2: Antes de cada interacción difícil, practica la 'pausa de 5 segundos' (cuenta en silencio antes de hablar).",
    "🎲 ACTIVIDAD 3: Descarga una app de meditación guiada (Headspace, Calm, Mindfulness en Español) y practica 5 minutos al día."
  ],
  tecnicas: ["Respiración 3-3-3", "Pausa de 5 segundos", "Escaneo corporal", "Anclaje visual"],
  habilidades: ["Autorregulación", "Presencia plena", "Respuesta en lugar de reacción"],
  errores: [
    "❌ Saltarse la pausa y reaccionar impulsivamente",
    "❌ Creer que no tienes tiempo para respirar (si no respiras, el conflicto durará más)",
    "❌ Esperar ser perfecto (mindfulness es práctica, no perfección)"
  ],
  frases: [
    "'Voy a respirar antes de responder. Dame un segundo.'",
    "'Mami/papi necesita un momento para calmarse. Respiro y vuelvo.'",
    "'Estoy aquí, presente. No necesito gritar para que me escuches.'"
  ],
  herramientas: ["App de mindfulness", "Alarma de respiración", "Pulsera de respiración (elástica)"]
};

lecciones[31] = {
  titulo: "📖 Día 31: Cuentos como herramienta de crianza",
  objetivo: "Usar narrativa y metáforas para enseñar, conectar y resolver conflictos.",
  teoria: `
    <p>Los <strong>cuentos</strong> son una de las herramientas más poderosas en la crianza. Permiten abordar temas difíciles sin confrontación directa.</p>
    
    <p><strong>✨ BENEFICIOS DE CONTAR CUENTOS:</strong></p>
    <ul>
      <li>El niño se identifica con el personaje sin sentirse señalado</li>
      <li>Las metáforas llegan al cerebro emocional mejor que las órdenes</li>
      <li>Fortalecen el vínculo a través del ritual de leer juntos</li>
      <li>Ayudan a procesar miedos, rabietas, cambios (hermano nuevo, mudanza, escuela)</li>
    </ul>
    
    <p><strong>📌 CÓMO USAR CUENTOS ESTRATÉGICAMENTE:</strong></p>
    <ul>
      <li><strong>Para un problema específico:</strong> Inventa un cuento con un personaje que vive lo mismo que tu hijo (rabietas, miedo a dormir solo, compartir)</li>
      <li><strong>Para transiciones:</strong> Cuentos sobre la llegada de un hermano, ir al jardín, dejar el pañal</li>
      <li><strong>Para emociones:</strong> Cuentos sobre el monstruo de colores (emociones), la tortuga que respiraba lento (calma)</li>
      <li><strong>Pregunta después del cuento:</strong> "¿Cómo crees que se sintió el personaje? ¿Qué hubieras hecho tú?"</li>
    </ul>
    
    <p><strong>🎨 CÓMO INVENTAR UN CUENTO:</strong> Un personaje (un osito, una princesa, un coche), un problema parecido al de tu hijo, un momento de dificultad, una solución que aprende, un final feliz.</p>
    
    <p>💡 <em>"Un cuento puede enseñar lo que una regaño no logra. La metáfora entra por la puerta de atrás del cerebro."</em></p>
  `,
  ejemplos: [
    "📖 Para un niño con miedo a la oscuridad: cuento de 'Luna, la osita que aprendió que la oscuridad es solo la luz que se fue a dormir'. Inventa una canción para el momento de apagar la luz.",
    "📖 Para un niño que no quiere compartir: cuento de 'Dos dragones y una piedra brillante' donde aprenden a turnarse."
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Hoy, en lugar de regañar por un problema, invéntate un cuento corto sobre ese tema. Cuéntaselo antes de dormir.",
    "🎲 ACTIVIDAD 2: Pide a tu hijo que te invente un cuento. Deja que él sea el protagonista y resuelva el conflicto.",
    "🎲 ACTIVIDAD 3: Crea una 'caja de cuentos' con personajes (muñecos, piedras pintadas) para inventar historias juntos."
  ],
  tecnicas: ["Cuento terapéutico", "Metáfora personalizada", "Preguntas post-cuento", "Caja de personajes"],
  habilidades: ["Creatividad narrativa", "Conexión emocional", "Comunicación indirecta"],
  errores: [
    "❌ Hacer el cuento muy obvio (el personaje se llama como el niño y tiene su mismo problema - se siente señalado)",
    "❌ Usar el cuento para sermonear al final",
    "❌ No dejar espacio para que el niño pregunte o comente"
  ],
  frases: [
    "'Vamos a inventar una historia juntos. Tú puedes decidir qué pasa después.'",
    "'Había una vez un niño/a que se sentía... ¿cómo te sientes tú a veces?'"
  ],
  herramientas: ["Libros infantiles por tema", "Caja de personajes", "Cuentos de elaboración propia"]
};

lecciones[32] = {
  titulo: "🔁 Día 32: Reparación después del error - pedir disculpas sinceras",
  objetivo: "Aprender a reparar el vínculo cuando nos equivocamos (porque nos equivocaremos).",
  teoria: `
    <p>La <strong>reparación</strong> es una de las habilidades parentales más importantes. No hay padres perfectos. Los habrá que se equivocan. Lo que define una buena crianza es la capacidad de reparar.</p>
    
    <p><strong>🔑 CÓMO REPARAR (pasos):</strong></p>
    <ol>
      <li><strong>Reconoce el error:</strong> "Me equivoqué. Grité y no debí hacerlo."</li>
      <li><strong>Pide disculpas sinceras:</strong> "Lo siento. No fue tu culpa."</li>
      <li><strong>Explica qué pasó (sin justificarte):</strong> "Estaba muy cansado y reaccioné mal."</li>
      <li><strong>Compromiso de cambio:</strong> "Voy a intentar respirar antes de gritar la próxima vez."</li>
      <li><strong>Pregunta cómo se siente:</strong> "¿Cómo te sentiste cuando grité? ¿Cómo puedo reparar?"</li>
    </ol>
    
    <p><strong>🌟 POR QUÉ REPARAR ES PODEROSO:</strong></p>
    <ul>
      <li>Enseña a tu hijo que los errores son oportunidades</li>
      <li>Fortalece el vínculo (la honestidad acerca de los fallos genera más confianza que la falsa perfección)</li>
      <li>Modela cómo pedir disculpas (ellos aprenderán a hacerlo)</li>
      <li>Reduce la vergüenza y el resentimiento</li>
    </ul>
    
    <p><strong>🚫 CÓMO NO PEDIR DISCULPAS:</strong></p>
    <ul>
      <li>"Lo siento, pero tú también..." (no mezcles, tu error es tuyo)</li>
      <li>"Lo siento si te sentiste mal" (no es genuino)</li>
      <li>"Ya te pedí disculpas, ya pasó" (la reparación lleva tiempo)</li>
    </ul>
    
    <p>💡 <em>"Pedir disculpas a tu hijo no te quita autoridad, te da respeto. El error bien reparado fortalece el vínculo más que el acierto."</em></p>
  `,
  ejemplos: [
    "📖 Le gritaste a tu hijo porque derramó leche. Después de calmarte, te arrodillas y dices: 'Hace un rato grité. Lo siento mucho. No debí hacerlo, aunque haya sido un accidente. Estaba frustrada, pero no fue tu culpa. La próxima vez voy a respirar antes. ¿Me perdonas? ¿Cómo te sentiste?'",
    "📖 Castigaste desproporcionadamente. Al día siguiente: 'Ayer te castigué sin tele por una semana por algo pequeño. Me equivoqué. La consecuencia no era justa. Vamos a revisarla juntos. Propongo que sea solo un día. ¿Te parece bien?'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: La próxima vez que te equivoques con tu hijo, practica los 5 pasos de reparación. No lo dejes pasar.",
    "🎲 ACTIVIDAD 2: Pregunta a tu hijo: '¿Hay algo por lo que sientas que debería pedirte disculpas?' (escucha sin defensas).",
    "🎲 ACTIVIDAD 3: Modela la disculpa con tu pareja o familiares delante de él."
  ],
  tecnicas: ["Reparación en 5 pasos", "Disculpa sin 'peros'", "Preguntar cómo se sintió", "Compromiso de cambio"],
  habilidades: ["Humildad", "Responsabilidad afectiva", "Modelado de reparación"],
  errores: [
    "❌ No pedir disculpas (falsa idea de que 'pierdes autoridad')",
    "❌ Disculpa con 'pero' (\"lo siento, PERO tú...\")",
    "❌ Minimizar el daño (\"no fue para tanto\")",
    "❌ Esperar que el niño perdone inmediatamente"
  ],
  frases: [
    "'Me equivoqué. Lo siento. No era mi intención hacerte sentir mal.'",
    "'¿Cómo puedo reparar lo que hice? ¿Qué necesitas de mí?'",
    "'Gracias por decirme cómo te sentiste. Me ayuda a ser mejor papá/mamá.'"
  ],
  herramientas: ["Tarjeta de reparación (pasos)", "Rincón de calma también para adultos", "Diario de errores y aprendizajes"]
};

lecciones[33] = {
  titulo: "🏅 Día 33: Maestría parental - celebrar el recorrido",
  objetivo: "Reconocer tu crecimiento como cuidador y celebrar el camino recorrido.",
  teoria: `
    <p>¡FELICIDADES! Has llegado al final de este curso de 33 días. No se trata de ser un padre/madre perfecto, sino de ser un padre/madre consciente.</p>
    
    <p><strong>🌟 LO QUE HAS LOGRADO:</strong></p>
    <ul>
      <li>Has dedicado 33 días a reflexionar sobre tu crianza</li>
      <li>Has conocido tu estilo y aprendido herramientas para mejorarlo</li>
      <li>Has practicado validación, límites, comunicación no violenta</li>
      <li>Has explorado temas específicos: pantallas, hermanos, sueño, neurodivergencia</li>
      <li>Has aprendido a reparar cuando te equivocas</li>
    </ul>
    
    <p><strong>📌 RECUERDA SIEMPRE:</strong></p>
    <ul>
      <li>No hay padres perfectos, hay padres conscientes</li>
      <li>Cada día es nuevo. Los errores de ayer no definen tu mañana</li>
      <li>Tu hijo no necesita un adulto perfecto, necesita un adulto presente</li>
      <li>El autocuidado no es egoísmo, es la base</li>
      <li>Cada familia es única. No compares</li>
    </ul>
    
    <p><strong>🎉 CÓMO CELEBRAR:</strong></p>
    <ul>
      <li>Descarga tu certificado de finalización</li>
      <li>Comparte tu logro con alguien que te apoya</li>
      <li>Revisa tus reflexiones de los 33 días (¿cuánto has cambiado?)</li>
      <li>Recomienda este curso a otra familia</li>
    </ul>
    
    <p>🎉 <strong>¡FELICIDADES! Has completado los 33 días del curso de crianza consciente. Eres un ejemplo de compromiso y amor.</strong></p>
    
    <p>💡 <em>"La crianza no es perfección, es presencia. Y tú has estado presente durante 33 días. Sigue así."</em></p>
  `,
  ejemplos: [
    "📖 Mira hacia atrás: piensa en una situación que hace 33 días te habría desbordado. ¿Cómo respondes hoy? Eso es crecimiento.",
    "📖 Comparte con tu hijo: 'Mamá/papá estuvo aprendiendo sobre crianza durante 33 días. ¿Notaste algún cambio?' Escucha su respuesta."
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: Descarga tu certificado (botón abajo) y enmárcalo o ponlo en la nevera.",
    "🎲 ACTIVIDAD 2: Escribe una carta a tu hijo sobre lo que has aprendido y cómo quieres seguir mejorando.",
    "🎲 ACTIVIDAD 3: Comparte este curso con otra familia. La crianza consciente se multiplica cuando se comparte."
  ],
  tecnicas: ["Celebración del logro", "Reflexión retrospectiva", "Compartir el aprendizaje"],
  habilidades: ["Gratitud", "Autocompasión", "Compromiso continuo"],
  errores: ["❌ Creer que 'ya lo sé todo' - la crianza siempre se aprende", "❌ No celebrar el esfuerzo"],
  frases: ["'La crianza consciente no es un destino, es un camino. Y tú has caminado 33 días.'"],
  herramientas: ["Certificado descargable", "Lista de recursos continuos (libros, podcasts, comunidades)"]
};


// --- FUNCIÓN PARA GENERAR EL TEST COMPLETO ---
function generarTestCompleto() {
  return `
    <div class="card" style="margin-top:1rem;">
      <h3>📋 TEST DE ESTILO DE CRIANZA</h3>
      <p>Responde con honestidad cada pregunta. No hay respuestas "malas", solo oportunidades de aprendizaje.</p>
      
      <div style="margin:1rem 0; padding:1rem; background:#f5f5f5; border-radius:1rem;">
        <p><strong>1. Tu hijo/a tiene una rabieta en público porque quiere un juguete. Tú...</strong></p>
        <label><input type="radio" name="p1" value="0"> a) Le compro el juguete para que se calme</label><br>
        <label><input type="radio" name="p1" value="1"> b) Le grito o lo amenazo con castigo</label><br>
        <label><input type="radio" name="p1" value="2"> c) Lo tomo, me retiro del lugar y luego hablamos de su emoción</label><br>
        <label><input type="radio" name="p1" value="3"> d) Lo ignoro o le digo "no me importa"</label>
      </div>

      <div style="margin:1rem 0; padding:1rem; background:#f5f5f5; border-radius:1rem;">
        <p><strong>2. Antes de poner una norma nueva en casa, tú...</strong></p>
        <label><input type="radio" name="p2" value="0"> a) La impongo sin explicación, "porque lo digo yo"</label><br>
        <label><input type="radio" name="p2" value="1"> b) Se la explico y negocio los límites dentro de lo seguro</label><br>
        <label><input type="radio" name="p2" value="2"> c) No pongo normas para no generar conflicto</label><br>
        <label><input type="radio" name="p2" value="3"> d) Simplemente no hay normas consistentes en casa</label>
      </div>

      <div style="margin:1rem 0; padding:1rem; background:#f5f5f5; border-radius:1rem;">
        <p><strong>3. Cuando tu hijo/a logra algo importante (aunque sea pequeño), tú...</strong></p>
        <label><input type="radio" name="p3" value="0"> a) Le digo "bien, pero puedes hacerlo mejor" o lo comparo</label><br>
        <label><input type="radio" name="p3" value="1"> b) Celebro su esfuerzo específico ("me encanta cómo lo intentaste")</label><br>
        <label><input type="radio" name="p3" value="2"> c) Le doy regalos o premios materiales por todo</label><br>
        <label><input type="radio" name="p3" value="3"> d) No le presto atención, no es relevante</label>
      </div>

      <div style="margin:1rem 0; padding:1rem; background:#f5f5f5; border-radius:1rem;">
        <p><strong>4. Tu hijo/a rompe una regla importante. ¿Qué haces?</strong></p>
        <label><input type="radio" name="p4" value="0"> a) Castigo severo sin explicación</label><br>
        <label><input type="radio" name="p4" value="1"> b) Aplico una consecuencia lógica relacionada con el acto</label><br>
        <label><input type="radio" name="p4" value="2"> c) No hago nada "para no hacerle sentir mal"</label><br>
        <label><input type="radio" name="p4" value="3"> d) Me da igual, no me involucro</label>
      </div>

      <div style="margin:1rem 0; padding:1rem; background:#f5f5f5; border-radius:1rem;">
        <p><strong>5. Sobre las emociones de tu hijo/a (tristeza, miedo, enojo)...</strong></p>
        <label><input type="radio" name="p5" value="0"> a) Las minimizo ("no es para tanto", "deja de llorar")</label><br>
        <label><input type="radio" name="p5" value="1"> b) Las valido y le ayudo a nombrarlas ("veo que estás enojado")</label><br>
        <label><input type="radio" name="p5" value="2"> c) Hago todo lo posible para que no sienta emociones "negativas"</label><br>
        <label><input type="radio" name="p5" value="3"> d) Ignoro sus emociones, que se calme solo</label>
      </div>

      <div style="margin:1rem 0; padding:1rem; background:#f5f5f5; border-radius:1rem;">
        <p><strong>6. ¿Cómo manejas los límites con pantallas, TV o videojuegos?</strong></p>
        <label><input type="radio" name="p6" value="0"> a) Horario fijo y si excede, grito o castigo</label><br>
        <label><input type="radio" name="p6" value="1"> b) Horario claro pero negocio flexible si está tranquilo</label><br>
        <label><input type="radio" name="p6" value="2"> c) No hay límites, ve o juega lo que quiera</label><br>
        <label><input type="radio" name="p6" value="3"> d) No superviso lo que hace en pantallas</label>
      </div>

      <div style="margin:1rem 0; padding:1rem; background:#f5f5f5; border-radius:1rem;">
        <p><strong>7. Ante una pelea entre hermanos o amigos, tú...</strong></p>
        <label><input type="radio" name="p7" value="0"> a) Castigo a ambos sin escuchar versiones</label><br>
        <label><input type="radio" name="p7" value="1"> b) Escucho a cada uno y les ayudo a resolver juntos</label><br>
        <label><input type="radio" name="p7" value="2"> c) Dejo que se arreglen solos, aunque uno domine</label><br>
        <label><input type="radio" name="p7" value="3"> d) Me desentiendo, no es mi problema</label>
      </div>

      <div style="margin:1rem 0; padding:1rem; background:#f5f5f5; border-radius:1rem;">
        <p><strong>8. Cuando tu hijo/a se equivoca o comete un error, tú...</strong></p>
        <label><input type="radio" name="p8" value="0"> a) Lo humillo o comparo con otros niños</label><br>
        <label><input type="radio" name="p8" value="1"> b) Le ayudo a reflexionar sobre el error y cómo mejorar</label><br>
        <label><input type="radio" name="p8" value="2"> c) Le digo que no importa, que no se preocupe (sin aprendizaje)</label><br>
        <label><input type="radio" name="p8" value="3"> d) No le presto atención, que aprenda solo</label>
      </div>

      <div style="margin:1rem 0; padding:1rem; background:#f5f5f5; border-radius:1rem;">
        <p><strong>9. ¿Cómo tomas las decisiones importantes en casa?</strong></p>
        <label><input type="radio" name="p9" value="0"> a) Solo decido yo, sin preguntarles</label><br>
        <label><input type="radio" name="p9" value="1"> b) Involucro a los hijos según su edad</label><br>
        <label><input type="radio" name="p9" value="2"> c) Dejo que ellos decidan casi todo</label><br>
        <label><input type="radio" name="p9" value="3"> d) No tomo decisiones, cada quien hace lo que quiere</label>
      </div>

      <div style="margin:1rem 0; padding:1rem; background:#f5f5f5; border-radius:1rem;">
        <p><strong>10. Tu hijo/a tiene miedo o está muy triste. Tú...</strong></p>
        <label><input type="radio" name="p10" value="0"> a) Le digo que no sea débil o que "deje de llorar"</label><br>
        <label><input type="radio" name="p10" value="1"> b) Le acompaño, nombro la emoción y le ofrezco seguridad</label><br>
        <label><input type="radio" name="p10" value="2"> c) Lo distraigo rápido con algo material</label><br>
        <label><input type="radio" name="p10" value="3"> d) Lo dejo solo/a para que aprenda</label>
      </div>

      <button id="calcularTest" class="juego" style="margin-top:1rem;">📊 CALCULAR MI ESTILO DE CRIANZA</button>
      <div id="resultadoTest" style="margin-top:1.5rem;"></div>
    </div>
  `;
}

// --- FUNCIONES DE MODAL ---
function mostrarModal(titulo, contenido) {
  const modalExistente = document.querySelector(".modal");
  if (modalExistente) modalExistente.remove();
  
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">${titulo}</div>
      <div class="modal-body">${contenido}</div>
      <div class="modal-footer"><button class="cerrar-modal">Cerrar</button></div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = "flex";
  modal.querySelector(".cerrar-modal").onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

// --- FUNCIONES DE PANTALLAS ---

// =====================================================
// SIMULADOR CON 15+ ESCENARIOS POR EDAD
// =====================================================

function mostrarSimulador() {
  if (licencia.tipo !== "pro") {
    mostrarOfertaPro();
    return;
  }  
  // Banco de escenarios organizados por edad
  const escenariosPorEdad = {
    "0-2 años": [
      {
        texto: "Tu bebé de 1 año llora desconsoladamente en medio de la noche. Lleva 20 minutos llorando. ¿Qué haces?",
        opciones: [
          "Lo dejo llorar para que aprenda a dormir solo",
          "Me levanto, lo tomo en brazos, le hablo suave y lo acuno",
          "Le doy biberón aunque no tenga hambre para que se calle",
          "Me enojo y le grito que se calle"
        ],
        correcta: 1,
        feedback: "Excelente. Los bebés no lloran para manipular, lloran porque necesitan algo o compañía. El contacto y la voz suave regulan su sistema nervioso."
      },
      {
        texto: "Tu bebé de 6 meses se despierta cada 2 horas. Estás agotado/a. ¿Qué haces?",
        opciones: [
          "Lo dejo llorar hasta que se duerma solo (método 'dejar llorar')",
          "Busco ayuda para turnarme con otro adulto, reviso si tiene hambre/frío/calor o pañal sucio",
          "Le doy medicamento para que duerma",
          "Me frustro y lo ignoro"
        ],
        correcta: 1,
        feedback: "Correcto. Las interrupciones del sueño son normales en bebés. Buscar ayuda y revisar necesidades básicas es lo más respetuoso."
      }
    ],
    "3-5 años": [
      {
        texto: "Tu hijo de 4 años tiene una RABIETA en el supermercado porque no le compras un chocolate. Grita y se tira al suelo. ¿Qué haces?",
        opciones: [
          "Le compro el chocolate para que se calle (para evitar la vergüenza)",
          "Lo tomo en brazos, salgo del supermercado, me siento con él afuera, respiro y valido su emoción: 'Veo que estás muy enojado. Está bien. No te compraré el chocolate hoy. Cuando te calmes, podemos volver.'",
          "Lo dejo tirado en el suelo y me voy",
          "Le grito más fuerte que deje de hacer berrinche"
        ],
        correcta: 1,
        feedback: "Excelente. Salir del lugar, validar la emoción sin ceder al chantaje, y acompañar la rabieta es la técnica más efectiva a largo plazo."
      },
      {
        texto: "Tu hijo de 3 años NO QUIERE IR AL BAÑO. Tiene accidentes frecuentes. ¿Qué haces?",
        opciones: [
          "Lo castigo cada vez que se hace pipí encima",
          "Lo comparo con su primo que ya no usa pañal",
          "Le quito el pañal de golpe y lo siento en el baño cada 30 minutos sin preguntarle, con calma y ofreciendo premios pequeños cuando lo logra",
          "Me rindo y espero a que él solo quiera"
        ],
        correcta: 2,
        feedback: "Correcto. El control de esfínteres no se fuerza. Rutinas suaves, paciencia, premios pequeños y nunca castigar los accidentes es la clave."
      },
      {
        texto: "Tu hijo de 5 años PELEA CON OTRO NIÑO en el parque por un juguete. ¿Qué haces?",
        opciones: [
          "Le grito '¡suelta eso ahora!' y lo retiro castigado",
          "Me acerco, me arrodillo, separo suavemente y digo: 'Veo que los dos quieren el mismo juguete. ¿Cómo podemos resolverlo? ¿Primero uno y luego el otro? ¿O buscan otro juguete?'",
          "Le digo 'eres un niño malo' y me voy",
          "Lo dejo que se peleen, que aprendan solos"
        ],
        correcta: 1,
        feedback: "Perfecto. Mediar, no juzgar. Ayudarles a encontrar soluciones pacíficas les enseña habilidades sociales."
      },
      {
        texto: "Tu hijo de 3 años NO QUIERE VESTIRSE por la mañana. Tienes prisa por llevarlo al jardín. ¿Qué haces?",
        opciones: [
          "Lo visto a la fuerza mientras grita",
          "Le das dos opciones: '¿quieres ponerte la camisa roja o la azul? ¿Te vistes tú o te ayudo?' y usas un temporizador: 'a ver si terminamos antes de que suene el timer'",
          "Le dices 'si no te vistes, te quedas en casa solo'",
          "Te rindes y lo llevas en pijama"
        ],
        correcta: 1,
        feedback: "Excelente. Las opciones limitadas y el juego (timer) convierten una lucha en algo manejable."
      }
    ],
    "6-12 años": [
      {
        texto: "Tu hijo de 8 años NO QUIERE HACER LA TAREA. Se queja, se distrae, llora. ¿Qué haces?",
        opciones: [
          "Le grito 'si no haces la tarea, te quito la tablet para siempre'",
          "Le sientas contigo, divides la tarea en partes pequeñas, usas un timer ('15 minutos de tarea, luego 5 de descanso') y ofreces ayuda sin hacerla por él",
          "Hago la tarea yo para que termine rápido",
          "Lo dejo, total la maestra le pondrá mala nota"
        ],
        correcta: 1,
        feedback: "Correcto. Dividir en partes, timer y acompañamiento sin sobreproteger es la técnica más efectiva."
      },
      {
        texto: "Tu hija de 10 años VIENE TRISTE DE LA ESCUELA, no quiere hablar. ¿Qué haces?",
        opciones: [
          "La presiono: 'dime qué pasó ahora mismo'",
          "Le digo 'no estés triste, seguro no es para tanto'",
          "Le ofrezco un abrazo, le digo 'cuando quieras hablar, estoy aquí', y la acompaño en silencio si quiere",
          "La castigo por estar de mal humor"
        ],
        correcta: 2,
        feedback: "Perfecto. A veces solo necesitan compañía, no palabras. Respetar su timing es validación."
      }
    ],
    "Adolescentes 13+": [
      {
        texto: "Tu hijo adolescente de 15 años LLEGA TARDE A CASA SIN AVISAR (1 hora tarde). ¿Qué haces?",
        opciones: [
          "Le grito, le quitas el celular por un mes y le prohíbes salir",
          "Lo esperas en la puerta, respiras, y dices: 'Me preocupé mucho. Hablemos mañana con calma sobre qué pasó y cómo evitar que vuelva a pasar. También hablaremos de una consecuencia lógica juntos.'",
          "No le dices nada, total ya llegó",
          "Revisas su celular para ver con quién estaba"
        ],
        correcta: 1,
        feedback: "Excelente. Abordar con calma, expresar preocupación no enojo, y acordar consecuencias juntos fortalece la responsabilidad."
      },
      {
        texto: "Tu hijo adolescente te dice: '¡LOS ODIO! ¡NO ME ENTIENDEN!' y se encierra en su habitación. ¿Qué haces?",
        opciones: [
          "Le gritas '¡con esa boca no me hablas!' y le quitas la puerta",
          "Le dices en voz baja desde afuera: 'Veo que estás muy enojado. Está bien. Cuando quieras hablar, voy a estar aquí para escucharte sin juzgar.' Luego le dejas espacio.",
          "Rompes la puerta para enfrentarlo",
          "Lo ignoras completamente por días"
        ],
        correcta: 1,
        feedback: "Correcto. Validar su emoción, ofrecer puente sin forzar, y respetar su necesidad de espacio construye confianza."
      }
    ],
    "Situaciones especiales": [
      {
        texto: "Tu hijo te miente sobre haber hecho la tarea. Descubres la mentira. ¿Qué haces?",
        opciones: [
          "Lo castigas sin salir un mes por mentiroso",
          "Dices: 'Sé que no hiciste la tarea. Me preocupa que hayas mentido. ¿Qué te impidió hacerla? ¿Necesitas ayuda? Hablemos de cómo podemos solucionarlo. Las mentiras no ayudan, pero entiendo que a veces da miedo decir la verdad. Estoy aquí para ayudarte.'",
          "Le dices 'eres un mentiroso' y no le vuelves a creer nada",
          "Lo ignoras, ya pasará"
        ],
        correcta: 1,
        feedback: "Excelente. Abordar la mentira sin humillar, buscar la causa y mantener la conexión es más efectivo que el castigo."
      },
      {
        texto: "Tu hijo rompe algo valioso sin querer (un jarrón). ¿Qué haces?",
        opciones: [
          "Le gritas '¡siempre rompes todo!' y lo castigas",
          "Respiras, dices: 'Fue un accidente. Lo importante es que no te lastimaste. ¿Cómo podemos limpiar esto juntos? La próxima podemos jugar en un espacio más seguro.'",
          "Le dices 'no importa' y limpias tú solo",
          "Le cobras el valor del jarrón de su mesada"
        ],
        correcta: 1,
        feedback: "Perfecto. Separar el accidente de la intención, enseñar a reparar sin humillar, y aprender juntos."
      },
      {
        texto: "Tu hijo no quiere compartir un juguete con su hermana. ¿Qué haces?",
        opciones: [
          "Le quitas el juguete y se lo das a la hermana",
          "Le dices 'entiendo que no quieras compartir ahora. Es tu turno. ¿Cuántos minutos más quieres jugar antes de darle su turno a tu hermana?' (usas timer)",
          "Le dices 'eres egoísta' y lo castigas",
          "Ignoras la pelea"
        ],
        correcta: 1,
        feedback: "Excelente. Enseñar turnos, no compartir forzado. Respetar la posesión y negociar tiempos."
      }
    ]
  };

  let edadSeleccionada = "3-5 años";
  let escenarioActual = 0;
  let puntajeSimulador = 0;
  let escenarios = [...escenariosPorEdad["3-5 años"]];

  function cargarSelectorEdad() {
    return `
      <div style="margin:1rem 0; display:flex; gap:0.5rem; flex-wrap:wrap;">
        <button class="btn-edad-simulador" data-edad="0-2 años" style="background:${edadSeleccionada==='0-2 años'?'#4CAF50':'#ddd'}; border:none; padding:8px 16px; border-radius:20px; cursor:pointer;">🍼 0-2 años</button>
        <button class="btn-edad-simulador" data-edad="3-5 años" style="background:${edadSeleccionada==='3-5 años'?'#4CAF50':'#ddd'}; border:none; padding:8px 16px; border-radius:20px; cursor:pointer;">🧸 3-5 años</button>
        <button class="btn-edad-simulador" data-edad="6-12 años" style="background:${edadSeleccionada==='6-12 años'?'#4CAF50':'#ddd'}; border:none; padding:8px 16px; border-radius:20px; cursor:pointer;">📚 6-12 años</button>
        <button class="btn-edad-simulador" data-edad="Adolescentes 13+" style="background:${edadSeleccionada==='Adolescentes 13+'?'#4CAF50':'#ddd'}; border:none; padding:8px 16px; border-radius:20px; cursor:pointer;">🌟 Adolescentes 13+</button>
        <button class="btn-edad-simulador" data-edad="Situaciones especiales" style="background:${edadSeleccionada==='Situaciones especiales'?'#4CAF50':'#ddd'}; border:none; padding:8px 16px; border-radius:20px; cursor:pointer;">🌀 Especiales</button>
      </div>
    `;
  }

  function cargarEscenario() {
    if (escenarioActual >= escenarios.length) {
      const porcentaje = Math.round((puntajeSimulador / escenarios.length) * 100);
      let mensajeFinal = "";
      if (porcentaje >= 80) mensajeFinal = "🏆 ¡Excelente! Eres un experto en crianza respetuosa. Sigue así.";
      else if (porcentaje >= 60) mensajeFinal = "🌟 ¡Muy bien! Vas por buen camino. Sigue practicando.";
      else mensajeFinal = "🌱 Estás aprendiendo. Cada error es oportunidad para crecer. ¡Sigue adelante!";
      
      document.getElementById("simuladorContainer").innerHTML = `
        <div style="text-align:center">
          <h3>🎉 Simulador completado</h3>
          <p>Tu puntaje: ${puntajeSimulador}/${escenarios.length} (${porcentaje}%)</p>
          <p>${mensajeFinal}</p>
          <button id="reiniciarSimulador" class="juego">🔄 Volver a intentar</button>
          <button id="cambiarEdadSimulador" class="juego">📅 Cambiar edad</button>
        </div>
      `;
      document.getElementById("reiniciarSimulador")?.addEventListener("click", () => {
        escenarioActual = 0;
        puntajeSimulador = 0;
        cargarEscenario();
      });
      document.getElementById("cambiarEdadSimulador")?.addEventListener("click", () => {
        mostrarSimulador();
      });
      return;
    }
    
    const esc = escenarios[escenarioActual];
    let opcionesHtml = "";
    esc.opciones.forEach((op, idx) => {
      const letra = String.fromCharCode(65+idx);
      opcionesHtml += `
        <button class="opcion-simulador" data-idx="${idx}" style="display:block; width:100%; margin:8px 0; padding:12px; background:#f0f0f0; border:none; border-radius:12px; text-align:left; cursor:pointer; transition:0.2s;">
          <strong>${letra}.</strong> ${op}
        </button>
      `;
    });
    
    document.getElementById("simuladorContainer").innerHTML = `
      <div class="progreso-simulador" style="margin:1rem 0;">
        <div style="background:#e0e0e0; border-radius:1rem; height:8px;">
          <div style="background:#4CAF50; width:${(escenarioActual/escenarios.length)*100}%; height:8px; border-radius:1rem;"></div>
        </div>
        <p style="margin-top:0.5rem;">Escenario ${escenarioActual+1} de ${escenarios.length} | Puntaje: ${puntajeSimulador}</p>
      </div>
      <h3>📋 ${esc.texto}</h3>
      <div id="opcionesSimulador">${opcionesHtml}</div>
      <div id="feedbackSimulador" style="margin-top:1rem;"></div>
    `;
    
    document.querySelectorAll(".opcion-simulador").forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute("data-idx"));
        const feedbackDiv = document.getElementById("feedbackSimulador");
        const todasOpciones = document.querySelectorAll(".opcion-simulador");
        todasOpciones.forEach(opt => opt.style.opacity = "0.6");
        
        if (idx === esc.correcta) {
          puntajeSimulador++;
          feedbackDiv.innerHTML = `<div style="background:#c8e6c9; padding:15px; border-radius:12px;">✅ <strong>¡Correcto!</strong> ${esc.feedback}</div>`;
          btn.style.background = "#4CAF50";
          btn.style.color = "white";
        } else {
          feedbackDiv.innerHTML = `<div style="background:#ffcdd2; padding:15px; border-radius:12px;">❌ <strong>Incorrecto.</strong> La mejor opción era: <br><br> <strong>${String.fromCharCode(65+esc.correcta)}.</strong> ${esc.opciones[esc.correcta]}<br><br>${esc.feedback}</div>`;
          btn.style.background = "#f44336";
          btn.style.color = "white";
          document.querySelectorAll(".opcion-simulador")[esc.correcta].style.background = "#4CAF50";
          document.querySelectorAll(".opcion-simulador")[esc.correcta].style.color = "white";
        }
        
        setTimeout(() => {
          escenarioActual++;
          cargarEscenario();
        }, 3500);
      };
    });
  }

  function cambiarEdad(edad) {
    edadSeleccionada = edad;
    escenarios = [...escenariosPorEdad[edad]];
    escenarioActual = 0;
    puntajeSimulador = 0;
    const edadSelectorHtml = cargarSelectorEdad();
    document.getElementById("selectorEdadContainer").innerHTML = edadSelectorHtml;
    cargarEscenario();
    
    document.querySelectorAll(".btn-edad-simulador").forEach(btn => {
      btn.onclick = (e) => {
        cambiarEdad(btn.getAttribute("data-edad"));
      };
    });
  }

  const simuladorHtml = `
    <div class="card" style="max-width:800px; margin:0 auto;">
      <h2>🎭 Simulador de escenarios de crianza</h2>
      <p>Elige la edad de tu hijo/a y practica cómo responder en situaciones reales.</p>
      <div id="selectorEdadContainer">${cargarSelectorEdad()}</div>
      <div id="simuladorContainer" style="min-height:400px;"></div>
      <button id="cerrarSimulador" class="juego" style="margin-top:1rem;">✖️ Cerrar simulador</button>
    </div>
  `;
  
  document.getElementById("contenido").innerHTML = simuladorHtml;
  cargarEscenario();
  
  document.querySelectorAll(".btn-edad-simulador").forEach(btn => {
    btn.onclick = (e) => {
      cambiarEdad(btn.getAttribute("data-edad"));
    };
  });
  
  document.getElementById("cerrarSimulador").onclick = mostrarPantallaPrincipal;
}

// =====================================================
// GRÁFICOS DE PROGRESO VISUALES
// =====================================================

function mostrarEstadisticas() {
  if (licencia.tipo !== "pro") {
    mostrarOfertaPro();
    return;
  }  
  const completados = cursoEstado.completados.length;
  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const completadosPorModulo = [0, 0, 0, 0];
  
  // Calcular completados por módulo
  for (let dia = 1; dia <= 28; dia++) {
    const modulo = Math.floor((dia - 1) / 7);
    if (cursoEstado.completados.includes(dia)) {
      completadosPorModulo[modulo]++;
    }
  }
  
  // Preparar datos para gráfico de barras
  let barrasModulos = "";
  const nombresModulos = ["Fundamentos", "Habilidades prácticas", "Situaciones específicas", "Maestría parental"];
  const coloresModulos = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"];
  
  for (let i = 0; i < 4; i++) {
    const porcentaje = (completadosPorModulo[i] / 7) * 100;
    barrasModulos += `
      <div style="margin:1rem 0;">
        <div style="display:flex; justify-content:space-between;">
          <span><strong>${nombresModulos[i]}</strong></span>
          <span>${completadosPorModulo[i]}/7 días</span>
        </div>
        <div style="background:#e0e0e0; border-radius:1rem; height:20px; overflow:hidden;">
          <div style="background:${coloresModulos[i]}; width:${porcentaje}%; height:20px; border-radius:1rem; transition:width 0.5s;"></div>
        </div>
      </div>
    `;
  }
  
  // Datos para gráfico de racha (últimos 7 días)
  const ultimaSemana = [];
  const hoy = new Date();
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(hoy.getDate() - i);
    const fechaStr = fecha.toDateString();
    const completo = cursoEstado.ultimoCompletado === fechaStr;
    ultimaSemana.push({ dia: diasSemana[fecha.getDay()], completo });
  }
  
  let rachaHtml = `<div style="display:flex; justify-content:space-around; margin:1rem 0; gap:0.5rem;">`;
  ultimaSemana.forEach(dia => {
    rachaHtml += `
      <div style="text-align:center; flex:1;">
        <div style="background:${dia.completo ? '#4CAF50' : '#e0e0e0'}; width:100%; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:${dia.completo ? 'white' : '#666'};">
          ${dia.completo ? '✅' : '◻️'}
        </div>
        <div>${dia.dia}</div>
      </div>
    `;
  });
  rachaHtml += `</div>`;
  
  // Gráfico circular de progreso total
  const totalCompletados = completados;
  const porcentajeTotal = (totalCompletados / 33) * 100;
  const angulo = (porcentajeTotal / 100) * 360;
  
  const graficoCircular = `
    <div style="position:relative; width:150px; height:150px; margin:0 auto;">
      <svg viewBox="0 0 36 36" style="width:100%; height:100%; transform:rotate(-90deg);">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e0e0e0" stroke-width="3"></circle>
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4CAF50" stroke-width="3" stroke-dasharray="${porcentajeTotal * 1.39} 100" stroke-dashoffset="0" style="transition:stroke-dasharray 0.5s;"></circle>
      </svg>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center;">
        <span style="font-size:1.8rem; font-weight:bold;">${Math.round(porcentajeTotal)}%</span>
      </div>
    </div>
  `;
  
  // Medallas con iconos
  const medallasInfo = {
    primer_paso: { nombre: "Primer paso", icono: "🌱", desc: "Completaste tu primer día" },
    semana_completa: { nombre: "Semana completa", icono: "📆", desc: "7 días de compromiso" },
    racha_7: { nombre: "Racha de fuego", icono: "🔥", desc: "7 días seguidos" },
    mitad_camino: { nombre: "Mitad de camino", icono: "🧗", desc: "14 días completados" },
    cerca_meta: { nombre: "Cerca de la meta", icono: "🎯", desc: "21 días completados" },
    maestro_parental: { nombre: "Maestro parental", icono: "🏆", desc: "Curso completado" }
  };
  
  let medallasHtml = `<div style="display:flex; flex-wrap:wrap; gap:1rem; margin:1rem 0;">`;
  for (let [id, info] of Object.entries(medallasInfo)) {
    const tiene = cursoEstado.medallas.includes(id);
    medallasHtml += `
      <div style="text-align:center; flex:1; min-width:80px; opacity:${tiene ? 1 : 0.3}; filter:${tiene ? 'none' : 'grayscale(1)'};">
        <div style="font-size:2rem;">${info.icono}</div>
        <div><strong>${info.nombre}</strong></div>
        <div style="font-size:0.7rem; color:#666;">${info.desc}</div>
        ${!tiene ? '<div style="font-size:0.7rem;">🔒 Bloqueada</div>' : '✅'}
      </div>
    `;
  }
  medallasHtml += `</div>`;
  
  // Días más productivos (gráfico de barras horizontal)
  let productivosHtml = "";
  const productivos = cursoEstado.estadisticas.diasMasProductivos;
  const maxCount = Math.max(...Object.values(productivos), 1);
  for (let i = 0; i < 7; i++) {
    const count = productivos[i] || 0;
    const porcentaje = (count / maxCount) * 100;
    productivosHtml += `
      <div style="display:flex; align-items:center; margin:0.5rem 0;">
        <div style="width:80px;">${diasSemana[i]}</div>
        <div style="flex:1; background:#e0e0e0; border-radius:1rem; height:24px; overflow:hidden;">
          <div style="background:#4CAF50; width:${porcentaje}%; height:24px; border-radius:1rem; display:flex; align-items:center; justify-content:flex-end; padding-right:8px; color:white; font-size:0.8rem;">
            ${count > 0 ? count : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  const html = `
    <div class="card">
      <h2>📊 Tus estadísticas de progreso</h2>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin:1rem 0;">
        <div class="card" style="text-align:center;">
          <h3>🎯 Progreso total</h3>
          ${graficoCircular}
          <p>${totalCompletados} de 28 días completados</p>
          <p>🔥 Racha actual: <strong>${cursoEstado.racha}</strong> días</p>
        </div>
        <div class="card" style="text-align:center;">
          <h3>📅 Racha semanal</h3>
          ${rachaHtml}
          <p style="margin-top:0.5rem;">✅ Días completados esta semana</p>
        </div>
      </div>
      
      <div class="card">
        <h3>📚 Progreso por módulo</h3>
        ${barrasModulos}
      </div>
      
      <div class="card">
        <h3>🏅 Medallas desbloqueadas</h3>
        ${medallasHtml}
      </div>
      
      <div class="card">
        <h3>📈 Días más productivos</h3>
        <p>¿Qué días de la semana practicas más?</p>
        ${productivosHtml}
      </div>
      
      ${cursoEstado.diaActual > 28 ? `
      <div class="card" style="text-align:center; background:#e8f5e9;">
        <h3>🎉 ¡FELICIDADES!</h3>
        <p>Completaste los 28 días del curso.</p>
        <button id="descargarCertificadoFinal" class="juego">🎓 Descargar certificado</button>
      </div>
      ` : ''}
      
      <button id="volverEstadisticas" class="juego">🗺️ Volver al curso</button>
    </div>
  `;
  
  document.getElementById("contenido").innerHTML = html;
  
  document.getElementById("volverEstadisticas").onclick = mostrarPantallaPrincipal;
  
  const certBtn = document.getElementById("descargarCertificadoFinal");
  if (certBtn) {
    certBtn.onclick = () => {
      const certificado = `
🎓 CERTIFICADO DE FINALIZACIÓN DEL CURSO DE CRIANZA CONSciente 🎓

Fecha: ${new Date().toLocaleDateString()}

Completaste los 28 días del curso.
Racha final: ${cursoEstado.racha} días
Estilo de crianza: ${cursoEstado.estiloCrianza || "No evaluado"}
Medallas obtenidas: ${cursoEstado.medallas.length}/6

¡Felicidades! Eres un ejemplo de compromiso con la crianza consciente.

"La crianza consciente no es perfección, es presencia. Tú lo lograste."

Firma: ___________________
      `;
      const blob = new Blob([certificado], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "certificado_crianza_28_dias.txt";
      link.click();
    };
  }
}
function mostrarPlanificador() {
  if (licencia.tipo !== "pro") {
    mostrarOfertaPro();
    return;
  }
  const html = `<div class="card"><h2>📅 Planificador semanal</h2><div id="planificadorContenido"><table style="width:100%; border-collapse:collapse;"><tr style="background:#4CAF50;color:white"><th>Día</th><th>Mi objetivo</th><th>✅</th><tr>${["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"].map((d,idx)=>`<tr><td>${d}</td><td><input type="text" id="plan${idx}" placeholder="Ej: Validar una emoción" style="width:100%; padding:8px;"></td><td><input type="checkbox"></td></tr>`).join('')}</table><button id="imprimirPlanificador" class="juego" style="margin-top:1rem;">🖨️ Imprimir</button><button id="guardarPlanificador" class="juego">💾 Guardar</button></div><button id="volverPlanificador" class="juego">Volver</button></div>`;
  document.getElementById("contenido").innerHTML = html;
  const planGuardado = JSON.parse(localStorage.getItem("planificadorSemanal") || "{}");
  for(let i=0;i<7;i++) if(planGuardado[i]) document.getElementById(`plan${i}`).value = planGuardado[i];
  document.getElementById("guardarPlanificador").onclick = () => { let plan={}; for(let i=0;i<7;i++) plan[i]=document.getElementById(`plan${i}`).value; localStorage.setItem("planificadorSemanal",JSON.stringify(plan)); alert("Planificador guardado!"); };
  document.getElementById("imprimirPlanificador").onclick = () => window.print();
  document.getElementById("volverPlanificador").onclick = mostrarPantallaPrincipal;
}

function mostrarConfiguracion() {
  const html = `<div class="card"><h2>⚙️ Configuración</h2><div style="margin:1rem 0;"><label><input type="checkbox" id="modoOscuroCheck" ${modoOscuro?'checked':''}> 🌙 Modo oscuro</label></div><div style="margin:1rem 0;"><label><input type="checkbox" id="vozActivaCheck" ${vozActiva?'checked':''}> 🔊 Modo lectura con voz</label></div><div style="margin:1rem 0;"><button id="solicitarNotificaciones" class="juego">🔔 Activar recordatorios</button></div><div style="margin:1rem 0;"><button id="resetearProgreso" class="juego" style="background:#f44336;">⚠️ Resetear todo el progreso</button></div><button id="volverConfig" class="juego">Volver</button></div>`;
  document.getElementById("contenido").innerHTML = html;
  document.getElementById("modoOscuroCheck").onchange = (e) => { modoOscuro = e.target.checked; guardarProgreso(); location.reload(); };
  document.getElementById("vozActivaCheck").onchange = (e) => { vozActiva = e.target.checked; guardarProgreso(); };
  document.getElementById("solicitarNotificaciones").onclick = () => { if("Notification" in window) Notification.requestPermission(); else alert("Tu navegador no soporta notificaciones"); };
  document.getElementById("resetearProgreso").onclick = () => { if(confirm("¿Borrar todo tu progreso? No se puede deshacer.")){ localStorage.clear(); location.reload(); } };
  document.getElementById("volverConfig").onclick = mostrarPantallaPrincipal;
}

function mostrarRevisar() {
  let reflexiones = JSON.parse(localStorage.getItem("reflexionesDias") || "{}");
  let html = `<div class="card"><h2>📋 Días completados</h2>`;
  if (cursoEstado.completados.length === 0) {
    html += `<p>Aún no has completado ningún día. ¡Empieza con el Día 1!</p>`;
  } else {
    html += `<div class="grid-2">`;
    for (let dia of cursoEstado.completados.sort((a,b)=>a-b)) {
      let reflexion = reflexiones[dia] || "Sin reflexión guardada";
      html += `<div class="dia-card"><strong>✅ Día ${dia}: ${lecciones[dia]?.titulo}</strong><p><em>Reflexión:</em> ${reflexion.substring(0,100)}${reflexion.length>100?'...':''}</p><button class="btn-ver-dia-revisar" data-dia="${dia}" class="btn-dia">Ver lección completa</button></div>`;
    }
    html += `</div>`;
  }
  html += `<button id="volverMapaRevisar" class="juego">🗺️ Volver al curso</button></div>`;
  document.getElementById("contenido").innerHTML = html;
  document.querySelectorAll(".btn-ver-dia-revisar").forEach(btn => { btn.onclick = () => mostrarLeccion(parseInt(btn.getAttribute("data-dia"))); });
  document.getElementById("volverMapaRevisar").onclick = mostrarPantallaPrincipal;
}

// ===== BIBLIOTECA DE RECURSOS CON MODALES =====
function mostrarRecursos() {
  const html = `
    <div class="card">
      <h2>🧰 Biblioteca de recursos</h2>
      <p>Haz clic en cualquier recurso para verlo con detalle y buen formato.</p>
      <div class="grid-2">
        <div class="card"><h3>📜 10 Mandamientos</h3><p>Los principios base de la crianza positiva.</p><button id="recMandamientos" class="btn-dia">Ver recurso</button></div>
        <div class="card"><h3>🧩 4 Pilares</h3><p>Los cimientos de un hogar saludable.</p><button id="recPilares" class="btn-dia">Ver recurso</button></div>
        <div class="card"><h3>⚡ 9 Pasos para rabietas</h3><p>Protocolo para manejar crisis emocionales.</p><button id="recRabieta" class="btn-dia">Ver recurso</button></div>
        <div class="card"><h3>🔑 5 Reglas de oro</h3><p>Reglas simples para recordar cada día.</p><button id="recReglas" class="btn-dia">Ver recurso</button></div>
        <div class="card"><h3>🎭 Estilos de crianza</h3><p>Tabla comparativa de los 4 estilos.</p><button id="recEstilos" class="btn-dia">Ver recurso</button></div>
        <div class="card"><h3>💬 Frases clave</h3><p>Frases para usar en el día a día.</p><button id="recFrases" class="btn-dia">Ver recurso</button></div>
        <div class="card"><h3>🧘 Autocuidado del adulto</h3><p>Estrategias para cuidarte mientras crías.</p><button id="recAutocuidado" class="btn-dia">Ver recurso</button></div>
        <div class="card"><h3>📊 Test de estilo</h3><p>Descubre tu estilo de crianza.</p><button id="recTest" class="btn-dia">Hacer test</button></div>
      </div>
      <button id="volverRecursos" class="juego" style="margin-top:1rem;">🗺️ Volver al curso</button>
    </div>
  `;
  
  document.getElementById("contenido").innerHTML = html;
  
  document.getElementById("recMandamientos").onclick = () => mostrarModal("📜 Los 10 Mandamientos de la Crianza Positiva", `
    <ol style="margin-left:1rem;">
      <li><strong>🔗 CONECTA ANTES DE CORREGIR</strong> - El vínculo es la base. Un niño conectado escucha mejor.</li>
      <li><strong>👂 ESCUCHA SIN JUZGAR</strong> - Valida la emoción primero, luego aborda el comportamiento.</li>
      <li><strong>🧱 PON LÍMITES FIRMES PERO AMABLES</strong> - No necesitas gritar para ser firme.</li>
      <li><strong>💖 VALIDA TODAS LAS EMOCIONES</strong> - Ninguna emoción es mala, solo algunas acciones.</li>
      <li><strong>🤐 NO PEGUES, NO GRITES</strong> - La violencia genera más violencia y daña el vínculo.</li>
      <li><strong>👑 SÉ EL EJEMPLO QUE QUIERES VER</strong> - Los niños aprenden de lo que haces, no de lo que dices.</li>
      <li><strong>🐢 CADA NIÑO TIENE SU RITMO</strong> - No compares. Respeta los tiempos de desarrollo.</li>
      <li><strong>🎮 EL JUEGO ES EL MEJOR APRENDIZAJE</strong> - A través del juego se conecta y se enseña.</li>
      <li><strong>🌟 EL ERROR ES OPORTUNIDAD</strong> - No castigues, enseña. El error bien manejado construye resiliencia.</li>
      <li><strong>🧘 CUIDATE PARA PODER CUIDAR</strong> - El autocuidado no es egoísmo, es la base.</li>
    </ol>
    <p style="margin-top:1rem;">📌 <em>"Primero conecto, luego corrijo"</em></p>
  `);
  
  document.getElementById("recPilares").onclick = () => mostrarModal("🧩 Los 4 Pilares del Hogar", `
    <h4>🏠 Pilar 1: VÍNCULO SEGURO</h4>
    <p>El niño sabe que puede contar contigo. Se construye con presencia, contacto físico, respuesta consistente.</p>
    <h4>🗣️ Pilar 2: COMUNICACIÓN RESPETUOSA</h4>
    <p>Escuchar activamente, hablar sin etiquetas, usar mensajes "yo siento" en lugar de "tú eres".</p>
    <h4>🔒 Pilar 3: LÍMITES CLAROS</h4>
    <p>Normas predecibles, consecuencias lógicas, no negociables en temas de seguridad y salud.</p>
    <h4>🧘 Pilar 4: AUTOCUIDADO DEL ADULTO</h4>
    <p>No puedes dar lo que no tienes. Un adulto agotado o irritable no puede regular a un niño.</p>
    <p style="margin-top:1rem;">💡 <em>"No puedo llenar su vaso si el mío está vacío"</em></p>
  `);
  
  document.getElementById("recRabieta").onclick = () => mostrarModal("⚡ 9 Pasos para Manejar una Rabieta", `
    <ol style="margin-left:1rem;">
      <li><strong>Respira</strong> - Regúlate primero tú.</li>
      <li><strong>Arrodíllate</strong> - Ponte a su altura visual.</li>
      <li><strong>Nombra la emoción</strong> - "Veo que estás muy enojado"</li>
      <li><strong>Valida sin ceder</strong> - "Está bien estar enojado, pero no se pega"</li>
      <li><strong>Ofrece calma física</strong> - Un abrazo si lo acepta.</li>
      <li><strong>Espera a que pase el pico</strong> - No razones en el momento álgido.</li>
      <li><strong>Límite breve</strong> - "Cuando te calmes, hablamos"</li>
      <li><strong>Redirige</strong> - Ofrece una alternativa.</li>
      <li><strong>Reconecta</strong> - Después de la tormenta, vuelve al vínculo.</li>
    </ol>
    <p>💡 <em>La rabieta no es una emergencia. Es una oportunidad para enseñar regulación.</em></p>
  `);
  
  document.getElementById("recReglas").onclick = () => mostrarModal("🔑 5 Reglas de Oro para la Crianza", `
    <ol style="margin-left:1rem;">
      <li><strong>No negociar la seguridad</strong> - Cinturón, casco, cruzar la calle = innegociables.</li>
      <li><strong>Tu calma es su ancla</strong> - Si tú te desregulas, él también.</li>
      <li><strong>Sígueles la pista a la emoción</strong> - Detrás de cada conducta hay una emoción.</li>
      <li><strong>El ejemplo siempre enseña</strong> - Tus acciones hablan más fuerte que tus palabras.</li>
      <li><strong>Cada día es nuevo</strong> - Los errores de ayer no definen el mañana.</li>
    </ol>
  `);
  
  document.getElementById("recEstilos").onclick = () => mostrarModal("🎭 Los 4 Estilos de Crianza", `
    <table style="width:100%; border-collapse:collapse; margin:1rem 0;">
      <tr><th style="border:1px solid #ddd; padding:8px;">Estilo</th><th style="border:1px solid #ddd; padding:8px;">Afecto</th><th style="border:1px solid #ddd; padding:8px;">Control</th><th style="border:1px solid #ddd; padding:8px;">Resultado</th></tr>
      <tr><td style="border:1px solid #ddd; padding:8px;">🔴 Autoritario</td><td style="border:1px solid #ddd; padding:8px;">Bajo</td><td style="border:1px solid #ddd; padding:8px;">Alto</td><td style="border:1px solid #ddd; padding:8px;">Miedo, baja autoestima</td></tr>
      <tr style="background:#e8f5e9;"><td style="border:1px solid #ddd; padding:8px;">🟢 Democrático</td><td style="border:1px solid #ddd; padding:8px;">Alto</td><td style="border:1px solid #ddd; padding:8px;">Alto (flexible)</td><td style="border:1px solid #ddd; padding:8px;">Seguro, autónomo, feliz</td></tr>
      <tr><td style="border:1px solid #ddd; padding:8px;">🟡 Permisivo</td><td style="border:1px solid #ddd; padding:8px;">Alto</td><td style="border:1px solid #ddd; padding:8px;">Bajo</td><td style="border:1px solid #ddd; padding:8px;">Sin límites, frustración</td></tr>
      <tr><td style="border:1px solid #ddd; padding:8px;">⚫ Negligente</td><td style="border:1px solid #ddd; padding:8px;">Bajo</td><td style="border:1px solid #ddd; padding:8px;">Bajo</td><td style="border:1px solid #ddd; padding:8px;">Abandono, inseguridad</td></tr>
    </table>
    <p>💡 <em>El estilo DEMOCRÁTICO es el recomendado: límites claros + calidez emocional</em></p>
  `);
  
  document.getElementById("recFrases").onclick = () => mostrarModal("💬 Frases Clave para Usar cada Día", `
    <div style="background:#fff8e1; padding:1rem; border-left:4px solid #ffc107; margin:0.5rem 0; border-radius:8px;">"Veo que estás enojado. Está bien sentirlo. Estoy aquí contigo."</div>
    <div style="background:#fff8e1; padding:1rem; border-left:4px solid #ffc107; margin:0.5rem 0; border-radius:8px;">"Te quiero aunque te equivoques. El error nos ayuda a aprender."</div>
    <div style="background:#fff8e1; padding:1rem; border-left:4px solid #ffc107; margin:0.5rem 0; border-radius:8px;">"Los límites no son un castigo, son para protegerte."</div>
    <div style="background:#fff8e1; padding:1rem; border-left:4px solid #ffc107; margin:0.5rem 0; border-radius:8px;">"No puedo llenar tu vaso si el mío está vacío. Me tomo un momento."</div>
    <div style="background:#fff8e1; padding:1rem; border-left:4px solid #ffc107; margin:0.5rem 0; border-radius:8px;">"¿Cómo te sientes? Nombremos esa emoción juntos."</div>
    <div style="background:#fff8e1; padding:1rem; border-left:4px solid #ffc107; margin:0.5rem 0; border-radius:8px;">"Confío en ti. Tú puedes hacerlo."</div>
  `);
  
  document.getElementById("recAutocuidado").onclick = () => mostrarModal("🧘 Autocuidado para el Adulto Cuidador", `
    <h4>🌿 Autocuidado FÍSICO</h4>
    <p>Duerme lo que puedas, come algo que te nutra, respira profundo 3 veces antes de reaccionar.</p>
    <h4>💖 Autocuidado EMOCIONAL</h4>
    <p>Valida tus propias emociones. Está bien sentirse frustrado. Pide ayuda sin culpa.</p>
    <h4>👥 Autocuidado SOCIAL</h4>
    <p>Conecta con otros adultos. Un café con un amigo, un grupo de crianza, una llamada.</p>
    <h4>🎨 Autocuidado PERSONAL</h4>
    <p>Haz algo solo para ti 15 minutos al día: leer, caminar, ducharte tranquilo, escuchar música.</p>
    <p style="margin-top:1rem;">💡 <em>"No puedes dar lo que no tienes. Cuidarte es la mejor herencia para tus hijos."</em></p>
  `);
  
  document.getElementById("recTest").onclick = () => mostrarLeccion(1);
  document.getElementById("volverRecursos").onclick = mostrarPantallaPrincipal;
}


// =====================================================
// POLÍTICAS DE PRIVACIDAD
// =====================================================

function mostrarPoliticasPrivacidad() {
  const html = `
    <div class="card" style="max-width:800px; margin:0 auto;">
      <h2>📋 Políticas de Privacidad</h2>
      <p><strong>Última actualización:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h3>1. Información que recopilamos</h3>
      <p>En <strong>Criar con Conciencia</strong> recopilamos la siguiente información:</p>
      <ul>
        <li><strong>Correo electrónico:</strong> Para activar tu licencia y recuperar tu progreso entre dispositivos.</li>
        <li><strong>Progreso del curso:</strong> Días completados, reflexiones, medallas obtenidas y racha de práctica.</li>
        <li><strong>Preferencias:</strong> Modo oscuro, activación de voz, etc.</li>
      </ul>
      
      <h3>2. Cómo usamos tu información</h3>
      <ul>
        <li>✅ Para activar y mantener tu licencia Pro.</li>
        <li>✅ Para sincronizar tu progreso entre dispositivos.</li>
        <li>✅ Para mejorar la experiencia de usuario.</li>
        <li>✅ Para enviarte recordatorios (si activas las notificaciones).</li>
      </ul>
      
      <h3>3. Almacenamiento de datos</h3>
      <p>Tus datos se almacenan en:</p>
      <ul>
        <li><strong>Localmente:</strong> En tu dispositivo (navegador) para acceso rápido.</li>
        <li><strong>En la nube:</strong> En <strong>Firebase (Google)</strong>, una plataforma segura con estándares internacionales de seguridad.</li>
      </ul>
      
      <h3>4. Seguridad de los datos</h3>
      <p>No compartimos, vendemos ni alquilamos tu información personal a terceros. Tus datos son solo para el funcionamiento de la aplicación.</p>
      
      <h3>5. Tus derechos</h3>
      <p>Tienes derecho a:</p>
      <ul>
        <li>🗑️ Solicitar la eliminación de tus datos.</li>
        <li>✏️ Corregir información incorrecta.</li>
      </ul>
      <p>Para ejercer estos derechos, contáctanos al correo: <strong>contacto@crianzaapp.com</strong></p>
      
      <h3>6. Menores de edad</h3>
      <p>Esta aplicación está dirigida a padres y cuidadores adultos. No recopilamos información directamente de menores de edad.</p>
      
      <h3>7. Cambios en esta política</h3>
      <p>Podemos actualizar esta política ocasionalmente. Te notificaremos dentro de la aplicación.</p>
      
      <h3>8. Contacto</h3>
      <p>Si tienes preguntas sobre esta política, contáctanos:</p>
      <ul>
        <li>📧 Email: <strong>hdzlecter@gmail.com</strong></li>
      </ul>
      
      <button id="volverDesdePoliticas" class="juego" style="margin-top:1rem;">🗺️ Volver al curso</button>
    </div>
  `;
  
  document.getElementById("contenido").innerHTML = html;
  
  document.getElementById("volverDesdePoliticas")?.addEventListener("click", () => {
    if (licencia.tipo === "pro") {
      mostrarPantallaPrincipal();
    } else {
      mostrarPantallaReingreso();
    }
  });
}

// =====================================================
// TÉRMINOS Y CONDICIONES
// =====================================================

function mostrarTerminosCondiciones() {
  const html = `
    <div class="card" style="max-width:800px; margin:0 auto;">
      <h2>📜 Términos y Condiciones</h2>
      <p><strong>Última actualización:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h3>1. Aceptación de los términos</h3>
      <p>Al utilizar <strong>Criar con Conciencia</strong>, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo, por favor no uses la aplicación.</p>
      
      <h3>2. Licencias y pagos</h3>
      <ul>
        <li><strong>Modo Demo:</strong> Acceso gratuito a los primeros 7 días del curso.</li>
        <li><strong>Licencia Pro:</strong> Acceso completo a los 33 días del curso por <strong>$199 MXN por año</strong>.</li>
        <li>La licencia es <strong>personal e intransferible</strong>, pero puede usarse en múltiples dispositivos del mismo usuario.</li>
        <li>Los pagos son no reembolsables.</li>
      </ul>
      
      <h3>3. Códigos de licencia</h3>
      <ul>
        <li>Los códigos de licencia son de <strong>un solo uso</strong>.</li>
        <li>Una vez activados, quedan asociados permanentemente al correo electrónico ingresado.</li>
        <li>No compartas tu código con otras personas.</li>
      </ul>
      
      <h3>4. Uso permitido</h3>
      <p>La aplicación está diseñada para:</p>
      <ul>
        <li>✅ Padres y cuidadores que buscan herramientas de crianza consciente.</li>
        <li>✅ Profesionales de la psicología y educación (uso personal o con pacientes).</li>
      </ul>
      
      <h3>5. Uso no permitido</h3>
      <ul>
        <li>❌ Compartir códigos de licencia con no pagantes.</li>
        <li>❌ Intentar extraer, copiar o distribuir el contenido del curso sin autorización.</li>
        <li>❌ Usar la aplicación para fines ilegales.</li>
      </ul>
      
      <h3>6. Limitación de responsabilidad</h3>
      <p><strong>Criar con Conciencia</strong> es una herramienta educativa, no sustituye el consejo de un profesional de la salud mental o pediatría. Los resultados pueden variar según cada familia.</p>
      
      <h3>7. Cancelación</h3>
      <ul>
        <li>Puedes cancelar tu suscripción en cualquier momento.</li>
        <li>No se realizan reembolsos por tiempo no utilizado.</li>
        <li>Si experimentas problemas técnicos, contáctanos dentro de los primeros 7 días para resolverlos.</li>
      </ul>
      
      <h3>8. Modificaciones</h3>
      <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados dentro de la aplicación.</p>
      
      <h3>9. Contacto</h3>
      <p>Para cualquier consulta sobre estos términos:</p>
      <ul>
        <li>📧 Email: <strong>hdzlecter@gmail.com</strong></li>
      </ul>
      
      <h3>10. Legislación aplicable</h3>
      <p>Estos términos se rigen por las leyes de los Estados Unidos Mexicanos.</p>
      
      <button id="volverDesdeTerminos" class="juego" style="margin-top:1rem;">🗺️ Volver al curso</button>
    </div>
  `;
  
  document.getElementById("contenido").innerHTML = html;
  
  document.getElementById("volverDesdeTerminos")?.addEventListener("click", () => {
    if (licencia.tipo === "pro") {
      mostrarPantallaPrincipal();
    } else {
      mostrarPantallaReingreso();
    }
  });
}
// =====================================================
// FUNCIÓN DE BANNER DEMO (FALTANTE)
// =====================================================

function mostrarBannerDemo() {
  if (licencia.tipo !== "pro") {
    return `
      <div class="card" style="background:linear-gradient(135deg, #fff3e0, #ffe0b2); border-left:4px solid #ff9800; margin-bottom:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
          <div>
            <span style="font-size:1.5rem;">🔓</span>
            <strong>Modo Demo</strong> - Acceso gratuito a los primeros 7 días
          </div>
          <button id="btnUpgradePro" class="juego" style="background:#ff9800; padding:8px 16px;">⬆️ Pro por $59 MXN/año</button>
        </div>
        <p style="margin-top:0.5rem; font-size:0.8rem;">⭐ Desbloquea los 33 días completos + simulador + medallas + certificado</p>
      </div>
    `;
  }
  return `
    <div class="card" style="background:#e8f5e9; border-left:4px solid #4CAF50;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
        <div>
          <span style="font-size:1.5rem;">✅</span>
          <strong>Modo Pro activo</strong> - Tienes acceso a los 33 días completos
        </div>
        <div style="font-size:0.8rem;">${licencia.expira ? `Expira: ${new Date(licencia.expira).toLocaleDateString()}` : ''}</div>
      </div>
    </div>
  `;
}

// =====================================================
// PANTALLA DE REINGRESO (para recuperar licencia)
// =====================================================

function mostrarPantallaReingreso() {
  const html = `
    <div class="card" style="max-width:400px; margin:50px auto; text-align:center;">
      <span style="font-size:3rem;">🔐</span>
      <h2>¿Ya tienes una licencia?</h2>
      <p>Ingresa el email que usaste al activar tu licencia Pro</p>
      
      <div style="margin:1rem 0;">
        <input type="email" id="emailReingreso" placeholder="tucorreo@ejemplo.com" style="width:100%; padding:0.8rem; border-radius:1rem; border:1px solid #ccc;">
        <button id="btnReingresar" class="juego" style="margin-top:0.5rem;">🔓 Recuperar mi licencia</button>
      </div>
      
      <div style="margin:1rem 0;">
        <p>¿No tienes licencia?</p>
        <button id="btnIrAOferta" class="juego" style="background:#ff9800;">💰 Comprar Pro por $59 MXN</button>
      </div>
      
      <div id="mensajeReingreso" style="margin-top:1rem;"></div>
    </div>
  `;
  
  document.getElementById("contenido").innerHTML = html;
  
  // =====================================================
  // REASIGNAR EVENTOS DE NAVEGACIÓN CADA VEZ
  // =====================================================
  asignarEventosNavegacion();
  
  // Eventos específicos de esta pantalla
  document.getElementById("btnReingresar")?.addEventListener("click", async () => {
    const email = document.getElementById("emailReingreso").value.trim();
    const mensajeDiv = document.getElementById("mensajeReingreso");
    
    if (!email) {
      mensajeDiv.innerHTML = "<span style='color:#f44336;'>❌ Ingresa tu email</span>";
      return;
    }
    
    mensajeDiv.innerHTML = "<span style='color:#2196F3;'>⏳ Buscando licencia...</span>";
    
    try {
      const docRef = db.collection("licencias").doc(email);
      const doc = await docRef.get();
      
      if (doc.exists) {
        const data = doc.data();
        if (data.tipo === "pro" && new Date(data.expira) > new Date()) {
          licencia = {
            tipo: "pro",
            activa: true,
            expira: data.expira,
            email: email
          };
          
          localStorage.setItem("emailPro", email);
          localStorage.setItem("licenciaPro", JSON.stringify({
            tipo: licencia.tipo,
            expira: licencia.expira,
            email: licencia.email
          }));
          
          mensajeDiv.innerHTML = "<span style='color:#4CAF50;'>✅ ¡Licencia recuperada! Redirigiendo...</span>";
          setTimeout(() => {
            asignarEventosNavegacion();
            mostrarPantallaPrincipal();
          }, 1500);
        } else {
          mensajeDiv.innerHTML = "<span style='color:#f44336;'>❌ Tu licencia ha expirado. Contacta para renovar.</span>";
        }
      } else {
        mensajeDiv.innerHTML = "<span style='color:#f44336;'>❌ No encontramos una licencia activa para este email.</span>";
      }
    } catch (error) {
      console.error(error);
      mensajeDiv.innerHTML = "<span style='color:#f44336;'>❌ Error al verificar. Intenta de nuevo.</span>";
    }
  });
  
  document.getElementById("btnIrAOferta")?.addEventListener("click", () => {
    asignarEventosNavegacion();
    mostrarOfertaPro();
  });
}

// =====================================================
// FUNCIÓN CENTRAL PARA REASIGNAR EVENTOS DE NAVEGACIÓN
// =====================================================

function asignarEventosNavegacion() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    // Remover eventos anteriores para evitar duplicados
    btn.removeEventListener("click", btn._listener);
    
    // Crear nuevo evento
    const listener = () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const tab = btn.getAttribute("data-tab");
      
      if (tab === "curso") {
        mostrarPantallaPrincipal();
      } 
      else if (tab === "revisar") {
        console.log("🔄 Abriendo revisar días");
        mostrarRevisar();
      }
      else if (tab === "recursos") {
        console.log("📚 Abriendo biblioteca de recursos");
        mostrarRecursos();
      }
    };
    
    // Guardar referencia para poder remover después
    btn._listener = listener;
    btn.addEventListener("click", listener);
  });
  
  console.log("✅ Eventos de navegación asignados");
}

function mostrarPantallaPrincipal() {

  // Cargar licencia desde localStorage (rápido)
  const licenciaGuardada = localStorage.getItem("licenciaCrianza");
  if (licenciaGuardada) {
    const temp = JSON.parse(licenciaGuardada);
    licencia.tipo = temp.tipo || "demo";
    licencia.expira = temp.expira;
    licencia.email = temp.email;
    
    if (licencia.tipo === "pro" && licencia.expira && new Date(licencia.expira) < new Date()) {
      licencia.tipo = "demo";
      localStorage.removeItem("licenciaCrianza");
      localStorage.removeItem("emailLicenciaActiva");
    }
  }
  
  // Si hay email guardado, intentar sincronizar con Firestore (para otros dispositivos)
  const emailGuardado = localStorage.getItem("emailLicenciaActiva");
  if (emailGuardado && licencia.tipo !== "pro") {
    cargarLicenciaPorEmail();
  }
  const DIAS_TOTALES = 33;
  const DIAS_VISIBLES = licencia.tipo === "pro" ? 33 : 7;
  const completados = cursoEstado.completados.length;
  const progreso = Math.round((completados / (licencia.tipo === "pro" ? 33 : 7)) * 100);
  
  let html = mostrarBannerDemo();
  
  html += `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
        <h2>🗺️ Curso de crianza - ${licencia.tipo === "pro" ? "33 días" : "7 días demo"}</h2>
        <div>
          <button id="btnSimulador" class="juego" style="background:#9C27B0;">🎭 Simulador</button>
          <button id="btnEstadisticas" class="juego" style="background:#2196F3;">📊 Stats</button>
          <button id="btnPlanificador" class="juego" style="background:#FF9800;">📅 Plan</button>
          <button id="btnConfig" class="juego" style="background:#607D8B;">⚙️ Config</button>
          <button id="btnCerrarSesion" class="juego" style="background:#f44336;">🚪 Cerrar sesión</button>
        </div>
      </div>
      <div class="progreso-bar"><div class="progreso-fill" style="width:${progreso}%;">${progreso}%</div></div>
      <p>🔥 Racha: ${cursoEstado.racha} días | ✅ Completados: ${completados}/${DIAS_VISIBLES}</p>
      ${cursoEstado.estiloCrianza ? `<p>🎭 Tu estilo: ${cursoEstado.estiloCrianza}</p>` : '<p>📝 Completa el Día 1 para conocer tu estilo.</p>'}
      ${licencia.tipo === "demo" ? '<p style="color:#ff9800;">🔓 Modo demo: días 1-7 gratis. <button id="btnUpgradeDesdeBanner" class="btn-dia" style="background:#ff9800;">⬆️ Pro por $59 MXN/año</button></p>' : ''}
    </div>
  `;
  
  // Generar módulos (solo mostrar días accesibles)
  const MODULOS = licencia.tipo === "pro" ? 5 : 1;
  const DIAS_POR_MODULO = 7;
  const modNombres = licencia.tipo === "pro" 
    ? ["📘 MÓDULO 1: Fundamentos (Días 1-7)", "📙 MÓDULO 2: Habilidades prácticas (Días 8-14)", "📒 MÓDULO 3: Situaciones específicas (Días 15-21)", "📕 MÓDULO 4: Maestría parental (Días 22-28)", "📗 MÓDULO 5: Temas avanzados (Días 29-33)"]
    : ["📘 MÓDULO 1: Fundamentos (Días 1-7) - Acceso demo"];
  
  for (let modulo = 0; modulo < MODULOS; modulo++) {
    const inicio = modulo * DIAS_POR_MODULO + 1;
    let fin = Math.min(inicio + DIAS_POR_MODULO - 1, DIAS_VISIBLES);
    if (licencia.tipo === "demo") fin = Math.min(fin, 7);
    
    html += `<div class="card"><h3>${modNombres[modulo]}</h3><div class="grid-2">`;
    for (let dia = inicio; dia <= fin; dia++) {
      const completado = cursoEstado.completados.includes(dia);
      const bloqueado = dia > cursoEstado.diaActual && !completado;
      const diaBloqueadoPorLicencia = licencia.tipo === "demo" && dia > 7;
      
      html += `
        <div class="dia-card ${bloqueado || diaBloqueadoPorLicencia ? 'bloqueado' : ''}">
          ${completado ? '✅' : (bloqueado || diaBloqueadoPorLicencia ? '🔒' : '📖')} 
          <strong>Día ${dia}</strong>: ${lecciones[dia]?.titulo || `Tema ${dia}`}
          ${diaBloqueadoPorLicencia ? '<br><small>🔓 Actualiza a Pro ($59 MXN/año)</small>' : (bloqueado ? '<br><small>🔓 Completa el día anterior</small>' : (completado ? '<br><small>✔ Completado</small>' : '<br><button class="btn-dia" data-dia="'+dia+'">Ver lección</button>'))}
        </div>
      `;
    }
    html += `</div></div>`;
  }
  
  // Si es demo, mostrar bloqueo de módulos 2-5 con mensaje de upgrade
  if (licencia.tipo === "demo") {
    for (let modulo = 1; modulo < 5; modulo++) {
      const modNombresBloqueados = ["📙 MÓDULO 2: Habilidades prácticas (Días 8-14)", "📒 MÓDULO 3: Situaciones específicas (Días 15-21)", "📕 MÓDULO 4: Maestría parental (Días 22-28)", "📗 MÓDULO 5: Temas avanzados (Días 29-33)"];
      html += `
        <div class="card" style="opacity:0.6; filter:grayscale(0.3);">
          <h3>${modNombresBloqueados[modulo-1]}</h3>
          <div style="text-align:center; padding:2rem;">
            <span style="font-size:3rem;">🔒</span>
            <p>Módulo bloqueado en modo Demo</p>
            <button id="btnUpgradeModulo${modulo}" class="juego" style="background:#ff9800;">⬆️ Actualizar a Pro por $59 MXN/año</button>
          </div>
        </div>
      `;
    }
    // Agregar eventos para los botones de upgrade
    setTimeout(() => {
      for (let i = 1; i <= 4; i++) {
        const btn = document.getElementById(`btnUpgradeModulo${i}`);
        if (btn) btn.onclick = mostrarOfertaPro;
      }
    }, 100);
  }
  
  document.getElementById("contenido").innerHTML = html;
  
  document.querySelectorAll(".btn-dia").forEach(btn => {
    btn.onclick = () => {
      const dia = parseInt(btn.getAttribute("data-dia"));
      if (!puedeAccederADia(dia)) {
        mostrarOfertaPro();
        return;
      }
      mostrarLeccion(dia);
    };
  });
  
  // Eventos botones principales
  document.getElementById("btnSimulador")?.addEventListener("click", () => {
    if (licencia.tipo !== "pro") {
      mostrarOfertaPro();
      return;
    }
    mostrarSimulador();
  });
  
  document.getElementById("btnUpgradePro")?.addEventListener("click", mostrarOfertaPro);
  document.getElementById("btnUpgradeDesdeBanner")?.addEventListener("click", mostrarOfertaPro);
  
  document.getElementById("btnEstadisticas")?.addEventListener("click", () => {
    if (licencia.tipo !== "pro") {
      mostrarOfertaPro();
      return;
    }
    mostrarEstadisticas();
  });
  
  document.getElementById("btnPlanificador")?.addEventListener("click", () => {
    if (licencia.tipo !== "pro") {
      mostrarOfertaPro();
      return;
    }
    mostrarPlanificador();
  });
  document.getElementById("btnCerrarSesion")?.addEventListener("click", () => {
    localStorage.removeItem("emailPro");
    localStorage.removeItem("licenciaPro");
    location.reload();
  });  
  document.getElementById("btnConfig")?.addEventListener("click", mostrarConfiguracion);
 
  asignarEventosNavegacion();
}

function mostrarLeccion(dia) {
  // VALIDACIÓN DE LICENCIA
  if (!puedeAccederADia(dia)) {
    mostrarOfertaPro();
    return;
  }
  const lec = lecciones[dia];
  if (!lec) return;
  
  if (vozActiva) hablar(`Día ${dia}. ${lec.titulo}. ${lec.teoria.replace(/<[^>]*>/g, ' ').substring(0, 300)}`);
  
  let testHTML = "";
  if (lec.tieneTest) {
    testHTML = generarTestCompleto();
  }
  
  // Aplicar formateo adicional a la teoría por si acaso
  let teoriaFormateada = lec.teoria;
  if (!teoriaFormateada.includes("<p>") && !teoriaFormateada.includes("<ul>") && !teoriaFormateada.includes("<ol>")) {
    teoriaFormateada = formatearTeoria(teoriaFormateada);
  }
  
  const html = `
    <div class="card">
      <h2>${lec.titulo}</h2>
      <p><strong>🎯 OBJETIVO DEL DÍA:</strong> ${lec.objetivo}</p>
      <div class="progreso-bar"><div class="progreso-fill" style="width:0%;"></div></div>
      
      <h3>📖 TEORÍA</h3>
      ${teoriaFormateada}
      
      <h3>📌 2 EJEMPLOS PRÁCTICOS</h3>
      ${lec.ejemplos.map(e => `<div class="ejemplo">📖 ${e}</div>`).join('')}
      
      <h3>✏️ 3 ACTIVIDADES DEL DÍA</h3>
      ${lec.actividades.map(a => `<div class="actividad">${a}</div>`).join('')}
      
      <h3>🛠️ TÉCNICAS A UTILIZAR</h3>
      <div>${lec.tecnicas.map(t => `<span class="badge-tecnica">🔧 ${t}</span>`).join(' ')}</div>
      
      <h3>🧠 HABILIDADES A DESARROLLAR</h3>
      <div>${lec.habilidades.map(h => `<span class="badge-habilidad">⭐ ${h}</span>`).join(' ')}</div>
      
      <h3>⚠️ ERRORES COMUNES (EVÍTALOS)</h3>
      <ul>${lec.errores.map(e => `<li>${e}</li>`).join('')}</ul>
      
      <h3>💬 FRASES CLAVE PARA RECORDAR</h3>
      ${lec.frases.map(f => `<div class="frase-destacada">“${f}”</div>`).join('')}
      
      <h3>🧰 HERRAMIENTAS PARA ESTE DÍA</h3>
      <div>${lec.herramientas.map(h => `<span class="badge-herramienta">📦 ${h}</span>`).join(' ')}</div>
      
      <textarea id="reflexionDia" rows="4" placeholder="✍️ ESCRIBE TU REFLEXIÓN DEL DÍA AQUÍ... (mínimo 20 caracteres)" style="width:100%; margin:1rem 0; padding:0.8rem; border-radius:1rem; border:1px solid #ccc;"></textarea>
      <button id="completarDiaBtn" class="juego" data-dia="${dia}">✅ MARCAR DÍA ${dia} COMO COMPLETADO</button>
    </div>
    ${testHTML}
    <button id="volverMapa" class="juego">🗺️ VOLVER AL MAPA DEL CURSO</button>
  `;
  
  document.getElementById("contenido").innerHTML = html;
  
  document.getElementById("completarDiaBtn").onclick = () => {
    const reflexion = document.getElementById("reflexionDia").value;
    if (reflexion.length < 20) {
      alert("Por favor, escribe una reflexión más detallada (mínimo 20 caracteres) para integrar el aprendizaje.");
      return;
    }
    let reflexiones = JSON.parse(localStorage.getItem("reflexionesDias") || "{}");
    reflexiones[dia] = reflexion;
    localStorage.setItem("reflexionesDias", JSON.stringify(reflexiones));
    completarDia(dia);
    alert(`✅ ¡DÍA ${dia} COMPLETADO! +1 día de racha. ¡Sigue así!`);
    mostrarPantallaPrincipal();
  };
  
  document.getElementById("volverMapa").onclick = mostrarPantallaPrincipal;
  
  const testBtn = document.getElementById("calcularTest");
  if (testBtn) {
    testBtn.onclick = () => {
      let total = 0;
      for(let i=1;i<=10;i++) {
        let seleccion = document.querySelector(`input[name="p${i}"]:checked`);
        if (seleccion) total += parseInt(seleccion.value);
      }
      let estilo = "", mensaje = "";
      if (total <= 8) { estilo = "🟡 PERMISIVO"; mensaje = "Priorizas el afecto sobre los límites. Te recomendamos: agregar 1 límite claro esta semana (ej. horario de pantallas) y practicar decir 'no' con calma."; }
      else if (total <= 16) { estilo = "🔴 AUTORITARIO"; mensaje = "Usas mucho control pero poca calidez. Te recomendamos: validar una emoción al día sin juzgar, y respirar antes de castigar."; }
      else if (total <= 24) { estilo = "🟢 DEMOCRÁTICO/ASERTIVO"; mensaje = "¡Excelente equilibrio! Sigue así. Te recomendamos: compartir tu experiencia con otros padres, eres un modelo a seguir."; }
      else { estilo = "⚫ NEGLIGENTE"; mensaje = "Hay poca implicación en la crianza. Te recomendamos: dedicar 15 minutos diarios de atención plena a tu hijo, y buscar apoyo si te sientes abrumado."; }
      
      cursoEstado.estiloCrianza = estilo;
      guardarProgreso();
      document.getElementById("resultadoTest").innerHTML = `<div style="background:#e8f5e9; padding:1.5rem; border-radius:1rem;"><h3>🎭 Tu estilo de crianza es: ${estilo}</h3><p>${mensaje}</p><p><strong>Puntaje total:</strong> ${total} puntos (rango 0-30)</p><p>📌 Continúa con el <strong>Día 2</strong> para profundizar en los 10 mandamientos.</p></div>`;
    };
  }
}
// SOLO PARA PRUEBAS - eliminar en producción
// Función para activar Pro en modo prueba (sin código)
function activarLicenciaPro() {
  const expira = new Date();
  expira.setFullYear(expira.getFullYear() + 1);
  
  licencia = {
    tipo: "pro",
    activa: true,
    expira: expira.toISOString(),
    email: "prueba@demo.com"
  };
  guardarLicencia();
  guardarProgreso();
}

// =====================================================
// FUNCIÓN CENTRAL PARA REASIGNAR EVENTOS DE NAVEGACIÓN
// =====================================================

function asignarEventosNavegacion() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    // Remover eventos anteriores para evitar duplicados
    btn.removeEventListener("click", btn._listener);
    
    // Crear nuevo evento
    const listener = () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const tab = btn.getAttribute("data-tab");
      
      if (tab === "curso") {
        mostrarPantallaPrincipal();
      } 
      else if (tab === "revisar") {
        console.log("🔄 Abriendo revisar días");
        mostrarRevisar();
      }
      else if (tab === "recursos") {
        console.log("📚 Abriendo biblioteca de recursos");
        mostrarRecursos();
      }
    };
    
    // Guardar referencia para poder remover después
    btn._listener = listener;
    btn.addEventListener("click", listener);
  });
  
  console.log("✅ Eventos de navegación asignados");
}

// =====================================================
// INICIALIZACIÓN CORREGIDA - CON RECUPERACIÓN AUTOMÁTICA
// =====================================================

async function iniciarApp() {
  console.log("🚀 Iniciando aplicación...");
  
  // Verificar panel admin
  if (window.location.search.includes("admin=true")) {
    mostrarPanelAdmin();
    return;
  }
  
  // Verificar si hay email guardado
  const emailGuardado = localStorage.getItem("emailPro");
  console.log("📧 Email guardado:", emailGuardado);
  
  if (!emailGuardado) {
    // No hay email guardado → mostrar pantalla de reingreso
    console.log("🔐 No hay email guardado, mostrando pantalla de reingreso");
    mostrarPantallaReingreso();
    return;
  }
  
  // Intentar recuperar licencia automáticamente
  console.log("🔄 Recuperando licencia para:", emailGuardado);
  await recuperarLicenciaAutomatica();
  
  // Si no hay licencia Pro, intentar cargar desde backup
  if (licencia.tipo !== "pro") {
    console.log("⚠️ No se recuperó licencia Pro, buscando backup...");
    const licenciaGuardada = localStorage.getItem("licenciaPro");
    if (licenciaGuardada) {
      const temp = JSON.parse(licenciaGuardada);
      if (temp.tipo === "pro" && (!temp.expira || new Date(temp.expira) > new Date())) {
        console.log("✅ Licencia recuperada desde backup");
        licencia.tipo = "pro";
        licencia.expira = temp.expira;
        licencia.email = temp.email;
      } else {
        console.log("❌ Backup expirado o inválido, limpiando...");
        localStorage.removeItem("licenciaPro");
        localStorage.removeItem("emailPro");
      }
    }
  }
  
  // Si después de todo no hay licencia Pro, mostrar reingreso
  if (licencia.tipo !== "pro") {
    console.log("🔐 No hay licencia activa, mostrando pantalla de reingreso");
    mostrarPantallaReingreso();
    return;
  }
  
  // Cargar progreso del curso
  cargarProgreso();
  
  // Mostrar pantalla principal
  mostrarPantallaPrincipal();
  
  // Asignar eventos de navegación
  asignarEventosNavegacion();
  
  // Eventos para footer (Políticas y Términos)
  const linkPoliticas = document.getElementById("linkPoliticas");
  const linkTerminos = document.getElementById("linkTerminos");
  
  if (linkPoliticas) {
    linkPoliticas.onclick = (e) => {
      e.preventDefault();
      mostrarPoliticasPrivacidad();
    };
  }
  
  if (linkTerminos) {
    linkTerminos.onclick = (e) => {
      e.preventDefault();
      mostrarTerminosCondiciones();
    };
  }  
}

// =====================================================
// FUNCIONES DE PROGRESO LOCAL
// =====================================================

function cargarProgreso() {
  const guardado = localStorage.getItem("cursoCrianzaProfesional");
  if (guardado) {
    const temp = JSON.parse(guardado);
    cursoEstado = {
      diaActual: temp.diaActual || 1,
      completados: temp.completados || [],
      estiloCrianza: temp.estiloCrianza || null,
      racha: temp.racha || 0,
      ultimoCompletado: temp.ultimoCompletado || null,
      medallas: temp.medallas || [],
      estadisticas: temp.estadisticas || { 
        tiempoTotalMinutos: 0, 
        ultimoAcceso: null, 
        diasMasProductivos: {} 
      }
    };
  }
}

function guardarProgreso() {
  localStorage.setItem("cursoCrianzaProfesional", JSON.stringify(cursoEstado));
  guardarProgresoFirebase(); // Sincronizar con Firebase si está activo
}

// =====================================================
// RECUPERAR LICENCIA POR EMAIL (para otros dispositivos)
// =====================================================

async function recuperarLicenciaPorEmail(email) {
  if (!email) return false;
  
  try {
    const docRef = db.collection("licencias").doc(email);
    const doc = await docRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      if (data.tipo === "pro" && new Date(data.expira) > new Date()) {
        licencia = {
          tipo: "pro",
          activa: true,
          expira: data.expira,
          email: email
        };
        localStorage.setItem("licenciaCrianza", JSON.stringify({
          tipo: licencia.tipo,
          expira: licencia.expira,
          email: licencia.email
        }));
        localStorage.setItem("emailActivo", email);
        return true;
      }
    }
  } catch (error) {
    console.log("Error recuperando licencia:", error);
  }
  return false;
}

// =====================================================
// FUNCIÓN PARA FORZAR RECUPERACIÓN MANUAL (botón opcional)
// =====================================================

async function forzarRecuperacionLicencia() {
  const email = prompt("📧 Ingresa tu correo electrónico para recuperar tu licencia Pro:");
  if (!email) return;
  
  const recuperado = await recuperarLicenciaPorEmail(email);
  if (recuperado) {
    alert("✅ ¡Licencia recuperada! La página se recargará.");
    location.reload();
  } else {
    alert("❌ No encontramos una licencia activa para este email. ¿Ya la activaste antes?");
  }
}

// =====================================================
// GUARDAR PROGRESO EN FIRESTORE (opcional)
// =====================================================

async function guardarProgresoFirebase() {
  const email = localStorage.getItem("emailActivo");
  if (!email || licencia.tipo !== "pro") return;
  
  try {
    await db.collection("progreso").doc(email).set({
      diaActual: cursoEstado.diaActual,
      completados: cursoEstado.completados,
      estiloCrianza: cursoEstado.estiloCrianza,
      racha: cursoEstado.racha,
      ultimoCompletado: cursoEstado.ultimoCompletado,
      medallas: cursoEstado.medallas,
      estadisticas: cursoEstado.estadisticas,
      actualizado: new Date().toISOString()
    });
  } catch (error) {
    console.log("Error guardando progreso en Firebase:", error);
  }
}

// =====================================================
// INICIAR APLICACIÓN
// =====================================================

iniciarApp();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(console.log);
}
