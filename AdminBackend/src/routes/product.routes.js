const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const {updateProduct,deleteProduct,getProductById,addProduct, getProducts} = require("../controllers/product.controller");



router.post("/", auth, upload.single("image"), addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/update/:id",authMiddleware,upload.single("image"),updateProduct);
router.delete("/delete/:id",authMiddleware,deleteProduct);

module.exports = router;
