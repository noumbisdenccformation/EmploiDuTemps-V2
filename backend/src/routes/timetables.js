const express = require('express');
const timetableController = require('../controllers/timetableController');

const router = express.Router();

router.post('/generate', timetableController.generate);
router.post('/generate/by-class', timetableController.generateByClass);
router.post('/generate/by-teacher', timetableController.generateByTeacher);
router.post('/validate', timetableController.validate);
router.post('/validate/hours-limits', timetableController.validateHoursLimits);

module.exports = router;