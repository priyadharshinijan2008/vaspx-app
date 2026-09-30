const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'vaspx_database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generate seeded password hash for demo accounts: "password123"
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

const INITIAL_DEPARTMENTS = [
  { id: "DEP-CYBER", name: "National Cyber Crime Threat Unit", code: "NCCTU", head: "Superintendent Ananya Sharma" },
  { id: "DEP-FIN", name: "Financial Intelligence & AML Directorate", code: "FIAML", head: "Superintendent Rajesh Nair" },
  { id: "DEP-FOR", name: "Digital Forensics & Incident Response", code: "DFIR", head: "Director Rajesh Kumar" }
];

const INITIAL_USERS = [
  {
    id: "USR-001",
    employeeId: "EMP-ADM-101",
    name: "Director Rajesh Kumar",
    email: "admin@vaspx.demo",
    passwordHash: DEMO_PASSWORD_HASH,
    role: "ADMIN",
    departmentId: "DEP-FOR",
    department: "Digital Forensics & Incident Response",
    designation: "Chief Director & System Administrator",
    specialization: "Cyber Policy & High-Level Operations",
    active: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    phone: "+91-98765-43210",
    lastLogin: "2026-09-29 08:12:30",
    createdAt: "2026-01-10 09:00:00"
  },
  {
    id: "USR-002",
    employeeId: "EMP-SUP-204",
    name: "Superintendent Ananya Sharma",
    email: "supervisor@vaspx.demo",
    passwordHash: DEMO_PASSWORD_HASH,
    role: "SUPERVISOR",
    departmentId: "DEP-CYBER",
    department: "National Cyber Crime Threat Unit",
    designation: "Senior Supervisory Officer",
    specialization: "Ransomware & Organized Cyber Syndicates",
    active: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    phone: "+91-98111-22334",
    lastLogin: "2026-09-29 09:45:00",
    createdAt: "2026-01-15 10:30:00"
  },
  {
    id: "USR-003",
    employeeId: "EMP-INV-301",
    name: "Inspector Vikram Rathore",
    email: "investigator@vaspx.demo",
    passwordHash: DEMO_PASSWORD_HASH,
    role: "INVESTIGATOR",
    departmentId: "DEP-CYBER",
    department: "National Cyber Crime Threat Unit",
    designation: "Lead Blockchain Forensics Investigator",
    specialization: "Cyber Crime & Smart Contract Exploits",
    active: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    phone: "+91-98222-33445",
    lastLogin: "2026-09-29 11:20:15",
    createdAt: "2026-02-01 11:00:00"
  },
  {
    id: "USR-004",
    employeeId: "EMP-INV-302",
    name: "Sub-Inspector Priya Nair",
    email: "priya.nair@vaspx.demo",
    passwordHash: DEMO_PASSWORD_HASH,
    role: "INVESTIGATOR",
    departmentId: "DEP-FIN",
    department: "Financial Intelligence & AML Directorate",
    designation: "Senior Crypto Intelligence Officer",
    specialization: "Financial Crime & AML Laundering",
    active: true,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
    phone: "+91-98333-44556",
    lastLogin: "2026-09-28 16:40:00",
    createdAt: "2026-02-10 14:15:00"
  },
  {
    id: "USR-005",
    employeeId: "EMP-INV-303",
    name: "Inspector Rohan Deshmukh",
    email: "rohan.deshmukh@vaspx.demo",
    passwordHash: DEMO_PASSWORD_HASH,
    role: "INVESTIGATOR",
    departmentId: "DEP-CYBER",
    department: "National Cyber Crime Threat Unit",
    designation: "Technical Forensics Analyst",
    specialization: "Darknet Markets & Mixer Attribution",
    active: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    phone: "+91-98444-55667",
    lastLogin: "2026-09-29 08:30:00",
    createdAt: "2026-03-01 09:45:00"
  },
  {
    id: "USR-006",
    employeeId: "EMP-INV-304",
    name: "Sub-Inspector Kavita Verma",
    email: "kavita.verma@vaspx.demo",
    passwordHash: DEMO_PASSWORD_HASH,
    role: "INVESTIGATOR",
    departmentId: "DEP-FIN",
    department: "Financial Intelligence & AML Directorate",
    designation: "Asset Recovery Specialist",
    specialization: "Cross-Chain Bridges & DeFi Tracking",
    active: false, // Deactivated demo user for testing
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    phone: "+91-98555-66778",
    lastLogin: "2026-09-15 14:22:00",
    createdAt: "2026-03-12 16:00:00"
  }
];

