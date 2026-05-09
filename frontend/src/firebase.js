// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "foodify-66976.firebaseapp.com",
  projectId: "foodify-66976",
  storageBucket: "foodify-66976.firebasestorage.app",
  messagingSenderId: "601348285692",
  appId: "1:601348285692:web:8c2f21762f055af7e72379"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export {app, auth}