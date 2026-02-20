        const GAME_VERSION = "12.0";

        // --- CONFIGURATION ---
        
        // DAILY REWARDS CONFIGURATION
        const DAILY_REWARDS = [
            { day: 1, money: 500, rp: 50, label: "Day 1: Starter Pack" },
            { day: 2, money: 750, rp: 75, label: "Day 2: Booster" },
            { day: 3, money: 1000, rp: 100, label: "Day 3: Data Bundle" },
            { day: 4, money: 1500, rp: 150, label: "Day 4: Server Upgrade" },
            { day: 5, money: 2000, rp: 200, label: "Day 5: Premium Access" },
            { day: 6, money: 3000, rp: 300, label: "Day 6: Elite Status" },
            { day: 7, money: 5000, rp: 500, codeBits: 500, label: "Day 7: Weekly Jackpot!" }
        ];
        
        // MILESTONES CONFIGURATION
        const MILESTONES = [
            { id: 'first_node', name: 'First Steps', desc: 'Place your first node', check: () => game.stats.nodesCreated >= 1, reward: { money: 100 } },
            { id: 'network_builder', name: 'Network Builder', desc: 'Have 10 nodes at once', check: () => game.nodes.length >= 10, reward: { money: 1000 } },
            { id: 'data_empire', name: 'Data Empire', desc: 'Have 50 nodes at once', check: () => game.nodes.length >= 50, reward: { money: 10000, rp: 500 } },
            { id: 'first_million', name: 'First Million', desc: 'Earn $1,000,000 total', check: () => game.stats.totalMoney >= 1000000, reward: { money: 100000 } },
            { id: 'researcher', name: 'Researcher', desc: 'Unlock 10 technologies', check: () => game.unlocked.length >= 10, reward: { rp: 1000 } },
            { id: 'connected', name: 'Fully Connected', desc: 'Have 25 cables at once', check: () => game.conns.length >= 25, reward: { money: 2500 } }
        ];
        
        const NODE_DEFS = {
            router: { name: "Network Router", type: "core", cost: 0, icon: "fa-solid fa-globe", color: "#3b82f6", desc: "Network Core. Required for connectivity." },
            
            // Infra - Early game utility
            miner: { name: "Crypto Miner", type: "infra", cost: 750, icon: "fa-brands fa-bitcoin", color: "#fbbf24", desc: "Uses bandwidth to mine money. Slow but steady income." },
            cache: { name: "Cache Server", type: "infra", cost: 3000, icon: "fa-solid fa-database", color: "#10b981", desc: "Buffers data. Connected downloaders work 50% faster." },
            firewall: { name: "Firewall", type: "infra", cost: 2000, icon: "fa-solid fa-shield-halved", color: "#ef4444", desc: "Prevents virus infection for self and neighbors.", req: "tech_sec" },
            balancer: { name: "Load Balancer", type: "infra", cost: 5500, icon: "fa-solid fa-scale-balanced", color: "#06b6d4", desc: "Distributes data evenly. Boosts connected nodes by 10% per connection.", req: "tech_balance" },
            overclock: { name: "Overclock Unit", type: "infra", cost: 8000, icon: "fa-solid fa-bolt", color: "#f59e0b", desc: "Connect to Router to DOUBLE speed. Generates significant heat!", req: "tech_oc" },
            cryo_cooler: { name: "Cryo Cooler", type: "infra", cost: 500000, icon: "fa-solid fa-snowflake", color: "#22d3ee", desc: "Advanced cooling system. Reduces router heat by 20/sec per level. End-game unlock.", req: "tech_cryo" },
            
            // Downloaders - Tiered progression
            dl_file: { name: "File Downloader", type: "download", out: "files", cost: 400, icon: "fa-solid fa-file-code", color: "#60a5fa", desc: "Downloads small files. Basic data collection." },
            dl_img: { name: "Image Downloader", type: "download", out: "images", cost: 2200, icon: "fa-solid fa-image", color: "#c084fc", desc: "Downloads images. Higher value than files.", req: "tech_img" },
            dl_audio: { name: "Audio Downloader", type: "download", out: "audio", cost: 7500, icon: "fa-solid fa-music", color: "#f472b6", desc: "Downloads audio files. Medium tier resource.", req: "tech_audio" },
            dl_vid: { name: "Video Downloader", type: "download", out: "videos", cost: 18000, icon: "fa-solid fa-film", color: "#f472b6", desc: "Downloads videos. Highest value resource.", req: "tech_vid" },
            
            // Upload & Labs - Money and RP generation
            uploader: { name: "Uploader", type: "upload", cost: 800, icon: "fa-solid fa-cloud-arrow-up", color: "#2dd4bf", desc: "Sells data for Money. Essential for income." },
            lab: { name: "Research Lab", type: "lab", cost: 4500, icon: "fa-solid fa-flask", color: "#8b5cf6", desc: "Converts Files into Research Points (RP)." },
            rack: { name: "Server Rack", type: "special", cost: 18000, icon: "fa-solid fa-server", color: "#f97316", desc: "High density server. Acts as both Downloader AND Uploader.", req: "tech_rack" },
            quantum: { name: "Quantum Core", type: "special", cost: 150000, icon: "fa-solid fa-atom", color: "#ef4444", desc: "Endgame technology. 2.5x Global Speed multiplier.", req: "tech_quantum" },
            
            // Advanced - Late game specialization
            proxy: { name: "Proxy Node", type: "advanced", cost: 3500, icon: "fa-solid fa-network-wired", color: "#64748b", desc: "Extends network range without degrading speed.", req: "tech_proxy" },
            compressor: { name: "Compressor", type: "advanced", cost: 8000, icon: "fa-solid fa-compress", color: "#14b8a6", desc: "Reduces file sizes by 35% for faster transfers.", req: "tech_compress" },
            backup: { name: "Backup Server", type: "advanced", cost: 12000, icon: "fa-solid fa-box-archive", color: "#a855f7", desc: "Stores excess data. Generates passive income from stored data.", req: "tech_backup" },
            analyzer: { name: "Data Analyzer", type: "advanced", cost: 15000, icon: "fa-solid fa-chart-pie", color: "#eab308", desc: "Analyzes data flow. Increases RP generation by 60%.", req: "tech_analyze" },
            streaming: { name: "Streaming Server", type: "advanced", cost: 25000, icon: "fa-solid fa-tower-broadcast", color: "#22d3ee", desc: "Specialized for media. 4x audio/video processing speed.", req: "tech_streaming" },
            cdn: { name: "CDN Node", type: "advanced", cost: 35000, icon: "fa-solid fa-earth-americas", color: "#3b82f6", desc: "Global content delivery. +30% boost to all uploaders.", req: "tech_cdn" },
            cluster: { name: "Cluster Node", type: "advanced", cost: 50000, icon: "fa-solid fa-network-wired", color: "#84cc16", desc: "Links with other clusters. +25% boost per cluster.", req: "tech_cluster" },
            warehouse: { name: "Data Warehouse", type: "advanced", cost: 75000, icon: "fa-solid fa-warehouse", color: "#e879f9", desc: "Massive storage. Greatly increases downloader efficiency.", req: "tech_warehouse" },
            ai_processor: { name: "AI Processor", type: "advanced", cost: 120000, icon: "fa-solid fa-brain", color: "#f97316", desc: "AI optimization. +125% efficiency to connected nodes.", req: "tech_ai" },
            crypto_farm: { name: "Crypto Farm", type: "advanced", cost: 200000, icon: "fa-brands fa-ethereum", color: "#627eea", desc: "Industrial-scale crypto mining. Massive passive income.", req: "tech_crypto_farm" },
            
            // CODING - Programming system
            coder: { name: "Coder Node", type: "coding", cost: 5000, icon: "fa-solid fa-terminal", color: "#00d4aa", desc: "Generates code bits for driver development." },
            dev_station: { name: "Dev Station", type: "coding", cost: 20000, icon: "fa-solid fa-laptop-code", color: "#00d4aa", desc: "2.5x code bit generation. Advanced driver development.", req: "dev_station" },
            compiler: { name: "Code Compiler", type: "coding", cost: 60000, icon: "fa-solid fa-gears", color: "#00d4aa", desc: "Automatically converts bits to optimization code.", req: "tech_compiler" }
        };

        const RESOURCES = {
            files: { size: 20, price: 4, rp: 2 },      // Reduced from 6
            images: { size: 80, price: 18, rp: 8 },    // Reduced from 28
            videos: { size: 350, price: 75, rp: 40 },  // Reduced from 120
            audio: { size: 120, price: 28, rp: 15 }    // Reduced from 42
        };

        // DRIVER CONFIGURATION
        const DRIVERS = {
            network: { name: "Network Driver", icon: "fa-solid fa-network-wired", desc: "+10% connection speed", cost: 1, effect: 0.1 },
            compression: { name: "Compression Driver", icon: "fa-solid fa-compress", desc: "+5% file compression", cost: 1, effect: 0.05 },
            security: { name: "Security Driver", icon: "fa-solid fa-shield-halved", desc: "-10% virus chance", cost: 1, effect: 0.1 },
            mining: { name: "Mining Driver", icon: "fa-solid fa-coins", desc: "+15% crypto mining", cost: 1, effect: 0.15 },
            research: { name: "Research Driver", icon: "fa-solid fa-flask", desc: "+10% RP generation", cost: 1, effect: 0.1 },
            upload: { name: "Upload Driver", icon: "fa-solid fa-cloud-arrow-up", desc: "+10% upload speed", cost: 1, effect: 0.1 },
            download: { name: "Download Driver", icon: "fa-solid fa-download", desc: "+10% download speed", cost: 1, effect: 0.1 }
        };

        const TECH_TREE = [
            // Tier 1: Basics (Early game)
            { id: "tech_img", name: "Image Compression", cost: 400, desc: "Unlock Image Downloaders", tier: 1, icon: "fa-solid fa-image", requires: [] },
            { id: "tech_sec", name: "Cyber Security", cost: 800, desc: "Unlock Firewall protection", tier: 1, icon: "fa-solid fa-shield-halved", requires: [] },
            { id: "tech_coding", name: "Basic Programming", cost: 1200, desc: "Unlock Coder Nodes", tier: 1, icon: "fa-solid fa-terminal", requires: [] },
            
            // Tier 2: Expansion (Mid-early game)
            { id: "tech_proxy", name: "Proxy Networking", cost: 2500, desc: "Unlock Proxy Nodes for range extension", tier: 2, icon: "fa-solid fa-network-wired", requires: ["tech_sec"] },
            { id: "tech_oc", name: "Overclocking", cost: 3500, desc: "Unlock Overclock Units (risk/reward)", tier: 2, icon: "fa-solid fa-bolt", requires: [] },
            { id: "tech_balance", name: "Load Balancing", cost: 4500, desc: "Unlock Load Balancers", tier: 2, icon: "fa-solid fa-scale-balanced", requires: ["tech_sec"] },
            
            // Tier 3: Specialization (Mid game)
            { id: "tech_vid", name: "Video Streaming", cost: 6000, desc: "Unlock Video Downloaders", tier: 3, icon: "fa-solid fa-film", requires: ["tech_img"] },
            { id: "tech_compress", name: "Data Compression", cost: 7500, desc: "Unlock Compressor nodes", tier: 3, icon: "fa-solid fa-compress", requires: ["tech_img"] },
            { id: "tech_audio", name: "Audio Processing", cost: 9000, desc: "Unlock Audio Downloaders", tier: 3, icon: "fa-solid fa-music", requires: ["tech_vid"] },
            { id: "tech_analyze", name: "Data Analysis", cost: 10000, desc: "Unlock Data Analyzers (+RP generation)", tier: 3, icon: "fa-solid fa-chart-pie", requires: ["tech_balance"] },
            { id: "tech_backup", name: "Backup Systems", cost: 12000, desc: "Unlock Backup Servers", tier: 3, icon: "fa-solid fa-box-archive", requires: ["tech_proxy"] },
            
            // Tier 4: Advanced Infrastructure (Late-mid game)
            { id: "tech_fiber", name: "Fiber Optics", cost: 15000, desc: "Global network speed +25%", tier: 4, icon: "fa-solid fa-bolt", requires: ["tech_oc"] },
            { id: "dev_station", name: "Dev Environment", cost: 18000, desc: "Unlock Dev Stations", tier: 4, icon: "fa-solid fa-laptop-code", requires: ["tech_coding"] },
            { id: "tech_rack", name: "Server Racks", cost: 25000, desc: "Unlock high-density Server Racks", tier: 4, icon: "fa-solid fa-server", requires: ["tech_fiber"] },
            { id: "tech_sat", name: "Satellite Uplink", cost: 30000, desc: "Global upload speed +50%", tier: 4, icon: "fa-solid fa-satellite", requires: ["tech_fiber"] },
            { id: "tech_streaming", name: "Media Streaming", cost: 35000, desc: "Unlock Streaming Servers", tier: 4, icon: "fa-solid fa-tower-broadcast", requires: ["tech_audio", "tech_analyze"] },
            
            // Tier 5: Enterprise (Late game)
            { id: "tech_cdn", name: "CDN Network", cost: 50000, desc: "Unlock CDN Nodes (global uploader boost)", tier: 5, icon: "fa-solid fa-earth-americas", requires: ["tech_rack", "tech_streaming"] },
            { id: "tech_cluster", name: "Cluster Computing", cost: 65000, desc: "Unlock Cluster Nodes (synergy bonuses)", tier: 5, icon: "fa-solid fa-network-wired", requires: ["tech_rack", "tech_backup"] },
            { id: "tech_compiler", name: "Auto-Compilation", cost: 80000, desc: "Unlock Code Compilers", tier: 5, icon: "fa-solid fa-gears", requires: ["dev_station"] },
            { id: "tech_warehouse", name: "Data Warehousing", cost: 100000, desc: "Unlock massive Data Warehouses", tier: 5, icon: "fa-solid fa-warehouse", requires: ["tech_backup", "tech_cdn"] },
            { id: "tech_ai", name: "AI Processing", cost: 150000, desc: "Unlock AI Processors", tier: 5, icon: "fa-solid fa-brain", requires: ["tech_analyze", "tech_cluster"] },
            
            // Tier 6: Endgame (Very late game)
            { id: "tech_quantum", name: "Quantum Computing", cost: 500000, desc: "Unlock Quantum Core (2.5x global speed)", tier: 6, icon: "fa-solid fa-atom", requires: ["tech_ai", "tech_cluster"] },
            { id: "tech_cryo", name: "Cryogenic Cooling", cost: 500000, desc: "Unlock Cryo Coolers to counteract overheating", tier: 6, icon: "fa-solid fa-snowflake", requires: ["tech_quantum"] },
            { id: "tech_crypto_farm", name: "Mining Farm", cost: 750000, desc: "Unlock Crypto Farms (massive passive income)", tier: 6, icon: "fa-brands fa-ethereum", requires: ["tech_cluster", "tech_warehouse"] },
            { id: "tech_neural", name: "Neural Network", cost: 1000000, desc: "All nodes +50% efficiency. The ultimate upgrade.", tier: 6, icon: "fa-solid fa-circle-nodes", requires: ["tech_ai", "tech_quantum"] },
            { id: "tech_automation", name: "Network Automation", cost: 2500000, desc: "Unlock Auto-Research - automatically buy tech you can afford", tier: 6, icon: "fa-solid fa-robot", requires: ["tech_neural", "tech_compiler"] },
        ];

        // ACHIEVEMENTS CONFIGURATION
        const ACHIEVEMENTS = [
            // Money Achievements
            { id: 'money_1', name: 'First Profits', desc: 'Earn $1,000 total', icon: 'fa-solid fa-coins', condition: (s) => s.totalMoney >= 1000, reward: 100 },
            { id: 'money_2', name: 'Entrepreneur', desc: 'Earn $10,000 total', icon: 'fa-solid fa-sack-dollar', condition: (s) => s.totalMoney >= 10000, reward: 500 },
            { id: 'money_3', name: 'Millionaire', desc: 'Earn $1,000,000 total', icon: 'fa-solid fa-vault', condition: (s) => s.totalMoney >= 1000000, reward: 5000 },
            { id: 'peak_1', name: 'Saving Up', desc: 'Have $5,000 at once', icon: 'fa-solid fa-piggy-bank', condition: (s) => s.peakMoney >= 5000, reward: 200 },
            { id: 'peak_2', name: 'Wealthy', desc: 'Have $100,000 at once', icon: 'fa-solid fa-crown', condition: (s) => s.peakMoney >= 100000, reward: 1000 },
            
            // Node Achievements
            { id: 'nodes_1', name: 'Network Starter', desc: 'Create 10 nodes', icon: 'fa-solid fa-network-wired', condition: (s) => s.nodesCreated >= 10, reward: 50 },
            { id: 'nodes_2', name: 'Network Engineer', desc: 'Create 50 nodes', icon: 'fa-solid fa-server', condition: (s) => s.nodesCreated >= 50, reward: 300 },
            { id: 'nodes_3', name: 'Data Center', desc: 'Create 100 nodes', icon: 'fa-solid fa-building', condition: (s) => s.nodesCreated >= 100, reward: 1000 },
            { id: 'nodes_4', name: 'Tech Giant', desc: 'Create 250 nodes', icon: 'fa-solid fa-city', condition: (s) => s.nodesCreated >= 250, reward: 5000 },
            
            // Research Achievements
            { id: 'research_1', name: 'Scientist', desc: 'Earn 1,000 RP total', icon: 'fa-solid fa-flask', condition: (s) => s.totalRP >= 1000, reward: 200 },
            { id: 'research_2', name: 'Research Lab', desc: 'Earn 10,000 RP total', icon: 'fa-solid fa-microscope', condition: (s) => s.totalRP >= 10000, reward: 1000 },
            { id: 'tech_1', name: 'Innovator', desc: 'Unlock 10 technologies', icon: 'fa-solid fa-lightbulb', condition: (s) => s.techsUnlocked >= 10, reward: 300 },
            { id: 'tech_2', name: 'Tech Master', desc: 'Unlock all technologies', icon: 'fa-solid fa-graduation-cap', condition: (s) => s.techsUnlocked >= TECH_TREE.length, reward: 2000 },
            
            // Coding Achievements
            { id: 'code_1', name: 'Hello World', desc: 'Generate 1,000 code bits', icon: 'fa-solid fa-terminal', condition: (s) => s.totalCodeBits >= 1000, reward: 150 },
            { id: 'code_2', name: 'Code Monkey', desc: 'Generate 100,000 code bits', icon: 'fa-solid fa-laptop-code', condition: (s) => s.totalCodeBits >= 100000, reward: 800 },
            { id: 'driver_1', name: 'Driver Update', desc: 'Install 5 drivers', icon: 'fa-solid fa-microchip', condition: (s) => s.totalDrivers >= 5, reward: 250 },
            { id: 'driver_2', name: 'Supercomputer', desc: 'Install 25 drivers', icon: 'fa-solid fa-computer', condition: (s) => s.totalDrivers >= 25, reward: 1500 },
            
            // Action Achievements
            { id: 'contracts_1', name: 'Contractor', desc: 'Complete 5 contracts', icon: 'fa-solid fa-file-contract', condition: (s) => s.contractsCompleted >= 5, reward: 200 },
            { id: 'contracts_2', name: 'Business Partner', desc: 'Complete 25 contracts', icon: 'fa-solid fa-handshake', condition: (s) => s.contractsCompleted >= 25, reward: 1000 },
            { id: 'upgrades_1', name: 'Upgrader', desc: 'Upgrade nodes 20 times', icon: 'fa-solid fa-arrow-up', condition: (s) => s.upgrades >= 20, reward: 150 },
            { id: 'cables_1', name: 'Cable Manager', desc: 'Place 50 cables', icon: 'fa-solid fa-plug', condition: (s) => s.cablesPlaced >= 50, reward: 100 },
            
            // Special Achievements
            { id: 'prestige_1', name: 'Fresh Start', desc: 'Migrate your data center once', icon: 'fa-solid fa-rotate', condition: (s) => s.prestigeCount >= 1, reward: 500 },
            { id: 'prestige_2', name: 'Serial Entrepreneur', desc: 'Migrate 5 times', icon: 'fa-solid fa-rotate-right', condition: (s) => s.prestigeCount >= 5, reward: 3000 },
            { id: 'security_1', name: 'Virus Hunter', desc: 'Clean 10 viruses', icon: 'fa-solid fa-shield-virus', condition: (s) => s.virusesCleaned >= 10, reward: 200 },
            { id: 'time_1', name: 'Dedicated', desc: 'Play for 1 hour', icon: 'fa-solid fa-clock', condition: (s) => s.playTime >= 3600, reward: 500 },
            { id: 'time_2', name: 'Addicted', desc: 'Play for 10 hours', icon: 'fa-solid fa-hourglass-half', condition: (s) => s.playTime >= 36000, reward: 3000 },
            
            // Synergy Achievements (New in v11)
            { id: 'synergy_1', name: 'Synergy Starter', desc: 'Activate your first node synergy', icon: 'fa-solid fa-link', condition: (s) => s.synergyBonus >= 15, reward: 300 },
            { id: 'synergy_2', name: 'Synergy Master', desc: 'Activate 3+ synergies at once', icon: 'fa-solid fa-project-diagram', condition: (s) => s.synergyBonus >= 50, reward: 1000 },
            { id: 'synergy_3', name: 'Full Stack', desc: 'Activate all 5 synergy bonuses', icon: 'fa-solid fa-layer-group', condition: (s) => s.synergyBonus >= 100, reward: 2500 },
        ];

        // RANDOM EVENTS CONFIGURATION
        const RANDOM_EVENTS = [
            // Good Events
            { id: 'market_boom', name: 'Market Boom', desc: 'Data prices are surging!', type: 'good', duration: 60, effect: () => { eventMultipliers.money = 2; }, cleanup: () => { eventMultipliers.money = 1; } },
            { id: 'research_grant', name: 'Research Grant', desc: 'Government funding boost!', type: 'good', duration: 45, effect: () => { eventMultipliers.rp = 2; }, cleanup: () => { eventMultipliers.rp = 1; } },
            { id: 'code_rush', name: 'Code Rush', desc: 'Developers are inspired!', type: 'good', duration: 30, effect: () => { eventMultipliers.code = 3; }, cleanup: () => { eventMultipliers.code = 1; } },
            { id: 'fiber_upgrade', name: 'Fiber Upgrade', desc: 'ISP upgraded your connection!', type: 'good', duration: 120, effect: () => { eventMultipliers.speed = 1.5; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'investment', name: 'Angel Investment', desc: 'An investor believes in you!', type: 'good', instant: true, effect: (g) => { g.money += 5000; showFloat('+ $5,000 (Investment)', window.innerWidth/2, window.innerHeight/2, '#10b981'); } },
            { id: 'bonus_rp', name: 'Research Breakthrough', desc: 'Sudden insight!', type: 'good', instant: true, effect: (g) => { g.rp += 500; showFloat('+ 500 RP (Breakthrough!)', window.innerWidth/2, window.innerHeight/2, '#8b5cf6'); } },
            
            // Bad Events
            { id: 'market_crash', name: 'Market Crash', desc: 'Data prices are plummeting!', type: 'bad', duration: 60, effect: () => { eventMultipliers.money = 0.5; }, cleanup: () => { eventMultipliers.money = 1; } },
            { id: 'power_outage', name: 'Power Outage', desc: 'Reduced efficiency!', type: 'bad', duration: 30, effect: () => { eventMultipliers.speed = 0.5; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'ddos_attack', name: 'DDoS Attack', desc: 'Network under attack!', type: 'bad', duration: 45, effect: () => { eventMultipliers.speed = 0.3; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'maintenance', name: 'Emergency Maintenance', desc: 'Servers need repairs!', type: 'bad', instant: true, effect: (g) => { g.money = Math.max(0, g.money - 2000); showFloat('- $2,000 (Maintenance)', window.innerWidth/2, window.innerHeight/2, '#ef4444'); } },
            { id: 'data_breach', name: 'Data Breach', desc: 'Security incident!', type: 'bad', instant: true, effect: (g) => { g.rp = Math.max(0, g.rp - 200); showFloat('- 200 RP (Breach)', window.innerWidth/2, window.innerHeight/2, '#ef4444'); } },
        ];

        // --- STATE ---
        let game = {
            money: 1500,  // Reduced from 2000
            rp: 0,
            prestige: 0, 
            res: { files: 0, images: 0, videos: 0, audio: 0 },
            nodes: [],
            conns: [],
            routerLevel: 1,
            routerHeat: 0,
            overheatMode: false,
            overclockMult: 1.0,
            coolingPower: 0,
            overclockHeatGen: 0,
            unlocked: [],
            nextId: 1,
            activeContract: null,
            
            // CODE SYSTEM
            codeBits: 0,
            optimizationCode: 0,
            drivers: {
                network: 0,
                compression: 0,
                security: 0,
                mining: 0,
                research: 0,
                upload: 0,
                download: 0
            },
            
            // STATISTICS
            stats: {
                totalMoney: 0,
                peakMoney: 2000,
                moneySpent: 0,
                totalRP: 0,
                nodesCreated: 0,
                nodesDeleted: 0,
                cablesPlaced: 0,
                upgrades: 0,
                contractsCompleted: 0,
                filesDownloaded: 0,
                virusesCleaned: 0,
                totalCodeBits: 0,
                totalDrivers: 0,
                playTime: 0,
                techsUnlocked: 0,
                prestigeCount: 0,
                synergyBonus: 0, // Track max synergy bonus achieved
                startTime: Date.now()
            },
            
            // ACHIEVEMENTS
            achievements: [],
            achievementRewardsClaimed: 0,
            
            // EVENTS
            activeEvent: null,
            eventTimeLeft: 0,
            
            // DAILY REWARDS
            lastLoginDate: null,
            loginStreak: 0,
            dailyRewardClaimed: false,
            
            // MILESTONES
            milestonesCompleted: [],
            
            // SETTINGS
            autoSaveEnabled: true,
            notificationsEnabled: true,
            offlineEarningsEnabled: true,
            lastSaveTime: Date.now(),
            
            // PLAYER INFO
            playerName: '',
            playerId: '',
            saveCreated: Date.now(),
            saveVersion: GAME_VERSION,
            
            // PLAYTIME
            playTime: 0,  // Total seconds played
            lastPlayTimeUpdate: Date.now()
        };

        // Offline earnings tracking
        let offlineEarnings = { money: 0, rp: 0, timeAway: 0 };

        // Event multipliers
        let eventMultipliers = { money: 1, rp: 1, code: 1, speed: 1 };

        let view = { x: window.innerWidth/2 - 2500, y: window.innerHeight/2 - 2500, scale: 1 };
        let activeNodes = new Set();
        let history = { money: 0, rp: 0 };
        // Rate tracking - actual per-second rates
        let rateTracking = {
            money: { current: 0, smoothed: 0, history: [] },
            rp: { current: 0, smoothed: 0, history: [] }
        };
        const RATE_SMOOTHING_WINDOW = 5; // Average over 5 seconds
        let activeContract = null; 
        
        // --- ZOOM FUNCTIONS ---
        function updateZoomDisplay() {
            document.getElementById('zoomLevel').innerText = Math.round(view.scale * 100) + '%';
        }
        
        function zoomIn() {
            view.scale = Math.min(2, view.scale * 1.2);
            updateWorldTransform();
            updateZoomDisplay();
        }
        
        function zoomOut() {
            view.scale = Math.max(0.3, view.scale / 1.2);
            updateWorldTransform();
            updateZoomDisplay();
        }
        
        function resetZoom() {
            view.scale = 1;
            updateWorldTransform();
            updateZoomDisplay();
        }
        
        function updateWorldTransform() {
            const world = document.getElementById('world');
            world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
        }

        // Toggle setting
        function toggleSetting(setting, value) {
            if (game.hasOwnProperty(setting)) {
                game[setting] = value;
                const settingNames = {
                    'autoSaveEnabled': 'Auto-Save',
                    'offlineEarningsEnabled': 'Offline Earnings',
                    'notificationsEnabled': 'Notifications'
                };
                logEvent(`${settingNames[setting] || setting} ${value ? 'enabled' : 'disabled'}`, 'info');
                autoSaveLocal();
            }
        }
        
        // Clear save and reset game
        function clearSaveAndReset() {
            if (!confirm('WARNING: This will DELETE your save and reset the game. Are you sure?')) return;
            localStorage.removeItem('uploadLabsSave');
            location.reload();
        }
        
        // Show game state info
        function showGameInfo() {
            console.log('=== Game State Info ===');
            console.log('Money:', game.money, 'RP:', game.rp, 'Code Bits:', game.codeBits);
            console.log('Nodes:', game.nodes.length, 'Active:', activeNodes.size);
            console.log('Connections:', game.conns.length);
            console.log('Router Level:', game.routerLevel);
            console.log('Active Event:', game.activeEvent);
            console.log('=======================');
            return { game, activeNodes: [...activeNodes] };
        }
        
        // Debug function for money issues
        function debugMoney() {
            console.log('%c Money Debug Info ', 'background: #f59e0b; color: white; font-size: 14px; font-weight: bold; padding: 5px 10px; border-radius: 4px;');
            console.log({
                money: game.money,
                moneyIsFinite: isFinite(game.money),
                historyMoney: history.money,
                historyIsFinite: isFinite(history.money),
                rateTrackingSmoothed: rateTracking.money.smoothed,
                rateTrackingCurrent: rateTracking.money.current,
                rateHistoryLength: rateTracking.money.history.length,
                rateHistorySample: rateTracking.money.history.slice(-3),
                activeNodes: game.nodes.filter(n => activeNodes.has(n.id) && !n.infected).length,
                totalNodes: game.nodes.length,
                infectedNodes: game.nodes.filter(n => n.infected).length
            });
            return 'Money debug info printed to console';
        }
        
        window.Game = { 
            zoomIn, zoomOut, resetZoom, 
            emergencyRecover, repairSaveData, validateSaveData,
            clearSaveAndReset, showGameInfo, toggleSetting,
            batchUpgrade, toggleAutoBalancer, showNetworkAnalysis,
            installDriver, handleDriverClick, openModal, closeModal, closeAllModals,
            clearDriverGridCache, debugMoney
        };
        
        // Log help message for debugging
        console.log('%c Upload Labs: Network Empire ', 'background: linear-gradient(135deg: #3b82f6, #8b5cf6); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
        console.log('%c Debug Commands: ', 'color: #3b82f6; font-weight: bold; font-size: 14px;');
        console.log('  Game.emergencyRecover() - Fix stuck game state');
        console.log('  Game.showGameInfo() - Show current game state');
        console.log('  Game.clearSaveAndReset() - Clear save and restart');
        console.log('  Game.repairSaveData(game) - Repair corrupted save data');
        console.log('  Game.validateSaveData({game}) - Validate save integrity');
        console.log('  Game.batchUpgrade("type") - Upgrade all nodes of type');
        console.log('  Game.toggleAutoBalancer() - Toggle auto-balancer');
        console.log('  Game.showNetworkAnalysis() - Analyze network efficiency');
        console.log('  Game.debugMoney() - Debug money generation issues');
        
        // --- CORE FUNCTIONS ---

        function init() {
            if (game.nodes.length === 0) spawnNode('router', 2500, 2500);
            updateConnectivity();
            renderWorld();
            updateUI();
            logEvent("System initialized.");
            updateRouterCostDisplay();
            
            requestAnimationFrame(gameLoop);
            setInterval(secLoop, 1000);
            setInterval(virusLoop, 120000);
            setInterval(eventLoop, 600000); // Check for events every 10 minutes
            
            setupInputs();
            updateZoomDisplay();
            renderDriverGrid();
            renderAchievements();
            
            document.addEventListener('contextmenu', (e) => {
                if (e.target.closest('.game-container') || e.target.closest('.modal') || e.target.closest('.welcome-container')) {
                    e.preventDefault();
                }
            });
            
            // Initialize background particles
            initParticles();
        }
        
        // Initialize floating particles (reduced count for performance)
        function initParticles() {
            const container = document.getElementById('particlesContainer');
            if (!container) return;
            
            // Limit particles for better performance
            const particleCount = window.matchMedia('(pointer: coarse)').matches ? 8 : 15;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (12 + Math.random() * 8) + 's';
                
                // Random colors based on theme
                const colors = [
                    'rgba(59, 130, 246, 0.35)',
                    'rgba(139, 92, 246, 0.35)',
                    'rgba(0, 212, 170, 0.35)'
                ];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.width = (1.5 + Math.random()) + 'px';
                particle.style.height = particle.style.width;
                
                container.appendChild(particle);
            }
        }

        function logEvent(msg, type = 'info') {
            const log = document.getElementById('eventLog');
            const entry = document.createElement('div');
            entry.className = `log-entry ${type}`;
            entry.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
            log.prepend(entry);
            if (log.children.length > 5) log.lastChild.remove();
        }

        // ==================== ACHIEVEMENTS SYSTEM ====================
        function checkAchievements() {
            ACHIEVEMENTS.forEach(ach => {
                if (game.achievements.includes(ach.id)) return;
                if (ach.condition(game.stats)) {
                    unlockAchievement(ach);
                }
            });
        }

        function unlockAchievement(ach) {
            game.achievements.push(ach.id);
            game.money += ach.reward;
            showFloat(`+ $${ach.reward} (Achievement!)`, window.innerWidth/2, window.innerHeight/2, '#fbbf24');
            
            const popup = document.getElementById('achievementPopup');
            document.getElementById('achievementText').innerText = `${ach.name}: ${ach.desc}`;
            popup.classList.add('show');
            
            setTimeout(() => popup.classList.remove('show'), 4000);
            logEvent(`Achievement: ${ach.name}!`, 'good');
            renderAchievements();
        }

        function renderAchievements() {
            const list = document.getElementById('achievementsList');
            const unlocked = game.achievements.length;
            document.getElementById('achievementCount').innerText = unlocked;
            document.getElementById('achievementTotal').innerText = ACHIEVEMENTS.length;
            
            list.innerHTML = ACHIEVEMENTS.map(ach => {
                const isUnlocked = game.achievements.includes(ach.id);
                return `
                    <div class="help-item" style="opacity: ${isUnlocked ? 1 : 0.5}; margin-bottom: 8px;">
                        <div class="help-item-title" style="color: ${isUnlocked ? '#fbbf24' : 'var(--text-muted)'};">
                            <i class="${ach.icon}"></i> ${ach.name} ${isUnlocked ? '<i class="fa-solid fa-check" style="color:#10b981;"></i>' : '<i class="fa-solid fa-lock"></i>'}
                        </div>
                        <div class="help-item-desc">${ach.desc} | Reward: $${ach.reward}</div>
                    </div>
                `;
            }).join('');
        }

        // ==================== RANDOM EVENTS SYSTEM ====================
        function triggerRandomEvent() {
            if (game.activeEvent) return;
            if (Math.random() > 0.30) return; // 30% chance when checked (every 10 minutes)
            
            const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
            
            if (event.instant) {
                event.effect(game);
                showEventNotification(event);
                logEvent(`Event: ${event.name}`, event.type === 'good' ? 'good' : 'bad');
            } else {
                game.activeEvent = event;
                game.eventTimeLeft = event.duration;
                event.effect();
                showEventNotification(event);
                logEvent(`Event started: ${event.name} (${event.duration}s)`, event.type === 'good' ? 'good' : 'bad');
            }
        }

        function showEventNotification(event) {
            const notif = document.getElementById('eventNotification');
            document.getElementById('eventTitle').innerText = event.name;
            document.getElementById('eventDesc').innerText = event.desc;
            document.getElementById('eventEffect').innerText = event.instant ? 'Instant effect applied!' : `Duration: ${event.duration} seconds`;
            
            notif.style.display = 'block';
            notif.className = `event-notification ${event.type} show`;
            setTimeout(() => {
                notif.classList.remove('show');
                setTimeout(() => notif.style.display = 'none', 500);
            }, event.instant ? 4000 : 6000);
        }

        function updateEvents(dt) {
            if (game.activeEvent) {
                game.eventTimeLeft -= dt;
                if (game.eventTimeLeft <= 0) {
                    game.activeEvent.cleanup();
                    logEvent(`Event ended: ${game.activeEvent.name}`);
                    game.activeEvent = null;
                }
            }
        }

        // ==================== STATISTICS SYSTEM ====================
        function updateStatistics() {
            // Peak money tracking
            if (game.money > game.stats.peakMoney) {
                game.stats.peakMoney = game.money;
            }
            
            // Play time
            game.stats.playTime = Math.floor((Date.now() - game.stats.startTime) / 1000);
            
            // Tech count
            game.stats.techsUnlocked = game.unlocked.length;
            
            // Total drivers
            game.stats.totalDrivers = Object.values(game.drivers).reduce((a, b) => a + b, 0);
            
            // Check achievements
            checkAchievements();
        }

        function renderStatistics() {
            document.getElementById('statTotalMoney').innerText = '$' + fmt(game.stats.totalMoney);
            document.getElementById('statPeakMoney').innerText = '$' + fmt(game.stats.peakMoney);
            document.getElementById('statMoneySpent').innerText = '$' + fmt(game.stats.moneySpent);
            document.getElementById('statContracts').innerText = game.stats.contractsCompleted;
            document.getElementById('statNodesCreated').innerText = game.stats.nodesCreated;
            document.getElementById('statNodesDeleted').innerText = game.stats.nodesDeleted;
            document.getElementById('statCablesPlaced').innerText = game.stats.cablesPlaced;
            document.getElementById('statUpgrades').innerText = game.stats.upgrades;
            document.getElementById('statFilesDownloaded').innerText = fmt(Math.floor(game.stats.filesDownloaded));
            document.getElementById('statTotalRP').innerText = fmt(Math.floor(game.stats.totalRP)) + ' RP';
            document.getElementById('statViruses').innerText = game.stats.virusesCleaned;
            
            const hours = Math.floor(game.stats.playTime / 3600);
            const mins = Math.floor((game.stats.playTime % 3600) / 60);
            document.getElementById('statPlayTime').innerText = `${hours}h ${mins}m`;

            // Network health (from analyzeNetwork)
            const analysis = analyzeNetwork();
            const effEl = document.getElementById('statNetworkEfficiency');
            const issuesEl = document.getElementById('statNetworkIssues');
            if (effEl) effEl.innerText = analysis.efficiency + '%';
            if (issuesEl) {
                if (analysis.issues.length > 0) {
                    issuesEl.innerHTML = '<strong>Issues:</strong> ' + analysis.issues.join(' ') + (analysis.suggestions.length > 0 ? '<br><strong>Suggestions:</strong> ' + analysis.suggestions.join(' ') : '');
                } else {
                    issuesEl.innerText = 'No issues detected.';
                }
            }
        }

        // ==================== PRESTIGE SYSTEM ====================
        function updatePrestigeUI() {
            const currentBonus = game.prestige * 50;
            const nextBonus = (game.prestige + 1) * 50;
            document.getElementById('currentPrestigeBonus').innerText = `+${currentBonus}%`;
            document.getElementById('nextPrestigeBonus').innerText = `+${nextBonus}%`;
            
            const nodeCount = game.nodes.length;
            const moneyReq = 50000;
            const canPrestige = nodeCount >= 20 && game.money >= moneyReq;
            
            const reqText = document.getElementById('prestigeRequirements');
            reqText.innerHTML = `
                <span style="color: ${nodeCount >= 20 ? '#10b981' : '#ef4444'}">${nodeCount}/20 nodes</span> | 
                <span style="color: ${game.money >= moneyReq ? '#10b981' : '#ef4444'}">$${fmt(game.money)}/$50,000</span>
            `;
            
            const btn = document.getElementById('prestigeBtn');
            btn.disabled = !canPrestige;
            btn.style.opacity = canPrestige ? 1 : 0.5;
        }

        function performPrestige() {
            if (game.nodes.length < 20 || game.money < 50000) return;
            
            game.prestige++;
            game.stats.prestigeCount++;
            
            // Reset game state
            game.money = 5000; // Starting bonus
            game.rp = 0;
            game.res = { files: 0, images: 0, videos: 0, audio: 0 };
            game.nodes = [];
            game.conns = [];
            game.routerLevel = 1;
            game.routerHeat = 0;
            game.overheatMode = false;
            game.activeContract = null;
            game.codeBits = 0;
            game.optimizationCode = 0;
            
            // Reset stats that should be reset
            game.stats.nodesCreated = 0;
            game.stats.nodesDeleted = 0;
            game.stats.cablesPlaced = 0;
            game.stats.upgrades = 0;
            game.stats.filesDownloaded = 0;
            game.stats.virusesCleaned = 0;
            game.stats.contractsCompleted = 0;
            
            activeNodes.clear();
            selectedNode = null;
            
            // Spawn new router
            spawnNode('router', 2500, 2500);
            renderWorld();
            
            document.getElementById('prestigeModal').style.display = 'none';
            logEvent(`Data Center Migrated! +50% speed bonus (Total: +${game.prestige * 50}%)`, 'good');
            showFloat(`MIGRATED! +50% Speed`, window.innerWidth/2, window.innerHeight/2, '#a855f7');
            
            checkAchievements();
        }

        // ==================== COMBO SYSTEM ====================
        let combo = { count: 0, timer: 0, lastAction: 0 };
        
        function addCombo() {
            const now = Date.now();
            if (now - combo.lastAction < 3000) {
                combo.count++;
                combo.timer = 3;
                if (combo.count >= 3) {
                    showComboIndicator();
                    const bonus = Math.min(combo.count * 0.1, 1); // Max 100% bonus
                    // Apply combo bonus temporarily
                }
            } else {
                combo.count = 1;
                combo.timer = 3;
            }
            combo.lastAction = now;
        }

        function showComboIndicator() {
            const indicator = document.getElementById('comboIndicator');
            indicator.innerText = `COMBO x${combo.count}!`;
            indicator.classList.add('show');
            setTimeout(() => indicator.classList.remove('show'), 2000);
        }

        function updateCombo(dt) {
            if (combo.timer > 0) {
                combo.timer -= dt;
                if (combo.timer <= 0) {
                    combo.count = 0;
                }
            }
        }

        // ==================== PARTICLE EFFECTS ====================
        function spawnParticles(x, y, color, count = 5) {
            const world = document.getElementById('world');
            for (let i = 0; i < count; i++) {
                const p = document.createElement('div');
                p.className = 'particle';
                p.style.cssText = `
                    left: ${x}px;
                    top: ${y}px;
                    width: ${4 + Math.random() * 6}px;
                    height: ${4 + Math.random() * 6}px;
                    background: ${color};
                    --tx: ${(Math.random() - 0.5) * 100}px;
                    --ty: ${(Math.random() - 0.5) * 100}px;
                `;
                world.appendChild(p);
                setTimeout(() => p.remove(), 1000);
            }
        }

        let frameCount = 0;
        let lastConnectivityUpdate = 0;
        let lastUIUpdate = 0;
        function gameLoop(time) {
            const dt = 1/60; 
            frameCount++;
            
            // Reset frame counters periodically to prevent overflow
            if (frameCount > 1000000) {
                frameCount = 0;
                lastConnectivityUpdate = 0;
                lastUIUpdate = 0;
            }
            
            // Safety check - ensure game loop continues even with large numbers
            if (!game || typeof game.money !== 'number') {
                console.error('Game state corrupted, attempting recovery...');
                emergencyRecover();
                return;
            }
            
            // Throttle connectivity updates to every 15 frames for performance
            if (frameCount - lastConnectivityUpdate >= 15) {
                try {
                    updateConnectivity();
                    lastConnectivityUpdate = frameCount;
                } catch (e) {
                    console.error('Connectivity update failed:', e);
                }
            }
            
            // Heat management with Overclock and Cooling
            let overclockMult = 1.0;
            let coolingPower = 0;
            let overclockHeatGen = 0;
            
            try {
                const router = game.nodes.find(n => n.type === 'router');
                if (router && activeNodes.has(router.id)) {
                    // Find all overclockers connected to router
                    game.conns.forEach(c => {
                        if (c.to === router.id) {
                            const source = game.nodes.find(n => n.id === c.from);
                            if (source && activeNodes.has(source.id) && !source.infected) {
                                if (source.type === 'overclock') {
                                    // Each overclocker level adds 0.5x multiplier (Lv1=2x, Lv2=2.5x, Lv3=3x)
                                    overclockMult += 0.5 * source.level;
                                    // Heat generation: 15 base + 5 per level
                                    overclockHeatGen += 15 + (5 * (source.level - 1));
                                }
                            }
                        }
                    });
                    
                    // Find all cooling nodes (connected anywhere in network)
                    game.nodes.forEach(n => {
                        if (n.type === 'cryo_cooler' && activeNodes.has(n.id) && !n.infected) {
                            // Each cryo cooler level reduces heat by 20 base + 10 per level
                            coolingPower += 20 + (10 * (n.level - 1));
                        }
                    });

                    // Calculate net heat change
                    const netHeatChange = overclockHeatGen - coolingPower;
                    
                    if (netHeatChange > 0) {
                        game.routerHeat = Math.min(100, game.routerHeat + (netHeatChange * dt));
                    } else {
                        // Cooling can reduce heat faster than normal (up to -10 per second per cooler)
                        game.routerHeat = Math.max(0, game.routerHeat + (netHeatChange * dt));
                    }
                    
                    // Natural cooling when no overclockers active
                    if (overclockHeatGen === 0) {
                        game.routerHeat = Math.max(0, game.routerHeat - (5 * dt));
                    }
                }
                
                if (game.routerHeat >= 100) game.overheatMode = true;
                if (game.routerHeat <= 50) game.overheatMode = false;
                
            } catch (e) {
                console.error('Router heat calculation failed:', e);
            }
            
            // Store values for UI display
            game.overclockMult = overclockMult;
            game.coolingPower = coolingPower;
            game.overclockHeatGen = overclockHeatGen;

            // Calculate multipliers
            let efficiency = 1.0;
            efficiency *= overclockMult;  // Apply scaled overclock multiplier
            if (game.overheatMode) efficiency *= 0.7;
            
            // Driver effects
            const driverDownloadMult = 1 + (game.drivers.download * DRIVERS.download.effect);
            const driverUploadMult = 1 + (game.drivers.upload * DRIVERS.upload.effect);
            const driverMiningMult = 1 + (game.drivers.mining * DRIVERS.mining.effect);
            const driverResearchMult = 1 + (game.drivers.research * DRIVERS.research.effect);

            // Prestige multiplier (doubled in v11: +100% per prestige)
            const prestigeMult = 1 + (game.prestige * 1.0);
            
            // NODE SYNERGY BONUSES (New in v11)
            let synergyBoost = 1.0;
            const activeNodeTypes = new Set(game.nodes.filter(n => activeNodes.has(n.id) && !n.infected).map(n => n.type));
            let synergyPercent = 0;
            
            // Cache + Downloader synergy: +15% download speed
            if (activeNodeTypes.has('cache') && (activeNodeTypes.has('dl_file') || activeNodeTypes.has('dl_img') || activeNodeTypes.has('dl_vid') || activeNodeTypes.has('dl_audio'))) {
                synergyBoost *= 1.15;
                synergyPercent += 15;
            }
            
            // Lab + Analyzer synergy: +20% RP generation
            if (activeNodeTypes.has('lab') && activeNodeTypes.has('analyzer')) {
                synergyBoost *= 1.20;
                synergyPercent += 20;
            }
            
            // Firewall + any node: +10% protection bonus (reduces virus chance further)
            if (activeNodeTypes.has('firewall')) {
                synergyBoost *= 1.10;
                synergyPercent += 10;
            }
            
            // Coding node trio: Coder + Dev Station + Compiler = +25% code generation
            if (activeNodeTypes.has('coder') && activeNodeTypes.has('dev_station') && activeNodeTypes.has('compiler')) {
                synergyBoost *= 1.25;
                synergyPercent += 25;
            }
            
            // Miner + Crypto Farm synergy: +30% mining income
            if (activeNodeTypes.has('miner') && activeNodeTypes.has('crypto_farm')) {
                synergyBoost *= 1.30;
                synergyPercent += 30;
            }
            
            // Auto-Balancer (when enabled): +5% global efficiency from automatic load distribution
            if (autoBalancerEnabled) {
                synergyBoost *= 1.05;
            }
            
            // Track max synergy bonus for achievements
            if (synergyPercent > game.stats.synergyBonus) {
                game.stats.synergyBonus = synergyPercent;
            } 
            const fiberMult = game.unlocked.includes('tech_fiber') ? 1.25 : 1;
            const satMult = game.unlocked.includes('tech_sat') ? 1.5 : 1;
            const neuralMult = game.unlocked.includes('tech_neural') ? 1.5 : 1;
            const cdnBoost = 1 + (game.nodes.filter(n => n.type === 'cdn' && activeNodes.has(n.id) && !n.infected).length * 0.20); // Reduced from 0.25
            const aiBoost = 1 + (game.nodes.filter(n => n.type === 'ai_processor' && activeNodes.has(n.id) && !n.infected).length * 0.5); // Reduced from 1.0
            const clusterCount = game.nodes.filter(n => n.type === 'cluster' && activeNodes.has(n.id) && !n.infected).length;
            const clusterBoost = 1 + (clusterCount * 0.15); // Reduced from 0.2
            let quantumMult = 1;
            game.nodes.forEach(n => { if (n.type === 'quantum' && activeNodes.has(n.id) && !n.infected) quantumMult *= 2; });
            
            // Event multipliers
            const eventSpeedMult = eventMultipliers.speed;
            const eventMoneyMult = eventMultipliers.money;
            const eventRPMult = eventMultipliers.rp;
            const eventCodeMult = eventMultipliers.code;
            
            const baseSpeed = 20 * Math.pow(1.4, game.routerLevel - 1) * prestigeMult * fiberMult * quantumMult * neuralMult * efficiency * driverDownloadMult * eventSpeedMult * synergyBoost; // Reduced from 25/1.5
            
            // CODE GENERATION
            const coders = game.nodes.filter(n => n.type === 'coder' && activeNodes.has(n.id) && !n.infected);
            const devStations = game.nodes.filter(n => n.type === 'dev_station' && activeNodes.has(n.id) && !n.infected);
            const compilers = game.nodes.filter(n => n.type === 'compiler' && activeNodes.has(n.id) && !n.infected);
            
            let codeGenRate = 0;
            coders.forEach(coder => {
                const lvlMult = Math.pow(1.2, coder.level - 1);
                codeGenRate += 6.25 * lvlMult * eventCodeMult; // 6.25 bits per second base (buffed +25% in v11)
            });
            devStations.forEach(station => {
                const lvlMult = Math.pow(1.2, station.level - 1);
                codeGenRate += 12.5 * lvlMult * eventCodeMult; // 12.5 bits per second (buffed +25% in v11)
            });
            
            const bitsGenerated = codeGenRate * dt;
            game.codeBits += bitsGenerated;
            game.stats.totalCodeBits += bitsGenerated;
            
            // Auto-compiler - benefits from level (more conversion capacity per level)
            if (compilers.length > 0 && game.codeBits >= 100) {
                const totalCompilerPower = compilers.reduce((sum, c) => sum + Math.pow(1.2, c.level - 1), 0);
                const toConvert = Math.min(Math.floor(game.codeBits / 100), Math.floor(totalCompilerPower * 10));
                if (toConvert > 0) {
                    game.codeBits -= toConvert * 100;
                    game.optimizationCode += toConvert;
                }
            }

            // Process resources
            let fileConsumers = [];
            let totalFileDemand = 0;
            let analyzerCount = game.nodes.filter(n => n.type === 'analyzer' && activeNodes.has(n.id) && !n.infected).length;
            let rpBoost = 1 + (analyzerCount * 0.5);
            const warehouseCount = game.nodes.filter(n => n.type === 'warehouse' && activeNodes.has(n.id) && !n.infected).length;

            // PERFORMANCE: Cache node lookups in a Map for O(1) access
            const nodeMap = new Map(game.nodes.map(n => [n.id, n]));
            
            game.nodes.forEach(node => {
                if (!activeNodes.has(node.id)) return;
                if (node.infected) { 
                    // Security driver reduces money loss from viruses
                    const securityMult = Math.max(0, 1 - (game.drivers.security * DRIVERS.security.effect));
                    game.money -= 10 * dt * securityMult; 
                    return; 
                }

                const def = NODE_DEFS[node.type];
                const lvlMult = Math.pow(1.2, node.level - 1);
                
                let boost = 1 * aiBoost * clusterBoost;
                let hasCompressor = false;
                
                // PERFORMANCE: Use cached nodeMap instead of find()
                game.conns.forEach(c => {
                    const nid = c.from === node.id ? c.to : c.from;
                    const n = nodeMap.get(nid);
                    if (n && activeNodes.has(nid) && !n.infected) {
                        if (n.type === 'cache') boost *= 1.5;
                        if (n.type === 'rack') boost *= 1.2;
                        if (n.type === 'compressor') hasCompressor = true;
                    }
                });
                
                if (node.type === 'balancer') {
                    const neighbors = [];
                    game.conns.forEach(c => {
                        if (c.from === node.id) neighbors.push(c.to);
                        else if (c.to === node.id) neighbors.push(c.from);
                    });
                    boost *= (1 + neighbors.length * 0.1);
                }
                
                let isStreamingServer = node.type === 'streaming';
                if (node.type === 'crypto_farm') boost *= 3;
                
                const effectiveSpeed = baseSpeed * boost * lvlMult * dt;

                if (def.type === 'download' || node.type === 'dl_audio') {
                    const resourceKey = def.out || node.type.replace('dl_', '');
                    let amt = effectiveSpeed / RESOURCES[resourceKey].size;
                    if (warehouseCount > 0) amt *= (1 + warehouseCount * 0.3);
                    game.res[resourceKey] += amt;
                    workAnim(node);
                }
                else if (node.type === 'miner') {
                    const gain = effectiveSpeed * 0.025 * driverMiningMult * eventMoneyMult; // Reduced from 0.05
                    if (gain > 0 && isFinite(gain)) {
                        game.money += gain;
                        history.money = (history.money || 0) + gain;
                        game.stats.totalMoney += gain;
                    }
                    workAnim(node);
                }
                else if (node.type === 'crypto_farm') {
                    const gain = effectiveSpeed * 0.08 * driverMiningMult * eventMoneyMult; // Reduced from 0.15
                    if (gain > 0 && isFinite(gain)) {
                        game.money += gain;
                        history.money = (history.money || 0) + gain;
                        game.stats.totalMoney += gain;
                    }
                    workAnim(node);
                }

                if (def.type === 'upload' || node.type === 'rack') {
                    const upSpeed = effectiveSpeed * (node.type === 'rack' ? 2 : satMult) * cdnBoost * driverUploadMult;
                    let cap = upSpeed;
                    
                    if (node.type === 'rack') {
                        game.res.files += (upSpeed * 0.15) / RESOURCES.files.size;
                        if(game.unlocked.includes('tech_img')) game.res.images += (upSpeed * 0.15) / RESOURCES.images.size;
                        if(game.unlocked.includes('tech_vid')) game.res.videos += (upSpeed * 0.15) / RESOURCES.videos.size;
                        if(game.unlocked.includes('tech_audio')) game.res.audio += (upSpeed * 0.15) / RESOURCES.audio.size;
                    }

                    // Priority: audio, videos, images
                    ['audio', 'videos', 'images'].forEach(k => {
                        if (cap <= 0 || game.res[k] <= 0) return;
                        let size = RESOURCES[k].size;
                        if (hasCompressor) size *= (0.7 - (game.drivers.compression * DRIVERS.compression.effect));
                        if (isStreamingServer && (k === 'audio' || k === 'videos')) size *= 0.5;
                        
                        const count = Math.min(game.res[k], cap / size);
                        game.res[k] -= count;
                        cap -= count * size;
                        
                        const gain = count * RESOURCES[k].price * eventMoneyMult * 0.7; // Reduced by 30%
                        if (gain > 0 && isFinite(gain)) {
                            game.money += gain;
                            history.money = (history.money || 0) + gain;
                            game.stats.totalMoney += gain;
                        }
                        workAnim(node);
                        if (activeContract && activeContract.type === 'upload') activeContract.current += count * size;
                    });

                    if (cap > 0) {
                        fileConsumers.push({ node, capacity: cap, type: 'upload', hasCompressor });
                        totalFileDemand += cap;
                    }
                }
                else if (def.type === 'lab') {
                    let labCap = effectiveSpeed * RESOURCES.files.size;
                    const neighbors = [];
                    game.conns.forEach(c => {
                        if (c.from === node.id) neighbors.push(c.to);
                        else if (c.to === node.id) neighbors.push(c.from);
                    });
                    if (neighbors.some(nid => {
                        const n = game.nodes.find(x => x.id === nid);
                        return n && n.type === 'balancer';
                    })) {
                        labCap *= 1.3;
                    }
                    if (aiBoost > 1) labCap *= aiBoost;
                    fileConsumers.push({ node, capacity: labCap, type: 'lab', hasCompressor });
                    totalFileDemand += labCap;
                }
            });

            if (totalFileDemand > 0) {
                const totalFilesBytes = game.res.files * RESOURCES.files.size;
                const ratio = totalFilesBytes >= totalFileDemand ? 1 : (totalFilesBytes / totalFileDemand);
                
                fileConsumers.forEach(c => {
                    const allocatedBytes = c.capacity * ratio;
                    if (allocatedBytes <= 0) return;
                    
                    let size = RESOURCES.files.size;
                    if (c.hasCompressor) size *= (0.7 - (game.drivers.compression * DRIVERS.compression.effect));
                    
                    const count = allocatedBytes / size;
                    
                    if (game.res.files >= count) {
                        game.res.files -= count;
                        
                        if (c.type === 'upload') {
                            const gain = count * RESOURCES.files.price * eventMoneyMult * 0.7; // Reduced by 30%
                            if (gain > 0 && isFinite(gain)) {
                                game.money += gain;
                                history.money = (history.money || 0) + gain;
                                game.stats.totalMoney += gain;
                            }
                            if (activeContract && activeContract.type === 'upload') activeContract.current += count * size;
                        } else {
                            const gain = count * RESOURCES.files.rp * rpBoost * driverResearchMult * eventRPMult;
                            if (gain > 0 && isFinite(gain)) {
                                game.rp += gain;
                                history.rp = (history.rp || 0) + gain;
                                game.stats.totalRP += gain;
                            }
                        }
                        workAnim(c.node);
                    }
                });
            }

            game.nodes.forEach(n => {
                if ((n.type === 'backup' || n.type === 'warehouse') && activeNodes.has(n.id) && !n.infected) {
                    const stored = Object.values(game.res).reduce((a, b) => (a || 0) + (b || 0), 0);
                    if (stored > 1000) {
                        const bonus = stored * 0.001 * dt * (n.type === 'warehouse' ? 2 : 1); // Reduced from 0.002
                        if (bonus > 0 && isFinite(bonus) && bonus < 1e15) {
                            game.money += bonus;
                            history.money = (history.money || 0) + bonus;
                            game.stats.totalMoney += bonus;
                        }
                    }
                }
            });
            
            // CRITICAL FIX: Ensure money never becomes invalid
            if (!isFinite(game.money) || game.money < 0 || game.money > 1e308) {
                console.error('Invalid money detected:', game.money);
                game.money = 2000;
                history.money = 0;
            }
            
            // Ensure history.money is always valid
            if (!isFinite(history.money) || history.money < 0) {
                history.money = 0;
            }
            
            // AUTO-RESEARCH: If unlocked, automatically buy affordable tech
            if (game.unlocked.includes('tech_automation') && frameCount % 60 === 0) {
                TECH_TREE.forEach(tech => {
                    if (!game.unlocked.includes(tech.id) && game.rp >= tech.cost) {
                        const canUnlock = !tech.requires || tech.requires.every(req => game.unlocked.includes(req));
                        if (canUnlock) {
                            game.rp -= tech.cost;
                            game.unlocked.push(tech.id);
                            game.stats.totalRP += tech.cost;
                            logEvent(`Auto-Researched: ${tech.name}`, 'good');
                        }
                    }
                });
            }

            if (activeContract) {
                activeContract.time -= dt;
                if (activeContract.time <= 0) {
                    showFloat("Contract Failed", window.innerWidth/2, window.innerHeight/2, 'red');
                    logEvent("Contract Failed.");
                    activeContract = null;
                } else if (activeContract.current >= activeContract.target) {
                    game.money += activeContract.rewardMoney;
                    game.rp += activeContract.rewardRp;
                    game.stats.totalMoney += activeContract.rewardMoney;
                    game.stats.totalRP += activeContract.rewardRp;
                    game.stats.contractsCompleted++;
                    showFloat(`+$${fmt(activeContract.rewardMoney)}`, window.innerWidth/2, window.innerHeight/2, 'gold');
                    logEvent("Contract Complete!");
                    activeContract = null;
                    checkAchievements();
                }
            }
            
            // Update systems
            updateEvents(dt);
            updateCombo(dt);
            
            // Throttle UI updates to every 3rd frame for performance
            if (frameCount % 3 === 0) {
                updateStatistics();
                updatePrestigeUI();
                updateUI(efficiency);
            }
            
            requestAnimationFrame(gameLoop);
        }

        function virusLoop() {
            // Security driver reduces virus chance
            const securityMult = Math.max(0.1, 1 - (game.drivers.security * DRIVERS.security.effect));
            if (Math.random() > (0.05 * securityMult)) return; 
            
            const targets = game.nodes.filter(n => activeNodes.has(n.id) && n.type !== 'router' && n.type !== 'firewall' && !n.infected);
            if (targets.length === 0) return;
            
            const target = targets[Math.floor(Math.random() * targets.length)];
            
            let isProtected = false;
            game.conns.forEach(c => {
                const nid = c.from === target.id ? c.to : c.from;
                const n = game.nodes.find(x => x.id === nid);
                if (n && n.type === 'firewall' && activeNodes.has(nid) && !n.infected) isProtected = true;
            });
            
            if (!isProtected) {
                target.infected = true;
                showFloat("âš ï¸ VIRUS", target.x + 90, target.y, '#8b5cf6');
                logEvent("Virus detected!");
                renderWorld(); 
            }
        }

        function secLoop() {
            // Validate history values
            const rawMoney = history.money;
            const rawRP = history.rp;
            
            // Ensure valid numbers
            const moneyThisSecond = (isFinite(rawMoney) && rawMoney > 0) ? rawMoney : 0;
            const rpThisSecond = (isFinite(rawRP) && rawRP > 0) ? rawRP : 0;
            
            // Debug logging for high money scenarios
            if (game.money > 5000000 && moneyThisSecond === 0) {
                console.warn('Zero money income detected at high money:', {
                    totalMoney: game.money,
                    rawHistory: rawMoney,
                    activeNodes: game.nodes.filter(n => activeNodes.has(n.id)).length,
                    timestamp: Date.now()
                });
            }
            
            // Update current rates
            rateTracking.money.current = moneyThisSecond;
            rateTracking.rp.current = rpThisSecond;
            
            // Add to history for smoothing
            rateTracking.money.history.push(moneyThisSecond);
            rateTracking.rp.history.push(rpThisSecond);
            
            // Keep only last N seconds
            if (rateTracking.money.history.length > RATE_SMOOTHING_WINDOW) {
                rateTracking.money.history.shift();
            }
            if (rateTracking.rp.history.length > RATE_SMOOTHING_WINDOW) {
                rateTracking.rp.history.shift();
            }
            
            // Calculate smoothed rates (average of last N seconds)
            const validMoneyHistory = rateTracking.money.history.filter(n => isFinite(n) && n >= 0);
            const validRPHistory = rateTracking.rp.history.filter(n => isFinite(n) && n >= 0);
            
            const moneySum = validMoneyHistory.reduce((a, b) => a + b, 0);
            const rpSum = validRPHistory.reduce((a, b) => a + b, 0);
            
            rateTracking.money.smoothed = validMoneyHistory.length > 0 ? moneySum / validMoneyHistory.length : 0;
            rateTracking.rp.smoothed = validRPHistory.length > 0 ? rpSum / validRPHistory.length : 0;
            
            // Update display (ensure we always show a valid number)
            const displayMoneyRate = Math.max(0, Math.round(rateTracking.money.smoothed || 0));
            const displayRPRate = Math.max(0, Math.round(rateTracking.rp.smoothed || 0));
            
            const moneyRateEl = document.getElementById('moneyRate');
            const rpRateEl = document.getElementById('rpRate');
            if (moneyRateEl) moneyRateEl.innerText = `+$${fmt(displayMoneyRate)}/s`;
            if (rpRateEl) rpRateEl.innerText = `+${fmt(displayRPRate)}/s`;
            
            // Reset accumulators for next second
            history = { money: 0, rp: 0 };
            
            // Auto-save check (every 60 seconds)
            if (game.autoSaveEnabled && frameCount % 3600 === 0) {
                autoSaveLocal();
            }
            
            // Cloud sync check (every 5 minutes)
            if (frameCount % 18000 === 0 && currentUser) {
                syncToCloud();
            }
        }
        
        // Batch upgrade feature - upgrade all nodes of same type
        function batchUpgrade(type) {
            const nodesOfType = game.nodes.filter(n => n.type === type && activeNodes.has(n.id));
            if (nodesOfType.length === 0) {
                showFloat(`No active ${type} nodes found`, window.innerWidth/2, window.innerHeight/2, 'red');
                return;
            }
            
            let upgradedCount = 0;
            let totalCost = 0;
            
            nodesOfType.forEach(node => {
                const cost = NODE_DEFS[type].cost * Math.pow(1.5, node.level - 1);
                if (game.money >= cost + totalCost) {
                    totalCost += cost;
                    upgradedCount++;
                }
            });
            
            if (upgradedCount === 0) {
                showFloat(`Not enough money for any upgrades`, window.innerWidth/2, window.innerHeight/2, 'red');
                return;
            }
            
            // Apply upgrades
            game.money -= totalCost;
            game.stats.moneySpent += totalCost;
            
            let actualUpgraded = 0;
            nodesOfType.forEach(node => {
                const cost = NODE_DEFS[type].cost * Math.pow(1.5, node.level - 1);
                if (actualUpgraded < upgradedCount) {
                    node.level++;
                    actualUpgraded++;
                    spawnParticles(node.x + 85, node.y + 35, '#fbbf24', 5);
                }
            });
            
            game.stats.upgrades += actualUpgraded;
            renderWorld();
            updateUI();
            
            showFloat(`Upgraded ${actualUpgraded} ${type} nodes (-$${fmt(totalCost)})`, window.innerWidth/2, window.innerHeight/2, '#fbbf24');
            logEvent(`Batch upgraded ${actualUpgraded} ${type} nodes`, 'good');
            checkAchievements();
        }
        
        // Auto-balancer feature - automatically distributes load
        let autoBalancerEnabled = false;
        function toggleAutoBalancer() {
            autoBalancerEnabled = !autoBalancerEnabled;
            if (autoBalancerEnabled) {
                logEvent('Auto-Balancer enabled', 'good');
                showFloat('Auto-Balancer enabled', window.innerWidth/2, window.innerHeight/2, '#10b981');
            } else {
                logEvent('Auto-Balancer disabled', 'info');
                showFloat('Auto-Balancer disabled', window.innerWidth/2, window.innerHeight/2, '#94a3b8');
            }
            return autoBalancerEnabled;
        }
        
        function eventLoop() {
            // Random events checked every 10 minutes with 1% chance
            triggerRandomEvent();
        }

        function updateConnectivity() {
            const newActive = new Set();
            const q = [];
            
            // Find all routers and add them to active set
            const routers = game.nodes.filter(n => n.type === 'router');
            if (routers.length === 0) {
                // No router - nothing can be active
                activeNodes.clear();
                return;
            }
            
            routers.forEach(n => {
                if (n && n.id !== undefined) {
                    newActive.add(n.id);
                    q.push(n.id);
                }
            });

            // BFS to find all connected nodes
            while (q.length > 0) {
                const curr = q.shift();
                game.conns.forEach(c => {
                    const other = c.from === curr ? c.to : (c.to === curr ? c.from : null);
                    if (other && !newActive.has(other)) {
                        newActive.add(other);
                        q.push(other);
                    }
                });
            }

            // Only update DOM if there are changes
            const hasChanges = activeNodes.size !== newActive.size || [...newActive].some(x => !activeNodes.has(x));
            
            if (hasChanges) {
                game.nodes.forEach(n => {
                    if (!n || n.id === undefined) return;
                    const el = document.getElementById(`node-${n.id}`);
                    if (!el) return;
                    if (newActive.has(n.id)) {
                        el.classList.remove('disconnected');
                    } else {
                        el.classList.add('disconnected');
                    }
                });
                
                // Update cable visuals
                document.querySelectorAll('.cable-group').forEach(c => {
                    if (!c.dataset.ends) return;
                    const [id1, id2] = c.dataset.ends.split(',').map(Number);
                    if (newActive.has(id1) && newActive.has(id2)) {
                        c.classList.remove('disconnected');
                        c.classList.add('active');
                    } else {
                        c.classList.add('disconnected');
                        c.classList.remove('active');
                    }
                });
            }
            
            // Update the activeNodes Set
            activeNodes.clear();
            newActive.forEach(id => activeNodes.add(id));
        }

        // --- CODE SYSTEM FUNCTIONS ---
        
        function convertCodeBits() {
            if (game.codeBits >= 100) {
                game.codeBits -= 100;
                game.optimizationCode += 1;
                logEvent("Converted 100 code bits to 1 optimization code", 'code');
                updateCodeUI();
            }
        }
        
        // Optimized driver installation
        function installDriver(driverId) {
            const driver = DRIVERS[driverId];
            if (game.optimizationCode >= driver.cost) {
                game.optimizationCode -= driver.cost;
                game.drivers[driverId]++;
                game.stats.totalDrivers++;
                
                logEvent(`Installed ${driver.name} Level ${game.drivers[driverId]}!`, 'code');
                
                // Visual feedback - only animate the updated card
                const grid = document.getElementById('driverGrid');
                if (grid) {
                    const card = grid.querySelector(`[data-driver-id="${driverId}"]`);
                    if (card) {
                        card.classList.add('updating');
                        card.classList.add('installed');
                        card.classList.remove('locked');
                        // Update the level display directly
                        const levelDiv = card.querySelector('.driver-level') || document.createElement('div');
                        levelDiv.className = 'driver-level';
                        levelDiv.innerText = `Level ${game.drivers[driverId]} (+${Math.round(game.drivers[driverId] * driver.effect * 100)}%)`;
                        if (!card.querySelector('.driver-level')) {
                            card.appendChild(levelDiv);
                        }
                        setTimeout(() => card.classList.remove('updating'), 300);
                    }
                }
                
                // Update UI without full re-render
                updateCodeUI();
                updateInstalledDriversList();
                checkAchievements();
            }
        }
        
        // Optimized Code UI updates with throttling
        let codeUIUpdatePending = false;
        let lastCodeBits = -1;
        let lastOptCode = -1;
        
        function updateCodeUI() {
            // Skip if modal not visible and no significant change
            const codeModal = document.getElementById('codeModal');
            const isVisible = codeModal && codeModal.style.display === 'flex';
            const codeBitsFloor = Math.floor(game.codeBits);
            
            // Always update sidebar (visible in main UI)
            const sidebarCodeBits = document.getElementById('sidebarCodeBits');
            const sidebarOptCode = document.getElementById('sidebarOptCode');
            if (sidebarCodeBits) sidebarCodeBits.innerText = codeBitsFloor;
            if (sidebarOptCode) sidebarOptCode.innerText = game.optimizationCode;
            document.getElementById('codeDisplay').innerText = codeBitsFloor;
            
            // Throttle modal updates
            if (!isVisible || codeUIUpdatePending) return;
            
            // Skip if values haven't changed meaningfully
            if (codeBitsFloor === lastCodeBits && game.optimizationCode === lastOptCode) return;
            
            codeUIUpdatePending = true;
            requestAnimationFrame(() => {
                lastCodeBits = codeBitsFloor;
                lastOptCode = game.optimizationCode;
                
                const codeBitsDisplay = document.getElementById('codeBitsDisplay');
                const optCodeDisplay = document.getElementById('optCodeDisplay');
                
                if (codeBitsDisplay) {
                    codeBitsDisplay.innerText = codeBitsFloor;
                    codeBitsDisplay.classList.add('changed');
                    setTimeout(() => codeBitsDisplay.classList.remove('changed'), 300);
                }
                if (optCodeDisplay) {
                    optCodeDisplay.innerText = game.optimizationCode;
                    optCodeDisplay.classList.add('changed');
                    setTimeout(() => optCodeDisplay.classList.remove('changed'), 300);
                }
                
                const convertBtn = document.getElementById('convertBitsBtn');
                const sidebarConvertBtn = document.getElementById('sidebarConvertBtn');
                if (convertBtn) convertBtn.disabled = game.codeBits < 100;
                if (sidebarConvertBtn) sidebarConvertBtn.disabled = game.codeBits < 100;
                
                updateInstalledDriversList();
                renderDriverGrid();
                
                codeUIUpdatePending = false;
            });
        }
        
        // Cached installed drivers list
        let lastInstalledDriversState = '';
        
        function updateInstalledDriversList() {
            const installed = Object.entries(game.drivers).filter(([_, level]) => level > 0);
            const stateKey = installed.map(([id, level]) => `${id}:${level}`).join(',');
            
            if (stateKey === lastInstalledDriversState) return;
            lastInstalledDriversState = stateKey;
            
            const lists = ['installedDriversList', 'sidebarDrivers'];
            const html = installed.length === 0 
                ? '<span style="font-size: 9px; color: #64748b;">No drivers installed</span>'
                : installed.map(([id, level]) => {
                    const driver = DRIVERS[id];
                    return `<div class="driver-badge"><i class="${driver.icon}"></i> ${driver.name.split(' ')[0]} Lv.${level}</div>`;
                }).join('');
            
            lists.forEach(listId => {
                const list = document.getElementById(listId);
                if (list) list.innerHTML = html;
            });
        }
        
        // Optimized driver grid with caching
        let driverGridCache = null;
        let lastDriverState = '';
        
        function renderDriverGrid() {
            const grid = document.getElementById('driverGrid');
            if (!grid) return;
            
            // Build state key for caching
            const currentState = Object.entries(game.drivers)
                .map(([id, level]) => `${id}:${level}`)
                .join(',') + `|opt:${game.optimizationCode}`;
            
            // Skip re-render if nothing changed
            if (currentState === lastDriverState && driverGridCache) return;
            lastDriverState = currentState;
            
            // Use DocumentFragment for better performance
            const fragment = document.createDocumentFragment();
            
            Object.entries(DRIVERS).forEach(([id, driver]) => {
                const level = game.drivers[id];
                const canAfford = game.optimizationCode >= driver.cost;
                const installed = level > 0;
                
                const card = document.createElement('div');
                card.className = `driver-card ${installed ? 'installed' : ''} ${!canAfford ? 'locked' : ''}`;
                card.dataset.driverId = id;
                
                card.innerHTML = `
                    <div class="driver-icon"><i class="${driver.icon}"></i></div>
                    <div class="driver-name">${driver.name}</div>
                    <div class="driver-desc">${driver.desc}</div>
                    <div class="driver-cost">${canAfford ? `Cost: ${driver.cost} Opt Code` : `<span style="color: #ef4444;">Need ${driver.cost} Opt Code</span>`}</div>
                    ${installed ? `<div class="driver-level">Level ${level} (+${Math.round(level * driver.effect * 100)}%)</div>` : ''}
                `;
                
                card.addEventListener('click', () => handleDriverClick(id));
                fragment.appendChild(card);
            });
            
            grid.innerHTML = '';
            grid.appendChild(fragment);
            driverGridCache = true;
        }
        
        // Clear cache when needed
        function clearDriverGridCache() {
            driverGridCache = null;
            lastDriverState = '';
        }
        
        // Optimized modal functions
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            // Close other modals first
            document.querySelectorAll('.modal-overlay').forEach(m => {
                if (m.id !== modalId && m.id !== 'welcomeModal') {
                    m.style.display = 'none';
                }
            });
            
            modal.style.display = 'flex';
            modal.style.visibility = 'visible';
            
            // Trigger specific render functions based on modal
            if (modalId === 'codeModal') {
                clearDriverGridCache();
                lastInstalledDriversState = '';
                renderDriverGrid();
                updateCodeUI();
            } else if (modalId === 'researchModal') {
                renderResearchTree();
                drawResearchLines();
            } else if (modalId === 'achievementsModal') {
                renderAchievements();
            } else if (modalId === 'statsModal') {
                renderStatistics();
            }
        }
        
        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
            }
        }
        
        function closeAllModals() {
            document.querySelectorAll('.modal-overlay').forEach(m => {
                if (m.id !== 'welcomeModal') {
                    m.style.display = 'none';
                }
            });
        }
        
        function handleDriverClick(driverId) {
            const driver = DRIVERS[driverId];
            if (game.optimizationCode >= driver.cost) {
                installDriver(driverId);
                // Clear caches after install to force refresh
                clearDriverGridCache();
                lastInstalledDriversState = '';
            } else {
                showFloat(`Need ${driver.cost} Optimization Code`, window.innerWidth/2, window.innerHeight/2, '#ef4444');
            }
        }

        // --- ACTIONS ---

        function spawnNode(type, x, y) {
            game.nodes.push({ id: game.nextId++, type, x, y, level: 1, infected: false });
            game.stats.nodesCreated++;
            checkAchievements();
            addCombo();
            spawnParticles(x + 90, y + 40, NODE_DEFS[type]?.color || '#3b82f6', 8);
            renderWorld();
        }

        function buyNode(type) {
            const def = NODE_DEFS[type];
            if (game.money >= def.cost) {
                game.money -= def.cost;
                game.stats.moneySpent += def.cost;
                const cx = (-view.x + window.innerWidth/2) / view.scale;
                const cy = (-view.y + window.innerHeight/2) / view.scale;
                spawnNode(type, cx - 90, cy - 40);
                showFloat(`-$${fmt(def.cost)}`, window.innerWidth/2, window.innerHeight/2, 'red');
            }
        }
        
        function cleanNode(node, event) {
            if (event) event.stopPropagation();
            const cost = 500;
            if (game.money >= cost) {
                game.money -= cost;
                game.stats.moneySpent += cost;
                node.infected = false;
                game.stats.virusesCleaned++;
                spawnParticles(node.x + 90, node.y + 40, '#10b981', 10);
                showFloat("CLEANED", node.x + 90, node.y, '#10b981');
                renderWorld();
                checkAchievements();
                addCombo();
            } else {
                showFloat("Need $500", node.x + 90, node.y, 'red');
            }
        }

        function upgradeSelectedNode() {
            if (!selNodeId) return;
            const n = game.nodes.find(x => x.id === selNodeId);
            const def = NODE_DEFS[n.type];
            const base = n.type === 'router' ? 500 : def.cost;
            const cost = Math.floor(base * Math.pow(1.5, n.level));
            
            if (game.money >= cost) {
                game.money -= cost;
                game.stats.moneySpent += cost;
                game.stats.upgrades++;
                n.level++;
                spawnParticles(n.x + 90, n.y + 40, '#fbbf24', 10);
                if (n.type === 'router') {
                    game.routerLevel = n.level;
                    updateRouterCostDisplay();
                }
                renderWorld(); 
                document.getElementById('contextMenu').style.display = 'none';
                checkAchievements();
                addCombo();
            }
        }
        
        function deleteSelectedNode() {
             if (!selNodeId) return;
             const n = game.nodes.find(x => x.id === selNodeId);
             if (n.type === 'router') return; 
             
             game.nodes = game.nodes.filter(x => x.id !== selNodeId);
             game.conns = game.conns.filter(c => c.from !== selNodeId && c.to !== selNodeId);
             game.stats.nodesDeleted++;
             spawnParticles(n.x + 90, n.y + 40, '#ef4444', 8);
             document.getElementById('contextMenu').style.display = 'none';
             renderWorld();
             checkAchievements();
        }

        // ==================== CABLE DELETION SYSTEM ====================
        let cableDeleteMode = false;
        
        function toggleCableDeleteMode() {
            cableDeleteMode = !cableDeleteMode;
            const btn = document.getElementById('cableDeleteBtn');
            const btnText = document.getElementById('cableDeleteText');
            const world = document.getElementById('world');
            
            // Update pointer-events on all cable groups
            document.querySelectorAll('.cable-group').forEach(g => {
                g.style.pointerEvents = cableDeleteMode ? 'all' : 'none';
            });
            document.querySelectorAll('.cable').forEach(c => {
                c.style.pointerEvents = cableDeleteMode ? 'stroke' : 'none';
            });
            
            if (cableDeleteMode) {
                btn.classList.add('active');
                btnText.innerText = 'Click Cable to Delete';
                world.classList.add('cable-delete-mode');
                logEvent('Cable delete mode: ON - Click any cable to delete it', 'info');
                showFloat('ðŸ–±ï¸ Click any cable to delete it', window.innerWidth/2, window.innerHeight/2, '#ef4444');
            } else {
                btn.classList.remove('active');
                btnText.innerText = 'Delete Cables';
                world.classList.remove('cable-delete-mode');
            }
        }
        
        function handleCableClick(fromId, toId, event) {
            if (!cableDeleteMode) return;
            
            event.stopPropagation();
            event.preventDefault();
            
            deleteCable(fromId, toId, event);
        }
        
        function deleteCable(fromId, toId, event) {
            // Find and remove the cable
            const cableIndex = game.conns.findIndex(c => 
                (c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId)
            );
            
            if (cableIndex === -1) return;
            
            // Get cable position for particle effect (use same port offsets as path: out 170,35 / in 0,35)
            const n1 = game.nodes.find(n => n.id === fromId);
            const n2 = game.nodes.find(n => n.id === toId);
            
            game.conns.splice(cableIndex, 1);
            
            if (n1 && n2) {
                const x1 = n1.x + 170, y1 = n1.y + 35, x2 = n2.x, y2 = n2.y + 35;
                spawnParticles((x1 + x2) / 2, (y1 + y2) / 2, '#ef4444', 5);
            }
            
            // Refund $5 for the cable
            game.money += 5;
            showFloat('+ $5 (Cable Refund)', window.innerWidth/2, window.innerHeight/2, '#10b981');
            
            renderCables();
            updateConnectivity();
            logEvent('Cable deleted (+$5 refund)', 'info');
            
            // Auto-exit delete mode if shift isn't held
            if (!event.shiftKey) {
                toggleCableDeleteMode();
            }
        }
        
        function deleteAllCables() {
            if (game.conns.length === 0) {
                showFloat('No cables to delete', window.innerWidth/2, window.innerHeight/2, '#f59e0b');
                return;
            }
            
            const cableCount = game.conns.length;
            const refund = cableCount * 5;
            
            if (!confirm(`Delete all ${cableCount} cables? You'll get $${refund} refunded.`)) {
                return;
            }
            
            game.conns = [];
            game.money += refund;
            
            showFloat(`+ $${refund} (${cableCount} cables deleted)`, window.innerWidth/2, window.innerHeight/2, '#10b981');
            logEvent(`Deleted all ${cableCount} cables (+$${refund})`, 'good');
            
            renderCables();
            updateConnectivity();
            
            // Exit delete mode if active
            if (cableDeleteMode) toggleCableDeleteMode();
        }

        function unlockTech(id) {
            const tech = TECH_TREE.find(t => t.id === id);
            if (!tech) return;
            if (!game.unlocked.includes(id) && game.rp >= tech.cost && canUnlockTech(id)) {
                game.rp -= tech.cost;
                game.unlocked.push(id);
                renderResearchTree();
                setTab(currTab);
                logEvent(`Researched: ${tech.name}`);
            }
        }
        
        function canUnlockTech(id) {
            const tech = TECH_TREE.find(t => t.id === id);
            if (!tech) return false;
            if (!tech.requires || tech.requires.length === 0) return true;
            return tech.requires.every(req => game.unlocked.includes(req));
        }
        
        function prestige() {
            if (game.money < 10000000) return;
            if (!confirm("Sell company? Resets money, nodes, tech. Drivers and code persist!")) return;
            
            game.prestige++;
            game.money = 2000;
            game.rp = 0;
            game.res = { files: 0, images: 0, videos: 0, audio: 0 };
            game.nodes = [];
            game.conns = [];
            game.routerLevel = 1;
            game.routerHeat = 0;
            game.unlocked = [];
            game.nextId = 1;
            activeContract = null;
            
            init(); 
            renderWorld();
            renderResearchTree();
            setTab('infra');
            logEvent(`Prestige Level ${game.prestige} Achieved!`);
        }

        function openContracts() {
            const list = document.getElementById('contractList');
            list.innerHTML = '';
            
            const types = [
                { title: "Data Dump", desc: "Upload 50 MB Data", target: 50 * 1024 * 1024, time: 60, rewardM: 5000, rewardR: 500 },
                { title: "Streaming Deal", desc: "Upload 500 MB Data", target: 500 * 1024 * 1024, time: 120, rewardM: 25000, rewardR: 2000 },
                { title: "Corporate Backups", desc: "Upload 1 GB Data", target: 1024 * 1024 * 1024, time: 180, rewardM: 100000, rewardR: 5000 }
            ];
            
            types.forEach(c => {
                const el = document.createElement('div');
                el.className = 'contract-item';
                el.innerHTML = `
                    <div>
                        <h4>${c.title}</h4>
                        <p>${c.desc} | Time: ${c.time}s</p>
                    </div>
                    <div class="contract-reward">
                        +$${fmt(c.rewardM)}<br>+${fmt(c.rewardR)} RP
                        <button class="btn btn-contract" style="margin-top:5px; padding:4px 8px; width:auto;" onclick="startContract(${JSON.stringify(c).replace(/"/g, '&quot;')})">Accept</button>
                    </div>
                `;
                list.appendChild(el);
            });
            
            document.getElementById('contractModal').style.display='flex';
        }
        
        function startContract(c) {
            activeContract = { 
                type: 'upload', 
                target: c.target, 
                current: 0, 
                time: c.time, 
                rewardMoney: c.rewardM, 
                rewardRp: c.rewardR,
                desc: c.desc 
            };
            logEvent("Contract Started: " + c.title);
            document.getElementById('contractModal').style.display='none';
        }

        function fmt(n) {
            // Safety check for invalid numbers
            if (n === null || n === undefined || isNaN(n) || !isFinite(n)) {
                console.warn('fmt() received invalid number:', n);
                return '0';
            }
            const num = Number(n);
            if (num >= 1e12) return (num/1e12).toFixed(2) + 'T';
            if (num >= 1e9) return (num/1e9).toFixed(2) + 'B';
            if (num >= 1e6) return (num/1e6).toFixed(2) + 'M';
            if (num >= 1e3) return (num/1e3).toFixed(1) + 'k';
            return Math.floor(num).toString();
        }
        
        function updateRouterCostDisplay() {
            const base = 500;
            const cost = Math.floor(base * Math.pow(1.5, game.routerLevel));
            const costEl = document.getElementById('routerCostValue');
            costEl.innerText = '$' + fmt(cost);
            
            if (game.money >= cost) {
                costEl.className = 'cost-value affordable';
            } else {
                costEl.className = 'cost-value expensive';
            }
        }

        function renderWorld() {
            const nodesDiv = document.getElementById('nodes');
            nodesDiv.innerHTML = '';
            
            game.nodes.forEach(n => {
                const def = NODE_DEFS[n.type];
                const el = document.createElement('div');
                let classes = `node ${activeNodes.has(n.id) ? '' : 'disconnected'} ${n.infected ? 'infected' : ''}`;
                if (n.type === 'router' && game.overheatMode) classes += ' overheating';
                if (def.type === 'coding') classes += ' coding';
                
                el.className = classes;
                el.id = `node-${n.id}`;
                el.style.left = n.x + 'px';
                el.style.top = n.y + 'px';
                
                const ports = `<div class="port in" onmousedown="portDown(${n.id}, event)" onmouseup="portUp(${n.id})"></div>
                               <div class="port out" onmousedown="portDown(${n.id}, event)" onmouseup="portUp(${n.id})"></div>`;
                
                const cleanBtn = n.infected ? `<div class="clean-btn" onmousedown="cleanNode(game.nodes.find(x=>x.id===${n.id}), event)">CLEAN [-$500]</div>` : '';

                el.innerHTML = `
                    ${ports}
                    ${cleanBtn}
                    <div class="node-header">
                        <div class="node-icon-box" style="color:${def.color}"><i class="${def.icon}"></i></div>
                        <div class="node-info">
                            <div class="node-title">${def.name}</div>
                            <div class="node-lvl">Level ${n.level}</div>
                        </div>
                    </div>
                `;
                
                el.onmousedown = (e) => {
                    if (e.target.classList.contains('port')) return;
                    if (e.target.classList.contains('clean-btn')) return;
                    if (e.button === 2) {
                        e.preventDefault();
                        showContext(n, e);
                        return;
                    }
                    if (n.infected) return; 
                    dragStart(n, e);
                };
                
                nodesDiv.appendChild(el);
            });

            renderCables();
        }

        // Cable cache for efficient updates
        let cableCache = new Map();
        let cableUpdatePending = false;
        
        function renderCables() {
            const svg = document.getElementById('cables');
            // Only clear if cable count changed or cables don't exist
            if (svg.children.length !== game.conns.length) {
                svg.innerHTML = '';
                cableCache.clear();
                
                game.conns.forEach(c => {
                    const n1 = game.nodes.find(n => n.id === c.from);
                    const n2 = game.nodes.find(n => n.id === c.to);
                    if (!n1 || !n2) return;
                    
                    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    group.classList.add("cable-group");
                    group.dataset.ends = `${c.from},${c.to}`;
                    group.style.pointerEvents = cableDeleteMode ? 'all' : 'none';
                    group.onclick = (e) => handleCableClick(c.from, c.to, e);
                    
                    const destDef = NODE_DEFS[n2.type];
                    if (destDef.type === 'upload' || n2.type === 'rack') group.classList.add('money');
                    else if (destDef.type === 'lab') group.classList.add('power');
                    else if (destDef.type === 'coding') group.classList.add('code');
                    if (activeNodes.has(n1.id) && activeNodes.has(n2.id)) group.classList.add('active');
                    else group.classList.add('disconnected');
                    
                    const bgLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    bgLine.classList.add("cable");
                    bgLine.dataset.from = c.from;
                    bgLine.dataset.to = c.to;
                    bgLine.style.pointerEvents = cableDeleteMode ? 'stroke' : 'none';
                    
                    const dashLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    dashLine.classList.add("cable-inner");
                    
                    group.appendChild(bgLine);
                    group.appendChild(dashLine);
                    svg.appendChild(group);
                    
                    // Cache the elements
                    cableCache.set(`${c.from},${c.to}`, { group, bgLine, dashLine, n1, n2 });
                });
            }
            
            // Update all cable positions
            updateCablePositions();
        }
        
        function updateCablePositions() {
            cableCache.forEach((cable, key) => {
                const { bgLine, dashLine, n1, n2 } = cable;
                // Get fresh node positions
                const freshN1 = game.nodes.find(n => n.id === n1.id);
                const freshN2 = game.nodes.find(n => n.id === n2.id);
                if (!freshN1 || !freshN2) return;
                
                const x1 = freshN1.x + 170;
                const y1 = freshN1.y + 35;
                const x2 = freshN2.x;
                const y2 = freshN2.y + 35;
                
                const pathStr = `M ${x1} ${y1} C ${x1 + 80} ${y1}, ${x2 - 80} ${y2}, ${x2} ${y2}`;
                bgLine.setAttribute("d", pathStr);
                dashLine.setAttribute("d", pathStr);
            });
        }
        
        // Throttled cable update for dragging
        function requestCableUpdate() {
            if (cableUpdatePending) return;
            cableUpdatePending = true;
            requestAnimationFrame(() => {
                updateCablePositions();
                cableUpdatePending = false;
            });
        }

        function updateUI(eff = 1.0) {
            document.getElementById('moneyDisplay').innerText = '$' + fmt(game.money);
            document.getElementById('rpDisplay').innerText = fmt(game.rp) + ' RP';
            
            ['Files', 'Images', 'Videos'].forEach(k => {
                const key = k.toLowerCase();
                const val = game.res[key];
                document.getElementById(`txt${k}`).innerText = fmt(val);
                const pct = Math.min(100, Math.log10(val + 1) * 20); 
                document.getElementById(`bar${k}`).style.width = pct + '%';
            });
            
            document.getElementById('modalRpDisplay').innerText = fmt(game.rp);
            
            const world = document.getElementById('world');
            world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
            
            const prestigeMult = 1 + (game.prestige * 0.5);
            const driverDownloadMult = 1 + (game.drivers.download * DRIVERS.download.effect);
            const base = 20 * Math.pow(1.4, game.routerLevel - 1) * prestigeMult * driverDownloadMult; // Reduced from 25/1.5
            document.getElementById('globalDown').innerText = fmt(base * eff) + ' B/s';
            document.getElementById('globalUp').innerText = fmt(base * eff) + ' B/s';
            document.getElementById('routerLvl').innerText = 'LVL ' + game.routerLevel;
            
            const heatBar = document.getElementById('heatBar');
            const heatText = document.getElementById('heatText');
            const heatStatus = document.getElementById('heatStatus');
            heatBar.style.width = game.routerHeat + '%';
            heatText.innerText = Math.floor(game.routerHeat) + 'Â°C';
            
            // Build detailed heat status
            let statusText = '';
            if (game.overheatMode) {
                heatBar.style.background = '#ef4444';
                statusText = 'OVERHEATING (-30% speed)';
                heatStatus.style.color = '#ef4444';
            } else if (game.routerHeat > 50) {
                heatBar.style.background = '#f59e0b';
                statusText = 'Warm';
                heatStatus.style.color = '#f59e0b';
            } else {
                heatBar.style.background = '#10b981';
                statusText = 'Normal';
                heatStatus.style.color = '#a0aec0';
            }
            
            // Add overclock info if active
            if (game.overclockMult > 1) {
                statusText += ` | OC: ${game.overclockMult.toFixed(1)}x`;
            }
            if (game.coolingPower > 0) {
                statusText += ` | Cryo: -${game.coolingPower}/s`;
            }
            
            heatStatus.innerText = 'Status: ' + statusText;
            
            if (game.money >= 10000000 || game.prestige > 0) document.getElementById('prestigeSection').style.display = 'block';
            document.getElementById('prestigeBonusDisplay').innerText = `Data Center Bonus: +${Math.round(game.prestige * 100)}%`;
            
            // Calculate and display synergy bonus
            let synergyPercent = 0;
            const activeNodeTypes = new Set(game.nodes.filter(n => activeNodes.has(n.id) && !n.infected).map(n => n.type));
            if (activeNodeTypes.has('cache') && (activeNodeTypes.has('dl_file') || activeNodeTypes.has('dl_img') || activeNodeTypes.has('dl_vid') || activeNodeTypes.has('dl_audio'))) synergyPercent += 15;
            if (activeNodeTypes.has('lab') && activeNodeTypes.has('analyzer')) synergyPercent += 20;
            if (activeNodeTypes.has('firewall')) synergyPercent += 10;
            if (activeNodeTypes.has('coder') && activeNodeTypes.has('dev_station') && activeNodeTypes.has('compiler')) synergyPercent += 25;
            if (activeNodeTypes.has('miner') && activeNodeTypes.has('crypto_farm')) synergyPercent += 30;
            document.getElementById('synergyBonusDisplay').innerText = `Node Synergy: +${synergyPercent}%`;
            
            const cw = document.getElementById('activeContractWidget');
            if (activeContract) {
                cw.style.display = 'block';
                document.getElementById('contractDesc').innerText = activeContract.desc;
                document.getElementById('contractTimer').innerText = Math.floor(activeContract.time) + 's';
                const pct = Math.min(100, (activeContract.current / activeContract.target) * 100);
                document.getElementById('contractBar').style.width = pct + '%';
            } else {
                cw.style.display = 'none';
            }
            
            // Update active event widget
            const ew = document.getElementById('activeEventWidget');
            if (game.activeEvent) {
                ew.style.display = 'block';
                document.getElementById('eventName').innerText = game.activeEvent.name;
                document.getElementById('eventDesc').innerText = game.activeEvent.desc;
                document.getElementById('eventTimer').innerText = Math.floor(game.eventTimeLeft) + 's';
                ew.style.borderColor = game.activeEvent.type === 'good' ? '#10b981' : '#ef4444';
                document.getElementById('eventName').style.color = game.activeEvent.type === 'good' ? '#10b981' : '#ef4444';
            } else {
                ew.style.display = 'none';
            }
            
            updateRouterCostDisplay();
            updateCodeUI();
            renderStatistics();
            updateNetworkAnalysis();
        }
        
        // Network Analyzer - provides insights and optimization tips
        let networkAnalysisCache = { timestamp: 0, data: null };
        
        function updateNetworkAnalysis() {
            // Update only every 5 seconds
            const now = Date.now();
            if (now - networkAnalysisCache.timestamp < 5000) return;
            networkAnalysisCache.timestamp = now;
            
            const analysis = analyzeNetwork();
            
            // Store analysis for display
            window._networkAnalysis = analysis;
        }
        
        function analyzeNetwork() {
            const active = game.nodes.filter(n => activeNodes.has(n.id) && !n.infected);
            const totalNodes = active.length;
            
            if (totalNodes === 0) return { efficiency: 0, issues: [], suggestions: [] };
            
            // Count node types
            const downloaders = active.filter(n => n.type.startsWith('dl_')).length;
            const uploaders = active.filter(n => n.type === 'uploader' || n.type === 'rack').length;
            const labs = active.filter(n => n.type === 'lab').length;
            const coders = active.filter(n => n.type === 'coder' || n.type === 'dev_station').length;
            
            const issues = [];
            const suggestions = [];
            
            // Check ratios
            if (downloaders > 0 && uploaders === 0) {
                issues.push('You have downloaders but no uploaders!');
                suggestions.push('Add Uploader nodes to sell your collected data.');
            }
            
            if (uploaders > downloaders * 2) {
                issues.push('Too many uploaders compared to downloaders');
                suggestions.push('Add more downloader nodes to feed your uploaders.');
            }
            
            if (labs > 0 && downloaders === 0) {
                issues.push('Research Labs need file input');
                suggestions.push('Add downloader nodes to supply files to your labs.');
            }
            
            // Check for orphaned nodes (nodes with no connections)
            const connectedNodes = new Set();
            game.conns.forEach(c => {
                connectedNodes.add(c.from);
                connectedNodes.add(c.to);
            });
            const orphaned = active.filter(n => !connectedNodes.has(n.id) && n.type !== 'router').length;
            if (orphaned > 0) {
                issues.push(`${orphaned} node(s) have no connections`);
                suggestions.push('Connect all nodes to your router network.');
            }
            
            // Calculate efficiency score
            let efficiency = 100;
            if (issues.length > 0) efficiency -= issues.length * 15;
            if (orphaned > 0) efficiency -= orphaned * 10;
            efficiency = Math.max(0, Math.min(100, efficiency));
            
            return { efficiency, issues, suggestions, stats: { downloaders, uploaders, labs, totalNodes } };
        }
        
        // Console command to show network analysis
        function showNetworkAnalysis() {
            const analysis = analyzeNetwork();
            console.log('%c Network Analysis ', 'background: #3b82f6; color: white; font-size: 14px; font-weight: bold; padding: 5px 10px; border-radius: 4px;');
            console.log('Efficiency Score:', analysis.efficiency + '%');
            console.log('Active Nodes:', analysis.stats.totalNodes);
            console.log('Issues:', analysis.issues.length > 0 ? analysis.issues : 'None');
            console.log('Suggestions:', analysis.suggestions.length > 0 ? analysis.suggestions : 'Network is optimal!');
            return analysis;
        }

        function renderResearchTree() {
            const grid = document.getElementById('researchTreeGrid');
            const svg = document.getElementById('researchTreeSvg');
            grid.innerHTML = '';
            svg.innerHTML = '';
            
            const tiers = {};
            TECH_TREE.forEach(t => {
                if (!tiers[t.tier]) tiers[t.tier] = [];
                tiers[t.tier].push(t);
            });
            
            const maxTier = Math.max(...Object.keys(tiers).map(Number));
            
            for (let tier = 1; tier <= maxTier; tier++) {
                const tierCol = document.createElement('div');
                tierCol.className = 'research-tier';
                
                const tierLabel = document.createElement('div');
                tierLabel.className = `tier-label tier-${tier}`;
                tierLabel.innerText = 'Tier ' + tier;
                tierCol.appendChild(tierLabel);
                
                if (tiers[tier]) {
                    tiers[tier].forEach(tech => {
                        const owned = game.unlocked.includes(tech.id);
                        const canAfford = game.rp >= tech.cost;
                        const prerequisitesMet = canUnlockTech(tech.id);
                        const isAvailable = !owned && canAfford && prerequisitesMet;
                        
                        const card = document.createElement('div');
                        card.className = `tech-card ${owned ? 'owned' : ''} ${!prerequisitesMet ? 'locked' : ''} ${isAvailable ? 'available' : ''}`;
                        card.id = `tech-${tech.id}`;
                        card.onclick = () => { if (!owned && prerequisitesMet) unlockTech(tech.id); };
                        
                        const costClass = canAfford ? 'affordable' : '';
                        
                        card.innerHTML = `
                            <div class="tech-icon"><i class="${tech.icon}"></i></div>
                            <div class="tech-name">${tech.name}</div>
                            <div class="tech-desc">${tech.desc}</div>
                            ${!owned ? `<div class="tech-cost ${costClass}"><i class="fa-solid fa-flask"></i> ${fmt(tech.cost)} RP</div>` : '<div class="tech-cost"><i class="fa-solid fa-check"></i> Owned</div>'}
                            ${!prerequisitesMet && tech.requires.length > 0 ? `<div class="tech-req">Requires: ${tech.requires.map(r => TECH_TREE.find(t => t.id === r)?.name).join(', ')}</div>` : ''}
                        `;
                        
                        tierCol.appendChild(card);
                    });
                }
                
                grid.appendChild(tierCol);
            }
            
            setTimeout(() => drawResearchLines(), 100);
        }
        
        function drawResearchLines() {
            const svg = document.getElementById('researchTreeSvg');
            svg.innerHTML = '';
            
            const containerRect = document.getElementById('researchTreeContainer').getBoundingClientRect();
            
            TECH_TREE.forEach(tech => {
                if (tech.requires && tech.requires.length > 0) {
                    const targetEl = document.getElementById(`tech-${tech.id}`);
                    if (!targetEl) return;
                    
                    const targetRect = targetEl.getBoundingClientRect();
                    const targetX = targetRect.left - containerRect.left + targetRect.width / 2;
                    const targetY = targetRect.top - containerRect.top;
                    
                    tech.requires.forEach(reqId => {
                        const sourceEl = document.getElementById(`tech-${reqId}`);
                        if (!sourceEl) return;
                        
                        const sourceRect = sourceEl.getBoundingClientRect();
                        const sourceX = sourceRect.left - containerRect.left + sourceRect.width / 2;
                        const sourceY = sourceRect.top - containerRect.top + sourceRect.height;
                        
                        const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        const isUnlocked = game.unlocked.includes(tech.id) && game.unlocked.includes(reqId);
                        line.className = `research-tree-line ${isUnlocked ? 'unlocked' : ''}`;
                        
                        const d = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
                        line.setAttribute('d', d);
                        
                        svg.appendChild(line);
                    });
                }
            });
        }

        let currTab = 'infra';

        function setTab(t, el) {
            currTab = t;
            document.querySelectorAll('.tab').forEach(e => e.classList.remove('active'));
            if (el) el.classList.add('active');
            else document.querySelector(`.tab[data-tab="${t}"]`)?.classList.add('active');
            
            const tray = document.getElementById('tray');
            tray.innerHTML = '';
            
            Object.keys(NODE_DEFS).forEach(k => {
                const def = NODE_DEFS[k];
                if (currTab === 'infra' && def.type !== 'infra' && def.type !== 'core') return;
                if (currTab === 'download' && def.type !== 'download') return;
                if (currTab === 'upload' && def.type !== 'upload' && def.type !== 'lab' && def.type !== 'special') return;
                if (currTab === 'advanced' && def.type !== 'advanced') return;
                if (currTab === 'coding' && def.type !== 'coding') return;
                if (def.type === 'core') return;

                const el = document.createElement('div');
                el.className = 'shop-item';
                
                const locked = def.req && !game.unlocked.includes(def.req);
                if (locked) el.classList.add('disabled');
                
                el.onclick = () => { if (!locked) buyNode(k); };
                el.innerHTML = `
                    <div class="item-cost">$${fmt(def.cost)}</div>
                    <div class="item-icon"><i class="${def.icon}" style="color:${def.color}"></i></div>
                    <div class="item-name">${def.name}</div>
                    <div class="item-desc">${locked ? "LOCKED (Research)" : def.desc}</div>
                `;
                tray.appendChild(el);
            });
        }

        let drag = { active: false, node: null, startX: 0, startY: 0, offX: 0, offY: 0 };
        let port = { active: false, src: null };
        let selNodeId = null;

        function setupInputs() {
            const vp = document.getElementById('viewport');
            
            vp.onmousedown = (e) => {
                if (e.target.closest('.node')) return;
                drag.active = true;
                drag.startX = e.clientX; drag.startY = e.clientY;
                drag.offX = view.x; drag.offY = view.y;
                document.getElementById('contextMenu').style.display = 'none';
            };
            
            window.onmousemove = (e) => {
                if (drag.active) {
                    view.x = drag.offX + (e.clientX - drag.startX);
                    view.y = drag.offY + (e.clientY - drag.startY);
                    updateWorldTransform();
                }
                if (drag.node) {
                    const z = view.scale;
                    drag.node.x = drag.node.ix + (e.clientX - drag.sx)/z;
                    drag.node.y = drag.node.iy + (e.clientY - drag.sy)/z;
                    
                    const el = document.getElementById(`node-${drag.node.id}`);
                    if (el) { 
                        el.style.left = drag.node.x+'px'; 
                        el.style.top = drag.node.y+'px'; 
                    }
                    // Use efficient cable update instead of full re-render
                    requestCableUpdate();
                }
            };
            
            // Separate world transform update for panning
            function updateWorldTransform() {
                const world = document.getElementById('world');
                world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
            }
            
            window.onmouseup = () => { drag.active = false; drag.node = null; };
            
            vp.onwheel = (e) => {
                e.preventDefault();
                
                const rect = vp.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                const worldX = (mouseX - view.x) / view.scale;
                const worldY = (mouseY - view.y) / view.scale;
                
                const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
                const newScale = Math.max(0.3, Math.min(2, view.scale * zoomFactor));
                
                view.x = mouseX - worldX * newScale;
                view.y = mouseY - worldY * newScale;
                view.scale = newScale;
                
                updateZoomDisplay();
            };
            
            window.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT') return;
                if (e.key === '+' || e.key === '=') zoomIn();
                else if (e.key === '-' || e.key === '_') zoomOut();
                else if (e.key === '0') resetZoom();
                else if (e.key === '?' || e.key === '/') document.getElementById('helpModal').style.display='flex';
                else if (e.key === 'r' || e.key === 'R') document.getElementById('researchModal').style.display='flex';
                else if (e.key === 'c' || e.key === 'C') document.getElementById('codeModal').style.display='flex';
                else if (e.key === 'a' || e.key === 'A') document.getElementById('achievementsModal').style.display='flex';
                else if (e.key === 'x' || e.key === 'X') toggleCableDeleteMode();
                else if (e.key === 's' || e.key === 'S') document.getElementById('statsModal').style.display='flex';
                else if (e.key === 'p' || e.key === 'P') document.getElementById('prestigeModal').style.display='flex';
                else if (e.key === 'l' || e.key === 'L') document.getElementById('accountModal').style.display='flex';
                else if (e.key === 'Escape') {
                    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
                }
            });
            
            window.addEventListener('resize', () => drawResearchLines());
        }
        
        function dragStart(node, e) {
            drag.node = node;
            drag.sx = e.clientX; drag.sy = e.clientY;
            drag.node.ix = node.x; drag.node.iy = node.y;
            
            selNodeId = node.id;
            document.querySelectorAll('.node').forEach(n => n.classList.remove('selected'));
            document.getElementById(`node-${node.id}`).classList.add('selected');
        }
        
        function portDown(id, e) {
            e.stopPropagation();
            port.active = true; port.src = id;
        }
        
        function portUp(id) {
            if (port.active && port.src !== id) {
                const cableCost = 10;
                if (game.money < cableCost) {
                    showFloat("Need $10", window.innerWidth/2, window.innerHeight/2, 'red');
                    port.active = false; return;
                }
                if (!game.conns.some(c => (c.from===port.src && c.to===id) || (c.from===id && c.to===port.src))) {
                    game.money -= cableCost;
                    game.stats.moneySpent += cableCost;
                    game.conns.push({ from: port.src, to: id });
                    game.stats.cablesPlaced++;
                    renderCables();
                    updateConnectivity();
                    checkAchievements();
                    addCombo();
                }
            }
            port.active = false;
        }

        function showContext(node, e) {
            const m = document.getElementById('contextMenu');
            selNodeId = node.id;
            m.style.left = e.clientX + 'px'; m.style.top = e.clientY + 'px';
            m.style.display = 'block';
            const base = node.type === 'router' ? 500 : NODE_DEFS[node.type].cost;
            const cost = Math.floor(base * Math.pow(1.5, node.level));
            document.getElementById('ctxCost').innerText = '$' + fmt(cost);
        }

        function workAnim(node) {
            const el = document.getElementById(`node-${node.id}`);
            if (el) { el.classList.remove('working'); void el.offsetWidth; el.classList.add('working'); }
        }
        
        function showFloat(txt, x, y, col) {
            const el = document.createElement('div');
            el.className = 'floating-text'; el.innerText = txt;
            el.style.left = x+'px'; el.style.top = y+'px'; el.style.color = col;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1000);
        }
        
        function addMoney(e) {
            game.money += 5;
            showFloat('+$5', e.clientX, e.clientY, '#10b981');
        }
        
        function upgradeRouter() {
             const r = game.nodes.find(n => n.type === 'router');
             if(r) { selNodeId = r.id; upgradeSelectedNode(); }
        }

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
        
        // Generate a simple checksum for save validation
        function generateSaveChecksum(gameData) {
            const str = JSON.stringify(gameData);
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
            
            // Fix NaN values
            if (isNaN(repaired.money) || repaired.money < 0) repaired.money = 2000;
            if (isNaN(repaired.rp) || repaired.rp < 0) repaired.rp = 0;
            if (isNaN(repaired.codeBits) || repaired.codeBits < 0) repaired.codeBits = 0;
            if (isNaN(repaired.optimizationCode) || repaired.optimizationCode < 0) repaired.optimizationCode = 0;
            if (isNaN(repaired.routerHeat)) repaired.routerHeat = 0;
            if (typeof repaired.overheatMode !== 'boolean') repaired.overheatMode = false;
            if (isNaN(repaired.overclockMult)) repaired.overclockMult = 1.0;
            if (isNaN(repaired.coolingPower)) repaired.coolingPower = 0;
            if (isNaN(repaired.overclockHeatGen)) repaired.overclockHeatGen = 0;
            
            // Fix arrays
            if (!Array.isArray(repaired.nodes)) repaired.nodes = [];
            if (!Array.isArray(repaired.conns)) repaired.conns = [];
            if (!Array.isArray(repaired.unlocked)) repaired.unlocked = [];
            if (!Array.isArray(repaired.achievements)) repaired.achievements = [];
            
            // Fix nodes
            repaired.nodes = repaired.nodes.filter(n => n && n.id && n.type);
            repaired.nodes.forEach(n => {
                if (typeof n.level !== 'number' || isNaN(n.level)) n.level = 1;
                if (typeof n.infected !== 'boolean') n.infected = false;
                if (isNaN(n.x)) n.x = 2500;
                if (isNaN(n.y)) n.y = 2500;
            });
            
            // Fix connections - remove any that reference non-existent nodes
            const nodeIds = new Set(repaired.nodes.map(n => n.id));
            repaired.conns = repaired.conns.filter(c => 
                c && nodeIds.has(c.from) && nodeIds.has(c.to)
            );
            
            // Fix stats
            if (!repaired.stats) repaired.stats = {};
            const s = repaired.stats;
            if (isNaN(s.totalMoney)) s.totalMoney = repaired.money;
            if (isNaN(s.peakMoney)) s.peakMoney = repaired.money;
            if (isNaN(s.nodesCreated)) s.nodesCreated = repaired.nodes.length;
            if (isNaN(s.cablesPlaced)) s.cablesPlaced = repaired.conns.length;

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
                    game.routerLevel = Number(repairedGame.routerLevel) || 1;
                    game.routerHeat = Number(repairedGame.routerHeat) || 0;
                    game.overheatMode = Boolean(repairedGame.overheatMode);
                    game.nextId = Number(repairedGame.nextId) || 1;
                    game.playerName = repairedGame.playerName || '';
                    game.saveCreated = repairedGame.saveCreated || Date.now();
                    
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
                showFloat('âœ… Logged In!', window.innerWidth/2, window.innerHeight/2, '#10b981');
                
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
                showFloat('ðŸ‘‹ Logged Out', window.innerWidth/2, window.innerHeight/2, '#64748b');
                
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

        // ==================== DAILY REWARDS SYSTEM ====================
        function checkDailyReward() {
            const now = new Date();
            const today = now.toDateString();
            const lastLogin = game.lastLoginDate;
            
            // First time login
            if (!lastLogin) {
                game.lastLoginDate = today;
                game.loginStreak = 1;
                game.dailyRewardClaimed = false;
                showDailyRewardModal();
                return;
            }
            
            const lastDate = new Date(lastLogin);
            const diffTime = now - lastDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (lastLogin !== today) {
                if (diffDays === 1) {
                    // Consecutive day
                    game.loginStreak = (game.loginStreak || 0) + 1;
                    if (game.loginStreak > 7) game.loginStreak = 1; // Reset after 7 days
                } else {
                    // Streak broken
                    game.loginStreak = 1;
                }
                game.lastLoginDate = today;
                game.dailyRewardClaimed = false;
                showDailyRewardModal();
            }
            
            updateSidebarStreak();
        }
        
        function showDailyRewardModal() {
            updateDailyRewardsUI();
            document.getElementById('dailyRewardModal').style.display = 'flex';
        }
        
        function updateDailyRewardsUI() {
            const grid = document.getElementById('dailyRewardsGrid');
            const currentStreak = game.loginStreak || 1;
            const claimed = game.dailyRewardClaimed;
            
            document.getElementById('streakDisplay').innerText = currentStreak;
            
            const claimBtn = document.getElementById('claimDailyBtn');
            const statusText = document.getElementById('dailyRewardStatus');
            
            if (claimed) {
                claimBtn.disabled = true;
                claimBtn.innerHTML = '<i class="fa-solid fa-check"></i> Already Claimed';
                claimBtn.style.opacity = '0.5';
                statusText.innerText = 'Come back tomorrow for your next reward!';
            } else {
                claimBtn.disabled = false;
                claimBtn.innerHTML = '<i class="fa-solid fa-gift"></i> Claim Today\'s Reward';
                claimBtn.style.opacity = '1';
                statusText.innerText = `Day ${currentStreak} reward ready!`;
            }
            
            grid.innerHTML = DAILY_REWARDS.map((reward, index) => {
                const day = index + 1;
                const isCurrent = day === currentStreak;
                const isPast = day < currentStreak;
                const isClaimed = isCurrent && claimed;
                
                let style = 'background: rgba(30, 40, 55, 0.5); border: 1px solid var(--border-color);';
                let iconClass = 'fa-solid fa-cube';
                
                if (isPast || isClaimed) {
                    style = 'background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; opacity: 0.6;';
                    iconClass = 'fa-solid fa-circle-check';
                } else if (isCurrent) {
                    style = 'background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2)); border: 2px solid #fbbf24; box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);';
                    iconClass = 'fa-solid fa-gift';
                }
                
                return `
                    <div style="${style} border-radius: 8px; padding: 10px; text-align: center;">
                        <div style="font-size: 20px; margin-bottom: 5px;"><i class="${iconClass}"></i></div>
                        <div style="font-size: 10px; color: var(--text-muted);">Day ${day}</div>
                        <div style="font-size: 11px; color: #fbbf24; font-weight: bold;">$${fmt(reward.money)}</div>
                    </div>
                `;
            }).join('');
        }
        
        function claimDailyReward() {
            if (game.dailyRewardClaimed) return;
            
            const streak = game.loginStreak || 1;
            const reward = DAILY_REWARDS[Math.min(streak - 1, DAILY_REWARDS.length - 1)];
            
            game.money += reward.money;
            game.rp += reward.rp;
            if (reward.codeBits) game.codeBits += reward.codeBits;
            
            game.dailyRewardClaimed = true;
            game.stats.totalMoney += reward.money;
            
            updateDailyRewardsUI();
            updateSidebarStreak();
            updateUI();
            
            showFloat('+$' + fmt(reward.money) + ' Daily Reward!', window.innerWidth/2, window.innerHeight/2, '#fbbf24');
            logEvent(`Claimed Day ${streak} daily reward!`, 'good');
            
            // Auto save after claiming
            if (game.autoSaveEnabled) autoSaveLocal();
        }
        
        function updateSidebarStreak() {
            const streakEl = document.getElementById('sidebarStreak');
            if (streakEl) streakEl.innerText = game.loginStreak || 0;
            
            const statusEl = document.getElementById('dailyRewardStatus');
            if (statusEl) {
                if (game.dailyRewardClaimed) {
                    statusEl.innerText = 'Claimed today';
                    statusEl.style.color = '#10b981';
                } else {
                    statusEl.innerText = 'ðŸŽ Reward available!';
                    statusEl.style.color = '#fbbf24';
                }
            }
        }

        // ==================== OFFLINE EARNINGS SYSTEM ====================
        function checkOfflineEarnings() {
            if (!game.offlineEarningsEnabled) return;
            
            const now = Date.now();
            const lastSave = game.lastSaveTime || now;
            const timeAway = now - lastSave;

            // Only show if away for more than 5 minutes
            if (timeAway < 5 * 60 * 1000) return;
            
            // Calculate max 12 hours of offline earnings
            const maxOfflineTime = 12 * 60 * 60 * 1000; // 12 hours
            const effectiveTime = Math.min(timeAway, maxOfflineTime);
            const hoursAway = effectiveTime / (1000 * 60 * 60);
            
            // Calculate earnings based on current income rates
            const moneyPerSecond = history.money || 10;
            const rpPerSecond = history.rp || 0.5;
            
            // Offline earnings are 50% of normal rate
            const offlineMoney = moneyPerSecond * hoursAway * 3600 * 0.5;
            const offlineRP = rpPerSecond * hoursAway * 3600 * 0.5;
            
            if (offlineMoney > 100) {
                game.money += offlineMoney;
                game.rp += offlineRP;
                game.stats.totalMoney += offlineMoney;
                // Prevent double-claim: update lastSaveTime so refresh within 60s doesn't grant again
                game.lastSaveTime = Date.now();
                if (game.autoSaveEnabled) autoSaveLocal();

                // Format time display
                let timeText;
                if (hoursAway < 1) {
                    timeText = Math.floor(hoursAway * 60) + ' minutes';
                } else if (hoursAway < 24) {
                    timeText = Math.floor(hoursAway * 10) / 10 + ' hours';
                } else {
                    timeText = Math.floor(hoursAway / 24 * 10) / 10 + ' days';
                }
                
                document.getElementById('offlineTime').innerText = timeText;
                document.getElementById('offlineMoney').innerText = '$' + fmt(offlineMoney);
                document.getElementById('offlineRP').innerText = fmt(offlineRP);
                document.getElementById('offlineEarningsModal').style.display = 'flex';
                
                logEvent(`Offline earnings: $${fmt(offlineMoney)}`, 'good');
            }
        }

        // ==================== AUTO-SAVE SYSTEM ====================
        let autoSaveInterval = null;
        
        function startAutoSave() {
            if (autoSaveInterval) clearInterval(autoSaveInterval);
            
            autoSaveInterval = setInterval(() => {
                if (game.autoSaveEnabled) {
                    autoSaveLocal();
                }
            }, 60000); // Auto-save every minute
        }
        
        function autoSaveLocal() {
            try {
                game.lastSaveTime = Date.now();
                game.saveVersion = GAME_VERSION;
                
                // Create a copy of game state for saving
                const gameCopy = JSON.parse(JSON.stringify(game));
                
                const saveData = {
                    game: gameCopy,
                    version: GAME_VERSION,
                    timestamp: Date.now(),
                    checksum: generateSaveChecksum(gameCopy)
                };
                localStorage.setItem('uploadLabsSave', JSON.stringify(saveData));
                console.log('Auto-saved to localStorage');
            } catch (e) {
                console.error('Auto-save failed:', e);
            }
        }
        
        function loadLocalSave() {
            try {
                const saveData = localStorage.getItem('uploadLabsSave');
                if (saveData) {
                    const parsed = JSON.parse(saveData);
                    if (parsed.game) {
                        // Validate and repair the save data
                        const validation = validateSaveData(parsed);
                        if (!validation.valid) {
                            console.warn('Local save has issues, repairing:', validation.errors);
                        }
                        
                        // Repair corrupted data
                        const repairedGame = repairSaveData(parsed.game);
                        
                        // Merge saved game into current game state
                        Object.assign(game, repairedGame);
                        
                        // Ensure new fields exist
                        if (!game.milestonesCompleted) game.milestonesCompleted = [];
                        if (!game.lastLoginDate) game.lastLoginDate = null;
                        if (!game.loginStreak) game.loginStreak = 0;
                        if (!game.dailyRewardClaimed) game.dailyRewardClaimed = false;
                        if (!game.playerName) game.playerName = '';
                        if (!game.saveCreated) game.saveCreated = Date.now();
                        if (!game.saveVersion) game.saveVersion = GAME_VERSION;
                        
                        // Rebuild active nodes from the loaded nodes
                        // This is critical - activeNodes must be populated for game loop to work
                        activeNodes.clear();
                        updateConnectivity();
                        
                        // Double-check that at least the router is active
                        const router = game.nodes.find(n => n.type === 'router');
                        if (router && !activeNodes.has(router.id)) {
                            console.warn('Router not active after load, forcing activation');
                            activeNodes.add(router.id);
                        }
                        
                        logEvent('Local save loaded', 'good');
                        return true;
                    }
                }
            } catch (e) {
                console.error('Local save load failed:', e);
                // If local save is corrupted, clear it
                localStorage.removeItem('uploadLabsSave');
                logEvent('Save corrupted, starting fresh', 'warning');
            }
            return false;
        }
        
        // ==================== MILESTONES SYSTEM ====================
        function checkMilestones() {
            MILESTONES.forEach(milestone => {
                if (!game.milestonesCompleted.includes(milestone.id)) {
                    if (milestone.check()) {
                        completeMilestone(milestone);
                    }
                }
            });
        }
        
        function completeMilestone(milestone) {
            game.milestonesCompleted.push(milestone.id);
            
            // Give rewards
            if (milestone.reward.money) {
                game.money += milestone.reward.money;
                game.stats.totalMoney += milestone.reward.money;
            }
            if (milestone.reward.rp) {
                game.rp += milestone.reward.rp;
            }
            
            // Show notification
            showFloat(`ðŸ† Milestone: ${milestone.name}!`, window.innerWidth/2, window.innerHeight/2, '#fbbf24');
            logEvent(`Milestone completed: ${milestone.name}!`, 'good');
            
            updateUI();
        }

        // ==================== ENHANCED NOTIFICATIONS ====================
        function showNotification(title, message, type = 'info', duration = 4000) {
            if (!game.notificationsEnabled) return;
            
            const notif = document.createElement('div');
            notif.style.cssText = `
                position: fixed;
                top: ${80 + document.querySelectorAll('.game-notification').length * 70}px;
                right: 20px;
                background: ${type === 'good' ? 'rgba(16, 185, 129, 0.95)' : type === 'bad' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(59, 130, 246, 0.95)'};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                z-index: 5000;
                max-width: 300px;
                animation: slideIn 0.3s ease;
                border-left: 4px solid rgba(255,255,255,0.5);
            `;
            notif.className = 'game-notification';
            notif.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 4px;">${title}</div>
                <div style="font-size: 12px; opacity: 0.9;">${message}</div>
            `;
            
            document.body.appendChild(notif);
            
            setTimeout(() => {
                notif.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notif.remove(), 300);
            }, duration);
        }

        // Initialize all systems
        // Enhanced Emergency Recovery - Fixes critical game state issues
        function emergencyRecover() {
            console.log('%c Running Emergency Recovery... ', 'background: #ef4444; color: white; font-size: 14px; font-weight: bold; padding: 5px 10px; border-radius: 4px;');
            
            let fixesApplied = [];
            
            // Fix 1: NaN values
            if (isNaN(game.money) || game.money === null || game.money === undefined) {
                game.money = 2000;
                fixesApplied.push('Fixed NaN money');
            }
            if (isNaN(game.rp) || game.rp === null || game.rp === undefined) {
                game.rp = 0;
                fixesApplied.push('Fixed NaN RP');
            }
            if (isNaN(game.codeBits) || game.codeBits === null || game.codeBits === undefined) {
                game.codeBits = 0;
                fixesApplied.push('Fixed NaN codeBits');
            }
            if (isNaN(game.optimizationCode) || game.optimizationCode === null) {
                game.optimizationCode = 0;
                fixesApplied.push('Fixed NaN optimizationCode');
            }
            if (isNaN(game.routerHeat) || game.routerHeat === null) {
                game.routerHeat = 0;
                fixesApplied.push('Fixed NaN routerHeat');
            }
            if (isNaN(game.overclockMult) || game.overclockMult === null) {
                game.overclockMult = 1.0;
                fixesApplied.push('Fixed NaN overclockMult');
            }
            if (isNaN(game.coolingPower) || game.coolingPower === null) {
                game.coolingPower = 0;
                fixesApplied.push('Fixed NaN coolingPower');
            }
            if (isNaN(game.overclockHeatGen) || game.overclockHeatGen === null) {
                game.overclockHeatGen = 0;
                fixesApplied.push('Fixed NaN overclockHeatGen');
            }
            if (typeof game.overheatMode !== 'boolean') {
                game.overheatMode = false;
                fixesApplied.push('Fixed invalid overheatMode');
            }
            if (isNaN(game.routerLevel) || game.routerLevel === null || game.routerLevel < 1) {
                game.routerLevel = 1;
                fixesApplied.push('Fixed invalid routerLevel');
            }
            if (isNaN(game.nextId) || game.nextId === null || game.nextId < 1) {
                game.nextId = 1;
                fixesApplied.push('Fixed invalid nextId');
            }
            
            // Fix 2: Ensure arrays exist
            if (!Array.isArray(game.nodes)) {
                game.nodes = [];
                fixesApplied.push('Reset nodes array');
            }
            if (!Array.isArray(game.conns)) {
                game.conns = [];
                fixesApplied.push('Reset conns array');
            }
            if (!Array.isArray(game.unlocked)) {
                game.unlocked = [];
                fixesApplied.push('Reset unlocked array');
            }
            if (!Array.isArray(game.achievements)) {
                game.achievements = [];
                fixesApplied.push('Reset achievements array');
            }
            
            // Fix 3: Fix corrupted node data
            game.nodes.forEach((node, index) => {
                if (!node || typeof node !== 'object') {
                    game.nodes.splice(index, 1);
                    fixesApplied.push(`Removed corrupted node at index ${index}`);
                    return;
                }
                if (isNaN(node.id) || node.id === undefined) node.id = game.nextId++;
                if (!node.type) node.type = 'router';
                if (isNaN(node.x)) node.x = 2500;
                if (isNaN(node.y)) node.y = 2500;
                if (isNaN(node.level) || node.level < 1) node.level = 1;
                if (typeof node.infected !== 'boolean') node.infected = false;
            });
            
            // Fix 4: Fix corrupted connections
            const validNodeIds = new Set(game.nodes.map(n => n.id));
            const invalidConns = game.conns.filter(c => !validNodeIds.has(c.from) || !validNodeIds.has(c.to));
            if (invalidConns.length > 0) {
                game.conns = game.conns.filter(c => validNodeIds.has(c.from) && validNodeIds.has(c.to));
                fixesApplied.push(`Removed ${invalidConns.length} invalid connections`);
            }
            
            // Fix 5: Ensure there's at least a router
            const router = game.nodes.find(n => n.type === 'router');
            if (!router) {
                console.log('No router found, spawning one...');
                game.nodes.push({ 
                    id: game.nextId++, 
                    type: 'router', 
                    x: 2500, 
                    y: 2500, 
                    level: Math.max(1, game.routerLevel), 
                    infected: false 
                });
                fixesApplied.push('Spawned new router');
            }
            
            // Fix 6: Reset active nodes
            activeNodes.clear();
            cableCache.clear(); // Clear cable cache
            
            // Fix 7: Rebuild connectivity
            updateConnectivity();
            
            // Fix 8: Force router to be active
            const routerNow = game.nodes.find(n => n.type === 'router');
            if (routerNow) {
                activeNodes.add(routerNow.id);
                game.routerLevel = routerNow.level;
            }
            
            // Fix 9: Reset view if it's way off
            if (Math.abs(view.x) > 10000 || Math.abs(view.y) > 10000) {
                view.x = window.innerWidth/2 - 2500;
                view.y = window.innerHeight/2 - 2500;
                view.scale = 1;
                fixesApplied.push('Reset view position');
            }
            
            // Fix 10: Reset combo if stuck
            combo.count = 0;
            combo.timer = 0;
            
            // Fix 11: Reset rate tracking history (fixes money display stuck at 0)
            if (!Array.isArray(rateTracking.money.history)) rateTracking.money.history = [];
            if (!Array.isArray(rateTracking.rp.history)) rateTracking.rp.history = [];
            rateTracking.money.history = rateTracking.money.history.filter(n => isFinite(n) && n >= 0);
            rateTracking.rp.history = rateTracking.rp.history.filter(n => isFinite(n) && n >= 0);
            if (rateTracking.money.history.length === 0) {
                rateTracking.money.history = [10, 10, 10, 10, 10]; // Seed with default values
                fixesApplied.push('Reset money rate tracking');
            }
            
            // Fix 12: Clear any stuck modals
            document.querySelectorAll('.modal-overlay').forEach(m => {
                if (m.id !== 'welcomeModal') m.style.display = 'none';
            });
            
            // Re-render everything
            renderWorld();
            renderCables();
            updateUI();
            updateZoomDisplay();
            
            console.log('%c Recovery Complete! ', 'background: #10b981; color: white; font-size: 14px; font-weight: bold; padding: 5px 10px; border-radius: 4px;');
            console.log('Fixes applied:', fixesApplied);
            
            logEvent(`Emergency recovery: ${fixesApplied.length} fixes applied`, 'good');
            showFloat(`Recovery Complete: ${fixesApplied.length} fixes`, window.innerWidth/2, window.innerHeight/2, '#10b981');
            
            return fixesApplied;
        }
        
        // Check game health periodically
        let healthCheckSkips = 2; // Skip first 2 checks to allow game to initialize
        function checkGameHealth() {
            if (healthCheckSkips > 0) {
                healthCheckSkips--;
                return;
            }
            
            // Check for stuck game (no generation)
            if (game.nodes.length > 0 && activeNodes.size === 0) {
                console.warn('Game health check: No active nodes but nodes exist');
                // Try updateConnectivity first before full recovery
                updateConnectivity();
                if (activeNodes.size === 0) {
                    emergencyRecover();
                }
            }
            
            // Check for NaN values
            if (isNaN(game.money) || isNaN(game.rp)) {
                console.warn('Game health check: NaN values detected');
                emergencyRecover();
            }
        }
        
        function initGameSystems() {
            // Load local save first
            loadLocalSave();
            
            // Check daily rewards
            checkDailyReward();
            
            // Check offline earnings (after a short delay to let game initialize)
            setTimeout(checkOfflineEarnings, 2000);
            
            // Start auto-save
            startAutoSave();
            
            // Update settings UI
            document.getElementById('autoSaveToggle').checked = game.autoSaveEnabled !== false;
            document.getElementById('offlineEarningsToggle').checked = game.offlineEarningsEnabled !== false;
            document.getElementById('notificationsToggle').checked = game.notificationsEnabled !== false;
            
            // Check milestones periodically
            setInterval(checkMilestones, 5000);
            
            // Health check every 10 seconds
            setInterval(checkGameHealth, 10000);
        }

        // Initialize Firebase when page loads
        document.addEventListener('DOMContentLoaded', initFirebase);

        // Initialize game systems
        initGameSystems();

        init();
        renderResearchTree();
        renderDriverGrid();
        setTab('infra');
        
