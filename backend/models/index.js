import sequelize, { connectDB } from '../config/database.js';
import Admin from './Admin.js';
import Student from './Student.js';
import Subject from './Subject.js';

// Associations
Student.hasMany(Subject, {
  foreignKey: 'studentId',
  as: 'subjects',
  onDelete: 'CASCADE',
});
Subject.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student',
});

export { sequelize, connectDB, Admin, Student, Subject };
