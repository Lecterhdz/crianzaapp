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
// MÓDULO PREESCOLARES (3-5 AÑOS) - DÍAS 11 al 15
// =====================================================

// DÍA 11 - Manejo de rabietas en preescolares
lecciones[11] = {
  titulo: "😤 Día 11: Manejo de rabietas en niños de 3-5 años",
  objetivo: "Aprender a responder a las rabietas sin escalar el conflicto.",
  teoria: `
    <p>Las <strong>rabietas</strong> son normales en preescolares. Su cerebro aún no regula las emociones. No son manipulaciones, son crisis emocionales.</p>
    
    <p><strong>🔴 QUÉ NO HACER:</strong></p>
    <ul>
      <li>No gritar ni castigar (empeora la regulación)</li>
      <li>No ceder al chantaje (enseña que la rabieta funciona)</li>
      <li>No dejar al niño solo (necesita tu presencia para regularse)</li>
    </ul>
    
    <p><strong>🟢 QUÉ SÍ HACER (los 9 pasos):</strong></p>
    <ol>
      <li><strong>Respira</strong> - Regúlate primero tú</li>
      <li><strong>Arrodíllate</strong> - Ponte a su altura visual</li>
      <li><strong>Nombra la emoción</strong> - "Veo que estás muy enojado"</li>
      <li><strong>Valida sin ceder</strong> - "Está bien estar enojado, pero no se pega"</li>
      <li><strong>Ofrece calma física</strong> - Un abrazo si lo acepta</li>
      <li><strong>Espera el pico</strong> - No razones en el momento álgido</li>
      <li><strong>Límite breve</strong> - "Cuando te calmes, hablamos"</li>
      <li><strong>Redirige</strong> - Ofrece una alternativa después</li>
      <li><strong>Reconecta</strong> - Después de la tormenta, vuelve al vínculo</li>
    </ol>
    
    <p>💡 <em>La rabieta no es una emergencia. Es una oportunidad para enseñar regulación.</em></p>
  `,
  ejemplos: [
    "📖 Rabieta en supermercado: niño grita y se tira al suelo. Mamá respira, se agacha y dice: 'Veo que estás muy enojado porque no te compré el chocolate. Está bien enojarse. Te voy a cargar y vamos afuera un momento. Cuando te calmes, podemos volver.'",
    "📖 Rabieta por tener que apagar la tele: 'Sé que te gusta mucho ver Pepa. Está bien sentirse triste cuando se acaba. Apagamos juntos la tele. ¿Quieres elegir qué hacemos ahora, pintar o jugar con los bloques?'"
  ],
  actividades: [
    "🎲 ACTIVIDAD 1: La próxima rabieta, practica los 9 pasos. Respira antes de actuar.",
    "🎲 ACTIVIDAD 2: Crea un 'rincón de calma' en casa con cojines, un peluche y un papel con el semáforo de emociones.",
    "🎲 ACTIVIDAD 3: Ensaya con tu pareja o un espejo cómo te agacharías y qué dirías ante una rabieta."
  ],
  tecnicas: ["9 pasos para rabietas", "Rincón de calma", "Nombrar la emoción"],
  habilidades: ["Regulación emocional propia", "Paciencia activa", "Contención emocional"],
  errores: ["❌ Gritar '¡cállate!' o '¡deja de llorar!'", "❌ Ceder para que pare rápido", "❌ Dejar al niño solo en su habitación"],
  frases: ["'Veo que estás enojado. Está bien. Estoy aquí contigo.'", "'Cuando te calmes, te voy a abrazar fuerte.'"],
  herramientas: ["Rincón de calma", "Temporizador visual", "Póster del semáforo de emociones"]
};

