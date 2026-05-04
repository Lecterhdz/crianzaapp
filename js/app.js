// ==============================
// app.js - Manual de Crianza PWA
// Curso interactivo + Reto diario
// ==============================

// --- NUEVO: Sistema de progreso en sesión (Reto diario) ---
let puntos = 0;
let retosCompletados = [];

function actualizarUIProgreso() {
  const contadorSpan = document.getElementById("contadorPuntos");
  const nivelSpan = document.getElementById("nivelPadre");
  if (contadorSpan) contadorSpan.innerText = puntos;
  if (nivelSpan) {
    if (puntos < 3) nivelSpan.innerText = "🌱 Principiante amoroso";
    else if (puntos < 7) nivelSpan.innerText = "💪 Cuidador en práctica";
    else nivelSpan.innerText = "🧘 Maestro de la crianza consciente";
  }
  const historialUl = document.getElementById("historialRetos");
  if (historialUl) {
    historialUl.innerHTML = retosCompletados.map(r => `<li>✅ ${r}</li>`).join("");
    if (retosCompletados.length === 0) historialUl.innerHTML = "<li>✨ Aún no haces ningún reto hoy</li>";
  }
  
  // NUEVO: Badge sorpresa al llegar a 5 puntos
  if (puntos === 5 && !window.vistoBadge5) {
    alert("🎉 ¡Has completado 5 retos! Eres un ejemplo de compromiso. Sigue así.");
    window.vistoBadge5 = true;
  }
}

// Banco de retos diarios (interactivos)
const bancoRetos = [
  {
    texto: "Completa la frase: 'Cuando mi hijo se frustra, en lugar de castigar, puedo _______'",
    tipo: "texto",
    evaluar: (resp) => resp.toLowerCase().includes("respir") || resp.toLowerCase().includes("calma") || resp.toLowerCase().includes("abrazar"),
    pista: "valida su emoción, respira profundo"
  },
  {
    texto: "Elige la opción democrática: Tu hijo no quiere bañarse. ¿Qué dices?",
    tipo: "multiple",
    opciones: ["'¡A la ducha ahora o sin tele!'", "'Entiendo que no quieras, pero toca bañarse. ¿Llevas tu pato o la pelota?'", "'Bueno, no te bañes hoy'"],
    correcta: 1,
    pista: "La que valida + ofrece opción dentro del límite"
  },
  {
    texto: "Escenario: Tu hijo de 4 años tira un juguete por enojo. ¿Qué técnica democrática aplicas? (escribe tu respuesta breve)",
    tipo: "texto",
    evaluar: (resp) => resp.toLowerCase().includes("nombrar") || resp.toLowerCase().includes("emoción") || resp.toLowerCase().includes("consecuencia"),
    pista: "Nombra la emoción + consecución lógica: 'Estás enojado, pero los juguetes no se tiran. Recógelo o lo guardamos 10 min'"
  },
  {
    texto: "Completa: 'Un límite claro sin gritos se dice: entiendo que ______, sin embargo ______'",
    tipo: "texto",
    evaluar: (resp) => resp.length > 10,
    pista: "Ej: 'entiendo que quieras seguir jugando, sin embargo es hora de cenar'"
  },
  {
    texto: "Verdadero o falso: 'Ignorar una conducta leve (como quejidos) a veces es una buena técnica democrática.'",
    tipo: "vf",
    correctaVF: true,
    pista: "Verdadero: ignorar planificadamente funciona si no hay riesgo."
  }
];

let retoActualIndex = 0;
window.retoActual = null;

function cargarRetoAleatorio() {
  const nuevoIndex = Math.floor(Math.random() * bancoRetos.length);
  retoActualIndex = nuevoIndex;
  window.retoActual = bancoRetos[nuevoIndex];
  const preguntaDiv = document.getElementById("retoPregunta");
  const inputArea = document.getElementById("retoInputArea");
  if (!preguntaDiv) return;

  preguntaDiv.innerHTML = `<p><strong>${window.retoActual.texto}</strong></p>`;
  
  if (window.retoActual.tipo === "multiple") {
    let html = "";
    window.retoActual.opciones.forEach((op, idx) => {
      html += `<label><input type="radio" name="respuestaMultiple" value="${idx}"> ${op}</label><br>`;
    });
    inputArea.innerHTML = html;
  } else if (window.retoActual.tipo === "vf") {
    inputArea.innerHTML = `
      <label><input type="radio" name="vf" value="true"> Verdadero</label><br>
      <label><input type="radio" name="vf" value="false"> Falso</label>
    `;
  } else {
    inputArea.innerHTML = `<input type="text" id="respTexto" placeholder="Escribe tu respuesta..." style="width:100%; padding:8px;">`;
  }
}

