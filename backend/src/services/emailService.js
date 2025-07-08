const crypto = require('crypto');
const resendService = require('./resendService');

// Stockage temporaire des codes de vérification
const verificationCodes = new Map();

const emailService = {
  // Envoyer email de vérification
  async sendVerificationEmail(email, code) {
    try {
      console.log(`📧 Tentative envoi email à: ${email}`);
      console.log(`🔑 Code généré: ${code}`);
      console.log(`🔧 RESEND_API_KEY présente: ${process.env.RESEND_API_KEY ? 'OUI' : 'NON'}`);
      
      const subject = '🔐 Code de vérification - Emploi du Temps';
      const message = `Bonjour,\n\nVotre code de vérification est: ${code}\n\nCe code expire dans 10 minutes.\n\nCordialement,\nÉquipe Emploi du Temps Scolaire`;
      
      const result = await resendService.sendEmail(email, subject, message);
      console.log(`✅ Email envoyé avec succès: ${result}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return false;
    }
  },

  // Générer code de vérification
  async generateVerificationCode(email) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;
    
    verificationCodes.set(email, { code, expires });
    
    // Envoyer l'email
    await this.sendVerificationEmail(email, code);
    
    return code;
  },

  // Vérifier le code
  verifyCode(email, inputCode) {
    const stored = verificationCodes.get(email);
    
    if (!stored) {
      return { valid: false, error: 'Aucun code trouvé' };
    }
    
    if (Date.now() > stored.expires) {
      verificationCodes.delete(email);
      return { valid: false, error: 'Code expiré' };
    }
    
    if (stored.code !== inputCode) {
      return { valid: false, error: 'Code incorrect' };
    }
    
    verificationCodes.delete(email);
    return { valid: true };
  },

  // Validation email basique (gratuite)
  isValidEmailFormat(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'proton.me'];
    
    if (!regex.test(email)) return false;
    
    const domain = email.split('@')[1];
    return commonDomains.includes(domain) || domain.includes('.');
  }
};

module.exports = emailService;