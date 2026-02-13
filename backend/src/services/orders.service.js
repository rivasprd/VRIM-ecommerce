const { getFirestore } = require("../config/firebase");

const inMemoryOrders = [];

function generateOrderId() {
    return "ORD-" + Date.now();
}

async function createOrder(items) {
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const id = generateOrderId();
    const order = { id, items, total };

    const firestore = getFirestore();
    if (firestore) {
        try {
            const { FieldValue } = require("firebase-admin/firestore");
            await firestore.collection("orders").doc(id).set({
                id,
                items,
                total,
                createdAt: FieldValue.serverTimestamp(),
            });
            return order;
        } catch (err) {
            console.warn("Firestore order create error, using in-memory:", err.message);
        }
    }
    inMemoryOrders.push(order);
    return order;
}

async function getOrderById(id) {
    const firestore = getFirestore();
    if (firestore) {
        try {
            const doc = await firestore.collection("orders").doc(id).get();
            if (doc.exists) return doc.data();
        } catch (err) {
            console.warn("Firestore order get error:", err.message);
        }
    }
    const order = inMemoryOrders.find((o) => o.id === id);
    return order || null;
}

module.exports = { createOrder, getOrderById, inMemoryOrders };
