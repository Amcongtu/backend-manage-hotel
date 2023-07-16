'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code:
      {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name:
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
      employee:
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'employees', key: 'id' }
      },
      amount:
      {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      status:
      {
        type: Sequelize.STRING,
        defaultValue: "draft",  
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
    await queryInterface.dropTable('Services');
  }
};