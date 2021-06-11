'use strict';
module.exports = (sequelize, DataTypes) => {
  var Transaction = sequelize.define('Transaction', {
    total: DataTypes.INTEGER,
    PaymentMethodId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    Discount: DataTypes.INTEGER
  }, {});
  Transaction.associate = function(models) {
    Transaction.belongsToMany(models.Menu, {through: models.TransactionMenu});
    Transaction.belongsTo(models.PaymentMethod);
    Transaction.belongsTo(models.Restaurant);
    Transaction.belongsTo(models.User);
    Transaction.hasMany(models.TransactionMenu)
  };
  return Transaction;
};