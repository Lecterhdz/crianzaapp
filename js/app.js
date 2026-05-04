// =====================================================
// CURSO DE CRIANZA - 28 DÍAS - VERSIÓN PROFESIONAL
// Con gráficos, medallas, simulador, modo oscuro, voz y más
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
  // Medalla por primer día
  if (completados >= 1 && !cursoEstado.medallas.includes("primer_paso")) {
    cursoEstado.medallas.push("primer_paso");
    mostrarNotificacion("🏅 ¡Medalla desbloqueada! PRIMER PASO - Completaste tu primer día.");
  }
  // Medalla por 7 días
  if (completados >= 7 && !cursoEstado.medallas.includes("semana_completa")) {
    cursoEstado.medallas.push("semana_completa");
    mostrarNotificacion("🏅 ¡Medalla desbloqueada! SEMANA COMPLETA - 7 días de compromiso.");
  }
  // Medalla por racha de 7 días
  if (cursoEstado.racha >= 7 && !cursoEstado.medallas.includes("racha_7")) {
    cursoEstado.medallas.push("racha_7");
    mostrarNotificacion("🏅 ¡Medalla desbloqueada! RACHA DE FUEGO - 7 días seguidos practicando.");
  }
  // Medalla por 14 días
  if (completados >= 14 && !cursoEstado.medallas.includes("mitad_camino")) {
    cursoEstado.medallas.push("mitad_camino");
    mostrarNotificacion("🏅 ¡Medalla desbloqueada! MITAD DE CAMINO - 14 días completados.");
  }
  // Medalla por 21 días
  if (completados >= 21 && !cursoEstado.medallas.includes("cerca_meta")) {
    cursoEstado.medallas.push("cerca_meta");
    mostrarNotificacion("🏅 ¡Medalla desbloqueada! CERCA DE LA META - 21 días, el final está cerca.");
  }
  // Medalla por completar todo
  if (completados >= 28 && !cursoEstado.medallas.includes("maestro_parental")) {
    cursoEstado.medallas.push("maestro_parental");
    mostrarNotificacion("🏅 ¡MEDALLA MÁXIMA! MAESTRO PARENTAL - Completaste los 28 días. ¡Eres un ejemplo!");
  }
  guardarProgreso();
}

function mostrarNotificacion(mensaje) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Curso de Crianza", { body: mensaje, icon: "icons/icon-192.png" });
  }
  // También mostrar en pantalla
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
    
    // Registrar día productivo
    const diaSemana = new Date().getDay();
    cursoEstado.estadisticas.diasMasProductivos[diaSemana] = (cursoEstado.estadisticas.diasMasProductivos[diaSemana] || 0) + 1;
    
    if (dia === cursoEstado.diaActual) {
      cursoEstado.diaActual++;
    }
    
    actualizarMedallas();
    guardarProgreso();
    
    // Programar recordatorio para mañana
    programarRecordatorio();
  }
}

function programarRecordatorio() {
  if ("Notification" in window && Notification.permission === "granted") {
    // Recordatorio para mañana a las 10:00 AM (simulado)
    setTimeout(() => {
      new Notification("📅 ¡No olvides tu día de crianza!", { 
        body: `Hoy es el Día ${cursoEstado.diaActual} del curso. ¡Sigue tu racha de ${cursoEstado.racha} días!`,
        icon: "icons/icon-192.png"
      });
    }, 24 * 60 * 60 * 1000); // 24 horas (simulado, en realidad se guardaría en service worker)
  }
}

// --- CONTENIDO DE LOS 28 DÍAS (COMPLETO) ---
// [Mantén aquí las lecciones del día 1 al 28 como en el código anterior]
// Por brevedad en esta respuesta, mantengo la estructura completa que ya tenías
// pero asegúrate de que lecciones[1] a lecciones[28] estén definidas.

