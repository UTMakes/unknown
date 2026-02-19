// ==================== FIREBASE ACCOUNT SYSTEM ====================

let currentUser = null;
let cloudSaveEnabled = false;
let autoSyncInterval = null;

// Initialize Firebase Auth
async function initFirebase() {
    try {
        // Wait for Firebase to be ready
        if (!window.firebaseAuth) {
            console.log('Firebase not loaded yet, retrying...');
            setTimeout(initFirebase, 1000);
            return;
        }
        
        const auth = window.firebaseAuth;
        const onAuthStateChanged = window.firebaseOnAuthStateChanged;
        
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser = user;
                cloudSaveEnabled = true;
                updateCloudSaveStatus('online', 'Cloud Save Active');
                updateAccountUI(user);
                window.logEvent('Cloud save connected');
                
                // Try to load saved game
                loadFromCloud();
                
                // Set up auto-sync every 5 minutes
                if (autoSyncInterval) clearInterval(autoSyncInterval);
                autoSyncInterval = setInterval(() => {
                    if (cloudSaveEnabled && currentUser) syncToCloud();
                }, 300000); // 5 minutes
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
        // User is logged in
        if (loggedOutView) loggedOutView.style.display = 'none';
        if (loggedInView) loggedInView.style.display = 'block';
        
        if (panelText) panelText.innerText = 'Your progress is saved to the cloud!';
        if (btnText) btnText.innerText = 'Account';
        if (icon) icon.className = 'fa-solid fa-user-check';
        if (status) status.innerText = 'Logged in as ' + (user.displayName || user.email);
        
        // Update account modal info
        const displayNameEl = document.getElementById('accountDisplayName');
        const emailEl = document.getElementById('accountEmail');
        if (displayNameEl) displayNameEl.innerText = user.displayName || 'Player';
        if (emailEl) emailEl.innerText = user.email;
    } else {
        // User is logged out
        if (loggedOutView) loggedOutView.style.display = 'block';
        if (loggedInView) loggedInView.style.display = 'none';
        
        if (panelText) panelText.innerText = 'Login to save your progress to the cloud!';
        if (btnText) btnText.innerText = 'Login / Register';
        if (icon) icon.className = 'fa-solid fa-user';
        if (status) status.innerText = 'Not logged in';
    }
}

// Register new user
async function registerUser() {
    const displayName = document.getElementById('registerDisplayName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const errorDiv = document.getElementById('accountError');
    
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
        
        // Set display name
        await updateProfile(user, { displayName: displayName });
        
        // Save initial game data
        await syncToCloud();
        
        showAccountError('');
        window.logEvent('Account created successfully!', 'good');
        window.showFloat('✅ Account Created!', window.innerWidth/2, window.innerHeight/2, '#10b981');
        
    } catch (error) {
        console.error('Registration error:', error);
        let message = 'Registration failed';
        if (error.code === 'auth/email-already-in-use') message = 'Email already in use';
        if (error.code === 'auth/invalid-email') message = 'Invalid email address';
        if (error.code === 'auth/weak-password') message = 'Password is too weak';
        showAccountError(message);
    }
}

// Login existing user
async function loginUser() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('accountError');
    
    if (!email || !password) {
        showAccountError('Please enter email and password');
        return;
    }
    
    try {
        const auth = window.firebaseAuth;
        const signIn = window.firebaseSignIn;
        
        await signIn(auth, email, password);
        
        showAccountError('');
        window.logEvent('Logged in successfully!', 'good');
        window.showFloat('✅ Logged In!', window.innerWidth/2, window.innerHeight/2, '#10b981');
        
        // Load cloud save
        await loadFromCloud();
        
    } catch (error) {
        console.error('Login error:', error);
        let message = 'Login failed';
        if (error.code === 'auth/user-not-found') message = 'User not found';
        if (error.code === 'auth/wrong-password') message = 'Incorrect password';
        if (error.code === 'auth/invalid-email') message = 'Invalid email address';
        if (error.code === 'auth/invalid-credential') message = 'Invalid email or password';
        showAccountError(message);
    }
}

