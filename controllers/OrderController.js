const express = require('express');
const Order = require('../models/Order');
const Customer = require('./../models/Customer');
const Service = require('./../models/Service');
const Salon = require('./../models/Salon');
const handler = require('../utils/Errorhandler');
const salonGraph = require('./../recommender/Recommender');
const router = express.Router();
require('./../models/Relationship');
const { check, validationResult } = require('express-validator/check');

//create order

router.post(
	'/',
	[
		check('serviceid')
			.not()
			.isEmpty(),
		check('timebooked')
			.not()
			.isEmpty(),
		check('datebooked')
			.not()
			.isEmpty(),
	],
	(req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		var userId = handler.validateAccessToken(req, res);
		Order.create({
			orderno: Math.floor(1000 + Math.random() * 9000),
			serviceid: req.body.serviceid,
			customerid: userId,
			timebooked: req.body.timebooked,
			datebooked: req.body.datebooked,
			status: 0,
		})
			.then(success => {
				var jsonString = JSON.stringify(success); //convert to string to remove the sequelize specific meta data
				var obj = JSON.parse(jsonString);
				salonGraph.insertOrders(obj);
				return res.json(success);
			})
			.catch(error => handler.handleError(res, 422, error.message));
	}
);

//get all the  orders

router.get('/all', (req, res) => {
	Order.findAll()
		.then(response => res.json(response))
		.catch(error => {
			res.status(error.status || 402);
			res.json({
				error: {
					message: error.message,
				},
			});
		});
});

//get order by salon
router.get('/salon/pending', (req, res) => {
	var userId = handler.validateAccessToken(req, res);
	Order.findAll({
		where: {
			status: 0,
		},
		include: [
			{
				model: Service,
				as: 'service',
				where: {
					salonid: userId,
				},
				include: [
					{
						model: Salon,
						as: 'salon',
						attributes: { exclude: ['password'] },
					},
				],
			},
			{
				model: Customer,
				as: 'customer',
				attributes: { exclude: ['password'] },
			},
		],
	})
		.then(response => res.json(response))
		.catch(error => handler.handleError(res, 500, error.message));
});


router.get('/salon/active', (req, res) => {
	var userId = handler.validateAccessToken(req, res);
	Order.findAll({
		where: {
			
			status: 1,
		},
		include: [
			{
				model: Service,
				as: 'service',
				where: {
					salonid: userId,
				},
				include: [
					{
						model: Salon,
						as: 'salon',
						attributes: { exclude: ['password'] },
					},
				],
			},
			{
				model: Customer,
				as: 'customer',
				attributes: { exclude: ['password'] },
			},
		],
	})
		.then(response => res.json(response))
		.catch(error => handler.handleError(res, 500, error.message));
});


router.get('/salon/closed', (req, res) => {
	var userId = handler.validateAccessToken(req, res);
	Order.findAll({
		where: {
		
			status: 2,
		},
		include: [
			{
				model: Service,
				as: 'service',
				where: {
					salonid: userId,
				},
				include: [
					{
						model: Salon,
						as: 'salon',
						attributes: { exclude: ['password'] },
					},
				],
			},
			{
				model: Customer,
				as: 'customer',
				attributes: { exclude: ['password'] },
			},
		],
	})
		.then(response => res.json(response))
		.catch(error => handler.handleError(res, 500, error.message));
});

router.get('/salon/rejected', (req, res) => {
	var userId = handler.validateAccessToken(req, res);
	Order.findAll({
		where: {
			
			status: 3,
		},
		include: [
			{
				model: Service,
				as: 'service',
				where: {
					salonid: userId,
				},
				include: [
					{
						model: Salon,
						as: 'salon',
						attributes: { exclude: ['password'] },
					},
				],
			},
			{
				model: Customer,
				as: 'customer',
				attributes: { exclude: ['password'] },
			},
		],
	})
		.then(response => res.json(response))
		.catch(error => handler.handleError(res, 500, error.message));
});

router.get('/salon', (req, res) => {
	var userId = handler.validateAccessToken(req, res);
	Order.findAll({

		include: [
			{
				model: Service,
				as: 'service',
				where: {
					salonid: userId,
				},
				include: [
					{
						model: Salon,
						as: 'salon',
						attributes: { exclude: ['password'] },
					},
				],
			},
			{
				model: Customer,
				as: 'customer',
				attributes: { exclude: ['password'] },
			},
		],
	})
		.then(response => res.json(response))
		.catch(error => handler.handleError(res, 500, error.message));
});










//salon ends here

//customer to cancel the order
router.post(
	'order/cancel',
	[
		check('orderid')
			.not()
			.isEmpty(),
	],
	(req, res) => {
		const errors = validationResult(req);
	}
);

//get orders by salon id
router.get('/customer/closed', (req, res) => {
	var userId = handler.validateAccessToken(req, res);
	Order.findAll({
		where: {
			customerid: userId,
			status: 2,
		},
		include: [
			{
				model: Service,
				as: 'service',
				include: [
					{
						model: Salon,
						as: 'salon',
						attributes: { exclude: ['password'] },
					},
				],
			},
			{
				model: Customer,
				as: 'customer',
				attributes: { exclude: ['password'] },
			},
		],
	})
		.then(response => res.json(response))
		.catch(error => handler.handleError(res, 500, error.message));
});

//get closed orders
router.get('/customer/active', (req, res) => {
	var userId = handler.validateAccessToken(req, res);
	Order.findAll({
		where: {
			customerid: userId,
			status: 1,
		},
		include: [
			{
				model: Service,
				as: 'service',
				include: [
					{
						model: Salon,
						as: 'salon',
						attributes: { exclude: ['password'] },
					},
				],
			},
			{
				model: Customer,
				as: 'customer',
				attributes: { exclude: ['password'] },
			},
		],
	})
		.then(response => res.json(response))
		.catch(error => handler.handleError(res, 500, error.message));
});

router.get('/customer/pending', (req, res) => {
	var userId = handler.validateAccessToken(req, res);
	Order.findAll({
		where: {
			customerid: userId,
			status:0,
		},
		include: [
			{
				model: Service,
				as: 'service',
				include: [
					{
						model: Salon,
						as: 'salon',
						attributes: { exclude: ['password'] },
					},
				],
			},
			{
				model: Customer,
				as: 'customer',
				attributes: { exclude: ['password'] },
			},
		],
	})
		.then(response => res.json(response))
		.catch(error => handler.handleError(res, 500, error.message));
});

router.get('/customer/rejected', (req, res) => {
	var userId = handler.validateAccessToken(req, res);
	Order.findAll({
		where: {
			customerid: userId,
			status: 3,
		},
		include: [
			{
				model: Service,
				as: 'service',
				include: [
					{
						model: Salon,
						as: 'salon',
						attributes: { exclude: ['password'] },
					},
				],
			},
			{
				model: Customer,
				as: 'customer',
				attributes: { exclude: ['password'] },
			},
		],
	})
		.then(response => res.json(response))
		.catch(error => handler.handleError(res, 500, error.message));
});

router.post('/status', function(req, res) {
	var userId = handler.validateAccessToken(req, res);
	var orderid=parseInt(req.body.orderid);
	Order.update({ status: req.body.status }, {
		 where:{orderid: orderid }},)
		.then(success =>
			res.json({
				success: {
					status: true,
				},
			})
		)
		.catch(error => handler.handleError(res, 500, error.message));
});

module.exports = router;
