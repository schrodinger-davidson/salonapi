'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('orders', {
			orderid: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			customerid: {
				type: Sequelize.STRING(300),
				allowNull: false,
			},
			serviceid: {
				type: Sequelize.STRING(300),
				allowNull: false,
			},
			orderno: {
				type: Sequelize.STRING(20),
				allowNull: false,
			},

			status: Sequelize.INTEGER,

			timebooked: Sequelize.TIME,

			datebooked: Sequelize.DATE,

			createdAt: Sequelize.DATE,

			updatedAt: Sequelize.DATE,
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('orders');
	},
};
