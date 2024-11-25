'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 
      await queryInterface.bulkInsert('Routes', [
        {
          userId: 1,
          title: 'Маршрут возле озера',
          distance: 12,
          place: 'Москва',
          url: 'карты'
      },
      {
        userId: 1,
        title: 'Маршрут возле парка',
        distance: 12,
        place: 'Уфа',
        url: 'карты'
    },
    {
      userId: 1,
      title: 'Маршрут возле леса',
      distance: 12,
      place: 'Уфа',
      url: 'карты'
  },

    ], {});
    
  },

  async down (queryInterface, Sequelize) {
   
      await queryInterface.bulkDelete('Routes', null, {});
     
  }
};
