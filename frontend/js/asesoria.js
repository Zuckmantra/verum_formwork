// Manejar la selección de archivos
document.getElementById('planos').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'Ningún archivo seleccionado';
    document.getElementById('file-name').textContent = fileName;

    const label = document.querySelector('.file-upload-label');
    if (e.target.files[0]) {
        label.textContent = '✓ Cambiar archivo';
        label.style.backgroundColor = 'var(--thirth-color)';
    } else {
        label.textContent = 'Seleccionar archivo';
        label.style.backgroundColor = 'var(--primary-color)';
    }
});

// Manejar la lógica del formulario dinámico y el envío al backend
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const tipoContacto = document.getElementById('type_contacto');
    const seccionProyecto = document.getElementById('seccion-proyecto');
    const seccionComentarios = document.getElementById('seccion-comentarios');
    const formulario = document.querySelector('.form-asesoria');
    const camposProyecto = ['business', 'work', 'city'];
    const campoPlanos = document.getElementById('planos');

    // Elementos del Pop-up
    const popupOverlay = document.getElementById('popup-overlay');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const popupClose = document.getElementById('popup-close');

    // Lógica para mostrar/ocultar secciones del formulario
    tipoContacto.addEventListener('change', function() {
        const valor = this.value;
        const esAsesoria = valor === 'asesoria_tecnica' || valor === 'asesoria_comercial';

        seccionProyecto.style.display = esAsesoria ? 'flex' : 'none';
        seccionComentarios.style.display = esAsesoria ? 'flex' : 'none';

        camposProyecto.forEach(id => document.getElementById(id).required = esAsesoria);
        campoPlanos.required = esAsesoria;

        if (esAsesoria) {
            formulario.classList.remove('marketing-mode');
        } else {
            formulario.classList.add('marketing-mode');
        }
    });

    // Funciones para el Pop-up
    function showPopup(message, isSuccess) {
        popupMessage.textContent = message;
        popup.className = 'popup ' + (isSuccess ? 'success' : 'error');
        popupOverlay.style.display = 'flex';
        setTimeout(() => popupOverlay.classList.add('show'), 10);
    }

    function hidePopup() {
        popupOverlay.classList.remove('show');
        setTimeout(() => {
            popupOverlay.style.display = 'none';
        }, 300);
    }

    popupClose.addEventListener('click', hidePopup);
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            hidePopup();
        }
    });

    // Envío del formulario con fetch
    formulario.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = formulario.querySelector('.button-submit');
        submitButton.value = 'Enviando...';
        submitButton.disabled = true;

        const formData = new FormData(formulario);

        try {
            const response = await fetch('https://backend-backend.eahtrc.easypanel.host/asesoria', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                showPopup('¡Gracias! Tu solicitud ha sido enviada con éxito.', true);
                formulario.reset();
                document.getElementById('file-name').textContent = 'Ningún archivo seleccionado';
                const label = document.querySelector('.file-upload-label');
                label.textContent = 'Seleccionar archivo';
                label.style.backgroundColor = 'var(--primary-color)';
                // Ocultar secciones extra después de enviar
                seccionProyecto.style.display = 'none';
                seccionComentarios.style.display = 'none';
            } else {
                showPopup(`Error: ${result.message}`, false);
            }
        } catch (error) {
            console.error('Error de red o del servidor:', error);
            showPopup('No se pudo conectar con el servidor. Por favor, inténtalo más tarde.', false);
        } finally {
            submitButton.value = 'Enviar';
            submitButton.disabled = false;
        }
    });
});