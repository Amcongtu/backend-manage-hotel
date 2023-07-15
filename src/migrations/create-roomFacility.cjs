'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RoomFacilitys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code:
      {
        type:  Sequelize.STRING,
      },
      room:
      {
        type:  Sequelize.INTEGER,
        allowNull: false,
      },
      name:
      {
        type:  Sequelize.STRING,
        allowNull: false,
      },
      description:
      {
        type:  Sequelize.TEXT,
      },
      employee:
      {
        type:  Sequelize.INTEGER,
        allowNull: false,
      },
      status:
      {
        type:  Sequelize.STRING,
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
    await queryInterface.dropTable('RoomFacilitys');
  }
};