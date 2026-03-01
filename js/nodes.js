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
    uploader: { name: "Uploader", type: "upload", cost: 500, icon: "fa-solid fa-cloud-arrow-up", color: "#2dd4bf", desc: "Sells data for Money. Essential for income.", bandwidth: 400, ports: ['in', 'out'], flowLevel: 3 },
    lab: { name: "Research Lab", type: "lab", cost: 4500, icon: "fa-solid fa-flask", color: "#8b5cf6", desc: "Converts Files into Research Points (RP).", bandwidth: 400, ports: ['in', 'out'], flowLevel: 3 },
    rack: { name: "Server Rack", type: "special", cost: 18000, icon: "fa-solid fa-server", color: "#f97316", desc: "High density server. Acts as both Downloader AND Uploader.", req: "tech_rack", bandwidth: 800, size: [2, 1], ports: ['in', 'in', 'out', 'out'], flowLevel: 3 },
    quantum: { name: "Quantum Core", type: "special", cost: 150000, icon: "fa-solid fa-atom", color: "#ef4444", desc: "Endgame technology. 2.5x Global Speed multiplier.", req: "tech_quantum", bandwidth: 2000, size: [2, 1], ports: ['in', 'in', 'out', 'out'], flowLevel: 3 },
    master_router: { name: "Master Router", type: "special", cost: 250000, icon: "fa-solid fa-network-wired", color: "#3b82f6", desc: "Double-click to open a private sub-network. Great for organization.", req: "tech_cluster", bandwidth: 2000, size: [2, 1], ports: ['in', 'in', 'out', 'out'], flowLevel: 4 },
    subnet_core: { name: "Subnet Core", type: "core", cost: 0, icon: "fa-solid fa-circle-nodes", color: "#3b82f6", desc: "Core connection to the main network.", bandwidth: 2000, ports: ['in', 'out'], flowLevel: 4 },

    // Advanced - Late game specialization
    proxy: { name: "Proxy Node", type: "advanced", cost: 3500, icon: "fa-solid fa-network-wired", color: "#64748b", desc: "Extends network range without degrading speed.", req: "tech_proxy", bandwidth: 250, ports: ['in', 'out'], flowLevel: 2 },
    compressor: { name: "Compressor", type: "advanced", cost: 8000, icon: "fa-solid fa-compress", color: "#14b8a6", desc: "Reduces file sizes by 35% for faster transfers.", req: "tech_compress", bandwidth: 300, ports: ['in', 'out'], flowLevel: 2 },
    backup: { name: "Backup Server", type: "advanced", cost: 12000, icon: "fa-solid fa-box-archive", color: "#a855f7", desc: "Stores excess data. Generates passive income from stored data.", req: "tech_backup", bandwidth: 350, ports: ['in', 'out'], flowLevel: 3 },
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
