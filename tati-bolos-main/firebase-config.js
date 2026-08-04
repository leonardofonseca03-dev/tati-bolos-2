import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAMIrJ1TQ9vTaoj9xd6CVb967EIW3Nbn4w",
    authDomain: "saas-tati-amor-doce.firebaseapp.com",
    projectId: "saas-tati-amor-doce",
    storageBucket: "saas-tati-amor-doce.firebasestorage.app",
    messagingSenderId: "1085621176314",
    appId: "1:1085621176314:web:e28377f6dd100851edc643"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const LOJA_ID = "tati_bolos";

export { db, collection, addDoc, getDocs, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, where, LOJA_ID };