function verificarRespuestaReto() {
  if (!window.retoActual) return;
  let esCorrecto = false;
  let respuestaUsuario = "";

  if (window.retoActual.tipo === "multiple") {
    const seleccion = document.querySelector('input[name="respuestaMultiple"]:checked');
    if (seleccion && parseInt(seleccion.value) === window.retoActual.correcta) esCorrecto = true;
    respuestaUsuario = seleccion ? seleccion.value : "ninguna";
  } 
  else if (window.retoActual.tipo === "vf") {
    const seleccion = document.querySelector('input[name="vf"]:checked');
    if (seleccion && (seleccion.value === "true") === window.retoActual.correctaVF) esCorrecto = true;
    respuestaUsuario = seleccion ? seleccion.value : "ninguna";
  }
  else {
    const texto = document.getElementById("respTexto");
    if (texto && window.retoActual.evaluar(texto.value)) esCorrecto = true;
    respuestaUsuario = texto ? texto.value : "";
  }

  const feedback = document.getElementById("feedbackReto");
  if (esCorrecto) {
    if (!retosCompletados.includes(window.retoActual.texto)) {
      puntos++;
      retosCompletados.push(window.retoActual.texto);
      actualizarUIProgreso();
      feedback.innerHTML = "✅ ¡Muy bien! Has ganado 1 punto. Sigue creciendo en tu crianza.";
    } else {
      feedback.innerHTML = "🔁 Ya completaste este reto hoy. Prueba con 'Siguiente reto'.";
    }
  } else {
    feedback.innerHTML = `❌ Casi. Pista: ${window.retoActual.pista}. Vuelve a intentarlo o pasa al siguiente.`;
  }
}

function activarReto() {
  cargarRetoAleatorio();
  actualizarUIProgreso();
  const btnResponder = document.getElementById("btnResponderReto");
  const btnSiguiente = document.getElementById("siguienteReto");
  if (btnResponder) btnResponder.onclick = verificarRespuestaReto;
  if (btnSiguiente) btnSiguiente.onclick = () => {
    cargarRetoAleatorio();
    document.getElementById("feedbackReto").innerHTML = "";
    const inputArea = document.getElementById("retoInputArea");
    if(inputArea) inputArea.innerHTML = "";
  };
}