const INITIAL_CASES = [
  {
    id: "CAS-2026-001",
    title: "Operation CyberShield: Ransomware Proceeds Laundering",
    description: "Multi-jurisdictional ransomware extortion syndicate laundering 142.85 ETH through peeling chains and decentralized mixers targeting healthcare infrastructure.",
    category: "Ransomware & Extortion",
    priority: "HIGH",
    status: "IN_PROGRESS",
    departmentId: "DEP-CYBER",
    suspectWallet: "0x71C7656EC7ab88b098defB751B7401B5f6d89A2",
    chain: "Ethereum",
    riskScore: 88,
    assignedInvestigatorId: "USR-003",
    assignedSupervisorId: "USR-002",
    createdById: "USR-001",
    dueDate: "2026-10-15",
    createdAt: "2026-09-28 14:30:00",
    lastUpdatedAt: "2026-09-29 11:15:00",
    balance: "142.85 ETH ($385,695.00 USD)",
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
    riskBreakdown: { fraud: 80, mixer: 70, darknet: 20, sanctions: 0 },
    typologies: [
      { title: "Peeling Chain Laundering", confidence: "High (92%)", desc: "Large sums split into small decrements across 5 hop paths." },
      { title: "Cross-Chain Swap Hop", confidence: "Medium (78%)", desc: "Funds bridged via Cross-Chain Service to USDT on Polygon." },
      { title: "Rapid Movement", confidence: "High (89%)", desc: "Average hop duration under 4 minutes." }
    ]
  },
  {
    id: "CAS-2026-002",
    title: "Phishing Consortium: Ponzi Liquidation Nexus",
    description: "Fake algorithmic trading application defrauding over 340 victims across 12 states. Funds moved rapidly to centralized exchange custodial hot wallets.",
    category: "Phishing & Fraud",
    priority: "CRITICAL",
    status: "UNDER_REVIEW",
    departmentId: "DEP-CYBER",
    suspectWallet: "0x3914a8E5B80C9D910b2849e701977D2dFc46bEc4",
    chain: "Ethereum",
    riskScore: 94,
    assignedInvestigatorId: "USR-003",
    assignedSupervisorId: "USR-002",
    createdById: "USR-002",
    dueDate: "2026-10-02",
    createdAt: "2026-09-20 10:15:00",
    lastUpdatedAt: "2026-09-29 10:00:00",
    balance: "88.40 ETH ($238,680.00 USD)",
    attribution: {
      vaspCandidate: "Binance Global",
      confidence: 93,
      hopDistance: 1,
      evidenceQuality: "Very Strong",
      directDeposit: true,
      depositAddress: "0x28C6c06298d514Db089934071355E5743bf21d60",
      signals: [
        { name: "Direct Exchange Hot Wallet Deposit", score: "+40%", desc: "Immediate hop into Binance hot wallet" },
        { name: "High Value Transfer", score: "+25%", desc: "Single lump sum deposit" },
        { name: "FIU-IND Red Flag", score: "+28%", desc: "Customer account KYC flagged under SAR #991" }
      ]
    },
    riskBreakdown: { fraud: 95, mixer: 10, darknet: 5, sanctions: 0 },
    typologies: [
      { title: "Smurfing Consolidation", confidence: "High (96%)", desc: "Hundreds of victim micro-transfers pooled into one gateway." }
    ]
  },
  {
    id: "CAS-2026-003",
    title: "Darknet Narcotics Syndicate: Mixer Obfuscation",
    description: "Darknet market vendor cash-out scheme involving Bitcoin-to-Monero atomic swaps and Tornado Cash cash-outs.",
    category: "Darknet Markets",
    priority: "MEDIUM",
    status: "ASSIGNED",
    departmentId: "DEP-CYBER",
    suspectWallet: "0x5821F06987fA246B55E57790E95d985a7Ea38183",
    chain: "Ethereum",
    riskScore: 76,
    assignedInvestigatorId: "USR-005",
    assignedSupervisorId: "USR-002",
    createdById: "USR-001",
    dueDate: "2026-10-25",
    createdAt: "2026-09-26 15:45:00",
    lastUpdatedAt: "2026-09-28 09:20:00",
    balance: "45.10 ETH ($121,770.00 USD)",
    attribution: {
      vaspCandidate: "Kraken Pay",
      confidence: 68,
      hopDistance: 3,
      evidenceQuality: "Moderate",
      directDeposit: false,
      depositAddress: "0x1111111254fb6c44bac0bed2854e76f90643097d",
      signals: [
        { name: "Intermediary DEX routing", score: "+25%", desc: "Routed through 1inch DEX router" },
        { name: "Time delay hopping", score: "+20%", desc: "Funds held for 72h before exit" }
      ]
    },
    riskBreakdown: { fraud: 30, mixer: 85, darknet: 80, sanctions: 20 },
    typologies: [
      { title: "Mixer Deposit Cascade", confidence: "High (88%)", desc: "Equal volume 10 ETH deposits into privacy pool." }
    ]
  },
  {
    id: "CAS-2026-004",
    title: "Sanctions Evasion: Sovereign Blacklist Bridge",
    description: "Evasion of international sanctions involving illicit mining proceeds conversion into stablecoins.",
    category: "Sanctions Evasion",
    priority: "CRITICAL",
    status: "NEW",
    departmentId: "DEP-FIN",
    suspectWallet: "0x098b716B8Aaf21512996dC57EB0615e2383E2f96",
    chain: "Tron",
    riskScore: 98,
    assignedInvestigatorId: null,
    assignedSupervisorId: "USR-002",
    createdById: "USR-001",
    dueDate: "2026-10-05",
    createdAt: "2026-09-29 07:10:00",
    lastUpdatedAt: "2026-09-29 07:10:00",
    balance: "1,250,000 USDT",
    attribution: {
      vaspCandidate: "RenBridge Liquidity",
      confidence: 84,
      hopDistance: 2,
      evidenceQuality: "Strong",
      directDeposit: false,
      depositAddress: "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7",
      signals: [
        { name: "OFAC Specially Designated National link", score: "+50%", desc: "Origin wallet clustered with designated state sponsor" }
      ]
    },
    riskBreakdown: { fraud: 20, mixer: 40, darknet: 10, sanctions: 98 },
    typologies: [
      { title: "Cross-Border Stablecoin Tunnel", confidence: "Very High (98%)", desc: "Automated USDT transfers on Tron to OTC desks." }
    ]
  },
  {
    id: "CAS-2026-005",
    title: "DeFi Flash Loan Exploit Asset Recovery",
    description: "Drain of $4.2M from decentralized lending protocol. Stolen assets being laundered into multiple fiat off-ramps.",
    category: "Financial Crime & AML",
    priority: "HIGH",
    status: "RESOLVED",
    departmentId: "DEP-FIN",
    suspectWallet: "0x1249b6b7a9de564177c941320ef4b2382436e4f3",
    chain: "Ethereum",
    riskScore: 72,
    assignedInvestigatorId: "USR-004",
    assignedSupervisorId: "USR-002",
    createdById: "USR-002",
    dueDate: "2026-09-25",
    createdAt: "2026-09-10 11:00:00",
    lastUpdatedAt: "2026-09-27 18:30:00",
    balance: "220.00 ETH ($594,000.00 USD)",
    attribution: {
      vaspCandidate: "Coinbase Prime",
      confidence: 96,
      hopDistance: 1,
      evidenceQuality: "Conclusive",
      directDeposit: true,
      depositAddress: "0x503828976D22510aad0201ac7EC88293211A23Da",
      signals: [
        { name: "Direct Legal Freeze", score: "+50%", desc: "VASP compliance confirmed asset freeze under section 91" }
      ]
    },
    riskBreakdown: { fraud: 70, mixer: 30, darknet: 0, sanctions: 0 },
    typologies: [
      { title: "Direct Off-Ramp Cashing", confidence: "High (94%)", desc: "Immediate routing into regulated institutional custodial wallet." }
    ]
  }
];

