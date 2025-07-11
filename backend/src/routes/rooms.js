const express = require('express');
const roomController = require('../controllers/roomController');

const router = express.Router();

router.post('/', roomController.create);
router.get('/', roomController.getAll);
router.get('/:id', roomController.getById);
router.put('/:id', roomController.update);
router.delete('/:id', roomController.delete);

module.exports = router;