'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Facilitys', {
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
        references: { model: 'employees', key: 'id' }
      },
      status:
      {
        type:  Sequelize.STRING,
        defaultValue: "draft"
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
    await queryInterface.dropTable('Facilitys');
  }
};