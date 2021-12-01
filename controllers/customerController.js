const express = require('express');
const Customer = require('./../models/Customer');
const salonGraph = require('./../recommender/Recommender')
const router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/database/_namer');

const { check, validationResult } = require('express-validator/check');

router.post(
	'/',
	[
		check('name')
			.not()
			.isEmpty(),
		check('password')
			.not()
			.isEmpty(),
		check('phone')
			.not()
			.isEmpty()
			.isMobilePhone(),
	],

	(req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		var hashedPassword = bcrypt.hashSync(req.body.password, 8);
		var token = jwt.sign({ id: req.body.phone }, config.key, {
			expiresIn: 8640000000000000000,
		});

		Customer.create({
			name: req.body.name,
			phone: req.body.phone,
			customerid: req.body.phone,
			password: hashedPassword,
			accesstoken: token,
		})
			.then(user => {
				var jsonString = JSON.stringify(user); //convert to string to remove the sequelize specific meta data
				var obj = JSON.parse(jsonString);
				salonGraph.insertCustomer(obj);
				return res.json(user);
			})
			.catch(error => handleError(res, 500, error.message));
	}
);

router.post('/login', (req, res) => {
	Customer.findOne({
		where: {
			customerid: req.body.phone,
		},
	})
		.then(user => {
			if (!user) return handleError(res, 404, 'User not found');
			var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

			if (passwordIsValid) {
				res.json(user);
			} else {
				handleError(res, 401, 'Unauthorzied');
			}
		})
		.catch(error => handleError(res, 500, error.message));
});

router.get('/get_user', (req, res) => {
	var userId = validateAccessToken(req, res);
	Customer.findOne({
		customerid: userId,
	})
		.then(user => res.json(user))
		.catch(error => handleError(res, 500, error.message));
});

router.get('/all', (req, res) => {
	Customer.findAll()
		.then(users => res.json(users))
		.catch(error => handleError(res, 500, error.message));
});

//function to handle the access token

function validateAccessToken(req, res) {
	var token = req.headers['x-access-token'];
	if (!token) return handleError(res, 401, 'Token no provided');
	var id;
	jwt.verify(token, config.key, function(err, decoded) {
		if (err) return handleError(res, 500, 'Failed to authenticate');
		id = decoded.id;
	});

	return id;
}

//function to handle error
function handleError(res, code, message) {
	res.status(code).json({
		errors: [
			{
				msg: message,
			},
		],
	});
}
module.exports = router;
