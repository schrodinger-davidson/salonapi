const Sequelize=require("sequelize");
const sequelize = new Sequelize('postgres://zzksufnnvenqua:6aa60c451f2e6ef277f811082299e3f0af8410ccfa3ec037241a2f183da874dc@ec2-54-235-114-242.compute-1.amazonaws.com:5432/d3h8243aek4lo');
// const sequelize=new Sequelize("urban",'root','',
// {
// host:'127.0.0.1',
// dialect:"mysql",
// operatorsAliases:false
// });

module.exports=sequelize;
global.sequelize=sequelize;
