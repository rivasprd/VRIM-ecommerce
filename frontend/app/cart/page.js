"use client";

import { useState, useEffect, useCallback } from "react";
import { useCart } from "../../context/CartContext";
import { createPayment } from "@/services/payments.service";

const POPUP_NAME = "vrim_mercadopago_checkout";

export default function CartPage() {
    const { cart, removeItem, totalPrice, clearCart } = useCart();
    const [checkoutPopup, setCheckoutPopup] = useState(null);
    const [checkoutError, setCheckoutError] = useState(null);

    const handlePaymentResult = useCallback((event) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/e54fe57d-a304-425d-8c86-a046314510ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.js:handlePaymentResult',message:'Cart received postMessage',data:{type:event.data?.type,origin:event.origin,expectedOrigin:window.location.origin},timestamp:Date.now(),hypothesisId:'H1-H5'})}).catch(()=>{});
        // #endregion
        if (event.origin !== window.location.origin || event.data?.type !== "PAYMENT_RESULT") return;
        window.removeEventListener("message", handlePaymentResult);
        if (checkoutPopup && !checkoutPopup.closed) checkoutPopup.close();
        setCheckoutPopup(null);
        const path = event.data.returnPath || (event.data.status === "success" ? "/success" : event.data.status === "pending" ? "/pending" : "/failure");
        window.location.href = path;
    }, [checkoutPopup]);

    useEffect(() => {
        if (!checkoutPopup) return;
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/e54fe57d-a304-425d-8c86-a046314510ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'cart/page.js:useEffect',message:'Cart added message listener',data:{listeningFor:'PAYMENT_RESULT'},timestamp:Date.now(),hypothesisId:'H5'})}).catch(()=>{});
        // #endregion
        window.addEventListener("message", handlePaymentResult);
        return () => window.removeEventListener("message", handlePaymentResult);
    }, [checkoutPopup, handlePaymentResult]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (checkoutPopup?.closed) {
                setCheckoutPopup(null);
                clearInterval(interval);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [checkoutPopup]);

    const handleCheckout = async () => {
        setCheckoutError(null);
        try {
            const { init_point } = await createPayment(cart);
            const popup = window.open(init_point, POPUP_NAME, "width=600,height=700,scrollbars=yes,resizable=yes");
            if (!popup) {
                setCheckoutError("Por favor permite ventanas emergentes para esta página y vuelve a intentar.");
                window.location.href = init_point;
                return;
            }
            setCheckoutPopup(popup);
        } catch (err) {
            setCheckoutError(err.message || "Error creando el pago");
            console.error(err);
        }
    };
    
    if (cart.length === 0) {
        return (
            <main style={{ padding: 20 }}>
                <a href="../">Volver a Home</a>
            <h2>Tu carrito esta vacio</h2>
            </main>
            
        )
    }

    return (
        <main style={{ padding: 20 }}>
            <a href="../">HOME</a>
            <h1>Carrito</h1>

            <ul>
                {cart.map((item) => (
                    <li key={item.id}>
                        <h3>{item.name}</h3>
                        <p>
                            {item.quantity} x ${item.price}
                        </p>
                        <button onClick={() => removeItem(item.id)}>Quitar</button>
                    </li>
                ))}
            </ul>

            <h2>Total: ${totalPrice}</h2>

            {checkoutError && <p style={{ color: "crimson" }}>{checkoutError}</p>}
            {checkoutPopup && !checkoutPopup.closed && (
                <div style={{ marginTop: 12 }}>
                    <p>
                        Completá el pago en la ventana que se abrió. Cuando termines, volverás acá automáticamente.
                    </p>
                    <p style={{ marginTop: 8, fontSize: "0.95em" }}>
                        Si ya terminaste el pago en Mercado Pago y esta página no se actualizó,{" "}
                        <a href="/success" onClick={(e) => { e.preventDefault(); clearCart(); window.location.href = "/success"; }}>
                            hacé clic acá para ir a la página de éxito
                        </a>.
                    </p>
                </div>
            )}

            <button onClick={clearCart}>Vaciar Carrito</button>
            <button onClick={handleCheckout}>Finalizar compra</button>
        </main>
    );
}