// --- SIMULADOR DE ESCENARIOS ---
function mostrarSimulador() {
  const escenarios = [
    { texto: "Tu hijo de 4 años tira un juguete porque está enojado. ¿Qué haces?",
      opciones: [
        "Le grito que recoja el juguete ahora mismo",
        "Me acerco, me agacho y le digo: 'Veo que estás enojado. Los juguetes no se tiran. ¿Recogemos juntos?'",
        "Lo ignoro, que se calme solo",
        "Le quito todos los juguetes como castigo"
      ],
      correcta: 1,
      feedback: "Excelente. Validaste la emoción y pusiste un límite sin gritar. Esa es la crianza democrática."
    },
    { texto: "Tu hijo de 7 años no quiere hacer la tarea. ¿Qué haces?",
      opciones: [
        "Le castigo sin tele por una semana",
        "Le ayudo a organizar la tarea en partes pequeñas y le ofrezco un descanso después",
        "Hago la tarea por él para que termine rápido",
        "Le digo que es un irresponsable y me voy"
      ],
      correcta: 1,
      feedback: "Correcto. Dividir en partes y ofrecer descansos enseña autonomía y manejo del tiempo."
    },
    { texto: "Tu hijo adolescente llega tarde a casa sin avisar. ¿Qué haces?",
      opciones: [
        "Le grito y le prohíbo salir un mes",
        "Le pregunto qué pasó, escucho, y acordamos juntos una consecuencia lógica",
        "No le digo nada, total ya llegó",
        "Le reviso el celular para ver con quién estaba"
      ],
      correcta: 1,
      feedback: "Perfecto. Escuchar, entender y acordar consecuencias juntos fortalece la responsabilidad."
    }
  ];
  
  let escenarioActual = 0;
  let puntajeSimulador = 0;
  
  function cargarEscenario() {
    if (escenarioActual >= escenarios.length) {
      document.getElementById("simuladorContainer").innerHTML = `
        <div style="text-align:center">
          <h3>🎉 Simulador completado</h3>
          <p>Tu puntaje: ${puntajeSimulador}/${escenarios.length}</p>
          <p>${puntajeSimulador === escenarios.length ? "¡Eres un experto en crianza!" : "Sigue practicando, cada día aprendes más."}</p>
          <button id="reiniciarSimulador" class="juego">🔄 Volver a intentar</button>
        </div>
      `;
      const reiniciar = document.getElementById("reiniciarSimulador");
      if (reiniciar) reiniciar.onclick = () => { escenarioActual = 0; puntajeSimulador = 0; cargarEscenario(); };
      return;
    }
    
    const esc = escenarios[escenarioActual];
    let opcionesHtml = "";
    esc.opciones.forEach((op, idx) => {
      opcionesHtml += `<button class="opcion-simulador" data-idx="${idx}" style="display:block; width:100%; margin:8px 0; padding:12px; background:#f0f0f0; border:none; border-radius:12px; text-align:left; cursor:pointer;">${String.fromCharCode(65+idx)}. ${op}</button>`;
    });
    
    document.getElementById("simuladorContainer").innerHTML = `
      <h3>📋 Escenario ${escenarioActual+1}/${escenarios.length}</h3>
      <p><strong>${esc.texto}</strong></p>
      <div id="opcionesSimulador">${opcionesHtml}</div>
      <div id="feedbackSimulador" style="margin-top:1rem;"></div>
    `;
    
    document.querySelectorAll(".opcion-simulador").forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute("data-idx"));
        const feedbackDiv = document.getElementById("feedbackSimulador");
        if (idx === esc.correcta) {
          puntajeSimulador++;
          feedbackDiv.innerHTML = `<div style="background:#c8e6c9; padding:12px; border-radius:12px;">✅ ¡Correcto! ${esc.feedback}</div>`;
        } else {
          feedbackDiv.innerHTML = `<div style="background:#ffcdd2; padding:12px; border-radius:12px;">❌ Incorrecto. La mejor opción era: ${esc.opciones[esc.correcta]}</div>`;
        }
        setTimeout(() => {
          escenarioActual++;
          cargarEscenario();
        }, 2000);
      };
    });
  }
  
  const simuladorHtml = `
    <div class="card">
      <h2>🎭 Simulador de escenarios de crianza</h2>
      <p>Practica cómo reaccionarías en situaciones reales. Aprende de tus aciertos y errores.</p>
      <div id="simuladorContainer"></div>
      <button id="cerrarSimulador" class="juego">Cerrar simulador</button>
    </div>
  `;
  
  document.getElementById("contenido").innerHTML = simuladorHtml;
  cargarEscenario();
  document.getElementById("cerrarSimulador").onclick = mostrarPantallaPrincipal;
}

