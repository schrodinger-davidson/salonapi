const Sequelize = require('sequelize');
const Service = sequelize.define('service', {
	serviceid: {
		type: Sequelize.STRING(300),
		allowNull: false,
		primaryKey: true,
	},
	salonid: {
		type: Sequelize.STRING(300),
		allowNull: false,
	},

	name: Sequelize.STRING(50),

	ratingavg: Sequelize.INTEGER,

	price: Sequelize.INTEGER,

	status: Sequelize.INTEGER,

	avatar: Sequelize.STRING,
});

module.exports = Service;
