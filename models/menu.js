'use strict';
module.exports = (sequelize, DataTypes) => {
  var Menu = sequelize.define('Menu', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER
  }, {});
  Menu.associate = function(models) {
    Menu.belongsTo(models.Restaurant);
    Menu.belongsTo(models.Category);
    Menu.hasMany(models.TransactionMenu)
    Menu.belongsToMany(models.Transaction, {through: models.TransactionMenu});
  };
  return Menu;
};