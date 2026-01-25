const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());
require("./src/config/db");
const cors = require("cors");
require("./src/config/passport");
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./src/routes/user.routes"));

app.use("/api/admin", require("./src/routes/admin.routes"));
app.use("/api/category", require("./src/routes/category.routes"));
app.use("/api/product", require("./src/routes/product.routes"));

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
