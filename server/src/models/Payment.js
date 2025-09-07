import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import Registration from './Registration.js';

class Payment extends Model {}

Payment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  registration_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'registrations',
      key: 'id'
    }
  },
  transaction_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'GHS'
  },
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Payment',
  tableName: 'payments',
  timestamps: false
});

// Define association
Payment.belongsTo(Registration, { foreignKey: 'registration_id' });
Registration.hasMany(Payment, { foreignKey: 'registration_id' });

export default Payment;
