// VASPX Global VASP Map, Attribution Lab, and Investigators Matrix
window.VaspIntelligenceTools = (function() {
  const { useState, useEffect, useRef } = React;

  const GLOBAL_VASPS = [
    { id: "vasp-alpha", name: "VASP Alpha", type: "Centralized Exchange", country: "Singapore", jurisdiction: "MAS Authorized", code: "SG-MAS-2024", risk: "Low", cases: 14, wallets: 1420, lat: 1.3521, lng: 103.8198 },
    { id: "binance", name: "Binance Global", type: "Centralized Exchange", country: "UAE", jurisdiction: "VARA Licensed", code: "UAE-VARA-8812", risk: "Low", cases: 42, wallets: 18450, lat: 25.2048, lng: 55.2708 },
    { id: "coinbase", name: "Coinbase Prime", type: "Custodial Exchange", country: "United States", jurisdiction: "US FinCEN Registered", code: "US-MSB-31000", risk: "Low", cases: 8, wallets: 12200, lat: 37.7749, lng: -122.4194 },
    { id: "kraken", name: "Kraken Pay", type: "Trading Platform", country: "United States", jurisdiction: "US FinCEN", code: "US-MSB-99812", risk: "Low", cases: 6, wallets: 6400, lat: 40.7128, lng: -74.0060 },
    { id: "coindcx", name: "CoinDCX LEA Portal", type: "Centralized Exchange", country: "India", jurisdiction: "FIU-IND Registered", code: "IND-FIU-7721", risk: "Low", cases: 28, wallets: 5100, lat: 19.0760, lng: 72.8777 },
    { id: "wazirx", name: "WazirX India", type: "Centralized Exchange", country: "India", jurisdiction: "FIU-IND Registered", code: "IND-FIU-4410", risk: "Medium", cases: 19, wallets: 3800, lat: 28.6139, lng: 77.2090 },
    { id: "tornado", name: "Tornado Cash Protocol", type: "Mixer / Tumbler", country: "Decentralized", jurisdiction: "OFAC Sanctioned Entity", code: "SANCTIONED-OFAC", risk: "High", cases: 67, wallets: 890, lat: 52.3676, lng: 4.9041 },
    { id: "renbridge", name: "RenBridge Liquidity", type: "DeFi Bridge", country: "Decentralized", jurisdiction: "Unregulated Bridge", code: "DEFI-BRIDGE-01", risk: "Medium", cases: 15, wallets: 1120, lat: 51.5074, lng: -0.1278 }
  ];

  // -------------------------------------------------------------
  // 1. GLOBAL VASP MAP
  // -------------------------------------------------------------
  function GlobalVaspMap() {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [selectedVasp, setSelectedVasp] = useState(GLOBAL_VASPS[0]);

    useEffect(() => {
      if (!mapContainerRef.current || !window.L) return;

      if (!mapInstanceRef.current) {
        const map = window.L.map(mapContainerRef.current).setView([20, 20], 2);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        GLOBAL_VASPS.forEach(vasp => {
          const marker = window.L.circleMarker([vasp.lat, vasp.lng], {
            radius: 8,
            fillColor: vasp.risk === 'High' ? '#ef4444' : vasp.risk === 'Medium' ? '#f59e0b' : '#0ea5e9',
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.85
          }).addTo(map);

          marker.bindPopup(`
            <div style="font-family: sans-serif; font-size: 11px; padding: 4px;">
              <b>${vasp.name}</b><br/>
              <span>Jurisdiction: ${vasp.jurisdiction}</span><br/>
              <span>Active Inquiries: ${vasp.cases}</span>
            </div>
          `);

          marker.on('click', () => {
            setSelectedVasp(vasp);
          });
        });

        mapInstanceRef.current = map;
      }

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, []);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <i data-lucide="globe" className="w-5 h-5 text-sky-600"></i>
              <span>Global VASP Regulatory Directory & Jurisdictional Radar</span>
            </h2>
            <p className="text-xs text-slate-500">
              Interactive geographic tracking of licensed custodial exchanges, FIU registrations, and sanctioned entities
            </p>
          </div>
          <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            {GLOBAL_VASPS.length} REGISTERED ENTITIES
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-2 shadow-sm overflow-hidden">
            <div ref={mapContainerRef} className="w-full h-[450px] rounded-lg"></div>
          </div>

          {/* VASP Particulars Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                VASP Compliance Card
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                selectedVasp.risk === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                selectedVasp.risk === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {selectedVasp.risk} Risk Entity
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Entity Name</span>
                <span className="text-base font-bold text-slate-900">{selectedVasp.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Jurisdiction</span>
                  <span className="font-semibold text-slate-800">{selectedVasp.country}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Entity Category</span>
                  <span className="font-semibold text-slate-800">{selectedVasp.type}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Regulatory Authority</span>
                <span className="font-medium text-slate-800">{selectedVasp.jurisdiction}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Registration Code</span>
                <span className="font-mono text-sky-700 bg-sky-50 px-2 py-1 rounded border border-sky-100 block mt-0.5">
                  {selectedVasp.code}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div className="p-2 rounded bg-slate-50 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Tracked Inquiries</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{selectedVasp.cases} Cases</span>
                </div>
                <div className="p-2 rounded bg-slate-50 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Known Wallets</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{selectedVasp.wallets} Addresses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. ATTRIBUTION LAB
  // -------------------------------------------------------------
  function AttributionLab() {
    const [targetAddress, setTargetAddress] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d89A2');
    const [chain, setChain] = useState('Ethereum');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleRunAttribution = () => {
      setAnalyzing(true);
      setTimeout(() => {
        setResult({
          candidate: 'VASP Alpha (MAS SG)',
          confidence: 89,
          hopDistance: 2,
          directDeposit: true,
          depositAddress: '0x3F88a91B24dE28a01C8974dF2356B278d6541A91',
          signals: [
            { name: "Known Omnibus Cluster Deposit", weight: "+35%", desc: "Direct match with tagged VASP Alpha cold-wallet cluster" },
            { name: "Peeling Chain Pattern", weight: "+25%", desc: "5-hop systematic decrement peeling detected" },
            { name: "Asian Market Time Consistency", weight: "+15%", desc: "Transactions executed during 09:00 - 17:00 SGT" },
            { name: "Section 91 Pre-Verification", weight: "+14%", desc: "Entity previously acknowledged KYC SAR response" }
          ]
        });
        setAnalyzing(false);
      }, 700);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <i data-lucide="cpu" className="w-5 h-5 text-indigo-600"></i>
              <span>VASP Attribution & Forensic Scoring Laboratory</span>
            </h2>
            <p className="text-xs text-slate-500">
              Heuristic graph clustering, exchange deposit attribution, and evidentiary score computation
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Address or Tx Hash</label>
              <input
                type="text"
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blockchain</label>
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Bitcoin">Bitcoin</option>
                <option value="Tron">Tron</option>
                <option value="BNB Chain">BNB Chain</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleRunAttribution}
                disabled={analyzing}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
              >
                {analyzing ? <i data-lucide="loader-2" className="w-4 h-4 animate-spin"></i> : <i data-lucide="zap" className="w-4 h-4"></i>}
                <span>Execute Attribution Analysis</span>
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Identified Attributed Entity</div>
                <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{result.candidate}</span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {result.confidence}% Match
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Hop Distance</div>
                <div className="text-sm font-mono font-bold text-slate-800">{result.hopDistance} hops to deposit</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Signals Supporting Attribution</h4>
              {result.signals.map((s, i) => (
                <div key={i} className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">{s.name}</span>
                    <p className="text-[11px] text-slate-500">{s.desc}</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {s.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. INVESTIGATORS ROSTER MATRIX
  // -------------------------------------------------------------
  function InvestigatorsMatrix({ onAssignCase }) {
    const [investigators, setInvestigators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function load() {
        try {
          setLoading(true);
          const res = await window.VaspxAPI.getInvestigators();
          setInvestigators(res.investigators || []);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
      load();
    }, []);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <i data-lucide="users" className="w-5 h-5 text-indigo-600"></i>
              <span>National Investigator Caseload & Specialization Matrix</span>
            </h2>
            <p className="text-xs text-slate-500">
              Departmental duty roster, capacity index, and active case assignment loads
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investigators.map((inv) => (
            <div key={inv.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={inv.avatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{inv.name}</h3>
                    <div className="text-[10px] text-slate-400 font-mono">{inv.employeeId}</div>
                  </div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${window.Dashboards.getAvailabilityBadge(inv.availability)}`}>
                  {inv.availability.replace('_', ' ')}
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-600">
                <div><span className="font-semibold text-slate-800">Unit:</span> {inv.department}</div>
                <div><span className="font-semibold text-slate-800">Specialization:</span> {inv.specialization}</div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Active Investigations:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{inv.activeCasesCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return {
    GlobalVaspMap,
    AttributionLab,
    InvestigatorsMatrix
  };
})();
