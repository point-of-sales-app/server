'use strict';
module.exports = (sequelize, DataTypes) => {
  var Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    tax: DataTypes.INTEGER
  }, 
  {
    hooks : {
    afterDestroy: (instance) => {
      sequelize.models.UserRestaurant.destroy({
        where : {RestaurantId : instance.id}
      })
    }
  }});
  Restaurant.associate = function(models) {
    Restaurant.belongsToMany(models.User, {through: models.UserRestaurant});
    Restaurant.hasMany(models.UserRestaurant);
  };
  return Restaurant;
};
