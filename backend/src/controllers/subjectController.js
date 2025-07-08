const { Subject, Teacher, Class } = require('../models');

const subjectController = {
  async getAll(req, res) {
    try {
      const subjects = await Subject.findAll({
        include: [
          { model: Teacher, as: 'teachers' },
          { model: Class, as: 'classes' }
        ]
      });
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const subject = await Subject.create(req.body);
      res.status(201).json(subject);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await Subject.update(req.body, {
        where: { id: req.params.id }
      });
      if (!updated) return res.status(404).json({ error: 'Matière non trouvée' });
      const subject = await Subject.findByPk(req.params.id);
      res.json(subject);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Subject.destroy({
        where: { id: req.params.id }
      });
      if (!deleted) return res.status(404).json({ error: 'Matière non trouvée' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = subjectController;