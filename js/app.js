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

// Días 11 al 28
const temasDias = {
  11: { t:"📱 Día 11: Crianza y pantallas", obj:"Acuerdos digitales sin lucha", teo:"<p>Límites de tiempo + zonas libres de pantallas + modelo parental + alternativas creativas.</p><p>💡 <em>La mejor regla: nada de pantallas 1 hora antes de dormir.</em></p>" },
  12: { t:"👥 Día 12: Rivalidad entre hermanos", obj:"Mediar sin tomar partido", teo:"<p>Escucha a cada uno, no busques culpable, ayúdalos a encontrar su propia solución.</p><p>💡 <em>No hay un culpable, hay una oportunidad de aprender a resolver conflictos.</em></p>" },
  13: { t:"😴 Día 13: Sueño respetuoso", obj:"Rutinas de sueño sin castigo", teo:"<p>Consistencia + ambiente tranquilo + ritual de conexión previa (cuento, masaje).</p><p>💡 <em>El sueño no se negocia, se acompaña.</em></p>" },
  14: { t:"🍽️ Día 14: Alimentación sin lucha", obj:"Tú ofreces, ellos eligen", teo:"<p>No obligar a terminar el plato. Ellos regulan su hambre. Ofrece opciones sanas.</p><p>💡 <em>Tu trabajo es ofrecer comida sana. Su trabajo es decidir cuánto comer.</em></p>" },
  15: { t:"😤 Día 15: Manejo de rabietas", obj:"Responder sin escalar", teo:"<p><strong>9 pasos:</strong> respira, arrodíllate, nombra emoción, valida sin ceder, ofrece calma, espera el pico, límite breve, redirige, reconecta.</p><p>💡 <em>La rabieta no es una emergencia. Es una oportunidad para enseñar regulación.</em></p>" },
  16: { t:"🗣️ Día 16: Comunicación no violenta", obj:"Hablar sin etiquetas ni juicios", teo:"<p>Observación + sentimiento + necesidad + petición.</p><p><strong>Fórmula:</strong> 'Cuando veo X, me siento Y porque necesito Z. ¿Podrías...?'</p><p>💡 <em>Separa la acción de la persona: 'no me gusta que grites' no 'eres gritón'.</em></p>" },
  17: { t:"🎮 Día 17: Disciplina positiva", obj:"Enseñar en lugar de castigar", teo:"<p><strong>7 principios:</strong> firmeza y amabilidad, sentido de pertenencia, consecuencias lógicas, etc.</p><p>💡 <em>La disciplina enseña, el castigo humilla.</em></p>" },
  18: { t:"❤️ Día 18: Inteligencia emocional", obj:"Nombrar y gestionar emociones", teo:"<p>El cerebro emocional se entrena. Ayuda a tu hijo a identificar sensaciones corporales.</p><p>💡 <em>'¿Dónde sientes el enojo? ¿En las manos? ¿En la panza?'</em></p>" },
  19: { t:"🏠 Día 19: Rutinas que funcionan", obj:"Estructura sin rigidez", teo:"<p>Las rutinas dan seguridad. Usa tablas visuales, avisos previos, flexibilidad controlada.</p><p>💡 <em>Los niños se sienten seguros cuando saben qué sigue.</em></p>" },
  20: { t:"🧠 Día 20: Crianza y neurodivergencia", obj:"Adaptar técnicas a cada niño", teo:"<p>No todos los niños responden igual. Ajusta tiempos, estímulos y expectativas.</p><p>💡 <em>Lo que funciona para uno, no funciona para otro. Observa a tu hijo.</em></p>" },
  21: { t:"👪 Día 21: Co-parentalidad", obj:"Consistencia entre adultos cuidadores", teo:"<p>Acuerdos escritos, comunicación respetuosa, no desautorizar al otro frente al niño.</p><p>💡 <em>La peor herencia es la inconsistencia entre adultos.</em></p>" },
  22: { t:"🛡️ Día 22: Prevención de abuso", obj:"Enseñar límites corporales", teo:"<p>Cuerpo es mío, secretos buenos y malos, buscar ayuda si algo incomoda.</p><p>💡 <em>Enseña: 'tu cuerpo es tuyo y nadie puede tocarlo sin tu permiso'.</em></p>" },
  23: { t:"🎭 Día 23: Crianza en divorcio", obj:"Proteger el vínculo", teo:"<p>No hables mal del otro progenitor. El niño no es mensajero ni aliado.</p><p>💡 <em>Tu hijo no necesita elegir entre amarte a ti o al otro.</em></p>" },
  24: { t:"🌱 Día 24: Adolescencia respetuosa", obj:"Autonomía con guía", teo:"<p>Negociar, no imponer. Escucha más de lo que hablas. Elige tus batallas.</p><p>💡 <em>La adolescencia es el ensayo para la adultez. Permite errores pequeños.</em></p>" },
  25: { t:"🧘 Día 25: Mindfulness parental", obj:"Respirar antes de reaccionar", teo:"<p>La presencia plena reduce los conflictos. Entrena la pausa.</p><p>💡 <em>Tu calma es su ancla. Si tú te desregulas, él también.</em></p>" },
  26: { t:"📖 Día 26: Cuentos como herramienta", obj:"Usar narrativa para enseñar", teo:"<p>Los cuentos permiten abordar temas difíciles sin confrontación directa.</p><p>💡 <em>Un cuento puede enseñar lo que una regaño no logra.</em></p>" },
  27: { t:"🔁 Día 27: Reparación después del error", obj:"Pedir disculpas sinceras", teo:"<p>El error bien reparado fortalece el vínculo más que el acierto.</p><p>💡 <em>Pedir disculpas a tu hijo no te quita autoridad, te da respeto.</em></p>" },
  28: { t:"🏅 Día 28: Maestría parental", obj:"Celebrar el recorrido", teo:"<p>No hay padres perfectos, sí conscientes. Cada día cuenta.</p><p>🎉 <strong>¡FELICIDADES! Has completado los 28 días.</strong> Eres un ejemplo de compromiso.</p>" }
};

for (let i = 11; i <= 28; i++) {
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
