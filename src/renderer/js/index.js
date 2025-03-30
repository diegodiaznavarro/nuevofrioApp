// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const statusMessage = document.getElementById('statusMessage');
    
    // Manejamos el envío del formulario
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtenemos valores del formulario
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validación básica del lado del cliente
        if (!username || !password) {
            showStatus('Por favor complete todos los campos', 'error');
            return;
        }
        
        try {
            // Mostramos estado de carga
            const loginBtn = document.getElementById('loginBtn');
            loginBtn.disabled = true;
            loginBtn.textContent = 'Autenticando...';
            
            // Llamamos a la API de Electron (definida en preload)
            
            const result = await window.electronAPI.login({ username, password });
            
            if (result.success) {
                // Redirigimos basado en el rol del usuario
                if (result.user.role === 'admin') {
                    await window.electronAPI.navigateToAdmin();
                } else if (result.user.role === 'seller') {
                    await window.electronAPI.navigateToSeller();
                }
            } else {
                showStatus(result.message || 'Error de autenticación', 'error');
            }
        } catch (error) {
            console.error('Error en login:', error);
            showStatus('Error en el sistema. Intente nuevamente.', 'error');
        } finally {
            // Restablecemos el estado del botón
            const loginBtn = document.getElementById('loginBtn');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Iniciar Sesión';
        }
    });
    
    // Función helper para mostrar mensajes de estado
    function showStatus(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
    }
});