"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children}) {
    const [cart, setCart] = useState([]);

    //cargar carrito desde localStorage
    useEffect(() => {
        const stored = localStorage.getItem("cart");
        if (stored) setCart(JSON.parse(stored));
    }, []);

    //guardar carrito
    useEffect(() => { 
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addItem = (product) => {
        setCart((prev) => {
            const existing = prev.find((p) => p.id === product.id);
            if (existing) {
                return prev.map((p) => 
                    p.id === product.id
                        ? {...p, quantity: p.quantity + 1}
                        : p
                );
            }
            return [...prev, { ...product, quantity: 1}];
        });
    };

    const removeItem = (id) => {
        setCart((prev => prev.filter((p) => p.id !== id)));
    };

    const clearCart = () => setCart([]);

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{ cart, addItem, removeItem, clearCart, totalPrice}}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);