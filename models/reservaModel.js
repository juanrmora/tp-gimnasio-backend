const db = require('./database');

const Reserva = {
    // 1. Función para Crear
    crear: (datos, callback) => {
        const sql = 'INSERT INTO reservas (socio_id, actividad_id, fecha, hora) VALUES (?, ?, ?, ?)';
        db.query(sql, [datos.socio_id, datos.actividad_id, datos.fecha, datos.hora], (err, result) => {
            if (err) {
                // En vez de romper el servidor, devolvemos el error al controlador
                return callback(err, null);
            }
            // Si no hay error, el primer parámetro es null
            callback(null, result);
        });
    },

    // 2. Función Verificar Cupo
    verificarCupo: (actividad_id, fecha, callback) => {
        const sql = `
            SELECT 
                a.cupo_maximo, 
                (SELECT COUNT(*) FROM reservas r WHERE r.actividad_id = ? AND r.fecha = ?) as total_reservas 
            FROM actividades a 
            WHERE a.id = ?
        `;
        
        db.query(sql, [actividad_id, fecha, actividad_id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results[0]);
        });
    }
};

module.exports = Reserva;