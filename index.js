const express = require('express');
const app = express();

// --- MIDDLEWARE ---
// Permite al servidor entender datos en formato JSON
app.use(express.json());

// Permite al servidor mostrar la carpeta 'public' (donde está tu HTML)
// Al entrar a localhost:3000, automáticamente buscará el index.html ahí dentro.
app.use(express.static('public'));

// --- RUTAS (API) ---

// 1. Rutas de Socios
const socioRoutes = require('./routes/socioRoutes');
app.use('/api/socios', socioRoutes);

// 2. Rutas de Actividades
const actividadRoutes = require('./routes/actividadRoutes');
app.use('/api/actividades', actividadRoutes);

// 3. Rutas de Reservas
const reservaRoutes = require('./routes/reservaRoutes');
app.use('/api/reservas', reservaRoutes);


// --- ARRANQUE DEL SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});