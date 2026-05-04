// =====================================================
// CURSO DE CRIANZA - 28 DÍAS
// Estructura secuencial con progreso en localStorage
// =====================================================

// --- ESTADO DEL CURSO ---
let cursoEstado = {
  diaActual: 1,
  completados: [],
  estiloCrianza: null,
  racha: 0,
  ultimoCompletado: null
};

// Cargar progreso guardado
function cargarProgreso() {
  const guardado = localStorage.getItem("cursoCrianza");
  if (guardado) {
    cursoEstado = JSON.parse(guardado);
  }
  actualizarUIProgreso();
}

// Guardar progreso
function guardarProgreso() {
  localStorage.setItem("cursoCrianza", JSON.stringify(cursoEstado));
  actualizarUIProgreso();
}

// Marcar día como completado
function completarDia(dia) {
  if (!cursoEstado.completados.includes(dia)) {
    cursoEstado.completados.push(dia);
    
    // Calcular racha
    const hoy = new Date().toDateString();
    if (cursoEstado.ultimoCompletado === hoy) {
      // Ya completó hoy, no suma doble
    } else if (cursoEstado.ultimoCompletado === ayerString()) {
      cursoEstado.racha++;
    } else {
      cursoEstado.racha = 1;
    }
    cursoEstado.ultimoCompletado = hoy;
    
    // Avanzar al siguiente día si es el actual
    if (dia === cursoEstado.diaActual) {
      cursoEstado.diaActual++;
    }
    guardarProgreso();
    mostrarPantallaPrincipal();
  }
}

function ayerString() {
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  return ayer.toDateString();
}

function actualizarUIProgreso() {
  // No hace falta aquí, se actualiza al renderizar
}

