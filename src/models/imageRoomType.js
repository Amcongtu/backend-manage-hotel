'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageRoomType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ImageRoomType.belongsTo(models.RoomType, { foreignKey: 'roomType' });

    }
  }
  ImageRoomType.init({
    value: DataTypes.STRING,
    valueId: DataTypes.STRING,
    roomType: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ImageRoomType',
  });
  return ImageRoomType;
};