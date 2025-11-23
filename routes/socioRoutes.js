const express = require('express');
const router = express.Router();
const socioController = require('../controllers/socioController');

router.get('/', socioController.index);

// --- NUEVA RUTA ---
// :id significa que ahí va un número variable (ej: /api/socios/1)
router.get('/:id', socioController.show); 
// ------------------

router.post('/', socioController.store);

module.exports = router;