// Logout user
async function logoutUser() {
    try {
        const auth = window.firebaseAuth;
        const signOut = window.firebaseSignOut;
        
        await signOut(auth);
        
        // Clear auto-sync
        if (autoSyncInterval) {
            clearInterval(autoSyncInterval);
            autoSyncInterval = null;
        }
        
        window.logEvent('Logged out', 'info');
        window.showFloat('👋 Logged Out', window.innerWidth/2, window.innerHeight/2, '#64748b');
        
    } catch (error) {
        console.error('Logout error:', error);
        showAccountError('Logout failed');
    }
}

// Show account error
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

// Sync game to cloud
async function syncToCloud() {
    if (!cloudSaveEnabled || !currentUser) {
        window.logEvent('Cloud save not available - please login first', 'bad');
        window.showFloat('⚠️ Please login first', window.innerWidth/2, window.innerHeight/2, '#f59e0b');
        document.getElementById('accountModal').style.display='flex';
        return;
    }
    
    updateCloudSaveStatus('syncing', 'Syncing...');
    
    try {
        const db = window.firebaseDb;
        const doc = window.firebaseDoc;
        const setDoc = window.firebaseSetDoc;
        
        // Create a clean copy of game data
        const saveData = {
            game: JSON.parse(JSON.stringify(game)),
            version: GAME_VERSION,
            timestamp: Date.now(),
            device: navigator.userAgent
        };
        
        await setDoc(doc(db, 'saves', currentUser.uid), saveData);
        
        updateCloudSaveStatus('online', 'Saved to Cloud');
        
        // Update last sync time display if it exists
        const lastSyncEl = document.getElementById('lastSyncTime');
        if (lastSyncEl) lastSyncEl.innerText = 'Last sync: ' + new Date().toLocaleTimeString();
        
        window.logEvent('Game saved to cloud', 'good');
        window.showFloat('☁️ Saved to Cloud', window.innerWidth/2, window.innerHeight/2, '#3b82f6');
    } catch (error) {
        console.error('Cloud save error:', error);
        updateCloudSaveStatus('error', 'Sync Failed');
        window.logEvent('Cloud save failed: ' + error.message, 'bad');
        window.showFloat('❌ Save Failed', window.innerWidth/2, window.innerHeight/2, '#ef4444');
    }
}

