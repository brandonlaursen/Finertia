'use strict';


const { StockList } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await StockList.bulkCreate(
      [
        {
          name: 'Owned',
          type: 'owned',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Favorites',
          type: 'favorites',
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Watched',
          type: 'watched',
          userId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    const { Op } = Sequelize;
    return queryInterface.bulkDelete("StockList", {
      userId: { [Op.in]: [1, 2, 3] },
    });
  },
};
