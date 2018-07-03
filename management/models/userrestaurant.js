'use strict';
module.exports = (sequelize, DataTypes) => {
  var UserRestaurant = sequelize.define('UserRestaurant', {
    UserId: DataTypes.INTEGER,
    RoleId: DataTypes.INTEGER,
    RestaurantId: DataTypes.INTEGER
  }, {});
  UserRestaurant.associate = function(models) {
    UserRestaurant.belongsTo(models.Restaurant);
    UserRestaurant.belongsTo(models.User);
    UserRestaurant.belongsTo(models.Role);
  };
  return UserRestaurant;
};