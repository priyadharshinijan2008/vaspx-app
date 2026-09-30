// VASPX - Virtual Asset Service Provider Attribution & Blockchain Intelligence Platform
// Main Application Bundle with Full Functionality & Enterprise Light Theme

const { useState, useEffect, useRef, useMemo } = React;

// --- INITIAL MOCK DATABASE & SEED DATA ---
const INITIAL_DEMO_USERS = {
  "investigator@vaspx.demo": {
    name: "Inspector Vikram Rathore",
    email: "investigator@vaspx.demo",
    password: "password123",
    role: "LEA INVESTIGATOR",
    org: "National Cyber Crime Threat Intelligence Unit",
    lastLogin: "2026-09-29 11:20:15",
    activeCases: 8,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
  },
  "supervisor@vaspx.demo": {
    name: "Superintendent Ananya Sharma",
    email: "supervisor@vaspx.demo",
    password: "password123",
    role: "SENIOR INVESTIGATOR / SUPERVISOR",
    org: "Cyber Crime Directorate General",
    lastLogin: "2026-09-29 09:45:00",
    activeCases: 24,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
  },
  "admin@vaspx.demo": {
    name: "Director Rajesh Kumar",
    email: "admin@vaspx.demo",
    password: "password123",
    role: "ADMINISTRATOR",
    org: "VASPX System Administration",
    lastLogin: "2026-09-29 08:12:30",
    activeCases: 0,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
  }
};

const DEMO_CASE = {
  id: "CASE-2026-001",
  title: "Operation CyberShield: Ransomware Proceeds Laundering",
  suspectWallet: "0x71C7656EC7ab88b098defB751B7401B5f6d89A2",
  chain: "Ethereum",
  riskLevel: "HIGH",
  status: "Under Investigation",
  investigator: "Inspector Vikram Rathore",
  createdDate: "2026-09-28 14:30",
  lastUpdated: "2026-09-29 11:15",
  balance: "142.85 ETH ($385,695.00 USD)",
  txCount: 124,
  firstSeen: "2026-08-14 09:12",
  lastSeen: "2026-09-29 10:45",
  incomingVol: "840.50 ETH",
  outgoingVol: "697.65 ETH",
  attribution: {
    vaspCandidate: "VASP Alpha (Global Centralized Exchange)",
    confidence: 87,
    hopDistance: 2,
    evidenceQuality: "Strong",
    directDeposit: true,
    depositAddress: "0x3F88a91B24dE28a01C8974dF2356B278d6541A91",
    signals: [
      { name: "Known VASP address match", score: "+30%", desc: "Deposit address belongs to VASP Alpha cluster" },
      { name: "Repeated interaction frequency", score: "+20%", desc: "18 transactions routed in 48 hours" },
      { name: "Short graph hop distance", score: "+15%", desc: "Reaches direct deposit within 2 hops" },
      { name: "Direct deposit relationship", score: "+15%", desc: "Fund transfer directly to identified customer deposit" },
      { name: "Temporal consistency", score: "+10%", desc: "Consistently active during Asian market trading hours" },
      { name: "Supporting threat intelligence", score: "+10%", desc: "Targeted in INTERPOL Cyber Notice #2026-88" }
    ]
  },
  riskBreakdown: {
    fraud: 80,
    mixer: 70,
    darknet: 20,
    sanctions: 0
  },
  typologies: [
    { title: "Peeling Chain Laundering", confidence: "High (92%)", desc: "Large sums split into small decrements across 5 hop paths." },
    { title: "Cross-Chain Swap Hop", confidence: "Medium (78%)", desc: "Funds bridged via Cross-Chain Service to USDT on Polygon." },
    { title: "Rapid Movement", confidence: "High (89%)", desc: "Average hop duration under 4 minutes." }
  ]
};

const INITIAL_VASPS = [
  { id: "vasp-alpha", name: "VASP Alpha", type: "Centralized Exchange", country: "Singapore", jurisdiction: "MAS Authorized", code: "SG-MAS-2024", risk: "Low", cases: 14, wallets: 1420, lat: 1.3521, lng: 103.8198 },
  { id: "binance", name: "Binance Global", type: "Centralized Exchange", country: "UAE", jurisdiction: "VARA Licensed", code: "UAE-VARA-8812", risk: "Low", cases: 42, wallets: 18450, lat: 25.2048, lng: 55.2708 },
  { id: "coinbase", name: "Coinbase Prime", type: "Custodial Exchange", country: "United States", jurisdiction: "US FinCEN Registered", code: "US-MSB-31000", risk: "Low", cases: 8, wallets: 12200, lat: 37.7749, lng: -122.4194 },
  { id: "kraken", name: "Kraken Pay", type: "Trading Platform", country: "United States", jurisdiction: "US FinCEN", code: "US-MSB-99812", risk: "Low", cases: 6, wallets: 6400, lat: 40.7128, lng: -74.0060 },
  { id: "coindcx", name: "CoinDCX LEA Portal", type: "Centralized Exchange", country: "India", jurisdiction: "FIU-IND Registered", code: "IND-FIU-7721", risk: "Low", cases: 28, wallets: 5100, lat: 19.0760, lng: 72.8777 },
  { id: "wazirx", name: "WazirX India", type: "Centralized Exchange", country: "India", jurisdiction: "FIU-IND Registered", code: "IND-FIU-4410", risk: "Medium", cases: 19, wallets: 3800, lat: 28.6139, lng: 77.2090 },
  { id: "tornado", name: "Tornado Cash Protocol", type: "Mixer / Tumbler", country: "Decentralized", jurisdiction: "OFAC Sanctioned Entity", code: "SANCTIONED-OFAC", risk: "High", cases: 67, wallets: 890, lat: 52.3676, lng: 4.9041 },
  { id: "renbridge", name: "RenBridge Liquidity", type: "DeFi Bridge", country: "Decentralized", jurisdiction: "Unregulated Bridge", code: "DEFI-BRIDGE-01", risk: "Medium", cases: 15, wallets: 1120, lat: 51.5074, lng: -0.1278 }
];

const GRAPH_NODES = [
  { data: { id: 'suspect', label: '0x71C7...89A2\n(Suspect Wallet)', type: 'suspect', risk: 'HIGH', hop: 0 } },
  { data: { id: 'w_a', label: '0xA19B...44EF\n(Intermediary)', type: 'wallet', risk: 'MEDIUM', hop: 1 } },
  { data: { id: 'w_b', label: '0xB89C...12D4\n(Layering Wallet)', type: 'wallet', risk: 'HIGH', hop: 1 } },
  { data: { id: 'mixer', label: 'Tornado Cash\n(Mixer Pool)', type: 'mixer', risk: 'HIGH', hop: 2 } },
  { data: { id: 'bridge', label: 'Cross-Chain Bridge\n(BTC <-> ETH)', type: 'bridge', risk: 'MEDIUM', hop: 2 } },
  { data: { id: 'deposit_alpha', label: '0x3F88...1A91\n(Deposit Wallet)', type: 'deposit', risk: 'MEDIUM', hop: 2 } },
  { data: { id: 'vasp_alpha', label: 'VASP Alpha\n(Exchange Cluster)', type: 'vasp', risk: 'LOW', hop: 3 } },
  { data: { id: 'hot_wallet', label: 'VASP Hot Wallet\n(Liquidity Pool)', type: 'hotwallet', risk: 'LOW', hop: 3 } }
];

const GRAPH_EDGES = [
  { data: { source: 'suspect', target: 'w_a', label: '42.5 ETH', type: 'SENT' } },
  { data: { source: 'suspect', target: 'w_b', label: '85.0 ETH', type: 'SENT' } },
  { data: { source: 'w_a', target: 'mixer', label: '20.0 ETH', type: 'PASSED_THROUGH' } },
  { data: { source: 'w_b', target: 'bridge', label: '65.0 ETH', type: 'CROSS_CHAIN_TRANSFER' } },
  { data: { source: 'w_b', target: 'deposit_alpha', label: '20.0 ETH', type: 'DEPOSITED_TO' } },
  { data: { source: 'deposit_alpha', target: 'vasp_alpha', label: '20.0 ETH', type: 'ASSOCIATED_WITH' } },
  { data: { source: 'vasp_alpha', target: 'hot_wallet', label: 'Internal Sweep', type: 'CONNECTED' } }
];

