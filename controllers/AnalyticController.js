const express = require('express');
const Order = require('../models/Order');
const router = express.Router();
const handler = require('../utils/Errorhandler');
const Service = require('./../models/Service');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//get booking for the past seven dates
router.get('/seven', (req, res) => {
	var startDate = dater(30);
	var endDate = new Date();
	var userId = handler.validateAccessToken(req, res);
	console.log(startDate + endDate);

	priceDatalytic(
		userId,
		startDate,
		endDate,
		result => {
			res.json(result);
		},
		error => {
			handler.handleError(res, 500, error.message);
		}
	);
});

//get canceled orders
router.get('/cancelled', (req, res) => {
	var startDate = dater(30);
	var endDate = new Date();
	var userId = handler.validateAccessToken(req, res);
	console.log(startDate + endDate);

	cancelOrdersPerDate(
		userId,
		startDate,
		endDate,
		result => {
			res.json(result);
		},
		error => {
			handler.handleError(res, 500, error.message);
		}
	);
});

//get piechart data
router.get('/picount', (req, res) => {
	var userId = handler.validateAccessToken(req, res);
	Order.findAll({
		include: [
			{
				model: Service,
				as: 'service',
				where: {
					salonid: userId,
				},
			},
		],
	})
		.then(response => {
			res.json(response);
		})
		.catch(error => handler.handleError(res, 500, error.message));
});

//get booking count
const dateAnalytic = function getDateAnalytic(userid, startdate, endDate, callback, errorCallback) {
	Order.findAll({
		where: {
			datebooked: {
				[Op.between]: [startdate, endDate],
			},
		},
		attributes: [[Sequelize.literal(`DATE("datebooked")`), 'date'], [Sequelize.literal(`COUNT(*)`), 'count']],
		group: ['date'],
	})
		.then(result => {
			callback(result);
		})
		.catch(error => {
			errorCallback(error);
		});
};

//get most earning day
const priceDatalytic = function getTotalPricelytic(userId, startdate, endDate, callback, errorCallback) {
	Order.findAll({
		where: {
			status: 2,
			datebooked: {
				[Op.between]: [startdate, endDate],
			},
		},
		include: [
			{
				model: Service,
				as: 'service',
			},
		],
		attributes: [
			[Sequelize.literal(`DATE("datebooked")`), 'date'],
			[Sequelize.literal(`COUNT(*)`), 'count'],
			[sequelize.fn('sum', sequelize.col('price')), 'total'],
		],
		group: ['order.datebooked', 'service.serviceid'],
	})
		.then(result => {
			callback(result);
		})
		.catch(error => {
			errorCallback(error);
		});
};

//counting the accepted ordes
const cancelOrdersPerDate = function getOrderCanceled(userId, startdate, endDate, callback, errorCallback) {
	Order.findAll({
		where: {
			status: 3,
			datebooked: {
				[Op.between]: [startdate, endDate],
			},
		},
		include: [
			{
				model: Service,
				as: 'service',
				where: {
					salonid: userId,
				},
			},
		],
		attributes: [
			[Sequelize.literal(`DATE("datebooked")`), 'date'],
			[Sequelize.literal(`COUNT(*)`), 'count'],
			[sequelize.fn('sum', sequelize.col('price')), 'total'],
		],
		group: ['order.datebooked', 'service.serviceid'],
	})
		.then(result => {
			callback(result);
		})
		.catch(error => {
			errorCallback(error);
		});
};

const dater = function getStartDate(dateRange) {
	var currentDate = new Date();
	var lastdate = currentDate.getDate() - 10;
	return lastdate;
};

module.exports = router;
