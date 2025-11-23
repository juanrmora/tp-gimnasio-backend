const Socio = require('../models/socioModel');

const controller = {
    index: (req, res) => {
        Socio.obtenerTodos((socios) => {
            res.json(socios);
        });
    },

    // --- NUEVO MÉTODO: Mostrar uno ---
    show: (req, res) => {
        const { id } = req.params; // Obtenemos el ID de la URL
        
        Socio.obtenerPorId(id, (err, socio) => {
            if (err) return res.status(500).send('Error en base de datos');
            
            if (socio) {
                res.json(socio); // Si existe, devolvemos los datos
            } else {
                res.status(404).json({ mensaje: 'Socio no encontrado' });
            }
        });
    },
    // -------------------------------

    store: (req, res) => {
        const nuevoSocio = req.body;
        if (!nuevoSocio.nombre || !nuevoSocio.dni) {
            return res.status(400).send('Faltan datos obligatorios');
        }
        Socio.crear(nuevoSocio, (resultado) => {
            res.send('Socio registrado correctamente');
        });
    }
};

module.exports = controller;