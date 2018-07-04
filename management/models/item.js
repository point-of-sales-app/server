'use strict';
module.exports = (sequelize, DataTypes) => {
  var Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    RestaurantId: DataTypes.INTEGER,
    UnitId: DataTypes.INTEGER
  }, {});
  Item.associate = function(models) {
    Item.belongsTo(models.Unit);
    Item.belongsTo(models.Restaurant);
    Item.hasMany(models.Expense);
  };
  return Item;
};