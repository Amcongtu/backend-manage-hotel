'use strict';
  const {
    Model
  } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class RoomFacility extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        // define association here
      }
    }
    RoomFacility.init({
        code: DataTypes.STRING,
        room: DataTypes.INTEGER,
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        employee: DataTypes.INTEGER,
        status: DataTypes.STRING,
    }, {
      sequelize,
      modelName: 'RoomFacility',
    });
    return RoomFacility;
  };