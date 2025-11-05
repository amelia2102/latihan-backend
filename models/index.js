const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = require('../models/user')(sequelize, DataTypes);
const Item = require('./item')(sequelize, DataTypes);

User.hasMany(Item, { foreignKey: 'userId', onDelete: 'CASCADE' });
Item.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = { sequelize, User, Item };