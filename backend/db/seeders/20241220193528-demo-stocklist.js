'use strict';


const { StockList } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; 
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await StockList.bulkCreate(
      [
        {
          name: 'Owned',
          emoji: '💡',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Favorites',
          emoji: '💡',
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Watched',
          emoji: '💡',
          userId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "StockLists";
    const { Op } = Sequelize;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] },
    });
  },
};
