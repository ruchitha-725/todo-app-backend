import admin from 'firebase-admin';

const serviceAccountConfig = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccountConfig) {
  throw new Error("Firebase environment variable is not set.");
}
if (!admin.apps.length) {
  const parsedConfig = JSON.parse(serviceAccountConfig);
  parsedConfig.private_key = parsedConfig.private_key.replace(/\\n/g, '\n');
  admin.initializeApp({
    credential: admin.credential.cert(parsedConfig),
  });
}

export const db = admin.firestore();
export const firebaseAdmin = admin;
