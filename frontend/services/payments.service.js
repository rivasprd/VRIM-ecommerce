import { apiFetch } from "./api";

export function createPayment(cart) {
    const items = cart.map(item => ({
        title: item.name,
        unit_price: item.price,
        quantity: item.quantity
    }));

    return apiFetch("/payments", {
        method: "POST",
        body: JSON.stringify({ items }),
    });
};