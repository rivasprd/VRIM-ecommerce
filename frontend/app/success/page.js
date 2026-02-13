"use client";

import { useCart } from "@/context/CartContext";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SuccessPage() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("payment_id");

    useEffect(() => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/e54fe57d-a304-425d-8c86-a046314510ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'success/page.js:useEffect',message:'Success page loaded in popup',data:{paymentId,messageTypeSent:'PAYMENT_RESULT'},timestamp:Date.now(),hypothesisId:'H2-H3'})}).catch(()=>{});
        // #endregion
        // Limpiar carrito
        clearCart();

        // Enviar mensaje a la ventana que abrió el popup (opener). En un popup, parent es la misma ventana; opener es el carrito.
        const target = window.opener || window.parent;
        if (target && !target.closed) {
            target.postMessage(
                {
                    type: "PAYMENT_RESULT",
                    status: "success",
                    returnPath: "/success",
                    paymentId: paymentId,
                },
                "*"
            );
        }

        // Cerrar esta ventana
        window.close();
    }, [clearCart, paymentId]);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>¡Pago realizado!</h1>
            <p>Procesando tu pedido...</p>
        </div>
    );
}