// ==============================
// CONTENIDO DE TODAS LAS SECCIONES
// ==============================
const contenido = {
  inicio: `
    <div class="card">
      <h2>🌸 Bienvenida</h2>
      <p>Esta PWA te acompaña a criar desde el respeto, los límites claros y el amor consciente.</p>
      <p><strong>Edades:</strong> 0 a 12 años (con adaptaciones para cada etapa).</p>
    </div>
    <div class="card">
      <h3>📌 Los 10 mandamientos de la crianza positiva</h3>
      <ol>
        <li>1️⃣ Conecta antes de corregir</li>
        <li>2️⃣ Escucha sin juzgar</li>
        <li>3️⃣ Pon límites firmes pero amables</li>
        <li>4️⃣ Valida todas las emociones</li>
        <li>5️⃣ No pegues, no grites</li>
        <li>6️⃣ Sé el ejemplo que quieres ver</li>
        <li>7️⃣ Cada niño tiene su ritmo</li>
        <li>8️⃣ El juego es el mejor aprendizaje</li>
        <li>9️⃣ El error es oportunidad</li>
        <li>🔟 Cuídate para poder cuidar</li>
      </ol>
    </div>
    <div class="card">
      <h3>🧩 Los 4 pilares</h3>
      <ul><li>Vínculo seguro</li><li>Comunicación respetuosa</li><li>Límites claros</li><li>Autocuidado del adulto</li></ul>
    </div>
    <div class="card">
      <h3>✨ Los 7 principios de la crianza (Gordon, Siegel, etc)</h3>
      <ul><li>Empatía</li><li>Escucha activa</li><li>Consistencia</li><li>Respeto mutuo</li><li>Autonomía guiada</li><li>Disciplina positiva</li><li>Regulación emocional compartida</li></ul>
    </div>
  `,
  
  edades: `
    <div class="grid-2">
      <div class="card"><h3>👶 0-2 años</h3><p>Seguridad, contacto, llanto como comunicación. No se malcría con amor.</p></div>
      <div class="card"><h3>🧒 3-5 años</h3><p>Límites simples, opciones limitadas, manejo de rabietas con calma.</p></div>
      <div class="card"><h3>📚 6-8 años</h3><p>Normas claras, consecuencias lógicas, fomento de autonomía.</p></div>
      <div class="card"><h3>💻 9-12 años</h3><p>Acuerdos digitales, emociones complejas, diálogo abierto.</p></div>
    </div>
  `,
  
  // NUEVO: Sección completa de estilos con habilidades y técnicas
  estilos: `
    <div class="card">
      <h2>📊 Los 4 estilos de crianza</h2>
      <p>Se definen por dos ejes: <strong>Afecto (calidez)</strong> y <strong>Control (exigencia/disciplina)</strong>.</p>
      <table style="width:100%; border-collapse:collapse; margin:1rem 0;">
        <tr style="background:#4CAF50; color:white;"><th>Estilo</th><th>Afecto</th><th>Control</th><th>Resultado</th></tr>
        <tr style="background:#f0f0f0;"><tr>🔹 Autoritario</th><td>Bajo</td><td>Alto</td><td>Miedo, baja autoestima</td></tr>
        <tr><td>✅ Democrático / Asertivo</td><td>Alto</td><td>Alto (pero flexible)</td><td>Seguro, autónomo, feliz</td></tr>
        <tr style="background:#f0f0f0;"><td>🔸 Permisivo</td><td>Alto</td><td>Bajo</td><td>Sin límites, baja frustración</td></tr>
        <tr><td>⚫ Negligente</td><td>Bajo</td><td>Bajo</td><td>Abandono, inseguridad grave</td></tr>
      可能
    </div>

    <div class="card">
      <h3>🛠️ Habilidades por estilo de crianza</h3>
      <div class="grid-2">
        <div class="card"><h4>📌 Autoritario</h4><ul><li>Imponer reglas sin explicación</li><li>Castigo como herramienta principal</li><li>Poca validación emocional</li><li>"Porque lo digo yo"</li></ul><p><em>⚠️ No recomendado</em></p></div>
        <div class="card"><h4>🌟 Democrático / Asertivo (ideal)</h4><ul><li>Escucha activa</li><li>Poner límites con empatía</li><li>Negociar opciones dentro de lo no negociable</li><li>Enseñar consecuencias lógicas</li><li>Validar emociones + mantener la norma</li><li>Modelar regulación emocional</li></ul></div>
        <div class="card"><h4>🍃 Permisivo</h4><ul><li>Evitar el conflicto</li><li>Ceder ante la rabieta</li><li>Pocas rutinas o límites</li></ul><p><em>⚠️ Genera baja tolerancia a la frustración</em></p></div>
        <div class="card"><h4>🌪️ Negligente</h4><ul><li>Ausencia de respuesta</li><li>Indiferencia ante necesidades</li><li>Sin supervisión ni afecto</li></ul><p><em>🚨 El más dañino. Buscar ayuda profesional</em></p></div>
      </div>
    </div>

    <div class="card">
      <h3>🎯 Técnicas específicas para el estilo DEMOCRÁTICO</h3>
      <ul>
        <li><strong>1. Opción limitada</strong> → "¿Te bañas antes o después de recoger?"</li>
        <li><strong>2. Consecuencia lógica</strong> → Si no guarda la comida, se termina la hora de juego</li>
        <li><strong>3. Reunión familiar semanal</strong> → niños opinan sobre 1 regla</li>
        <li><strong>4. Rueda de opciones emocionales</strong> → dibujar 4 soluciones</li>
        <li><strong>5. Ignorar planificadamente</strong> → conductas leves sin peligro</li>
        <li><strong>6. Tiempo fuera positivo</strong> → rincón de calma</li>
        <li><strong>7. Elogio descriptivo</strong> → "Me encanta cómo guardaste los libros"</li>
      </ul>
    </div>

    <div class="card">
      <h3>🧪 Ejercicio interactivo: identifica el estilo</h3>
      <div id="quizEstilos">
        <p><strong>Frase 1:</strong> "Si no terminas la tarea, te quedas sin cena y sin celular por una semana". ¿Qué estilo es?</p>
        <button class="respuesta-quiz" data-estilo="autoritario">Autoritario</button>
        <button class="respuesta-quiz" data-estilo="democratico">Democrático</button>
        <button class="respuesta-quiz" data-estilo="permisivo">Permisivo</button>
        <p id="feedbackQuiz"></p>
      </div>
      <div id="quizEstilos2">
        <p><strong>Frase 2:</strong> "Sé que estás enojado porque quieres seguir jugando. Podemos jugar 10 minutos más y luego tú apagas la tablet. ¿Te parece?"</p>
        <button class="respuesta-quiz2" data-estilo="autoritario">Autoritario</button>
        <button class="respuesta-quiz2" data-estilo="democratico">Democrático</button>
        <button class="respuesta-quiz2" data-estilo="permisivo">Permisivo</button>
        <p id="feedbackQuiz2"></p>
      </div>
    </div>

    <div class="card">
      <h3>📌 ¿Cómo pasar de otro estilo al democrático?</h3>
      <ul>
        <li>🔁 Si eras autoritario: empieza por validar emociones 1 vez al día</li>
        <li>🔁 Si eras permisivo: elige 1 límite no negociable por semana</li>
        <li>🔁 Si eras negligente: rutina simple de 10 min diarios de atención plena</li>
      </ul>
    </div>
  `,
  
  interactivo: `
    <div class="card">
      <h3>✏️ Completa la frase (crianza positiva)</h3>
      <div class="interactivo-frase" id="fraseJuego">
        <p>"Cuando mi hijo grita, en lugar de gritar, puedo _______"</p>
        <input type="text" id="respuestaFrase" placeholder="Escribe tu respuesta...">
        <button class="juego" id="validarFrase">Ver idea</button>
        <p id="feedbackFrase"></p>
      </div>
    </div>
    <div class="card">
      <h3>🎲 Actividad: ¿Qué harías?</h3>
      <p><strong>Escenario:</strong> Tu hijo de 5 años no quiere vestirse.</p>
      <button class="juego" id="verEstrategia">Mostrar estrategia</button>
      <p id="estrategiaResultado"></p>
    </div>
    <div class="card">
      <h3>📝 Los 9 pasos para gestionar una rabieta</h3>
      <ol><li>Respira</li><li>Arrodíllate a su altura</li><li>Nombra su emoción</li><li>Valida sin ceder</li><li>Ofrece calma física (si acepta)</li><li>Espera a que pase el pico</li><li>Límite breve</li><li>Redirige</li><li>Reconecta</li></ol>
    </div>
  `,
  
  herramientas: `
    <div class="card"><h3>🛠️ Herramientas prácticas</h3>
      <ul><li>Rutinas visuales</li><li>Timer para transiciones</li><li>Bote de la calma</li><li>Silla de pensar (reflexión, no castigo)</li><li>Diálogo de emociones</li></ul>
    </div>
    <div class="card"><h3>⚡ Estrategias de comportamiento</h3>
      <ul><li>Ignorar conductas leves sin riesgo</li><li>Consecuencias lógicas (no castigos)</li><li>Refuerzo positivo específico</li><li>Economía de fichas (6+ años)</li></ul>
    </div>
    <div class="card"><h3>🔑 5 reglas de oro</h3>
      <ul><li>1. No negociar la seguridad</li><li>2. Tu calma es su ancla</li><li>3. Síguele la pista a la emoción</li><li>4. El ejemplo siempre enseña</li><li>5. Cada día es nuevo</li></ul>
    </div>
  `,
  
  errores: `
    <div class="card"><h3>⚠️ Errores comunes en la crianza</h3>
      <ul><li>Gritar como primera reacción</li><li>Inconsistencia entre adultos</li><li>No validar emociones "difíciles"</li><li>Sobreproteger / no dejar equivocarse</li><li>Comparar con otros niños</li><li>Descuidar el propio bienestar</li></ul>
    </div>
    <div class="card"><h3>🧘 Claves finales</h3>
      <p>La crianza no es perfección, es reparación. Si hoy te equivocaste, pide disculpas y vuelve a conectar.</p>
    </div>
  `,
  
  // NUEVO: Sección de Reto Diario
  reto: `
    <div class="card">
      <h2>🌟 Ejercicio diario de crianza</h2>
      <p>Completa un reto corto cada día. Vas acumulando <strong>puntos de conexión</strong> (se reinician al cerrar, pero te llevas el aprendizaje).</p>
      <div id="puntosPanel" style="background:#ffeb3b; padding:0.5rem; border-radius:1rem; text-align:center; margin:1rem 0;">
        🧸 Puntos hoy: <span id="contadorPuntos">0</span>  
        🎯 Nivel: <span id="nivelPadre">Principiante amoroso</span>
      </div>
    </div>

    <div class="card" id="retoContainer">
      <h3>🧩 Reto del día</h3>
      <div id="retoPregunta"></div>
      <div id="retoInputArea"></div>
      <button id="btnResponderReto" class="juego">Responder y ganar punto</button>
      <p id="feedbackReto" style="margin-top:1rem;"></p>
    </div>

    <div class="card">
      <h3>📜 Historial de retos hechos hoy</h3>
      <ul id="historialRetos"></ul>
      <button id="siguienteReto" class="juego">🔄 Siguiente reto (cambia el ejercicio)</button>
    </div>
  `,
  test: `
  <div class="card">
    <h2>📋 Test de estilo de crianza</h2>
    <p>Responde con honestidad. No hay respuestas "malas", solo oportunidades para crecer.</p>
    <p><strong>Instrucción:</strong> Elige la opción que más se acerque a lo que harías habitualmente.</p>
  </div>

  <form id="testCrianza">
    <!-- 10 preguntas -->
    <div class="card"><p><strong>1.</strong> Tu hijo/a tiene una rabieta en público porque quiere un juguete. Tú...</p>
      <label><input type="radio" name="p1" value="0"> Le compro el juguete para que se calme</label><br>
      <label><input type="radio" name="p1" value="1"> Le grito que pare o lo amenazo con castigo</label><br>
      <label><input type="radio" name="p1" value="2"> Lo tomo, me retiro del lugar y luego hablamos de su emoción</label><br>
      <label><input type="radio" name="p1" value="3"> Lo ignoro o le digo "no me importa"</label>
    </div>

    <div class="card"><p><strong>2.</strong> Antes de poner una norma nueva, tú...</p>
      <label><input type="radio" name="p2" value="0"> Se la impongo sin explicación</label><br>
      <label><input type="radio" name="p2" value="1"> Se la explico y negocio los límites dentro de lo seguro</label><br>
      <label><input type="radio" name="p2" value="2"> No pongo normas, para no generar conflicto</label><br>
      <label><input type="radio" name="p2" value="3"> Simplemente no hay normas consistentes</label>
    </div>

    <div class="card"><p><strong>3.</strong> Cuando tu hijo/a logra algo importante (aunque sea pequeño), tú...</p>
      <label><input type="radio" name="p3" value="0"> Le digo "bien, pero puedes hacerlo mejor"</label><br>
      <label><input type="radio" name="p3" value="1"> Celebro su esfuerzo específico ("me encanta cómo lo intentaste")</label><br>
      <label><input type="radio" name="p3" value="2"> Le doy regalos o comida por todo</label><br>
      <label><input type="radio" name="p3" value="3"> No le presto atención</label>
    </div>

    <div class="card"><p><strong>4.</strong> Tu hijo/a rompe una regla importante. ¿Qué haces?</p>
      <label><input type="radio" name="p4" value="0"> Castigo severo sin explicación</label><br>
      <label><input type="radio" name="p4" value="1"> Aplico una consecuencia lógica (relacionada con el acto)</label><br>
      <label><input type="radio" name="p4" value="2"> No hago nada "para no hacerle sentir mal"</label><br>
      <label><input type="radio" name="p4" value="3"> Me da igual, no me involucro</label>
    </div>

    <div class="card"><p><strong>5.</strong> Sobre las emociones de tu hijo/a...</p>
      <label><input type="radio" name="p5" value="0"> Las minimizo ("no es para tanto")</label><br>
      <label><input type="radio" name="p5" value="1"> Las valido y le ayudo a nombrarlas</label><br>
      <label><input type="radio" name="p5" value="2"> Hago todo para que no sienta emociones "negativas"</label><br>
      <label><input type="radio" name="p5" value="3"> Ignoro sus emociones</label>
    </div>

    <div class="card"><p><strong>6.</strong> ¿Cómo manejas los límites con pantallas/tv?</p>
      <label><input type="radio" name="p6" value="0"> Horario fijo pero negocio flexible si está tranquilo</label><br>
      <label><input type="radio" name="p6" value="1"> Prohibo totalmente o grito cuando excede</label><br>
      <label><input type="radio" name="p6" value="2"> No hay límites, ve lo que quiera</label><br>
      <label><input type="radio" name="p6" value="3"> No superviso</label>
    </div>

    <div class="card"><p><strong>7.</strong> Ante una pelea entre hermanos o amigos...</p>
      <label><input type="radio" name="p7" value="0"> Castigo a ambos sin escuchar</label><br>
      <label><input type="radio" name="p7" value="1"> Escucho a cada uno y les ayudo a resolver juntos</label><br>
      <label><input type="radio" name="p7" value="2"> Dejo que se arreglen solos, aunque uno domine</label><br>
      <label><input type="radio" name="p7" value="3"> Me desentiendo</label>
    </div>

    <div class="card"><p><strong>8.</strong> Cuando tu hijo/a se equivoca, tú...</p>
      <label><input type="radio" name="p8" value="0"> Lo humillo o comparo ("mira a tu prima")</label><br>
      <label><input type="radio" name="p8" value="1"> Le ayudo a reflexionar sobre el error y cómo mejorar</label><br>
      <label><input type="radio" name="p8" value="2"> Le digo que no importa, que no se preocupe (sin aprendizaje)</label><br>
      <label><input type="radio" name="p8" value="3"> No le presto atención</label>
    </div>

    <div class="card"><p><strong>9.</strong> ¿Cómo tomas decisiones importantes en casa?</p>
      <label><input type="radio" name="p9" value="0"> Solo decido yo, sin preguntarles</label><br>
      <label><input type="radio" name="p9" value="1"> Involucro a los hijos según su edad y capacidad</label><br>
      <label><input type="radio" name="p9" value="2"> Dejo que ellos decidan casi todo</label><br>
      <label><input type="radio" name="p9" value="3"> No tomo decisiones, cada quien hace lo que quiere</label>
    </div>

    <div class="card"><p><strong>10.</strong> Tu hijo/a tiene miedo o está triste. Tú...</p>
      <label><input type="radio" name="p10" value="0"> Le digo que no sea débil o que deje de llorar</label><br>
      <label><input type="radio" name="p10" value="1"> Le acompaño, le nombro la emoción y le ofrezco seguridad</label><br>
      <label><input type="radio" name="p10" value="2"> Lo distraigo rápido con algo material</label><br>
      <label><input type="radio" name="p10" value="3"> Lo dejo solo/a para que aprenda</label>
    </div>

    <div class="card">
      <button type="button" id="btnCalcularTest" class="juego">📊 Ver mi estilo de crianza</button>
      <div id="resultadoTest" style="margin-top:1.5rem; padding:1rem; border-radius:1rem; background:#f0f0f0;"></div>
    </div>
  </form>
`,
  desarrollo: `
  <div class="card">
    <h2>🌟 Explorando su autoestima</h2>
    <p><strong>¿Qué es?</strong> La seguridad interna de "valgo por ser, no por hacer".</p>
    <div class="grid-2">
      <div class="card"><h3>👶 0-5 años</h3><p>✔️ Refleja sus logros: "¡lo hiciste solo!"<br>✔️ Evita etiquetas ("eres malo") → describe la acción.<br>🎲 Actividad: espejo de emociones.</p></div>
      <div class="card"><h3>🧒 6-12 años</h3><p>✔️ Dale tareas reales donde aporte a la familia.<br>✔️ Valora el esfuerzo, no solo el resultado.<br>🎲 Ejercicio: "Mi superpoder especial".</p></div>
    </div>
  </div>

  <div class="card">
    <h3>🧘 Practicando el autocontrol</h3>
    <p>El autocontrol se entrena, no se nace con él.</p>
    <div class="grid-2">
      <div class="card"><h3>⚡ Técnica: semáforo de emociones</h3><p>Rojo: para, Amarillo: piensa, Verde: actúa. Practica en juegos de espera.</p></div>
      <div class="card"><h3>🎲 Juego: "estatuas musicales"</h3><p>Detenerse al azar. Útil para impulsividad.</p></div>
    </div>
    <p><strong>Frases para ayudar:</strong> "Puedes estar enojado, pero no pegas. Respira conmigo".</p>
  </div>

  <div class="card">
    <h3>🚀 Desarrollando su liderazgo</h3>
    <p>Liderazgo = iniciativa + responsabilidad + empatía.</p>
    <ul>
      <li><strong>En casa:</strong> Que sea el "jefe de una tarea" (ej. poner la mesa, cuidar una planta).</li>
      <li><strong>Ejercicio:</strong> "Si fueras líder por un día, ¿qué cambiarías?" (para +6 años).</li>
      <li><strong>Rol-playing:</strong> Simular resolver un conflicto entre amigos.</li>
    </ul>
  </div>

  <div class="card">
    <h3>📋 Plan de 7 días para fortalecer autoestima + autocontrol + liderazgo</h3>
    <ul>
      <li>📅 Día 1: Elogia el esfuerzo, no el resultado.</li>
      <li>📅 Día 2: Juego de "semáforo" antes de una transición.</li>
      <li>📅 Día 3: Dale una responsabilidad real.</li>
      <li>📅 Día 4: Pregúntale "¿cómo te sentiste cuando...?"</li>
      <li>📅 Día 5: Practica esperar 5 min para algo que quiere.</li>
      <li>📅 Día 6: Que lidere una actividad familiar (elegir juego).</li>
      <li>📅 Día 7: Reflexión en familia: "¿qué aprendimos esta semana?"</li>
    </ul>
  </div>

  <div class="card">
    <h3>✏️ Ejercicio interactivo: ¿Qué fortaleces hoy?</h3>
    <div id="fortalezas">
      <p>Selecciona lo que quieres trabajar hoy con tu hijo/a:</p>
      <button class="btn-fortaleza" data-area="autoestima">💖 Autoestima</button>
      <button class="btn-fortaleza" data-area="autocontrol">🧘 Autocontrol</button>
      <button class="btn-fortaleza" data-area="liderazgo">🌟 Liderazgo</button>
      <p id="fortalezaFeedback" style="margin-top:1rem;"></p>
    </div>
  </div>
`
};

