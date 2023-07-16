'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FacilityOfRoomTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roomType:
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'roomtypes', key: 'id' }
      },

      facility:
      {
        type: Sequelize.INTEGER,
        references: { model: 'Facilitys', key: 'id' }

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
    await queryInterface.dropTable('FacilityOfRoomTypes');
  }
};