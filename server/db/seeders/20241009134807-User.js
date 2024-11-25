"use strict";
const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "123",
          email: "123@123",
          password: "123",
         
          },
          {
          username: "admin",
          email: "admin@admin",
          password: await bcrypt.hash('321', 10),
          
          },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
   
      await queryInterface.bulkDelete('Users', null, {});
     
  },
};
