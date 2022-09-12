'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      prdNm: {
        type: Sequelize.STRING
      },
      categori: {
        type: Sequelize.STRING
      },
      prdImage01: {
        type: Sequelize.STRING
      },
      prdImage02: {
        type: Sequelize.STRING
      },
      prdImage03: {
        type: Sequelize.STRING
      },
      qty: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.STRING
      },
      desc: {
        type: Sequelize.TEXT
      },
      update: {
        type: Sequelize.STRING
      },
      is_api: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Products');
  }
};