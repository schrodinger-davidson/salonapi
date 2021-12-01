const express = require('express');
const router = express.Router();
const uuidv1 = require('uuid/v1');
const handler = require('../utils/Errorhandler');
const salonGraph = require('./../recommender/Recommender');
const predicter = require('../recommender/Recommender');
const Service = require('./../models/Service');
const Salon = require('./../models/Salon');
const Rating = require('./../models/Rating');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { check, validationResult } = require('express-validator/check');

//creates a service
router.post(
	'/create',
	[
		check('name')
			.not()
			.isEmpty(),
		check('price')
			.not()
			.isEmpty()
			.isInt(),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		var userId = handler.validateAccessToken(req, res);

		Service.create({
			serviceid: uuidv1(),
			salonid: userId,
			name: req.body.name,
			price: req.body.price,
			status: '0',
		})
			.then(response => {
				var jsonString = JSON.stringify(response); //convert to string to remove the sequelize specific meta data
				var obj = JSON.parse(jsonString);
				salonGraph.insertServiceGraph(obj);
				console.log(jsonString);
				return res.json(response);
			})
			.catch(error => handler.handleError(res, 500, error.message));
	}
);

router.post('/update_image', (req, res) => {
	var serviceid = req.body.serviceid;
	var imageurl = req.body.imageurl;
	salonGraph.updateAvatar(serviceid, imageurl, (result) => {
		return res.json(result);
	});
});

//update service status
router.post('/status', function(req, res) {
	var userId = handler.validateAccessToken(req, res);
	var vserviceid = req.body.serviceid;
	var status = parseInt(req.body.status);
	console.log(status);
	console.log(vserviceid);
	Service.update(
		{ status: status },
		{
			where: { serviceid: vserviceid },
		}
	)
		.then(success =>
			res.json({
				success: {
					status: true,
				},
			})
		)
		.catch(error => handler.handleError(res, 500, error.message));
});

//get all the service by salon

router.get('/salon_self', (req, res) => {
	var userId = handler.validateAccessToken(req, res);
	Service.findAll({
		where: {
			salonid: userId,
			[Op.or]: [{ status: 1 }, { status: 0 }],
		},
		include: [
			{
				model: Salon,
				as: 'salon',
				attributes: { exclude: ['password'] },
			},
		],
	})
		.then(response => {
			res.json(response);
		})
		.catch(error => handler.handleError(res, 500, error.message));
});

// function to get all the services
// router.get('/all', (req, res) => {
// 	const ipInfo = req.ipInfo;
// 	console.log(ipInfo);
// 	Rating.findAll({
// 		attributes: [
// 			[Sequelize.fn('SUM', Sequelize.col('rating')), 'total'],
// 		],
// 	})
// 		.then(response => {
// 			res.json(response);
// 		})
// 		.catch(error => handler.handleError(res, 500, error.message));
// });

router.get('/all', (req, res) => {
	const ipInfo = req.ipInfo;
	console.log(ipInfo);
	Service.findAll({
		where: {
			[Op.or]: [{ status: 1 }, { status: 0 }],
		},
		include: [
			{
				model: Salon,
				as: 'salon',
				attributes: { exclude: ['password'] },
			},
		],
	})
		.then(response => {
			res.json(response);
		})
		.catch(error => handler.handleError(res, 500, error.message));
});

//function to get the service prediction
router.get('/recommendation', (req, res) => {
	var userid = handler.getUserId(req, res);
	//create graph instance from function;
	var result = predicter.getServiceGraph(userid, result => {
		var serviceArr = [];
		result.records.forEach(element => {
			element.forEach(node => {
				serviceArr.push(node.properties);
				console.log(node);
			});

			console.log('end of a single node');
		});
		if (serviceArr.length == 0) {
			Service.findAll({
				include: [
					{
						model: Salon,
						as: 'salon',
						attributes: { exclude: ['password'] },
					},
				],
			})
				.then(response => {
					res.json(response);
				})
				.catch(error => handler.handleError(res, 500, error.message));
		} else {
			res.json(serviceArr);
		}
	});
});
module.exports = router;
