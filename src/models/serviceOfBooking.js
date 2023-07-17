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
        ServiceOfBooking.belongsTo(models.Service, { foreignKey: 'service'});

      }
    }
    ServiceOfBooking.init({
        booking: DataTypes.INTEGER,
        service: DataTypes.INTEGER
    }, {
      sequelize,
      modelName: 'ServiceOfBooking',
    });
    return ServiceOfBooking;
  };
