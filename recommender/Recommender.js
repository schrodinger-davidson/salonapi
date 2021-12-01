const express = require('express');
const router = express.Router();
const uuidv1 = require('uuid/v1')
const neo4j = require('neo4j-driver').v1;
const handler = require('../utils/Errorhandler');
var graphenedbURL = process.env.GRAPHENEDB_BOLT_URL;
var graphenedbUser = process.env.GRAPHENEDB_BOLT_USER;
var graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD;

var driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass));
// var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '9933'));
const session = driver.session();

console.log(graphenedbUser + 'thgfbdxbjfgjhdbxsvjhvfbos');
console.log(graphenedbPass);

const salonGraph = function insertSalon(salon) {
	var cypher = 'CREATE (s:salon) SET s = {salon} RETURN s';
	var params = { salon: salon };
	runSession(cypher, params);
};

const customerGraph = function insertCustomer(customer) {
	var cypher = 'CREATE(c:customer) SET c={customer} RETURN c';
	var params = { customer: customer };
	runSession(cypher, params);
};
const serviceGraph = function insertService(service) {
	// create relationship
	console.log(service);
	var cypher = 'CREATE(c: service) SET c = { service } RETURN c';
	// var cypher = 'MATCH(s:salon{salonid:{salonid}}),(ss:service) SET ss={service} MERGE (s)-[r:PROVIDES]-(ss)';
	var params = { salonid: service.salonid, service: service };
	session
		.run(cypher, params)
		.then(u => {
			session.close();
			var joiner =
				'MATCH (s:salon),(ss:service) WHERE s.salonid = {salonid} AND ss.serviceid = {serviceid} CREATE (s)-[r:PROVIDES]->(ss)RETURN r';
			var params = { salonid: service.salonid, serviceid: service.serviceid };
			runSession(joiner, params);
		})
		.catch(err => {
			console.log(err);
		});
};
const runSession = function runSession(cypher, params) {
	session
		.run(cypher, params)
		.then(r => {
			session.close();
			console.log('saved to graph');
		})
		.catch(err => {
			console.log(err);
		});
};

const orderGraph = function insertOrderGraph(order) {
	console.log(order);
	var sid=order.serviceid;
	var cypher = 'MATCH (a:customer),(b:service) WHERE a.customerid={customerid} AND b.serviceid={serviceid} MERGE (a)-[r:BOOKED]->(b)';
	var params = { serviceid: sid, customerid: order.customerid.toString() };
	runSession(cypher, params);
};

const rateGraph=function insertRatingGraph(rating){
	var sid = rating.serviceid;
	var cid = rating.customerid.toString(2);
	console.log(rating+"  "+sid);
	var cypher = 'MATCH (a:customer),(b:service) WHERE a.customerid={customerid} AND b.serviceid={serviceid} MERGE (a)-[r:RATED]->(b)';
	var params = { serviceid: sid, customerid: cid.toString() };
	runSession(cypher, params);
}

const jsonSession=function jsonSession(cypher,params,callBack){
	session.run(cypher,params)
	.then(result=>{
		callBack(result);
	})
	.catch(err=>{
		console.log(err);
	})
}


const predictGraph= function getServiceGraph(userid,callBack){
	// var cypher = 'MATCH (a:service) RETURN a';
	// var cypher ='MATCH p = (: customer{ customerid: {customerid} }) -[r: BOOKED] -> (s: service) -[h: BOOKED] - (c: customer) -[b: BOOKED] - (ss: service) RETURN distinct ss LIMIT 25'
	var cypher = 'MATCH p = (cu: customer{ customerid: {customerid} }) -[r: BOOKED] - (s: service) -[h: BOOKED] - (c: customer) -[b: BOOKED] - (ss: service) WHERE NOT (cu)-[r] - (ss) MATCH (salon:salon) -[pro:PROVIDES]- (s),(salon)-[k:PROVIDES]-(related:service),(cu)-[booked:BOOKED]-(s)WHERE NOT (cu)-[booked] - (related) RETURN  DISTINCT ss LIMIT 25';
	var params = {customerid:userid };
	 jsonSession(cypher,params,function(result){
		callBack(result);
	});
}

//update the service by adding avatar field.
const updateAvatar=function updateAvatar(service_Id,imageUrl,callBack){
	var cypher = 'MATCH (n:service {serviceid: {serviceId}})SET n.avatar = {imageUrl}RETURN n';
	var params = { serviceId: service_Id, imageUrl: imageUrl};
	jsonSession(cypher, params, function (result) {
		callBack(result);
	});
}

module.exports = {
	insertSalonGraph: salonGraph,
	insertServiceGraph: serviceGraph,
	insertCustomer: customerGraph,
	insertOrders: orderGraph,
	insertRatings: rateGraph,
	getServiceGraph:predictGraph,
	updateAvatar:updateAvatar,
};
