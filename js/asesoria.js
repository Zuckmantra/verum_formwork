// Manejar la selección de archivos
document.getElementById('planos').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'Ningún archivo seleccionado';
    document.getElementById('file-name').textContent = fileName;

    // Cambiar el texto del botón cuando se selecciona un archivo
    const label = document.querySelector('.file-upload-label');
    if (e.target.files[0]) {
        label.textContent = '✓ Cambiar archivo';
        label.style.backgroundColor = 'var(--thirth-color)';
    } else {
        label.textContent = 'Seleccionar archivo';
        label.style.backgroundColor = 'var(--primary-color)';
    }
});

// Manejar la lógica del formulario dinámico
document.addEventListener('DOMContentLoaded', function() {
    const tipoContacto = document.getElementById('type_contacto');
    const seccionProyecto = document.getElementById('seccion-proyecto');
    const seccionComentarios = document.getElementById('seccion-comentarios');
    const formulario = document.querySelector('.form-asesoria');
    
    // Campos que son requeridos solo para asesorías técnicas y comerciales
    const camposProyecto = ['business', 'work', 'city'];
    const campoPlanos = document.getElementById('planos');
    
    tipoContacto.addEventListener('change', function() {
        const valor = this.value;
        
        // Mostrar/ocultar secciones según el tipo de contacto
        if (valor === 'asesoria_tecnica' || valor === 'asesoria_comercial') {
            mostrarSeccion(seccionProyecto);
            mostrarSeccion(seccionComentarios);
            
            // Hacer campos requeridos
            camposProyecto.forEach(campoId => {
                const campo = document.getElementById(campoId);
                if (campo) {
                    campo.required = true;
                }
            });
            campoPlanos.required = true;
            
            // Remover clase marketing-mode
            formulario.classList.remove('marketing-mode');
            
        } else if (valor === 'marketing') {
            ocultarSeccion(seccionComentarios);
            ocultarSeccion(seccionProyecto);
            
            // Quitar requerimientos
            camposProyecto.forEach(campoId => {
                const campo = document.getElementById(campoId);
                if (campo) {
                    campo.required = false;
                    campo.value = ''; 
                }
            });
            campoPlanos.required = false;
            
            // Agregar clase marketing-mode
            formulario.classList.add('marketing-mode');
            
        } else {
            // Si no hay selección, ocultar todas las secciones adicionales
            ocultarSeccion(seccionProyecto);
            ocultarSeccion(seccionComentarios);
        }
    });
    
    function mostrarSeccion(seccion) {
        seccion.classList.remove('seccion-oculta');
        seccion.classList.add('seccion-visible');
    }
    
    function ocultarSeccion(seccion) {
        seccion.classList.remove('seccion-visible');
        seccion.classList.add('seccion-oculta');
    }
    
    // Validación adicional en el envío del formulario
    formulario.addEventListener('submit', function(e) {
        const tipoSeleccionado = tipoContacto.value;
        
        if (tipoSeleccionado === 'marketing') {
            // Para marketing, no validar campos de proyecto
            return true;
        } else if (tipoSeleccionado === 'asesoria_tecnica' || tipoSeleccionado === 'asesoria_comercial') {
            // Validar que los campos requeridos estén completos
            let camposVacios = [];
            
            camposProyecto.forEach(campoId => {
                const campo = document.getElementById(campoId);
                if (campo && !campo.value.trim()) {
                    camposVacios.push(campo.previousElementSibling.textContent);
                }
            });
            
            if (camposVacios.length > 0) {
                e.preventDefault();
                alert('Por favor complete los siguientes campos requeridos: ' + camposVacios.join(', '));
                return false;
            }
        }
    });
});