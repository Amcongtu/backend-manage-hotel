'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        defaultValue: '',
        allowNull: false        
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: '',
        allowNull: false        
      },
      phone: {
        type: Sequelize.STRING,
        defaultValue: '',
        allowNull: false        
      },
      username: {
        type: Sequelize.STRING,
        defaultValue: '',
        allowNull: false        
      },
      password: {
        type: Sequelize.STRING,
        defaultValue: '',
        allowNull: false        
      },
      address: {
        type: Sequelize.STRING,
        defaultValue: '',
        allowNull: true        
      },
      gender: {
        type: Sequelize.STRING,
        defaultValue: 'male',
        allowNull: true        
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        defaultValue: new Date()     ,
        allowNull: true        
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'spending',
        allowNull: true        
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};