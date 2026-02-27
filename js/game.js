fixconst GAME_VERSION = "14.1";

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
            // Early game milestones
            { id: 'first_node', name: 'First Steps', desc: 'Place your first node', check: () => game.stats.nodesCreated >= 1, reward: { money: 100 } },
            { id: 'first_cable', name: 'Connected', desc: 'Place your first cable', check: () => game.conns.length >= 1, reward: { money: 50 } },
            { id: 'first_download', name: 'Data Collector', desc: 'Place a downloader node', check: () => game.nodes.some(n => n.type.startsWith('dl_')), reward: { money: 200 } },
            { id: 'first_upload', name: 'Data Seller', desc: 'Place an uploader node', check: () => game.nodes.some(n => n.type === 'uploader'), reward: { money: 300 } },
            
            // Mid game milestones
            { id: 'network_builder', name: 'Network Builder', desc: 'Have 10 nodes at once', check: () => game.nodes.length >= 10, reward: { money: 1000 } },
            { id: 'connected_25', name: 'Fully Connected', desc: 'Have 25 cables at once', check: () => game.conns.length >= 25, reward: { money: 2500 } },
            { id: 'first_tech', name: 'Researcher', desc: 'Unlock your first technology', check: () => game.unlocked.length >= 1, reward: { rp: 200 } },
            { id: 'first_contract', name: 'Contractor', desc: 'Complete your first contract', check: () => game.stats.contractsCompleted >= 1, reward: { money: 1000 } },
            
            // Late game milestones
            { id: 'data_empire', name: 'Data Empire', desc: 'Have 50 nodes at once', check: () => game.nodes.length >= 50, reward: { money: 10000, rp: 500 } },
            { id: 'first_million', name: 'First Million', desc: 'Earn $1,000,000 total', check: () => game.stats.totalMoney >= 1000000, reward: { money: 100000 } },
            { id: 'tech_master', name: 'Tech Master', desc: 'Unlock 10 technologies', check: () => game.unlocked.length >= 10, reward: { rp: 1000 } },
            { id: 'coder', name: 'Programmer', desc: 'Generate your first code bits', check: () => (game.codeBits || 0) > 0 || (game.stats.totalCodeBits || 0) > 0, reward: { money: 500 } },
            
            // Endgame milestones
            { id: 'mega_network', name: 'Mega Network', desc: 'Have 100 nodes at once', check: () => game.nodes.length >= 100, reward: { money: 50000, rp: 5000 } },
            { id: 'all_tech', name: 'Omniscient', desc: 'Unlock all technologies', check: () => game.unlocked.length >= TECH_TREE.length, reward: { money: 500000, rp: 50000 } },
            { id: 'first_prestige', name: 'Migration', desc: 'Prestige for the first time', check: () => (game.prestigeLevel || 0) >= 1, reward: { money: 100000 } },
        ];
        
        // Flow Tier Names: T1=Source, T2=Bridge, T3=Process, T4=Hub
        const FLOW_TIER_NAMES = { 1: 'Source', 2: 'Bridge', 3: 'Process', 4: 'Hub' };
        const FLOW_TIER_ICONS = { 1: 'fa-solid fa-download', 2: 'fa-solid fa-right-left', 3: 'fa-solid fa-microchip', 4: 'fa-solid fa-globe' };

        const NODE_DEFS = {
            router: { name: "Network Router", type: "core", cost: 0, icon: "fa-solid fa-globe", color: "#3b82f6", desc: "Network Core. Required for connectivity.", bandwidth: 1000, ports: ['in', 'out'], flowLevel: 4 },

            // Infra - Early game utility
            miner: { name: "Crypto Miner", type: "infra", cost: 500, icon: "fa-brands fa-bitcoin", color: "#fbbf24", desc: "Uses bandwidth to mine money. Slow but steady income.", bandwidth: 200, ports: ['out'], flowLevel: 1 },
            cache: { name: "Cache Server", type: "infra", cost: 3000, icon: "fa-solid fa-database", color: "#10b981", desc: "Buffers data. Connected downloaders work 50% faster.", bandwidth: 400, ports: ['in', 'out'], flowLevel: 2 },
            firewall: { name: "Firewall", type: "infra", cost: 2000, icon: "fa-solid fa-shield-halved", color: "#ef4444", desc: "Prevents virus infection for self and neighbors.", req: "tech_sec", bandwidth: 300, ports: ['in', 'out'], flowLevel: 2 },
            balancer: { name: "Load Balancer", type: "infra", cost: 5500, icon: "fa-solid fa-scale-balanced", color: "#06b6d4", desc: "Distributes data evenly. Boosts connected nodes by 10% per connection. Redistributes excess bandwidth.", req: "tech_balance", bandwidth: 600, ports: ['in', 'out'], flowLevel: 2 },
            overclock: { name: "Overclock Unit", type: "infra", cost: 8000, icon: "fa-solid fa-bolt", color: "#f59e0b", desc: "Connect to Router to DOUBLE speed. Generates significant heat!", req: "tech_oc", bandwidth: 500, ports: ['in', 'out'], flowLevel: 2 },
            cryo_cooler: { name: "Cryo Cooler", type: "infra", cost: 500000, icon: "fa-solid fa-snowflake", color: "#22d3ee", desc: "Advanced cooling system. Reduces router heat by 20/sec per level. End-game unlock.", req: "tech_cryo", bandwidth: 400, ports: ['in', 'out'], flowLevel: 2 },

            // Downloaders - Tiered progression
            dl_file: { name: "File Downloader", type: "download", out: "files", cost: 250, icon: "fa-solid fa-file-code", color: "#60a5fa", desc: "Downloads small files. Basic data collection.", bandwidth: 300, ports: ['out'], flowLevel: 1 },
            dl_img: { name: "Image Downloader", type: "download", out: "images", cost: 2200, icon: "fa-solid fa-image", color: "#c084fc", desc: "Downloads images. Higher value than files.", req: "tech_img", bandwidth: 400, ports: ['out'], flowLevel: 1 },
            dl_audio: { name: "Audio Downloader", type: "download", out: "audio", cost: 7500, icon: "fa-solid fa-music", color: "#f472b6", desc: "Downloads audio files. Medium tier resource.", req: "tech_audio", bandwidth: 500, ports: ['out'], flowLevel: 1 },
            dl_vid: { name: "Video Downloader", type: "download", out: "videos", cost: 18000, icon: "fa-solid fa-film", color: "#f472b6", desc: "Downloads videos. Highest value resource.", req: "tech_vid", bandwidth: 600, ports: ['out'], flowLevel: 1 },

            // Upload & Labs - Money and RP generation
            uploader: { name: "Uploader", type: "upload", cost: 500, icon: "fa-solid fa-cloud-arrow-up", color: "#2dd4bf", desc: "Sells data for Money. Essential for income.", bandwidth: 400, ports: ['in'], flowLevel: 3 },
            lab: { name: "Research Lab", type: "lab", cost: 4500, icon: "fa-solid fa-flask", color: "#8b5cf6", desc: "Converts Files into Research Points (RP).", bandwidth: 400, ports: ['in'], flowLevel: 3 },
            rack: { name: "Server Rack", type: "special", cost: 18000, icon: "fa-solid fa-server", color: "#f97316", desc: "High density server. Acts as both Downloader AND Uploader.", req: "tech_rack", bandwidth: 800, size: [2, 1], ports: ['in', 'in', 'out', 'out'], flowLevel: 3 },
            quantum: { name: "Quantum Core", type: "special", cost: 150000, icon: "fa-solid fa-atom", color: "#ef4444", desc: "Endgame technology. 2.5x Global Speed multiplier.", req: "tech_quantum", bandwidth: 2000, size: [2, 1], ports: ['in', 'in', 'out', 'out'], flowLevel: 3 },
            master_router: { name: "Master Router", type: "special", cost: 250000, icon: "fa-solid fa-network-wired", color: "#3b82f6", desc: "Double-click to open a private sub-network. Great for organization.", req: "tech_cluster", bandwidth: 2000, size: [2, 1], ports: ['in', 'in', 'out', 'out'], flowLevel: 4 },
            subnet_core: { name: "Subnet Core", type: "core", cost: 0, icon: "fa-solid fa-circle-nodes", color: "#3b82f6", desc: "Core connection to the main network.", bandwidth: 2000, ports: ['out'], flowLevel: 4 },

            // Advanced - Late game specialization
            proxy: { name: "Proxy Node", type: "advanced", cost: 3500, icon: "fa-solid fa-network-wired", color: "#64748b", desc: "Extends network range without degrading speed.", req: "tech_proxy", bandwidth: 250, ports: ['in', 'out'], flowLevel: 2 },
            compressor: { name: "Compressor", type: "advanced", cost: 8000, icon: "fa-solid fa-compress", color: "#14b8a6", desc: "Reduces file sizes by 35% for faster transfers.", req: "tech_compress", bandwidth: 300, ports: ['in', 'out'], flowLevel: 2 },
            backup: { name: "Backup Server", type: "advanced", cost: 12000, icon: "fa-solid fa-box-archive", color: "#a855f7", desc: "Stores excess data. Generates passive income from stored data.", req: "tech_backup", bandwidth: 350, ports: ['in'], flowLevel: 3 },
            analyzer: { name: "Data Analyzer", type: "advanced", cost: 15000, icon: "fa-solid fa-chart-pie", color: "#eab308", desc: "Analyzes data flow. Increases RP generation by 60%.", req: "tech_analyze", bandwidth: 300, ports: ['in', 'out'], flowLevel: 2 },
            streaming: { name: "Streaming Server", type: "advanced", cost: 25000, icon: "fa-solid fa-tower-broadcast", color: "#22d3ee", desc: "Specialized for media. 4x audio/video processing speed.", req: "tech_streaming", bandwidth: 600, ports: ['in', 'out'], flowLevel: 3 },
            cdn: { name: "CDN Node", type: "advanced", cost: 35000, icon: "fa-solid fa-earth-americas", color: "#3b82f6", desc: "Global content delivery. +30% boost to all uploaders.", req: "tech_cdn", bandwidth: 1000, ports: ['in', 'out'], flowLevel: 3 },
            cluster: { name: "Cluster Node", type: "advanced", cost: 50000, icon: "fa-solid fa-network-wired", color: "#84cc16", desc: "Links with other clusters. +25% boost per cluster.", req: "tech_cluster", bandwidth: 500, ports: ['in', 'out'], flowLevel: 2 },
            warehouse: { name: "Data Warehouse", type: "advanced", cost: 75000, icon: "fa-solid fa-warehouse", color: "#e879f9", desc: "Massive storage. Greatly increases downloader efficiency.", req: "tech_warehouse", bandwidth: 1200, size: [2, 1], ports: ['in', 'in', 'out', 'out'], flowLevel: 3 },
            ai_processor: { name: "AI Processor", type: "advanced", cost: 120000, icon: "fa-solid fa-brain", color: "#f97316", desc: "AI optimization. +125% efficiency to connected nodes.", req: "tech_ai", bandwidth: 1500, size: [2, 1], ports: ['in', 'in', 'out', 'out'], flowLevel: 3 },
            crypto_farm: { name: "Crypto Farm", type: "advanced", cost: 200000, icon: "fa-brands fa-ethereum", color: "#627eea", desc: "Industrial-scale crypto mining. Massive passive income.", req: "tech_crypto_farm", bandwidth: 1000, size: [2, 1], ports: ['in', 'in', 'out', 'out'], flowLevel: 3 },

            // CODING - Programming system
            coder: { name: "Coder Node", type: "coding", cost: 5000, icon: "fa-solid fa-terminal", color: "#00d4aa", desc: "Generates code bits for driver development.", bandwidth: 150, ports: ['out'], flowLevel: 1 },
            dev_station: { name: "Dev Station", type: "coding", cost: 20000, icon: "fa-solid fa-laptop-code", color: "#00d4aa", desc: "2.5x code bit generation. Advanced driver development.", req: "dev_station", bandwidth: 300, ports: ['out'], flowLevel: 1 },
            compiler: { name: "Code Compiler", type: "coding", cost: 60000, icon: "fa-solid fa-gears", color: "#00d4aa", desc: "Automatically converts bits to optimization code.", req: "tech_compiler", bandwidth: 400, ports: ['in', 'out'], flowLevel: 2 },

            // AUTOMATION
            logic_controller: { name: "Logic Controller", type: "advanced", cost: 100000, icon: "fa-solid fa-microchip", color: "#f472b6", desc: "Programmable automation. Set If/Then rules to auto-manage your network.", req: "tech_automation", bandwidth: 200, ports: ['in', 'out'], flowLevel: 2 }
        };

        // FIRMWARE DEFINITIONS (for Sub-Systems & Specialization)
        const FIRMWARE_DEFS = {
            encrypted_db: { name: "Encrypted Database", icon: "fa-solid fa-lock", color: "#a855f7", desc: "+200% RP from connected Labs. Immune to viruses.", cost: 50000, rpMult: 3.0, virusImmune: true },
            high_freq: { name: "High-Freq Compute", icon: "fa-solid fa-bolt", color: "#f97316", desc: "+150% mining/upload speed. +50% heat generation.", cost: 50000, speedMult: 2.5, heatMult: 1.5 },
            cdn_hub: { name: "Content Delivery Hub", icon: "fa-solid fa-earth-americas", color: "#3b82f6", desc: "+100% to connected uploaders. Acts as CDN.", cost: 50000, uploadMult: 2.0, actAsCDN: true }
        };

        // ADJACENCY RULES (proximity-based bonuses/penalties within 200px)
        const ADJACENCY_RANGE = 200;
        const ADJACENCY_RULES = [
            { type1: 'overclock', type2: 'overclock', effect: 'heat_penalty', value: 0.20, desc: '+20% extra heat per nearby Overclock' },
            { type1: 'cryo_cooler', type2: 'overclock', effect: 'heat_reduce', value: 0.25, desc: '-25% heat from nearby Overclock' },
            { type1: 'cache', type2: 'dl_file', effect: 'speed_bonus', value: 0.10, desc: '+10% download speed (proximity)' },
            { type1: 'cache', type2: 'dl_img', effect: 'speed_bonus', value: 0.10, desc: '+10% download speed (proximity)' },
            { type1: 'cache', type2: 'dl_vid', effect: 'speed_bonus', value: 0.10, desc: '+10% download speed (proximity)' },
            { type1: 'cache', type2: 'dl_audio', effect: 'speed_bonus', value: 0.10, desc: '+10% download speed (proximity)' },
            { type1: 'firewall', type2: '*', effect: 'virus_resist', value: 0.05, desc: '+5% virus resistance for nearby nodes' },
            { type1: 'miner', type2: 'miner', effect: 'efficiency_penalty', value: 0.05, desc: '-5% mining efficiency (competition)' }
        ];

        const RESOURCES = {
            files: { size: 20, price: 6, rp: 3 },
            images: { size: 80, price: 22, rp: 10 },
            videos: { size: 350, price: 65, rp: 35 },
            audio: { size: 120, price: 32, rp: 18 }
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

        // CODING UPGRADES CONFIGURATION
        const CODING_UPGRADES = [
            // Tier 1 - Basic (affordable early)
            { id: 'syntax_highlight', name: 'Syntax Highlighting', tier: 1, cost: 500, icon: 'fa-solid fa-highlighter', desc: '+25% code generation speed', effect: 'codeSpeed', value: 0.25 },
            { id: 'autocomplete', name: 'Auto-Complete', tier: 1, cost: 1000, icon: 'fa-solid fa-wand-magic-sparkles', desc: '-20% conversion cost (80 bits)', effect: 'conversionDiscount', value: 20 },
            { id: 'code_linter', name: 'Code Linter', tier: 1, cost: 1500, icon: 'fa-solid fa-magnifying-glass-chart', desc: '+10% all driver effects', effect: 'driverBoost', value: 0.1 },
            // Tier 2 - Intermediate
            { id: 'parallel_threads', name: 'Parallel Threads', tier: 2, cost: 5000, icon: 'fa-solid fa-code-branch', desc: 'Coder nodes generate 2x bits', effect: 'coderDouble', value: 2 },
            { id: 'git_vcs', name: 'Git Version Control', tier: 2, cost: 8000, icon: 'fa-brands fa-git-alt', desc: 'Code bits → passive money ($1/100 bits/s)', effect: 'codeIncome', value: 0.01 },
            { id: 'refactoring', name: 'Code Refactoring', tier: 2, cost: 12000, icon: 'fa-solid fa-arrows-rotate', desc: 'Conversion cost halved (50 bits)', effect: 'conversionDiscount', value: 50 },
            // Tier 3 - Advanced
            { id: 'ai_autocoder', name: 'AI Autocoder', tier: 3, cost: 30000, icon: 'fa-solid fa-robot', desc: '+100% code gen globally', effect: 'codeSpeed', value: 1.0 },
            { id: 'open_source_net', name: 'Open Source Network', tier: 3, cost: 50000, icon: 'fa-solid fa-people-group', desc: 'Every 10 code bits → 1 RP', effect: 'codeToRP', value: 0.1 },
            { id: 'quantum_compiler', name: 'Quantum Compiler', tier: 3, cost: 100000, icon: 'fa-solid fa-atom', desc: 'Compilers work 5x faster', effect: 'compilerSpeed', value: 5 },
        ];

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
            
            // Expanded Achievements (New in v12)
            { id: 'money_4', name: 'Billionaire', desc: 'Earn $1,000,000,000 total', icon: 'fa-solid fa-gem', condition: (s) => s.totalMoney >= 1000000000, reward: 50000 },
            { id: 'peak_3', name: 'Tycoon', desc: 'Have $1,000,000 at once', icon: 'fa-solid fa-money-bill-trend-up', condition: (s) => s.peakMoney >= 1000000, reward: 5000 },
            { id: 'contracts_3', name: 'Enterprise Client', desc: 'Complete 100 contracts', icon: 'fa-solid fa-building-columns', condition: (s) => s.contractsCompleted >= 100, reward: 5000 },
            { id: 'cables_2', name: 'Network Architect', desc: 'Place 200 cables', icon: 'fa-solid fa-diagram-project', condition: (s) => s.cablesPlaced >= 200, reward: 500 },
            { id: 'upgrades_2', name: 'Maxed Out', desc: 'Upgrade nodes 100 times', icon: 'fa-solid fa-arrow-up-right-dots', condition: (s) => s.upgrades >= 100, reward: 1000 },
            { id: 'code_3', name: 'Senior Developer', desc: 'Generate 1,000,000 code bits', icon: 'fa-solid fa-code', condition: (s) => s.totalCodeBits >= 1000000, reward: 5000 },
            { id: 'driver_3', name: 'Driver Collector', desc: 'Install 50 drivers', icon: 'fa-solid fa-hard-drive', condition: (s) => s.totalDrivers >= 50, reward: 5000 },
            { id: 'research_3', name: 'Nobel Prize', desc: 'Earn 1,000,000 RP total', icon: 'fa-solid fa-award', condition: (s) => s.totalRP >= 1000000, reward: 10000 },
            { id: 'prestige_3', name: 'Empire Builder', desc: 'Migrate 10 times', icon: 'fa-solid fa-crown', condition: (s) => s.prestigeCount >= 10, reward: 10000 },
            { id: 'security_2', name: 'Antivirus Pro', desc: 'Clean 50 viruses', icon: 'fa-solid fa-shield-virus', condition: (s) => s.virusesCleaned >= 50, reward: 1000 },
            { id: 'time_3', name: 'No Life', desc: 'Play for 100 hours', icon: 'fa-solid fa-infinity', condition: (s) => s.playTime >= 360000, reward: 25000 },
            { id: 'nodes_5', name: 'Megacorp', desc: 'Create 500 nodes', icon: 'fa-solid fa-globe', condition: (s) => s.nodesCreated >= 500, reward: 10000 },
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
            { id: 'crypto_surge', name: 'Crypto Surge', desc: 'Cryptocurrency values skyrocketing!', type: 'good', duration: 90, effect: () => { eventMultipliers.money = 2.5; }, cleanup: () => { eventMultipliers.money = 1; } },
            { id: 'open_source', name: 'Open Source Contribution', desc: 'Community code contributions!', type: 'good', instant: true, effect: (g) => { g.codeBits = (g.codeBits || 0) + 500; showFloat('+ 500 Code Bits (Open Source)', window.innerWidth/2, window.innerHeight/2, '#00d4aa'); } },
            { id: 'bandwidth_bonus', name: 'Bandwidth Bonus', desc: 'ISP doubled your bandwidth!', type: 'good', duration: 60, effect: () => { eventMultipliers.speed = 2; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'tax_refund', name: 'Tax Refund', desc: 'Government tax refund received!', type: 'good', instant: true, effect: (g) => { const refund = Math.floor(g.stats.totalMoney * 0.01); g.money += refund; showFloat(`+ $${fmt(refund)} (Tax Refund)`, window.innerWidth/2, window.innerHeight/2, '#10b981'); } },
            
            // Bad Events
            { id: 'market_crash', name: 'Market Crash', desc: 'Data prices are plummeting!', type: 'bad', duration: 60, effect: () => { eventMultipliers.money = 0.5; }, cleanup: () => { eventMultipliers.money = 1; } },
            { id: 'power_outage', name: 'Power Outage', desc: 'Reduced efficiency!', type: 'bad', duration: 30, effect: () => { eventMultipliers.speed = 0.5; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'ddos_attack', name: 'DDoS Attack', desc: 'Network under attack!', type: 'bad', duration: 45, effect: () => { eventMultipliers.speed = 0.3; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'maintenance', name: 'Emergency Maintenance', desc: 'Servers need repairs!', type: 'bad', instant: true, effect: (g) => { g.money = Math.max(0, g.money - 2000); showFloat('- $2,000 (Maintenance)', window.innerWidth/2, window.innerHeight/2, '#ef4444'); } },
            { id: 'data_breach', name: 'Data Breach', desc: 'Security incident!', type: 'bad', instant: true, effect: (g) => { g.rp = Math.max(0, g.rp - 200); showFloat('- 200 RP (Breach)', window.innerWidth/2, window.innerHeight/2, '#ef4444'); } },
            { id: 'hardware_failure', name: 'Hardware Failure', desc: 'A component overheated!', type: 'bad', duration: 40, effect: () => { eventMultipliers.speed = 0.6; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'isp_throttle', name: 'ISP Throttling', desc: 'Your ISP is throttling bandwidth!', type: 'bad', duration: 90, effect: () => { eventMultipliers.speed = 0.7; }, cleanup: () => { eventMultipliers.speed = 1; } },
            { id: 'crypto_crash', name: 'Crypto Crash', desc: 'Cryptocurrency values plummeting!', type: 'bad', duration: 60, effect: () => { eventMultipliers.money = 0.4; }, cleanup: () => { eventMultipliers.money = 1; } },
            { id: 'ransomware', name: 'Ransomware Alert', desc: 'Ransomware detected! Pay to recover!', type: 'bad', instant: true, effect: (g) => { const loss = Math.floor(g.money * 0.1); g.money = Math.max(0, g.money - loss); showFloat(`- $${fmt(loss)} (Ransomware)`, window.innerWidth/2, window.innerHeight/2, '#ef4444'); } },
        ];

        // --- STATE ---
        let game = {
            money: 2000,
            rp: 0,
            prestige: 0, 
            singularity: { shards: 0, skills: {} },
            res: { files: 0, images: 0, videos: 0, audio: 0 },
            nodes: [],
            conns: [],
            currentSubnet: null, // null for main grid, node ID string for a subnet
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
            
            // CODING UPGRADES
            codingUpgrades: [],
            
            // SETTINGS
            autoSaveEnabled: true,
            notificationsEnabled: true,
            offlineEarningsEnabled: true,
            particlesEnabled: true,
            animationsEnabled: true,
            eventAlertsEnabled: true,
            ultraLowPerfEnabled: false,
            lastSaveTime: Date.now(),
            
            // PLAYER INFO
            playerName: '',
            playerId: '',
            saveCreated: Date.now(),
            saveVersion: GAME_VERSION,
            
            // PLAYTIME
            playTime: 0,  // Total seconds played
            lastPlayTimeUpdate: Date.now(),
            
            // TUTORIAL
            tutorialCompleted: false,
            tutorialStep: 0
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
        // Cached DOM refs for zoom performance (initialized on first use)
        let _worldEl = null;
        let _zoomLevelEl = null;
        function getWorldEl() { return _worldEl || (_worldEl = document.getElementById('world')); }
        function getZoomLevelEl() { return _zoomLevelEl || (_zoomLevelEl = document.getElementById('zoomLevel')); }
        
        // Debounced zoom display — avoids formatting + DOM write on every micro-event
        let _zoomDisplayRAF = 0;
        function updateZoomDisplay() {
            if (_zoomDisplayRAF) return;
            _zoomDisplayRAF = requestAnimationFrame(() => {
                getZoomLevelEl().innerText = Math.round(view.scale * 100) + '%';
                _zoomDisplayRAF = 0;
            });
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
            
            // Center viewport on the player's nodes
            if (game.nodes.length > 0) {
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                game.nodes.forEach(n => {
                    const w = (NODE_DEFS[n.type]?.size?.[0] || 1) * 170;
                    const h = 70;
                    if (n.x < minX) minX = n.x;
                    if (n.y < minY) minY = n.y;
                    if (n.x + w > maxX) maxX = n.x + w;
                    if (n.y + h > maxY) maxY = n.y + h;
                });
                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;
                view.x = window.innerWidth / 2 - centerX * view.scale;
                view.y = window.innerHeight / 2 - centerY * view.scale;
            } else {
                view.x = window.innerWidth / 2;
                view.y = window.innerHeight / 2;
            }
            
            updateWorldTransform();
            updateZoomDisplay();
        }
        
        // RAF-batched world transform — coalesces rapid zoom/pan into one paint
        let _transformRAF = 0;
        function updateWorldTransform() {
            if (_transformRAF) cancelAnimationFrame(_transformRAF);
            _transformRAF = requestAnimationFrame(() => {
                getWorldEl().style.transform = `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`;
                _transformRAF = 0;
            });
        }

        // Toggle setting
        function toggleSetting(setting, value) {
            if (game.hasOwnProperty(setting)) {
                game[setting] = value;
                const settingNames = {
                    'autoSaveEnabled': 'Auto-Save',
                    'offlineEarningsEnabled': 'Offline Earnings',
                    'notificationsEnabled': 'Notifications',
                    'ultraLowPerfEnabled': 'Ultra Low Performance Mode'
                };
                logEvent(`${settingNames[setting] || setting} ${value ? 'enabled' : 'disabled'}`, 'info');
                autoSaveLocal();
            }
        }
        
        // Clear save and reset game (local + cloud)
        async function clearSaveAndReset() {
            if (!confirm('WARNING: This will permanently DELETE ALL your save data (local AND cloud) and reset the game completely.\n\nAre you sure?')) return;
            if (!confirm('FINAL WARNING: This action CANNOT be undone. All progress, nodes, upgrades, drivers, and achievements will be lost forever.\n\nType OK to confirm.')) return;
            
            // 1. Clear local save
            localStorage.removeItem('uploadLabsSave');
            console.log('Local save cleared.');
            
            // 2. Delete cloud save if logged in
            if (currentUser && window.firebaseDb && window.firebaseDoc && window.firebaseDeleteDoc) {
                try {
                    const db = window.firebaseDb;
                    const doc = window.firebaseDoc;
                    const deleteDoc = window.firebaseDeleteDoc;
                    
                    await deleteDoc(doc(db, 'saves', currentUser.uid));
                    console.log('Cloud save deleted for user:', currentUser.uid);
                } catch (error) {
                    console.error('Failed to delete cloud save:', error);
                    // Continue with reset even if cloud delete fails
                }
            }
            
            // 3. Reload page to start fresh
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
            clearDriverGridCache, debugMoney, buyCodingUpgrade, renderCodingUpgrades,
            openLogicControllerModal, saveLogicRules
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
            
            // Start tutorial for new players
            if (!game.tutorialCompleted && window.Tutorial) {
                window.Tutorial.start();
            }
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

        // ==================== SINGULARITY / PRESTIGE SYSTEM ====================
        function getTotalNetworkValue() {
            let tnv = game.money + (game.stats?.moneySpent || 0); // Include spent money so we don't punish spending
            // But if spent money isn't accurate, fallback to node values.
            // Actually, calculating from node value directly is safer against old saves:
            let nodeTNV = game.money;
            game.nodes.forEach(n => {
                const def = NODE_DEFS[n.type];
                if (def && def.cost) {
                    let val = def.cost;
                    for (let i = 1; i < n.level; i++) {
                        val += def.cost * Math.pow(1.5, i);
                    }
                    nodeTNV += val;
                }
            });
            return Math.max(tnv, nodeTNV); // Use whichever is higher
        }

        function getSingularityShards(tnv) {
            if (tnv < 50000) return 0;
            return Math.max(1, Math.floor(Math.cbrt(tnv / 50000)));
        }

        function getSkill(id) {
            return game.singularity?.skills?.[id] || 0;
        }

        const SINGULARITY_SKILLS = [
            { id: 'quantum', name: 'Quantum Burst', desc: '+100% global speed per level.', icon: 'fa-microchip', maxLevel: 999, cost: () => 1 },
            { id: 'absolute_zero', name: 'Absolute Zero', desc: 'Router heat generation is reduced to 0. Overheating is impossible.', icon: 'fa-snowflake', maxLevel: 1, cost: () => 10 },
            { id: 'golden', name: 'Golden Ticket', desc: 'All contract payouts (Money & RP) increased by +50% per level.', icon: 'fa-ticket', maxLevel: 10, cost: () => 2 },
            { id: 'self_aware', name: 'Self-Aware Code', desc: '+1% chance per second to auto-upgrade a random active node.', icon: 'fa-brain', maxLevel: 5, cost: () => 3 },
            { id: 'wireless', name: 'Wireless Protocol', desc: 'Nodes no longer require cables to function. Placed nodes are automatically active.', icon: 'fa-wifi', maxLevel: 1, cost: () => 15 }
        ];

        function openSingularityCore() {
            document.getElementById('singularityModal').style.display = 'flex';
            renderSingularityTree();
        }

        function renderSingularityTree() {
            const container = document.getElementById('singularityTreeContainer');
            if (!container) return;
            container.innerHTML = '';
            
            const shardsEl = document.getElementById('singularityShardCount');
            if (shardsEl) shardsEl.innerText = `${fmt(game.singularity?.shards || 0)} Shards`;
            
            SINGULARITY_SKILLS.forEach(skill => {
                const currentLevel = getSkill(skill.id);
                const isMax = currentLevel >= skill.maxLevel;
                const cost = skill.cost(currentLevel);
                const canAfford = (game.singularity?.shards || 0) >= cost;
                
                const card = document.createElement('div');
                card.className = `singularity-skill-card ${isMax ? 'maxed' : ''}`;
                
                card.innerHTML = `
                    <i class="fa-solid ${skill.icon} singularity-skill-icon"></i>
                    <div class="singularity-skill-name">${skill.name}</div>
                    <div class="singularity-skill-level">Lvl ${currentLevel} ${isMax ? '(MAX)' : `/ ${skill.maxLevel}`}</div>
                    <div class="singularity-skill-desc">${skill.desc}</div>
                    <button class="singularity-btn" 
                        onclick="buySingularitySkill('${skill.id}')"
                        ${(isMax || !canAfford) ? 'disabled' : ''}>
                        ${isMax ? 'MAXED' : `Buy (${cost} Shard${cost>1?'s':''})`}
                    </button>
                `;
                container.appendChild(card);
            });
        }

        function buySingularitySkill(id) {
            const skill = SINGULARITY_SKILLS.find(s => s.id === id);
            if (!skill) return;
            
            if (!game.singularity) game.singularity = { shards: 0, skills: {} };
            
            const currentLevel = getSkill(id);
            if (currentLevel >= skill.maxLevel) return;
            
            const cost = skill.cost(currentLevel);
            if (game.singularity.shards >= cost) {
                game.singularity.shards -= cost;
                game.singularity.skills[id] = currentLevel + 1;
                
                logEvent(`Singularity Upgraded: ${skill.name}`, 'good');
                renderSingularityTree();
                updatePrestigeUI();
            }
        }

        function updatePrestigeUI() {
            const currentBonus = getSkill('quantum') * 100; // was game.prestige * 50
            const tnv = getTotalNetworkValue();
            const shardsToGain = getSingularityShards(tnv);
            
            const currentBonusEl = document.getElementById('currentPrestigeBonus');
            const nextBonusEl = document.getElementById('nextPrestigeBonus');
            if (currentBonusEl) currentBonusEl.innerText = `${game.singularity?.shards || 0}`;
            if (nextBonusEl) nextBonusEl.innerText = `+${shardsToGain}`;
            
            const nodeCount = game.nodes.length;
            const moneyReq = 50000;
            const canPrestige = nodeCount >= 20 && game.money >= moneyReq;
            
            const reqText = document.getElementById('prestigeRequirements');
            if (reqText) {
                reqText.innerHTML = `
                    <div style="font-size: 16px; margin-bottom: 8px; color: #a855f7;">Total Network Value: $${fmt(tnv)}</div>
                    <span style="color: ${nodeCount >= 20 ? '#10b981' : '#ef4444'}">${nodeCount}/20 nodes</span> | 
                    <span style="color: ${game.money >= moneyReq ? '#10b981' : '#ef4444'}">$${fmt(game.money)}/$50,000</span>
                `;
            }
            
            const btn = document.getElementById('prestigeBtn');
            if (btn) {
                btn.disabled = !canPrestige;
                btn.style.opacity = canPrestige ? 1 : 0.5;
            }
        }

        function performPrestige() {
            if (game.nodes.length < 20 || game.money < 50000) return;
            
            const tnv = getTotalNetworkValue();
            const shardsEarned = getSingularityShards(tnv);
            
            game.prestige++;
            game.stats.prestigeCount++;
            
            if (!game.singularity) game.singularity = { shards: 0, skills: {} };
            game.singularity.shards += shardsEarned;
            
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
            game.currentSubnet = null;
            
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
            logEvent(`Entered the Singularity! Earned ${shardsEarned} Shards.`, 'good');
            showFloat(`+${shardsEarned} Shards!`, window.innerWidth/2, window.innerHeight/2, '#a855f7');
            
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
            if (game.ultraLowPerfEnabled && Math.random() > 0.1) return; // Drop 90% of particles in ultra-low perf mode
            
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
                    
                    if (getSkill('absolute_zero') > 0) {
                        game.routerHeat = 0;
                    } else if (netHeatChange > 0) {
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
            
            // Driver effects (boosted by code_linter upgrade)
            const driverBoostMult = (game.codingUpgrades || []).includes('code_linter') ? 1.1 : 1.0;
            const driverDownloadMult = 1 + (game.drivers.download * DRIVERS.download.effect * driverBoostMult);
            const driverUploadMult = 1 + (game.drivers.upload * DRIVERS.upload.effect * driverBoostMult);
            const driverMiningMult = 1 + (game.drivers.mining * DRIVERS.mining.effect * driverBoostMult);
            const driverResearchMult = 1 + (game.drivers.research * DRIVERS.research.effect * driverBoostMult);

            // Prestige multiplier (replaced by Quantum Computing Singularity Skill)
            const prestigeMult = 1 + getSkill('quantum') * 1.0; // +100% speed per level
            
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
            
            // Calculate total levels for global buff nodes instead of just counting them
            const cdnTotalLevel = game.nodes.filter(n => n.type === 'cdn' && activeNodes.has(n.id) && !n.infected).reduce((sum, n) => sum + n.level, 0);
            const cdnBoost = 1 + (cdnTotalLevel * 0.20); 
            
            const aiTotalLevel = game.nodes.filter(n => n.type === 'ai_processor' && activeNodes.has(n.id) && !n.infected).reduce((sum, n) => sum + n.level, 0);
            const aiBoost = 1 + Math.min(aiTotalLevel * 0.4, 5); // Cap at 6x
            
            const clusterTotalLevel = game.nodes.filter(n => n.type === 'cluster' && activeNodes.has(n.id) && !n.infected).reduce((sum, n) => sum + n.level, 0);
            const clusterBoost = 1 + (clusterTotalLevel * 0.15); 
            
            let quantumMult = 1;
            game.nodes.forEach(n => { if (n.type === 'quantum' && activeNodes.has(n.id) && !n.infected) quantumMult *= (1 + n.level); }); // 2x at Lv1, 3x at Lv2 (down from 2.5x/4x)
            quantumMult = Math.min(quantumMult, 10); // Hard cap at 10x
            
            // Event multipliers
            const eventSpeedMult = eventMultipliers.speed;
            const eventMoneyMult = eventMultipliers.money;
            const eventRPMult = eventMultipliers.rp;
            const eventCodeMult = eventMultipliers.code;
            
            // ==================== ADJACENCY EFFECTS ====================
            // Calculate proximity-based bonuses/penalties per node
            const adjacencyEffects = new Map(); // nodeId -> { speedMult, heatMult, virusResist, efficiencyMult }
            const activeNodeList = game.nodes.filter(n => activeNodes.has(n.id) && !n.infected);
            
            for (let i = 0; i < activeNodeList.length; i++) {
                const n1 = activeNodeList[i];
                if (!adjacencyEffects.has(n1.id)) {
                    adjacencyEffects.set(n1.id, { speedMult: 1, heatMult: 1, virusResist: 0, efficiencyMult: 1 });
                }
                
                for (let j = i + 1; j < activeNodeList.length; j++) {
                    const n2 = activeNodeList[j];
                    if (!adjacencyEffects.has(n2.id)) {
                        adjacencyEffects.set(n2.id, { speedMult: 1, heatMult: 1, virusResist: 0, efficiencyMult: 1 });
                    }
                    
                    const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
                    if (dist > ADJACENCY_RANGE) continue;
                    
                    // Check all adjacency rules
                    ADJACENCY_RULES.forEach(rule => {
                        const match1 = (rule.type1 === n1.type && (rule.type2 === n2.type || rule.type2 === '*'));
                        const match2 = (rule.type1 === n2.type && (rule.type2 === n1.type || rule.type2 === '*'));
                        
                        if (match1) {
                            const eff = adjacencyEffects.get(n2.id);
                            switch (rule.effect) {
                                case 'speed_bonus': eff.speedMult += rule.value; break;
                                case 'heat_penalty': eff.heatMult += rule.value; break;
                                case 'heat_reduce': eff.heatMult -= rule.value; break;
                                case 'virus_resist': eff.virusResist += rule.value; break;
                                case 'efficiency_penalty': eff.efficiencyMult -= rule.value; break;
                            }
                        }
                        if (match2) {
                            const eff = adjacencyEffects.get(n1.id);
                            switch (rule.effect) {
                                case 'speed_bonus': eff.speedMult += rule.value; break;
                                case 'heat_penalty': eff.heatMult += rule.value; break;
                                case 'heat_reduce': eff.heatMult -= rule.value; break;
                                case 'virus_resist': eff.virusResist += rule.value; break;
                                case 'efficiency_penalty': eff.efficiencyMult -= rule.value; break;
                            }
                        }
                    });
                }
            }
            
            const baseSpeed = 35 * Math.pow(1.25, game.routerLevel - 1) * prestigeMult * fiberMult * quantumMult * neuralMult * efficiency * driverDownloadMult * eventSpeedMult * synergyBoost;
            
            // CODE GENERATION
            const coders = game.nodes.filter(n => n.type === 'coder' && activeNodes.has(n.id) && !n.infected);
            const devStations = game.nodes.filter(n => n.type === 'dev_station' && activeNodes.has(n.id) && !n.infected);
            const compilers = game.nodes.filter(n => n.type === 'compiler' && activeNodes.has(n.id) && !n.infected);
            
            // Coding upgrade multipliers
            const codingUps = game.codingUpgrades || [];
            let codeSpeedMult = 1;
            if (codingUps.includes('syntax_highlight')) codeSpeedMult += 0.25;
            if (codingUps.includes('ai_autocoder')) codeSpeedMult += 1.0;
            const coderNodeMult = codingUps.includes('parallel_threads') ? 2 : 1;
            
            let codeGenRate = 0;
            coders.forEach(coder => {
                const lvlMult = Math.pow(1.2, coder.level - 1);
                codeGenRate += 6.25 * lvlMult * eventCodeMult * coderNodeMult;
            });
            devStations.forEach(station => {
                const lvlMult = Math.pow(1.2, station.level - 1);
                codeGenRate += 12.5 * lvlMult * eventCodeMult;
            });
            codeGenRate *= codeSpeedMult;
            
            const bitsGenerated = codeGenRate * dt;
            game.codeBits += bitsGenerated;
            game.stats.totalCodeBits += bitsGenerated;
            
            // Auto-compiler - benefits from level and upgrades
            const compilerConvCost = getConversionCost();
            const compilerSpeedMult = codingUps.includes('quantum_compiler') ? 5 : 1;
            if (compilers.length > 0 && game.codeBits >= compilerConvCost) {
                const totalCompilerPower = compilers.reduce((sum, c) => sum + Math.pow(1.2, c.level - 1), 0);
                const toConvert = Math.min(Math.floor(game.codeBits / compilerConvCost), Math.floor(totalCompilerPower * 10 * compilerSpeedMult));
                if (toConvert > 0) {
                    game.codeBits -= toConvert * compilerConvCost;
                    game.optimizationCode += toConvert;
                }
            }
            
            // Git VCS - passive money from code bits
            if (codingUps.includes('git_vcs') && codeGenRate > 0) {
                const codeIncome = codeGenRate * 0.01 * dt;
                game.money += codeIncome;
                game.stats.totalMoney += codeIncome;
            }
            
            // Open Source Network - code bits generate RP
            if (codingUps.includes('open_source_net') && bitsGenerated > 0) {
                const codeRP = bitsGenerated * 0.1;
                game.rp += codeRP;
                game.stats.totalRP += codeRP;
            }

            // Process resources
            let fileConsumers = [];
            let totalFileDemand = 0;
            const analyzerTotalLevel = game.nodes.filter(n => n.type === 'analyzer' && activeNodes.has(n.id) && !n.infected).reduce((sum, n) => sum + n.level, 0);
            let rpBoost = 1 + (analyzerTotalLevel * 0.5);
            const warehouseTotalLevel = game.nodes.filter(n => n.type === 'warehouse' && activeNodes.has(n.id) && !n.infected).reduce((sum, n) => sum + n.level, 0);

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
                        if (n.type === 'cache') boost *= (1 + 0.5 * n.level); // 1.5x at lv1, 2.0x at lv2
                        if (n.type === 'rack') boost *= (1 + 0.2 * n.level); // 1.2x at lv1
                        if (n.type === 'compressor') hasCompressor = Math.max(hasCompressor || 0, n.level); // track highest compressor level
                    }
                });
                
                if (node.type === 'balancer') {
                    let connectedBalancerLevels = 0;
                    game.conns.forEach(c => {
                        const nid = c.from === node.id ? c.to : c.from;
                        const n = nodeMap.get(nid);
                        if (n && n.type === 'balancer' && activeNodes.has(nid) && !n.infected) {
                            connectedBalancerLevels += n.level;
                        }
                    });
                    boost *= (1 + connectedBalancerLevels * 0.1);
                }
                
                let isStreamingServer = node.type === 'streaming';
                if (node.type === 'crypto_farm') boost *= 3;
                
                // Apply adjacency effects (proximity bonuses/penalties)
                const adjEff = adjacencyEffects.get(node.id);
                if (adjEff) {
                    boost *= Math.max(0.1, adjEff.speedMult);
                    boost *= Math.max(0.1, adjEff.efficiencyMult);
                }
                
                // Apply firmware effects for Server Racks
                let firmwareSpeedMult = 1;
                let firmwareRPMult = 1;
                let firmwareUploadMult = 1;
                if (node.firmware && FIRMWARE_DEFS[node.firmware]) {
                    const fw = FIRMWARE_DEFS[node.firmware];
                    if (fw.speedMult) firmwareSpeedMult = fw.speedMult;
                    if (fw.rpMult) firmwareRPMult = fw.rpMult;
                    if (fw.uploadMult) firmwareUploadMult = fw.uploadMult;
                }
                
                let rawSpeed = baseSpeed * boost * lvlMult * firmwareSpeedMult * dt;
                
                // ==================== BANDWIDTH CLAMPING ====================
                // Each node has a max bandwidth from NODE_DEFS, scaled by level
                const maxBandwidth = (def.bandwidth || 500) * Math.pow(1.3, node.level - 1) * dt;
                
                // Load Balancer bonus: connected balancers share their excess bandwidth
                let balancerBandwidthBonus = 0;
                game.conns.forEach(c => {
                    const nid = c.from === node.id ? c.to : c.from;
                    const n = nodeMap.get(nid);
                    if (n && n.type === 'balancer' && activeNodes.has(nid) && !n.infected) {
                        balancerBandwidthBonus += (NODE_DEFS.balancer.bandwidth * 0.3 * Math.pow(1.3, n.level - 1)) * dt;
                    }
                });
                
                const totalBandwidth = maxBandwidth + balancerBandwidthBonus;
                const isBottlenecked = rawSpeed > totalBandwidth;
                const effectiveSpeed = Math.min(rawSpeed, totalBandwidth);
                
                // Track bottleneck state for UI rendering
                node._bottlenecked = isBottlenecked;
                node._bandwidthUsage = totalBandwidth > 0 ? Math.min(1, rawSpeed / totalBandwidth) : 0;
                if (def.type === 'download' || node.type === 'dl_audio') {
                    const resourceKey = def.out || node.type.replace('dl_', '');
                    let amt = effectiveSpeed / RESOURCES[resourceKey].size;
                    if (warehouseTotalLevel > 0) amt *= (1 + warehouseTotalLevel * 0.3);
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
                        if (hasCompressor) size *= Math.max(0.1, (0.7 - (hasCompressor * 0.05) - (game.drivers.compression * DRIVERS.compression.effect))); // Scale compressor with level
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
                    if (c.hasCompressor) size *= Math.max(0.1, (0.7 - (c.hasCompressor * 0.05) - (game.drivers.compression * DRIVERS.compression.effect)));
                    
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
            
            // Throttle UI updates for performance
            const uiThrottle = game.ultraLowPerfEnabled ? 15 : 3;
            if (frameCount % uiThrottle === 0) {
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
            
            // Process automation rules from Logic Controllers
            processAutomationRules();
            
            // Singularity Skill: Self-Aware Code
            const selfAwareLvl = getSkill('self_aware');
            if (selfAwareLvl > 0 && Math.random() < 0.01 * selfAwareLvl) {
                const activeList = game.nodes.filter(n => activeNodes.has(n.id) && !n.infected && n.type !== 'router');
                if (activeList.length > 0) {
                    const target = activeList[Math.floor(Math.random() * activeList.length)];
                    target.level++;
                    spawnParticles(target.x + 85, target.y + 35, '#a855f7', 8);
                    logEvent(`Self-Aware Code upgraded ${NODE_DEFS[target.type].name}!`, 'good');
                }
            }
            
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
                const baseCost = NODE_DEFS[type].cost || 500;
                const cost = Math.floor(baseCost * Math.pow(1.5, node.level));
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
                const baseCost = NODE_DEFS[type].cost || 500;
                const cost = Math.floor(baseCost * Math.pow(1.5, node.level));
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
            
            // Singularity Skill: Wireless Protocol bypasses cables
            if (getSkill('wireless') > 0) {
                game.nodes.forEach(n => {
                    newActive.add(n.id);
                    n.hasPathToRouter = true;
                });
                activeNodes = newActive;
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
                
                // If current node is a master router, its subnet core is also considered connected
                const currNode = game.nodes.find(n => n.id === curr);
                if (currNode && currNode.type === 'master_router') {
                    const coreNode = game.nodes.find(n => n.subnetId === curr && n.type === 'subnet_core');
                    if (coreNode && !newActive.has(coreNode.id)) {
                        newActive.add(coreNode.id);
                        q.push(coreNode.id);
                    }
                }
                
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
                
                        
                // Update cable visuals based on the current subnet view
                document.querySelectorAll('.cable-group').forEach(c => {
                    if (!c.dataset.ends) return;
                    const [id1, id2] = c.dataset.ends.split(',').map(Number);
                    
                    const node1 = game.nodes.find(n => n.id === id1);
                    const node2 = game.nodes.find(n => n.id === id2);
                    
                    // Cable is only visible/active if both ends are in the CURRENT subnet view
                    if (node1 && node2 && node1.subnetId === game.currentSubnet && node2.subnetId === game.currentSubnet) {
                        c.style.display = 'block';
                        if (newActive.has(id1) && newActive.has(id2)) {
                            c.classList.remove('disconnected');
                            c.classList.add('active');
                        } else {
                            c.classList.add('disconnected');
                            c.classList.remove('active');
                        }
                    } else {
                        // Hide cables not in current view
                        c.style.display = 'none';
                    }
                });
            }
            
            // Update the activeNodes Set
            activeNodes.clear();
            newActive.forEach(id => activeNodes.add(id));
        }

        // --- CODE SYSTEM FUNCTIONS ---
        
        function getConversionCost() {
            let cost = 100;
            const upgrades = game.codingUpgrades || [];
            if (upgrades.includes('refactoring')) cost = 50;
            else if (upgrades.includes('autocomplete')) cost = 80;
            return cost;
        }

        function convertCodeBits() {
            const cost = getConversionCost();
            if (game.codeBits >= cost) {
                game.codeBits -= cost;
                game.optimizationCode += 1;
                logEvent(`Converted ${cost} code bits to 1 optimization code`, 'code');
                updateCodeUI();
            }
        }

        function buyCodingUpgrade(upgradeId) {
            const upgrade = CODING_UPGRADES.find(u => u.id === upgradeId);
            if (!upgrade) return;
            if ((game.codingUpgrades || []).includes(upgradeId)) return;
            if (game.codeBits < upgrade.cost) return;
            
            // Check tier requirements - all previous tier upgrades must be owned
            const prevTierUpgrades = CODING_UPGRADES.filter(u => u.tier < upgrade.tier);
            const ownedCount = prevTierUpgrades.filter(u => (game.codingUpgrades || []).includes(u.id)).length;
            if (ownedCount < prevTierUpgrades.length) return;
            
            game.codeBits -= upgrade.cost;
            if (!game.codingUpgrades) game.codingUpgrades = [];
            game.codingUpgrades.push(upgradeId);
            
            logEvent(`Coding Upgrade: ${upgrade.name}!`, 'code');
            showFloat(`${upgrade.name} Unlocked!`, window.innerWidth/2, window.innerHeight/2, '#00d4aa');
            
            updateCodeUI();
            renderCodingUpgrades();
            clearDriverGridCache();
            checkAchievements();
        }

        function renderCodingUpgrades() {
            const container = document.getElementById('codingUpgradeTree');
            if (!container) return;
            
            const owned = game.codingUpgrades || [];
            
            let html = '';
            [1, 2, 3].forEach(tier => {
                const tierNames = { 1: 'Basic', 2: 'Intermediate', 3: 'Advanced' };
                const tierUpgrades = CODING_UPGRADES.filter(u => u.tier === tier);
                const prevTierUpgrades = CODING_UPGRADES.filter(u => u.tier < tier);
                const prevOwned = prevTierUpgrades.filter(u => owned.includes(u.id)).length;
                const tierLocked = prevOwned < prevTierUpgrades.length;
                
                html += `<div class="coding-tier">`;
                html += `<div class="coding-tier-label tier-${tier}">Tier ${tier} \u2014 ${tierNames[tier]}</div>`;
                html += `<div class="coding-upgrade-grid">`;
                tierUpgrades.forEach(u => {
                    const isOwned = owned.includes(u.id);
                    const canAfford = game.codeBits >= u.cost;
                    const locked = tierLocked && !isOwned;
                    const cls = isOwned ? 'owned' : (locked || !canAfford ? 'locked' : '');
                    html += `
                        <div class="coding-upgrade-card ${cls}" onclick="${isOwned || locked ? '' : `buyCodingUpgrade('${u.id}')`}">
                            <div class="upgrade-icon"><i class="${u.icon}"></i></div>
                            <div class="upgrade-name">${u.name}</div>
                            <div class="upgrade-desc">${u.desc}</div>
                            <div class="upgrade-cost">${isOwned ? '<i class="fa-solid fa-check"></i> Owned' : (locked ? '<i class="fa-solid fa-lock"></i> Locked' : `${u.cost.toLocaleString()} Bits`)}</div>
                        </div>
                    `;
                });
                html += `</div></div>`;
            });
            
            container.innerHTML = html;
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
                const convCost = getConversionCost();
                if (convertBtn) convertBtn.disabled = game.codeBits < convCost;
                if (sidebarConvertBtn) sidebarConvertBtn.disabled = game.codeBits < convCost;
                
                updateInstalledDriversList();
                renderDriverGrid();
                renderCodingUpgrades();
                
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
            
            // Tutorial callback
            if (window._tutorialOnModalOpened) window._tutorialOnModalOpened(modalId);
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
            const newNodeId = game.nextId++;
            game.nodes.push({ id: newNodeId, type, x, y, level: 1, infected: false, subnetId: game.currentSubnet || null });
            game.stats.nodesCreated++;
            checkAchievements();
            addCombo();
            spawnParticles(x + 90, y + 40, NODE_DEFS[type]?.color || '#3b82f6', 8);
            renderWorld();
            
            // If spawning a master router, immediately spawn its subnet core inside it
            if (type === 'master_router') {
                const prevSubnet = game.currentSubnet;
                game.currentSubnet = newNodeId;
                // Spawn a subnet core right in the center of the subnet
                spawnNode('subnet_core', 2500, 2500);
                game.currentSubnet = prevSubnet;
            }
            
            // Tutorial callback
            if (window._tutorialOnNodeCreated) window._tutorialOnNodeCreated(type);
        }

        function buyNode(type) {
            if (type === 'master_router' && game.currentSubnet !== null) {
                showFloat("Cannot place Master Router inside a subnet", window.innerWidth/2, window.innerHeight/2, '#ef4444');
                return;
            }
            
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
            // A node going from level 1 to level 2 effectively uses level=1 in the formula context (since the math checks the current level before addition)
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
             if (n.type === 'router' || n.type === 'subnet_core') return; 
             
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
                
                // Trigger unlock animation on the newly owned card
                const card = document.getElementById(`tech-${id}`);
                if (card) {
                    card.classList.add('just-unlocked');
                    setTimeout(() => card.classList.remove('just-unlocked'), 1200);
                }
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
            if (!confirm("Enter the Singularity? Resets money, nodes, tech. Drivers and code persist!")) return;
            
            const tnv = getTotalNetworkValue();
            const shardsEarned = getSingularityShards(tnv);
            
            game.prestige++;
            
            if (!game.singularity) game.singularity = { shards: 0, skills: {} };
            game.singularity.shards += shardsEarned;
            
            game.money = 2000;
            game.rp = 0;
            game.res = { files: 0, images: 0, videos: 0, audio: 0 };
            game.nodes = [];
            game.conns = [];
            game.routerLevel = 1;
            game.routerHeat = 0;
            game.unlocked = [];
            game.nextId = 1;
            game.activeContract = null;
            
            game.stats.totalMoney = 2000;
            game.stats.moneySpent = 0;
            game.stats.prestigeCount++;
            
            activeNodes.clear();
            selectedNode = null;
            
            renderWorld();
            spawnNode('router', 2500, 2500);
            updatePrestigeUI();
            logEvent(`Singularity Achieved! +${shardsEarned} Shards`);
            checkAchievements();
            closeAllModals();
        }
        
        function openContracts() {
            const list = document.getElementById('contractList');
            list.innerHTML = '';
            
            // Scale contracts based on prestige level and Golden Ticket skill
            const prestigeScale = 1 + (getSkill('quantum') * 0.5) + (getSkill('golden') * 0.5);
            const allContracts = [
                // Tier 1: Starter contracts
                { title: "Data Dump", desc: "Upload 50 MB Data", target: 50 * 1024 * 1024, time: 60, rewardM: Math.floor(5000 * prestigeScale), rewardR: Math.floor(500 * prestigeScale), tier: 1 },
                { title: "Quick Upload", desc: "Upload 20 MB Data", target: 20 * 1024 * 1024, time: 30, rewardM: Math.floor(2000 * prestigeScale), rewardR: Math.floor(200 * prestigeScale), tier: 1 },
                
                // Tier 2: Mid contracts
                { title: "Streaming Deal", desc: "Upload 500 MB Data", target: 500 * 1024 * 1024, time: 120, rewardM: Math.floor(25000 * prestigeScale), rewardR: Math.floor(2000 * prestigeScale), tier: 2 },
                { title: "Media Package", desc: "Upload 250 MB Data", target: 250 * 1024 * 1024, time: 90, rewardM: Math.floor(15000 * prestigeScale), rewardR: Math.floor(1500 * prestigeScale), tier: 2 },
                { title: "Research Grant", desc: "Upload 100 MB Data", target: 100 * 1024 * 1024, time: 75, rewardM: Math.floor(3000 * prestigeScale), rewardR: Math.floor(5000 * prestigeScale), tier: 2 },
                
                // Tier 3: Advanced contracts
                { title: "Corporate Backups", desc: "Upload 1 GB Data", target: 1024 * 1024 * 1024, time: 180, rewardM: Math.floor(100000 * prestigeScale), rewardR: Math.floor(5000 * prestigeScale), tier: 3 },
                { title: "Government Archive", desc: "Upload 2 GB Data", target: 2 * 1024 * 1024 * 1024, time: 300, rewardM: Math.floor(250000 * prestigeScale), rewardR: Math.floor(15000 * prestigeScale), tier: 3 },
                { title: "Cloud Migration", desc: "Upload 5 GB Data", target: 5 * 1024 * 1024 * 1024, time: 600, rewardM: Math.floor(750000 * prestigeScale), rewardR: Math.floor(50000 * prestigeScale), tier: 3 },
                
                // Tier 4: Endgame contracts
                { title: "Data Center Transfer", desc: "Upload 10 GB Data", target: 10 * 1024 * 1024 * 1024, time: 900, rewardM: Math.floor(2000000 * prestigeScale), rewardR: Math.floor(100000 * prestigeScale), tier: 4 },
                { title: "Satellite Uplink", desc: "Upload 25 GB Data", target: 25 * 1024 * 1024 * 1024, time: 1200, rewardM: Math.floor(5000000 * prestigeScale), rewardR: Math.floor(250000 * prestigeScale), tier: 4 },
            ];
            
            // Show contracts appropriate to player's progress (based on total money earned)
            const playerTier = game.stats.totalMoney >= 1000000 ? 4 : game.stats.totalMoney >= 100000 ? 3 : game.stats.totalMoney >= 10000 ? 2 : 1;
            const types = allContracts.filter(c => c.tier <= playerTier);
            
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
            
            // Add Subnet Exit Button if we are inside a subnet
            let subnetExitBtn = document.getElementById('subnetExitBtn');
            if (game.currentSubnet !== null) {
                if (!subnetExitBtn) {
                    subnetExitBtn = document.createElement('button');
                    subnetExitBtn.id = 'subnetExitBtn';
                    subnetExitBtn.className = 'btn';
                    subnetExitBtn.style.position = 'absolute';
                    subnetExitBtn.style.top = '20px';
                    subnetExitBtn.style.left = '50%';
                    subnetExitBtn.style.transform = 'translateX(-50%)';
                    subnetExitBtn.style.zIndex = '1000';
                    subnetExitBtn.style.backgroundColor = '#3b82f6';
                    subnetExitBtn.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
                    subnetExitBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Return to Main Network';
                    subnetExitBtn.onclick = () => {
                        game.currentSubnet = null;
                        resetZoom();
                        updateConnectivity(); // Connectivity hasn't changed, but this triggers a clean render of lines
                        renderWorld();
                    };
                    document.body.appendChild(subnetExitBtn);
                } else {
                    subnetExitBtn.style.display = 'block';
                }
            } else {
                if (subnetExitBtn) subnetExitBtn.style.display = 'none';
            }
            
            // Tutorial callback for subnets
            if (game.currentSubnet !== null && window._tutorialOnSubnetEntered) {
                window._tutorialOnSubnetEntered(game.currentSubnet);
            }
            
            // Filter nodes by current view
            const visibleNodes = game.nodes.filter(n => n.subnetId === game.currentSubnet);
            
            visibleNodes.forEach(n => {
                const def = NODE_DEFS[n.type];
                const el = document.createElement('div');
                let classes = `node ${activeNodes.has(n.id) ? '' : 'disconnected'} ${n.infected ? 'infected' : ''}`;
                if (n.type === 'router' && game.overheatMode) classes += ' overheating';
                if (def.type === 'coding') classes += ' coding';
                
                // Physical Footprint: wide nodes
                const isWide = def.size && def.size[0] === 2;
                if (isWide) classes += ' node-wide';
                
                // Bottleneck indicator
                if (n._bottlenecked) classes += ' bottlenecked';
                
                // Firmware styling
                if (n.firmware) classes += ' firmware-' + n.firmware;
                
                el.className = classes;
                el.id = `node-${n.id}`;
                el.style.left = n.x + 'px';
                el.style.top = n.y + 'px';
                
                if (n.type === 'master_router') {
                    el.ondblclick = (e) => {
                        e.stopPropagation();
                        game.currentSubnet = n.id;
                        resetZoom();
                        updateConnectivity(); // Connectivity hasn't changed, but triggers clean update
                        renderWorld();
                        showFloat("Entered Subnet", window.innerWidth/2, window.innerHeight/2, '#3b82f6');
                    };
                }
                
                let ports = '';
                if (def.ports) {
                    const ins = def.ports.filter(p => p === 'in');
                    const outs = def.ports.filter(p => p === 'out');
                    let inDrawn = 0;
                    let outDrawn = 0;
                    
                    def.ports.forEach(pType => {
                        let cls = `port ${pType}`;
                        if (pType === 'in') {
                            if (ins.length > 1) cls += inDrawn === 0 ? ' port-tl' : ' port-bl';
                            inDrawn++;
                        } else {
                            if (outs.length > 1) cls += outDrawn === 0 ? ' port-tr' : ' port-br';
                            outDrawn++;
                        }
                        ports += `<div class="${cls}" onmousedown="portDown(${n.id}, '${pType}', event)" onmouseup="portUp(${n.id}, '${pType}')"></div>\n`;
                    });
                }
                
                const cleanBtn = n.infected ? `<div class="clean-btn" onmousedown="cleanNode(game.nodes.find(x=>x.id===${n.id}), event)">CLEAN [-$500]</div>` : '';
                
                // Firmware badge
                let firmwareBadge = '';
                if (n.firmware && FIRMWARE_DEFS[n.firmware]) {
                    const fw = FIRMWARE_DEFS[n.firmware];
                    firmwareBadge = `<div class="firmware-badge" style="color:${fw.color}" title="${fw.name}: ${fw.desc}"><i class="${fw.icon}"></i></div>`;
                }
                
                // Bandwidth usage bar
                const bwUsage = n._bandwidthUsage || 0;
                const bwColor = bwUsage > 0.9 ? '#ef4444' : bwUsage > 0.6 ? '#f59e0b' : '#10b981';
                const bandwidthBar = `<div class="bandwidth-bar"><div class="bandwidth-fill" style="width:${Math.round(bwUsage * 100)}%;background:${bwColor}"></div></div>`;
                
                // Use firmware icon/color if flashed
                const displayIcon = (n.firmware && FIRMWARE_DEFS[n.firmware]) ? FIRMWARE_DEFS[n.firmware].icon : def.icon;
                const displayColor = (n.firmware && FIRMWARE_DEFS[n.firmware]) ? FIRMWARE_DEFS[n.firmware].color : '#fff';
                const tierName = FLOW_TIER_NAMES[def.flowLevel] || 'T' + def.flowLevel;
                
                el.innerHTML = `
                    ${firmwareBadge}
                    <div class="node-header">
                        <div class="node-icon-box" style="color:${displayColor}"><i class="${displayIcon}"></i></div>
                        <div style="flex:1; min-width: 0;">
                            <div class="node-title">${def.name}</div>
                            <div class="node-lvl">LVL ${n.level}</div>
                        </div>
                    </div>
                    <div class="node-body">
                        <div class="node-stat-row">
                            <span>Flow:</span>
                            <span class="flow-badge tier-${def.flowLevel}"><i class="${FLOW_TIER_ICONS[def.flowLevel] || ''}"></i> T${def.flowLevel} ${tierName}</span>
                        </div>
                        ${ports}
                    </div>
                    ${cleanBtn}
                    ${bandwidthBar}
                `;
                
                // Custom Tooltip Logic
                el.onmouseover = (e) => {
                    const tooltip = document.getElementById('gameTooltip') || createTooltipElement();
                    let fwHtml = '';
                    if (n.firmware && FIRMWARE_DEFS[n.firmware]) {
                        fwHtml = `<div class="custom-tooltip-fw">Firmware: ${FIRMWARE_DEFS[n.firmware].name}</div>`;
                    }
                    const bwPct = Math.round((n._bandwidthUsage || 0) * 100);
                    const bwCol = bwPct > 90 ? '#ef4444' : bwPct > 60 ? '#f59e0b' : '#10b981';
                    const bwLabel = n._bottlenecked ? '\u26A0\uFE0F BOTTLENECK' : `${bwPct}%`;
                    const ttTierName = FLOW_TIER_NAMES[def.flowLevel] || '';
                    const ttTierIcon = FLOW_TIER_ICONS[def.flowLevel] || '';
                    
                    let extraActionText = '';
                    if (n.type === 'master_router') {
                        extraActionText = '<div style="margin-top:8px; color:#3b82f6; font-weight:bold; text-align:center;"><i class="fa-solid fa-mouse-pointer"></i> Double-Click to Enter Subnet</div>';
                    }
                    
                    // Flow tier color mapping
                    const tierColors = { 1: '#60a5fa', 2: '#a78bfa', 3: '#10b981', 4: '#f59e0b' };
                    const ttTierColor = tierColors[def.flowLevel] || '#94a3b8';
                    
                    tooltip.innerHTML = `
                        <div class="custom-tooltip-title">
                            ${def.name} <span class="custom-tooltip-lvl">Lv${n.level}</span>
                        </div>
                        <div class="custom-tooltip-desc">${def.desc}</div>
                        ${extraActionText}
                        <div style="margin-top:6px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.08)">
                            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:6px">
                                <span style="color:#94a3b8"><i class="${ttTierIcon}" style="margin-right:3px"></i> Flow Tier</span>
                                <span class="flow-badge tier-${def.flowLevel}" style="font-size:10px">T${def.flowLevel} ${ttTierName}</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px">
                                <span style="color:#94a3b8">Bandwidth</span>
                                <span style="color:${bwCol};font-weight:600">${bwLabel}</span>
                            </div>
                            <div style="height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden">
                                <div style="height:100%;width:${bwPct}%;background:${bwCol};border-radius:2px;transition:width .3s"></div>
                            </div>
                        </div>
                        ${fwHtml}
                    `;
                    tooltip.classList.add('visible');
                    positionTooltip(e, tooltip);
                };
                
                el.onmousemove = (e) => {
                    const tooltip = document.getElementById('gameTooltip');
                    if (tooltip) positionTooltip(e, tooltip);
                };
                
                el.onmouseleave = () => {
                    const tooltip = document.getElementById('gameTooltip');
                    if (tooltip) tooltip.classList.remove('visible');
                };
                
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
        
        // Tooltip Helper Functions
        function createTooltipElement() {
            const el = document.createElement('div');
            el.id = 'gameTooltip';
            el.className = 'custom-tooltip';
            document.body.appendChild(el);
            return el;
        }
        
        function positionTooltip(e, tooltip) {
            // Position slightly offset from cursor
            let x = e.clientX + 15;
            let y = e.clientY + 15;
            
            // Keep on screen
            if (x + 250 > window.innerWidth) x = e.clientX - 265;
            if (y + tooltip.offsetHeight > window.innerHeight) y = window.innerHeight - tooltip.offsetHeight - 10;
            
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
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
                
                const w1 = (NODE_DEFS[freshN1.type].size && NODE_DEFS[freshN1.type].size[0] === 2) ? 340 : 170;
                const x1 = freshN1.x + w1;
                const y1 = freshN1.y + 35;
                const x2 = freshN2.x;
                const y2 = freshN2.y + 35;
                
                // Create more natural cable curves
                const dx = Math.abs(x2 - x1);
                const dy = Math.abs(y2 - y1);
                const curveStrength = Math.max(60, Math.min(150, dx * 0.6));
                
                const pathStr = `M ${x1} ${y1} C ${x1 + curveStrength} ${y1}, ${x2 - curveStrength} ${y2}, ${x2} ${y2}`;
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
            
            // World transform is handled by updateWorldTransform() during zoom/pan
            // — no need to re-set it every UI tick
            
            const prestigeMult = 1 + getSkill('quantum') * 1.0;
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
            
            const prestigeSectionEl = document.getElementById('prestigeSection');
            if (prestigeSectionEl && (game.money >= 10000000 || game.prestige > 0)) prestigeSectionEl.style.display = 'block';
            const prestigeBonusEl = document.getElementById('prestigeBonusDisplay');
            if (prestigeBonusEl) prestigeBonusEl.innerText = `Data Center Bonus: +${Math.round(game.prestige * 100)}%`;
            
            // Calculate and display synergy bonus
            let synergyPercent = 0;
            const activeNodeTypes = new Set(game.nodes.filter(n => activeNodes.has(n.id) && !n.infected).map(n => n.type));
            if (activeNodeTypes.has('cache') && (activeNodeTypes.has('dl_file') || activeNodeTypes.has('dl_img') || activeNodeTypes.has('dl_vid') || activeNodeTypes.has('dl_audio'))) synergyPercent += 15;
            if (activeNodeTypes.has('lab') && activeNodeTypes.has('analyzer')) synergyPercent += 20;
            if (activeNodeTypes.has('firewall')) synergyPercent += 10;
            if (activeNodeTypes.has('coder') && activeNodeTypes.has('dev_station') && activeNodeTypes.has('compiler')) synergyPercent += 25;
            if (activeNodeTypes.has('miner') && activeNodeTypes.has('crypto_farm')) synergyPercent += 30;
            const synergyEl = document.getElementById('synergyBonusDisplay');
            if (synergyEl) synergyEl.innerText = `Node Synergy: +${synergyPercent}%`;
            
            // === Network Overview Panel Updates ===
            const totalNodes = game.nodes.length;
            const activeCount = game.nodes.filter(n => activeNodes.has(n.id)).length;
            const bottleneckCount = game.nodes.filter(n => n._bottlenecked).length;
            const cableCount = game.cables ? game.cables.length : 0;
            
            const ncEl = document.getElementById('sidebarNodeCount');
            const acEl = document.getElementById('sidebarActiveCount');
            const ccEl = document.getElementById('sidebarCableCount');
            const bnEl = document.getElementById('sidebarBottlenecks');
            
            if (ncEl) ncEl.innerText = totalNodes;
            if (acEl) acEl.innerText = activeCount;
            if (ccEl) ccEl.innerText = cableCount;
            if (bnEl) {
                bnEl.innerText = bottleneckCount;
                bnEl.style.color = bottleneckCount > 0 ? '#ef4444' : '#64748b';
            }
            
            // Income tracking
            const incEl = document.getElementById('sidebarIncome');
            const npmEl = document.getElementById('sidebarNetPerMin');
            if (incEl) {
                const rateEl = document.getElementById('moneyRate');
                const rateTxt = rateEl ? rateEl.innerText : '+$0/s';
                incEl.innerText = rateTxt;
            }
            if (npmEl) {
                // Approximate net per minute based on current money rate
                const rateEl = document.getElementById('moneyRate');
                const moneyRate = parseFloat((rateEl ? rateEl.innerText : '0').replace(/[^0-9.-]/g, '')) || 0;
                npmEl.innerText = '$' + fmt(Math.round(moneyRate * 60)) + '/min';
            }
            
            // Network Health (% of active nodes NOT bottlenecked)
            const hpEl = document.getElementById('sidebarHealthPct');
            const hbEl = document.getElementById('sidebarHealthBar');
            if (hpEl && hbEl) {
                const health = activeCount > 0 ? Math.round(((activeCount - bottleneckCount) / activeCount) * 100) : 100;
                const hCol = health > 80 ? '#10b981' : health > 50 ? '#f59e0b' : '#ef4444';
                hpEl.innerText = health + '%';
                hpEl.style.color = hCol;
                hbEl.style.width = health + '%';
                hbEl.style.background = hCol;
            }
            
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
            const tierNames = { 1: 'Basics', 2: 'Expansion', 3: 'Specialization', 4: 'Infrastructure', 5: 'Enterprise', 6: 'Endgame' };
            
            // Build tier navigation bar
            let existingNav = document.getElementById('researchTierNav');
            if (existingNav) existingNav.remove();
            
            const navBar = document.createElement('div');
            navBar.className = 'research-tier-nav';
            navBar.id = 'researchTierNav';
            
            for (let tier = 1; tier <= maxTier; tier++) {
                const tierTechs = tiers[tier] || [];
                const ownedCount = tierTechs.filter(t => game.unlocked.includes(t.id)).length;
                const totalCount = tierTechs.length;
                const allOwned = ownedCount === totalCount;
                
                const navBtn = document.createElement('button');
                navBtn.className = `tier-nav-btn tier-nav-${tier} ${allOwned ? 'completed' : ''}`;
                navBtn.innerHTML = `<span class="tier-nav-label">T${tier}</span><span class="tier-nav-progress">${ownedCount}/${totalCount}</span>`;
                navBtn.title = `Tier ${tier}: ${tierNames[tier] || ''}`;
                navBtn.onclick = () => {
                    const tierEl = document.getElementById(`research-tier-${tier}`);
                    if (tierEl) tierEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                };
                navBar.appendChild(navBtn);
            }
            
            const container = document.getElementById('researchTreeContainer');
            container.insertBefore(navBar, container.firstChild);
            
            // Build tech cards per tier
            for (let tier = 1; tier <= maxTier; tier++) {
                const tierCol = document.createElement('div');
                tierCol.className = 'research-tier';
                tierCol.id = `research-tier-${tier}`;
                
                const tierLabel = document.createElement('div');
                tierLabel.className = `tier-label tier-${tier}`;
                tierLabel.innerHTML = `<span class="tier-label-num">Tier ${tier}</span><span class="tier-label-name">${tierNames[tier] || ''}</span>`;
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
                        card.setAttribute('data-tier', tier);
                        card.onclick = () => { if (!owned && prerequisitesMet) unlockTech(tech.id); };
                        
                        const costClass = canAfford ? 'affordable' : '';
                        
                        // Find what node this tech unlocks (for tooltip)
                        const unlocksNode = Object.entries(NODE_DEFS).find(([k, v]) => v.req === tech.id);
                        const unlocksText = unlocksNode ? `Unlocks: ${unlocksNode[1].name}` : '';
                        
                        card.innerHTML = `
                            <div class="tech-tier-accent tier-accent-${tier}"></div>
                            <div class="tech-icon"><i class="${tech.icon}"></i></div>
                            <div class="tech-name">${tech.name}</div>
                            <div class="tech-desc">${tech.desc}</div>
                            ${unlocksText ? `<div class="tech-unlocks"><i class="fa-solid fa-lock-open"></i> ${unlocksText}</div>` : ''}
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
            
            const container = document.getElementById('researchTreeContainer');
            const containerRect = container.getBoundingClientRect();
            const scrollLeft = container.scrollLeft;
            const scrollTop = container.scrollTop;
            
            TECH_TREE.forEach(tech => {
                if (tech.requires && tech.requires.length > 0) {
                    const targetEl = document.getElementById(`tech-${tech.id}`);
                    if (!targetEl) return;
                    
                    const targetRect = targetEl.getBoundingClientRect();
                    const targetX = targetRect.left - containerRect.left + scrollLeft + targetRect.width / 2;
                    const targetY = targetRect.top - containerRect.top + scrollTop;
                    
                    tech.requires.forEach(reqId => {
                        const sourceEl = document.getElementById(`tech-${reqId}`);
                        if (!sourceEl) return;
                        
                        const sourceRect = sourceEl.getBoundingClientRect();
                        const sourceX = sourceRect.left - containerRect.left + scrollLeft + sourceRect.width / 2;
                        const sourceY = sourceRect.top - containerRect.top + scrollTop + sourceRect.height;
                        
                        const isUnlocked = game.unlocked.includes(tech.id) && game.unlocked.includes(reqId);
                        const isPartial = !isUnlocked && game.unlocked.includes(reqId);
                        
                        // Cubic Bezier curve for smooth organic connectors
                        const midY = (sourceY + targetY) / 2;
                        const d = `M ${sourceX} ${sourceY} C ${sourceX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`;
                        
                        const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        line.setAttribute('class', `research-tree-line ${isUnlocked ? 'unlocked' : ''} ${isPartial ? 'partial' : ''}`);
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
            // Tutorial callback
            if (window._tutorialOnTabChanged) window._tutorialOnTabChanged(t);
            
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
                const shopTierName = FLOW_TIER_NAMES[def.flowLevel] || '';
                el.innerHTML = `
                    <div class="item-cost">$${fmt(def.cost)}</div>
                    <div class="item-icon"><i class="${def.icon}" style="color:${def.color}"></i></div>
                    <div class="item-name">${def.name}</div>
                    <div class="item-flow-tier"><span class="flow-badge tier-${def.flowLevel}">T${def.flowLevel} ${shopTierName}</span></div>
                    <div class="item-desc">${locked ? "LOCKED (Research)" : def.desc}</div>
                `;
                tray.appendChild(el);
            });
        }

        let drag = { active: false, node: null, startX: 0, startY: 0, offX: 0, offY: 0 };
        let port = { active: false, src: null, type: null };
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
            
            window.onmouseup = () => { 
                drag.active = false; drag.node = null; 
                if (port.active) {
                    port.active = false;
                    document.getElementById('world').classList.remove('dragging-cable');
                    document.body.classList.remove('dragging-in');
                    document.body.classList.remove('dragging-out');
                }
            };
            
            vp.onwheel = (e) => {
                e.preventDefault();
                
                const rect = vp.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                const worldX = (mouseX - view.x) / view.scale;
                const worldY = (mouseY - view.y) / view.scale;
                
                // Normalize deltaY across browsers and input devices.
                // deltaMode 1 = lines (multiply by ~40px), 0 = pixels (trackpad/mouse).
                let delta = e.deltaY;
                if (e.deltaMode === 1) delta *= 40;
                
                // Clamp to avoid huge jumps from momentum scrolling
                delta = Math.max(-150, Math.min(150, delta));
                
                // Sensitivity: ~0.2% zoom per pixel of delta
                const zoomFactor = 1 - delta * 0.002;
                const newScale = Math.max(0.3, Math.min(2, view.scale * zoomFactor));
                
                view.x = mouseX - worldX * newScale;
                view.y = mouseY - worldY * newScale;
                view.scale = newScale;
                
                updateZoomDisplay();
                updateWorldTransform();
            };
            
            // Safari native pinch gesture support
            vp.addEventListener('gesturestart', (e) => e.preventDefault());
            vp.addEventListener('gesturechange', (e) => {
                e.preventDefault();
                const rect = vp.getBoundingClientRect();
                const cx = e.clientX - rect.left;
                const cy = e.clientY - rect.top;
                const worldX = (cx - view.x) / view.scale;
                const worldY = (cy - view.y) / view.scale;
                const newScale = Math.max(0.3, Math.min(2, view.scale * e.scale));
                view.x = cx - worldX * newScale;
                view.y = cy - worldY * newScale;
                view.scale = newScale;
                updateZoomDisplay();
                updateWorldTransform();
            });
            vp.addEventListener('gestureend', (e) => e.preventDefault());
            
            // Toggle modal helper — opens if closed, closes if open
            function toggleModal(id) {
                const el = document.getElementById(id);
                if (!el) return;
                if (el.style.display === 'flex') {
                    el.style.display = 'none';
                } else {
                    // Close any other open modals first
                    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
                    el.style.display = 'flex';
                }
            }
            
            // Node Glossary — Task 42 (function was missing, added in Task 37 polish)
            function openNodeGlossary() {
                const container = document.getElementById('glossaryContainer');
                if (!container) return;
                container.innerHTML = '';
                
                Object.keys(NODE_DEFS).forEach(k => {
                    const def = NODE_DEFS[k];
                    if (def.type === 'core' && k !== 'router') return; // Skip subnet_core
                    
                    const tierName = FLOW_TIER_NAMES[def.flowLevel] || '';
                    const tierIcon = FLOW_TIER_ICONS[def.flowLevel] || '';
                    const isWide = def.size && def.size[0] === 2;
                    const inPorts = (def.ports || []).filter(p => p === 'in').length;
                    const outPorts = (def.ports || []).filter(p => p === 'out').length;
                    
                    const card = document.createElement('div');
                    card.className = 'glossary-card';
                    card.innerHTML = `
                        <div class="glossary-header">
                            <div class="glossary-icon" style="color:${def.color}; border-color: ${def.color}33">
                                <i class="${def.icon}"></i>
                            </div>
                            <div>
                                <div class="glossary-name">${def.name}</div>
                                <div class="glossary-tier-label"><i class="${tierIcon}"></i> Flow T${def.flowLevel} \u2014 ${tierName}</div>
                            </div>
                        </div>
                        <div class="glossary-desc">${def.desc}</div>
                        <div class="glossary-stats">
                            <div class="glossary-stat">
                                <span style="color:#94a3b8">Cost</span>
                                <span style="color:#fbbf24">$${fmt(def.cost)}</span>
                            </div>
                            <div class="glossary-stat">
                                <span style="color:#94a3b8">Bandwidth</span>
                                <span style="color:#06b6d4">${fmt(def.bandwidth || 0)} B/s</span>
                            </div>
                            <div class="glossary-stat">
                                <span style="color:#94a3b8">Size</span>
                                <span style="color:#e2e8f0">${isWide ? '2\u00D71 (Wide)' : '1\u00D71'}</span>
                            </div>
                            ${def.req ? `<div class="glossary-stat"><span style="color:#94a3b8">Requires</span><span style="color:#f472b6">${def.req}</span></div>` : ''}
                        </div>
                        <div class="glossary-ports">
                            ${inPorts > 0 ? `<span class="port-info in">${inPorts} IN</span>` : ''}
                            ${outPorts > 0 ? `<span class="port-info out">${outPorts} OUT</span>` : ''}
                        </div>
                    `;
                    container.appendChild(card);
                });
                
                document.getElementById('nodeGlossaryModal').style.display = 'flex';
            }
            
            window.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT') return;
                if (e.key === '+' || e.key === '=') zoomIn();
                else if (e.key === '-' || e.key === '_') zoomOut();
                else if (e.key === '0') resetZoom();
                else if (e.key === '?' || e.key === '/') toggleModal('helpModal');
                else if (e.key === 'r' || e.key === 'R') toggleModal('researchModal');
                else if (e.key === 'c' || e.key === 'C') toggleModal('codeModal');
                else if (e.key === 'a' || e.key === 'A') toggleModal('achievementsModal');
                else if (e.key === 'x' || e.key === 'X') toggleCableDeleteMode();
                else if (e.key === 's' || e.key === 'S') toggleModal('statsModal');
                else if (e.key === 'p' || e.key === 'P') toggleModal('prestigeModal');
                else if (e.key === 'l' || e.key === 'L') toggleModal('accountModal');
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
        
        function portDown(id, type, e) {
            e.stopPropagation();
            port.active = true; 
            port.src = id;
            port.type = type;
            document.getElementById('world').classList.add('dragging-cable');
            document.body.classList.add('dragging-' + type);
        }
        
        function portUp(id, type) {
            document.getElementById('world').classList.remove('dragging-cable');
            document.body.classList.remove('dragging-in');
            document.body.classList.remove('dragging-out');
            
            if (port.active && port.src !== id) {
                if (port.type === type) {
                    showFloat("Invalid connection", window.innerWidth/2, window.innerHeight/2, 'red');
                    port.active = false; 
                    return;
                }
                
                const sourceNode = game.nodes.find(n => n.id === (port.type === 'out' ? port.src : id));
                const targetNode = game.nodes.find(n => n.id === (port.type === 'in' ? port.src : id));

                if (!sourceNode || !targetNode) {
                    port.active = false;
                    return;
                }

                const sourceDef = NODE_DEFS[sourceNode.type];
                const targetDef = NODE_DEFS[targetNode.type];

                // Task 37: Enforce Upstream / Downstream Flow
                // Same-tier Bridge (T2) nodes can connect to each other for utility chaining
                const sameTierAllowed = sourceDef.flowLevel === 2 && targetDef.flowLevel === 2;
                if (!sameTierAllowed && sourceDef.flowLevel >= targetDef.flowLevel) {
                    const srcTierName = FLOW_TIER_NAMES[sourceDef.flowLevel] || 'T' + sourceDef.flowLevel;
                    const tgtTierName = FLOW_TIER_NAMES[targetDef.flowLevel] || 'T' + targetDef.flowLevel;
                    showFloat(`Invalid Flow: ${srcTierName} (T${sourceDef.flowLevel}) \u2192 ${tgtTierName} (T${targetDef.flowLevel})`, window.innerWidth/2, window.innerHeight/2, 'red');
                    document.body.classList.add('invalid-shake');
                    setTimeout(() => document.body.classList.remove('invalid-shake'), 500);
                    port.active = false;
                    return;
                }
                
                const cableCost = 10;
                if (game.money < cableCost) {
                    showFloat("Need $10", window.innerWidth/2, window.innerHeight/2, 'red');
                    port.active = false; return;
                }
                
                const fromId = sourceNode.id;
                const toId = targetNode.id;
                
                if (!game.conns.some(c => c.from === fromId && c.to === toId)) {
                    game.money -= cableCost;
                    game.stats.moneySpent += cableCost;
                    game.conns.push({ from: fromId, to: toId });
                    game.stats.cablesPlaced++;
                    renderCables();
                    updateConnectivity();
                    checkAchievements();
                    addCombo();
                    if (window._tutorialOnCableCreated) window._tutorialOnCableCreated();
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
            
            // Show/hide Logic Controller button
            const logicBtn = document.getElementById('ctxLogicRules');
            if (logicBtn) logicBtn.style.display = node.type === 'logic_controller' ? 'block' : 'none';
            
            // Show/hide Firmware Flash button (only for Server Racks without firmware)
            const fwBtn = document.getElementById('ctxFlashFirmware');
            if (fwBtn) fwBtn.style.display = (node.type === 'rack' && !node.firmware) ? 'block' : 'none';
        }
        
        // ==================== FIRMWARE FLASHING ====================
        
        let firmwareTargetNodeId = null;
        
        function openFirmwareModal(nodeId) {
            const node = game.nodes.find(n => n.id === nodeId);
            if (!node || node.type !== 'rack' || node.firmware) return;
            
            firmwareTargetNodeId = nodeId;
            document.getElementById('contextMenu').style.display = 'none';
            
            const container = document.getElementById('firmwareOptions');
            container.innerHTML = '';
            
            Object.entries(FIRMWARE_DEFS).forEach(([fwId, fw]) => {
                const canAfford = game.money >= fw.cost;
                const option = document.createElement('div');
                option.className = 'firmware-option' + (canAfford ? '' : ' disabled');
                option.style.opacity = canAfford ? '1' : '0.4';
                option.innerHTML = `
                    <div class="fw-icon" style="color:${fw.color}"><i class="${fw.icon}"></i></div>
                    <div class="fw-name">${fw.name}</div>
                    <div class="fw-desc">${fw.desc}</div>
                    <div class="fw-cost">$${fmt(fw.cost)}</div>
                `;
                if (canAfford) {
                    option.onclick = () => flashFirmware(fwId);
                }
                container.appendChild(option);
            });
            
            document.getElementById('firmwareModal').style.display = 'flex';
        }
        
        function flashFirmware(firmwareId) {
            if (!firmwareTargetNodeId) return;
            const node = game.nodes.find(n => n.id === firmwareTargetNodeId);
            if (!node || node.type !== 'rack' || node.firmware) return;
            
            const fw = FIRMWARE_DEFS[firmwareId];
            if (!fw || game.money < fw.cost) return;
            
            if (!confirm(`Flash "${fw.name}" firmware? This is PERMANENT and costs $${fmt(fw.cost)}.`)) return;
            
            game.money -= fw.cost;
            game.stats.moneySpent += fw.cost;
            node.firmware = firmwareId;
            
            // Make virus-immune firmware nodes immune
            if (fw.virusImmune) node.infected = false;
            
            document.getElementById('firmwareModal').style.display = 'none';
            firmwareTargetNodeId = null;
            
            spawnParticles(node.x + 90, node.y + 40, fw.color, 15);
            showFloat(`Firmware: ${fw.name}`, window.innerWidth/2, window.innerHeight/2, fw.color);
            renderWorld();
            
            // Tutorial callback
            if (window._tutorialOnFirmwareFlashed) window._tutorialOnFirmwareFlashed();
        }

        
        // ==================== LOGIC CONTROLLER AUTOMATION ====================
        
        function processAutomationRules() {
            const controllers = game.nodes.filter(n => n.type === 'logic_controller' && activeNodes.has(n.id) && !n.infected && n.rules && n.rules.length > 0);
            if (controllers.length === 0) return;
            
            controllers.forEach(ctrl => {
                ctrl.rules.forEach(rule => {
                    if (!rule || !rule.condition || !rule.action) return;
                    
                    // Evaluate condition
                    let conditionMet = false;
                    const val = getConditionValue(rule.condition);
                    const threshold = parseFloat(rule.threshold) || 0;
                    
                    switch (rule.comparator) {
                        case '>': conditionMet = val > threshold; break;
                        case '<': conditionMet = val < threshold; break;
                        case '>=': conditionMet = val >= threshold; break;
                        case '<=': conditionMet = val <= threshold; break;
                    }
                    
                    if (!conditionMet) return;
                    
                    // Cooldown: prevent spamming (min 2 seconds between fires per rule)
                    const now = Date.now();
                    if (rule._lastFired && (now - rule._lastFired) < 2000) return;
                    
                    // Execute action
                    executeAutomationAction(rule, ctrl);
                    rule._lastFired = now;
                });
            });
        }
        
        function getConditionValue(condition) {
            switch (condition) {
                case 'money': return game.money;
                case 'heat': return game.routerHeat;
                case 'files': return game.res.files;
                case 'images': return game.res.images;
                case 'videos': return game.res.videos;
                case 'audio': return game.res.audio;
                case 'rp': return game.rp;
                case 'codeBits': return game.codeBits;
                default: return 0;
            }
        }
        
        function executeAutomationAction(rule, ctrl) {
            switch (rule.action) {
                case 'buy_node': {
                    const type = rule.actionTarget;
                    if (!type || !NODE_DEFS[type]) return;
                    const def = NODE_DEFS[type];
                    if (def.req && !game.unlocked.includes(def.req)) return;
                    if (game.money >= def.cost) {
                        buyNode(type);
                        showFloat(`🤖 Auto-bought ${def.name}`, ctrl.x + 30, ctrl.y - 20, '#f472b6');
                    }
                    break;
                }
                case 'upgrade_all': {
                    const type = rule.actionTarget;
                    if (!type || !NODE_DEFS[type]) return;
                    batchUpgrade(type);
                    break;
                }
                case 'overclock_on': {
                    // Find overclock nodes and ensure they exist
                    const ocNodes = game.nodes.filter(n => n.type === 'overclock' && !n.infected);
                    if (ocNodes.length === 0) return;
                    // Overclock is always on if connected - this action connects/activates them
                    showFloat('🤖 Overclock Active', ctrl.x + 30, ctrl.y - 20, '#f59e0b');
                    break;
                }
                case 'overclock_off': {
                    // Can't really "toggle" overclock - it's always active. But we can signal the user.
                    // A future enhancement could add an enabled/disabled flag.
                    showFloat('⚠️ Disconnect OC manually', ctrl.x + 30, ctrl.y - 20, '#ef4444');
                    break;
                }
            }
        }
        
        function openLogicControllerModal(nodeId) {
            const node = game.nodes.find(n => n.id === nodeId);
            if (!node || node.type !== 'logic_controller') return;
            
            if (!node.rules) node.rules = [];
            
            // Close the context menu
            document.getElementById('contextMenu').style.display = 'none';
            
            const modal = document.getElementById('logicControllerModal');
            modal.style.display = 'flex';
            modal.dataset.nodeId = nodeId;
            
            renderLogicRules(node);
            
            // Tutorial callback
            if (window._tutorialOnModalOpened) window._tutorialOnModalOpened('logic_controller');
        }

        
        function renderLogicRules(node) {
            const container = document.getElementById('logicRulesContainer');
            container.innerHTML = '';
            
            const maxRules = 4;
            
            // Build node type options for action targets
            const nodeTypeOptions = Object.keys(NODE_DEFS)
                .filter(k => k !== 'router' && k !== 'logic_controller')
                .map(k => `<option value="${k}">${NODE_DEFS[k].name}</option>`)
                .join('');
            
            for (let i = 0; i < maxRules; i++) {
                const rule = node.rules[i] || {};
                const row = document.createElement('div');
                row.className = 'logic-rule-row';
                row.innerHTML = `
                    <div class="logic-rule-header">
                        <span class="logic-rule-num">Rule ${i + 1}</span>
                        <span class="logic-rule-status ${rule.condition ? 'active' : ''}">${rule.condition ? '● Active' : '○ Empty'}</span>
                    </div>
                    <div class="logic-rule-body">
                        <div class="logic-rule-condition">
                            <label>IF</label>
                            <select class="logic-select" data-rule="${i}" data-field="condition">
                                <option value="">-- Select --</option>
                                <option value="money" ${rule.condition === 'money' ? 'selected' : ''}>Money ($)</option>
                                <option value="heat" ${rule.condition === 'heat' ? 'selected' : ''}>Router Heat (%)</option>
                                <option value="files" ${rule.condition === 'files' ? 'selected' : ''}>Files</option>
                                <option value="images" ${rule.condition === 'images' ? 'selected' : ''}>Images</option>
                                <option value="videos" ${rule.condition === 'videos' ? 'selected' : ''}>Videos</option>
                                <option value="audio" ${rule.condition === 'audio' ? 'selected' : ''}>Audio</option>
                                <option value="rp" ${rule.condition === 'rp' ? 'selected' : ''}>Research Points</option>
                                <option value="codeBits" ${rule.condition === 'codeBits' ? 'selected' : ''}>Code Bits</option>
                            </select>
                            <select class="logic-select logic-select-sm" data-rule="${i}" data-field="comparator">
                                <option value=">" ${rule.comparator === '>' ? 'selected' : ''}>></option>
                                <option value="<" ${rule.comparator === '<' ? 'selected' : ''}><</option>
                                <option value=">=" ${rule.comparator === '>=' ? 'selected' : ''}>≥</option>
                                <option value="<=" ${rule.comparator === '<=' ? 'selected' : ''}>≤</option>
                            </select>
                            <input type="number" class="logic-input" data-rule="${i}" data-field="threshold" value="${rule.threshold || ''}" placeholder="Value">
                        </div>
                        <div class="logic-rule-action">
                            <label>THEN</label>
                            <select class="logic-select" data-rule="${i}" data-field="action">
                                <option value="">-- Select --</option>
                                <option value="buy_node" ${rule.action === 'buy_node' ? 'selected' : ''}>Buy Node</option>
                                <option value="upgrade_all" ${rule.action === 'upgrade_all' ? 'selected' : ''}>Upgrade All</option>
                            </select>
                            <select class="logic-select" data-rule="${i}" data-field="actionTarget" style="${(rule.action === 'buy_node' || rule.action === 'upgrade_all') ? '' : 'display:none'}">
                                <option value="">-- Target --</option>
                                ${nodeTypeOptions}
                            </select>
                        </div>
                    </div>
                `;
                container.appendChild(row);
            }
            
            // Show/hide actionTarget when action changes
            container.querySelectorAll('select[data-field="action"]').forEach(sel => {
                sel.addEventListener('change', (e) => {
                    const row = e.target.closest('.logic-rule-row');
                    const targetSel = row.querySelector('select[data-field="actionTarget"]');
                    if (e.target.value === 'buy_node' || e.target.value === 'upgrade_all') {
                        targetSel.style.display = '';
                    } else {
                        targetSel.style.display = 'none';
                    }
                });
            });
            
            // Pre-select action targets
            for (let i = 0; i < maxRules; i++) {
                const rule = node.rules[i];
                if (rule && rule.actionTarget) {
                    const targetSel = container.querySelector(`select[data-rule="${i}"][data-field="actionTarget"]`);
                    if (targetSel) targetSel.value = rule.actionTarget;
                }
            }
        }
        
        function saveLogicRules() {
            const modal = document.getElementById('logicControllerModal');
            const nodeId = parseInt(modal.dataset.nodeId);
            const node = game.nodes.find(n => n.id === nodeId);
            if (!node) return;
            
            const container = document.getElementById('logicRulesContainer');
            const rules = [];
            
            for (let i = 0; i < 4; i++) {
                const condition = container.querySelector(`select[data-rule="${i}"][data-field="condition"]`)?.value;
                const comparator = container.querySelector(`select[data-rule="${i}"][data-field="comparator"]`)?.value;
                const threshold = container.querySelector(`input[data-rule="${i}"][data-field="threshold"]`)?.value;
                const action = container.querySelector(`select[data-rule="${i}"][data-field="action"]`)?.value;
                const actionTarget = container.querySelector(`select[data-rule="${i}"][data-field="actionTarget"]`)?.value;
                
                if (condition && action) {
                    rules.push({ condition, comparator: comparator || '>', threshold: parseFloat(threshold) || 0, action, actionTarget: actionTarget || '' });
                }
            }
            
            node.rules = rules;
            modal.style.display = 'none';
            logEvent(`Logic Controller updated: ${rules.length} rule(s) active`, 'good');
            showFloat(`🤖 ${rules.length} rule(s) saved`, window.innerWidth/2, window.innerHeight/2, '#f472b6');
            autoSaveLocal();
        }

        function workAnim(node) {
            if (game.ultraLowPerfEnabled && Math.random() > 0.05) return; // Drop 95% of animations in ultra-low perf mode
            const el = document.getElementById(`node-${node.id}`);
            if (el) { el.classList.remove('working'); void el.offsetWidth; el.classList.add('working'); }
        }
        
        function showFloat(txt, x, y, col) {
            if (game.ultraLowPerfEnabled && Math.random() > 0.1) return; // Drop 90% of floating text in ultra-low perf mode
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
            
            // Update display settings UI
            const particlesToggle = document.getElementById('particlesToggle');
            if (particlesToggle) {
                particlesToggle.checked = game.particlesEnabled !== false;
                if (game.particlesEnabled === false) {
                    document.getElementById('particlesContainer').style.display = 'none';
                }
            }
            const animationsToggle = document.getElementById('animationsToggle');
            if (animationsToggle) {
                animationsToggle.checked = game.animationsEnabled !== false;
                if (game.animationsEnabled === false) {
                    document.body.classList.add('reduce-motion');
                }
            }
            const eventAlertsToggle = document.getElementById('eventAlertsToggle');
            if (eventAlertsToggle) {
                eventAlertsToggle.checked = game.eventAlertsEnabled !== false;
            }
            
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
        