const INITIAL_ASSIGNMENTS = [
  {
    id: "ASG-001",
    caseId: "CAS-2026-001",
    investigatorId: "USR-003",
    investigatorName: "Inspector Vikram Rathore",
    assignedById: "USR-001",
    assignedByName: "Director Rajesh Kumar",
    assignedByRole: "ADMIN",
    assignedAt: "2026-09-28 14:45:00",
    previousInvestigatorId: null,
    previousInvestigatorName: null,
    type: "INITIAL",
    notes: "Assigned as primary lead for ransomware peeling chain analysis and MAS coordination."
  },
  {
    id: "ASG-002",
    caseId: "CAS-2026-002",
    investigatorId: "USR-003",
    investigatorName: "Inspector Vikram Rathore",
    assignedById: "USR-002",
    assignedByName: "Superintendent Ananya Sharma",
    assignedByRole: "SUPERVISOR",
    assignedAt: "2026-09-20 10:30:00",
    previousInvestigatorId: null,
    previousInvestigatorName: null,
    type: "INITIAL",
    notes: "Priority dispatch for urgent freezing order on suspect Binance cluster."
  },
  {
    id: "ASG-003",
    caseId: "CAS-2026-003",
    investigatorId: "USR-005",
    investigatorName: "Inspector Rohan Deshmukh",
    assignedById: "USR-001",
    assignedByName: "Director Rajesh Kumar",
    assignedByRole: "ADMIN",
    assignedAt: "2026-09-26 16:00:00",
    previousInvestigatorId: null,
    previousInvestigatorName: null,
    type: "INITIAL",
    notes: "Specialized darknet mixer attribution required."
  },
  {
    id: "ASG-004",
    caseId: "CAS-2026-005",
    investigatorId: "USR-004",
    investigatorName: "Sub-Inspector Priya Nair",
    assignedById: "USR-002",
    assignedByName: "Superintendent Ananya Sharma",
    assignedByRole: "SUPERVISOR",
    assignedAt: "2026-09-10 11:30:00",
    previousInvestigatorId: null,
    previousInvestigatorName: null,
    type: "INITIAL",
    notes: "DeFi tracing and Section 91 notice dispatch."
  }
];

const INITIAL_ACTIVITIES = [
  {
    id: "ACT-001",
    caseId: "CAS-2026-001",
    userId: "USR-001",
    userName: "Director Rajesh Kumar",
    userRole: "ADMIN",
    action: "CASE_CREATED",
    description: "Case initiated from CERT-In Critical Alert Incident #2026-7890.",
    previousValue: null,
    newValue: "NEW",
    timestamp: "2026-09-28 14:30:00"
  },
  {
    id: "ACT-002",
    caseId: "CAS-2026-001",
    userId: "USR-001",
    userName: "Director Rajesh Kumar",
    userRole: "ADMIN",
    action: "CASE_ASSIGNED",
    description: "Assigned lead investigator Inspector Vikram Rathore.",
    previousValue: "Unassigned",
    newValue: "Inspector Vikram Rathore",
    timestamp: "2026-09-28 14:45:00"
  },
  {
    id: "ACT-003",
    caseId: "CAS-2026-001",
    userId: "USR-003",
    userName: "Inspector Vikram Rathore",
    userRole: "INVESTIGATOR",
    action: "STATUS_CHANGE",
    description: "Investigator accepted assignment and initiated blockchain graph clustering.",
    previousValue: "ASSIGNED",
    newValue: "IN_PROGRESS",
    timestamp: "2026-09-28 15:10:00"
  },
  {
    id: "ACT-004",
    caseId: "CAS-2026-001",
    userId: "USR-003",
    userName: "Inspector Vikram Rathore",
    userRole: "INVESTIGATOR",
    action: "EVIDENCE_ADDED",
    description: "Uploaded On-Chain Transaction Flow Graph (18 txs, 2 hops to VASP Alpha).",
    previousValue: null,
    newValue: "Evidence #EVD-001",
    timestamp: "2026-09-29 09:30:00"
  },
  {
    id: "ACT-005",
    caseId: "CAS-2026-001",
    userId: "USR-003",
    userName: "Inspector Vikram Rathore",
    userRole: "INVESTIGATOR",
    action: "NOTE_ADDED",
    description: "Drafted Section 91 CrPC notice for VASP Alpha Legal Compliance Desk.",
    previousValue: null,
    newValue: "Note recorded",
    timestamp: "2026-09-29 11:15:00"
  }
];

const INITIAL_NOTES = [
  {
    id: "NTE-001",
    caseId: "CAS-2026-001",
    authorId: "USR-003",
    authorName: "Inspector Vikram Rathore",
    authorRole: "INVESTIGATOR",
    content: "Identified direct customer deposit address 0x3F88a91B24dE28a01C8974dF2356B278d6541A91 on VASP Alpha. Initiated Sahyog 2.0 electronic request for KYC documents and withdrawal IP logs.",
    isInternal: false,
    createdAt: "2026-09-29 11:15:00"
  },
  {
    id: "NTE-002",
    caseId: "CAS-2026-001",
    authorId: "USR-002",
    authorName: "Superintendent Ananya Sharma",
    authorRole: "SUPERVISOR",
    content: "Reviewed hop paths. Advise verifying whether RenBridge swap hop at block 20842710 transferred tokens to secondary Tron wallet.",
    isInternal: true,
    createdAt: "2026-09-29 11:45:00"
  }
];

