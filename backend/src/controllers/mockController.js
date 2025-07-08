// Données mock pour tester sans base de données
let teachers = [
  { id: 1, firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@school.fr', isActive: true }
];
let subjects = [
  { id: 1, name: 'Mathématiques', code: 'MATH', duration: 60, isActive: true }
];
let classes = [
  { id: 1, name: '6ème A', level: '6ème', studentCount: 25, isActive: true }
];

const mockController = {
  // Teachers
  getTeachers: (req, res) => res.json(teachers),
  createTeacher: (req, res) => {
    const teacher = { id: Date.now(), ...req.body };
    teachers.push(teacher);
    res.status(201).json(teacher);
  },

  // Subjects
  getSubjects: (req, res) => res.json(subjects),
  createSubject: (req, res) => {
    const subject = { id: Date.now(), ...req.body };
    subjects.push(subject);
    res.status(201).json(subject);
  },

  // Classes
  getClasses: (req, res) => res.json(classes),
  createClass: (req, res) => {
    const classItem = { id: Date.now(), ...req.body };
    classes.push(classItem);
    res.status(201).json(classItem);
  }
};

module.exports = mockController;