const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Solo necesitamos POST para crear reservas
router.post('/', reservaController.store);

module.exports = router;