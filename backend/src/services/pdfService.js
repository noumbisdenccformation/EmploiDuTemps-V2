const puppeteer = require('puppeteer');

class PDFService {
  static generateScheduleHTML(schedule, title) {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const timeSlots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:30-13:30', '13:30-14:30', '14:30-15:30', '15:30-16:30'];
    
    let tableRows = '';
    timeSlots.forEach(slot => {
      let row = `<tr><td><strong>${slot}</strong></td>`;
      days.forEach(day => {
        const course = schedule.find(c => c.day === day && c.timeSlot === slot);
        if (course) {
          row += `<td class="course">
            <div><strong>${course.subject}</strong></div>
            <div>${course.teacher || course.class || ''}</div>
            <div class="room">${course.room || ''}</div>
          </td>`;
        } else {
          row += '<td></td>';
        }
      });
      row += '</tr>';
      tableRows += row;
    });
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { text-align: center; color: #2c3e50; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #333; padding: 10px; text-align: center; }
    th { background-color: #3498db; color: white; font-weight: bold; }
    .course { background-color: #f8f9fa; }
    .course strong { color: #2c3e50; }
    .room { color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <table>
    <thead>
      <tr>
        <th>Horaire</th>
        <th>Lundi</th>
        <th>Mardi</th>
        <th>Mercredi</th>
        <th>Jeudi</th>
        <th>Vendredi</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
</body>
</html>`;
  }

  static async generatePDF(schedule, title) {
    console.log('Génération PDF pour:', title);
    console.log('Données schedule:', schedule.length, 'cours');
    
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const html = this.generateScheduleHTML(schedule, title);
    console.log('HTML généré, taille:', html.length, 'caractères');
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });
    
    console.log('PDF généré, taille:', pdf.length, 'bytes');
    await browser.close();
    return pdf;
  }

  static async generateAllSchedulesPDF(schedules) {
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    let combinedHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Tous les Emplois du Temps</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #2c3e50; page-break-before: always; }
          h1:first-child { page-break-before: auto; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #3498db; color: white; }
          .course { background-color: #ecf0f1; font-size: 12px; }
          .teacher { font-weight: bold; }
          .room { color: #7f8c8d; }
        </style>
      </head>
      <body>
    `;
    
    schedules.forEach(({ schedule, title }) => {
      combinedHTML += this.generateScheduleHTML(schedule, title).replace(/<!DOCTYPE html>[\s\S]*<body>/, '').replace('</body></html>', '');
    });
    
    combinedHTML += '</body></html>';
    
    await page.setContent(combinedHTML, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });
    
    await browser.close();
    return pdf;
  }
}

module.exports = PDFService;