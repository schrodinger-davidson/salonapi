const Sequelize = require('sequelize');
const Salon = sequelize.define('salon', {
	salonid: {
		type: Sequelize.STRING(300),
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
});

module.exports = Salon;
