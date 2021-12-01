const express = require('express');
const logger = require('morgan');
const path = require('path');
const expressip=require('express-ip');
const bodyParser = require('body-parser');
require('./config/database/database');

const http = require('http');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var publicDir = require('path').join(__dirname, '/public');
app.use('/view', express.static(publicDir)); 

app.use(expressip().getIpInfoMiddleware);
 



// require('./controllers/customerController')();
const Customer = require('./controllers/customerController');
const Order = require('./controllers/OrderController');
const Salon = require('./controllers/SalonController');
const Service = require('./controllers/ServiceController');
const Image = require('./controllers/ImagUploadController');
const expressValidator = require('express-validator');
const Analytic=require('./controllers/AnalyticController');
const Rating=require('./controllers/RatingController');

app.use(expressValidator());
require('./models/Relationship');
app.use('/customer', Customer);
app.use('/order', Order);
app.use('/salon', Salon);
app.use('/service', Service);
app.use('/image', Image);
app.use('/analytic',Analytic);
app.use('/rating',Rating);

app.get('/', (req, res) =>
	res.status(200).send({
		message: 'Urban Salon',
	})
);

app.get('/avatar');
app.use('loadimage', express.static(path.join(__dirname, 'public/images')));
app.use('/viewimage', express.static(path.join(__dirname, 'public/images')));

const port = parseInt(process.env.PORT, 10) || 8201;

app.set('port', port);

const server = http.createServer(app);

server.listen(process.env.PORT || port, function() {
	console.log('Your node js server is running');
});

module.exports = app;
