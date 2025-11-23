const db = require('./database');

const Socio = {
    // Obtener todos
    obtenerTodos: (callback) => {
        const sql = 'SELECT * FROM socios';
        db.query(sql, (err, results) => {
            if (err) throw err;
            callback(results);
        });
    },

    // --- NUEVA FUNCIÓN: Buscar uno solo por ID ---
    obtenerPorId: (id, callback) => {
        const sql = 'SELECT * FROM socios WHERE id = ?';
        db.query(sql, [id], (err, results) => {
            if (err) return callback(err, null);
            // Devolvemos el primer resultado encontrado (si existe)
            callback(null, results[0]);
        });
    },
    // ---------------------------------------------

    // Crear nuevo
    crear: (datos, callback) => {
        const sql = 'INSERT INTO socios (nombre, dni, email) VALUES (?, ?, ?)';
        db.query(sql, [datos.nombre, datos.dni, datos.email], (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }
};

module.exports = Socio;