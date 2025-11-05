module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('Item', {
        title: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        description: {
        type: DataTypes.STRING,
        },
        userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        onDelete: 'CASCADE',
        },
    });

    Item.associate = (models) => {
        Item.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return Item;
};