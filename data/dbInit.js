const Sequelize = require('sequelize');
const { host, database, password, username } = require("../config/config.json");

const sequelize = new Sequelize({
	database: process.env.DATABASE || database,
	username: process.env.USERNAME || username,
	password: process.env.PASSWORD || password,
	host: process.env.HOST || host,
	port: 5432,
	dialect: "postgres",
	dialectOptions: {
	  ssl: {
		require: true, 
		rejectUnauthorized: false 
	  }
	},
  });

const CurrencyShop = require('../models/CurrencyShop')(sequelize, Sequelize.DataTypes);
require('./models/Users')(sequelize, Sequelize.DataTypes);
require('./models/UserItems')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'Tea', cost: 1 }),
		CurrencyShop.upsert({ name: 'Coffee', cost: 2 }),
		CurrencyShop.upsert({ name: 'Cake', cost: 5 }),
	];
	await Promise.all(shop);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);