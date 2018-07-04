'use strict';
module.exports = (sequelize, DataTypes) => {
  var Expense = sequelize.define('Expense', {
    total: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER
  }, {});
  Expense.associate = function(models) {
    Expense.belongsToMany(models.Item, {through: models.ExpenseItem});
    Expense.hasMany(models.ExpenseItem);
  };
  return Expense;
};