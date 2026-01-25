const Product = require("../models/product.model");
const uploadToS3 = require("../config/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);


exports.addProduct = async (req, res) => {
  const imageUrl = await uploadToS3(req.file);
  await unlinkFile(req.file.path);

  const product = await Product.create({
    name: req.body.name,
    price: req.body.price,
    category: req.body.categoryId,
    image: imageUrl,
    description:req.body.description
  });

  res.json(product);
};

exports.getProducts = async (req, res) => {
  const products = await Product.find().populate("category");
  res.json(products);
};



/*** UPDATE PRODUCT*/

exports.updateProduct = async (req, res) => {
   const imageUrl = await uploadToS3(req.file);
   await unlinkFile(req.file.path);

  try {
    const { id } = req.params;
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.price !== undefined)
      updateData.price = Number(req.body.price);
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.category) updateData.category = req.body.category;
    if (req.file) {updateData.image = imageUrl}
    const product = await Product.findByIdAndUpdate(
      id,{ $set: updateData },{ new: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


/*** DELETE PRODUCT*/

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find & delete product
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted from database successfully",
      deletedProduct: product,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // validate mongo id
    if (!id || id.length !== 24) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};