// --- CONTENIDO DE LOS 28 DÍAS ---
const lecciones = {
  1: {
    titulo: "🎯 Día 1: Descubre tu estilo de crianza",
    objetivo: "Identificar tu estilo actual (autoritario, democrático, permisivo o negligente).",
    teoria: "Tu estilo de crianza afecta la autoestima, el autocontrol y el liderazgo de tu hijo. Hoy harás un test para conocerte mejor.",
    ejercicio: "Responde el test de 10 preguntas al final. Anota tu resultado.",
    reflexion: "Completa: 'Mi estilo actual es ______ porque ______. Me gustaría mejorar en ______.'",
    tieneTest: true
  },
  2: {
    titulo: "📜 Día 2: Los 10 mandamientos de la crianza positiva",
    objetivo: "Memorizar y aplicar los 10 principios base.",
    teoria: "1. Conecta antes de corregir | 2. Escucha sin juzgar | 3. Límites firmes pero amables | 4. Valida emociones | 5. No pegues, no grites | 6. Sé el ejemplo | 7. Cada niño tiene su ritmo | 8. El juego es aprendizaje | 9. El error es oportunidad | 10. Cuídate para cuidar",
    ejercicio: "Elige UN mandamiento hoy y aplícalo conscientemente. Escríbelo.",
    reflexion: "El mandamiento que más necesito recordar es ______."
  },
  3: {
    titulo: "🧩 Día 3: Los 4 pilares del hogar",
    objetivo: "Identificar qué pilar está más débil en tu casa.",
    teoria: "Vínculo seguro + Comunicación respetuosa + Límites claros + Autocuidado del adulto. Sin uno, la crianza cojea.",
    ejercicio: "Dibuja una rueda con 4 sectores. Puntúa del 1 al 10 cada pilar. El más bajo será tu foco.",
    reflexion: "Mi pilar más débil es ______. Hoy haré ______ para fortalecerlo."
  },
  4: {
    titulo: "💖 Día 4: Validación emocional",
    objetivo: "Responder a las emociones sin negarlas ni minimizarlas.",
    teoria: "Validar no es dar la razón. Es decir: 'Veo que estás enojado, está bien sentirlo. Hablemos de qué hacer.'",
    ejercicio: "Hoy, cuando tu hijo exprese una emoción 'difícil', di: 'Entiendo que te sientes ______. Estoy aquí contigo.'",
    reflexion: "Hoy validé la emoción de mi hijo cuando ______."
  },
  5: {
    titulo: "🔒 Día 5: Límites claros sin gritos",
    objetivo: "Poner un límite firme manteniendo la calma.",
    teoria: "Un límite efectivo es: breve, claro, ejecutable. Ej: 'Los juguetes no se tiran. Los recoges o los guardo 10 minutos.'",
    ejercicio: "Identifica un límite que te cueste. Escríbelo y ensáyalo en voz baja.",
    reflexion: "El límite que pondré hoy sin gritar es ______."
  },
  6: {
    titulo: "⚡ Día 6: Consecuencias lógicas",
    objetivo: "Usar consecuencias relacionadas, no castigos arbitrarios.",
    teoria: "Consecuencia lógica vs castigo: si ensucia, limpia (no 'sin tele'). Si no ordena, pierde tiempo de juego (pero relacionado).",
    ejercicio: "Hoy aplica 1 consecuencia lógica. Obsérvala.",
    reflexion: "Usé consecuencia lógica cuando ______ y funcionó porque ______."
  },
  7: {
    titulo: "🧘 Día 7: Autocuidado del adulto",
    objetivo: "Reconocer que cuidarte es parte de la crianza.",
    teoria: "Un adulto agotado no puede regular a un niño. El autocuidado no es egoísmo.",
    ejercicio: "Haz algo SOLO para ti durante 15 minutos (sin pantallas, sin hijos).",
    reflexion: "Hoy de mí mismo/a aprendí que ______."
  },
  8: {
    titulo: "🌟 Día 8: Autoestima en acción",
    objetivo: "Fortalecer la autoestima de tu hijo con acciones concretas.",
    teoria: "La autoestima crece cuando el niño se siente visto por quien es, no por lo que hace.",
    ejercicio: "Dale un 'mensaje al espejo': 'Eres valioso/a porque ______' (cualidad, no logro).",
    reflexion: "Mi hijo/a sonrió cuando le dije ______."
  },
  9: {
    titulo: "⏳ Día 9: Enseñar autocontrol",
    objetivo: "Entrenar la pausa entre emoción y acción.",
    teoria: "El autocontrol se modela y se practica. Juegos como 'estatuas', 'semáforo', esperar turnos.",
    ejercicio: "Juega 10 min a un juego que requiera esperar (simón dice, estatuas).",
    reflexion: "Mi hijo/a logró ______ de autocontrol hoy."
  },
  10: {
    titulo: "🚀 Día 10: Desarrollar liderazgo",
    objetivo: "Dar oportunidades para que tu hijo lidere.",
    teoria: "Liderazgo = tomar decisiones + responsabilidad + empatía.",
    ejercicio: "Deja que tu hijo elija una actividad familiar y que la dirija (explicar reglas, turnos).",
    reflexion: "Mi hijo/a lideró cuando ______ y lo hizo ______."
  },
  // Días 11-28 (resumidos para espacio, pero puedes completar la misma estructura)
  11: { titulo: "📱 Día 11: Crianza y pantallas", objetivo: "Acuerdos digitales sin lucha.", teoria: "Límites de tiempo + zonas libres de pantallas + modelo parental.", ejercicio: "Hoy acuerda 1 regla de pantalla en familia.", reflexion: "El acuerdo fue ______." },
  12: { titulo: "👥 Día 12: Rivalidad entre hermanos", objetivo: "Mediar sin tomar partido.", teoria: "Escucha a cada uno, no hay culpable, solución entre ambos.", ejercicio: "Ante una pelea, di: '¿Cómo lo solucionan juntos?'", reflexion: "Propuesta de ellos fue ______." },
  13: { titulo: "😴 Día 13: Sueño respetuoso", objetivo: "Rutinas de sueño sin castigo.", teoria: "Consistencia + ambiente tranquilo + conexión previa.", ejercicio: "Crea una rutina de 3 pasos para dormir.", reflexion: "Lo que más funcionó fue ______." },
  14: { titulo: "🍽️ Día 14: Alimentación sin lucha", objetivo: "Tú ofreces, ellos eligen (dentro de lo sano).", teoria: "No obligar a terminar el plato. Ellos regulan su hambre.", ejercicio: "Hoy no presiones con la comida. Observa.", reflexion: "Mi hijo/a comió ______ sin presión." },
  // Días 15-28: mantén la estructura, varía temas como: emociones del adulto, disciplina positiva, familias diversas, resolución de conflictos, etc.
  // Por brevedad, los días 15-28 se pueden generar con la misma plantilla.
};

