const express = require('express');
const crypto = require('crypto');
const router = express.Router();

/**
 * Valida la firma X-Signature del webhook de MercadoPago
 * Formato: ts=...,v1=hash (ej: ts=1234567890,v1=abcd1234...)
 * Manifest: id:${dataID};request-id:${xRequestId};ts:${ts};
 * Documentación: https://developers.mercadopago.com.ar/es/docs/checkout-pro/additional-content/your-integrations/webhooks
 */
function validateSignature(req) {
    const signature = req.headers['x-signature'];
    const requestId = req.headers['x-request-id'];
    const dataId = req.query['data.id']; // Obtener del query param
    
    console.log('DEBUG - Headers:', { signature, requestId });
    console.log('DEBUG - Query:', req.query);
    
    if (!signature || !requestId || !dataId) {
        console.warn('⚠️ Webhook sin firma, request-id o data.id');
        console.warn(`  Firma: ${signature ? '✓' : '✗'}`);
        console.warn(`  Request ID: ${requestId ? '✓' : '✗'}`);
        console.warn(`  Data ID: ${dataId ? '✓' : '✗'}`);
        return false;
    }
    
    // Obtener webhook secret key del dashboard de MercadoPago
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    
    if (!secret) {
        console.warn('⚠️ MERCADOPAGO_WEBHOOK_SECRET no está configurado en .env');
        return false;
    }
    
    // Parsear la firma: puede ser "ts=...,v1=..." o separado por comas
    let ts, receivedHash;
    
    const parts = signature.split(',');
    parts.forEach(part => {
        const [key, value] = part.split('=');
        if (key && value) {
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            if (trimmedKey === 'ts') {
                ts = trimmedValue;
            } else if (trimmedKey === 'v1') {
                receivedHash = trimmedValue;
            }
        }
    });
    
    if (!ts || !receivedHash) {
        console.error('❌ No se pudo extraer ts o v1 de la firma:', signature);
        return false;
    }
    
    // Generar el manifest exactamente como MercadoPago lo describe
    // Formato: id:${dataID};request-id:${xRequestId};ts:${ts};
    const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
    
    // Calcular HMAC SHA256
    const calculatedHash = crypto
        .createHmac('sha256', secret)
        .update(manifest)
        .digest('hex');
    
    console.log(`  Data ID:        ${dataId}`);
    console.log(`  Timestamp:      ${ts}`);
    console.log(`  Manifest:       "${manifest}"`);
    console.log(`  Hash recibido:   ${receivedHash}`);
    console.log(`  Hash calculado:  ${calculatedHash}`);
    
    // Comparación segura (timing-safe)
    let isValid = false;
    try {
        isValid = crypto.timingSafeEqual(
            Buffer.from(receivedHash, 'hex'),
            Buffer.from(calculatedHash, 'hex')
        );
    } catch (err) {
        console.error('Error comparando firmas:', err.message);
        isValid = false;
    }
    
    if (isValid) {
        console.log('✓ Firma del webhook validada correctamente');
    } else {
        console.error('❌ Firma del webhook inválida');
    }
    
    return isValid;
}

// POST /api/webhooks/mercadopago
router.post('/mercadopago', (req, res) => {
    try {
        // VALIDAR FIRMA
        const isValidSignature = validateSignature(req);
        
        if (!isValidSignature && process.env.NODE_ENV === 'production') {
            console.error('❌ Webhook rechazado: firma inválida');
            return res.status(403).json({ error: 'Invalid signature' });
        }
        
        // En desarrollo, permitir sin firma para testing
        if (!isValidSignature && process.env.NODE_ENV !== 'production') {
            console.warn('⚠️ En DESARROLLO: webhook aceptado sin validar firma');
        }
        
        // Obtener datos
        const { data, type } = req.query;
        const bodyData = req.body;
        
        const webhookType = type || bodyData?.type;
        const webhookId = data?.id || bodyData?.data?.id || bodyData?.id;
        
        console.log(`✓ Webhook procesado de MercadoPago`);
        console.log(`  Tipo: ${webhookType}`);
        console.log(`  ID: ${webhookId}`);
        console.log(`  Request ID: ${req.headers['x-request-id']}`);
        
        // IMPORTANTE: Responder RÁPIDAMENTE (MP espera 200 en pocos segundos)
        res.status(200).json({ 
            status: 'received',
            message: 'Webhook procesado correctamente'
        });
        
        // TODO: Procesar en background si es necesario
        // - Actualizar estado de orden
        // - Registrar pago en BD
        // - Enviar email de confirmación
        
    } catch (error) {
        console.error('Error procesando webhook:', error);
        // MercadoPago reintentará si no recibe 200
        res.status(200).json({ 
            status: 'error_but_acknowledged',
            message: 'Error pero webhook recibido'
        });
    }
});

module.exports = router;
