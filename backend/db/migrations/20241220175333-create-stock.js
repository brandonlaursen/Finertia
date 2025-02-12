'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stockName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      stockSymbol: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      currentPrice: {
        type: Sequelize.DECIMAL(10,2)
      },
      marketCap: {
        type: Sequelize.DECIMAL(10,2)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }
    },
  options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Stocks";
    await queryInterface.dropTable('Stocks');
  }
};
