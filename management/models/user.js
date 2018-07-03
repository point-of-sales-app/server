'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    RoleId: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    User.belongsTo(models.Role);
  };
  return User;
};