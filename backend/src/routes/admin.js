const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Routes admin pour récupérer les prospects
router.get('/users', adminController.getUsers);
router.get('/export', adminController.exportUsers);

module.exports = router;