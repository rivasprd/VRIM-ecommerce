import { CartProvider } from "../context/CartContext";

export const metadata = {
    title: "VRIM Ecommerce",
    description: "Tienda online VRIM",
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                <CartProvider>{children}</CartProvider>
            </body>
        </html>
    );
}