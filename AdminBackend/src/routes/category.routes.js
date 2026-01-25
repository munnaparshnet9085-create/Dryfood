const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const ctrl = require("../controllers/category.controller");

router.post("/", auth, ctrl.addCategory);
router.get("/", auth, ctrl.getCategories);

module.exports = router;
