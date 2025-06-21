import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- ATTENTION : ACTION REQUISE ---
// Pour que l'application fonctionne, vous devez remplacer les valeurs ci-dessous
// par la configuration de votre propre projet Firebase.
//
// Comment trouver ces informations :
// 1. Allez sur la console Firebase : https://console.firebase.google.com/
// 2. Sélectionnez votre projet.
// 3. Cliquez sur l'icône d'engrenage (⚙️) à côté de "Project Overview" et allez dans "Project settings".
// 4. Dans l'onglet "General", faites défiler jusqu'à la section "Your apps".
// 5. Cliquez sur l'icône "</>" pour voir la configuration de votre application web.
// 6. Copiez les valeurs de l'objet de configuration et collez-les ici.
//
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY", // <-- REMPLACEZ CECI
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com", // <-- REMPLACEZ CECI
  projectId: "VOTRE_PROJECT_ID", // <-- REMPLACEZ CECI
  storageBucket: "VOTRE_PROJECT_ID.appspot.com", // <-- REMPLACEZ CECI
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID", // <-- REMPLACEZ CECI
  appId: "VOTRE_APP_ID" // <-- REMPLACEZ CECI
};

// Initialise Firebase
// Ne modifiez pas le code ci-dessous
let app;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  console.error("Erreur d'initialisation de Firebase. Vérifiez que firebaseConfig est correct.", e);
  // Si l'initialisation échoue, on crée un objet 'app' factice pour éviter d'autres erreurs,
  // mais l'application ne fonctionnera pas avec la base de données.
  app = {}; 
}

const db = getFirestore(app);

export { app, db };
