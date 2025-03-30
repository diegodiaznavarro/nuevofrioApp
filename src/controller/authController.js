const { db } = require('../db/dbConfig');
const bcrypt = require('bcryptjs');

const authController = {
    // Autenticar usuario
    authenticate: async (usuario ) => {
        try {
            // Buscar usuario en la base de datos
            const user = db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(usuario.username);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // Verificar contraseña
            const passwordMatch = await bcrypt.compare(usuario.password, user.contraseña);
            
            if (!passwordMatch) {
                throw new Error('Contraseña incorrecta');
            }

            // Retornar información del usuario (sin la contraseña)
            return {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                dni: user.dni,
                perfil: user.perfil
            };
        } catch (error) {
            console.error('Error en autenticación:', error);
            throw error;
        }
    },

    // Obtener todos los productos (ejemplo adicional)
    getAllProducts: () => {
        try {
            return db.prepare('SELECT * FROM productos ORDER BY sector, marca').all();
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }
};

module.exports = authController;