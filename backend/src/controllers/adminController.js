const fs = require('fs');
const path = require('path');

// Load users from file
const usersFile = path.join(__dirname, '../data/users.json');
function loadUsers() {
  try {
    if (fs.existsSync(usersFile)) {
      return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return [];
}

const adminController = {
  // Récupérer tous les utilisateurs pour prospection
  async getUsers(req, res) {
    try {
      const users = loadUsers();
      
      const cleanUsers = users.map(u => ({
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        createdAt: u.createdAt
      }));
      
      const stats = {
        total: users.length,
        thisMonth: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length,
        thisWeek: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length
      };

      res.json({ users: cleanUsers, stats });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Export CSV pour prospection
  async exportUsers(req, res) {
    try {
      const users = loadUsers();

      const csv = [
        'Prénom,Nom,Email,Téléphone,Date inscription',
        ...users.map(u => `${u.firstName},${u.lastName},${u.email},${u.phone},${u.createdAt}`)
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=prospects.csv');
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: 'Erreur export' });
    }
  }
};

module.exports = adminController;