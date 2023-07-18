'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CheckIn extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CheckIn.belongsTo(models.Booking, { foreignKey: 'booking' });
      CheckIn.belongsTo(models.Employee, { foreignKey: 'employee' });
    }
  }
  CheckIn.init({
    booking: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    date: DataTypes.DATE,
    status: DataTypes.STRING,
    employee: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CheckIn',
  });
  return CheckIn;
};