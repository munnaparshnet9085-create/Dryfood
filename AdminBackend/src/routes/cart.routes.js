const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const cartController = require("../controllers/cart.controller");

router.post("/add", auth, cartController.addToCart);
router.get("/cartitem", auth, cartController.getCart);
router.put("/update", auth, cartController.updateCartItem);
router.delete("/remove/:productId", auth, cartController.removeCartItem);
router.delete("/clear", auth, cartController.clearCart);

module.exports = router;
