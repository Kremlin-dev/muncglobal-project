import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';

class Registration extends Model {}

Registration.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  registration_code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  middle_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_of_birth: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postal_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: false
  },
  program_of_study: {
    type: DataTypes.STRING,
    allowNull: false
  },
  educational_level: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  committee_preference: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emergency_contact_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emergency_contact_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emergency_contact_relationship: {
    type: DataTypes.STRING,
    allowNull: false
  },
  special_needs: {
    type: DataTypes.STRING,
    allowNull: true
  },
  special_needs_details: {
    type: DataTypes.STRING,
    allowNull: true
  },
  previous_mun_experience: {
    type: DataTypes.STRING,
    allowNull: false
  },
  how_heard: {
    type: DataTypes.STRING,
    allowNull: false
  },
  how_heard_other: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payment_status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  payment_reference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assigned_committee: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assigned_country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Registration',
  tableName: 'registrations',
  timestamps: false
});

export default Registration;
