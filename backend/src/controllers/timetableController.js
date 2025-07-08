const TimetableGenerator = require('../services/timetableGenerator');
const ConflictResolver = require('../services/conflictResolver');

const timetableController = {
  async generate(req, res) {
    try {
      const { teachers, subjects, classes } = req.body;
      
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
      
      const result = generator.generate(teachers, subjects, classes);
      
      res.json({
        success: true,
        data: result,
        conflicts: {
          detected: conflicts,
          count: conflicts.length,
          requiresAdminDecision: conflicts.some(c => c.needsAdminDecision)
        },
        summary: {
          classesCount: Object.keys(result.byClass).length,
          teachersCount: Object.keys(result.byTeacher).length,
          subjectsProcessed: subjects.length,
          conflictsDetected: conflicts.length,
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
      
      res.json({
        success: true,
        type: 'by_class',
        timetable
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
  }
};

module.exports = timetableController;