const INITIAL_EVIDENCE = [
  {
    id: "EVD-001",
    caseId: "CAS-2026-001",
    uploaderId: "USR-003",
    uploaderName: "Inspector Vikram Rathore",
    fileName: "vaspx_transaction_flow_cluster_0x71c7.pdf",
    fileType: "application/pdf",
    fileSize: "2.4 MB",
    txHashOrDetails: "0x39a148fbc8012...89ef (18 transactions bundled)",
    description: "Cryptographic trace graph proving 87% attribution match to VASP Alpha omnibus cluster.",
    uploadedAt: "2026-09-29 09:30:00"
  },
  {
    id: "EVD-002",
    caseId: "CAS-2026-001",
    uploaderId: "USR-003",
    uploaderName: "Inspector Vikram Rathore",
    fileName: "interpol_cyber_notice_2026_88.pdf",
    fileType: "application/pdf",
    fileSize: "1.1 MB",
    txHashOrDetails: "INTERPOL Ref: CYB-2026-88-MEDUSA",
    description: "Supporting foreign intelligence bulletin identifying syndicate wallet signatures.",
    uploadedAt: "2026-09-29 10:12:00"
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "NTF-001",
    recipientId: "USR-003",
    title: "New Case Assigned",
    message: "You have been assigned as lead investigator on Case CAS-2026-001: Operation CyberShield.",
    type: "ASSIGNMENT",
    caseId: "CAS-2026-001",
    isRead: false,
    createdAt: "2026-09-28 14:45:00"
  },
  {
    id: "NTF-002",
    recipientId: "USR-002",
    title: "Case Submitted for Review",
    message: "Inspector Vikram Rathore submitted Case CAS-2026-002: Phishing Consortium for supervisory review.",
    type: "REVIEW_SUBMITTED",
    caseId: "CAS-2026-002",
    isRead: false,
    createdAt: "2026-09-29 10:00:00"
  },
  {
    id: "NTF-003",
    recipientId: "USR-001",
    title: "Critical Priority Case Created",
    message: "New critical case CAS-2026-004: Sanctions Evasion Sovereign Blacklist is awaiting investigator assignment.",
    type: "UNASSIGNED_ALERT",
    caseId: "CAS-2026-004",
    isRead: false,
    createdAt: "2026-09-29 07:10:00"
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: "AUD-001",
    userId: "USR-001",
    userEmail: "admin@vaspx.demo",
    userRole: "ADMIN",
    action: "SYSTEM_INITIALIZATION",
    entityType: "SYSTEM",
    entityId: "SYS-BOOT",
    details: "VASPX Secure Enterprise Case Management engine initialized with strict RBAC security policies.",
    ip: "127.0.0.1",
    timestamp: "2026-09-29 08:00:00"
  },
  {
    id: "AUD-002",
    userId: "USR-001",
    userEmail: "admin@vaspx.demo",
    userRole: "ADMIN",
    action: "CASE_CREATED",
    entityType: "CASE",
    entityId: "CAS-2026-001",
    details: "Created Case CAS-2026-001: Operation CyberShield.",
    ip: "10.0.4.12",
    timestamp: "2026-09-28 14:30:00"
  },
  {
    id: "AUD-003",
    userId: "USR-001",
    userEmail: "admin@vaspx.demo",
    userRole: "ADMIN",
    action: "CASE_ASSIGNED",
    entityType: "CASE_ASSIGNMENT",
    entityId: "ASG-001",
    details: "Assigned Case CAS-2026-001 to Inspector Vikram Rathore (USR-003).",
    ip: "10.0.4.12",
    timestamp: "2026-09-28 14:45:00"
  },
  {
    id: "AUD-004",
    userId: "USR-003",
    userEmail: "investigator@vaspx.demo",
    userRole: "INVESTIGATOR",
    action: "STATUS_CHANGE",
    entityType: "CASE",
    entityId: "CAS-2026-001",
    details: "Status updated from ASSIGNED to IN_PROGRESS.",
    ip: "10.0.4.55",
    timestamp: "2026-09-28 15:10:00"
  },
  {
    id: "AUD-005",
    userId: "USR-003",
    userEmail: "investigator@vaspx.demo",
    userRole: "INVESTIGATOR",
    action: "EVIDENCE_UPLOAD",
    entityType: "EVIDENCE",
    entityId: "EVD-001",
    details: "Uploaded evidence file vaspx_transaction_flow_cluster_0x71c7.pdf.",
    ip: "10.0.4.55",
    timestamp: "2026-09-29 09:30:00"
  }
];

const INITIAL_LOGIN_LOGS = [
  {
    id: "LOG-001",
    userId: "USR-001",
    email: "admin@vaspx.demo",
    ip: "10.0.4.12",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0",
    status: "SUCCESS",
    timestamp: "2026-09-29 08:12:30"
  },
  {
    id: "LOG-002",
    userId: "USR-002",
    email: "supervisor@vaspx.demo",
    ip: "10.0.4.22",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/128.0.0.0",
    status: "SUCCESS",
    timestamp: "2026-09-29 09:45:00"
  },
  {
    id: "LOG-003",
    userId: "USR-003",
    email: "investigator@vaspx.demo",
    ip: "10.0.4.55",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) Firefox/128.0",
    status: "SUCCESS",
    timestamp: "2026-09-29 11:20:15"
  }
];

class Database {
  constructor() {
    this.filePath = DB_FILE;
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('[DB] Failed to load existing database file, re-seeding:', e.message);
    }

    const initialData = {
      departments: INITIAL_DEPARTMENTS,
      users: INITIAL_USERS,
      cases: INITIAL_CASES,
      caseAssignments: INITIAL_ASSIGNMENTS,
      caseActivities: INITIAL_ACTIVITIES,
      caseNotes: INITIAL_NOTES,
      evidence: INITIAL_EVIDENCE,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      loginLogs: INITIAL_LOGIN_LOGS,
      passwordResetTokens: []
    };

