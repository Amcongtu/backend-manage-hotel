'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    customer: DataTypes.INTEGER,
    room: DataTypes.INTEGER,
    checkInDate: DataTypes.DATE,
    checkOutDate: DataTypes.DATE,
    status: DataTypes.STRING,
    total: DataTypes.DECIMAL( 10, 2 ),
    gender: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    status: DataTypes.STRING,
    employee: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};