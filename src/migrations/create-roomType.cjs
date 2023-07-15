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
      code:
      {
        type: Sequelize.STRING,
      },
      name:
      {
        type: Sequelize.STRING,
      },
      description:
      {
        type: Sequelize.TEXT,
      },
      capacity:
      {
        type: Sequelize.INTEGER,
        defaultValue: 2,
      },
      area:
      {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status:
      {
        type: Sequelize.STRING,
        defaultValue: 'published'
      },
      image:
      {
        type: Sequelize.INTEGER,
      },
      employee:
      {
        type: Sequelize.INTEGER,
      },
      priceBegin:
      {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RoomTypes');
  }
};