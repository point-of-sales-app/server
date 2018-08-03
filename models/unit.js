'use strict';
module.exports = (sequelize, DataTypes) => {
  var Unit = sequelize.define('Unit', {
    name: DataTypes.STRING
  }, {});
  Unit.associate = function(models) {
    Unit.hasMany(models.Item);
  };
  return Unit;
};