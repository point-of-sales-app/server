'use strict';
module.exports = (sequelize, DataTypes) => {
  var Expense = sequelize.define('Expense', {
    qty: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER
  }, {});
  Expense.associate = function(models) {
    Expense.belongsTo(models.Item);
    Expense.belongsTo(models.Restaurant);
  };
  return Expense;
};