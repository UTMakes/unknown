// GAME VERSION - Update by 0.1 for minor, +1 for major
const GAME_VERSION = "10.3";

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
    miner: { name: "Crypto Miner", type: "infra", cost: 500, icon: "fa-brands fa-bitcoin", color: "#fbbf24", desc: "Uses bandwidth to mine money. Slow but steady income." },
    cache: { name: "Cache Server", type: "infra", cost: 2500, icon: "fa-solid fa-database", color: "#10b981", desc: "Buffers data. Connected downloaders work 50% faster." },
    firewall: { name: "Firewall", type: "infra", cost: 1500, icon: "fa-solid fa-shield-halved", color: "#ef4444", desc: "Prevents virus infection for self and neighbors.", req: "tech_sec" },
    balancer: { name: "Load Balancer", type: "infra", cost: 4500, icon: "fa-solid fa-scale-balanced", color: "#06b6d4", desc: "Distributes data evenly. Boosts connected nodes by 10% per connection.", req: "tech_balance" },
    overclock: { name: "Overclock Unit", type: "infra", cost: 8000, icon: "fa-solid fa-bolt", color: "#f59e0b", desc: "Connect to Router to DOUBLE speed. Generates significant heat!", req: "tech_oc" },
    
    // Downloaders - Tiered progression
    dl_file: { name: "File Downloader", type: "download", out: "files", cost: 300, icon: "fa-solid fa-file-code", color: "#60a5fa", desc: "Downloads small files. Basic data collection." },
    dl_img: { name: "Image Downloader", type: "download", out: "images", cost: 1800, icon: "fa-solid fa-image", color: "#c084fc", desc: "Downloads images. Higher value than files.", req: "tech_img" },
    dl_audio: { name: "Audio Downloader", type: "download", out: "audio", cost: 6000, icon: "fa-solid fa-music", color: "#f472b6", desc: "Downloads audio files. Medium tier resource.", req: "tech_audio" },
    dl_vid: { name: "Video Downloader", type: "download", out: "videos", cost: 15000, icon: "fa-solid fa-film", color: "#f472b6", desc: "Downloads videos. Highest value resource.", req: "tech_vid" },
    
    // Upload & Labs - Money and RP generation
    uploader: { name: "Uploader", type: "upload", cost: 600, icon: "fa-solid fa-cloud-arrow-up", color: "#2dd4bf", desc: "Sells data for Money. Essential for income." },
    lab: { name: "Research Lab", type: "lab", cost: 3500, icon: "fa-solid fa-flask", color: "#8b5cf6", desc: "Converts Files into Research Points (RP)." },
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
    dev_station: { name: "Dev Station", type: "coding", cost: 20000, icon: "fa-solid fa-laptop-code", color: "#00d4aa", desc: "2.5x code bit generation. Advanced driver development.", req: "tech_dev_station" },
    compiler: { name: "Code Compiler", type: "coding", cost: 60000, icon: "fa-solid fa-gears", color: "#00d4aa", desc: "Automatically converts bits to optimization code.", req: "tech_compiler" }
};

const RESOURCES = {
    files: { size: 20, price: 8, rp: 2 },
    images: { size: 80, price: 35, rp: 8 },
    videos: { size: 350, price: 150, rp: 40 },
    audio: { size: 120, price: 55, rp: 15 }
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
    { id: "tech_crypto_farm", name: "Mining Farm", cost: 750000, desc: "Unlock Crypto Farms (massive passive income)", tier: 6, icon: "fa-brands fa-ethereum", requires: ["tech_cluster", "tech_warehouse"] },
    { id: "tech_neural", name: "Neural Network", cost: 1000000, desc: "All nodes +50% efficiency. The ultimate upgrade.", tier: 6, icon: "fa-solid fa-circle-nodes", requires: ["tech_ai", "tech_quantum"] },
];

// ACHIEVEMENTS CONFIGURATION
const ACHIEVEMENTS = [
    // Money Achievements
    { id: 'money_1', name: 'First Profits', desc: 'Earn $1,000 total', icon: 'fa-solid fa-coins', condition: (s) => s.totalMoney >= 1000, reward: 100 },
    { id: 'money_2', name: ' entrepreneur', desc: 'Earn $10,000 total', icon: 'fa-solid fa-sack-dollar', condition: (s) => s.totalMoney >= 10000, reward: 500 },
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
];

// RANDOM EVENTS CONFIGURATION
const RANDOM_EVENTS = [
    // Good Events
    { id: 'market_boom', name: 'Market Boom', desc: 'Data prices are surging!', type: 'good', duration: 60, effect: () => { eventMultipliers.money = 2; }, cleanup: () => { eventMultipliers.money = 1; } },
    { id: 'research_grant', name: 'Research Grant', desc: 'Government funding boost!', type: 'good', duration: 45, effect: () => { eventMultipliers.rp = 2; }, cleanup: () => { eventMultipliers.rp = 1; } },
    { id: 'code_rush', name: 'Code Rush', desc: 'Developers are inspired!', type: 'good', duration: 30, effect: () => { eventMultipliers.code = 3; }, cleanup: () => { eventMultipliers.code = 1; } },
    { id: 'fiber_upgrade', name: 'Fiber Upgrade', desc: 'ISP upgraded your connection!', type: 'good', duration: 120, effect: () => { eventMultipliers.speed = 1.5; }, cleanup: () => { eventMultipliers.speed = 1; } },
    { id: 'investment', name: 'Angel Investment', desc: 'An investor believes in you!', type: 'good', instant: true, effect: (g) => { g.money += 5000; window.showFloat('+ $5,000 (Investment)', window.innerWidth/2, window.innerHeight/2, '#10b981'); } },
    { id: 'bonus_rp', name: 'Research Breakthrough', desc: 'Sudden insight!', type: 'good', instant: true, effect: (g) => { g.rp += 500; window.showFloat('+ 500 RP (Breakthrough!)', window.innerWidth/2, window.innerHeight/2, '#8b5cf6'); } },
    
    // Bad Events
    { id: 'market_crash', name: 'Market Crash', desc: 'Data prices are plummeting!', type: 'bad', duration: 60, effect: () => { eventMultipliers.money = 0.5; }, cleanup: () => { eventMultipliers.money = 1; } },
    { id: 'power_outage', name: 'Power Outage', desc: 'Reduced efficiency!', type: 'bad', duration: 30, effect: () => { eventMultipliers.speed = 0.5; }, cleanup: () => { eventMultipliers.speed = 1; } },
    { id: 'ddos_attack', name: 'DDoS Attack', desc: 'Network under attack!', type: 'bad', duration: 45, effect: () => { eventMultipliers.speed = 0.3; }, cleanup: () => { eventMultipliers.speed = 1; } },
    { id: 'maintenance', name: 'Emergency Maintenance', desc: 'Servers need repairs!', type: 'bad', instant: true, effect: (g) => { g.money = Math.max(0, g.money - 2000); window.showFloat('- $2,000 (Maintenance)', window.innerWidth/2, window.innerHeight/2, '#ef4444'); } },
    { id: 'data_breach', name: 'Data Breach', desc: 'Security incident!', type: 'bad', instant: true, effect: (g) => { g.rp = Math.max(0, g.rp - 200); window.showFloat('- 200 RP (Breach)', window.innerWidth/2, window.innerHeight/2, '#ef4444'); } },
];

export { GAME_VERSION, DAILY_REWARDS, MILESTONES, NODE_DEFS, RESOURCES, DRIVERS, TECH_TREE, ACHIEVEMENTS, RANDOM_EVENTS };
