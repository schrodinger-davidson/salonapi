const Sequelize = require('sequelize');
const Rate = sequelize.define('rate', {
	ratid: {
		type: Sequelize.INTEGER,
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
	},
	rating: Sequelize.INTEGER,

	serviceid: Sequelize.STRING,

	customerid: Sequelize.STRING,
});

module.exports=Rate;