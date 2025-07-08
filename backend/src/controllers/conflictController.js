const ConflictResolver = require('../services/conflictResolver');

const conflictController = {
  // Détecter les conflits avant génération
  async detectConflicts(req, res) {
    try {
      const { teachers, subjects, classes } = req.body;
      
      if (!teachers || !subjects || !classes) {
        return res.status(400).json({ 
          error: 'Données manquantes: teachers, subjects, classes requis' 
        });
      }

      const resolver = new ConflictResolver();
      const conflicts = resolver.detectConflicts(teachers, subjects, classes);
      
      res.json({
        success: true,
        hasConflicts: conflicts.length > 0,
        conflicts,
        requiresAdminDecision: conflicts.some(c => c.needsAdminDecision)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Résoudre un conflit avec choix admin
  async resolveConflict(req, res) {
    try {
      const { conflictId, selectedTeacherId, adminUserId } = req.body;
      
      if (!conflictId || !selectedTeacherId) {
        return res.status(400).json({ 
          error: 'conflictId et selectedTeacherId requis' 
        });
      }

      // Enregistrer la décision admin
      const resolution = {
        conflictId,
        selectedTeacherId,
        resolvedBy: adminUserId,
        resolvedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        resolution,
        message: 'Conflit résolu par l\'administrateur'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtenir alternatives pour modification
  async getAlternatives(req, res) {
    try {
      const { teacherId, currentDay, currentTimeSlot } = req.query;
      const { currentSchedule } = req.body;
      
      if (!teacherId || !currentSchedule) {
        return res.status(400).json({ 
          error: 'teacherId et currentSchedule requis' 
        });
      }

      const resolver = new ConflictResolver();
      const alternatives = resolver.getAlternatives(
        currentSchedule, 
        teacherId, 
        currentDay, 
        currentTimeSlot
      );
      
      res.json({
        success: true,
        teacherId,
        currentSlot: { day: currentDay, timeSlot: currentTimeSlot },
        alternatives,
        alternativeCount: alternatives.length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Appliquer une modification
  async applyModification(req, res) {
    try {
      const { 
        teacherId, 
        fromDay, 
        fromTimeSlot, 
        toDay, 
        toTimeSlot, 
        currentSchedule 
      } = req.body;
      
      if (!teacherId || !fromDay || !toDay || !currentSchedule) {
        return res.status(400).json({ 
          error: 'Paramètres de modification incomplets' 
        });
      }

      // Simuler la modification
      const modifiedSchedule = JSON.parse(JSON.stringify(currentSchedule));
      const teacherName = `Teacher_${teacherId}`;
      
      // Déplacer le cours
      const courseInfo = modifiedSchedule.byTeacher[teacherName][fromDay][fromTimeSlot];
      if (courseInfo) {
        modifiedSchedule.byTeacher[teacherName][fromDay][fromTimeSlot] = null;
        modifiedSchedule.byTeacher[teacherName][toDay][toTimeSlot] = courseInfo;
        
        // Mettre à jour aussi la vue par classe
        const className = courseInfo.class;
        modifiedSchedule.byClass[className][fromDay][fromTimeSlot] = null;
        modifiedSchedule.byClass[className][toDay][toTimeSlot] = courseInfo;
      }

      res.json({
        success: true,
        modifiedSchedule,
        modification: {
          teacherId,
          from: { day: fromDay, timeSlot: fromTimeSlot },
          to: { day: toDay, timeSlot: toTimeSlot },
          appliedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = conflictController;