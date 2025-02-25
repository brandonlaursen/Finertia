"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    try {
      await queryInterface.createTable(
        "Users",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          hashedPassword: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          balance: {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0,
          },
          firstName: {
            type: Sequelize.STRING,
            defaultValue: "",
          },
          lastName: {
            type: Sequelize.STRING,
            defaultValue: "",
          },
          profilePic: {
            type: Sequelize.STRING,
            defaultValue:
              "https://finertia.s3.amazonaws.com/public/1739990232538.png",
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
          },
        },
        options
      );
    } catch (e) {
      console.log(e);
    }
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.dropTable(options);
  },
};
