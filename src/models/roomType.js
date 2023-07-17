'use strict';
  const {
    Model
  } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class RoomType extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        // define association here
        RoomType.hasMany(models.ImageRoomType, { foreignKey: 'roomType'});

        RoomType.belongsTo(models.Employee, { foreignKey: 'employee'});

        RoomType.hasMany(models.Room, { foreignKey: 'roomType' });
        
      }
    }
    RoomType.init({
        code: DataTypes.STRING,
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        capacity: DataTypes.INTEGER,
        area: DataTypes.INTEGER,
        status: DataTypes.STRING,
        employee: DataTypes.INTEGER,
        priceBegin: DataTypes.DECIMAL,
    }, {
      sequelize,
      modelName: 'RoomType',
    });
    return RoomType;
  };
