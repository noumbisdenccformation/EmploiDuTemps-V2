const { Room, Subject } = require('../models');

const roomController = {
  // Créer une salle
  async create(req, res) {
    try {
      console.log('Données reçues pour création salle:', req.body);
      const room = await Room.create(req.body);
      res.status(201).json(room);
    } catch (error) {
      console.error('Erreur création salle:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Récupérer toutes les salles
  async getAll(req, res) {
    try {
      const rooms = await Room.findAll({
        include: [{
          model: Subject,
          as: 'subjects',
          through: { attributes: [] }
        }]
      });
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer une salle par ID
  async getById(req, res) {
    try {
      const room = await Room.findByPk(req.params.id, {
        include: [{
          model: Subject,
          as: 'subjects',
          through: { attributes: [] }
        }]
      });
      if (!room) {
        return res.status(404).json({ error: 'Salle non trouvée' });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mettre à jour une salle
  async update(req, res) {
    try {
      const [updated] = await Room.update(req.body, {
        where: { id: req.params.id }
      });
      if (!updated) {
        return res.status(404).json({ error: 'Salle non trouvée' });
      }
      const room = await Room.findByPk(req.params.id);
      res.json(room);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Supprimer une salle
  async delete(req, res) {
    try {
      const deleted = await Room.destroy({
        where: { id: req.params.id }
      });
      if (!deleted) {
        return res.status(404).json({ error: 'Salle non trouvée' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = roomController;