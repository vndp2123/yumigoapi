const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const addressRoutes = require("./routes/address.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/addresses", addressRoutes);

module.exports = app;

//192.168.29.145
