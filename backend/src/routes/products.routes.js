const express = require("express");
const router = express.Router();
const { getProducts } = require("../services/products.service");

router.get("/", async (req, res) => {
    try {
        const products = await getProducts();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

module.exports = router;
