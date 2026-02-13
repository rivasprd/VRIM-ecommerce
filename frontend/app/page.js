"use client";

import { useEffect, useState } from "react";
import { getProducts } from "../services/products.service";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function Home() {
    const [products, setProducts] = useState([]);
    const { addItem } = useCart();

    useEffect(() => {
        getProducts().then(setProducts).catch(console.error);
    }, []);

    return (
        <main style={{ padding: 20}}>
            <Link href="/cart">Ver Carrito</Link>
            <h1>Vrim Ecommerce</h1>

            <ul>
                {products.map((p) => (
                    <li key={p.id}>
                        <h3>{p.name}</h3>
                        <p>${p.price}</p>
                        <img src={p.image} width={150} />
                        <br />
                        <button onClick={() => addItem(p)}>Agregar al carrito</button>
                    </li>
                ))}
            </ul>
        </main>
    )
}