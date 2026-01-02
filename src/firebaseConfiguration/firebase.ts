import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!serviceAccountPath) {
  throw new Error("Firebase environment variable is not set.");
}
const resolvedPath = path.resolve(serviceAccountPath);
const fileContent = fs.readFileSync(resolvedPath, 'utf8');
const serviceAccountConfig = JSON.parse(fileContent);
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountConfig),
  });
}

export const db = admin.firestore();
export const firebaseAdmin = admin;
