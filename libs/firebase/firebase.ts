import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "dotenv/config";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

// Configuración de Firebase para el cliente
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ Inicializa Admin SDK solo una vez
if (!admin.apps.length) {
    const firebaseAdminKey = process.env.FIREBASE_ADMIN_KEY;
    if(!firebaseAdminKey) throw new Error('FIREBASE_ADMIN_KEY no configurado');
  const serviceAccount = JSON.parse(firebaseAdminKey); // Parse the JSON from the environment variable

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminAuth = admin.auth();
