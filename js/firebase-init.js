import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAuis6CEIWpmPcgyNSPhWhwPJMaXZtNroc",
    authDomain: "upload-labs-game-d874a.firebaseapp.com",
    projectId: "upload-labs-game-d874a",
    storageBucket: "upload-labs-game-d874a.firebasestorage.app",
    messagingSenderId: "642883299920",
    appId: "1:642883299920:web:c4f544cb63ee00b26b7f55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Make available globally
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseSignInAnonymously = signInAnonymously;
window.firebaseCreateUser = createUserWithEmailAndPassword;
window.firebaseSignIn = signInWithEmailAndPassword;
window.firebaseSignOut = signOut;
window.firebaseUpdateProfile = updateProfile;
window.firebaseOnAuthStateChanged = onAuthStateChanged;
window.firebaseDoc = doc;
window.firebaseSetDoc = setDoc;
window.firebaseGetDoc = getDoc;
window.firebaseOnSnapshot = onSnapshot;