// Completar días 15-28 automáticamente (puedes editarlos después)
for (let i = 15; i <= 28; i++) {
  lecciones[i] = {
    titulo: `📘 Día ${i}: Tema especial de crianza`,
    objetivo: "Seguir profundizando en tu habilidad parental.",
    teoria: "Cada día suma práctica. La crianza se aprende haciendo.",
    ejercicio: "Revisa el reto diario de la app y complétalo.",
    reflexion: "Hoy aprendí que ______."
  };
}

// --- PANTALLA PRINCIPAL (el mapa del curso) ---
function mostrarPantallaPrincipal() {
  const totalDias = 28;
  const completados = cursoEstado.completados.length;
  const progreso = Math.round((completados / totalDias) * 100);
  
  let html = `
    <div class="card">
      <h2>🗺️ Tu curso de crianza - 28 días</h2>
      <div class="progreso-bar">
        <div class="progreso-fill" style="width: ${progreso}%;">${progreso}%</div>
      </div>
      <p>🔥 Racha: ${cursoEstado.racha} días seguidos</p>
      <p><strong>Día actual: ${cursoEstado.diaActual}</strong> | Completados: ${completados}/${totalDias}</p>
      ${cursoEstado.diaActual > totalDias ? '<p>🎉 ¡FELICIDADES! Completaste el curso. <a href="#" id="descargarCertificado">Descargar certificado</a></p>' : ''}
    </div>
  `;
  
  // Generar módulos (días 1-7, 8-14, 15-21, 22-28)
  for (let modulo = 0; modulo < 4; modulo++) {
    const inicio = modulo * 7 + 1;
    const fin = inicio + 6;
    html += `<div class="card"><h3>📚 Módulo ${modulo+1}: ${getModuloNombre(modulo)}</h3><div class="grid-2">`;
    for (let dia = inicio; dia <= fin && dia <= totalDias; dia++) {
      const completado = cursoEstado.completados.includes(dia);
      const bloqueado = dia > cursoEstado.diaActual && !completado;
      html += `
        <div class="dia-card ${bloqueado ? 'bloqueado' : ''}" data-dia="${dia}">
          ${completado ? '✅ ' : (bloqueado ? '🔒 ' : '📖 ')}
          <strong>Día ${dia}</strong>: ${lecciones[dia]?.titulo || `Tema ${dia}`}
          ${bloqueado ? '<br><small>Completa el día anterior</small>' : ''}
          ${completado ? '<br><small>✔ Completado</small>' : '<br><button class="btn-dia" data-dia="'+dia+'">Ver lección</button>'}
        </div>
      `;
    }
    html += `</div></div>`;
  }
  
  document.getElementById("contenido").innerHTML = html;
  
  // Eventos para botones
  document.querySelectorAll(".btn-dia").forEach(btn => {
    btn.onclick = (e) => {
      const dia = parseInt(btn.getAttribute("data-dia"));
      mostrarLeccion(dia);
    };
  });
  
  const certLink = document.getElementById("descargarCertificado");
  if (certLink) {
    certLink.onclick = (e) => {
      e.preventDefault();
      descargarCertificado();
    };
  }
}

function getModuloNombre(modulo) {
  const nombres = ["Fundamentos", "Habilidades prácticas", "Situaciones específicas", "Maestría parental"];
  return nombres[modulo];
}

