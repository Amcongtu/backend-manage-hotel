'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Booking, { foreignKey: 'booking'});
      Payment.belongsTo(models.Employee, { foreignKey: 'employee'});

    }
  }
  Payment.init({
    booking: DataTypes.INTEGER,
    paymentAmount: DataTypes.STRING,
    paymentDate: DataTypes.DATE,
    employee: DataTypes.INTEGER,
    paymentMethod: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};