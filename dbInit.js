const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://qtravabjlpauov:2b929125d81a36a17c9d92aed00aad154ffb65eca7c0f3fe3f1b9d021451e430@ec2-54-198-252-9.compute-1.amazonaws.com:5432/d1j44igonolhjv');

const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
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