'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageCustomer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  ImageCustomer.init({
    value: DataTypes.TEXT,
    customer: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ImageCustomer',
  });
  return ImageCustomer;
};