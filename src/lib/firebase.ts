import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// La configuration est maintenant chargée à partir des variables d'environnement.
// Assurez-vous que votre fichier .env contient les bonnes valeurs.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Une vérification pour s'assurer que le développeur a fourni les informations d'identification nécessaires.
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  // Remplacé l'erreur bloquante par un avertissement pour permettre le démarrage du serveur même sans config.
  // L'application ne fonctionnera pas correctement sans ces clés.
  console.warn("ATTENTION : La configuration de Firebase est manquante ou incomplète. Veuillez vérifier votre fichier .env et vous assurer que NEXT_PUBLIC_FIREBASE_API_KEY et NEXT_PUBLIC_FIREBASE_PROJECT_ID sont définis.");
}

// Initialise Firebase
// La vérification getApps().length empêche la ré-initialisation lors du rechargement à chaud en développement.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
