const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const authController = require('../controller/authController.js');

let mainWindow = null; // Mejor práctica inicializarla como null

// Configuración para desarrollo - Hot Reload
if (process.env.NODE_ENV === 'development') {
  try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: true
    });
  } catch (error) {
    console.error('Error en hot reload:', error);
  }
}

// Seguridad de Electron
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'http://localhost') {
      event.preventDefault();
    }
  });

  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
});

function createWindow(route = 'index.html') {
  // Cerrar ventana existente si hay una
  if (mainWindow) {
    mainWindow.close();
  }

  const isLogin = route === 'index.html';
  
  mainWindow = new BrowserWindow({
    width: isLogin ? 800 : 1280,
    height: isLogin ? 600 : 800,
    fullscreen: !isLogin,
    show: false, // No mostrar inmediatamente
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    }
  });

  // Cargar la ruta
  mainWindow.loadFile(path.join(__dirname, `../renderer/views/${route}`));

  // Mostrar cuando esté lista
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    if (!isLogin) {
      mainWindow.maximize();
    }
    // Cerrar la ventana anterior solo después que la nueva esté lista
    if (oldWindow && !oldWindow.isDestroyed()) {
      oldWindow.close();
    }
  });

  mainWindow.on('closed', () => {
    if (mainWindow === null) return;
    mainWindow = null;
  });
  // Configurar cabeceras de seguridad
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

// Manejo de la aplicación
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



// Manejadores IPC actualizados y consistentes:
ipcMain.handle('login-attempt', async (event, credentials) => {
    if (!credentials || typeof credentials !== 'object' || 
        !credentials.username || !credentials.password) {
      throw new Error('Formato de credenciales inválido');
    }
  
    try {
      const user = await authController.authenticate({
        username: String(credentials.username).trim(),
        password: String(credentials.password).trim()
      });
      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  });
  
  ipcMain.handle('open-window', (event, { route, fullscreen = false }) => {
    if (mainWindow) {
      createWindow(route);
      mainWindow.setFullScreen(fullscreen);
      return true;
    }
    return false;
  });
  
  ipcMain.handle('window-control', (event, action) => {
    if (!mainWindow) return;
    
    switch (action) {
      case 'maximize':
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
        break;
      case 'minimize':
        mainWindow.minimize();
        break;
      case 'close':
        mainWindow.close();
        break;
      case 'logout':
        mainWindow.close();
        createWindow('index.html');
        break;
    }
  });