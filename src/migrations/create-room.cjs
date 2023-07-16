'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rooms', {
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
      price: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false        
      },
      roomType: {
        type: Sequelize.INTEGER,
        references: { model: 'roomtypes', key: 'id' }
      },
      image: {
        type: Sequelize.INTEGER,
        allowNull: false        
      },
      employee: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'employees', key: 'id' }        
      },
      facility: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Rooms');
  }
};