const INITIAL_ALERTS = [
  { id: "ALT-901", severity: "CRITICAL", title: "Direct VASP Deposit Detected", wallet: "0x71C7...89A2", time: "10 min ago", caseId: "CASE-2026-001", reason: "Funds deposited directly to VASP Alpha deposit address 0x3F88...1A91." },
  { id: "ALT-902", severity: "HIGH", title: "Mixer Interaction Alert", wallet: "0xA19B...44EF", time: "25 min ago", caseId: "CASE-2026-001", reason: "20.0 ETH routed into Tornado Cash Mixer pool." },
  { id: "ALT-903", severity: "HIGH", title: "Cross-Chain Flow Initiated", wallet: "0xB89C...12D4", time: "1 hour ago", caseId: "CASE-2026-001", reason: "Cross-chain swap executed via DeFi Bridge to Polygon USDT." },
  { id: "ALT-904", severity: "MEDIUM", title: "High Volume Transfer", wallet: "bc1qdemo9912", time: "2 hours ago", caseId: "CASE-2026-004", reason: "Single transfer of 14.8 BTC ($980,000 USD) observed." }
];

const INITIAL_REQUESTS = [
  { id: "REQ-2026-881", caseId: "CASE-2026-001", vasp: "VASP Alpha", type: "Information Disclosure Request", status: "SAHYOG Submitted", targetWallet: "0x3F88...1A91", date: "2026-09-29 09:30", sahyogId: "SAHYOG-IND-99412" },
  { id: "REQ-2026-882", caseId: "CASE-2026-001", vasp: "VASP Alpha", type: "Asset Freezing Request", status: "Pending Supervisor Review", targetWallet: "0x3F88...1A91", date: "2026-09-29 10:45", sahyogId: "SAHYOG-DRAFT-002" },
  { id: "REQ-2026-879", caseId: "CASE-2026-003", vasp: "Binance Global", type: "Information Disclosure Request", status: "Completed", targetWallet: "0x19F...8811", date: "2026-09-27 16:20", sahyogId: "SAHYOG-IND-88192" }
];

const INITIAL_AUDIT_LOGS = [
  { id: "LOG-1009", user: "Inspector Vikram Rathore", role: "LEA INVESTIGATOR", action: "CASE_ATTRIBUTION_QUERY", target: "CASE-2026-001", time: "2026-09-29 11:25:04", ip: "10.204.14.88", status: "SUCCESS" },
  { id: "LOG-1008", user: "Inspector Vikram Rathore", role: "LEA INVESTIGATOR", action: "SAHYOG_REQUEST_DRAFT", target: "REQ-2026-882", time: "2026-09-29 10:45:12", ip: "10.204.14.88", status: "SUCCESS" },
  { id: "LOG-1007", user: "Superintendent Ananya Sharma", role: "SUPERVISOR", action: "SAHYOG_REQUEST_APPROVED", target: "REQ-2026-881", time: "2026-09-29 09:30:00", ip: "10.204.10.12", status: "SUCCESS" },
  { id: "LOG-1006", user: "Director Rajesh Kumar", role: "ADMINISTRATOR", action: "VASP_DATABASE_UPDATE", target: "VASP Alpha (Singapore)", time: "2026-09-29 08:15:22", ip: "10.204.0.1", status: "SUCCESS" }
];

