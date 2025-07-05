
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