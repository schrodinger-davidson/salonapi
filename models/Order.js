const Sequelize = require('sequelize');

const Order = sequelize.define('order', {
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
});

module.exports = Order;
