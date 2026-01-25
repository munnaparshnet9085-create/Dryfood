const Category = require("../models/category.model");

exports.addCategory = async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.json(category);
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};