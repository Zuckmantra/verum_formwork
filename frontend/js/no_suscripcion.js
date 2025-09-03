const apiUrl = 'http://148.230.81.196:3000'; // Cambia por la IP de tu VPS

// Selección de elementos del DOM
const form = document.querySelector('#prefsForm');
const emailInput = document.querySelector('#userEmail');
const responseDiv = document.querySelector('#response');
const checkboxes = document.querySelectorAll('input[name="canales[]"]');
const ningunaCheckbox = document.querySelector('input[value="ninguna"]');

// Lógica para la selección excluyente de checkboxes
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    if (this.value === 'ninguna' && this.checked) {
      checkboxes.forEach(cb => {
        if (cb.value !== 'ninguna') cb.checked = false;
      });
    } else if (this.value !== 'ninguna' && this.checked) {
      ningunaCheckbox.checked = false;
    }
  });
});

// Función para mostrar mensajes
function showMessage(message, type) {
  responseDiv.textContent = message;
  responseDiv.className = `message show ${type}`;

  // Ocultar el mensaje después de 5 segundos
  setTimeout(() => {
    responseDiv.className = 'message';
  }, 5000);
}

// Guardar preferencias
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const canales = Array.from(document.querySelectorAll("input[name='canales[]']:checked"))
    .map(el => el.value);

  try {
    const response = await fetch(`${apiUrl}/suscripciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, canales }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage("Preferencias guardadas correctamente ✅", "success");
      // Limpiar el formulario
      emailInput.value = '';
      checkboxes.forEach(cb => cb.checked = false);
    } else {
      showMessage(data.message || "Error al guardar las preferencias", "error");
    }
  } catch (error) {
    console.error("Error al guardar las preferencias:", error);
    showMessage("Error de conexión con el servidor", "error");
  }
});

// Cargar preferencias
emailInput.addEventListener("blur", async () => {
  const email = emailInput.value;
  if (!email) return;

  try {
    const response = await fetch(`${apiUrl}/suscripciones/${email}`);
    const data = await response.json();

    if (response.ok) {
      const canales = JSON.parse(data.canales);
      checkboxes.forEach(el => el.checked = false);
      canales.forEach(canal => {
        const checkbox = document.querySelector(`input[value="${canal}"]`);
        if (checkbox) checkbox.checked = true;
      });
    } else {
      // No mostrar error si el usuario simplemente no existe todavía
      console.log("No se encontraron preferencias para este email.");
    }
  } catch (error) {
    console.error("Error al cargar las preferencias:", error);
    showMessage("Error de conexión al cargar preferencias", "error");
  }
});
