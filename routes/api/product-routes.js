const router = require('express').Router();
const { Product, Category, Tag, itemTag } = require('../../models');


// get all products
router.get('/', (req, res) => {
  Product.findAll({
    include: [
      Category,
      {
        model: Tag,
        through: itemTag,
      },
    ],
  })
    .then((products) => res.json(products))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get a specfic product
router.get('/:id', (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      Category,
      {
        model: Tag,
        through: itemTag,
      },
    ],
  })
    .then((products) => res.json(products))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// create new product
router.post('/', (req, res) => {

  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const itemTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return itemTag.bulkCreate(itemTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((itemTagIds) => res.status(200).json(itemTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});
//finding product id then finding all where id matches, setting tag removals
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return itemTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((itemTags) => {
      const itemTagIds = itemTags.map(({ tag_id }) => tag_id);
      const newitemTags = req.body.tagIds
        .filter((tag_id) => !itemTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const itemTagsToRemove = itemTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
      return Promise.all([
        itemTag.destroy({ where: { id: itemTagsToRemove } }),
        itemTag.bulkCreate(newitemTags),
      ]);
    })
    .then((updateditemTags) => res.json(updateditemTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});
// delete a specfic idf
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((products) => {
      console.log(products);
      res.json(products);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
