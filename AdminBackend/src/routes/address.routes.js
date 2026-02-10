const express = require("express");
const router = express.Router();
const {addAddress,getAddresses,updateAddress,deleteAddress,} = require("../controllers/address.controller");
const authMiddleware = require("../middleware/auth.middleware");
router.post("/add", authMiddleware, addAddress);
router.get("/list", authMiddleware, getAddresses);
router.put("/update/:id", authMiddleware, updateAddress);
router.delete("/delete/:id", authMiddleware, deleteAddress);

module.exports = router;
