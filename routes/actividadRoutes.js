const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividadController');

router.get('/', actividadController.index);
router.post('/', actividadController.store);

module.exports = router;