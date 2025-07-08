// Service email Resend corrigé
const https = require('https');

const resendService = {
  async sendEmail(to, subject, text) {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey || apiKey === 'demo-key') {
      console.log(`\n📧 EMAIL (MODE DÉMO) - Code: ${text.match(/\d{6}/)?.[0]}\n`);
      return true;
    }

    return new Promise((resolve, reject) => {
      const emailData = {
        from: 'Emploi du Temps <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        text: text
      };
      
      const postData = JSON.stringify(emailData);
      console.log('📤 Envoi email à:', to);
      
      const options = {
        hostname: 'api.resend.com',
        port: 443,
        path: '/emails',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          console.log(`📊 Status: ${res.statusCode}`);
          console.log(`📝 Response: ${responseData}`);
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ Email envoyé avec succès!');
            resolve(true);
          } else {
            console.error(`❌ Erreur ${res.statusCode}: ${responseData}`);
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Erreur requête:', error);
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }
};

module.exports = resendService;