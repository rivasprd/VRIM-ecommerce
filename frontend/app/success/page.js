"use client";

import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SuccessPage() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("payment_id");
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (hasRedirected.current) return;
        hasRedirected.current = true;

        // Limpiar carrito
        clearCart();

        // Si fue abierto como popup, redirigir la ventana padre y cerrar
        if (window.opener) {
            window.opener.location.href = "/success";
            window.close();
        }
    }, [clearCart]);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>¡Pago realizado!</h1>
            <p>Procesando tu pedido...</p>
        </div>
    );
}
