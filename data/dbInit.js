const Sequelize = require('sequelize');
try {
    var { host, database, password, username } = require("../config/config.json");
} catch (err) {
    // pass
}

const sequelize = new Sequelize({
	database: database || process.env.DATABASE,
	username: username || process.env.PASSWORD,
	password: password || process.env.USERNAME,
	host: process.env.HOST || host,
	port: 5432,
	dialect: "postgres",
    logging: false,
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