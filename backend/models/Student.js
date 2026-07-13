import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  hallTicket: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  registrationNumber: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  fatherName: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  motherName: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 8,
    },
  },
  section: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  photoUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  // Automatically publish every uploaded student
  published: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

  sgpa: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
  },
  cgpa: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
  },
}, {
  tableName: 'students',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['hallTicket'],
    },
    {
      unique: true,
      fields: ['registrationNumber'],
    },
    {
      fields: ['department', 'semester'],
    },
  ],
});

export default Student;