const { contextBridge, ipcRenderer } = require('electron');

// Exponemos cuidadosamente solo las APIs mínimas necesarias al proceso de renderer
contextBridge.exposeInMainWorld('electronAPI', {
    // Métodos de autenticación
    login: (credentials) => {
        
        // Validamos input antes de enviar al proceso principal
        if (!credentials || typeof credentials !== 'object') {
            throw new Error('Formato de credenciales inválido');
        }
        return ipcRenderer.invoke('login-attempt', credentials);
    },
    
    // Métodos de navegación entre ventanas
    navigateToAdmin: () => {
        return ipcRenderer.invoke('open-admin-window');
    },
    
    navigateToSeller: () => {
        return ipcRenderer.invoke('open-seller-window');
    },
    
    // Métodos utilitarios (ejemplo)
    onAuthStatusChange: (callback) => {
        ipcRenderer.on('auth-status-changed', (event, ...args) => callback(...args));
    }
});

// Medida de seguridad: prevenimos que el renderer acceda directamente a Node.js
contextBridge.exposeInMainWorld('nodeAPI', {
    // Exponemos explícitamente nada - esto es solo un placeholder
    // para prevenir que el renderer intente acceder a Node.js directamente
});