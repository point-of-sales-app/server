'use strict';
module.exports = (sequelize, DataTypes) => {
  var PaymentMethod = sequelize.define('PaymentMethod', {
    name: DataTypes.STRING
  }, {});
  PaymentMethod.associate = function(models) {
    PaymentMethod.hasMany(models.Transaction);
  };
  return PaymentMethod;
};