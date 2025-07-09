const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  duration: {
    type: DataTypes.FLOAT, // durée en heures
    defaultValue: 1.0, // 1h par défaut
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#3498db'
  },
  isCommonCore: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'subjects',
  timestamps: true
});

module.exports = Subject;