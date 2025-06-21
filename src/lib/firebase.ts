import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- ATTENTION ---
// Remplacez les valeurs ci-dessous par la configuration de votre propre projet Firebase.
// Vous pouvez trouver ces informations dans la console Firebase, dans les paramètres de votre projet -> SDK setup and configuration.
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT_ID.appspot.com",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

// Initialise Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