// ==============================
// FUNCIÓN PARA RENDERIZAR SECCIONES
// ==============================
function renderizar(seccion) {
  if (!contenido[seccion]) {
    document.getElementById("contenido").innerHTML = "<p>Sección no encontrada</p>";
    return;
  }
  document.getElementById("contenido").innerHTML = contenido[seccion];
  
  if (seccion === "interactivo") activarJuegos();
  if (seccion === "reto") activarReto();
  if (seccion === "estilos") activarQuizEstilos();
  if (seccion === "test") activarTest();        // NUEVO
  if (seccion === "desarrollo") activarDesarrollo(); // NUEVO
}

// ==============================
// JUEGOS Y QUIZ DE ESTILOS (interactivo)
// ==============================
function activarJuegos() {
  const btnValidar = document.getElementById("validarFrase");
  if (btnValidar) {
    btnValidar.onclick = () => {
      const respuesta = document.getElementById("respuestaFrase").value;
      const feedback = document.getElementById("feedbackFrase");
      if(respuesta.trim().toLowerCase().includes("respir") || respuesta.trim().toLowerCase().includes("calma")) {
        feedback.innerHTML = "✅ ¡Excelente! Respirar o calmarte antes ayuda a regular.";
      } else {
        feedback.innerHTML = "💡 Una idea: 'respirar profundo' o 'decir estoy aquí para ayudarte'.";
      }
    };
  }
  const btnEstrategia = document.getElementById("verEstrategia");
  if(btnEstrategia) {
    btnEstrategia.onclick = () => {
      document.getElementById("estrategiaResultado").innerHTML = "🧸 Dale una opción: ¿quieres ponerte la camisa azul o la roja? Y luego un juego: 'a ver quién se viste más rápido cantando'.";
    };
  }
}