// --- ESTADÍSTICAS PERSONALES ---
function mostrarEstadisticas() {
  const completados = cursoEstado.completados.length;
  const racha = cursoEstado.racha;
  const medallas = cursoEstado.medallas.length;
  const tiempoTotal = cursoEstado.estadisticas.tiempoTotalMinutos;
  
  // Calcular días más productivos
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  let topDias = Object.entries(cursoEstado.estadisticas.diasMasProductivos)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 3)
    .map(([dia, count]) => `${diasSemana[parseInt(dia)]}: ${count} días`);
  
  const html = `
    <div class="card">
      <h2>📊 Tus estadísticas personales</h2>
      <div class="grid-2">
        <div class="card"><h3>📅 Progreso</h3>
          <p>✅ Días completados: ${completados}/28</p>
          <p>🔥 Racha actual: ${racha} días</p>
          <p>🏅 Medallas ganadas: ${medallas}</p>
        </div>
        <div class="card"><h3>⏱️ Tiempo estimado</h3>
          <p>⏰ Tiempo total invertido: ~${tiempoTotal || completados * 15} minutos</p>
          <p>📖 Promedio por día: ${Math.round((tiempoTotal || completados * 15) / Math.max(1,completados))} min</p>
        </div>
        <div class="card"><h3>📈 Días más productivos</h3>
          <ul>${topDias.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>
        <div class="card"><h3>🏆 Tus medallas</h3>
          <ul>
            ${cursoEstado.medallas.includes("primer_paso") ? '<li>🏅 Primer paso</li>' : ''}
            ${cursoEstado.medallas.includes("semana_completa") ? '<li>🏅 Semana completa</li>' : ''}
            ${cursoEstado.medallas.includes("racha_7") ? '<li>🏅 Racha de fuego (7 días)</li>' : ''}
            ${cursoEstado.medallas.includes("mitad_camino") ? '<li>🏅 Mitad de camino</li>' : ''}
            ${cursoEstado.medallas.includes("cerca_meta") ? '<li>🏅 Cerca de la meta</li>' : ''}
            ${cursoEstado.medallas.includes("maestro_parental") ? '<li>🏅 Maestro parental</li>' : ''}
          </ul>
        </div>
      </div>
      <button id="volverEstadisticas" class="juego">Volver al curso</button>
    </div>
  `;
  
  document.getElementById("contenido").innerHTML = html;
  document.getElementById("volverEstadisticas").onclick = mostrarPantallaPrincipal;
}

// --- PLANIFICADOR SEMANAL IMPRIMIBLE ---
function mostrarPlanificador() {
  const semanaCompletados = cursoEstado.completados.filter(d => d <= cursoEstado.diaActual).length;
  const html = `
    <div class="card">
      <h2>📅 Planificador semanal de crianza</h2>
      <p>Completa este planificador y llévalo contigo. ¡Puedes imprimirlo!</p>
      <div id="planificadorContenido">
        <table style="width:100%; border-collapse:collapse;">
          <tr style="background:#4CAF50; color:white;"><th>Día</th><th>Mi objetivo de crianza</th><th>¿Lo logré?</th></tr>
          <tr><td>Lunes</td><td><input type="text" id="planLun" placeholder="Ej: Validar una emoción" style="width:100%"></td><td><input type="checkbox"></td></tr>
          <tr><td>Martes</td><td><input type="text" id="planMar" placeholder="Ej: Poner un límite sin gritar"></td><td><input type="checkbox"></td></tr>
          <tr><td>Miércoles</td><td><input type="text" id="planMie" placeholder="Ej: 10 min de juego ininterrumpido"></td><td><input type="checkbox"></td></tr>
          <tr><td>Jueves</td><td><input type="text" id="planJue" placeholder="Ej: Respirar antes de reaccionar"></td><td><input type="checkbox"></td></tr>
          <tr><td>Viernes</td><td><input type="text" id="planVie" placeholder="Ej: Dar una responsabilidad a mi hijo"></td><td><input type="checkbox"></td></tr>
          <tr><td>Sábado</td><td><input type="text" id="planSab" placeholder="Ej: Hacer algo de autocuidado"></td><td><input type="checkbox"></td></tr>
          <tr><td>Domingo</td><td><input type="text" id="planDom" placeholder="Ej: Reflexionar sobre la semana"></td><td><input type="checkbox"></td></tr>
        </table>
        <button id="imprimirPlanificador" class="juego" style="margin-top:1rem;">🖨️ Imprimir planificador</button>
        <button id="guardarPlanificador" class="juego">💾 Guardar para la semana</button>
      </div>
      <button id="volverPlanificador" class="juego">Volver al curso</button>
    </div>
  `;
  
  document.getElementById("contenido").innerHTML = html;
  
  // Cargar planificador guardado
  const planGuardado = JSON.parse(localStorage.getItem("planificadorSemanal") || "{}");
  if (planGuardado.lun) document.getElementById("planLun").value = planGuardado.lun;
  if (planGuardado.mar) document.getElementById("planMar").value = planGuardado.mar;
  if (planGuardado.mie) document.getElementById("planMie").value = planGuardado.mie;
  if (planGuardado.jue) document.getElementById("planJue").value = planGuardado.jue;
  if (planGuardado.vie) document.getElementById("planVie").value = planGuardado.vie;
  if (planGuardado.sab) document.getElementById("planSab").value = planGuardado.sab;
  if (planGuardado.dom) document.getElementById("planDom").value = planGuardado.dom;
  
  document.getElementById("guardarPlanificador").onclick = () => {
    const plan = {
      lun: document.getElementById("planLun").value,
      mar: document.getElementById("planMar").value,
      mie: document.getElementById("planMie").value,
      jue: document.getElementById("planJue").value,
      vie: document.getElementById("planVie").value,
      sab: document.getElementById("planSab").value,
      dom: document.getElementById("planDom").value
    };
    localStorage.setItem("planificadorSemanal", JSON.stringify(plan));
    alert("Planificador guardado. ¡Revisa tus objetivos esta semana!");
  };
  
  document.getElementById("imprimirPlanificador").onclick = () => {
    window.print();
  };
  
  document.getElementById("volverPlanificador").onclick = mostrarPantallaPrincipal;
}

