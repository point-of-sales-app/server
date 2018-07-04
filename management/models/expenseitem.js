'use strict';
module.exports = (sequelize, DataTypes) => {
  var ExpenseItem = sequelize.define('ExpenseItem', {
    qty: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER,
    ExpenseId: DataTypes.INTEGER
  }, {});
  ExpenseItem.associate = function(models) {
    ExpenseItem.belongsTo(models.Item);
    ExpenseItem.belongsTo(models.Expense);
  };
  return ExpenseItem;
};