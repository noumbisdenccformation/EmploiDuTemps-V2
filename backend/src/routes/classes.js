const express = require('express');
const classController = require('../controllers/classController');

const router = express.Router();

router.get('/', classController.getAll);
router.post('/', classController.create);
router.put('/:id', classController.update);
router.delete('/:id', classController.delete);

module.exports = router;