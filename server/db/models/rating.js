'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {

    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.belongsTo(models.Route, { foreignKey: 'routeId' });
    }
  }
  Rating.init({
    userId: DataTypes.INTEGER,
    routeId: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    review: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};