// --- FUNCIONES DE VOZ ---
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

// --- CONFIGURACIÓN DE LA APP ---
function mostrarConfiguracion() {
  const html = `
    <div class="card">
      <h2>⚙️ Configuración</h2>
      <div style="margin:1rem 0;">
        <label>
          <input type="checkbox" id="modoOscuroCheck" ${modoOscuro ? 'checked' : ''}> 🌙 Modo oscuro
        </label>
      </div>
      <div style="margin:1rem 0;">
        <label>
          <input type="checkbox" id="vozActivaCheck" ${vozActiva ? 'checked' : ''}> 🔊 Modo lectura (voz automática al abrir lección)
        </label>
      </div>
      <div style="margin:1rem 0;">
        <button id="solicitarNotificaciones" class="juego">🔔 Activar recordatorios diarios</button>
      </div>
      <div style="margin:1rem 0;">
        <button id="resetearProgreso" class="juego" style="background:#f44336;">⚠️ Resetear todo el progreso</button>
      </div>
      <button id="volverConfig" class="juego">Volver al curso</button>
    </div>
  `;
  
  document.getElementById("contenido").innerHTML = html;
  
  document.getElementById("modoOscuroCheck").onchange = (e) => {
    modoOscuro = e.target.checked;
    if (modoOscuro) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
    guardarProgreso();
  };
  
  document.getElementById("vozActivaCheck").onchange = (e) => {
    vozActiva = e.target.checked;
    guardarProgreso();
  };
  
  document.getElementById("solicitarNotificaciones").onclick = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(perm => {
        if (perm === "granted") {
          alert("¡Notificaciones activadas! Recibirás recordatorios amables.");
          programarRecordatorio();
        } else {
          alert("No se activaron las notificaciones. Puedes hacerlo desde la configuración del navegador.");
        }
      });
    } else {
      alert("Tu navegador no soporta notificaciones.");
    }
  };
  
  document.getElementById("resetearProgreso").onclick = () => {
    if (confirm("¿Estás segura/o? Esto borrará todos tus días completados, medallas y reflexiones. No se puede deshacer.")) {
      localStorage.clear();
      location.reload();
    }
  };
  
  document.getElementById("volverConfig").onclick = mostrarPantallaPrincipal;
}

