const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class itemTag extends Model {}

itemTag.init(
  {
    // define columns
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = itemTag;
