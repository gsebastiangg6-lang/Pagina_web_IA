document.addEventListener("DOMContentLoaded", () => {
  // ---------------- 1. MENÚ MÓVIL ACCESIBLE ----------------
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const estaAbierto = navMenu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(estaAbierto));
      menuToggle.setAttribute(
        "aria-label",
        estaAbierto ? "Cerrar menú de navegación" : "Abrir menú de navegación"
      );
    });

    navLinks.forEach((enlace) => {
      enlace.addEventListener("click", () => {
        if (navMenu.classList.contains("is-open")) {
          navMenu.classList.remove("is-open");
          menuToggle.setAttribute("aria-expanded", "false");
          menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
        }
      });
    });
  }

  // ---------------- 2. VALIDACIÓN DEL FORMULARIO DE CITAS ----------------
  const citaForm = document.getElementById("citaForm");
  const nombreInput = document.getElementById("nombre");
  const telefonoInput = document.getElementById("telefono");
  const servicioSelect = document.getElementById("servicio");
  const fechaInput = document.getElementById("fecha");
  const formFeedback = document.getElementById("formFeedback");

  if (fechaInput) {
    const hoy = new Date().toISOString().split("T")[0];
    fechaInput.setAttribute("min", hoy);
  }

  function mostrarError(campo, idError, mensaje) {
    const contenedorError = document.getElementById(idError);
    campo.classList.add("input-error");
    campo.setAttribute("aria-invalid", "true");
    if (contenedorError) {
      contenedorError.textContent = mensaje;
    }
  }

  function limpiarError(campo, idError) {
    const contenedorError = document.getElementById(idError);
    campo.classList.remove("input-error");
    campo.removeAttribute("aria-invalid");
    if (contenedorError) {
      contenedorError.textContent = "";
    }
  }

  nombreInput.addEventListener("input", () => limpiarError(nombreInput, "error-nombre"));
  telefonoInput.addEventListener("input", () => limpiarError(telefonoInput, "error-telefono"));
  servicioSelect.addEventListener("change", () => limpiarError(servicioSelect, "error-servicio"));
  fechaInput.addEventListener("change", () => limpiarError(fechaInput, "error-fecha"));

  if (citaForm) {
    citaForm.addEventListener("submit", (evento) => {
      evento.preventDefault();

      formFeedback.textContent = "";
      formFeedback.className = "form-feedback";

      let esValido = true;

      const nombreValor = nombreInput.value.trim();
      if (nombreValor.length < 3) {
        mostrarError(
          nombreInput,
          "error-nombre",
          "Por favor, ingresa tu nombre completo (mínimo 3 caracteres)."
        );
        esValido = false;
      } else {
        limpiarError(nombreInput, "error-nombre");
      }

      const telefonoLimpio = telefonoInput.value.replace(/\D/g, "");
      if (telefonoLimpio.length !== 10) {
        mostrarError(
          telefonoInput,
          "error-telefono",
          "Ingresa un número de teléfono o WhatsApp válido de 10 dígitos (ej. 3134421494)."
        );
        esValido = false;
      } else {
        limpiarError(telefonoInput, "error-telefono");
      }

      if (servicioSelect.value === "") {
        mostrarError(
          servicioSelect,
          "error-servicio",
          "Selecciona el servicio en el que estás interesado."
        );
        esValido = false;
      } else {
        limpiarError(servicioSelect, "error-servicio");
      }

      const hoy = new Date().toISOString().split("T")[0];
      if (!fechaInput.value) {
        mostrarError(
          fechaInput,
          "error-fecha",
          "Selecciona una fecha tentativa para tu consulta."
        );
        esValido = false;
      } else if (fechaInput.value < hoy) {
        mostrarError(
          fechaInput,
          "error-fecha",
          "La fecha seleccionada no puede ser anterior al día de hoy."
        );
        esValido = false;
      } else {
        limpiarError(fechaInput, "error-fecha");
      }

      if (!esValido) {
        formFeedback.textContent = "Revisa los campos marcados en rojo antes de continuar.";
        formFeedback.classList.add("is-error");
        return;
      }

      const servicioTexto = servicioSelect.options[servicioSelect.selectedIndex].text;
      formFeedback.textContent = `¡Gracias, ${nombreValor}! Tu solicitud para ${servicioTexto} el ${fechaInput.value} fue validada correctamente. Nos comunicaremos al ${telefonoLimpio} para confirmar tu horario.`;
      formFeedback.classList.add("is-success");

      citaForm.reset();
    });
  }
});