// NUEVO: Activar los quizzes de estilos
function activarQuizEstilos() {
  document.querySelectorAll(".respuesta-quiz").forEach(btn => {
    btn.onclick = () => {
      const estilo = btn.getAttribute("data-estilo");
      const feedback = document.getElementById("feedbackQuiz");
      if(estilo === "autoritario") {
        feedback.innerHTML = "✅ ¡Correcto! Es Autoritario (alto control, bajo afecto).";
      } else {
        feedback.innerHTML = "❌ No. Es autoritario: usa castigo desproporcionado sin calidez.";
      }
    };
  });
  document.querySelectorAll(".respuesta-quiz2").forEach(btn => {
    btn.onclick = () => {
      const estilo = btn.getAttribute("data-estilo");
      const feedback = document.getElementById("feedbackQuiz2");
      if(estilo === "democratico") {
        feedback.innerHTML = "✅ ¡Excelente! Es Democrático: valida emoción + límite negociado.";
      } else {
        feedback.innerHTML = "❌ Intenta de nuevo. Es democrático (asertivo).";
      }
    };
  });
}
function activarTest() {
  const btn = document.getElementById("btnCalcularTest");
  if (!btn) return;
  btn.onclick = () => {
    let puntajeTotal = 0;
    for (let i = 1; i <= 10; i++) {
      const seleccion = document.querySelector(`input[name="p${i}"]:checked`);
      if (seleccion) {
        puntajeTotal += parseInt(seleccion.value);
      }
    }
    // Interpretación según puntaje (0-30)
    let estilo = "";
    let descripcion = "";
    if (puntajeTotal <= 8) {
      estilo = "🟡 Permisivo";
      descripcion = "Priorizas el afecto sobre los límites. Aumenta rutinas y consecuencias lógicas.";
    } else if (puntajeTotal <= 16) {
      estilo = "🔴 Autoritario";
      descripcion = "Usas mucho control pero poca calidez. Practica validar emociones y reducir castigos.";
    } else if (puntajeTotal <= 24) {
      estilo = "🟢 Democrático / Asertivo";
      descripcion = "¡Excelente! Equilibras afecto y control. Sigue así y enseña a otros padres.";
    } else {
      estilo = "⚫ Negligente";
      descripcion = "Hay poca implicación. Busca apoyo, rutinas diarias y al menos 15 min de atención plena al día.";
    }
    document.getElementById("resultadoTest").innerHTML = `
      <h3>Tu estilo principal: ${estilo}</h3>
      <p>${descripcion}</p>
      <p><strong>Consejo personalizado:</strong> ${obtenerConsejoPorPuntaje(puntajeTotal)}</p>
      <p>📌 Puedes mejorar entrenando: <strong>autoestima, autocontrol y liderazgo</strong> en tu hijo (ver pestaña Desarrollo).</p>
    `;
  };
}

