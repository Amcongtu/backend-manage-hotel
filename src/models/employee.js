'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employee.hasMany(models.RoomType, { foreignKey: 'employee' });

    }
  }
  Employee.init({
    code: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    imageId: DataTypes.STRING,
    position: DataTypes.STRING,
    department: DataTypes.STRING,
    salary: DataTypes.INTEGER,
    hireDate: DataTypes.DATE,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};