// --- MAIN REACT APPLICATION COMPONENT ---
function VaspxApp() {
  // Global State
  const [currentUser, setCurrentUser] = useState(INITIAL_DEMO_USERS["investigator@vaspx.demo"]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeTab, setActiveTab] = useState("command");
  const [cases, setCases] = useState([DEMO_CASE]);
  const [activeCase, setActiveCase] = useState(DEMO_CASE);
  const [vasps, setVasps] = useState(INITIAL_VASPS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [investigationProgress, setInvestigationProgress] = useState(0);
  const [investigationStep, setInvestigationStep] = useState("");
  const [fullScreenCommand, setFullScreenCommand] = useState(false);
  const [notificationCount, setNotificationCount] = useState(4);

  const [loginEmail, setLoginEmail] = useState("investigator@vaspx.demo");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [loginError, setLoginError] = useState("");
  const [showCredsModal, setShowCredsModal] = useState(false);
  const [trackingPrecisionMode, setTrackingPrecisionMode] = useState(true);
  const [trackingSearch, setTrackingSearch] = useState("");
  const [selectedTelemetryTx, setSelectedTelemetryTx] = useState(null);
  const [copyToast, setCopyToast] = useState("");

  // Live Tracking Stream State with Precise On-Chain Telemetry
  const [liveStream, setLiveStream] = useState([
    {
      id: 'tx-1',
      time: '11:42:01.428 UTC',
      block: 20842918,
      txHash: '0x8A92F1C4E78129B0D8A456C19E77F1295D34571A9B6721098F261907A3E6290C',
      from: '0x71C7656EC7ab88b098defB751B7401B5f6d89A2',
      to: '0x3F88a91B24dE28a01C8974dF2356B278d6541A91',
      amount: '2.481902 ETH',
      fiat: '$6,701.14 USD',
      fee: '0.00031 ETH ($0.84)',
      gasGwei: '14.2 Gwei',
      chain: 'Ethereum',
      risk: 'HIGH',
      confidence: '98.4%',
      vaspTarget: 'VASP Alpha Cluster',
      entity: 'Direct VASP Deposit (Hop 0)',
      confirmations: '16 Confirmed',
      nonce: 142,
      gasUsed: 21000
    },
    {
      id: 'tx-2',
      time: '11:41:55.109 UTC',
      block: 863412,
      txHash: 'TX#92AF874B012CD678912E4FA5610816BCA67091B08C2369DF12760814BC1289',
      from: 'bc1qdemo9912098412859102482390184209418290',
      to: 'bc1qvasp8810294819028409182904812094812094',
      amount: '1.920450 BTC',
      fiat: '$126,749.70 USD',
      fee: '0.00012 BTC ($7.92)',
      gasGwei: '18 Sat/vB',
      chain: 'Bitcoin',
      risk: 'MEDIUM',
      confidence: '84.2%',
      vaspTarget: 'Binance Custodial',
      entity: 'Intermediary Layering (Hop 1)',
      confirmations: '6 Confirmed',
      nonce: 4,
      gasUsed: 250
    },
    {
      id: 'tx-3',
      time: '11:41:48.882 UTC',
      block: 20842915,
      txHash: '0x33B10C9941AE87B1902481740209481702984102948102948102948102948102',
      from: '0xA19B8820481028401928401928401928401944EF',
      to: '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b',
      amount: '20.000000 ETH',
      fiat: '$54,000.00 USD',
      fee: '0.00142 ETH ($3.83)',
      gasGwei: '24.8 Gwei',
      chain: 'Ethereum',
      risk: 'CRITICAL',
      confidence: '99.9%',
      vaspTarget: 'Sanctioned Mixer',
      entity: 'Tornado.Cash 10 ETH Pool Contract',
      confirmations: '19 Confirmed',
      nonce: 88,
      gasUsed: 145000
    },
    {
      id: 'tx-4',
      time: '11:41:30.214 UTC',
      block: 65192841,
      txHash: 'TRX#771A90B28C140928401928401928401928401928401928401928401928401928',
      from: 'T9xZ18204810294810294810294810294810288A',
      to: 'T8mV2810294810294810294810294810294810210X',
      amount: '45,000.000000 TRX',
      fiat: '$6,975.00 USD',
      fee: '1.20 TRX ($0.18)',
      gasGwei: '420 Bandwidth',
      chain: 'Tron',
      risk: 'LOW',
      confidence: '91.0%',
      vaspTarget: 'Centralized Custody',
      entity: 'Internal Omnibus Sweep',
      confirmations: '124 Confirmed',
      nonce: 19,
      gasUsed: 35000
    }
  ]);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(true);

  // Initialize Lucide Icons after render
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // Simulated WebSocket Live Stream with High-Precision Telemetry
  useEffect(() => {
    if (!isLiveStreamActive) return;
    const interval = setInterval(() => {
      const chains = ['Bitcoin', 'Ethereum', 'Tron', 'BNB Chain', 'Solana', 'Polygon'];
      const risks = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
      const randomChain = chains[Math.floor(Math.random() * chains.length)];
      const randomRisk = risks[Math.floor(Math.random() * risks.length)];
      const randomAmount = (Math.random() * 8 + 0.1).toFixed(6);
      const isTarget = randomRisk === 'HIGH' || randomRisk === 'CRITICAL';
      const blockNum = 20842920 + Math.floor(Math.random() * 400);
      const gas = (12 + Math.random() * 22).toFixed(1);
      const conf = (87 + Math.random() * 12.8).toFixed(1);
      const hex64 = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const hex40From = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const hex40To = isTarget ? '0x3F88a91B24dE28a01C8974dF2356B278d6541A91' : '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const fiatVal = (parseFloat(randomAmount) * (randomChain === 'Bitcoin' ? 66000 : randomChain === 'Ethereum' ? 2700 : 150)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      const newTx = {
        id: 'tx-' + Date.now(),
        time: new Date().toISOString().substring(11, 23) + ' UTC',
        block: blockNum,
        txHash: hex64,
        from: hex40From,
        to: hex40To,
        amount: `${randomAmount} ${randomChain === 'Bitcoin' ? 'BTC' : randomChain === 'Ethereum' ? 'ETH' : 'USDT'}`,
        fiat: `$${fiatVal} USD`,
        fee: `${(Math.random() * 0.0006 + 0.0001).toFixed(6)} ${randomChain === 'Bitcoin' ? 'BTC' : 'ETH'}`,
        gasGwei: `${gas} Gwei`,
        chain: randomChain,
        risk: randomRisk,
        confidence: `${conf}%`,
        vaspTarget: isTarget ? (randomRisk === 'CRITICAL' ? 'Tornado Cash Pool' : 'VASP Alpha Cluster') : 'Binance Custodial',
        entity: isTarget ? (randomRisk === 'HIGH' ? 'Direct VASP Deposit (Hop 0)' : 'Mixer Deposit Contract') : 'Intermediary Transit (Hop 1)',
        confirmations: `${Math.floor(Math.random() * 12 + 1)} / 12 Confirmed`,
        nonce: Math.floor(Math.random() * 300),
        gasUsed: Math.floor(21000 + Math.random() * 80000)
      };

      setLiveStream(prev => [newTx, ...prev.slice(0, 24)]);
    }, 3800);
    return () => clearInterval(interval);
  }, [isLiveStreamActive]);

  // Demo Login Handler
  const handleLogin = (email, password = "") => {
    const userKey = email.trim();
    if (INITIAL_DEMO_USERS[userKey]) {
      setCurrentUser(INITIAL_DEMO_USERS[userKey]);
      setIsAuthenticated(true);
      setLoginError("");
      addAuditLog("USER_LOGIN", userKey, "Session Authenticated via Secure Credentials");
    } else {
      // Fallback: If custom LEA investigator email entered
      setCurrentUser({
        name: userKey.split('@')[0].toUpperCase(),
        email: userKey,
        password: password || "password123",
        role: "LEA INVESTIGATOR",
        org: "Authorized Law Enforcement Agency",
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
        activeCases: 1,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
      });
      setIsAuthenticated(true);
      setLoginError("");
      addAuditLog("USER_LOGIN", userKey, "Session Authenticated via LEA Access Token");
    }
  };

  const copyToClipboard = (text, label = "Copied to clipboard!") => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopyToast(label);
    setTimeout(() => setCopyToast(""), 2500);
  };

  // Switch Active User / Role
  const switchRole = (email) => {
    if (INITIAL_DEMO_USERS[email]) {
      setCurrentUser(INITIAL_DEMO_USERS[email]);
      addAuditLog("ROLE_SWITCH", email, `Switched view to ${INITIAL_DEMO_USERS[email].role}`);
    }
  };

  // Add Audit Log Entry
  const addAuditLog = (action, target, details) => {
    const newLog = {
      id: "LOG-" + Math.floor(1000 + Math.random() * 9000),
      user: currentUser.name,
      role: currentUser.role,
      action: action,
      target: target,
      time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ip: "10.204.14.88",
      status: "SUCCESS"
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Run Demo Investigation Process
  const startInvestigation = (walletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d89A2") => {
    setIsInvestigating(true);
    setInvestigationProgress(0);

    const steps = [
      "STEP 1: Validating Wallet Syntax & Address Format...",
      "STEP 2: Identifying Blockchain Network & Contract Type...",
      "STEP 3: Fetching On-Chain & Off-Chain Transaction History...",
      "STEP 4: Constructing Multi-Hop Graph Nodes & Edges...",
      "STEP 5: Tracing Intermediary Wallet Hop Distances...",
      "STEP 6: Querying Known VASP Deposit & Hot Wallet Database...",
      "STEP 7: Performing Cross-Chain Bridge & Swap Detection...",
      "STEP 8: Computing Risk Engine Laundering Typologies...",
      "STEP 9: Calculating Explainable VASP Attribution Score...",
      "STEP 10: Finalizing Intelligence Report & Command View..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setInvestigationStep(steps[currentStep]);
        setInvestigationProgress(((currentStep + 1) / steps.length) * 100);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsInvestigating(false);
          setActiveTab("command");
          addAuditLog("WALLET_INVESTIGATION_RUN", walletAddress, "Attribution Engine completed analysis");
        }, 500);
      }
    }, 350);
  };

  // Render Top Header
  const renderHeader = () => (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-sky-500/20">
            V
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-slate-900 text-lg tracking-tight">VASPX</h1>
              <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-200 uppercase">
                LEA AUTHORIZED
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Virtual Asset Service Provider Attribution Platform</p>
          </div>
        </div>
      </div>

      {/* Center Tagline / Quick Demo Button */}
      <div className="hidden md:flex items-center space-x-3 bg-slate-100/80 px-4 py-1.5 rounded-full border border-slate-200">
        <span className="text-xs font-semibold text-slate-600">
          "Trace the Flow. Identify the VASP. Accelerate Investigation."
        </span>
        <button
          onClick={() => startInvestigation("0x71C7656EC7ab88b098defB751B7401B5f6d89A2")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm transition flex items-center space-x-1"
        >
          <i data-lucide="play" className="w-3.5 h-3.5 inline"></i>
          <span>RUN DEMO INVESTIGATION</span>
        </button>
      </div>

      {/* Right User Controls */}
      <div className="flex items-center space-x-4">
        {/* Role Switcher */}
        <select
          value={currentUser.email}
          onChange={(e) => switchRole(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-2 focus:ring-sky-500"
        >
          <option value="investigator@vaspx.demo">Role: LEA Investigator</option>
          <option value="supervisor@vaspx.demo">Role: Supervisor</option>
          <option value="admin@vaspx.demo">Role: Administrator</option>
        </select>

        {/* Notifications Button */}
        <button
          onClick={() => setActiveTab("alerts")}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          title="Alerts & Notifications"
        >
          <i data-lucide="bell" className="w-5 h-5"></i>
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Credentials Quick-View Modal Toggle */}
        <button
          onClick={() => setShowCredsModal(true)}
          className="flex items-center space-x-1.5 bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          title="View Authorized Login Credentials"
        >
          <i data-lucide="key" className="w-4 h-4 text-amber-600"></i>
          <span>Login IDs & Passwords</span>
        </button>

        {/* AI Copilot Drawer Toggle */}
        <button
          onClick={() => setIsCopilotOpen(!isCopilotOpen)}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 text-sky-700 hover:bg-sky-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
        >
          <i data-lucide="sparkles" className="w-4 h-4 text-sky-600"></i>
          <span>AI Copilot</span>
        </button>

        {/* User Avatar & Logout */}
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
          <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full border border-slate-300 object-cover" />
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
            <div className="text-[10px] text-slate-500 font-medium">{currentUser.role}</div>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
            title="Sign Out"
          >
            <i data-lucide="log-out" className="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </header>
  );

  // Render Left Navigation Sidebar
  const renderSidebar = () => {
    const navItems = [
      { id: "command", label: "Command Center", icon: "shield-alert", badge: "MAIN" },
      { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
      { id: "cases", label: "Cases Management", icon: "folder-kanban", count: cases.length },
      { id: "investigate", label: "Investigate Wallet", icon: "search" },
      { id: "tracking", label: "Live Tracking", icon: "activity", badge: "LIVE" },
      { id: "graph", label: "Graph Explorer", icon: "network" },
      { id: "map", label: "Global VASP Map", icon: "globe" },
      { id: "vasp", label: "VASP Intelligence", icon: "building-2" },
      { id: "crosschain", label: "Cross-Chain Flow", icon: "git-merge" },
      { id: "risk", label: "Risk Center", icon: "alert-triangle" },
      { id: "alerts", label: "Alert Center", icon: "bell-ring", count: alerts.length },
      { id: "requests", label: "SAHYOG Requests", icon: "file-check-2", badge: "API" },
      { id: "reports", label: "Investigation Reports", icon: "file-text" },
      { id: "audit", label: "Audit Logs", icon: "shield-check" },
      { id: "settings", label: "Settings", icon: "settings" }
    ];

    return (
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Investigation Modules
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white font-semibold shadow-md shadow-slate-900/10"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <i data-lucide={item.icon} className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-400"}`}></i>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isActive ? "bg-sky-500 text-white" : "bg-sky-100 text-sky-700"
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && !item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* System Authorization Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 badge-pulse"></span>
            <span>SAHYOG API Gateway: Online</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">VASPX Engine v2.4 • Law Enforcement Mode</p>
        </div>
      </aside>
    );
  };

  // Render Welcome Banner
  const renderWelcomeBanner = () => (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center space-x-2 bg-sky-500/20 border border-sky-400/30 px-3 py-1 rounded-full text-sky-300 text-xs font-semibold mb-2">
            <i data-lucide="shield-check" className="w-3.5 h-3.5"></i>
            <span>Authorized LEA Intelligence Portal</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-slate-300 text-xs mt-1">
            {currentUser.org} • {currentUser.role}
          </p>
        </div>

        <div className="flex items-center space-x-6 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10">
          <div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Active Cases</div>
            <div className="text-xl font-bold text-white">{currentUser.activeCases}</div>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Last Session</div>
            <div className="text-xs font-mono text-slate-200">{currentUser.lastLogin}</div>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">SAHYOG Status</div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>AUTHENTICATED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // VIEW 1: COMMAND CENTER (HACKATHON MAIN PRESENTATION SCREEN)
  const renderCommandCenter = () => {
    return (
      <div className={`space-y-6 ${fullScreenCommand ? "fixed inset-0 z-50 bg-slate-900 text-white p-6 overflow-y-auto" : ""}`}>
        {/* Command Header Banner */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border ${
          fullScreenCommand ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-rose-100 text-rose-800 border border-rose-200 font-extrabold text-xs rounded-lg uppercase">
              HIGH RISK CASE
            </span>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="font-extrabold text-lg tracking-tight">{DEMO_CASE.id}: {DEMO_CASE.title}</h2>
                <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full border border-slate-200 font-mono">
                  {DEMO_CASE.chain}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Suspect Target: <span className="font-semibold text-sky-600">{DEMO_CASE.suspectWallet}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-3 md:mt-0">
            <button
              onClick={() => setFullScreenCommand(!fullScreenCommand)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center space-x-1.5"
            >
              <i data-lucide={fullScreenCommand ? "minimize-2" : "maximize-2"} className="w-4 h-4"></i>
              <span>{fullScreenCommand ? "EXIT FULL SCREEN" : "ENTER FULL SCREEN"}</span>
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition flex items-center space-x-2"
            >
              <i data-lucide="send" className="w-4 h-4"></i>
              <span>ROUTE SAHYOG REQUEST</span>
            </button>
          </div>
        </div>

        {/* 3-Column Layout: Left (Profile) | Center (Graph) | Right (VASP Attribution) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Wallet Profile & Metrics (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className={`p-5 rounded-2xl border ${fullScreenCommand ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Suspect Wallet Profile</h3>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Address</div>
                  <div className="font-mono font-semibold text-slate-800 break-all bg-slate-50 p-2 rounded border border-slate-200 mt-1">
                    {DEMO_CASE.suspectWallet}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400 font-semibold">Balance</div>
                    <div className="font-bold text-slate-900 mt-0.5">{DEMO_CASE.balance.split(' ')[0]} {DEMO_CASE.balance.split(' ')[1]}</div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400 font-semibold">Total TXs</div>
                    <div className="font-bold text-slate-900 mt-0.5">{DEMO_CASE.txCount}</div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>First Seen:</span>
                    <span className="font-mono font-medium">{DEMO_CASE.firstSeen}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Last Active:</span>
                    <span className="font-mono font-medium">{DEMO_CASE.lastSeen}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Incoming Volume:</span>
                    <span className="font-mono font-semibold text-emerald-600">+{DEMO_CASE.incomingVol}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Outgoing Volume:</span>
                    <span className="font-mono font-semibold text-rose-600">-{DEMO_CASE.outgoingVol}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Breakdown Card */}
            <div className={`p-5 rounded-2xl border ${fullScreenCommand ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">Target Risk Analysis</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span className="text-slate-700">Fraud & Scam Exposure</span>
                    <span className="text-rose-600 font-bold">80%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[80%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span className="text-slate-700">Mixer / Tumbler Exposure</span>
                    <span className="text-amber-600 font-bold">70%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[70%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span className="text-slate-700">Darknet Exposure</span>
                    <span className="text-sky-600 font-bold">20%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full w-[20%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Interactive Graph Visualization (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className={`p-5 rounded-2xl border flex flex-col h-[520px] ${
              fullScreenCommand ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <i data-lucide="network" className="w-4 h-4 text-sky-600"></i>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Interactive Multi-Hop Transaction Graph
                  </h3>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded font-mono">
                    2 Hop Path Active
                  </span>
                </div>
              </div>

              {/* Cytoscape Container Element */}
              <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center">
                {/* SVG Visual Graph Fallback & Canvas Renderer */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-auto">
                  <div className="flex justify-between items-start text-xs z-10">
                    <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-200 shadow-sm space-y-1">
                      <div className="font-bold text-slate-800 text-[11px]">Graph Legend</div>
                      <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span>Suspect Target</span></div>
                      <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>Intermediary / Mixer</span></div>
                      <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>VASP Deposit Address</span></div>
                    </div>
                  </div>

                  {/* Visual Node Diagram representation */}
                  <div className="my-auto flex items-center justify-between px-6 relative">
                    <div className="text-center z-10">
                      <div className="w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-rose-200 mx-auto">
                        0x71C7
                      </div>
                      <div className="text-[10px] font-bold mt-1.5 text-slate-800">Suspect Wallet</div>
                      <div className="text-[9px] text-rose-600 font-mono font-semibold">Hop 0</div>
                    </div>

                    <div className="h-0.5 flex-1 bg-gradient-to-r from-rose-400 to-amber-400 relative">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[9px] px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                        85.0 ETH
                      </span>
                    </div>

                    <div className="text-center z-10">
                      <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold shadow-md ring-4 ring-amber-100 mx-auto">
                        0xB89C
                      </div>
                      <div className="text-[10px] font-bold mt-1.5 text-slate-800">Layering Wallet</div>
                      <div className="text-[9px] text-amber-600 font-mono font-semibold">Hop 1</div>
                    </div>

                    <div className="h-0.5 flex-1 bg-gradient-to-r from-amber-400 to-emerald-400 relative">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[9px] px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                        20.0 ETH
                      </span>
                    </div>

                    <div className="text-center z-10">
                      <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-emerald-200 mx-auto animate-pulse">
                        VASP
                      </div>
                      <div className="text-[10px] font-bold mt-1.5 text-slate-900">VASP Alpha</div>
                      <div className="text-[9px] text-emerald-600 font-mono font-bold">2 Hops (87% Conf.)</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 bg-white/80 p-2 rounded-lg border border-slate-200">
                    <span>Shortest Hop Path: <strong className="text-slate-800">Suspect → 0xB89C → Deposit 0x3F88 → VASP Alpha</strong></span>
                    <span className="font-semibold text-emerald-700">DIRECT DEPOSIT DETECTED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Nearest Direct Deposit VASP & Explainable Confidence (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className={`p-5 rounded-2xl border ${fullScreenCommand ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Nearest Direct Deposit VASP</h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  MATCH FOUND
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-900 text-base">{DEMO_CASE.attribution.vaspCandidate}</div>
                  <div className="text-xs text-emerald-700 mt-0.5 font-medium">Type: Centralized Exchange • Singapore</div>

                  <div className="mt-3 flex items-center justify-between bg-white p-2.5 rounded-lg border border-emerald-200">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Attribution Confidence</div>
                      <div className="text-2xl font-black text-emerald-600">{DEMO_CASE.attribution.confidence}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Graph Hop Distance</div>
                      <div className="text-lg font-bold text-slate-800">{DEMO_CASE.attribution.hopDistance} Hops</div>
                    </div>
                  </div>
                </div>

                {/* Explainable Signals Breakdown */}
                <div>
                  <div className="text-xs font-bold text-slate-700 mb-2">Explainable Intelligence Signals</div>
                  <div className="space-y-2 text-[11px]">
                    {DEMO_CASE.attribution.signals.map((sig, idx) => (
                      <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-slate-800">{sig.name}</div>
                          <div className="text-[10px] text-slate-500">{sig.desc}</div>
                        </div>
                        <span className="font-mono font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded ml-2">
                          {sig.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Transaction Timeline Slider */}
        <div className={`p-5 rounded-2xl border ${fullScreenCommand ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">Chronological Fund Flow Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-400 font-semibold">10:30 AM</div>
              <div className="font-bold text-slate-800">Case Created & Wallet Flagged</div>
              <p className="text-[11px] text-slate-500 mt-1">Wallet 0x71C7... tagged in ransomware report.</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-400 font-semibold">10:33 AM</div>
              <div className="font-bold text-slate-800">Multi-Hop Path Traced</div>
              <p className="text-[11px] text-slate-500 mt-1">20.0 ETH moved to layering wallet 0xB89C.</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-400 font-semibold">10:37 AM</div>
              <div className="font-bold text-emerald-700">VASP Deposit Identified</div>
              <p className="text-[11px] text-slate-500 mt-1">Direct deposit address 0x3F88 routed to VASP Alpha.</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-400 font-semibold">10:40 AM</div>
              <div className="font-bold text-slate-800">SAHYOG Request Drafted</div>
              <p className="text-[11px] text-slate-500 mt-1">Information disclosure request sent for supervisor approval.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // VIEW 2: MAIN DASHBOARD
  const renderDashboard = () => (
    <div className="space-y-6">
      {renderWelcomeBanner()}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { title: "ACTIVE CASES", val: "24", icon: "folder", color: "sky" },
          { title: "WALLETS ANALYZED", val: "1,284", icon: "wallet", color: "indigo" },
          { title: "TRANSACTIONS TRACED", val: "2.8M", icon: "activity", color: "cyan" },
          { title: "VASP ATTRIBUTIONS", val: "436", icon: "building-2", color: "emerald" },
          { title: "HIGH-RISK WALLETS", val: "72", icon: "alert-triangle", color: "rose" },
          { title: "CROSS-CHAIN FLOWS", val: "148", icon: "git-merge", color: "amber" }
        ].map((card, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">{card.title}</span>
              <i data-lucide={card.icon} className="w-4 h-4 text-slate-500"></i>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{card.val}</div>
          </div>
        ))}
      </div>

      {/* Quick Action & Recent Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900">Active LEA Investigations</h3>
            <button onClick={() => setActiveTab("cases")} className="text-xs text-sky-600 font-semibold hover:underline">
              View All Cases ({cases.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {cases.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-sky-700">{c.id}</span>
                    <span className="font-semibold text-xs text-slate-900">{c.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Target: <span className="font-mono">{c.suspectWallet}</span> • {c.chain}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    c.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {c.riskLevel} RISK
                  </span>
                  <button
                    onClick={() => { setActiveCase(c); setActiveTab("command"); }}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                  >
                    Investigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right VASP Quick Directory */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">VASP Jurisdiction Directory</h3>
          <div className="space-y-2 text-xs">
            {vasps.slice(0, 5).map(v => (
              <div key={v.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{v.name}</div>
                  <div className="text-[10px] text-slate-500">{v.type} • {v.country}</div>
                </div>
                <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border border-slate-200">
                  {v.jurisdiction}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // VIEW 3: INVESTIGATE WALLET
  const renderInvestigateWallet = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Investigate Suspect Wallet</h2>
          <p className="text-xs text-slate-500 mt-1">
            Input a cryptocurrency wallet address to launch deep multi-hop VASP attribution, cluster detection, and risk scoring.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Wallet Address</label>
            <input
              type="text"
              defaultValue="0x71C7656EC7ab88b098defB751B7401B5f6d89A2"
              placeholder="e.g. 0x71C7... or bc1q..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-mono text-sm text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blockchain Network</label>
              <select className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-medium text-slate-800">
                <option>Auto Detect Network</option>
                <option>Ethereum (ETH / ERC-20)</option>
                <option>Bitcoin (BTC)</option>
                <option>Tron (TRX / TRC-20)</option>
                <option>BNB Chain (BNB / BEP-20)</option>
                <option>Solana (SOL)</option>
                <option>Polygon (MATIC)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Analysis Mode</label>
              <select className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-medium text-slate-800">
                <option>Deep Investigation (Recommended)</option>
                <option>Standard Investigation</option>
                <option>Quick Scan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Max Hop Depth</label>
              <select className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-medium text-slate-800">
                <option>2 Hops (Direct VASP Deposit)</option>
                <option>3 Hops</option>
                <option>5 Hops</option>
                <option>10 Hops (Deep Path)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center space-x-4">
            <button
              onClick={() => startInvestigation()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition flex items-center space-x-2"
            >
              <i data-lucide="play" className="w-4 h-4"></i>
              <span>START INVESTIGATION</span>
            </button>
            <button
              onClick={() => startInvestigation("0x71C7656EC7ab88b098defB751B7401B5f6d89A2")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-3 rounded-xl transition"
            >
              LOAD DEMO CASE (CASE-2026-001)
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // VIEW 4: LIVE TRACKING
  // VIEW 4: LIVE TRACKING (HIGH-PRECISION ON-CHAIN TELEMETRY)
  const renderLiveTracking = () => {
    const filteredStream = liveStream.filter(tx => {
      if (!trackingSearch) return true;
      const q = trackingSearch.toLowerCase();
      return (
        (tx.txHash && tx.txHash.toLowerCase().includes(q)) ||
        (tx.from && tx.from.toLowerCase().includes(q)) ||
        (tx.to && tx.to.toLowerCase().includes(q)) ||
        (tx.chain && tx.chain.toLowerCase().includes(q)) ||
        (tx.risk && tx.risk.toLowerCase().includes(q)) ||
        (tx.entity && tx.entity.toLowerCase().includes(q)) ||
        (tx.vaspTarget && tx.vaspTarget.toLowerCase().includes(q))
      );
    });

    return (
      <div className="space-y-6">
        {/* Precision Tracking Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">HIGH-PRECISION BLOCKCHAIN TRACKING</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                PRECISION TELEMETRY LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Millisecond-timestamped telemetry, sub-cent valuation, gas parameters, and exact multi-hop VASP cluster attribution.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setTrackingPrecisionMode(!trackingPrecisionMode)}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition flex items-center space-x-1.5 ${
                trackingPrecisionMode
                  ? "bg-sky-50 border-sky-300 text-sky-800 shadow-sm"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <i data-lucide="crosshair" className="w-3.5 h-3.5"></i>
              <span>{trackingPrecisionMode ? "PRECISION MODE: ON" : "STANDARD MODE"}</span>
            </button>

            <button
              onClick={() => setIsLiveStreamActive(!isLiveStreamActive)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                isLiveStreamActive
                  ? "bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
              }`}
            >
              <i data-lucide={isLiveStreamActive ? "pause" : "play"} className="w-3.5 h-3.5"></i>
              <span>{isLiveStreamActive ? "PAUSE STREAM" : "RESUME STREAM"}</span>
            </button>
          </div>
        </div>

        {/* Telemetry Precision Stats KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold uppercase text-slate-400">Telemetry Accuracy</div>
            <div className="text-xl font-black text-emerald-600 mt-1">98.6% Confirmed</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Deterministic VASP Cluster Match</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold uppercase text-slate-400">Mean Hop Latency</div>
            <div className="text-xl font-black text-sky-600 mt-1">2.4 Minutes</div>
            <div className="text-[11px] text-slate-500 mt-0.5">From Origin to VASP Sweep</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold uppercase text-slate-400">Tracking Feeds Active</div>
            <div className="text-xl font-black text-slate-900 mt-1">6 Networks</div>
            <div className="text-[11px] text-slate-500 mt-0.5">BTC, ETH, TRX, BNB, SOL, MATIC</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold uppercase text-slate-400">Monitored Inflow (1h)</div>
            <div className="text-xl font-black text-indigo-600 mt-1">$482,910.45</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Precise Real-Time Conversion</div>
          </div>
        </div>

        {/* Live Filter & Precision Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <i data-lucide="search" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input
              type="text"
              value={trackingSearch}
              onChange={(e) => setTrackingSearch(e.target.value)}
              placeholder="Search by precise Tx Hash, From/To address, Network, or VASP..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {trackingSearch && (
              <button
                onClick={() => setTrackingSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[11px] font-bold uppercase text-slate-400">Quick Filters:</span>
            {["All", "Ethereum", "Bitcoin", "Tron", "HIGH", "CRITICAL"].map((tag) => (
              <button
                key={tag}
                onClick={() => setTrackingSearch(tag === "All" ? "" : tag)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition ${
                  (tag === "All" && !trackingSearch) || trackingSearch === tag
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* High-Precision Live Telemetry Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-3.5">Precise Time (UTC)</th>
                  <th className="p-3.5">Block #</th>
                  <th className="p-3.5">Transaction Hash</th>
                  <th className="p-3.5">Sender Address</th>
                  <th className="p-3.5">Target / VASP Deposit</th>
                  <th className="p-3.5 text-right">Precise Amount & USD</th>
                  <th className="p-3.5">Gas / Fee</th>
                  <th className="p-3.5">Attribution & Confidence</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredStream.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-slate-400 font-sans text-xs">
                      No transactions match query "{trackingSearch}".
                    </td>
                  </tr>
                ) : (
                  filteredStream.map(tx => (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTelemetryTx(tx)}
                      className="hover:bg-sky-50/50 cursor-pointer transition"
                    >
                      <td className="p-3.5 text-slate-600 font-semibold whitespace-nowrap">
                        {tx.time}
                      </td>

                      <td className="p-3.5 whitespace-nowrap text-slate-500">
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px] font-bold">
                          #{tx.block}
                        </span>
                      </td>

                      <td className="p-3.5 font-bold text-sky-700 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span>{tx.txHash ? tx.txHash.substring(0, 10) + '...' + tx.txHash.substring(tx.txHash.length - 6) : 'TX'}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(tx.txHash, "Tx Hash copied!");
                            }}
                            className="text-slate-400 hover:text-sky-600"
                            title="Copy full Tx Hash"
                          >
                            <i data-lucide="copy" className="w-3 h-3"></i>
                          </button>
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-800 whitespace-nowrap">
                        <span title={tx.from}>{tx.from ? tx.from.substring(0, 8) + '...' + tx.from.substring(tx.from.length - 4) : '-'}</span>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900" title={tx.to}>
                            {tx.to ? tx.to.substring(0, 8) + '...' + tx.to.substring(tx.to.length - 4) : '-'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-sans">{tx.entity}</span>
                        </div>
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="font-bold text-slate-900">{tx.amount}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">{tx.fiat}</div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <div className="text-slate-700 text-[11px]">{tx.gasGwei}</div>
                        <div className="text-[10px] text-slate-400">{tx.fee}</div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-sans ${
                            tx.risk === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            tx.risk === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {tx.confidence}
                          </span>
                          <span className="text-[11px] text-slate-600 font-sans font-medium">{tx.vaspTarget}</span>
                        </div>
                      </td>

                      <td className="p-3.5 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTelemetryTx(tx);
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg transition"
                        >
                          Telemetry
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // VIEW 5: GLOBAL VASP MAP
  const renderGlobalVaspMap = () => (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">GLOBAL VASP INTELLIGENCE MAP</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic location of corporate headquarters, legal jurisdictions, and LEA regulatory registration nodes.
          </p>
        </div>
        <div className="text-[11px] bg-sky-50 text-sky-800 p-2 rounded-lg border border-sky-200 font-medium">
          Note: Represents corporate/custodial jurisdictions, NOT wallet physical GPS location.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-6 min-h-[480px] text-white flex flex-col justify-between relative overflow-hidden">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">World VASP Node Distribution</div>

          {/* SVG Vector Map Rendering with VASP Pins */}
          <div className="my-auto relative h-64 border border-slate-800 rounded-xl bg-slate-950/80 p-4 flex items-center justify-around">
            {vasps.map(v => (
              <div key={v.id} className="text-center group cursor-pointer relative">
                <div className="w-8 h-8 rounded-full bg-sky-500 text-slate-900 font-bold flex items-center justify-center text-xs shadow-lg ring-4 ring-sky-500/20 group-hover:scale-110 transition mx-auto">
                  <i data-lucide="building-2" className="w-4 h-4 inline"></i>
                </div>
                <div className="text-[10px] font-bold mt-1 text-slate-200">{v.name}</div>
                <div className="text-[9px] text-sky-400">{v.country}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800 pt-3">
            <span>Active Jurisdictions: <strong>Singapore, UAE, USA, India, EU</strong></span>
            <span>Total Known VASPs: <strong>20 Registered</strong></span>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900">VASP Jurisdiction Directory</h3>
            <div className="space-y-2 text-xs">
              {vasps.map(v => (
                <div key={v.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{v.name}</span>
                    <span className="text-sky-700 font-mono text-[10px]">{v.code}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{v.type} • {v.country}</div>
                  <div className="text-[10px] text-slate-600 font-semibold">Active LEA Cases: {v.cases}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // VIEW 6: SAHYOG REQUESTS
  const renderSahyogRequests = () => (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-extrabold text-slate-900">SAHYOG PORTAL INTEGRATION & LAWFUL REQUESTS</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
              API GATEWAY ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Route Information Disclosure and Asset Freezing notices directly to identified VASPs.</p>
        </div>

        <button
          onClick={() => {
            const newReq = {
              id: "REQ-2026-" + Math.floor(100 + Math.random() * 900),
              caseId: "CASE-2026-001",
              vasp: "VASP Alpha",
              type: "Information Disclosure Request",
              status: "Pending Supervisor Review",
              targetWallet: "0x3F88...1A91",
              date: new Date().toISOString().replace('T', ' ').substring(0, 16),
              sahyogId: "SAHYOG-DRAFT-NEW"
            };
            setRequests([newReq, ...requests]);
            addAuditLog("SAHYOG_DRAFT_CREATED", newReq.id, "Draft created for VASP Alpha");
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-2"
        >
          <i data-lucide="plus" className="w-4 h-4"></i>
          <span>CREATE NEW SAHYOG REQUEST</span>
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <th className="p-3.5">Request ID</th>
              <th className="p-3.5">Case Reference</th>
              <th className="p-3.5">Target VASP</th>
              <th className="p-3.5">Request Type</th>
              <th className="p-3.5">Target Wallet</th>
              <th className="p-3.5">Status Pipeline</th>
              <th className="p-3.5">SAHYOG Ref</th>
              <th className="p-3.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {requests.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 transition font-sans">
                <td className="p-3.5 font-bold font-mono text-sky-700">{r.id}</td>
                <td className="p-3.5 font-bold text-slate-800">{r.caseId}</td>
                <td className="p-3.5 font-bold text-slate-900">{r.vasp}</td>
                <td className="p-3.5 font-medium text-slate-700">{r.type}</td>
                <td className="p-3.5 font-mono text-slate-600">{r.targetWallet}</td>
                <td className="p-3.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    r.status.includes('SAHYOG') ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    r.status.includes('Review') ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-slate-500">{r.sahyogId}</td>
                <td className="p-3.5">
                  <button
                    onClick={() => alert(`SAHYOG Request Details for ${r.id}:\nStatus: ${r.status}\nSAHYOG Gateway ID: ${r.sahyogId}`)}
                    className="text-xs font-semibold text-sky-600 hover:underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // VIEW 7: REPORT GENERATOR
  const renderReports = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">VASPX Executive Investigation Brief</h2>
            <p className="text-xs text-slate-500 mt-0.5">Authorized Report Generator for LEA Case Files & Judicial Submission.</p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-2"
          >
            <i data-lucide="printer" className="w-4 h-4"></i>
            <span>GENERATE PDF / PRINT</span>
          </button>
        </div>

        {/* Printable Brief Body */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-6 font-sans text-xs text-slate-800">
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <div className="text-lg font-black text-slate-900">CONFIDENTIAL LEA INTELLIGENCE BRIEF</div>
              <div className="text-xs text-slate-500 mt-1">Target Wallet: <span className="font-mono font-bold text-slate-900">0x71C7656EC7ab88b098defB751B7401B5f6d89A2</span></div>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-500">
              <div>Ref: CASE-2026-001</div>
              <div>Date: 2026-09-29</div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">1. Executive Investigation Summary</h4>
            <p className="text-slate-600 leading-relaxed">
              VASPX analyzed the suspect wallet across Ethereum and identified 124 transactions totaling 840.50 ETH. The wallet shows repeated interactions with a cluster of addresses associated with VASP Alpha. The strongest detected path reaches a VASP-associated deposit address within two graph hops. Additional cross-chain activity was detected through a bridge.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">2. VASP Attribution Lead</h4>
            <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Top Candidate: VASP Alpha (Singapore Exchange)</span>
                <span className="text-emerald-700">Confidence: 87%</span>
              </div>
              <div className="text-slate-600 text-[11px]">Deposit Address: <span className="font-mono font-bold text-slate-800">0x3F88a91B24dE28a01C8974dF2356B278d6541A91</span></div>
              <div className="text-slate-600 text-[11px]">Graph Distance: <span className="font-bold text-slate-800">2 Hops</span> (Direct Deposit Relationship)</div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-400">
            <strong>Legal Disclaimer:</strong> VASPX provides analytical leads and intelligence. Results do not represent absolute proof of legal ownership and should be independently verified.
          </div>
        </div>
      </div>
    </div>
  );

  // VIEW 8: AUDIT LOGS
  const renderAuditLogs = () => (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900">SYSTEM AUDIT TRAIL LOGS</h2>
        <p className="text-xs text-slate-500 mt-0.5">Tamper-evident log of all user activities, data queries, and SAHYOG API actions.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] font-sans">
              <th className="p-3.5">Log ID</th>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">User</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Action Executed</th>
              <th className="p-3.5">Target Resource</th>
              <th className="p-3.5">IP Address</th>
              <th className="p-3.5">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map(l => (
              <tr key={l.id} className="hover:bg-slate-50 transition">
                <td className="p-3.5 text-sky-700 font-bold">{l.id}</td>
                <td className="p-3.5 text-slate-500">{l.time}</td>
                <td className="p-3.5 font-sans font-semibold text-slate-900">{l.user}</td>
                <td className="p-3.5 font-sans text-[11px] text-slate-600">{l.role}</td>
                <td className="p-3.5 text-slate-800 font-bold">{l.action}</td>
                <td className="p-3.5 text-slate-600">{l.target}</td>
                <td className="p-3.5 text-slate-500">{l.ip}</td>
                <td className="p-3.5 font-sans">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // VIEW 9: ALERTS CENTER
  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 font-sans">THREAT ALERT CENTER</h2>
          <p className="text-xs text-slate-500 mt-0.5">Automated high-risk triggers and real-time VASP deposit alerts.</p>
        </div>
        <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200">
          {alerts.length} Active Alerts
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map(a => (
          <div key={a.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg uppercase mt-0.5 ${
                a.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {a.severity}
              </span>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{a.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{a.reason}</p>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Wallet: <span className="text-slate-800 font-semibold">{a.wallet}</span> • {a.time}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => { setActiveCase(DEMO_CASE); setActiveTab("command"); }}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition"
              >
                Investigate
              </button>
              <button
                onClick={() => setAlerts(alerts.filter(item => item.id !== a.id))}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // AI COPILOT DRAWER
  const renderCopilotDrawer = () => {
    if (!isCopilotOpen) return null;
    return (
      <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col justify-between">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
              AI
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900">VASPX Intelligence Copilot</h3>
              <p className="text-[10px] text-slate-500">Case Data Grounded Assistant</p>
            </div>
          </div>
          <button onClick={() => setIsCopilotOpen(false)} className="text-slate-400 hover:text-slate-600">
            <i data-lucide="x" className="w-5 h-5"></i>
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-sky-900">
            Hello {currentUser.name}! I am ready to answer queries grounded strictly in the current investigation dataset for <strong>CASE-2026-001</strong>.
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-500 text-[10px] uppercase">Suggested Queries</div>
            {[
              "Which VASP is closely associated with this wallet?",
              "Why was VASP Alpha identified?",
              "Show the shortest path to VASP deposit.",
              "Did the funds cross chains?"
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => alert(`AI Copilot Response:\nQuery: "${q}"\n\nResult:\nVASP Alpha (Singapore) identified at 87% confidence based on 2-hop path to deposit address 0x3F88a91B24dE28a01C8974dF2356B278d6541A91.`)}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 p-2.5 rounded-lg border border-slate-200 font-medium text-slate-800 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-slate-200 bg-white">
          <input
            type="text"
            placeholder="Ask Intelligence Copilot..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>
    );
  };

  // PROGRESS MODAL FOR INVESTIGATION
  const renderProgressModal = () => {
    if (!isInvestigating) return null;
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center">
          <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <i data-lucide="loader-2" className="w-8 h-8 animate-spin"></i>
          </div>

          <div>
            <h3 className="font-extrabold text-base text-slate-900">VASP Attribution Engine Active</h3>
            <p className="text-xs text-slate-500 mt-1 font-mono">{investigationStep}</p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Progress</span>
              <span>{Math.round(investigationProgress)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${investigationProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // CREDENTIALS MODAL COMPONENT
  const renderCredentialsModal = () => {
    if (!showCredsModal) return null;
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <i data-lucide="key" className="w-4 h-4"></i>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">VASPX Authorized Access Credentials</h3>
                <p className="text-xs text-slate-500">Official Demo Accounts for Law Enforcement Evaluation</p>
              </div>
            </div>
            <button
              onClick={() => setShowCredsModal(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <i data-lucide="x" className="w-5 h-5"></i>
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                role: "LEA INVESTIGATOR",
                name: "Inspector Vikram Rathore",
                email: "investigator@vaspx.demo",
                pass: "password123",
                desc: "Full access to case attribution, wallet telemetry, Peeling Chain graph, and SAHYOG notice creation."
              },
              {
                role: "SENIOR INVESTIGATOR / SUPERVISOR",
                name: "Superintendent Ananya Sharma",
                email: "supervisor@vaspx.demo",
                pass: "password123",
                desc: "Authorized to review, digitally sign, and approve international SAHYOG freeze requests."
              },
              {
                role: "ADMINISTRATOR",
                name: "Director Rajesh Kumar",
                email: "admin@vaspx.demo",
                pass: "password123",
                desc: "VASP jurisdiction node registry management, system-wide cryptographic audit logs, and user roles."
              }
            ].map((u, i) => (
              <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{u.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 uppercase">{u.role}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white p-2 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Login ID (Email):</span>
                    <span className="text-slate-900 font-semibold">{u.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-sans">Password:</span>
                    <span className="text-slate-900 font-semibold">{u.pass}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 font-sans">{u.desc}</span>
                  <button
                    onClick={() => {
                      switchRole(u.email);
                      setShowCredsModal(false);
                      copyToClipboard(u.email, `Switched to ${u.role}!`);
                    }}
                    className="ml-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[10px] px-2.5 py-1 rounded transition shrink-0"
                  >
                    Switch to Role
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-xs text-sky-900 flex items-start space-x-2">
            <i data-lucide="info" className="w-4 h-4 text-sky-600 shrink-0 mt-0.5"></i>
            <span>
              All demo credentials use password: <strong>password123</strong>. In quick-demo mode, selecting any role logs in immediately.
            </span>
          </div>

          <div className="text-right">
            <button
              onClick={() => setShowCredsModal(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ON-CHAIN TELEMETRY INSPECTOR MODAL
  const renderTelemetryInspectorModal = () => {
    if (!selectedTelemetryTx) return null;
    const tx = selectedTelemetryTx;

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <i data-lucide="cpu" className="w-5 h-5"></i>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">On-Chain Telemetry Inspector</h3>
                <p className="text-xs text-slate-500 font-mono">Deterministic Block Event #{tx.block} • {tx.time}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTelemetryTx(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <i data-lucide="x" className="w-5 h-5"></i>
            </button>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Network & Finality</span>
              <div className="font-bold text-slate-900 mt-0.5">{tx.chain}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">{tx.confirmations}</div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Precise Value</span>
              <div className="font-bold text-slate-900 mt-0.5">{tx.amount}</div>
              <div className="text-[10px] text-slate-500">{tx.fiat}</div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Gas & Fee</span>
              <div className="font-bold text-slate-900 mt-0.5">{tx.gasGwei}</div>
              <div className="text-[10px] text-slate-500">{tx.fee}</div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Attribution Match</span>
              <div className="font-bold text-indigo-700 mt-0.5">{tx.confidence}</div>
              <div className="text-[10px] text-slate-500">{tx.vaspTarget}</div>
            </div>
          </div>

          {/* Full Transaction Hashes & Addresses */}
          <div className="space-y-3 text-xs font-mono">
            <div>
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-sans font-semibold mb-1">
                <span>Complete Transaction Hash</span>
                <button
                  onClick={() => copyToClipboard(tx.txHash, "Full Tx Hash copied!")}
                  className="text-sky-600 hover:underline flex items-center space-x-1"
                >
                  <i data-lucide="copy" className="w-3 h-3"></i>
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 break-all select-all font-bold">
                {tx.txHash}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-sans font-semibold mb-1">
                  <span>Sender Address (Origin)</span>
                  <button
                    onClick={() => copyToClipboard(tx.from, "Sender Address copied!")}
                    className="text-sky-600 hover:underline flex items-center space-x-1"
                  >
                    <i data-lucide="copy" className="w-3 h-3"></i>
                    <span>Copy</span>
                  </button>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 break-all">
                  {tx.from}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-sans font-semibold mb-1">
                  <span>Destination / VASP Deposit</span>
                  <button
                    onClick={() => copyToClipboard(tx.to, "Target Address copied!")}
                    className="text-sky-600 hover:underline flex items-center space-x-1"
                  >
                    <i data-lucide="copy" className="w-3 h-3"></i>
                    <span>Copy</span>
                  </button>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 break-all">
                  {tx.to}
                </div>
              </div>
            </div>
          </div>

          {/* VASP Attribution Evidence */}
          <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-950 uppercase text-[10px] tracking-wider">VASP Attribution Telemetry</span>
              <span className="bg-sky-200 text-sky-900 font-bold px-2 py-0.5 rounded text-[10px]">Deterministic Match</span>
            </div>
            <p className="text-sky-800 text-[11px]">
              Target wallet exhibits direct deposit patterns matching cluster CID for <strong>{tx.vaspTarget}</strong>. Multi-hop heuristics verify 0 hop distance to centralized liquidity sweeping.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => {
                setSelectedTelemetryTx(null);
                setActiveTab("command");
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
            >
              <i data-lucide="git-branch" className="w-3.5 h-3.5"></i>
              <span>Trace in Multi-Hop Graph</span>
            </button>

            <button
              onClick={() => {
                setSelectedTelemetryTx(null);
                setActiveTab("requests");
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
            >
              <i data-lucide="send" className="w-3.5 h-3.5"></i>
              <span>Draft SAHYOG Freeze Notice</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // LOGIN PORTAL (WHEN NOT AUTHENTICATED)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
        <div className="max-w-xl w-full bg-slate-850 rounded-2xl border border-slate-700 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-lg shadow-sky-500/20">
              V
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">VASPX Intelligence Portal</h2>
            <p className="text-xs text-slate-400">Virtual Asset Service Provider Attribution & Blockchain Intelligence</p>
          </div>

          {/* Authorized Credentials Reference Table */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1.5">
                <i data-lucide="key" className="w-3.5 h-3.5"></i>
                <span>Authorized Demo Credentials</span>
              </span>
              <span className="text-[10px] text-slate-400">Official LEA Access</span>
            </div>

            <div className="space-y-2">
              {[
                { role: "LEA Investigator", id: "investigator@vaspx.demo", pass: "password123", color: "sky" },
                { role: "Supervisor", id: "supervisor@vaspx.demo", pass: "password123", color: "indigo" },
                { role: "Administrator", id: "admin@vaspx.demo", pass: "password123", color: "purple" }
              ].map((c, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-750 gap-2">
                  <div>
                    <span className="font-bold text-slate-200 block text-xs">{c.role}</span>
                    <span className="font-mono text-[11px] text-sky-400 select-all">{c.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      Password: <strong className="text-slate-200">{c.pass}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setLoginEmail(c.id);
                        setLoginPassword(c.pass);
                        handleLogin(c.id, c.pass);
                      }}
                      className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] px-2.5 py-1 rounded transition"
                    >
                      Quick Sign In
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Email & Password Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(loginEmail, loginPassword);
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Login ID / Officer Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="investigator@vaspx.demo"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="password123"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {loginError && (
              <div className="p-2 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-300 text-xs">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              <i data-lucide="shield-check" className="w-4 h-4"></i>
              <span>AUTHENTICATE & ENTER COMMAND CENTER</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN LAYOUT
  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans">
      {renderHeader()}
      <div className="flex-1 flex overflow-hidden">
        {renderSidebar()}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "command" && renderCommandCenter()}
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "investigate" && renderInvestigateWallet()}
          {activeTab === "tracking" && renderLiveTracking()}
          {activeTab === "map" && renderGlobalVaspMap()}
          {activeTab === "requests" && renderSahyogRequests()}
          {activeTab === "reports" && renderReports()}
          {activeTab === "audit" && renderAuditLogs()}
          {activeTab === "alerts" && renderAlerts()}
          {activeTab === "cases" && renderDashboard()}
          {activeTab === "graph" && renderCommandCenter()}
          {activeTab === "vasp" && renderGlobalVaspMap()}
          {activeTab === "crosschain" && renderCommandCenter()}
          {activeTab === "risk" && renderCommandCenter()}
          {activeTab === "settings" && renderAuditLogs()}
        </main>
      </div>

      {renderCopilotDrawer()}
      {renderProgressModal()}
      {renderCredentialsModal()}
      {renderTelemetryInspectorModal()}

      {copyToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 z-50 flex items-center space-x-2 animate-bounce">
          <i data-lucide="check-circle" className="w-4 h-4 text-emerald-400"></i>
          <span>{copyToast}</span>
        </div>
      )}
    </div>
  );
}

// Render Application to Root DOM
const container = document.getElementById('root');
if (ReactDOM.createRoot) {
  const root = ReactDOM.createRoot(container);
  root.render(<VaspxApp />);
} else {
  ReactDOM.render(<VaspxApp />, container);
}
