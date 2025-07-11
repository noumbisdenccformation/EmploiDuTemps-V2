const Teacher = require('./Teacher');
const Subject = require('./Subject');
const Class = require('./Class');
const Room = require('./Room');
const TeacherAssignment = require('./TeacherAssignment');

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

// Association Subject-Room pour les matières nécessitant des salles spécifiques
Subject.belongsToMany(Room, {
  through: 'SubjectRooms',
  as: 'preferredRooms'
});

Room.belongsToMany(Subject, {
  through: 'SubjectRooms',
  as: 'subjects'
});

// Associations pour TeacherAssignment
TeacherAssignment.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });
TeacherAssignment.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
TeacherAssignment.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

Teacher.hasMany(TeacherAssignment, { foreignKey: 'teacherId', as: 'assignments' });
Subject.hasMany(TeacherAssignment, { foreignKey: 'subjectId', as: 'assignments' });
Class.hasMany(TeacherAssignment, { foreignKey: 'classId', as: 'assignments' });

// Association Room-Class pour salles uniques
Room.belongsTo(Class, { foreignKey: 'assignedClassId', as: 'assignedClass' });
Class.hasMany(Room, { foreignKey: 'assignedClassId', as: 'assignedRooms' });

module.exports = {
  Teacher,
  Subject,
  Class,
  Room,
  TeacherAssignment
};