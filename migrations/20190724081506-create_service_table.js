'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('services', {
			serviceid: {
				type: Sequelize.STRING(300),
				allowNull: false,
				primaryKey: true,
			},
			salonid: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			name: Sequelize.STRING(50),

			price: Sequelize.INTEGER,

			status: Sequelize.INTEGER,
			ratingavg: Sequelize.INTEGER,
			
			avatar: Sequelize.STRING,

			createdAt: Sequelize.DATE,

			updatedAt: Sequelize.DATE,
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('services');
	},
};
