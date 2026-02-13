let db = null;

function initFirebase() {
    if (db !== null) return db;

    const creds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (creds) {
        const admin = require("firebase-admin");
        if (!admin.apps.length) {
            admin.initializeApp({ credential: admin.credential.applicationDefault() });
        }
        db = admin.firestore();
        return db;
    }

    if (json) {
        try {
            const serviceAccount = JSON.parse(json);
            const admin = require("firebase-admin");
            if (!admin.apps.length) {
                admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
            }
            db = admin.firestore();
            return db;
        } catch (e) {
            console.warn("Firebase: invalid FIREBASE_SERVICE_ACCOUNT_JSON", e.message);
            return null;
        }
    }

    return null;
}

function getFirestore() {
    if (db === null) initFirebase();
    return db;
}

module.exports = { getFirestore, initFirebase };
