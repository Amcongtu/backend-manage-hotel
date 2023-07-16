'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        unique:true,
        allowNull: false        
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false        
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false        
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false        
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false        
      },
      department: {
        type: Sequelize.STRING,
        allowNull: true        
      },
      salary: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true        
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false        
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true        
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true        
      },
      hireDate: {
        type: Sequelize.DATE,
        defaultValue: new Date()     ,
        allowNull: true        
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'active',
        allowNull: true        
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Employees');
  }
};