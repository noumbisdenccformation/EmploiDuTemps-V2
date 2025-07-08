const { Teacher, Subject } = require('../models');

const teacherController = {
  async getAll(req, res) {
    try {
      const teachers = await Teacher.findAll({
        include: [{ model: Subject, as: 'subjects' }]
      });
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const teacher = await Teacher.findByPk(req.params.id, {
        include: [{ model: Subject, as: 'subjects' }]
      });
      if (!teacher) return res.status(404).json({ error: 'Enseignant non trouvé' });
      res.json(teacher);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const teacher = await Teacher.create(req.body);
      res.status(201).json(teacher);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const [updated] = await Teacher.update(req.body, {
        where: { id: req.params.id }
      });
      if (!updated) return res.status(404).json({ error: 'Enseignant non trouvé' });
      const teacher = await Teacher.findByPk(req.params.id);
      res.json(teacher);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Teacher.destroy({
        where: { id: req.params.id }
      });
      if (!deleted) return res.status(404).json({ error: 'Enseignant non trouvé' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = teacherController;