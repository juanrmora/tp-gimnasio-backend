const db = require('./database');

const Actividad = {
    obtenerTodas: (callback) => {
        const sql = 'SELECT * FROM actividades';
        db.query(sql, (err, results) => {
            if (err) throw err;
            callback(results);
        });
    },

    crear: (datos, callback) => {
        // Aquí guardamos el nombre y el CUPO MÁXIMO (requisito clave)
        const sql = 'INSERT INTO actividades (nombre, cupo_maximo) VALUES (?, ?)';
        db.query(sql, [datos.nombre, datos.cupo_maximo], (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }
};

module.exports = Actividad;