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
  apiKey: "AIzaSyDUYlyo80qdoSR6BGigx0lvTj8DUwoGK7w",
  authDomain: "appli-c2d60.firebaseapp.com",
  projectId: "appli-c2d60",
  storageBucket: "appli-c2d60.appspot.com",
  messagingSenderId: "232907452033",
  appId: "1:232907452033:web:7170f4b75c4f668eb6e780",
  measurementId: "G-YGDC2J7GY5"
};

// Initialise Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
