'use strict';

module.exports = {
	up: (queryInterface, sequelize) => {
		return queryInterface.createTable('rates', {
			ratid: {
				type: sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			rating: sequelize.INTEGER,

			serviceid: sequelize.STRING,

			customerid: sequelize.STRING,

			createdAt: sequelize.DATE,

			updatedAt: sequelize.DATE,
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('users');
	},
};