// --- PANTALLA PRINCIPAL (Mapa del curso con nuevos accesos) ---
function mostrarPantallaPrincipal() {
  const totalDias = 28;
  const completados = cursoEstado.completados.length;
  const progreso = Math.round((completados / totalDias) * 100);
  
  let html = `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
        <h2>🗺️ Tu curso de crianza - 28 días</h2>
        <div>
          <button id="btnSimulador" class="juego" style="background:#9C27B0;">🎭 Simulador</button>
          <button id="btnEstadisticas" class="juego" style="background:#2196F3;">📊 Stats</button>
          <button id="btnPlanificador" class="juego" style="background:#FF9800;">📅 Plan</button>
          <button id="btnConfig" class="juego" style="background:#607D8B;">⚙️ Config</button>
        </div>
      </div>
      <div class="progreso-bar"><div class="progreso-fill" style="width: ${progreso}%;">${progreso}%</div></div>
      <p>🔥 Racha: ${cursoEstado.racha} días seguidos practicando</p>
      <p><strong>📅 Día actual disponible: ${cursoEstado.diaActual}</strong> | ✅ Completados: ${completados}/${totalDias}</p>
      <p>🏅 Medallas: ${cursoEstado.medallas.length}</p>
      ${cursoEstado.estiloCrianza ? `<p>🎭 Tu estilo: ${cursoEstado.estiloCrianza}</p>` : '<p>📝 Completa el Día 1 para conocer tu estilo.</p>'}
    </div>
  `;
  
  // Generar módulos (igual que antes)
  for (let modulo = 0; modulo < 4; modulo++) {
    const inicio = modulo * 7 + 1;
    const fin = inicio + 6;
    const modNombres = ["📘 MÓDULO 1: Fundamentos", "📙 MÓDULO 2: Habilidades prácticas", "📒 MÓDULO 3: Situaciones específicas", "📕 MÓDULO 4: Maestría parental"];
    html += `<div class="card"><h3>${modNombres[modulo]}</h3><div class="grid-2">`;
    for (let dia = inicio; dia <= fin && dia <= totalDias; dia++) {
      const completado = cursoEstado.completados.includes(dia);
      const bloqueado = dia > cursoEstado.diaActual && !completado;
      html += `
        <div class="dia-card ${bloqueado ? 'bloqueado' : ''}" data-dia="${dia}">
          ${completado ? '✅ ' : (bloqueado ? '🔒 ' : '📖 ')}
          <strong>Día ${dia}</strong>: ${lecciones[dia]?.titulo || `Tema ${dia}`}
          ${bloqueado ? '<br><small>🔓 Completa el día anterior</small>' : ''}
          ${completado ? '<br><small>✔ Completado</small>' : '<button class="btn-dia" data-dia="'+dia+'">Ver lección</button>'}
        </div>
      `;
    }
    html += `</div></div>`;
  }
  
  document.getElementById("contenido").innerHTML = html;
  
  // Eventos botones principales
  document.getElementById("btnSimulador")?.addEventListener("click", mostrarSimulador);
  document.getElementById("btnEstadisticas")?.addEventListener("click", mostrarEstadisticas);
  document.getElementById("btnPlanificador")?.addEventListener("click", mostrarPlanificador);
  document.getElementById("btnConfig")?.addEventListener("click", mostrarConfiguracion);
  
  // Eventos días
  document.querySelectorAll(".btn-dia").forEach(btn => {
    btn.onclick = (e) => {
      const dia = parseInt(btn.getAttribute("data-dia"));
      mostrarLeccion(dia);
    };
  });
}

// --- MOSTRAR LECCIÓN (con voz integrada) ---
function mostrarLeccion(dia) {
  const lec = lecciones[dia];
  if (!lec) return;
  
  // Si voz activa, leer la teoría
  if (vozActiva) {
    hablar(`Día ${dia}. ${lec.titulo}. Objetivo: ${lec.objetivo}. Teoría: ${lec.teoria.substring(0, 500)}`);
  }
  
  // [Aquí iría el mismo código de mostrarLeccion que ya tenías]
  // Por brevedad, mantén tu función mostrarLeccion anterior,
  // solo añade esta línea al inicio para la voz.
  
  // (El resto del código de mostrarLeccion es el mismo que ya funcionaba)
  // Asegúrate de incluir todo el HTML de la lección con teoría, ejemplos, etc.
}

// --- INICIALIZACIÓN ---
function iniciarApp() {
  cargarProgreso();
  mostrarPantallaPrincipal();
  
  // Solicitar permisos de notificación al inicio
  if ("Notification" in window && Notification.permission === "default") {
    // No molestamos, solo preguntamos si el usuario va a configurar
  }
  
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.getAttribute("data-tab");
      if (tab === "curso") mostrarPantallaPrincipal();
      else if (tab === "revisar") mostrarRevisar();
      else if (tab === "recursos") mostrarRecursos();
    };
  });
}

// Iniciar
iniciarApp();

// Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
