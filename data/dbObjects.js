const Sequelize = require("sequelize");
const process = require("process");
const {
	host,
	database,
	password,
	username
} = require("../config/config.json");

const sequelize = new Sequelize({
	logging: false,
	database: database || process.env.DATABASE,
	username: username || process.env.USERNAME,
	password: password || process.env.PASSWORD,
	host: host || process.env.HOST ,
	port: 5432,
	dialect: "postgres",
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	},
});

const Users = require('../models/Users')(sequelize, Sequelize.DataTypes);
const CurrencyShop = require('../models/CurrencyShop')(sequelize, Sequelize.DataTypes);
const UserItems = require('../models/UserItems')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, {
	foreignKey: 'item_id',
	as: 'item'
});

/* eslint-disable-next-line func-names */
Users.prototype.addItem = async function (item) {
	const userItem = await UserItems.findOne({
		where: {
			user_id: this.user_id,
			item_id: item.id
		},
	});

	if (userItem) {
		userItem.amount += 1;
		return userItem.save();
	}

	return UserItems.create({
		user_id: this.user_id,
		item_id: item.id,
		amount: 1
	});
};

/* eslint-disable-next-line func-names */
Users.prototype.getItems = function () {
	return UserItems.findAll({
		where: {
			user_id: this.user_id
		},
		include: ['item'],
	});
};

module.exports = {
	Users,
	CurrencyShop,
	UserItems
};