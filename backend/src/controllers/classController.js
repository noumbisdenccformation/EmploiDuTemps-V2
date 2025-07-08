const { Class, Subject } = require('../models');

const classController = {
  async getAll(req, res) {
    try {
      const classes = await Class.findAll({
        include: [{ model: Subject, as: 'subjects' }]
      });
      res.json(classes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const classItem = await Class.create(req.body);
      res.status(201).json(classItem);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await Class.update(req.body, {
        where: { id: req.params.id }
      });
      if (!updated) return res.status(404).json({ error: 'Classe non trouvée' });
      const classItem = await Class.findByPk(req.params.id);
      res.json(classItem);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Class.destroy({
        where: { id: req.params.id }
      });
      if (!deleted) return res.status(404).json({ error: 'Classe non trouvée' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = classController;