// Load game from cloud
async function loadFromCloud() {
    if (!cloudSaveEnabled || !currentUser) {
        logEvent('Cloud save not available - please login first', 'bad');
        showFloat('⚠️ Please login first', window.innerWidth/2, window.innerHeight/2, '#f59e0b');
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
            
            // Version check (warning only)
            if (saveData.version && saveData.version !== GAME_VERSION) {
                logEvent(`Save version: ${saveData.version}`, 'info');
            }
            
            // Restore game state using improved loading
            if (saveData.game) {
                const importedGame = saveData.game;
                
                // Validate and load
                game.money = Number(importedGame.money) || 2000;
                game.rp = Number(importedGame.rp) || 0;
                game.prestige = Number(importedGame.prestige) || 0;
                game.routerLevel = Number(importedGame.routerLevel) || 1;
                game.routerHeat = Number(importedGame.routerHeat) || 0;
                game.overheatMode = Boolean(importedGame.overheatMode);
                game.nextId = Number(importedGame.nextId) || 1;
                
                game.res = {
                    files: Number(importedGame.res?.files) || 0,
                    images: Number(importedGame.res?.images) || 0,
                    videos: Number(importedGame.res?.videos) || 0,
                    audio: Number(importedGame.res?.audio) || 0
                };
                
                game.nodes = Array.isArray(importedGame.nodes) ? importedGame.nodes : [];
                game.conns = Array.isArray(importedGame.conns) ? importedGame.conns : [];
                game.unlocked = Array.isArray(importedGame.unlocked) ? importedGame.unlocked : [];
                game.achievements = Array.isArray(importedGame.achievements) ? importedGame.achievements : [];
                
                game.codeBits = Number(importedGame.codeBits) || 0;
                game.optimizationCode = Number(importedGame.optimizationCode) || 0;
                game.drivers = importedGame.drivers || { network: 0, compression: 0, security: 0, mining: 0, research: 0, upload: 0, download: 0 };
                
                if (importedGame.stats) {
                    game.stats = {
                        totalMoney: Number(importedGame.stats.totalMoney) || game.money,
                        peakMoney: Number(importedGame.stats.peakMoney) || game.money,
                        moneySpent: Number(importedGame.stats.moneySpent) || 0,
                        totalRP: Number(importedGame.stats.totalRP) || game.rp,
                        nodesCreated: Number(importedGame.stats.nodesCreated) || game.nodes.length,
                        nodesDeleted: Number(importedGame.stats.nodesDeleted) || 0,
                        cablesPlaced: Number(importedGame.stats.cablesPlaced) || game.conns.length,
                        upgrades: Number(importedGame.stats.upgrades) || 0,
                        contractsCompleted: Number(importedGame.stats.contractsCompleted) || 0,
                        filesDownloaded: Number(importedGame.stats.filesDownloaded) || 0,
                        virusesCleaned: Number(importedGame.stats.virusesCleaned) || 0,
                        totalCodeBits: Number(importedGame.stats.totalCodeBits) || 0,
                        totalDrivers: Number(importedGame.stats.totalDrivers) || 0,
                        playTime: Number(importedGame.stats.playTime) || 0,
                        techsUnlocked: Number(importedGame.stats.techsUnlocked) || game.unlocked.length,
                        prestigeCount: Number(importedGame.stats.prestigeCount) || game.prestige,
                        startTime: Date.now()
                    };
                }
                
                game.nodes.forEach(n => { 
                    if (typeof n.infected === 'undefined') n.infected = false;
                    if (typeof n.level === 'undefined') n.level = 1;
                });
                
                activeNodes.clear();
                selectedNode = null;
                
                renderWorld();
                renderResearchTree();
                renderDriverGrid();
                renderAchievements();
                updateUI();
                updateRouterCostDisplay();
                
                const saveDate = new Date(saveData.timestamp).toLocaleString();
                const lastSyncEl = document.getElementById('lastSyncTime');
                if (lastSyncEl) lastSyncEl.innerText = 'Loaded: ' + saveDate;
                updateCloudSaveStatus('online', 'Loaded from Cloud');
                logEvent('Game loaded from cloud', 'good');
                showFloat('☁️ Loaded from Cloud', window.innerWidth/2, window.innerHeight/2, '#10b981');
            }
        } else {
            window.logEvent('No cloud save found');
            updateCloudSaveStatus('online', 'No Cloud Save');
        }
    } catch (error) {
        console.error('Cloud load error:', error);
        updateCloudSaveStatus('error', 'Load Failed');
        window.logEvent('Cloud load failed: ' + error.message, 'bad');
        window.showFloat('❌ Load Failed', window.innerWidth/2, window.innerHeight/2, '#ef4444');
    }
}

// Update cloud save status UI
let cloudStatusTimeout = null;
function updateCloudSaveStatus(status, text) {
    const statusEl = document.getElementById('cloudSaveStatus');
    const textEl = document.getElementById('cloudSaveText');
    
    if (statusEl && textEl) {
        statusEl.className = 'cloud-save-status ' + status;
        textEl.innerText = text;
        statusEl.style.opacity = '1';
        
        // Auto-hide success messages after 3 seconds
        if (status === 'online' || status === 'error') {
            if (cloudStatusTimeout) clearTimeout(cloudStatusTimeout);
            cloudStatusTimeout = setTimeout(() => {
                statusEl.style.opacity = '0';
            }, 3000);
        }
    }
}

// Make account functions globally available
window.initFirebase = initFirebase;
window.updateAccountUI = updateAccountUI;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.showAccountError = showAccountError;
window.syncToCloud = syncToCloud;
window.loadFromCloud = loadFromCloud;
window.updateCloudSaveStatus = updateCloudSaveStatus;

// Initialize Firebase when page loads
document.addEventListener('DOMContentLoaded', initFirebase);
