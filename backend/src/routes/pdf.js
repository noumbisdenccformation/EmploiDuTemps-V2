const express = require('express');
const pdfController = require('../controllers/pdfController');

const router = express.Router();

router.post('/schedule', pdfController.generateSchedulePDF);
router.post('/all-schedules', pdfController.generateAllSchedulesPDF);

module.exports = router;