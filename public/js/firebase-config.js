// Firebase Configuration
// In production, these should be set as environment variables
// For static hosting, you can inject these via a build step or use Vercel env vars

// Default configuration - replace with your actual Firebase config
// You can override these by setting window.FIREBASE_CONFIG before loading this script
const defaultConfig = {
    apiKey: "AIzaSyAuis6CEIWpmPcgyNSPhWhwPJMaXZtNroc",
    authDomain: "upload-labs-game-d874a.firebaseapp.com",
    projectId: "upload-labs-game-d874a",
    storageBucket: "upload-labs-game-d874a.firebasestorage.app",
    messagingSenderId: "642883299920",
    appId: "1:642883299920:web:c4f544cb63ee00b26b7f55"
};

// Use custom config if provided, otherwise use default
const firebaseConfig = window.FIREBASE_CONFIG || defaultConfig;

// Initialize Firebase when module loads
let app, auth, db;

async function initFirebaseModule() {
    try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        
        // Make available globally
        window.firebaseApp = app;
        window.firebaseAuth = auth;
        window.firebaseDb = db;
        
        console.log('Firebase initialized successfully');
        return { app, auth, db };
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return null;
    }
}

// Auto-initialize
initFirebaseModule();

export { firebaseConfig, initFirebaseModule };
