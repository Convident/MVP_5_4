// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "mvp-5-4.firebaseapp.com",
  projectId: "mvp-5-4",
  storageBucket: "mvp-5-4.appspot.com",
  messagingSenderId: "667612498961",
  appId: "1:667612498961:web:5cb208da0d1a5fe2a075b0",
  measurementId: "G-WN1G7GH73L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;