'use strict';
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    RestaurantId: DataTypes.INTEGER
  }, {});
  Category.associate = function(models) {
    Category.belongsTo(models.Restaurant);
    Category.hasMany(models.Menu);
  };
  return Category;
};