'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Products.init({
    id: {type:DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
    prdNm: DataTypes.STRING,
    categori: DataTypes.STRING,
    prdImage01: DataTypes.STRING,
    prdImage02: DataTypes.STRING,
    prdImage03: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    price: DataTypes.STRING,
    desc: DataTypes.TEXT,
    update: DataTypes.STRING,
    is_api: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};