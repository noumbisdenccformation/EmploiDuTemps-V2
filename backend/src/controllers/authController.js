const User = require('../models/User');
const crypto = require('crypto');
const emailService = require('../services/emailService');
const fs = require('fs');
const path = require('path');

// Fallback file storage
const usersFile = path.join(__dirname, '../data/users.json');
let users = [];
try {
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  }
} catch (error) {
  console.log('Creating new users file');
}

function saveUsers() {
  try {
    const dir = path.dirname(usersFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Save error:', error);
  }
}

// Try to load UserDB, fallback if not available
let UserDB;
try {
  UserDB = require('../models/UserDB');
} catch (error) {
  console.log('Database not available, using file storage');
  UserDB = null;
}

const authController = {
  async register(req, res) {
    try {
      console.log('📨 Inscription reçue:', req.body);
      const { email, phone, password, firstName, lastName } = req.body;

      if (!User.isValidEmail(email)) {
        return res.status(400).json({ error: 'Email invalide' });
      }
      if (!User.isValidPhone(phone)) {
        return res.status(400).json({ error: 'Téléphone invalide' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Mot de passe trop court' });
      }

      // Try database first, fallback to file
      if (UserDB) {
        try {
          const existing = await UserDB.findOne({
            where: {
              [require('sequelize').Op.or]: [{ email }, { phone }]
            }
          });
          
          if (existing) {
            return res.status(400).json({ error: 'Email ou téléphone déjà utilisé' });
          }

          const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
          await UserDB.create({
            firstName, lastName, email, phone, password: hashedPassword
          });
        } catch (dbError) {
          console.log('DB failed, using file storage:', dbError.message);
          // Fall through to file storage
        }
      }
      
      // File storage fallback
      if (users.find(u => u.email === email || u.phone === phone)) {
        return res.status(400).json({ error: 'Email ou téléphone déjà utilisé' });
      }

      const user = new User(email, phone, password, firstName, lastName);
      await user.hashPassword();
      users.push(user);
      saveUsers();

      // Générer et envoyer code de vérification
      const verificationCode = await emailService.generateVerificationCode(email);
      
      res.status(201).json({ 
        message: 'Inscription réussie ! Vérifiez votre email.',
        requiresVerification: true,
        email: email
      });
    } catch (error) {
      console.error('❌ Registration error:', error);
      res.status(500).json({ error: 'Erreur: ' + error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      let user = null;
      
      // Try database first
      if (UserDB) {
        try {
          user = await UserDB.findOne({ where: { email } });
          if (user && await user.verifyPassword(password)) {
            user.lastLogin = new Date();
            await user.save();
            const token = crypto.randomBytes(32).toString('hex');
            return res.json({ token, user: { email, firstName: user.firstName } });
          }
        } catch (dbError) {
          console.log('DB login failed, trying file storage');
        }
      }
      
      // File storage fallback
      user = users.find(u => u.email === email);
      if (!user || !(await user.verifyPassword(password))) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      // Vérifier si l'email est vérifié (simulation)
      const token = crypto.randomBytes(32).toString('hex');
      res.json({ 
        token, 
        user: { email, firstName: user.firstName },
        emailVerified: true // Pour cette version
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur: ' + error.message });
    }
  },

  // Vérifier le code email
  async verifyEmail(req, res) {
    try {
      const { email, code } = req.body;
      
      const result = emailService.verifyCode(email, code);
      
      if (!result.valid) {
        return res.status(400).json({ error: result.error });
      }
      
      // Marquer l'email comme vérifié dans le stockage
      const userIndex = users.findIndex(u => u.email === email);
      if (userIndex !== -1) {
        users[userIndex].emailVerified = true;
        saveUsers();
      }
      
      res.json({ message: 'Email vérifié avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur: ' + error.message });
    }
  },

  // Renvoyer code de vérification
  async resendCode(req, res) {
    try {
      const { email } = req.body;
      
      if (!emailService.isValidEmailFormat(email)) {
        return res.status(400).json({ error: 'Email invalide' });
      }
      
      const code = emailService.generateVerificationCode(email);
      res.json({ message: 'Code renvoyé' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur: ' + error.message });
    }
  }
};

module.exports = authController;