'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RoomTypes', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false        
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true        
      },
      area: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false        
      },
      employee: {
        type: Sequelize.INTEGER,
        allowNull: false        
      },
      image: {
        type: Sequelize.INTEGER,
        allowNull: false        
      },
      employee: {
        type: Sequelize.INTEGER,
        allowNull: false        
      },
      priceBegin: {
        type: Sequelize.priceBegin,
        allowNull: false        
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'published',
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
    await queryInterface.dropTable('RoomTypes');
  }
};