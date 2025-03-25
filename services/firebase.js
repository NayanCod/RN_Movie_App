// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHpbZCkKUIr5GPZzhpfbRC-HBrwcorruo",
  authDomain: "watchspot-21dd4.firebaseapp.com",
  projectId: "watchspot-21dd4",
  storageBucket: "watchspot-21dd4.firebasestorage.app",
  messagingSenderId: "183735588850",
  appId: "1:183735588850:web:e65493776a371336143d6b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);