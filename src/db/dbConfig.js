const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

// Configuración de la base de datos
const dbPath = path.join(__dirname, '../../nuevoFrioDb.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Función para inicializar la base de datos
function initializeDB() {
    try {
        // Crear tabla de usuarios si no existe
        db.prepare(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                apellido TEXT NOT NULL,
                dni TEXT UNIQUE NOT NULL,
                usuario TEXT UNIQUE NOT NULL,
                contraseña TEXT NOT NULL,
                perfil TEXT NOT NULL CHECK(perfil IN ('admin', 'vendedor'))
            )
        `).run();

        // Crear tabla de productos si no existe
        db.prepare(`
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo TEXT UNIQUE NOT NULL,
                sector TEXT NOT NULL,
                marca TEXT NOT NULL,
                descripcion TEXT NOT NULL,
                stock INTEGER NOT NULL DEFAULT 0,
                precioNeto REAL NOT NULL,
                precioLista REAL NOT NULL
            )
        `).run();

        // Insertar usuarios de prueba (solo si la tabla está vacía)
        const userCount = db.prepare('SELECT COUNT(*) as count FROM usuarios').get().count;
        if (userCount === 0) {
            const salt = bcrypt.genSaltSync(10);
            const usuariosDemo = [
                {
                    nombre: 'Admin',
                    apellido: 'Sistema',
                    dni: '28170981',
                    usuario: '28170981',
                    contraseña: bcrypt.hashSync('admin123', salt),
                    perfil: 'admin'
                },
                {
                    nombre: 'Jaimito',
                    apellido: 'Vendedor',
                    dni: '00000000',
                    usuario: '00000000',
                    contraseña: bcrypt.hashSync('vende456', salt),
                    perfil: 'vendedor'
                }
            ];

            const insertUser = db.prepare(`
                INSERT INTO usuarios (nombre, apellido, dni, usuario, contraseña, perfil)
                VALUES (@nombre, @apellido, @dni, @usuario, @contraseña, @perfil)
            `);

            const insertMany = db.transaction((users) => {
                for (const user of users) insertUser.run(user);
            });

            insertMany(usuariosDemo);
        }

        // Insertar productos de prueba (solo si la tabla está vacía)
        const productCount = db.prepare('SELECT COUNT(*) as count FROM productos').get().count;
        if (productCount === 0) {
            const productosDemo = [
                { codigo: 'FERR001', sector: 'Ferretería', marca: 'Tramontina', descripcion: 'Martillo de acero 500g', stock: 25, precioNeto: 4500, precioLista: 6500 },
                { codigo: 'FERR002', sector: 'Ferretería', marca: 'Black+Decker', descripcion: 'Taladro percutor 650W', stock: 12, precioNeto: 12500, precioLista: 15800 },
                { codigo: 'FERR003', sector: 'Ferretería', marca: 'Stanley', descripcion: 'Juego de llaves combinadas 10pzs', stock: 8, precioNeto: 7800, precioLista: 9900 },
                { codigo: 'FERR004', sector: 'Ferretería', marca: '3M', descripcion: 'Cinta métrica 5m', stock: 30, precioNeto: 3200, precioLista: 4500 },
                { codigo: 'FERR005', sector: 'Ferretería', marca: 'Bosch', descripcion: 'Disco de corte para metal 115mm', stock: 50, precioNeto: 1200, precioLista: 1800 },
                { codigo: 'FERR006', sector: 'Ferretería', marca: 'Sidchrome', descripcion: 'Alicate de corte diagonal 8"', stock: 15, precioNeto: 4200, precioLista: 5500 },
                { codigo: 'FERR007', sector: 'Ferretería', marca: 'Irwin', descripcion: 'Sierra para metales 24TPI', stock: 20, precioNeto: 3800, precioLista: 4900 },
                { codigo: 'FERR008', sector: 'Ferretería', marca: 'Knipex', descripcion: 'Pinza multiuso 180mm', stock: 10, precioNeto: 8500, precioLista: 11200 },
                { codigo: 'FERR009', sector: 'Ferretería', marca: 'Bahco', descripcion: 'Destornillador plano 6x100', stock: 40, precioNeto: 1500, precioLista: 2200 },
                { codigo: 'FERR010', sector: 'Ferretería', marca: 'Wera', descripcion: 'Juego de destornilladores 6pzs', stock: 7, precioNeto: 9800, precioLista: 12500 },
                { codigo: 'REFR001', sector: 'Refrigeración', marca: 'Surrey', descripcion: 'Heladera exhibidora 2 puertas', stock: 3, precioNeto: 185000, precioLista: 225000 },
                { codigo: 'REFR002', sector: 'Refrigeración', marca: 'Patrick', descripcion: 'Freezer vertical 300L', stock: 2, precioNeto: 145000, precioLista: 175000 },
                { codigo: 'REFR003', sector: 'Refrigeración', marca: 'Whirlpool', descripcion: 'Heladera frost free 360L', stock: 4, precioNeto: 210000, precioLista: 255000 },
                { codigo: 'REFR004', sector: 'Refrigeración', marca: 'LG', descripcion: 'Aire acondicionado split 3000 frigorías', stock: 5, precioNeto: 185000, precioLista: 220000 },
                { codigo: 'REFR005', sector: 'Refrigeración', marca: 'Samsung', descripcion: 'Heladera side by side 550L', stock: 1, precioNeto: 320000, precioLista: 380000 },
                { codigo: 'REFR006', sector: 'Refrigeración', marca: 'Philco', descripcion: 'Cava de vinos 12 botellas', stock: 6, precioNeto: 65000, precioLista: 82000 },
                { codigo: 'REFR007', sector: 'Refrigeración', marca: 'Gafa', descripcion: 'Ventilador de pie 18"', stock: 8, precioNeto: 12000, precioLista: 15000 },
                { codigo: 'REFR008', sector: 'Refrigeración', marca: 'Liliana', descripcion: 'Anafe a gas 2 hornallas', stock: 7, precioNeto: 18500, precioLista: 22500 },
                { codigo: 'REFR009', sector: 'Refrigeración', marca: 'Longvie', descripcion: 'Termotanque eléctrico 50L', stock: 3, precioNeto: 65000, precioLista: 79000 },
                { codigo: 'REFR010', sector: 'Refrigeración', marca: 'Atma', descripcion: 'Calefactor cerámico 2000W', stock: 10, precioNeto: 12500, precioLista: 15500 }
            ];

            const insertProduct = db.prepare(`
                INSERT INTO productos (codigo, sector, marca, descripcion, stock, precioNeto, precioLista)
                VALUES (@codigo, @sector, @marca, @descripcion, @stock, @precioNeto, @precioLista)
            `);

            const insertManyProducts = db.transaction((products) => {
                for (const product of products) insertProduct.run(product);
            });

            insertManyProducts(productosDemo);
        }

        console.log('Base de datos inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
}

// Exportar la instancia de la base de datos y la función de inicialización
module.exports = {
    db,
    initializeDB
};