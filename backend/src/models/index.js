const Teacher = require('./Teacher');
const Subject = require('./Subject');
const Class = require('./Class');

// Définition des associations
Teacher.belongsToMany(Subject, { 
  through: 'TeacherSubjects',
  as: 'subjects'
});

Subject.belongsToMany(Teacher, { 
  through: 'TeacherSubjects',
  as: 'teachers'
});

Subject.belongsToMany(Class, { 
  through: 'ClassSubjects',
  as: 'classes'
});

Class.belongsToMany(Subject, { 
  through: 'ClassSubjects',
  as: 'subjects'
});

module.exports = {
  Teacher,
  Subject,
  Class
};