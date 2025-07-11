const puppeteer = require('puppeteer');

async function testPDF() {
  try {
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Test PDF</title>
      </head>
      <body>
        <h1>Test PDF</h1>
        <p>Ceci est un test de génération PDF</p>
      </body>
      </html>
    `;
    
    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();
    
    console.log('PDF généré avec succès, taille:', pdf.length, 'bytes');
    return pdf;
  } catch (error) {
    console.error('Erreur:', error);
  }
}

testPDF();