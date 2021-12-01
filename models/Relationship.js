const Service = require('./Service');
const Salon = require('./Salon');
const Customer = require('./Customer');
const Order = require('./Order');
const Rating= require('./Rating');

Service.belongsTo(Salon, { foreignKey: 'salonid' });
Salon.hasMany(Service, { foreignKey: 'salonid' });

Order.belongsTo(Service, { foreignKey: 'serviceid' });
Service.hasMany(Order, { foreignKey: 'serviceid' });

Service.hasMany(Rating,{as:'rating',foreignKey:'serviceid'});
Rating.belongsTo(Service,{foreignKey:'serviceid'});

Order.belongsTo(Customer, { foreignKey: 'customerid' });
Customer.hasMany(Order, { as: 'orders', foreignKey: 'customerid' });


