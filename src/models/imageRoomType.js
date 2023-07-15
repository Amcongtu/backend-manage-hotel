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
      // define association here
    }
  }
  ImageRoomType.init({
    value: DataTypes.TEXT,
    roomType: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ImageRoomType',
  });
  return ImageRoomType;
};