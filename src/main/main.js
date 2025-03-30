const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
//const { initializeDB } = require('../db/dbConfig.js');

// Controlador de base de datos (usamos inyección de dependencias para mejor seguridad)
const authController = require('../controller/authController.js');

// Mantenemos una referencia global del objeto window para evitar garbage collection
let mainWindow;

// Configuración para desarrollo - Hot Reload
try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: true
    });
  } catch (_) { 
    console.log('Hot reload no disponible en producción'); 
  }

// Buenas prácticas de seguridad para Electron
app.on('web-contents-created', (event, contents) => {
    // Prevenir navegación a enlaces externos
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        if (parsedUrl.origin !== 'http://localhost') {
            event.preventDefault();
        }
    });

    // Prevenir creación de nuevas ventanas
    contents.setWindowOpenHandler(() => {
        return { action: 'deny' };
    });
});

function createWindow() {
    // Creamos la ventana del navegador con configuraciones seguras por defecto
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '../preload.js'), // Usamos script de preload
            nodeIntegration: false, // ¡Crucial para seguridad!
            contextIsolation: true, // ¡Crucial para seguridad!
            sandbox: true, // Habilitamos sandbox para seguridad adicional
        },
        show: false // No mostramos hasta que esté listo para evitar parpadeos
    });

    // Cargamos el archivo index.html
    mainWindow.loadFile(path.join(__dirname, '../renderer/views/index.html'));

    // Mostramos la ventana cuando esté lista
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    // Evento cuando la ventana se cierra
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Configuramos cabeceras seguras
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ["default-src 'self'"],
                'X-Content-Type-Options': ['nosniff'],
                'X-Frame-Options': ['DENY'],
                'X-XSS-Protection': ['1; mode=block']
            }
        });
    });
}

// Inicialización de la app Electron
app.whenReady().then(() => {
    //initializeDB();
    createWindow();

    // Comportamiento específico para MacOS
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Comunicación IPC con validación
ipcMain.handle('login-attempt', async (event, credentials) => {
    // Validamos la estructura del input
    if (!credentials || typeof credentials !== 'object' || 
        !credentials.username || !credentials.password) {
        throw new Error('Formato de credenciales inválido');
    }

    // Sanitizamos inputs (ejemplo básico - considera usar una librería como DOMPurify)
    const sanitizedCredentials = {
        username: String(credentials.username).trim(),
        password: String(credentials.password).trim()
    };
    
    
    // Llamamos al controlador de autenticación
    try {
        const user = await authController.authenticate(sanitizedCredentials);
        return { success: true, user };
    } catch (error) {
        return { success: false, message: error.message };
    }
});

// Manejamos peticiones de gestión de ventanas
ipcMain.handle('open-admin-window', () => {
    if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, '../renderer/views/admin.html'));
    }
});

ipcMain.handle('open-seller-window', () => {
    if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, '../renderer/views/vendedor.html'));
    }
});