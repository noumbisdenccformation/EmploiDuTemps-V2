const express = require('express');
const conflictController = require('../controllers/conflictController');

const router = express.Router();

// Détecter les conflits
router.post('/detect', conflictController.detectConflicts);

// Résoudre un conflit (décision admin)
router.post('/resolve', conflictController.resolveConflict);

// Obtenir les alternatives pour modification
router.get('/alternatives', conflictController.getAlternatives);

// Appliquer une modification
router.post('/modify', conflictController.applyModification);

module.exports = router;