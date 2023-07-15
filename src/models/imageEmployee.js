'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageEmployee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ImageEmployee.init({
    value: DataTypes.TEXT,
    employee: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ImageEmployee',
  });
  return ImageEmployee;
};