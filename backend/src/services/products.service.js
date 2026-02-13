const { getFirestore } = require("../config/firebase");

const MOCK_PRODUCTS = [
    { id: "1", name: "Chemise A", price: 15000, image: "https://via.placeholder.com/300" },
    { id: "2", name: "Chemise B", price: 18000, image: "https://via.placeholder.com/300" },
];

async function getProducts() {
    const firestore = getFirestore();
    if (firestore) {
        try {
            const snap = await firestore.collection("products").get();
            if (snap.empty) return MOCK_PRODUCTS;
            return snap.docs.map((doc) => {
                const d = doc.data();
                return {
                    id: doc.id,
                    name: d.name || "",
                    price: Number(d.price) || 0,
                    image: d.image || "https://via.placeholder.com/300",
                };
            });
        } catch (err) {
            console.warn("Firestore products error, using mock:", err.message);
            return MOCK_PRODUCTS;
        }
    }
    return MOCK_PRODUCTS;
}

module.exports = { getProducts, MOCK_PRODUCTS };
