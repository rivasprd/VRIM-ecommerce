"use client";

export default function FailurePage() {
    const handleRedirect = () => {
        if (window.opener) {
            window.opener.location.href = "/failure";
            window.close();
        } else {
            window.location.href = "/cart";
        }
    };

    // Auto-redirigir si está en un popup
    if (typeof window !== "undefined" && window.opener) {
        handleRedirect();
    }

    return (
        <main style={{ padding: 20 }}>
            <h1>Pago rechazado</h1>
            <p>Tu pago no fue procesado correctamente. Por favor, intenta de nuevo.</p>
            <button onClick={() => window.location.href = "/cart"}>Volver al carrito</button>
        </main>
    );
}
