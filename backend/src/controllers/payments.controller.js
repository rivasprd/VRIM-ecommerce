const { client } = require("../config/mercadopago");

const getBackUrl = (envKey, defaultUrl) => {
    const value = process.env[envKey];
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
    return defaultUrl;
};

const PREFERENCE_URL = "https://api.mercadopago.com/checkout/preferences";

exports.createPayment = async (req, res) => {
    const { items } = req.body || {};

    if (!items || items.length === 0) {
        return res.status(400).json({ error: "Carrito Vacio" });
    }

    const successUrl = getBackUrl("BACK_URL_SUCCESS", "http://localhost:3000/success");
    const failureUrl = getBackUrl("BACK_URL_FAILURE", "http://localhost:3000/failure");
    const pendingUrl = getBackUrl("BACK_URL_PENDING", "http://localhost:3000/pending");

    const baseBody = {
        items: items.map((item) => ({
            title: item.title,
            unit_price: Number(item.unit_price),
            quantity: Number(item.quantity),
            currency_id: "ARS",
        })),
        back_urls: {
            success: successUrl,
            failure: failureUrl,
            pending: pendingUrl,
        },
    };

    const doRequest = async (requestBody) => {
        const response = await fetch(PREFERENCE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${client.accessToken}`,
            },
            body: JSON.stringify(requestBody),
        });
        const text = await response.text();
        let data = {};
        if (text && text.trim()) {
            try {
                data = JSON.parse(text);
            } catch (_) {
                data = { message: text || `HTTP ${response.status}` };
            }
        } else if (!response.ok) {
            data = { message: `HTTP ${response.status} (empty body)` };
        }
        return { ok: response.ok, status: response.status, data };
    };

    try {
        let result = await doRequest({ ...baseBody, auto_return: "all" });
        if (!result.ok && result.data?.error === "invalid_auto_return") {
            result = await doRequest({ ...baseBody, auto_return: "approved" });
        }
        if (!result.ok && result.data?.error === "invalid_auto_return") {
            result = await doRequest(baseBody);
        }

        if (!result.ok) {
            console.error("Error creating payment preference:", result.data);
            return res.status(result.status).json({
                error: result.data?.message || "Error creating payment preference",
            });
        }

        if (!result.data.init_point) {
            console.error("No init_point in response:", result.data);
            return res.status(500).json({ error: "Error creating payment preference" });
        }

        res.json({ init_point: result.data.init_point });
    } catch (error) {
        console.error("Error creating payment preference:", error);
        res.status(500).json({ error: "Error creating payment preference" });
    }
};
