'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  
   await queryInterface.bulkInsert('usuarios', [{
    email: 'root@gmail.com',
    senha: '$2b$10$WKlmC8L1oDnbfl6sUXJ7O.hV4f.afxg6RAtJvamEU24OV2wNUXEMO',
  createdAt: new Date(),
  updatedAt: new Date()
  
  }])
},
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('usuarios', {email: 'root@gmail.com'})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
