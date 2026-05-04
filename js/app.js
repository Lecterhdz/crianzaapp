// Contenido de todas las secciones
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
    <div class="card"><h3>🎯 Estilos de crianza</h3><p>Autoritativo (ideal), Autoritario, Permisivo, Negligente. Buscamos el respetuoso con límites.</p></div>
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
  estilos: `
  <div class="card">
    <h2>📊 Los 4 estilos de crianza</h2>
    <p>Se definen por dos ejes: <strong>Afecto (calidez)</strong> y <strong>Control (exigencia/disciplina)</strong>.</p>
    <table style="width:100%; border-collapse:collapse; margin:1rem 0;">
      <tr style="background:#4CAF50; color:white;"><th>Estilo</th><th>Afecto</th><th>Control</th><th>Resultado</th></tr>
      <tr><td>🔹 Autoritario</td><td>Bajo</td><td>Alto</td><td>Miedo, baja autoestima</td></tr>
      <tr style="background:#f0f0f0;"><td>✅ Democrático / Asertivo</td><td>Alto</td><td>Alto (pero flexible)</td><td>Seguro, autónomo, feliz</td></tr>
      <tr><td>🔸 Permisivo</td><td>Alto</td><td>Bajo</td><td>Sin límites, baja frustración</td></tr>
      <tr style="background:#f0f0f0;"><td>⚫ Negligente</td><td>Bajo</td><td>Bajo</td><td>Abandono, inseguridad grave</td></tr>
    </table>
  </div>

  <div class="card">
    <h3>🛠️ Habilidades por estilo de crianza</h3>
    <div class="grid-2">
      <div class="card"><h4>📌 Autoritario</h4><ul><li>Imponer reglas sin explicación</li><li>Castigo como herramienta principal</li><li>Poca validación emocional</li><li>"Porque lo digo yo"</li></ul><p><em>⚠️ No recomendado: genera rebeldía o sumisión.</em></p></div>
      <div class="card"><h4>🌟 Democrático / Asertivo (ideal)</h4><ul><li>Escucha activa</li><li>Poner límites con empatía</li><li>Negociar opciones dentro de lo no negociable</li><li>Enseñar consecuencias lógicas</li><li>Validar emociones + mantener la norma</li><li>Modelar regulación emocional</li></ul></div>
      <div class="card"><h4>🍃 Permisivo</h4><ul><li>Evitar el conflicto</li><li>Ceder ante la rabieta</li><li>Pocas rutinas o límites</li><li>"Está bien, lo que quieras"</li></ul><p><em>⚠️ Genera niños con baja tolerancia a la frustración.</em></p></div>
      <div class="card"><h4>🌪️ Negligente</h4><ul><li>Ausencia de respuesta</li><li>Indiferencia ante necesidades</li><li>Sin supervisión ni afecto</li></ul><p><em>🚨 El más dañino. Buscar ayuda profesional.</em></p></div>
    </div>
  </div>

  <div class="card">
    <h3>🎯 Técnicas específicas para el estilo DEMOCRÁTICO (las que sí funcionan)</h3>
    <ul>
      <li><strong>1. "Opción limitada"</strong> → "¿Te bañas antes o después de recoger los juguetes?" (das control dentro del límite).</li>
      <li><strong>2. Consecuencia lógica</strong> → Si no guarda la comida, se termina la hora de juego (relacionado, no arbitrario).</li>
      <li><strong>3. Reunión familiar semanal</strong> → niños opinan sobre 1 regla (de 6 a 12 años).</li>
      <li><strong>4. Rueda de opciones emocionales</strong> → dibujar 4 soluciones a un conflicto y elegir 1.</li>
      <li><strong>5. Ignorar planificadamente</strong> → conductas leves de llamada de atención (sin castigo, solo no reforzar).</li>
      <li><strong>6. Tiempo fuera positivo</strong> → "Ve a tu rincón de calma con un peluche, luego hablamos".</li>
      <li><strong>7. Elogio descriptivo</strong> → "Me encanta cómo guardaste los libros sin que te lo pidiera" (no solo "bien").</li>
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
      <li>🔁 Si eras autoritario: empieza por validar emociones 1 vez al día ("entiendo que estés triste").</li>
      <li>🔁 Si eras permisivo: elige 1 límite no negociable por semana y cúmplelo con calma.</li>
      <li>🔁 Si eras negligente: establece una rutina simple de 10 min diarios de atención plena al niño.</li>
    </ul>
  </div>
`
  
};

// Mostrar sección activa
let seccionActual = "inicio";

function renderizar(seccion) {
  document.getElementById("contenido").innerHTML = contenido[seccion] || "<p>Cargando...</p>";
  if (seccion === "interactivo") activarJuegos();
}

function activarJuegos() {
  const btnValidar = document.getElementById("validarFrase");
  if (btnValidar) {
    btnValidar.onclick = () => {
      const respuesta = document.getElementById("respuestaFrase").value;
      const feedback = document.getElementById("feedbackFrase");
      if(respuesta.trim().toLowerCase().includes("respir") || respuesta.trim().toLowerCase().includes("calma")) {
        feedback.innerHTML = "✅ ¡Excelente! Respirar o calmarte antes ayuda a regular.";
      } else {
        feedback.innerHTML = "💡 Una idea: 'respirar profundo' o 'decir " + "estoy aquí para ayudarte" + "'.";
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

// navegación
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.getAttribute("data-tab");
    if(tab === "inicio") renderizar("inicio");
    if(tab === "edades") renderizar("edades");
    if(tab === "interactivo") renderizar("interactivo");
    if(tab === "herramientas") renderizar("herramientas");
    if(tab === "errores") renderizar("errores");
  });
});

// Cargar inicio por defecto
renderizar("inicio");

// Registrar Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
