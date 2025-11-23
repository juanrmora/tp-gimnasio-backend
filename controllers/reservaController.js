const Reserva = require('../models/reservaModel');

const controller = {
    store: (req, res) => {
        const { socio_id, actividad_id, fecha, hora } = req.body;

        // 1. Validamos datos básicos
        if (!socio_id || !actividad_id || !fecha || !hora) {
            return res.status(400).json({ mensaje: 'Faltan datos para la reserva' });
        }

        // 2. Verificamos Cupo
        // Notarás que ahora recibimos (err, info) -> "Error First Callback"
        Reserva.verificarCupo(actividad_id, fecha, (err, info) => {
            
            if (err) {
                return res.status(500).json({ mensaje: 'Error de base de datos al verificar cupo.' });
            }

            if (!info) {
                return res.status(404).json({ mensaje: 'La actividad seleccionada no existe.' });
            }

            const cupoMaximo = info.cupo_maximo;
            const reservasActuales = info.total_reservas;

            if (reservasActuales >= cupoMaximo) {
                return res.status(400).json({
                    mensaje: '¡Lo sentimos! No hay cupo disponible para esta clase.',
                    cupo_maximo: cupoMaximo,
                    reservas_actuales: reservasActuales
                });
            }

            // 3. Creamos la reserva
            Reserva.crear({ socio_id, actividad_id, fecha, hora }, (err, result) => {
                if (err) {
                    // AQUI ATRAPAMOS EL ERROR DEL SOCIO QUE NO EXISTE
                    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                        return res.status(400).json({ 
                            mensaje: `Error: El Socio con ID ${socio_id} no existe en la base de datos.` 
                        });
                    }
                    // Cualquier otro error
                    return res.status(500).json({ mensaje: 'Error interno al guardar la reserva.' });
                }

                res.json({
                    mensaje: 'Reserva creada exitosamente',
                    id_reserva: result.insertId
                });
            });
        });
    }
};

module.exports = controller;