function obtenerConsejoPorPuntaje(puntaje) {
  if (puntaje <= 8) return "Empieza con 1 límite no negociable por semana (ej. horario de comida) y respira antes de ceder.";
  if (puntaje <= 16) return "Antes de gritar, di 'entiendo tu emoción, pero esto no se hace'. Practica 1 vez al día.";
  if (puntaje <= 24) return "Enseña a otros padres. Tu experiencia vale. Sigue con los retos diarios de la app.";
  return "Dedica 10 min diarios a jugar sin distracciones. Pide ayuda profesional si puedes.";
}
function activarDesarrollo() {
  document.querySelectorAll(".btn-fortaleza").forEach(btn => {
    btn.onclick = () => {
      const area = btn.getAttribute("data-area");
      let mensaje = "";
      if (area === "autoestima") mensaje = "💪 Hoy: dile 'te quiero' sin condición. Valora un intento aunque falle.";
      if (area === "autocontrol") mensaje = "⏳ Practica esperar: cuenta hasta 10 juntos antes de abrir un regalo o iniciar un juego.";
      if (area === "liderazgo") mensaje = "👑 Dale una decisión real hoy: '¿qué cenamos, pasta o arroz?' y respeta su elección.";
      document.getElementById("fortalezaFeedback").innerHTML = `✨ Reto activado: ${mensaje}<br>✅ Vuelve mañana por otro.`;
    };
  });
}
// ==============================
// NAVEGACIÓN ENTRE PESTAÑAS
// ==============================
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.getAttribute("data-tab");
    renderizar(tab);
  });
});

// Cargar inicio por defecto
renderizar("inicio");

// Registrar Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
