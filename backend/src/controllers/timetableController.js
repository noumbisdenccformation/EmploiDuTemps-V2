const TimetableGenerator = require('../services/timetableGenerator');
const ConflictResolver = require('../services/conflictResolver');

const timetableController = {
  async generate(req, res) {
    try {
      const { teachers, subjects, classes, rooms, assignments } = req.body;
      
      // Validation des données d'entrée
      if (!teachers || !subjects || !classes) {
        return res.status(400).json({ 
          error: 'Données manquantes: teachers, subjects, classes requis' 
        });
      }

      const generator = new TimetableGenerator();
      const resolver = new ConflictResolver();
      
      // Détecter les conflits avant génération
      const conflicts = resolver.detectConflicts(teachers, subjects, classes);
      
      const result = generator.generate(teachers, subjects, classes, rooms, assignments);
      
      // Valider le respect des limites d'heures
      const hoursValidation = generator.validateHoursLimits(result, classes);
      const hoursReport = generator.generateHoursReport(result, classes);
      
      res.json({
        success: true,
        data: result,
        conflicts: {
          detected: conflicts,
          count: conflicts.length,
          requiresAdminDecision: conflicts.some(c => c.needsAdminDecision)
        },
        hoursValidation: {
          isValid: hoursValidation.isValid,
          violations: hoursValidation.violations,
          summary: hoursValidation.summary
        },
        hoursReport: hoursReport,
        summary: {
          classesCount: Object.keys(result.byClass).length,
          teachersCount: Object.keys(result.byTeacher).length,
          subjectsProcessed: subjects.length,
          conflictsDetected: conflicts.length,
          hoursLimitsRespected: hoursValidation.isValid,
          generatedAt: result.generatedAt
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async generateByClass(req, res) {
    try {
      const { teachers, subjects, classes } = req.body;
      
      if (!teachers || !subjects || !classes) {
        return res.status(400).json({ 
          error: 'Données manquantes: teachers, subjects, classes requis' 
        });
      }

      const generator = new TimetableGenerator();
      const timetable = generator.generateByClass(teachers, subjects, classes);
      
      // Valider le respect des limites d'heures
      const hoursValidation = generator.validateHoursLimits({ byClass: timetable }, classes);
      const hoursReport = generator.generateHoursReport({ byClass: timetable }, classes);
      
      res.json({
        success: true,
        type: 'by_class',
        timetable,
        hoursValidation: {
          isValid: hoursValidation.isValid,
          violations: hoursValidation.violations,
          summary: hoursValidation.summary
        },
        hoursReport: hoursReport
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async generateByTeacher(req, res) {
    try {
      const { teachers, subjects, classes } = req.body;
      
      if (!teachers || !subjects || !classes) {
        return res.status(400).json({ 
          error: 'Données manquantes: teachers, subjects, classes requis' 
        });
      }

      const generator = new TimetableGenerator();
      const timetable = generator.generateByTeacher(teachers, subjects, classes);
      
      res.json({
        success: true,
        type: 'by_teacher',
        timetable
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async validate(req, res) {
    try {
      const generator = new TimetableGenerator();
      const conflicts = generator.validateTimetable(req.body.timetableData);
      
      res.json({
        valid: conflicts.length === 0,
        conflicts,
        conflictCount: conflicts.length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Nouvelle route pour valider spécifiquement les limites d'heures
  async validateHoursLimits(req, res) {
    try {
      const { timetableData, classes } = req.body;
      
      if (!timetableData || !classes) {
        return res.status(400).json({ 
          error: 'Données manquantes: timetableData et classes requis' 
        });
      }

      const generator = new TimetableGenerator();
      const validation = generator.validateHoursLimits(timetableData, classes);
      const report = generator.generateHoursReport(timetableData, classes);
      
      res.json({
        success: true,
        validation,
        report,
        isValid: validation.isValid,
        violationCount: validation.violations.length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = timetableController;