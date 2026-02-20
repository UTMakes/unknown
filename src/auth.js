// Firebase Auth Module
import { game, restoreGameState } from './game.js';
import { updateStatsUI, renderWorld } from './ui.js';

let currentUser = null;
let cloudSaveEnabled = false;
let autoSyncInterval = null;

// Initialize Firebase Auth
export async function initFirebase() {
    try {
        if (!window.firebaseAuth) {
            setTimeout(initFirebase, 1000);
            return;
        }
        
        const auth = window.firebaseAuth;
        const onAuthStateChanged = window.firebaseOnAuthStateChanged;
        
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser = user;
                cloudSaveEnabled = true;
                updateCloudSaveStatus('online', 'Cloud Save Active');
                updateAccountUI(user);
                
                // Try to load saved game
                loadFromCloud();
                
                // Set up auto-sync every 5 minutes
                if (autoSyncInterval) clearInterval(autoSyncInterval);
                autoSyncInterval = setInterval(() => {
                    if (cloudSaveEnabled && currentUser) syncToCloud();
                }, 300000);
            } else {
                currentUser = null;
                cloudSaveEnabled = false;
                updateCloudSaveStatus('offline', 'Offline');
                updateAccountUI(null);
            }
        });
    } catch (error) {
        console.error('Firebase init error:', error);
        updateCloudSaveStatus('error', 'Cloud Save Error');
    }
}

// Update account UI based on login state
function updateAccountUI(user) {
    const loggedOutView = document.getElementById('accountLoggedOut');
    const loggedInView = document.getElementById('accountLoggedIn');
    const panelText = document.getElementById('accountPanelText');
    const btnText = document.getElementById('accountBtnText');
    const icon = document.getElementById('accountIcon');
    const status = document.getElementById('accountStatus');
    
    if (user) {
        if (loggedOutView) loggedOutView.style.display = 'none';
        if (loggedInView) loggedInView.style.display = 'block';
        
        if (panelText) panelText.innerText = 'Your progress is saved to the cloud!';
        if (btnText) btnText.innerText = 'Account';
        if (icon) icon.className = 'fa-solid fa-user-check';
        if (status) status.innerText = 'Logged in as ' + (user.displayName || user.email);
        
        const displayNameEl = document.getElementById('accountDisplayName');
        const emailEl = document.getElementById('accountEmail');
        if (displayNameEl) displayNameEl.innerText = user.displayName || 'Player';
        if (emailEl) emailEl.innerText = user.email;
    } else {
        if (loggedOutView) loggedOutView.style.display = 'block';
        if (loggedInView) loggedInView.style.display = 'none';
        
        if (panelText) panelText.innerText = 'Login to save your progress to the cloud!';
        if (btnText) btnText.innerText = 'Login / Register';
        if (icon) icon.className = 'fa-solid fa-user';
        if (status) status.innerText = 'Not logged in';
    }
}

// Register new user
export async function registerUser() {
    const displayName = document.getElementById('registerDisplayName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    if (!displayName || !email || !password) {
        showAccountError('Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        showAccountError('Password must be at least 6 characters');
        return;
    }
    
    try {
        const auth = window.firebaseAuth;
        const createUser = window.firebaseCreateUser;
        const updateProfile = window.firebaseUpdateProfile;
        
        const userCredential = await createUser(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: displayName });
        await syncToCloud();
        
        showAccountError('');
        
    } catch (error) {
        let message = 'Registration failed';
        if (error.code === 'auth/email-already-in-use') message = 'Email already in use';
        if (error.code === 'auth/invalid-email') message = 'Invalid email address';
        if (error.code === 'auth/weak-password') message = 'Password is too weak';
        showAccountError(message);
    }
}

// Login existing user
export async function loginUser() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showAccountError('Please enter email and password');
        return;
    }
    
    try {
        const auth = window.firebaseAuth;
        const signIn = window.firebaseSignIn;
        
        await signIn(auth, email, password);
        
        showAccountError('');
        await loadFromCloud();
        
    } catch (error) {
        let message = 'Login failed';
        if (error.code === 'auth/user-not-found') message = 'User not found';
        if (error.code === 'auth/wrong-password') message = 'Incorrect password';
        if (error.code === 'auth/invalid-email') message = 'Invalid email address';
        if (error.code === 'auth/invalid-credential') message = 'Invalid email or password';
        showAccountError(message);
    }
}

// Logout user
export async function logoutUser() {
    try {
        const auth = window.firebaseAuth;
        const signOut = window.firebaseSignOut;
        
        await signOut(auth);
        
        if (autoSyncInterval) {
            clearInterval(autoSyncInterval);
            autoSyncInterval = null;
        }
        
    } catch (error) {
        showAccountError('Logout failed');
    }
}

function showAccountError(message) {
    const errorDiv = document.getElementById('accountError');
    if (errorDiv) {
        if (message) {
            errorDiv.innerText = message;
            errorDiv.style.display = 'block';
        } else {
            errorDiv.style.display = 'none';
        }
    }
}

export async function syncToCloud() {
    if (!cloudSaveEnabled || !currentUser) {
        document.getElementById('accountModal').style.display='flex';
        return;
    }
    
    updateCloudSaveStatus('syncing', 'Syncing...');
    
    try {
        const db = window.firebaseDb;
        const doc = window.firebaseDoc;
        const setDoc = window.firebaseSetDoc;
        
        // Use Array for nodes serialization
        const gameCopy = { ...game, nodes: Array.from(game.nodes.entries()) };
        
        const saveData = {
            game: JSON.parse(JSON.stringify(gameCopy)),
            version: game.saveVersion,
            timestamp: Date.now(),
            device: navigator.userAgent
        };
        
        await setDoc(doc(db, 'saves', currentUser.uid), saveData);
        updateCloudSaveStatus('online', 'Saved to Cloud');
        
    } catch (error) {
        updateCloudSaveStatus('error', 'Sync Failed');
    }
}

export async function loadFromCloud() {
    if (!cloudSaveEnabled || !currentUser) {
        document.getElementById('accountModal').style.display='flex';
        return;
    }
    
    updateCloudSaveStatus('syncing', 'Loading...');
    
    try {
        const db = window.firebaseDb;
        const doc = window.firebaseDoc;
        const getDoc = window.firebaseGetDoc;
        
        const docSnap = await getDoc(doc(db, 'saves', currentUser.uid));
        
        if (docSnap.exists()) {
            const saveData = docSnap.data();
            if (saveData.game) {
                // Use centralized restore logic
                restoreGameState(saveData.game);
                
                // Trigger full UI refresh
                import('./ui.js').then(ui => {
                    ui.renderWorld();
                    ui.updateStatsUI();
                });
                
                updateCloudSaveStatus('online', 'Loaded from Cloud');
            }
        } else {
            updateCloudSaveStatus('online', 'No Cloud Save');
        }
    } catch (error) {
        updateCloudSaveStatus('error', 'Load Failed');
    }
}

let cloudStatusTimeout = null;
function updateCloudSaveStatus(status, text) {
    const statusEl = document.getElementById('cloudSaveStatus');
    const textEl = document.getElementById('cloudSaveText');
    
    if (statusEl && textEl) {
        statusEl.className = 'cloud-save-status ' + status;
        textEl.innerText = text;
        statusEl.style.opacity = '1';
        
        if (status === 'online' || status === 'error') {
            if (cloudStatusTimeout) clearTimeout(cloudStatusTimeout);
            cloudStatusTimeout = setTimeout(() => {
                statusEl.style.opacity = '0';
            }, 3000);
        }
    }
}
