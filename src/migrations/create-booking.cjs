'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer: 
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      room: 
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'rooms', key: 'id' }
      },
      checkInDate: 
      {
        type: Sequelize.DATE,
        allowNull: false,
      },
      checkOutDate: 
      {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: 
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total: 
      {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      employee: 
      {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable('Bookings');
  }
};