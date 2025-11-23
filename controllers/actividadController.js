const Actividad = require('../models/actividadModel');

const controller = {
    index: (req, res) => {
        Actividad.obtenerTodas((actividades) => {
            res.json(actividades);
        });
    },

    store: (req, res) => {
        const nuevaActividad = req.body;
        // Validación simple
        if (!nuevaActividad.nombre || !nuevaActividad.cupo_maximo) {
            return res.status(400).send('Faltan nombre o cupo máximo');
        }

        Actividad.crear(nuevaActividad, (resultado) => {
            res.send('Actividad creada con éxito');
        });
    }
};

module.exports = controller;