const { createOrder: createOrderInDb, getOrderById: getOrderByIdFromDb } = require("../services/orders.service");

exports.createOrder = async (req, res) => {
    const { items } = req.body || {};

    if (!items || items.length === 0) {
        return res.status(400).json({ error: "Carrito Vacio" });
    }

    try {
        const order = await createOrderInDb(items);
        res.status(201).json({
            message: "Orden creada",
            id: order.id,
            items: order.items,
            total: order.total,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear la orden" });
    }
};

exports.getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await getOrderByIdFromDb(id);
        if (!order) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener la orden" });
    }
};
