'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CheckOuts', {
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
      date:
      {
        type: Sequelize.DATE,
        allowNull: false,
      },
      description:
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status:
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
      employee:
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'employees', key: 'id' }
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
    await queryInterface.dropTable('CheckOuts');
  }
};