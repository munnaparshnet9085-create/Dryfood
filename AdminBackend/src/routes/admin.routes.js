const router = require("express").Router();
const ctrl = require("../controllers/admin.controller");

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);

module.exports = router;
