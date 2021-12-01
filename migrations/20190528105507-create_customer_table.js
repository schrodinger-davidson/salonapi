'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('customers', {
			customerid: {
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

			accesstoken: Sequelize.STRING(2664),

			createdAt: Sequelize.DATE,

			updatedAt: Sequelize.DATE,
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('customers');
	},
};
