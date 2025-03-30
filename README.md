# nuevofrioApp - Estructura del proyecto
mi-app-electron/
├── src/
│   ├── main/          # Código del proceso principal (main process)
│   │   └── main.js    # Punto de entrada del proceso principal
│   ├── renderer/      # Código del proceso de renderizado (renderer process)
│   │   ├── assets/    # Recursos estáticos (imágenes, fuentes, etc.)
│   │   ├── css/       # Estilos CSS
│   │       ├── index.css      # Estilos para index.html
│   │   	└── generarPdf.css      # Estilos para generarPdf.html
│   │   ├── js/        # Scripts JavaScript del frontend
│   │       ├── index.js      # logica para index.html
│   │   	└── generarPdf.js      # logica para generarPdf.html
│   │   └── views/     # Vistas HTML
│   │       ├── index.html       # Menú principal
│   │       └── generar-pdf.html # Submenú para generar PDF
│   │
│   └── preload.js     # Script de preload para comunicación segura entre procesos
├── package.json       # Configuración del proyecto
├── .gitignore         # Ignorar archivos innecesarios en el repositorio
└── README.md          # Documentación del proyecto