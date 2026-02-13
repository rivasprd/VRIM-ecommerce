import { apiFetch } from "./api";

export function createOrder(orderData) {
    return apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({ items: orderData.items }),
    });
};