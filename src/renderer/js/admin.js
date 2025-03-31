// Control de ventana
document.getElementById('minimize-btn')?.addEventListener('click', () => {
    window.electronAPI.windowControl('minimize');
  });
  
  document.getElementById('maximize-btn')?.addEventListener('click', () => {
    window.electronAPI.windowControl('maximize');
  });
  
  document.getElementById('close-btn')?.addEventListener('click', () => {
    window.electronAPI.windowControl('close');
  });
  
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      window.electronAPI.windowControl('logout');
    }
  });
  
  // Fecha y hora
  function updateDateTime() {
    const now = new Date();
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    document.getElementById('current-date').textContent = now.toLocaleDateString('es-ES', optionsDate);
    document.getElementById('current-time').textContent = now.toLocaleTimeString('es-ES', optionsTime);
  }
  
// Actualizar cada segundo
setInterval(updateDateTime, 1000);
updateDateTime();

// Manejar el cierre de sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        window.electronAPI.logout();
    }
});

// Menú y secciones
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
      });
      
      const sectionId = btn.getAttribute('data-section') + '-section';
      document.getElementById(sectionId)?.classList.add('active');
    });
  });

  
// Simular datos para el dashboard (en una app real estos vendrían de la base de datos)
document.getElementById('user-count').textContent = '12';
document.getElementById('product-count').textContent = '45';
document.getElementById('sales-today').textContent = '8';
document.getElementById('revenue').textContent = '$12,450';

// Actividad reciente simulada
const activityList = [
    'Nuevo usuario registrado: Juan Pérez',
    'Pedro Gómez actualizó el producto "Taladro percutor"',
    'Venta realizada #INV-2023-0012 por $1,850',
    'María López cambió su contraseña',
    'Stock actualizado para "Heladera exhibidora"'
];

const activityListElement = document.getElementById('recent-activity');
activityList.forEach(activity => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="fas fa-circle"></i> ${activity}`;
    activityListElement.appendChild(li);
});

// Manejar modales
function setupModal(modalId, btnId, closeClass) {
    const modal = document.getElementById(modalId);
    const btn = document.getElementById(btnId);
    const close = document.querySelectorAll(`.${closeClass}`);

    if (btn) {
        btn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    close.forEach(el => {
        el.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

setupModal('user-modal', 'add-user-btn', 'close-modal');
setupModal('product-modal', 'add-product-btn', 'close-modal');

// Aquí iría la lógica para cargar usuarios y productos desde la base de datos
// usando window.electronAPI para comunicarse con el proceso principal