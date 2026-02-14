"use client";

export default function PendingPage() {
    const handleRedirect = () => {
        if (window.opener) {
            window.opener.location.href = "/pending";
            window.close();
        }
    };

    // Auto-redirigir si está en un popup
    if (typeof window !== "undefined" && window.opener) {
        handleRedirect();
    }

    return (
        <main style={{ padding: 20 }}>
            <h1>Compra pendiente</h1>
            <p>Tu pago está en proceso. Te avisaremos cuando se acredite.</p>
            <button onClick={() => window.location.href = "/cart"}>Volver al carrito</button>
        </main>
    );
}
