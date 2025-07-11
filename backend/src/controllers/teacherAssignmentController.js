const { TeacherAssignment, Teacher, Subject, Class } = require('../models');

const teacherAssignmentController = {
  async create(req, res) {
    try {
      const assignment = await TeacherAssignment.create(req.body);
      res.status(201).json(assignment);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'Cette matière est déjà assignée à un enseignant pour cette classe' });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  async getAll(req, res) {
    try {
      const assignments = await TeacherAssignment.findAll({
        include: [
          { model: Teacher, as: 'teacher' },
          { model: Subject, as: 'subject' },
          { model: Class, as: 'class' }
        ]
      });
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await TeacherAssignment.destroy({
        where: { id: req.params.id }
      });
      if (!deleted) {
        return res.status(404).json({ error: 'Affectation non trouvée' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = teacherAssignmentController;