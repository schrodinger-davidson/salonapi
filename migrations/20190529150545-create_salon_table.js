'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('salons', {
			salonid: {
				type: Sequelize.STRING(767),
				allowNull: false,
				primaryKey: true,
			},
			name: Sequelize.STRING(300),

			phone: {
				type: Sequelize.STRING(20),
				allowNull: false,
				primaryKey: true,
			},

			password: Sequelize.STRING(255),

			avatar: Sequelize.STRING(300),

			location: Sequelize.STRING,

			latitude: Sequelize.STRING,

			longitude: Sequelize.STRING,

			status: Sequelize.INTEGER,

			openingtime: Sequelize.TIME,

			closingtime: Sequelize.TIME,
			accesstoken: Sequelize.STRING(2664),

			createdAt: Sequelize.DATE,

			updatedAt: Sequelize.DATE,
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('salons');
	},
};