// DÍA 12 - Control de esfínteres
lecciones[12] = {
  titulo: "🚽 Día 12: Control de esfínteres sin presión",
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

// DÍA 13 - Primeros límites y rutinas
lecciones[13] = {
  titulo: "🔒 Día 13: Primeros límites y rutinas para preescolares",
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

// DÍA 14 - Juego como herramienta de crianza
lecciones[14] = {
  titulo: "🎮 Día 14: El juego como herramienta de crianza",
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

// DÍA 15 - Emociones y vocabulario emocional
lecciones[15] = {
  titulo: "💖 Día 15: Enseñar inteligencia emocional a preescolares",
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
// Días 16 al 33
const temasDias = {
  11: { t:"📱 Día 16: Crianza y pantallas", obj:"Acuerdos digitales sin lucha", teo:"<p>Límites de tiempo + zonas libres de pantallas + modelo parental + alternativas creativas.</p><p>💡 <em>La mejor regla: nada de pantallas 1 hora antes de dormir.</em></p>" },
  12: { t:"👥 Día 17: Rivalidad entre hermanos", obj:"Mediar sin tomar partido", teo:"<p>Escucha a cada uno, no busques culpable, ayúdalos a encontrar su propia solución.</p><p>💡 <em>No hay un culpable, hay una oportunidad de aprender a resolver conflictos.</em></p>" },
  13: { t:"😴 Día 18: Sueño respetuoso", obj:"Rutinas de sueño sin castigo", teo:"<p>Consistencia + ambiente tranquilo + ritual de conexión previa (cuento, masaje).</p><p>💡 <em>El sueño no se negocia, se acompaña.</em></p>" },
  14: { t:"🍽️ Día 19: Alimentación sin lucha", obj:"Tú ofreces, ellos eligen", teo:"<p>No obligar a terminar el plato. Ellos regulan su hambre. Ofrece opciones sanas.</p><p>💡 <em>Tu trabajo es ofrecer comida sana. Su trabajo es decidir cuánto comer.</em></p>" },
  15: { t:"😤 Día 20: Manejo de rabietas", obj:"Responder sin escalar", teo:"<p><strong>9 pasos:</strong> respira, arrodíllate, nombra emoción, valida sin ceder, ofrece calma, espera el pico, límite breve, redirige, reconecta.</p><p>💡 <em>La rabieta no es una emergencia. Es una oportunidad para enseñar regulación.</em></p>" },
  16: { t:"🗣️ Día 21: Comunicación no violenta", obj:"Hablar sin etiquetas ni juicios", teo:"<p>Observación + sentimiento + necesidad + petición.</p><p><strong>Fórmula:</strong> 'Cuando veo X, me siento Y porque necesito Z. ¿Podrías...?'</p><p>💡 <em>Separa la acción de la persona: 'no me gusta que grites' no 'eres gritón'.</em></p>" },
  17: { t:"🎮 Día 22: Disciplina positiva", obj:"Enseñar en lugar de castigar", teo:"<p><strong>7 principios:</strong> firmeza y amabilidad, sentido de pertenencia, consecuencias lógicas, etc.</p><p>💡 <em>La disciplina enseña, el castigo humilla.</em></p>" },
  18: { t:"❤️ Día 23: Inteligencia emocional", obj:"Nombrar y gestionar emociones", teo:"<p>El cerebro emocional se entrena. Ayuda a tu hijo a identificar sensaciones corporales.</p><p>💡 <em>'¿Dónde sientes el enojo? ¿En las manos? ¿En la panza?'</em></p>" },
  19: { t:"🏠 Día 24: Rutinas que funcionan", obj:"Estructura sin rigidez", teo:"<p>Las rutinas dan seguridad. Usa tablas visuales, avisos previos, flexibilidad controlada.</p><p>💡 <em>Los niños se sienten seguros cuando saben qué sigue.</em></p>" },
  20: { t:"🧠 Día 25: Crianza y neurodivergencia", obj:"Adaptar técnicas a cada niño", teo:"<p>No todos los niños responden igual. Ajusta tiempos, estímulos y expectativas.</p><p>💡 <em>Lo que funciona para uno, no funciona para otro. Observa a tu hijo.</em></p>" },
  21: { t:"👪 Día 26: Co-parentalidad", obj:"Consistencia entre adultos cuidadores", teo:"<p>Acuerdos escritos, comunicación respetuosa, no desautorizar al otro frente al niño.</p><p>💡 <em>La peor herencia es la inconsistencia entre adultos.</em></p>" },
  22: { t:"🛡️ Día 27: Prevención de abuso", obj:"Enseñar límites corporales", teo:"<p>Cuerpo es mío, secretos buenos y malos, buscar ayuda si algo incomoda.</p><p>💡 <em>Enseña: 'tu cuerpo es tuyo y nadie puede tocarlo sin tu permiso'.</em></p>" },
  23: { t:"🎭 Día 28: Crianza en divorcio", obj:"Proteger el vínculo", teo:"<p>No hables mal del otro progenitor. El niño no es mensajero ni aliado.</p><p>💡 <em>Tu hijo no necesita elegir entre amarte a ti o al otro.</em></p>" },
  24: { t:"🌱 Día 29: Adolescencia respetuosa", obj:"Autonomía con guía", teo:"<p>Negociar, no imponer. Escucha más de lo que hablas. Elige tus batallas.</p><p>💡 <em>La adolescencia es el ensayo para la adultez. Permite errores pequeños.</em></p>" },
  25: { t:"🧘 Día 30: Mindfulness parental", obj:"Respirar antes de reaccionar", teo:"<p>La presencia plena reduce los conflictos. Entrena la pausa.</p><p>💡 <em>Tu calma es su ancla. Si tú te desregulas, él también.</em></p>" },
  26: { t:"📖 Día 31: Cuentos como herramienta", obj:"Usar narrativa para enseñar", teo:"<p>Los cuentos permiten abordar temas difíciles sin confrontación directa.</p><p>💡 <em>Un cuento puede enseñar lo que una regaño no logra.</em></p>" },
  27: { t:"🔁 Día 32: Reparación después del error", obj:"Pedir disculpas sinceras", teo:"<p>El error bien reparado fortalece el vínculo más que el acierto.</p><p>💡 <em>Pedir disculpas a tu hijo no te quita autoridad, te da respeto.</em></p>" },
  28: { t:"🏅 Día 33: Maestría parental", obj:"Celebrar el recorrido", teo:"<p>No hay padres perfectos, sí conscientes. Cada día cuenta.</p><p>🎉 <strong>¡FELICIDADES! Has completado los 28 días.</strong> Eres un ejemplo de compromiso.</p>" }
};

for (let i = 16; i <= 33; i++) {
  let tema = temasDias[i];
  lecciones[i] = {
    titulo: tema.t,
    objetivo: tema.obj,
    teoria: tema.teo,
    ejemplos: [`📖 Ejemplo 1 de "${tema.t}": Situación cotidiana donde aplicas este principio.`, `📖 Ejemplo 2: Otro escenario diferente, mostrando la flexibilidad de la técnica.`],
    actividades: ["🎲 ACTIVIDAD 1: Identifica una situación hoy donde puedas aplicar este tema.", "🎲 ACTIVIDAD 2: Practica conscientemente la técnica principal de hoy.", "🎲 ACTIVIDAD 3: Escribe una breve reflexión sobre cómo te sentiste al aplicarlo."],
    tecnicas: ["Técnica central del día", "Refuerzo positivo", "Pausa reflexiva"],
    habilidades: ["Habilidad parental clave", "Regulación emocional", "Comunicación efectiva"],
    errores: ["❌ Error común 1 relacionado", "❌ Error común 2 que debes evitar"],
    frases: [`"Frase clave para recordar: ${tema.t.split(':')[0]}"`, "'La práctica hace al maestro.'"],
    herramientas: ["Herramienta sugerida", "Recurso complementario"],
    tieneTest: false
  };
}

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
  const porcentajeTotal = (totalCompletados / 28) * 100;
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

function mostrarPantallaPrincipal() {
  const totalDias = 28;
  const completados = cursoEstado.completados.length;
  const progreso = Math.round((completados / totalDias) * 100);
  
  let html = `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">
        <h2>🗺️ Curso de crianza - 28 días</h2>
        <div>
          <button id="btnSimulador" class="juego" style="background:#9C27B0;">🎭 Simulador</button>
          <button id="btnEstadisticas" class="juego" style="background:#2196F3;">📊 Stats</button>
          <button id="btnPlanificador" class="juego" style="background:#FF9800;">📅 Plan</button>
          <button id="btnConfig" class="juego" style="background:#607D8B;">⚙️ Config</button>
        </div>
      </div>
      <div class="progreso-bar"><div class="progreso-fill" style="width:${progreso}%;">${progreso}%</div></div>
      <p>🔥 Racha: ${cursoEstado.racha} días | ✅ Completados: ${completados}/${totalDias} | 🏅 Medallas: ${cursoEstado.medallas.length}</p>
      ${cursoEstado.estiloCrianza ? `<p>🎭 Tu estilo identificado: ${cursoEstado.estiloCrianza}</p>` : '<p>📝 Completa el <strong>Día 1</strong> para conocer tu estilo de crianza.</p>'}
      ${cursoEstado.diaActual > totalDias ? '<p>🎉 ¡FELICIDADES! Completaste el curso. Descarga tu certificado desde la sección de estadísticas.</p>' : ''}
    </div>
  `;
  
  for (let modulo = 0; modulo < 4; modulo++) {
    const inicio = modulo * 7 + 1;
    const fin = inicio + 6;
    const modNombres = ["📘 MÓDULO 1: Fundamentos", "📙 MÓDULO 2: Habilidades prácticas", "📒 MÓDULO 3: Situaciones específicas", "📕 MÓDULO 4: Maestría parental"];
    html += `<div class="card"><h3>${modNombres[modulo]}</h3><div class="grid-2">`;
    for (let dia = inicio; dia <= fin && dia <= totalDias; dia++) {
      const completado = cursoEstado.completados.includes(dia);
      const bloqueado = dia > cursoEstado.diaActual && !completado;
      html += `
        <div class="dia-card ${bloqueado ? 'bloqueado' : ''}">
          ${completado ? '✅' : (bloqueado ? '🔒' : '📖')} <strong>Día ${dia}</strong>: ${lecciones[dia]?.titulo || `Tema ${dia}`}
          ${!bloqueado && !completado ? `<br><button class="btn-dia" data-dia="${dia}">Ver lección</button>` : (bloqueado ? '<br><small>🔓 Completa el día anterior para desbloquear</small>' : '<br><small>✔ Completado</small>')}
        </div>
      `;
    }
    html += `</div></div>`;
  }
  
  document.getElementById("contenido").innerHTML = html;
  
  document.querySelectorAll(".btn-dia").forEach(btn => {
    btn.onclick = () => mostrarLeccion(parseInt(btn.getAttribute("data-dia")));
  });
  
  document.getElementById("btnSimulador")?.addEventListener("click", mostrarSimulador);
  document.getElementById("btnEstadisticas")?.addEventListener("click", mostrarEstadisticas);
  document.getElementById("btnPlanificador")?.addEventListener("click", mostrarPlanificador);
  document.getElementById("btnConfig")?.addEventListener("click", mostrarConfiguracion);
}

function mostrarLeccion(dia) {
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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
