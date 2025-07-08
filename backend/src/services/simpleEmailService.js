// Service email ultra-simple avec webhook gratuit
const https = require('https');

const simpleEmailService = {
  async sendEmail(to, subject, text) {
    // Service webhook gratuit (ntfy.sh ou similaire)
    const webhookData = JSON.stringify({
      email: to,
      subject: subject,
      message: text,
      timestamp: new Date().toISOString()
    });

    // Pour l'instant, utiliser les logs mais avec format email
    console.log(`\n📧 EMAIL POUR: ${to}`);
    console.log(`📋 SUJET: ${subject}`);
    console.log(`💬 MESSAGE:`);
    console.log(text);
    console.log(`⏰ ${new Date().toLocaleString()}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    return true;
  }
};

module.exports = simpleEmailService;