const express = require("express");
const cors = require("cors");

const productsRoutes = require("./routes/products.routes");
const orderRoutes = require("./routes/orders.routes");
const paymentsRoutes = require("./routes/payments.routes");

const app = express();

// Configurar CORS para permitir frontend local y en nube
const corsOptions = {
  origin: [
    "http://localhost:3000", // Frontend local
    process.env.FRONTEND_URL || "", // Frontend en nube (desde .env)
  ].filter(Boolean), // Filtrar valores vacíos
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/products", productsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/webhooks", require("./routes/webhooks.routes"));

module.exports = app;