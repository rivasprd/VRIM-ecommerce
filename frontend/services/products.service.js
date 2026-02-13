import { apiFetch } from "./api";

export const getProducts = () => {
    return apiFetch("/products");
};