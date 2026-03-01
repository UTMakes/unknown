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
    { id: 'git_vcs', name: 'Git Version Control', tier: 2, cost: 8000, icon: 'fa-brands fa-git-alt', desc: 'Code bits -> passive money ($1/100 bits/s)', effect: 'codeIncome', value: 0.01 },
    { id: 'refactoring', name: 'Code Refactoring', tier: 2, cost: 12000, icon: 'fa-solid fa-arrows-rotate', desc: 'Conversion cost halved (50 bits)', effect: 'conversionDiscount', value: 50 },
    // Tier 3 - Advanced
    { id: 'ai_autocoder', name: 'AI Autocoder', tier: 3, cost: 30000, icon: 'fa-solid fa-robot', desc: '+100% code gen globally', effect: 'codeSpeed', value: 1.0 },
    { id: 'open_source_net', name: 'Open Source Network', tier: 3, cost: 50000, icon: 'fa-solid fa-people-group', desc: 'Every 10 code bits -> 1 RP', effect: 'codeToRP', value: 0.1 },
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
