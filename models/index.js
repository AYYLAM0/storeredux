const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const itemTag = require('./itemTag');

Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

Category.hasMany(Product, {
  foreignKey: 'category_id',
});

Product.belongsToMany(Tag, {
  through: itemTag,
  foreignKey: 'product_id',
});

Tag.belongsToMany(Product, {
  through: itemTag,
  foreignKey: 'tag_id',
});

module.exports = {
  Product,
  itemTag,
  Category,
  Tag
};
