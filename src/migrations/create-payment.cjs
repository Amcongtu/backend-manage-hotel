'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      booking:
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'bookings', key: 'id' }
      },
      paymentAmount:
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
      paymentDate:
      {
        type: Sequelize.DATE,
        allowNull: false,
      },
      employee:
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'employees', key: 'id' }
      },
      paymentMethod:
      {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('Payments');
  }
};