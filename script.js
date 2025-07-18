(() => {
  // Referencias DOM
  const formulario = document.getElementById("formulario");
  const resultado = document.getElementById("resultado");
  const inputFecha = document.getElementById("fecha");
  const inputRut = document.getElementById("rut");
  const inputCorreo = document.getElementById("correo");
  const inputCalificacion = document.getElementById("calificacion");
  const inputNota = document.getElementById("nota");

  // Span de mensajes de error
  const errorFecha = document.getElementById("error-fecha");
  const errorRut = document.getElementById("error-rut");
  const errorCorreo = document.getElementById("error-correo");
  const errorCalificacion = document.getElementById("error-calificacion");

  // Clave almacenamiento
  const STORAGE_KEY = "registros";

  let registros = cargarRegistros();
  renderRegistros(registros);

  // Validación en tiempo real

  inputFecha.addEventListener("blur", () => {
    if (!validarFecha(inputFecha.value)) {
      errorFecha.textContent = "La fecha no puede ser futura o vacía.";
      errorFecha.classList.add("active");
    } else {
      errorFecha.textContent = "";
      errorFecha.classList.remove("active");
    }
  });

  inputRut.addEventListener("blur", () => {
    if (!validarRUT(inputRut.value.trim())) {
      errorRut.textContent = "RUT no válido.";
      errorRut.classList.add("active");
    } else {
      errorRut.textContent = "";
      errorRut.classList.remove("active");
    }
  });

  inputCorreo.addEventListener("blur", () => {
    if (!validarCorreo(inputCorreo.value.trim())) {
      errorCorreo.textContent = "Correo electrónico no válido.";
      errorCorreo.classList.add("active");
    } else {
      errorCorreo.textContent = "";
      errorCorreo.classList.remove("active");
    }
  });

  inputCalificacion.addEventListener("input", () => {
    const cal = parseInt(inputCalificacion.value, 10);

    if (!esCalificacionValida(cal)) {
      errorCalificacion.textContent = "La calificación debe estar entre 1 y 100.";
      errorCalificacion.classList.add("active");
      inputNota.value = "";
    } else {
      errorCalificacion.textContent = "";
      errorCalificacion.classList.remove("active");
      inputNota.value = calcularNota(cal);
    }
  });

  // Submit
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const datos = obtenerDatos();

    if (!validarDatos(datos)) return;

    datos.nota = calcularNota(datos.calificacion);

    agregarRegistro(datos);
    guardarRegistros(registros);
    renderRegistros(registros);

    formulario.reset();
    inputNota.value = "";
    // Limpiar mensajes error
    limpiarErrores();

    alert("Registro guardado exitosamente.");
  });

  // Funciones auxiliares

  function obtenerDatos() {
    return {
      fecha: inputFecha.value,
      rut: inputRut.value.trim(),
      apellidos: document.getElementById("apellidos").value.trim(),
      nombres: document.getElementById("nombres").value.trim(),
      correo: inputCorreo.value.trim(),
      calificacion: parseInt(inputCalificacion.value, 10),
      evaluacion: document.getElementById("evaluacion").value.trim(),
      asignatura: document.getElementById("asignatura").value.trim(),
      curso: document.getElementById("curso").value.trim(),
    };
  }

  function validarDatos({ fecha, rut, correo, calificacion }) {
    let valido = true;

    if (!validarFecha(fecha)) {
      errorFecha.textContent = "La fecha no puede ser futura o vacía.";
      errorFecha.classList.add("active");
      valido = false;
    }
    if (!validarRUT(rut)) {
      errorRut.textContent = "RUT no válido.";
      errorRut.classList.add("active");
      valido = false;
    }
    if (!validarCorreo(correo)) {
      errorCorreo.textContent = "Correo electrónico no válido.";
      errorCorreo.classList.add("active");
      valido = false;
    }
    if (!esCalificacionValida(calificacion)) {
      errorCalificacion.textContent = "La calificación debe estar entre 1 y 100.";
      errorCalificacion.classList.add("active");
      valido = false;
    }

    return valido;
  }

  function limpiarErrores() {
    [errorFecha, errorRut, errorCorreo, errorCalificacion].forEach((el) => {
      el.textContent = "";
      el.classList.remove("active");
    });
  }

  function validarFecha(fecha) {
    const hoy = new Date().toISOString().split("T")[0];
    return fecha && fecha <= hoy;
  }

  function validarRUT(rut) {
    rut = rut.replace(/\./g, "").replace("-", "");
    if (rut.length < 2) return false;

    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i], 10) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    let dvEsperado = 11 - (suma % 11);
    dvEsperado = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

    return dv === dvEsperado;
  }

  function validarCorreo(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function esCalificacionValida(cal) {
    return !isNaN(cal) && cal >= 1 && cal <= 100;
  }

  function calcularNota(cal) {
    return Math.round(((cal / 100) * 6 + 1) * 10) / 10;
  }

  function agregarRegistro(registro) {
    registros.push(registro);
  }

  function guardarRegistros(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function cargarRegistros() {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? JSON.parse(datos) : [];
  }

  function renderRegistros(data) {
    resultado.textContent = data.length
      ? JSON.stringify(data, null, 2)
      : "No hay registros guardados.";
  }
})();
