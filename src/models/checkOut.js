'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CheckOut extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CheckOut.belongsTo(models.Room, { foreignKey: 'booking' });
      CheckOut.belongsTo(models.Room, { foreignKey: 'employee' });
    }
  }
  CheckOut.init({
    booking: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    date: DataTypes.DATE,
    status: DataTypes.STRING,
    employee: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CheckOut',
  });
  return CheckOut;
};