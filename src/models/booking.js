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
      Booking.belongsTo(models.Room, { foreignKey: 'room' });
      Booking.hasMany(models.ServiceOfBooking, { foreignKey: 'service'});
      Booking.belongsTo(models.Customer, { foreignKey: 'customer'});
      Booking.belongsTo(models.Employee, { foreignKey: 'employee'});
      Booking.hasMany(models.Payment, { foreignKey: 'booking'});
      Booking.hasOne(models.CheckIn, { foreignKey: 'booking'});
      Booking.hasOne(models.CheckOut, { foreignKey: 'booking'});

    }
  }
  Booking.init({
    customer: DataTypes.INTEGER,
    room: DataTypes.INTEGER,
    checkInDate: DataTypes.DATE,
    checkOutDate: DataTypes.DATE,
    status: DataTypes.STRING,
    total: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    employee: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};