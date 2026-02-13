import Link from "next/link";

export default function FailurePage() {
    return (
        <main style={{ padding: 20 }}>
            <Link href="/">HOME</Link>
            <h1>Pago rechazado</h1>
            <p>Tu pago no fue procesado correctamente. Por favor, intenta de nuevo.</p>
            <p>
                <Link href="/cart">Volver al carrito</Link>
            </p>
        </main>
    );
}