    this.save(initialData);
    return initialData;
  }

  save(dataToSave = this.data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DB] Failed to save database:', e.message);
    }
  }

  // --- USERS & AUTH ---
  findUserByEmail(email) {
    if (!email) return null;
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getAllUsers() {
    return this.data.users.map(({ passwordHash, ...safeUser }) => safeUser);
  }

  getEligibleInvestigators() {
    return this.data.users
      .filter(u => u.role === 'INVESTIGATOR')
      .map(u => {
        const activeCases = this.data.cases.filter(
          c => c.assignedInvestigatorId === u.id && !['RESOLVED', 'CLOSED'].includes(c.status)
        ).length;
        
        let availability = 'AVAILABLE';
        if (!u.active) {
          availability = 'DEACTIVATED';
        } else if (activeCases >= 5) {
          availability = 'MAX_CAPACITY';
        } else if (activeCases >= 3) {
          availability = 'HIGH_WORKLOAD';
        } else if (activeCases >= 1) {
          availability = 'MODERATE';
        }

        return {
          id: u.id,
          employeeId: u.employeeId,
          name: u.name,
          email: u.email,
          role: u.role,
          department: u.department,
          departmentId: u.departmentId,
          designation: u.designation,
          specialization: u.specialization,
          active: u.active,
          avatar: u.avatar,
          activeCasesCount: activeCases,
          availability
        };
      });
  }

  createUser(userData) {
    const newUser = {
      id: `USR-${String(this.data.users.length + 1).padStart(3, '0')}`,
      employeeId: userData.employeeId || `EMP-${Date.now().toString().slice(-4)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: bcrypt.hashSync(userData.password || 'Temporary@123', 10),
      role: userData.role || 'INVESTIGATOR',
      departmentId: userData.departmentId || 'DEP-CYBER',
      department: userData.department || 'National Cyber Crime Threat Unit',
      designation: userData.designation || 'Special Investigator',
      specialization: userData.specialization || 'Blockchain Forensics',
      active: true,
      avatar: userData.avatar || `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random()*100000)}?auto=format&fit=crop&w=120&q=80`,
      phone: userData.phone || '',
      lastLogin: null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.data.users.push(newUser);
    this.save();
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    
    // Prevent updating id
    delete updates.id;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    const { passwordHash, ...safeUser } = this.data.users[idx];
    return safeUser;
  }

  setUserPassword(id, newPassword) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    this.data.users[idx].passwordHash = bcrypt.hashSync(newPassword, 10);
    this.save();
    return true;
  }

  // --- LOGIN LOGS ---
  addLoginLog(log) {
    const newLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      ...log,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.data.loginLogs.unshift(newLog);
    if (this.data.loginLogs.length > 500) this.data.loginLogs.pop();
    this.save();
    return newLog;
  }

  getLoginLogs(limit = 100) {
    return this.data.loginLogs.slice(0, limit);
  }

  // --- PASSWORD RESET TOKENS ---
  createResetToken(userId) {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour
    this.data.passwordResetTokens = this.data.passwordResetTokens.filter(t => t.userId !== userId);
    this.data.passwordResetTokens.push({ token, userId, expiresAt });
    this.save();
    return token;
  }

  verifyResetToken(token) {
    const found = this.data.passwordResetTokens.find(t => t.token === token && t.expiresAt > Date.now());
    return found ? found.userId : null;
  }

  consumeResetToken(token) {
    const userId = this.verifyResetToken(token);
    if (userId) {
      this.data.passwordResetTokens = this.data.passwordResetTokens.filter(t => t.token !== token);
      this.save();
    }
    return userId;
  }

  // --- CASES ---
  getCasesForUser(user) {
    if (!user) return [];
    if (user.role === 'ADMIN') {
      return this.data.cases;
    }
    if (user.role === 'SUPERVISOR') {
      // Supervisors view cases in their department or where they are assigned supervisor
      return this.data.cases.filter(
        c => c.departmentId === user.departmentId || c.assignedSupervisorId === user.id
      );
    }
    if (user.role === 'INVESTIGATOR') {
      // Investigators strictly view ONLY cases assigned to them
      return this.data.cases.filter(c => c.assignedInvestigatorId === user.id);
    }
    return [];
  }

  getCaseById(id, user) {
    const found = this.data.cases.find(c => c.id === id);
    if (!found) return null;
    
    // Check access permission
    if (user.role === 'ADMIN') return found;
    if (user.role === 'SUPERVISOR' && (found.departmentId === user.departmentId || found.assignedSupervisorId === user.id)) {
      return found;
    }
    if (user.role === 'INVESTIGATOR' && found.assignedInvestigatorId === user.id) {
      return found;
    }
    return null; // Forbidden for this user
  }

  createCase(caseData, creator) {
    const nextNum = this.data.cases.length + 1;
    const newCaseId = `CAS-2026-${String(nextNum).padStart(3, '0')}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const newCase = {
      id: newCaseId,
      title: caseData.title,
      description: caseData.description,
      category: caseData.category || "Cyber Crime & Smart Contracts",
      priority: caseData.priority || "MEDIUM",
      status: caseData.assignedInvestigatorId ? "ASSIGNED" : "NEW",
      departmentId: caseData.departmentId || creator.departmentId || "DEP-CYBER",
      suspectWallet: caseData.suspectWallet || "0x0000000000000000000000000000000000000000",
      chain: caseData.chain || "Ethereum",
      riskScore: caseData.riskScore || 75,
      assignedInvestigatorId: caseData.assignedInvestigatorId || null,
      assignedSupervisorId: caseData.assignedSupervisorId || (creator.role === 'SUPERVISOR' ? creator.id : "USR-002"),
      createdById: creator.id,
      dueDate: caseData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      createdAt: now,
      lastUpdatedAt: now,
      balance: caseData.balance || "0.00 ETH ($0.00 USD)",
      attribution: caseData.attribution || {
        vaspCandidate: "Analyzing Transactions...",
        confidence: 0,
        hopDistance: 0,
        evidenceQuality: "Pending Ingestion",
        directDeposit: false,
        depositAddress: null,
        signals: []
      },
      riskBreakdown: caseData.riskBreakdown || { fraud: 50, mixer: 0, darknet: 0, sanctions: 0 },
      typologies: caseData.typologies || []
    };

    this.data.cases.unshift(newCase);

    // Initial activity
    this.addCaseActivity({
      caseId: newCaseId,
      userId: creator.id,
      userName: creator.name,
      userRole: creator.role,
      action: "CASE_CREATED",
      description: `Case ${newCaseId} created with priority ${newCase.priority}.`,
      previousValue: null,
      newValue: newCase.status
    });

    // If initially assigned
    if (caseData.assignedInvestigatorId) {
      const investigator = this.findUserById(caseData.assignedInvestigatorId);
      this.addCaseAssignment({
        caseId: newCaseId,
        investigatorId: investigator.id,
        investigatorName: investigator.name,
        assignedById: creator.id,
        assignedByName: creator.name,
        assignedByRole: creator.role,
        previousInvestigatorId: null,
        previousInvestigatorName: null,
        type: "INITIAL",
        notes: caseData.assignmentNotes || "Assigned upon case creation."
      });

      this.addNotification({
        recipientId: investigator.id,
        title: "New Case Assignment",
        message: `You have been assigned to case ${newCaseId}: ${newCase.title}.`,
        type: "ASSIGNMENT",
        caseId: newCaseId
      });
    }

    this.save();
    return newCase;
  }

  assignCase(caseId, investigatorId, assignedBy, notes = "") {
    const caseItem = this.data.cases.find(c => c.id === caseId);
    if (!caseItem) throw new Error("Case not found");

    const investigator = this.findUserById(investigatorId);
    if (!investigator || !investigator.active) {
      throw new Error("Target investigator not found or is deactivated");
    }
    if (investigator.role !== 'INVESTIGATOR') {
      throw new Error("Assigned user must hold the INVESTIGATOR role");
    }

    const previousInvestigatorId = caseItem.assignedInvestigatorId;
    const previousInvestigator = previousInvestigatorId ? this.findUserById(previousInvestigatorId) : null;
    const isReassignment = !!previousInvestigatorId && previousInvestigatorId !== investigatorId;

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    // Update case record
    caseItem.assignedInvestigatorId = investigatorId;
    caseItem.lastUpdatedAt = now;
    if (caseItem.status === 'NEW') {
      caseItem.status = 'ASSIGNED';
    }

    // Record assignment in immutable history
    const assignmentRecord = {
      id: `ASG-${String(this.data.caseAssignments.length + 1).padStart(3, '0')}`,
      caseId,
      investigatorId: investigator.id,
      investigatorName: investigator.name,
      assignedById: assignedBy.id,
      assignedByName: assignedBy.name,
      assignedByRole: assignedBy.role,
      assignedAt: now,
      previousInvestigatorId: previousInvestigatorId || null,
      previousInvestigatorName: previousInvestigator ? previousInvestigator.name : null,
      type: isReassignment ? "REASSIGNMENT" : "INITIAL",
      notes: notes || (isReassignment ? "Reassigned by supervisory authority." : "Assigned primary lead.")
    };
    this.data.caseAssignments.push(assignmentRecord);

    // Record activity in visual timeline
    this.addCaseActivity({
      caseId,
      userId: assignedBy.id,
      userName: assignedBy.name,
      userRole: assignedBy.role,
      action: isReassignment ? "CASE_REASSIGNED" : "CASE_ASSIGNED",
      description: isReassignment
        ? `Reassigned from ${previousInvestigator ? previousInvestigator.name : 'Unknown'} to ${investigator.name}. Note: ${notes}`
        : `Assigned to investigator ${investigator.name}. Note: ${notes}`,
      previousValue: previousInvestigator ? previousInvestigator.name : "Unassigned",
      newValue: investigator.name
    });

    // Notify new investigator
    this.addNotification({
      recipientId: investigator.id,
      title: isReassignment ? "Case Reassigned to You" : "New Case Assigned",
      message: `You have been assigned to Case ${caseId}: ${caseItem.title}.`,
      type: isReassignment ? "REASSIGNMENT" : "ASSIGNMENT",
      caseId
    });

    // If reassigning, also notify previous investigator
    if (previousInvestigator) {
      this.addNotification({
        recipientId: previousInvestigator.id,
        title: "Case Reassigned",
        message: `Case ${caseId}: ${caseItem.title} has been transferred to ${investigator.name}.`,
        type: "REASSIGNMENT",
        caseId
      });
    }

    // Audit log
    this.addAuditLog({
      userId: assignedBy.id,
      userEmail: assignedBy.email,
      userRole: assignedBy.role,
      action: isReassignment ? "CASE_REASSIGNED" : "CASE_ASSIGNED",
      entityType: "CASE_ASSIGNMENT",
      entityId: assignmentRecord.id,
      details: `${assignedBy.role} ${assignedBy.name} assigned ${caseId} to ${investigator.name}.`
    });

    this.save();
    return { caseItem, assignment: assignmentRecord };
  }

  updateCaseStatus(caseId, newStatus, user, notes = "") {
    const caseItem = this.data.cases.find(c => c.id === caseId);
    if (!caseItem) throw new Error("Case not found");

    const oldStatus = caseItem.status;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    // Strict status transition state machine validation
    // Allowed transitions:
    // NEW -> ASSIGNED (Admin/Supervisor during assignment)
    // ASSIGNED -> IN_PROGRESS (Investigator or Admin/Supervisor)
    // IN_PROGRESS -> UNDER_REVIEW (Investigator or Admin/Supervisor)
    // UNDER_REVIEW -> RESOLVED (Admin/Supervisor)
    // UNDER_REVIEW -> IN_PROGRESS (Admin/Supervisor returning for rework)
    // RESOLVED -> CLOSED (Admin only)
    // CLOSED -> IN_PROGRESS (Admin only for reopening)

    if (newStatus === oldStatus) return caseItem;

    if (newStatus === 'IN_PROGRESS') {
      if (oldStatus !== 'ASSIGNED' && oldStatus !== 'UNDER_REVIEW' && oldStatus !== 'CLOSED') {
        throw new Error(`Cannot transition case from ${oldStatus} to IN_PROGRESS`);
      }
      if (oldStatus === 'CLOSED' && user.role !== 'ADMIN') {
        throw new Error("Only Administrators can reopen a closed case");
      }
    } else if (newStatus === 'UNDER_REVIEW') {
      if (oldStatus !== 'IN_PROGRESS') {
        throw new Error(`Cannot submit for review from status ${oldStatus}`);
      }
    } else if (newStatus === 'RESOLVED') {
      if (user.role !== 'ADMIN' && user.role !== 'SUPERVISOR') {
        throw new Error("Only Supervisors and Administrators can approve and resolve cases");
      }
      if (oldStatus !== 'UNDER_REVIEW' && oldStatus !== 'IN_PROGRESS') {
        throw new Error(`Cannot resolve case from status ${oldStatus}`);
      }
    } else if (newStatus === 'CLOSED') {
      if (user.role !== 'ADMIN') {
        throw new Error("Only Administrators can permanently close cases");
      }
      if (oldStatus !== 'RESOLVED') {
        throw new Error("Case must be in RESOLVED state before closing");
      }
    }

    caseItem.status = newStatus;
    caseItem.lastUpdatedAt = now;

    // Timeline activity
    this.addCaseActivity({
      caseId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "STATUS_CHANGE",
      description: notes ? `Status changed to ${newStatus}. Note: ${notes}` : `Status updated to ${newStatus}.`,
      previousValue: oldStatus,
      newValue: newStatus
    });

    // Notify relevant parties
    if (newStatus === 'UNDER_REVIEW') {
      // Notify supervisor & admin
      if (caseItem.assignedSupervisorId) {
        this.addNotification({
          recipientId: caseItem.assignedSupervisorId,
          title: "Investigation Review Submitted",
          message: `${user.name} submitted Case ${caseId} for your supervisory review.`,
          type: "REVIEW_SUBMITTED",
          caseId
        });
      }
    } else if (newStatus === 'RESOLVED' || newStatus === 'CLOSED') {
      if (caseItem.assignedInvestigatorId) {
        this.addNotification({
          recipientId: caseItem.assignedInvestigatorId,
          title: `Case Marked as ${newStatus}`,
          message: `Case ${caseId} was marked as ${newStatus} by ${user.name}.`,
          type: "STATUS_UPDATE",
          caseId
        });
      }
    } else if (newStatus === 'IN_PROGRESS' && oldStatus === 'UNDER_REVIEW') {
      // Returned for rework
      if (caseItem.assignedInvestigatorId) {
        this.addNotification({
          recipientId: caseItem.assignedInvestigatorId,
          title: "Investigation Returned for Additional Work",
          message: `Supervisor ${user.name} returned Case ${caseId} for additional evidence/clarification. Note: ${notes}`,
          type: "REWORK_REQUIRED",
          caseId
        });
      }
    }

    // Audit log
    this.addAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "CASE_STATUS_CHANGE",
      entityType: "CASE",
      entityId: caseId,
      details: `${user.role} ${user.name} changed status of ${caseId} from ${oldStatus} to ${newStatus}.`
    });

    this.save();
    return caseItem;
  }

  // --- TIMELINE ACTIVITIES ---
  getCaseActivities(caseId) {
    return this.data.caseActivities
      .filter(a => a.caseId === caseId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  addCaseActivity(activity) {
    const newAct = {
      id: `ACT-${String(this.data.caseActivities.length + 1).padStart(3, '0')}`,
      ...activity,
      timestamp: activity.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.data.caseActivities.push(newAct);
    this.save();
    return newAct;
  }

  // --- CASE ASSIGNMENT HISTORY ---
  getCaseAssignments(caseId) {
    return this.data.caseAssignments
      .filter(a => a.caseId === caseId)
      .sort((a, b) => new Date(a.assignedAt) - new Date(b.assignedAt));
  }

  addCaseAssignment(assignment) {
    const newAssignment = {
      id: `ASG-${String(this.data.caseAssignments.length + 1).padStart(3, '0')}`,
      ...assignment,
      assignedAt: assignment.assignedAt || new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.data.caseAssignments.push(newAssignment);
    this.save();
    return newAssignment;
  }

  // --- CASE NOTES ---
  getCaseNotes(caseId, userRole) {
    return this.data.caseNotes
      .filter(n => n.caseId === caseId)
      .filter(n => !n.isInternal || userRole === 'ADMIN' || userRole === 'SUPERVISOR')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addCaseNote(noteData, author) {
    const newNote = {
      id: `NTE-${String(this.data.caseNotes.length + 1).padStart(3, '0')}`,
      caseId: noteData.caseId,
      authorId: author.id,
      authorName: author.name,
      authorRole: author.role,
      content: noteData.content,
      isInternal: !!noteData.isInternal,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.data.caseNotes.push(newNote);

    this.addCaseActivity({
      caseId: noteData.caseId,
      userId: author.id,
      userName: author.name,
      userRole: author.role,
      action: "NOTE_ADDED",
      description: newNote.isInternal ? "Added supervisory internal note." : "Added investigation progress note.",
      previousValue: null,
      newValue: newNote.id
    });

    this.addAuditLog({
      userId: author.id,
      userEmail: author.email,
      userRole: author.role,
      action: "NOTE_ADDED",
      entityType: "CASE_NOTE",
      entityId: newNote.id,
      details: `${author.name} added note to case ${noteData.caseId}.`
    });

    this.save();
    return newNote;
  }

  // --- EVIDENCE ---
  getCaseEvidence(caseId) {
    return this.data.evidence
      .filter(e => e.caseId === caseId)
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }

  addCaseEvidence(evidenceData, uploader) {
    const newEvidence = {
      id: `EVD-${String(this.data.evidence.length + 1).padStart(3, '0')}`,
      caseId: evidenceData.caseId,
      uploaderId: uploader.id,
      uploaderName: uploader.name,
      fileName: evidenceData.fileName || "blockchain_evidence_export.json",
      fileType: evidenceData.fileType || "application/json",
      fileSize: evidenceData.fileSize || "1.2 MB",
      txHashOrDetails: evidenceData.txHashOrDetails || "On-Chain Cluster Verification",
      description: evidenceData.description || "Attribution evidence and transaction traces.",
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.data.evidence.push(newEvidence);

    this.addCaseActivity({
      caseId: evidenceData.caseId,
      userId: uploader.id,
      userName: uploader.name,
      userRole: uploader.role,
      action: "EVIDENCE_ADDED",
      description: `Attached evidence: ${newEvidence.fileName} (${newEvidence.fileSize}).`,
      previousValue: null,
      newValue: newEvidence.id
    });

    this.addAuditLog({
      userId: uploader.id,
      userEmail: uploader.email,
      userRole: uploader.role,
      action: "EVIDENCE_UPLOAD",
      entityType: "EVIDENCE",
      entityId: newEvidence.id,
      details: `${uploader.name} uploaded evidence ${newEvidence.fileName} to ${evidenceData.caseId}.`
    });

    this.save();
    return newEvidence;
  }

  // --- NOTIFICATIONS ---
  getUserNotifications(userId) {
    return this.data.notifications
      .filter(n => n.recipientId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addNotification(notif) {
    const newNotif = {
      id: `NTF-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      ...notif,
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.data.notifications.unshift(newNotif);
    if (this.data.notifications.length > 500) this.data.notifications.pop();
    this.save();
    return newNotif;
  }

  markNotificationRead(id, userId) {
    const notif = this.data.notifications.find(n => n.id === id && n.recipientId === userId);
    if (notif) {
      notif.isRead = true;
      this.save();
    }
    return notif;
  }

  markAllNotificationsRead(userId) {
    this.data.notifications.forEach(n => {
      if (n.recipientId === userId) n.isRead = true;
    });
    this.save();
    return true;
  }

  // --- AUDIT LOGS (IMMUTABLE) ---
  addAuditLog(entry) {
    const newLog = {
      id: `AUD-${String(this.data.auditLogs.length + 1).padStart(4, '0')}`,
      ...entry,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    this.data.auditLogs.unshift(newLog);
    this.save();
    return newLog;
  }

  getAuditLogs(filters = {}) {
    let logs = [...this.data.auditLogs];
    if (filters.action) {
      logs = logs.filter(l => l.action.toLowerCase().includes(filters.action.toLowerCase()));
    }
    if (filters.role) {
      logs = logs.filter(l => l.userRole === filters.role);
    }
    if (filters.userId) {
      logs = logs.filter(l => l.userId === filters.userId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      logs = logs.filter(l =>
        l.details.toLowerCase().includes(q) ||
        l.userEmail.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.entityId.toLowerCase().includes(q)
      );
    }
    return logs.slice(0, filters.limit || 200);
  }

  // --- SYSTEM METRICS & DASHBOARD STATS ---
  getDashboardStats(user) {
    const allCases = this.data.cases;
    const now = new Date();

    if (user.role === 'ADMIN') {
      const totalCases = allCases.length;
      const newCases = allCases.filter(c => c.status === 'NEW').length;
      const activeCases = allCases.filter(c => ['ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW'].includes(c.status)).length;
      const completedCases = allCases.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
      const unassignedCases = allCases.filter(c => !c.assignedInvestigatorId).length;
      const overdueCases = allCases.filter(c => {
        if (['RESOLVED', 'CLOSED'].includes(c.status)) return false;
        return new Date(c.dueDate) < now;
      }).length;

      const investigators = this.getEligibleInvestigators();
      const statusCounts = {
        NEW: newCases,
        ASSIGNED: allCases.filter(c => c.status === 'ASSIGNED').length,
        IN_PROGRESS: allCases.filter(c => c.status === 'IN_PROGRESS').length,
        UNDER_REVIEW: allCases.filter(c => c.status === 'UNDER_REVIEW').length,
        RESOLVED: allCases.filter(c => c.status === 'RESOLVED').length,
        CLOSED: allCases.filter(c => c.status === 'CLOSED').length
      };

      const priorityCounts = {
        CRITICAL: allCases.filter(c => c.priority === 'CRITICAL').length,
        HIGH: allCases.filter(c => c.priority === 'HIGH').length,
        MEDIUM: allCases.filter(c => c.priority === 'MEDIUM').length,
        LOW: allCases.filter(c => c.priority === 'LOW').length
      };

      return {
        role: 'ADMIN',
        totalCases,
        newCases,
        activeCases,
        completedCases,
        unassignedCases,
        overdueCases,
        totalInvestigators: investigators.length,
        availableInvestigators: investigators.filter(i => i.availability === 'AVAILABLE').length,
        statusCounts,
        priorityCounts,
        investigatorWorkload: investigators.map(i => ({
          name: i.name,
          employeeId: i.employeeId,
          activeCasesCount: i.activeCasesCount,
          specialization: i.specialization,
          availability: i.availability
        })),
        recentActivity: this.data.caseActivities.slice(-10).reverse()
      };
    }

    if (user.role === 'SUPERVISOR') {
      const teamCases = allCases.filter(
        c => c.departmentId === user.departmentId || c.assignedSupervisorId === user.id
      );
      const activeCases = teamCases.filter(c => ['ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW'].includes(c.status)).length;
      const pendingReviews = teamCases.filter(c => c.status === 'UNDER_REVIEW').length;
      const unassignedTeamCases = teamCases.filter(c => !c.assignedInvestigatorId).length;
      const overdueTeamCases = teamCases.filter(c => {
        if (['RESOLVED', 'CLOSED'].includes(c.status)) return false;
        return new Date(c.dueDate) < now;
      }).length;
      const completedCases = teamCases.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length;

      const teamInvestigators = this.getEligibleInvestigators().filter(
        i => i.departmentId === user.departmentId
      );

      return {
        role: 'SUPERVISOR',
        teamDepartment: user.department,
        totalTeamCases: teamCases.length,
        activeCases,
        pendingReviews,
        unassignedTeamCases,
        overdueTeamCases,
        completedCases,
        teamInvestigators,
        pendingReviewCases: teamCases.filter(c => c.status === 'UNDER_REVIEW'),
        recentActivity: this.data.caseActivities
          .filter(a => teamCases.some(tc => tc.id === a.caseId))
          .slice(-10)
          .reverse()
      };
    }

    if (user.role === 'INVESTIGATOR') {
      const myCases = allCases.filter(c => c.assignedInvestigatorId === user.id);
      const activeCases = myCases.filter(c => ['ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length;
      const newAssignments = myCases.filter(c => c.status === 'ASSIGNED').length;
      const underReview = myCases.filter(c => c.status === 'UNDER_REVIEW').length;
      const completedCases = myCases.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
      const overdueCases = myCases.filter(c => {
        if (['RESOLVED', 'CLOSED'].includes(c.status)) return false;
        return new Date(c.dueDate) < now;
      }).length;

      return {
        role: 'INVESTIGATOR',
        totalAssignedCases: myCases.length,
        activeCases,
        newAssignments,
        underReview,
        completedCases,
        overdueCases,
        casesRequiringAction: myCases.filter(c => c.status === 'ASSIGNED' || c.priority === 'CRITICAL'),
        upcomingDeadlines: myCases
          .filter(c => !['RESOLVED', 'CLOSED'].includes(c.status))
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 5),
        recentActivity: this.data.caseActivities
          .filter(a => myCases.some(mc => mc.id === a.caseId))
          .slice(-10)
          .reverse()
      };
    }

    return {};
  }
}

const db = new Database();
module.exports = { db };
