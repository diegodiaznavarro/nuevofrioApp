const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  login: (credentials) => {
    if (!credentials || typeof credentials !== 'object') {
      throw new Error('Formato de credenciales inválido');
    }
    return ipcRenderer.invoke('login-attempt', credentials);
  },
  
  openWindow: (route, fullscreen = false) => ipcRenderer.invoke('open-window', { route, fullscreen }),
  windowControl: (action) => ipcRenderer.invoke('window-control', action),
  
  // Eliminar métodos obsoletos:
  // navigateToAdmin, navigateToSeller, resizeWindow, toggleMaximize
  
  onAuthStatusChange: (callback) => {
    ipcRenderer.on('auth-status-changed', (event, ...args) => callback(...args));
  }
});

// ... (nodeAPI se mantiene igual)
// Medida de seguridad: prevenimos que el renderer acceda directamente a Node.js
contextBridge.exposeInMainWorld('nodeAPI', {
    // Exponemos explícitamente nada - esto es solo un placeholder
    // para prevenir que el renderer intente acceder a Node.js directamente
});