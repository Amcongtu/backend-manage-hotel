'use strict';
  const {
    Model
  } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class ServiceOfBooking extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        // define association here
      }
    }
    ServiceOfBooking.init({
        booking: DataTypes.INTEGER,
        employee: DataTypes.INTEGER,
        service: DataTypes.INTERGER
    }, {
      sequelize,
      modelName: 'ServiceOfBooking',
    });
    return ServiceOfBooking;
  };
