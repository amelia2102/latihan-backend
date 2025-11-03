const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'items',
  timestamps: true,
});

Item.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Item, { foreignKey: 'userId' });

module.exports = Item;