// --- MOSTRAR UNA LECCIÓN (día específico) ---
function mostrarLeccion(dia) {
  const lec = lecciones[dia];
  if (!lec) return;
  
  let testHtml = "";
  if (lec.tieneTest) {
    testHtml = `
      <div class="card">
        <h3>📋 Test de estilo de crianza</h3>
        ${generarTest()}
        <button id="btnCalcularTestCurso" class="juego">Ver mi estilo</button>
        <div id="resultadoTestCurso"></div>
      </div>
    `;
  }
  
  const html = `
    <div class="card">
      <h2>${lec.titulo}</h2>
      <p><strong>🎯 Objetivo:</strong> ${lec.objetivo}</p>
      <p><strong>📖 Teoría:</strong> ${lec.teoria}</p>
      <p><strong>✏️ Ejercicio del día:</strong> ${lec.ejercicio}</p>
      <p><strong>🤔 Reflexión (completa):</strong> ${lec.reflexion}</p>
      <input type="text" id="reflexionInput" placeholder="Escribe tu reflexión aquí..." style="width:100%; margin:1rem 0;">
      <button id="btnCompletarDia" class="juego" data-dia="${dia}">✅ Marcar Día ${dia} como completado</button>
    </div>
    ${testHtml}
    <button id="btnVolverMapa" class="juego">🗺️ Volver al mapa del curso</button>
  `;
  
  document.getElementById("contenido").innerHTML = html;
  
  document.getElementById("btnCompletarDia").onclick = () => {
    const reflexion = document.getElementById("reflexionInput")?.value || "Sin reflexión escrita";
    if (reflexion.length > 5) {
      localStorage.setItem(`reflexion_dia_${dia}`, reflexion);
    }
    completarDia(dia);
    alert(`¡Día ${dia} completado! Sigue así.`);
  };
  
  const volver = document.getElementById("btnVolverMapa");
  if (volver) volver.onclick = mostrarPantallaPrincipal;
  
  const testBtn = document.getElementById("btnCalcularTestCurso");
  if (testBtn) {
    testBtn.onclick = () => {
      const puntaje = calcularPuntajeTest();
      const resultado = interpretarTest(puntaje);
      cursoEstado.estiloCrianza = resultado.estilo;
      guardarProgreso();
      document.getElementById("resultadoTestCurso").innerHTML = `
        <h3>Tu estilo: ${resultado.estilo}</h3>
        <p>${resultado.descripcion}</p>
        <p>💡 ${resultado.consejo}</p>
      `;
    };
  }
}

function generarTest() {
  let html = `<div id="testForm">`;
  const preguntas = [
    "Tu hijo tiene una rabieta. ¿Qué haces? (0: compro algo, 1: grito/castigo, 2: valido y contengo, 3: ignoro)",
    "Antes de una norma nueva, ¿cómo actúas? (0: impongo, 1: explico y negocio, 2: evito conflicto, 3: no hay norma)",
    "Cuando logra algo, tú... (0: crítica, 1: celebro esfuerzo, 2: soborno, 3: indiferente)",
    // Puedes usar las mismas 10 preguntas del test anterior, pero simplificadas
  ];
  for (let i=1; i<=10; i++) {
    html += `<p><strong>${i}.</strong> ${preguntas[i-1] || "Pregunta tipo"}</p>
      <select id="p${i}">
        <option value="0">Opción A</option>
        <option value="1">Opción B</option>
        <option value="2">Opción C</option>
        <option value="3">Opción D</option>
      </select><br>`;
  }
  html += `</div>`;
  return html;
}

function calcularPuntajeTest() {
  let total = 0;
  for (let i=1; i<=10; i++) {
    const sel = document.getElementById(`p${i}`);
    if (sel) total += parseInt(sel.value);
  }
  return total;
}

function interpretarTest(puntaje) {
  if (puntaje <= 8) return { estilo: "🟡 Permisivo", descripcion: "Priorizas afecto sin límites.", consejo: "Agrega 1 límite claro esta semana." };
  if (puntaje <= 16) return { estilo: "🔴 Autoritario", descripcion: "Mucho control, poca calidez.", consejo: "Valida una emoción al día sin juzgar." };
  if (puntaje <= 24) return { estilo: "🟢 Democrático", descripcion: "Excelente equilibrio.", consejo: "Enseña a otros padres. Eres un modelo." };
  return { estilo: "⚫ Negligente", descripcion: "Poca implicación.", consejo: "Dedica 15 min diarios de atención plena." };
}

function descargarCertificado() {
  const certificado = `Certificado de finalización - Curso de crianza consciente - Completaste 28 días - Racha: ${cursoEstado.racha} días - Fecha: ${new Date().toLocaleDateString()}`;
  const blob = new Blob([certificado], {type: "text/plain"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "certificado_crianza.txt";
  link.click();
}

// --- INICIALIZACIÓN ---
function iniciarCurso() {
  cargarProgreso();
  mostrarPantallaPrincipal();
}

// Reemplazar el evento de navegación si existe, o ejecutar al cargar
document.addEventListener("DOMContentLoaded", () => {
  iniciarCurso();
});
