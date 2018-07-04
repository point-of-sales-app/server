'use strict';
module.exports = (sequelize, DataTypes) => {
  var Menu = sequelize.define('Menu', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER
  }, {});
  Menu.associate = function(models) {
    Menu.belongsTo(models.Restaurant);
  };
  return Menu;
};