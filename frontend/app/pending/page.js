import Link from "next/link";

export default function PendingPage() {
    return (
        <main style={{ padding: 20 }}>
            <Link href="/">HOME</Link>
            <h1>Compra pendiente!</h1>
            <p>Tu pago está en proceso. Te avisaremos cuando se acredite.</p>
            <div style={{ marginTop: 20 }}>
                <p>
                    <Link href="/cart">
                        ← Volver al carrito
                    </Link>
                </p>
            </div>
        </main>
    );
}
