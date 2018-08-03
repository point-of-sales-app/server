'use strict';
module.exports = (sequelize, DataTypes) => {
  var TransactionMenu = sequelize.define('TransactionMenu', {
    TransactionId: DataTypes.INTEGER,
    MenuId: DataTypes.INTEGER,
    qty: DataTypes.INTEGER
  }, {});
  TransactionMenu.associate = function(models) {
    TransactionMenu.belongsTo(models.Transaction);
    TransactionMenu.belongsTo(models.Menu);
  };
  return TransactionMenu;
};