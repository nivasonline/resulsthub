import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
  },
  subjectCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  subjectName: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  internalMarks: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 100 },
  },
  externalMarks: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 100 },
  },
  credits: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  grade: {
    type: DataTypes.STRING(5),
    allowNull: true,
  },
  gradePoint: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  result: {
    type: DataTypes.ENUM('PASS', 'FAIL'),
    defaultValue: 'PASS',
  },
}, {
  tableName: 'subjects',
  timestamps: true,
});

export default Subject;
