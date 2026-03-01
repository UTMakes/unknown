// ==================== SAVE/LOAD & FIREBASE ACCOUNT SYSTEM ====================
function exportSave() {
    // Update save metadata before export
    game.lastSaveTime = Date.now();
    game.saveVersion = GAME_VERSION;
            
    // Create a clean copy of game state for export
            const saveData = {
                version: GAME_VERSION,
                timestamp: Date.now(),
                exportDate: new Date().toISOString(),
                game: JSON.parse(JSON.stringify(game)),
                checksum: generateSaveChecksum(game)
            };
            const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveData));
            const node = document.createElement('a');
            const playerName = game.playerName ? `_${game.playerName.replace(/[^a-z0-9]/gi, '_')}` : '';
            node.setAttribute("href", data); 
            node.setAttribute("download", `upload_labs${playerName}_save_v${GAME_VERSION}_${Date.now()}.json`);
            document.body.appendChild(node); node.click(); node.remove();
            logEvent('Game saved to file', 'good');
        }
        
        // Generate a salted checksum for save validation
        function generateSaveChecksum(gameData) {
            // Secret salt to prevent easy manual editing of exported saves
            const SECRET_SALT = "UlTrA_sEcReT_uPlOaD_lAbS_sAlT_14_1";
            const str = SECRET_SALT + JSON.stringify(gameData);
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return hash.toString(16);
        }
        
        // Validate save data integrity
        function validateSaveData(saveData) {
            const errors = [];
            
            if (!saveData.game) {
                errors.push('Missing game data');
                return { valid: false, errors };
            }
            
            const g = saveData.game;
            
            // Verify checksum if present (older saves might not have it)
            if (saveData.checksum) {
                const calculatedChecksum = generateSaveChecksum(g);
                if (saveData.checksum !== calculatedChecksum) {
                    errors.push('Save data corrupted or modified (Checksum Failed)');
                    // Critical failure, don't validate further
                    return { valid: false, isChecksumFailure: true, errors };
                }
            }
            
            // Check required fields
            if (typeof g.money !== 'number') errors.push('Invalid money value');
            if (typeof g.rp !== 'number') errors.push('Invalid RP value');
            if (!Array.isArray(g.nodes)) errors.push('Invalid nodes array');
            if (!Array.isArray(g.conns)) errors.push('Invalid connections array');
            
            // Check for NaN values (common corruption)
            if (isNaN(g.money)) errors.push('Money is NaN');
            if (isNaN(g.rp)) errors.push('RP is NaN');
            
            // Check nodes for corruption
            if (g.nodes) {
                g.nodes.forEach((node, i) => {
                    if (!node.id) errors.push(`Node ${i} missing ID`);
                    if (!node.type) errors.push(`Node ${i} missing type`);
                    if (isNaN(node.x) || isNaN(node.y)) errors.push(`Node ${i} has invalid position`);
                });
            }
            
            // Check connections for corruption
            if (g.conns) {
                g.conns.forEach((conn, i) => {
                    if (typeof conn.from !== 'number') errors.push(`Connection ${i} invalid from`);
                    if (typeof conn.to !== 'number') errors.push(`Connection ${i} invalid to`);
                });
            }
            
            return { valid: errors.length === 0, errors };
        }
        
        // Repair corrupted save data
        function repairSaveData(gameData) {
            const repaired = { ...gameData };
            
            // Fix subnet state
            if (repaired.currentSubnet === undefined) repaired.currentSubnet = null;
            
            // Fix NaN, Infinity, and negative values
            if (typeof repaired.money !== 'number' || !isFinite(repaired.money) || repaired.money < 0) repaired.money = 2000;
            if (typeof repaired.rp !== 'number' || !isFinite(repaired.rp) || repaired.rp < 0) repaired.rp = 0;
            if (typeof repaired.codeBits !== 'number' || !isFinite(repaired.codeBits) || repaired.codeBits < 0) repaired.codeBits = 0;
            if (typeof repaired.optimizationCode !== 'number' || !isFinite(repaired.optimizationCode) || repaired.optimizationCode < 0) repaired.optimizationCode = 0;
            if (typeof repaired.routerHeat !== 'number' || !isFinite(repaired.routerHeat)) repaired.routerHeat = 0;
            if (typeof repaired.overheatMode !== 'boolean') repaired.overheatMode = false;
            if (typeof repaired.overclockMult !== 'number' || !isFinite(repaired.overclockMult)) repaired.overclockMult = 1.0;
            if (typeof repaired.coolingPower !== 'number' || !isFinite(repaired.coolingPower)) repaired.coolingPower = 0;
            if (typeof repaired.overclockHeatGen !== 'number' || !isFinite(repaired.overclockHeatGen)) repaired.overclockHeatGen = 0;
            
            // Fix Resources
            if (!repaired.res || typeof repaired.res !== 'object') repaired.res = { files: 0, images: 0, videos: 0, audio: 0 };
            ['files', 'images', 'videos', 'audio'].forEach(k => {
                if (typeof repaired.res[k] !== 'number' || !isFinite(repaired.res[k]) || repaired.res[k] < 0) repaired.res[k] = 0;
            });
            
            // Fix arrays
            if (!Array.isArray(repaired.nodes)) repaired.nodes = [];
            if (!Array.isArray(repaired.conns)) repaired.conns = [];
            if (!Array.isArray(repaired.unlocked)) repaired.unlocked = [];
            if (!Array.isArray(repaired.achievements)) repaired.achievements = [];
            
            // Fix nodes
            repaired.nodes = repaired.nodes.filter(n => n && n.id && n.type);
            repaired.nodes.forEach(n => {
                if (typeof n.level !== 'number' || isNaN(n.level)) n.level = 1;
                if (n.subnetId === undefined) n.subnetId = null;
                if (typeof n.infected !== 'boolean') n.infected = false;
                if (n.firmware && (!FIRMWARE_DEFS || !FIRMWARE_DEFS[n.firmware])) delete n.firmware; // Validate firmware against DEFS, delete if invalid
                if (isNaN(n.x)) n.x = 2500;
                if (isNaN(n.y)) n.y = 2500;
                
                // Clean up derived/temporary state to prevent save bloat
                Object.keys(n).forEach(key => {
                    if (key.startsWith('_')) delete n[key];
                });
            });
            
            // Fix connections - remove any that reference non-existent nodes
            const nodeIds = new Set(repaired.nodes.map(n => n.id));
            repaired.conns = repaired.conns.filter(c => 
                c && nodeIds.has(c.from) && nodeIds.has(c.to)
            );
            
            // Fix stats
            if (!repaired.stats || typeof repaired.stats !== 'object') repaired.stats = {};
            const s = repaired.stats;
            if (typeof s.totalMoney !== 'number' || !isFinite(s.totalMoney)) s.totalMoney = repaired.money;
            if (typeof s.peakMoney !== 'number' || !isFinite(s.peakMoney)) s.peakMoney = repaired.money;
            if (typeof s.nodesCreated !== 'number' || !isFinite(s.nodesCreated)) s.nodesCreated = repaired.nodes.length;
            if (typeof s.cablesPlaced !== 'number' || !isFinite(s.cablesPlaced)) s.cablesPlaced = repaired.conns.length;
            if (typeof s.synergyBonus !== 'number' || !isFinite(s.synergyBonus)) s.synergyBonus = 0;
            if (typeof s.prestigeCount !== 'number' || !isFinite(s.prestigeCount)) s.prestigeCount = repaired.prestige || 0;
            // Ensure drivers has all keys to avoid NaN in multipliers (e.g. game.drivers.download)
            const defaultDrivers = { network: 0, compression: 0, security: 0, mining: 0, research: 0, upload: 0, download: 0 };
            if (!repaired.drivers || typeof repaired.drivers !== 'object') {
                repaired.drivers = { ...defaultDrivers };
            } else {
                for (const k of Object.keys(defaultDrivers)) {
                    if (typeof repaired.drivers[k] !== 'number' || isNaN(repaired.drivers[k])) {
                        repaired.drivers[k] = 0;
                    }
                }
            }
            
            // Settings defaults
            if (typeof repaired.ultraLowPerfEnabled !== 'boolean') repaired.ultraLowPerfEnabled = false;
            if (typeof repaired.particlesEnabled !== 'boolean') repaired.particlesEnabled = true;
            if (typeof repaired.animationsEnabled !== 'boolean') repaired.animationsEnabled = true;
            if (typeof repaired.eventAlertsEnabled !== 'boolean') repaired.eventAlertsEnabled = true;
            if (typeof repaired.autoSaveEnabled !== 'boolean') repaired.autoSaveEnabled = true;
            if (typeof repaired.offlineEarningsEnabled !== 'boolean') repaired.offlineEarningsEnabled = true;
            if (typeof repaired.notificationsEnabled !== 'boolean') repaired.notificationsEnabled = true;
            
            return repaired;
        }
        
        function importSave(input) {
            const file = input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    
                    // Handle both old format (direct game object) and new format (wrapped with metadata)
                    const importedGame = saveData.game || saveData;
                    
                    // Validate save data
                    const validation = validateSaveData(saveData);
                    if (!validation.valid) {
                        console.warn('Save validation warnings:', validation.errors);
                        
                        // Strict check: if it's a checksum failure, it was likely manually edited
                        if (validation.isChecksumFailure) {
                            alert('CRITICAL ERROR: Save file has been modified or corrupted.\nChecksum validation failed. This save cannot be loaded.');
                            return;
                        }
                        
                        if (!confirm('Save file appears to have issues:\n' + validation.errors.join('\n') + '\n\nAttempt to repair and load?')) {
                            return;
                        }
                    }
                    
                    // Repair corrupted data
                    const repairedGame = repairSaveData(importedGame);
                    
                    // Create a fresh game state and merge
                    game.money = Number(repairedGame.money) || 2000;
                    game.rp = Number(repairedGame.rp) || 0;
                    game.prestige = Number(repairedGame.prestige) || 0;
                    
                    // Migrate old prestige to singularity
                    game.singularity = repairedGame.singularity || { shards: 0, skills: {} };
                    if (game.prestige > 0 && typeof game.singularity.skills.quantum === 'undefined') {
                        game.singularity.skills.quantum = game.prestige;
                    }
                    
                    game.routerLevel = Number(repairedGame.routerLevel) || 1;
                    game.routerHeat = Number(repairedGame.routerHeat) || 0;
                    game.overheatMode = Boolean(repairedGame.overheatMode);
                    game.nextId = Number(repairedGame.nextId) || 1;
                    game.playerName = repairedGame.playerName || '';
                    game.saveCreated = repairedGame.saveCreated || Date.now();
                    
                    // Settings / Toggles
                    game.ultraLowPerfEnabled = repairedGame.ultraLowPerfEnabled !== false;
                    game.particlesEnabled = repairedGame.particlesEnabled !== false;
                    game.animationsEnabled = repairedGame.animationsEnabled !== false;
                    game.eventAlertsEnabled = repairedGame.eventAlertsEnabled !== false;
                    game.autoSaveEnabled = repairedGame.autoSaveEnabled !== false;
                    game.offlineEarningsEnabled = repairedGame.offlineEarningsEnabled !== false;
                    game.notificationsEnabled = repairedGame.notificationsEnabled !== false;
                    
                    // Apply display classes instantly
                    document.body.classList.toggle('ultra-low-perf', game.ultraLowPerfEnabled);
                    document.body.classList.toggle('reduce-motion', !game.animationsEnabled);
                    const particlesContainer = document.getElementById('particlesContainer');
                    if (particlesContainer) particlesContainer.style.display = game.particlesEnabled ? 'block' : 'none';
                    
                    // Resources - ensure all are numbers (use repaired game data)
                    game.res = {
                        files: Number(repairedGame.res?.files) || 0,
                        images: Number(repairedGame.res?.images) || 0,
                        videos: Number(repairedGame.res?.videos) || 0,
                        audio: Number(repairedGame.res?.audio) || 0
                    };
                    
                    // Arrays (use repaired game data)
                    game.nodes = repairedGame.nodes || [];
                    game.conns = repairedGame.conns || [];
                    game.unlocked = Array.isArray(repairedGame.unlocked) ? repairedGame.unlocked : [];
                    game.achievements = Array.isArray(repairedGame.achievements) ? repairedGame.achievements : [];
                    
                    // Code system
                    game.codeBits = Number(repairedGame.codeBits) || 0;
                    game.optimizationCode = Number(repairedGame.optimizationCode) || 0;
                    game.drivers = repairedGame.drivers || { network: 0, compression: 0, security: 0, mining: 0, research: 0, upload: 0, download: 0 };
                    
                    // Stats - preserve or create new (use repaired game data)
                    if (repairedGame.stats) {
                        game.stats = {
                            totalMoney: Number(repairedGame.stats.totalMoney) || game.money,
                            peakMoney: Number(repairedGame.stats.peakMoney) || game.money,
                            moneySpent: Number(repairedGame.stats.moneySpent) || 0,
                            totalRP: Number(repairedGame.stats.totalRP) || game.rp,
                            nodesCreated: Number(repairedGame.stats.nodesCreated) || game.nodes.length,
                            nodesDeleted: Number(repairedGame.stats.nodesDeleted) || 0,
                            cablesPlaced: Number(repairedGame.stats.cablesPlaced) || game.conns.length,
                            upgrades: Number(repairedGame.stats.upgrades) || 0,
                            contractsCompleted: Number(repairedGame.stats.contractsCompleted) || 0,
                            filesDownloaded: Number(repairedGame.stats.filesDownloaded) || 0,
                            virusesCleaned: Number(repairedGame.stats.virusesCleaned) || 0,
                            totalCodeBits: Number(repairedGame.stats.totalCodeBits) || 0,
                            totalDrivers: Number(repairedGame.stats.totalDrivers) || 0,
                            playTime: Number(repairedGame.stats.playTime) || 0,
                            techsUnlocked: Number(repairedGame.stats.techsUnlocked) || game.unlocked.length,
                            prestigeCount: Number(repairedGame.stats.prestigeCount) || game.prestige,
                            startTime: Date.now()
                        };
                    }
                    
                    // Ensure nodes have infected property
                    game.nodes.forEach(n => { 
                        if (typeof n.infected === 'undefined') n.infected = false;
                        if (typeof n.level === 'undefined') n.level = 1;
                    });
                    
                    // Reset active nodes and reinitialize
                    activeNodes.clear();
                    selectedNode = null;
                    
                    renderWorld(); renderResearchTree(); renderDriverGrid(); renderAchievements(); updateUI();
                    updateRouterCostDisplay();
                    
                    const version = saveData.version ? ` (v${saveData.version})` : '';
                    logEvent(`Game loaded successfully${version}`, 'good');
                    showFloat('âœ… Game Loaded!', window.innerWidth/2, window.innerHeight/2, '#10b981');
                    
                } catch(err) { 
                    console.error('Save import error:', err);
                    alert("Invalid Save File: " + err.message); 
                }
            };
            reader.onerror = () => alert("Error reading file");
            reader.readAsText(file);
        }

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
                        logEvent('Cloud save connected');
                        
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
                logEvent('Account created successfully!', 'good');
                showFloat('âœ… Account Created!', window.innerWidth/2, window.innerHeight/2, '#10b981');
                
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
                logEvent('Logged in successfully!', 'good');
                showFloat('Logged In!', window.innerWidth/2, window.innerHeight/2, '#10b981');
                
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
                
                logEvent('Logged out', 'info');
                showFloat('Logged Out', window.innerWidth/2, window.innerHeight/2, '#64748b');
                
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
                logEvent('Cloud save not available - please login first', 'bad');
                showFloat('âš ï¸ Please login first', window.innerWidth/2, window.innerHeight/2, '#f59e0b');
                document.getElementById('accountModal').style.display='flex';
                return;
            }
            if (!window.firebaseDb || !window.firebaseDoc || !window.firebaseSetDoc) {
                console.warn('Firebase not ready for sync');
                updateCloudSaveStatus('error', 'Cloud not ready');
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
                
                logEvent('Game saved to cloud', 'good');
                showFloat('â˜ï¸ Saved to Cloud', window.innerWidth/2, window.innerHeight/2, '#3b82f6');
            } catch (error) {
                console.error('Cloud save error:', error);
                updateCloudSaveStatus('error', 'Sync Failed');
                logEvent('Cloud save failed: ' + error.message, 'bad');
                showFloat('âŒ Save Failed', window.innerWidth/2, window.innerHeight/2, '#ef4444');
            }
        }

        // Load game from cloud
        async function loadFromCloud() {
            if (!cloudSaveEnabled || !currentUser) {
                logEvent('Cloud save not available - please login first', 'bad');
                showFloat('âš ï¸ Please login first', window.innerWidth/2, window.innerHeight/2, '#f59e0b');
                document.getElementById('accountModal').style.display='flex';
                return;
            }
            if (!window.firebaseDb || !window.firebaseDoc || !window.firebaseGetDoc) {
                console.warn('Firebase not ready for load');
                updateCloudSaveStatus('error', 'Cloud not ready');
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
                    
                    // Conflict Resolution Check
                    const cloudTimestamp = saveData.timestamp || 0;
                    const localTimestamp = game.lastSaveTime || 0;
                    
                    // If cloud save is newer by more than 2 minutes, prompt the user
                    if (cloudTimestamp > localTimestamp + 120000 && localTimestamp > 0) {
                        const timeDiffStr = Math.floor((cloudTimestamp - localTimestamp) / 60000) + ' minutes';
                        if (!confirm(`Conflict Detected!\n\nThe save file in the Cloud is ${timeDiffStr} newer than your current Local save.\n\nDo you want to overwrite your current progress with the Cloud Save?`)) {
                            updateCloudSaveStatus('online', 'Load Cancelled (Kept Local)');
                            return;
                        }
                    }
                    
                    // Restore game state using improved loading
                    if (saveData.game) {
                        const importedGame = saveData.game;
                        
                        // Validate and load
                        game.money = Number(importedGame.money) || 2000;
                        game.rp = Number(importedGame.rp) || 0;
                        game.prestige = Number(importedGame.prestige) || 0;
                        
                        game.singularity = importedGame.singularity || { shards: 0, skills: {} };
                        if (game.prestige > 0 && typeof game.singularity.skills.quantum === 'undefined') {
                            game.singularity.skills.quantum = game.prestige;
                        }
                        
                        game.routerLevel = Number(importedGame.routerLevel) || 1;
                        game.routerHeat = Number(importedGame.routerHeat) || 0;
                        game.overheatMode = Boolean(importedGame.overheatMode);
                        game.nextId = Number(importedGame.nextId) || 1;
                        
                        // Settings / Toggles
                        game.ultraLowPerfEnabled = importedGame.ultraLowPerfEnabled !== false;
                        game.particlesEnabled = importedGame.particlesEnabled !== false;
                        game.animationsEnabled = importedGame.animationsEnabled !== false;
                        game.eventAlertsEnabled = importedGame.eventAlertsEnabled !== false;
                        game.autoSaveEnabled = importedGame.autoSaveEnabled !== false;
                        game.offlineEarningsEnabled = importedGame.offlineEarningsEnabled !== false;
                        game.notificationsEnabled = importedGame.notificationsEnabled !== false;
                        
                        // Apply display classes instantly
                        document.body.classList.toggle('ultra-low-perf', game.ultraLowPerfEnabled);
                        document.body.classList.toggle('reduce-motion', !game.animationsEnabled);
                        const particlesContainer = document.getElementById('particlesContainer');
                        if (particlesContainer) particlesContainer.style.display = game.particlesEnabled ? 'block' : 'none';
                        
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
                                synergyBonus: Number(importedGame.stats.synergyBonus) || 0,
                                startTime: Date.now()
                            };
                        }
                        
                        game.nodes.forEach(n => { 
                            if (typeof n.infected === 'undefined') n.infected = false;
                            if (typeof n.level === 'undefined') n.level = 1;
                        });
                        
                        // Restore optional game state so the game is not broken after load
                        game.activeContract = importedGame.activeContract || null;
                        game.milestonesCompleted = Array.isArray(importedGame.milestonesCompleted) ? importedGame.milestonesCompleted : [];
                        game.lastLoginDate = importedGame.lastLoginDate || null;
                        game.loginStreak = Number(importedGame.loginStreak) || 0;
                        game.dailyRewardClaimed = Boolean(importedGame.dailyRewardClaimed);
                        game.playerName = importedGame.playerName || '';
                        game.saveCreated = importedGame.saveCreated || Date.now();
                        game.saveVersion = importedGame.saveVersion || GAME_VERSION;
                        game.playTime = Number(importedGame.playTime) || 0;
                        
                        // Rebuild active nodes from connectivity (critical: was missing, caused broken game)
                        activeNodes.clear();
                        updateConnectivity();
                        const router = game.nodes.find(n => n.type === 'router');
                        if (router && !activeNodes.has(router.id)) {
                            activeNodes.add(router.id);
                        }
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
                        showFloat('â˜ï¸ Loaded from Cloud', window.innerWidth/2, window.innerHeight/2, '#10b981');
                    }
                } else {
                    logEvent('No cloud save found');
                    updateCloudSaveStatus('online', 'No Cloud Save');
                }
            } catch (error) {
                console.error('Cloud load error:', error);
                updateCloudSaveStatus('error', 'Load Failed');
                logEvent('Cloud load failed: ' + error.message, 'bad');
                showFloat('âŒ Load Failed', window.innerWidth/2, window.innerHeight/2, '#ef4444');
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


// Auto-initialize Firebase
window.addEventListener('DOMContentLoaded', initFirebase);