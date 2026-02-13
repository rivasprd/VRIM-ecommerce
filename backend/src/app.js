const express = require("express");
const cors = require("cors");

const productsRoutes = require("./routes/products.routes");

const orderRoutes = require("./routes/orders.routes")

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/products", productsRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", require("./routes/payments.routes"));

module.exports = app;