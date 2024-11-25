'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {

    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.hasMany(models.Rating, { foreignKey: 'routeId' });
    }
  }
  Route.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    distance: DataTypes.INTEGER,
    place: DataTypes.STRING,
    startPoint: DataTypes.JSON,
    endPoint: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'Route',
  });
  return Route;
};