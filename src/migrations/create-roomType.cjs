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
        unique: true,
        allowNull: false,
      },
      name:
      {
        type: Sequelize.STRING,
        allowNull: false,
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
      employee:
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'employees', key: 'id' }
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