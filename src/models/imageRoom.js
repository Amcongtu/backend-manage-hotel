'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImageRoom.belongsTo(models.Room, { foreignKey: 'room' });

    }
  }
  ImageRoom.init({
    value: DataTypes.STRING,
    valueId: DataTypes.STRING,
    room: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ImageRoom',
  });
  return ImageRoom;
};