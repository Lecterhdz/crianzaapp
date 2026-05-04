// =====================================================
// CURSO DE CRIANZA - 28 DÍAS - VERSIÓN PROFESIONAL COMPLETA
// TEST CORREGIDO CON PREGUNTAS REALES
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

// --- CONTENIDO DE LOS 28 DÍAS ---
const lecciones = {};

// DÍA 1 - CON TEST COMPLETO
lecciones[1] = {
  titulo: "🎯 Día 1: Conoce tu estilo de crianza",
  objetivo: "Identificar tu estilo actual para poder mejorarlo.",
  teoria: `Los estilos de crianza se definen por DOS ejes: AFECTO (calidez, respuesta emocional) y CONTROL (exigencia, disciplina). Combinándolos obtenemos 4 estilos:

🔴 AUTORITARIO: Alto control, bajo afecto. Reglas rígidas, castigos, poca validación. El niño obedece por miedo.
🟢 DEMOCRÁTICO/ASERTIVO: Alto control + alto afecto. Límites claros pero flexibles, diálogo, consecuencias lógicas. Es el estilo recomendado.
🟡 PERMISIVO: Bajo control, alto afecto. Pocos límites, evitan el conflicto. El niño no tolera la frustración.
⚫ NEGLIGENTE: Bajo control, bajo afecto. Desinterés, ausencia. El niño se siente abandonado.

El estilo DEMOCRÁTICO es el que mejores resultados da: hijos seguros, autónomos, con alta autoestima y autocontrol. Hoy descubrirás cuál es tu estilo.`,
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

// DÍA 2
lecciones[2] = {
  titulo: "📜 Día 2: Los 10 mandamientos de la crianza positiva",
  objetivo: "Interiorizar los principios que guían una crianza respetuosa y efectiva.",
  teoria: `Los 10 mandamientos son el pilar ético de la crianza consciente:

1️⃣ CONECTA ANTES DE CORREGIR - El vínculo es la base.
2️⃣ ESCUCHA SIN JUZGAR - Valida la emoción primero.
3️⃣ PON LÍMITES FIRMES PERO AMABLES - No necesitas gritar.
4️⃣ VALIDA TODAS LAS EMOCIONES - Ninguna emoción es mala.
5️⃣ NO PEGUES, NO GRITES - La violencia genera más violencia.
6️⃣ SÉ EL EJEMPLO QUE QUIERES VER - Los niños aprenden de lo que haces.
7️⃣ CADA NIÑO TIENE SU RITMO - No compares.
8️⃣ EL JUEGO ES EL MEJOR APRENDIZAJE - Conecta y enseña.
9️⃣ EL ERROR ES OPORTUNIDAD - No castigues, enseña.
🔟 CUIDATE PARA PODER CUIDAR - El autocuidado no es egoísmo.`,
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

// DÍA 3
lecciones[3] = {
  titulo: "🧩 Día 3: Los 4 pilares del hogar",
  objetivo: "Identificar qué pilar está más débil en tu familia para fortalecerlo.",
  teoria: `Una crianza sólida descansa sobre 4 pilares:

🧱 PILAR 1: VÍNCULO SEGURO - El niño sabe que puede contar contigo.
🧱 PILAR 2: COMUNICACIÓN RESPETUOSA - Escuchar activamente, hablar sin etiquetas.
🧱 PILAR 3: LÍMITES CLAROS - Normas predecibles, consecuencias lógicas.
🧱 PILAR 4: AUTOCUIDADO DEL ADULTO - No puedes dar lo que no tienes.`,
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

// DÍA 4
lecciones[4] = {
  titulo: "💖 Día 4: Validación emocional",
  objetivo: "Aprender a responder a las emociones difíciles sin negarlas ni minimizarlas.",
  teoria: `Validar NO es dar la razón. Es reconocer la emoción del otro como legítima.

PASOS PARA VALIDAR:
1. DETENTE y escucha sin interrumpir.
2. NOMBRA la emoción: "Veo que estás enfadado/triste/frustrado".
3. ACEPTA sin condiciones: "Está bien sentir eso".
4. NO intentes resolver inmediatamente.
5. OFRECE presencia: "Estoy aquí contigo".`,
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

// Días 5 al 28
const temasDias = {
  5: { t:"🔒 Día 5: Límites claros sin gritos", obj:"Poner límites firmes manteniendo la calma", teo:"Un límite efectivo es breve, claro y ejecutable. La fórmula: 'Cuando [conducta], entonces [consecuencia lógica]'. No necesitas gritar." },
  6: { t:"⚡ Día 6: Consecuencias lógicas", obj:"Usar consecuencias relacionadas con el acto", teo:"Castigo vs consecuencia lógica: castigo es arbitrario, consecuencia enseña. Ej: ensucia → limpia." },
  7: { t:"🧘 Día 7: Autocuidado del adulto", obj:"Reconocer que cuidarte es parte de la crianza", teo:"Un adulto agotado no puede regular a un niño. El autocuidado físico, emocional y social es la base." },
  8: { t:"🌟 Día 8: Autoestima en acción", obj:"Fortalecer la autoestima con acciones concretas", teo:"La autoestima no se da con halagos vacíos. Se construye con mensajes incondicionales y responsabilidades reales." },
  9: { t:"⏳ Día 9: Enseñar autocontrol", obj:"Entrenar la pausa entre emoción y acción", teo:"El autocontrol se modela y se practica con juegos de espera y semáforo emocional." },
  10: { t:"🚀 Día 10: Desarrollar liderazgo", obj:"Dar oportunidades para que tu hijo lidere", teo:"Liderazgo = decisiones + responsabilidad + empatía. Dale el rol de 'líder del día'." },
  11: { t:"📱 Día 11: Crianza y pantallas", obj:"Acuerdos digitales sin lucha", teo:"Límites de tiempo + zonas libres + modelo parental + alternativas creativas." },
  12: { t:"👥 Día 12: Rivalidad entre hermanos", obj:"Mediar sin tomar partido", teo:"Escucha a cada uno, no busques culpable, ayúdalos a encontrar su propia solución." },
  13: { t:"😴 Día 13: Sueño respetuoso", obj:"Rutinas de sueño sin castigo", teo:"Consistencia + ambiente tranquilo + ritual de conexión previa." },
  14: { t:"🍽️ Día 14: Alimentación sin lucha", obj:"Tú ofreces, ellos eligen", teo:"No obligar a terminar el plato. Ellos regulan su hambre." },
  15: { t:"😤 Día 15: Manejo de rabietas", obj:"Responder sin escalar", teo:"9 pasos: respira, arrodíllate, nombra emoción, valida sin ceder, ofrece calma, espera el pico, límite breve, redirige, reconecta." },
  16: { t:"🗣️ Día 16: Comunicación no violenta", obj:"Hablar sin etiquetas ni juicios", teo:"Observación + sentimiento + necesidad + petición." },
  17: { t:"🎮 Día 17: Disciplina positiva", obj:"Enseñar en lugar de castigar", teo:"Firmeza y amabilidad, sentido de pertenencia, consecuencias lógicas." },
  18: { t:"❤️ Día 18: Inteligencia emocional", obj:"Nombrar y gestionar emociones", teo:"El cerebro emocional se entrena. Ayuda a tu hijo a identificar sensaciones corporales." },
  19: { t:"🏠 Día 19: Rutinas que funcionan", obj:"Estructura sin rigidez", teo:"Las rutinas dan seguridad. Usa tablas visuales, avisos previos." },
  20: { t:"🧠 Día 20: Crianza y neurodivergencia", obj:"Adaptar técnicas a cada niño", teo:"No todos los niños responden igual. Ajusta tiempos y expectativas." },
  21: { t:"👪 Día 21: Co-parentalidad", obj:"Consistencia entre adultos cuidadores", teo:"Acuerdos escritos, comunicación respetuosa, no desautorizar al otro." },
  22: { t:"🛡️ Día 22: Prevención de abuso", obj:"Enseñar límites corporales", teo:"Cuerpo es mío, secretos buenos y malos, buscar ayuda si algo incomoda." },
  23: { t:"🎭 Día 23: Crianza en divorcio", obj:"Proteger el vínculo", teo:"No hables mal del otro progenitor. El niño no es mensajero ni aliado." },
  24: { t:"🌱 Día 24: Adolescencia respetuosa", obj:"Autonomía con guía", teo:"Negociar, no imponer. Escucha más de lo que hablas." },
  25: { t:"🧘 Día 25: Mindfulness parental", obj:"Respirar antes de reaccionar", teo:"La presencia plena reduce los conflictos. Entrena la pausa." },
  26: { t:"📖 Día 26: Cuentos como herramienta", obj:"Usar narrativa para enseñar", teo:"Los cuentos permiten abordar temas difíciles sin confrontación directa." },
  27: { t:"🔁 Día 27: Reparación después del error", obj:"Pedir disculpas sinceras", teo:"El error bien reparado fortalece el vínculo más que el acierto." },
  28: { t:"🏅 Día 28: Maestría parental", obj:"Celebrar el recorrido", teo:"No hay padres perfectos, sí conscientes. Cada día cuenta." }
};

for (let i = 5; i <= 28; i++) {
  let tema = temasDias[i];
  lecciones[i] = {
    titulo: tema.t,
    objetivo: tema.obj,
    teoria: tema.teo + " Aplica lo aprendido los días anteriores. La práctica constante construye la maestría.",
    ejemplos: [`📖 Ejemplo 1 de "${tema.t}": Situación cotidiana donde aplicas este principio.`, `📖 Ejemplo 2: Otro escenario diferente, mostrando la flexibilidad de la técnica.`],
    actividades: ["🎲 ACTIVIDAD 1: Identifica una situación hoy donde puedas aplicar este tema.", "🎲 ACTIVIDAD 2: Practica conscientemente la técnica principal de hoy.", "🎲 ACTIVIDAD 3: Escribe una breve reflexión sobre cómo te sentiste al aplicarlo."],
    tecnicas: ["Técnica central del día", "Refuerzo positivo", "Pausa reflexiva"],
    habilidades: ["Habilidad parental clave", "Regulación emocional", "Comunicación efectiva"],
    errores: ["❌ Error común 1 relacionado con este tema", "❌ Error común 2 que debes evitar"],
    frases: [`"Frase clave para recordar: ${tema.t.split(':')[0]}"`, "'La práctica hace al maestro.'"],
    herramientas: ["Herramienta sugerida", "Recurso complementario"],
    tieneTest: false
  };
}

// --- FUNCIÓN PARA GENERAR EL TEST COMPLETO CON PREGUNTAS REALES ---
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
        <label><input type="radio" name="p4" value="0"> a) Castigo severo sin explicación (gritar, quitar todo, golpear)</label><br>
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
        <label><input type="radio" name="p6" value="2"> c) No hay límites, ve o juega lo que quiera cuando quiera</label><br>
        <label><input type="radio" name="p6" value="3"> d) No superviso lo que hace en pantallas</label>
      </div>

      <div style="margin:1rem 0; padding:1rem; background:#f5f5f5; border-radius:1rem;">
        <p><strong>7. Ante una pelea entre hermanos o amigos, tú...</strong></p>
        <label><input type="radio" name="p7" value="0"> a) Castigo a ambos sin escuchar versiones</label><br>
        <label><input type="radio" name="p7" value="1"> b) Escucho a cada uno y les ayudo a resolver juntos el conflicto</label><br>
        <label><input type="radio" name="p7" value="2"> c) Dejo que se arreglen solos, aunque uno domine al otro</label><br>
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
        <label><input type="radio" name="p9" value="0"> a) Solo decido yo, sin preguntarles a los hijos</label><br>
        <label><input type="radio" name="p9" value="1"> b) Involucro a los hijos según su edad y capacidad de entender</label><br>
        <label><input type="radio" name="p9" value="2"> c) Dejo que ellos decidan casi todo, aunque sean pequeños</label><br>
        <label><input type="radio" name="p9" value="3"> d) No tomo decisiones, cada quien hace lo que quiere</label>
      </div>

      <div style="margin:1rem 0; padding:1rem; background:#f5f5f5; border-radius:1rem;">
        <p><strong>10. Tu hijo/a tiene miedo o está muy triste. Tú...</strong></p>
        <label><input type="radio" name="p10" value="0"> a) Le digo que no sea débil o que "deje de llorar como un bebé"</label><br>
        <label><input type="radio" name="p10" value="1"> b) Le acompaño, nombro la emoción y le ofrezco seguridad</label><br>
        <label><input type="radio" name="p10" value="2"> c) Lo distraigo rápido con algo material (dulce, comprar algo)</label><br>
        <label><input type="radio" name="p10" value="3"> d) Lo dejo solo/a para que aprenda a manejar sus emociones solo</label>
      </div>

      <button id="calcularTest" class="juego" style="margin-top:1rem;">📊 CALCULAR MI ESTILO DE CRIANZA</button>
      <div id="resultadoTest" style="margin-top:1.5rem;"></div>
    </div>
  `;
}

// --- FUNCIONES DE PANTALLAS ---

function mostrarSimulador() {
  const escenarios = [
    { texto: "Tu hijo de 4 años tira un juguete porque está enojado. ¿Qué haces?",
      opciones: ["Le grito que recoja el juguete", "Me agacho y digo: 'Veo que estás enojado. Los juguetes no se tiran. ¿Recogemos juntos?'", "Lo ignoro", "Le quito todos los juguetes"],
      correcta: 1, feedback: "Excelente. Validaste la emoción y pusiste un límite sin gritar." },
    { texto: "Tu hijo de 7 años no quiere hacer la tarea. ¿Qué haces?",
      opciones: ["Le castigo sin tele", "Le ayudo a organizar la tarea en partes pequeñas", "Hago la tarea por él", "Le digo que es un irresponsable"],
      correcta: 1, feedback: "Correcto. Dividir en partes enseña autonomía." },
    { texto: "Tu hijo adolescente llega tarde sin avisar. ¿Qué haces?",
      opciones: ["Le grito y le prohíbo salir", "Le pregunto qué pasó y acordamos juntos una consecuencia", "No le digo nada", "Le reviso el celular"],
      correcta: 1, feedback: "Perfecto. Escuchar y acordar juntos fortalece la responsabilidad." }
  ];
  
  let escenarioActual = 0;
  let puntajeSimulador = 0;
  
  function cargarEscenario() {
    if (escenarioActual >= escenarios.length) {
      document.getElementById("simuladorContainer").innerHTML = `
        <div style="text-align:center"><h3>🎉 Simulador completado</h3>
        <p>Tu puntaje: ${puntajeSimulador}/${escenarios.length}</p>
        <button id="reiniciarSimulador" class="juego">🔄 Volver a intentar</button></div>`;
      const reiniciar = document.getElementById("reiniciarSimulador");
      if (reiniciar) reiniciar.onclick = () => { escenarioActual = 0; puntajeSimulador = 0; cargarEscenario(); };
      return;
    }
    const esc = escenarios[escenarioActual];
    let opcionesHtml = "";
    esc.opciones.forEach((op, idx) => {
      opcionesHtml += `<button class="opcion-simulador" data-idx="${idx}" style="display:block; width:100%; margin:8px 0; padding:12px; background:#f0f0f0; border:none; border-radius:12px; text-align:left; cursor:pointer;">${String.fromCharCode(65+idx)}. ${op}</button>`;
    });
    document.getElementById("simuladorContainer").innerHTML = `<h3>📋 Escenario ${escenarioActual+1}/${escenarios.length}</h3><p><strong>${esc.texto}</strong></p><div id="opcionesSimulador">${opcionesHtml}</div><div id="feedbackSimulador"></div>`;
    document.querySelectorAll(".opcion-simulador").forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute("data-idx"));
        const feedbackDiv = document.getElementById("feedbackSimulador");
        if (idx === esc.correcta) { puntajeSimulador++; feedbackDiv.innerHTML = `<div style="background:#c8e6c9; padding:12px; border-radius:12px;">✅ Correcto! ${esc.feedback}</div>`; }
        else { feedbackDiv.innerHTML = `<div style="background:#ffcdd2; padding:12px; border-radius:12px;">❌ Incorrecto. La mejor opción era: ${esc.opciones[esc.correcta]}</div>`; }
        setTimeout(() => { escenarioActual++; cargarEscenario(); }, 2000);
      };
    });
  }
  const simuladorHtml = `<div class="card"><h2>🎭 Simulador de escenarios</h2><p>Practica cómo reaccionarías en situaciones reales.</p><div id="simuladorContainer"></div><button id="cerrarSimulador" class="juego">Cerrar</button></div>`;
  document.getElementById("contenido").innerHTML = simuladorHtml;
  cargarEscenario();
  document.getElementById("cerrarSimulador").onclick = mostrarPantallaPrincipal;
}

function mostrarEstadisticas() {
  const completados = cursoEstado.completados.length;
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  let topDias = Object.entries(cursoEstado.estadisticas.diasMasProductivos).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([dia,count]) => `${diasSemana[parseInt(dia)]}: ${count} días`);
  const html = `<div class="card"><h2>📊 Tus estadísticas</h2><div class="grid-2"><div class="card"><h3>📅 Progreso</h3><p>✅ Completados: ${completados}/28</p><p>🔥 Racha: ${cursoEstado.racha} días</p><p>🏅 Medallas: ${cursoEstado.medallas.length}</p></div><div class="card"><h3>📈 Días más productivos</h3><ul>${topDias.map(d=>`<li>${d}</li>`).join('')}</ul></div><div class="card"><h3>🏆 Medallas</h3><ul>${cursoEstado.medallas.map(m=>`<li>🏅 ${m.replace(/_/g,' ')}</li>`).join('')}</ul></div></div><button id="volverEstadisticas" class="juego">Volver</button></div>`;
  document.getElementById("contenido").innerHTML = html;
  document.getElementById("volverEstadisticas").onclick = mostrarPantallaPrincipal;
}

function mostrarPlanificador() {
  const html = `<div class="card"><h2>📅 Planificador semanal</h2><div id="planificadorContenido"><table style="width:100%"><tr style="background:#4CAF50;color:white"><th>Día</th><th>Mi objetivo</th><th>✅</th><tr>${["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"].map((d,idx)=>`<tr><td>${d}</td><td><input type="text" id="plan${idx}" placeholder="Ej: Validar una emoción" style="width:100%"></td><td><input type="checkbox"></td></tr>`).join('')}</table><button id="imprimirPlanificador" class="juego">🖨️ Imprimir</button><button id="guardarPlanificador" class="juego">💾 Guardar</button></div><button id="volverPlanificador" class="juego">Volver</button></div>`;
  document.getElementById("contenido").innerHTML = html;
  const planGuardado = JSON.parse(localStorage.getItem("planificadorSemanal") || "{}");
  for(let i=0;i<7;i++) if(planGuardado[i]) document.getElementById(`plan${i}`).value = planGuardado[i];
  document.getElementById("guardarPlanificador").onclick = () => { let plan={}; for(let i=0;i<7;i++) plan[i]=document.getElementById(`plan${i}`).value; localStorage.setItem("planificadorSemanal",JSON.stringify(plan)); alert("Planificador guardado!"); };
  document.getElementById("imprimirPlanificador").onclick = () => window.print();
  document.getElementById("volverPlanificador").onclick = mostrarPantallaPrincipal;
}

function mostrarConfiguracion() {
  const html = `<div class="card"><h2>⚙️ Configuración</h2><div><label><input type="checkbox" id="modoOscuroCheck" ${modoOscuro?'checked':''}> 🌙 Modo oscuro</label></div><div><label><input type="checkbox" id="vozActivaCheck" ${vozActiva?'checked':''}> 🔊 Modo lectura con voz</label></div><div><button id="solicitarNotificaciones" class="juego">🔔 Activar recordatorios</button></div><div><button id="resetearProgreso" class="juego" style="background:#f44336;">⚠️ Resetear todo el progreso</button></div><button id="volverConfig" class="juego">Volver</button></div>`;
  document.getElementById("contenido").innerHTML = html;
  document.getElementById("modoOscuroCheck").onchange = (e) => { modoOscuro = e.target.checked; guardarProgreso(); };
  document.getElementById("vozActivaCheck").onchange = (e) => { vozActiva = e.target.checked; guardarProgreso(); };
  document.getElementById("solicitarNotificaciones").onclick = () => { if("Notification" in window) Notification.requestPermission(); else alert("No soportado"); };
  document.getElementById("resetearProgreso").onclick = () => { if(confirm("¿Borrar todo?")){ localStorage.clear(); location.reload(); } };
  document.getElementById("volverConfig").onclick = mostrarPantallaPrincipal;
}

function mostrarRevisar() {
  let reflexiones = JSON.parse(localStorage.getItem("reflexionesDias") || "{}");
  let html = `<div class="card"><h2>📋 Días completados</h2>`;
  if (cursoEstado.completados.length === 0) html += `<p>Aún no has completado ningún día.</p>`;
  else { html += `<div class="grid-2">`;
    for (let dia of cursoEstado.completados.sort((a,b)=>a-b)) {
      let reflexion = reflexiones[dia] || "Sin reflexión";
      html += `<div class="dia-card"><strong>✅ Día ${dia}: ${lecciones[dia]?.titulo}</strong><p><em>Reflexión:</em> ${reflexion.substring(0,100)}...</p><button class="btn-ver-dia-revisar" data-dia="${dia}">Ver lección</button></div>`;
    }
    html += `</div>`;
  }
  html += `<button id="volverMapaRevisar" class="juego">Volver</button></div>`;
  document.getElementById("contenido").innerHTML = html;
  document.querySelectorAll(".btn-ver-dia-revisar").forEach(btn => { btn.onclick = () => mostrarLeccion(parseInt(btn.getAttribute("data-dia"))); });
  document.getElementById("volverMapaRevisar").onclick = mostrarPantallaPrincipal;
}

function mostrarRecursos() {
  const html = `<div class="card"><h2>🧰 Biblioteca de recursos</h2><div class="grid-2"><div class="card"><h3>📜 10 Mandamientos</h3><button id="recMandamientos" class="btn-dia">Ver</button></div><div class="card"><h3>🧩 4 Pilares</h3><button id="recPilares" class="btn-dia">Ver</button></div><div class="card"><h3>⚡ 9 Pasos rabieta</h3><button id="recRabieta" class="btn-dia">Ver</button></div><div class="card"><h3>🎭 Estilos crianza</h3><button id="recEstilos" class="btn-dia">Ver</button></div><div class="card"><h3>💬 Frases clave</h3><button id="recFrases" class="btn-dia">Ver</button></div><div class="card"><h3>📊 Test de estilo</h3><button id="recTest" class="btn-dia">Hacer test</button></div></div><button id="volverRecursos" class="juego">Volver</button></div>`;
  document.getElementById("contenido").innerHTML = html;
  document.getElementById("recMandamientos").onclick = () => alert("1.Conecta 2.Escucha 3.Límites firmes 4.Valida 5.No pegues 6.Sé el ejemplo 7.Ritmo 8.Juego 9.Error 10.Autocuidado");
  document.getElementById("recPilares").onclick = () => alert("Vínculo + Comunicación + Límites + Autocuidado");
  document.getElementById("recRabieta").onclick = () => alert("1.Respira 2.Arrodíllate 3.Nombra 4.Valida 5.Ofrece calma 6.Espera 7.Límite 8.Redirige 9.Reconecta");
  document.getElementById("recEstilos").onclick = () => alert("Autoritario: alto control/bajo afecto | Democrático: alto+alto | Permisivo: bajo control/alto afecto | Negligente: bajo+bajo");
  document.getElementById("recFrases").onclick = () => alert("'Veo que estás enojado' 'Te quiero aunque te equivoques' 'Estoy aquí' 'Los límites protegen'");
  document.getElementById("recTest").onclick = () => mostrarLeccion(1);
  document.getElementById("volverRecursos").onclick = mostrarPantallaPrincipal;
}

function mostrarPantallaPrincipal() {
  const totalDias = 28;
  const completados = cursoEstado.completados.length;
  const progreso = Math.round((completados / totalDias) * 100);
  let html = `<div class="card"><div style="display:flex; justify-content:space-between; flex-wrap:wrap;"><h2>🗺️ Curso de crianza - 28 días</h2><div><button id="btnSimulador" class="juego" style="background:#9C27B0;">🎭 Simulador</button><button id="btnEstadisticas" class="juego" style="background:#2196F3;">📊 Stats</button><button id="btnPlanificador" class="juego" style="background:#FF9800;">📅 Plan</button><button id="btnConfig" class="juego" style="background:#607D8B;">⚙️ Config</button></div></div><div class="progreso-bar"><div class="progreso-fill" style="width:${progreso}%;">${progreso}%</div></div><p>🔥 Racha: ${cursoEstado.racha} días | ✅ Completados: ${completados}/${totalDias} | 🏅 Medallas: ${cursoEstado.medallas.length}</p>${cursoEstado.estiloCrianza ? `<p>🎭 Tu estilo: ${cursoEstado.estiloCrianza}</p>` : '<p>📝 Completa el Día 1 para conocer tu estilo.</p>'}</div>`;
  for (let modulo = 0; modulo < 4; modulo++) {
    const inicio = modulo * 7 + 1;
    const fin = inicio + 6;
    const modNombres = ["📘 Fundamentos", "📙 Habilidades prácticas", "📒 Situaciones específicas", "📕 Maestría parental"];
    html += `<div class="card"><h3>${modNombres[modulo]}</h3><div class="grid-2">`;
    for (let dia = inicio; dia <= fin && dia <= totalDias; dia++) {
      const completado = cursoEstado.completados.includes(dia);
      const bloqueado = dia > cursoEstado.diaActual && !completado;
      html += `<div class="dia-card ${bloqueado ? 'bloqueado' : ''}">${completado ? '✅' : (bloqueado ? '🔒' : '📖')} <strong>Día ${dia}</strong>: ${lecciones[dia]?.titulo}${!bloqueado && !completado ? `<br><button class="btn-dia" data-dia="${dia}">Ver lección</button>` : (bloqueado ? '<br><small>🔓 Completa el día anterior</small>' : '<br><small>✔ Completado</small>')}</div>`;
    }
    html += `</div></div>`;
  }
  document.getElementById("contenido").innerHTML = html;
  document.querySelectorAll(".btn-dia").forEach(btn => { btn.onclick = () => mostrarLeccion(parseInt(btn.getAttribute("data-dia"))); });
  document.getElementById("btnSimulador")?.addEventListener("click", mostrarSimulador);
  document.getElementById("btnEstadisticas")?.addEventListener("click", mostrarEstadisticas);
  document.getElementById("btnPlanificador")?.addEventListener("click", mostrarPlanificador);
  document.getElementById("btnConfig")?.addEventListener("click", mostrarConfiguracion);
}

function mostrarLeccion(dia) {
  const lec = lecciones[dia];
  if (!lec) return;
  if (vozActiva) hablar(`Día ${dia}. ${lec.titulo}. ${lec.teoria.substring(0, 300)}`);
  
  let testHTML = "";
  if (lec.tieneTest) {
    testHTML = generarTestCompleto();
  }
  
  const html = `<div class="card"><h2>${lec.titulo}</h2><p><strong>🎯 OBJETIVO:</strong> ${lec.objetivo}</p><h3>📖 TEORÍA</h3><p>${lec.teoria}</p><h3>📌 2 EJEMPLOS</h3>${lec.ejemplos.map(e=>`<div class="ejemplo">${e}</div>`).join('')}<h3>✏️ 3 ACTIVIDADES</h3>${lec.actividades.map(a=>`<div class="actividad">${a}</div>`).join('')}<h3>🛠️ TÉCNICAS</h3><div>${lec.tecnicas.map(t=>`<span class="badge-tecnica">🔧 ${t}</span>`).join(' ')}</div><h3>🧠 HABILIDADES</h3><div>${lec.habilidades.map(h=>`<span class="badge-habilidad">⭐ ${h}</span>`).join(' ')}</div><h3>⚠️ ERRORES COMUNES</h3><ul>${lec.errores.map(e=>`<li>${e}</li>`).join('')}</ul><h3>💬 FRASES CLAVE</h3>${lec.frases.map(f=>`<div class="frase-destacada">“${f}”</div>`).join('')}<h3>🧰 HERRAMIENTAS</h3><div>${lec.herramientas.map(h=>`<span class="badge-herramienta">📦 ${h}</span>`).join(' ')}</div><textarea id="reflexionDia" rows="4" placeholder="✍️ Tu reflexión del día..." style="width:100%; margin:1rem 0;"></textarea><button id="completarDiaBtn" class="juego" data-dia="${dia}">✅ Marcar Día ${dia} como completado</button></div>${testHTML}<button id="volverMapa" class="juego">🗺️ Volver al mapa</button>`;
  
  document.getElementById("contenido").innerHTML = html;
  document.getElementById("completarDiaBtn").onclick = () => {
    const reflexion = document.getElementById("reflexionDia").value;
    if (reflexion.length < 20) { alert("Escribe una reflexión más detallada (mínimo 20 caracteres)"); return; }
    let reflexiones = JSON.parse(localStorage.getItem("reflexionesDias") || "{}");
    reflexiones[dia] = reflexion;
    localStorage.setItem("reflexionesDias", JSON.stringify(reflexiones));
    completarDia(dia);
    alert(`✅ Día ${dia} completado!`);
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
      else if (total <= 24) { estilo = "🟢 DEMOCRÁTICO/ASERTIVO"; mensaje = "¡Excelente equilibrio! Sigues así. Te recomendamos: compartir tu experiencia con otros padres, eres un modelo a seguir."; }
      else { estilo = "⚫ NEGLIGENTE"; mensaje = "Hay poca implicación en la crianza. Te recomendamos: dedicar 15 minutos diarios de atención plena a tu hijo, y buscar apoyo si te sientes abrumado."; }
      
      cursoEstado.estiloCrianza = estilo;
      guardarProgreso();
      document.getElementById("resultadoTest").innerHTML = `<div style="background:#e8f5e9; padding:1.5rem; border-radius:1rem;"><h3>🎭 Tu estilo de crianza es: ${estilo}</h3><p>${mensaje}</p><p><strong>Puntaje total:</strong> ${total} puntos (rango 0-30)</p><p>📌 Continúa con el Día 2 para profundizar en los 10 mandamientos.</p></div>`;
    };
  }
}

function iniciarApp() {
  cargarProgreso();
  mostrarPantallaPrincipal();
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

iniciarApp();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
