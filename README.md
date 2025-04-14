
# nuevofrioApp - Estructura del proyecto
mi-app-electron/
├── src/
│   ├── controllers/          # Logica para la base de datos y el resto de la app
│   │   └── authController.js    
│   ├── db/          # Base de datos
│   │   └── dbConfig.js    # Punto de entrada a al conexion con la base de datos.
│   ├── main/          # Código del proceso principal (main process)
│   │   └── main.js    # Punto de entrada del proceso principal
│   ├── renderer/      # Código del proceso de renderizado (renderer process)
│   │   ├── assets/    # Recursos estáticos (imágenes, fuentes, etc.)
│   │   ├── css/       # Estilos CSS
│   │       ├── index.css      
│   │       ├── admin.css      
│   │   	└── vendedor.css 
│   │   ├── js/        # Scripts JavaScript del frontend
│   │       ├── index.js      
│   │       ├── admin.js    
│   │   	└── vendedor.js
│   │   └── views/     # Vistas HTML
│   │       ├── index.html       # Menú principal - Inicio sesion
│   │       ├── admin.html       # Menú del administrador.
│   │       └── vendedor.html       # Menú del vendedor.
│   │
│   └── preload.js     # Script de preload para comunicación segura entre procesos
├── package.json       # Configuración del proyecto
├── .gitignore         # Ignorar archivos innecesarios en el repositorio
└── README.md          # Documentación del proyecto
