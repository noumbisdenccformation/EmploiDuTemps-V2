const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TeacherAssignment = sequelize.define('TeacherAssignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hoursPerWeek: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'teacher_assignments',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['subjectId', 'classId']
    }
  ]
});

module.exports = TeacherAssignment;