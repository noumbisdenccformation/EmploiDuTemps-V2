const PDFService = require('../services/pdfService');
const { Teacher, Class } = require('../models');

const pdfController = {
  // Générer PDF pour un emploi du temps spécifique
  async generateSchedulePDF(req, res) {
    try {
      const { schedule, title } = req.body;
      
      if (!schedule || !title) {
        return res.status(400).json({ error: 'Schedule et title requis' });
      }

      const pdf = await PDFService.generatePDF(schedule, title);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${title}.pdf"`);
      res.send(pdf);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Générer PDF pour tous les emplois du temps
  async generateAllSchedulesPDF(req, res) {
    try {
      const { schedules } = req.body;
      
      if (!schedules || !Array.isArray(schedules)) {
        return res.status(400).json({ error: 'Array schedules requis' });
      }

      const pdf = await PDFService.generateAllSchedulesPDF(schedules);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Tous_les_emplois_du_temps.pdf"');
      res.send(pdf);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = pdfController;