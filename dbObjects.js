const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://qtravabjlpauov:2b929125d81a36a17c9d92aed00aad154ffb65eca7c0f3fe3f1b9d021451e430@ec2-54-198-252-9.compute-1.amazonaws.com:5432/d1j44igonolhjv');

const Users = require('./models/Users')(sequelize, Sequelize.DataTypes);
const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });

/* eslint-disable-next-line func-names */
Users.prototype.addItem = async function(item) {
	const userItem = await UserItems.findOne({
		where: { user_id: this.user_id, item_id: item.id },
	});

	if (userItem) {
		userItem.amount += 1;
		return userItem.save();
	}

	return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
};

/* eslint-disable-next-line func-names */
Users.prototype.getItems = function() {
	return UserItems.findAll({
		where: { user_id: this.user_id },
		include: ['item'],
	});
};

module.exports = { Users, CurrencyShop, UserItems };