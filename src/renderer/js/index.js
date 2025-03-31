document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const statusMessage = document.getElementById('statusMessage');
    
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (!username || !password) {
        showStatus('Por favor complete todos los campos', 'error');
        return;
      }
      
      try {
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.disabled = true;
        loginBtn.textContent = 'Autenticando...';
        
        const result = await window.electronAPI.login({ username, password });
        
        if (result.success) {
          // Usar openWindow para ambos casos
          const route = result.user.perfil === 'admin' ? 'admin.html' : 'vendedor.html';
          await window.electronAPI.openWindow(route, { fullscreen: true });
        } else {
          showStatus(result.message || 'Error de autenticación', 'error');
        }
      } catch (error) {
        console.error('Error en login:', error);
        showStatus('Error en el sistema. Intente nuevamente.', 'error');
      } finally {
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Iniciar Sesión';
      }
    });
    
    function showStatus(message, type = 'info') {
      statusMessage.textContent = message;
      statusMessage.className = `status-message ${type}`;
    }
  });