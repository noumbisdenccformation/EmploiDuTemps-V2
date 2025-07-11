const express = require('express');
const teacherAssignmentController = require('../controllers/teacherAssignmentController');

const router = express.Router();

router.post('/', teacherAssignmentController.create);
router.get('/', teacherAssignmentController.getAll);
router.delete('/:id', teacherAssignmentController.delete);

module.exports = router;