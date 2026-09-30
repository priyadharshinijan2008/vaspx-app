// VASPX Smart Investigator Assignment & Case Creation Modals
window.AssignmentAndCreationModals = (function() {
  const { useState, useEffect } = React;

  // -------------------------------------------------------------
  // 1. SMART INVESTIGATOR ASSIGNMENT MODAL
  // -------------------------------------------------------------
  function SmartAssignmentModal({ caseId, onClose, onAssignedSuccess }) {
    const [investigators, setInvestigators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvestigatorId, setSelectedInvestigatorId] = useState(null);
    const [notes, setNotes] = useState('');
    const [specFilter, setSpecFilter] = useState('ALL');
    const [availFilter, setAvailFilter] = useState('ALL');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      async function load() {
        try {
          setLoading(true);
          const res = await window.VaspxAPI.getInvestigators();
          setInvestigators(res.investigators || []);
        } catch (err) {
          setError(err.message || 'Failed to load eligible investigators');
        } finally {
          setLoading(false);
        }
      }
      load();
    }, []);

    const specializations = Array.from(new Set(investigators.map(i => i.specialization).filter(Boolean)));

    const filteredInvestigators = investigators.filter(inv => {
      const matchSpec = specFilter === 'ALL' || inv.specialization === specFilter;
      const matchAvail = availFilter === 'ALL' || inv.availability === availFilter;
      return matchSpec && matchAvail;
    });

    const handleAssign = async () => {
      if (!selectedInvestigatorId) {
        setError('Please select an eligible investigator from the roster.');
        return;
      }

      setSubmitting(true);
      setError(null);
      try {
        await window.VaspxAPI.assignCase(caseId, selectedInvestigatorId, notes.trim());
        onAssignedSuccess();
      } catch (err) {
        setError(err.message || 'Assignment failed.');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <i data-lucide="user-plus" className="w-4 h-4 text-sky-600"></i>
                <span>Smart Investigator Dispatch & Allocation</span>
              </h3>
              <p className="text-xs text-slate-500">Case Docket Reference: <span className="font-mono font-bold text-slate-900">{caseId}</span></p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100">
              <i data-lucide="x" className="w-4 h-4"></i>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Filter Bar */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Filter by Specialization
              </label>
              <select
                value={specFilter}
                onChange={(e) => setSpecFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="ALL">All Specializations</option>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Filter by Workload Availability
              </label>
              <select
                value={availFilter}
                onChange={(e) => setAvailFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="ALL">All Availabilities</option>
                <option value="AVAILABLE">AVAILABLE (0-1 Cases)</option>
                <option value="MODERATE">MODERATE (1-2 Cases)</option>
                <option value="HIGH_WORKLOAD">HIGH WORKLOAD (3-4 Cases)</option>
                <option value="MAX_CAPACITY">MAX CAPACITY (5+ Cases)</option>
              </select>
            </div>
          </div>

          {/* Investigators Roster */}
          <div className="flex-1 overflow-y-auto space-y-2 border border-slate-200 rounded-lg p-2 min-h-[220px]">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading investigator availability...</div>
            ) : filteredInvestigators.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No investigators match the selected criteria.</div>
            ) : (
              filteredInvestigators.map((inv) => {
                const isSelected = selectedInvestigatorId === inv.id;
                const isDeactivated = !inv.active;
                return (
                  <div
                    key={inv.id}
                    onClick={() => !isDeactivated && setSelectedInvestigatorId(inv.id)}
                    className={`p-3 rounded-lg border transition cursor-pointer flex items-center justify-between ${
                      isDeactivated
                        ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200'
                        : isSelected
                        ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-300'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={inv.avatar} className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{inv.name}</span>
                          <span className="font-mono text-[10px] text-slate-400">{inv.employeeId}</span>
                        </div>
                        <div className="text-[11px] text-slate-600">{inv.specialization}</div>
                        <div className="text-[10px] text-slate-400">{inv.department}</div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${window.Dashboards.getAvailabilityBadge(inv.availability)}`}>
                        {inv.availability.replace('_', ' ')}
                      </span>
                      <div className="text-[10px] font-mono text-slate-500">
                        Active: <span className="font-bold text-slate-800">{inv.activeCasesCount} cases</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Directive Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supervisory Assignment Directive & Terms (Recorded in Audit Trail)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Assigned lead for peeling chain forensics; dispatch Section 91 notice within 48h."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting || !selectedInvestigatorId}
              onClick={handleAssign}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm disabled:opacity-50 flex items-center gap-1.5 transition"
            >
              {submitting && <i data-lucide="loader-2" className="w-3.5 h-3.5 animate-spin"></i>}
              <span>Authorize & Dispatch Assignment</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. CASE CREATION MODAL
  // -------------------------------------------------------------
  function CaseCreationModal({ onClose, onCreatedSuccess }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Cyber Crime & Smart Contracts');
    const [priority, setPriority] = useState('MEDIUM');
    const [suspectWallet, setSuspectWallet] = useState('');
    const [chain, setChain] = useState('Ethereum');
    const [balance, setBalance] = useState('');
    const [riskScore, setRiskScore] = useState(80);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!title.trim() || !description.trim()) {
        setError('Title and description are required.');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        await window.VaspxAPI.createCase({
          title: title.trim(),
          description: description.trim(),
          category,
          priority,
          suspectWallet: suspectWallet.trim() || '0x0000000000000000000000000000000000000000',
          chain,
          balance: balance.trim() || '0.00 ETH ($0.00 USD)',
          riskScore: parseInt(riskScore, 10) || 75,
          dueDate
        });
        onCreatedSuccess();
      } catch (err) {
        setError(err.message || 'Failed to create case.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="plus-circle" className="w-4 h-4 text-sky-600"></i>
              <span>Initiate New Investigation Docket</span>
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100">
              <i data-lucide="x" className="w-4 h-4"></i>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Case Subject / Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Operation DarkHorizon: DeFi Flash Loan Drainage"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category / Typology</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                >
                  <option value="Cyber Crime & Smart Contracts">Cyber Crime & Smart Contracts</option>
                  <option value="Ransomware & Extortion">Ransomware & Extortion</option>
                  <option value="Phishing & Fraud">Phishing & Fraud</option>
                  <option value="Financial Crime & AML">Financial Crime & AML</option>
                  <option value="Darknet Markets">Darknet Markets</option>
                  <option value="Sanctions Evasion">Sanctions Evasion</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Case Description & Forensic Summary *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail incident origin, compromised contracts, victim loss details..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Suspect Wallet Address</label>
                <input
                  type="text"
                  value={suspectWallet}
                  onChange={(e) => setSuspectWallet(e.target.value)}
                  placeholder="0x71C7...89A2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Blockchain Network</label>
                <select
                  value={chain}
                  onChange={(e) => setChain(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                >
                  <option value="Ethereum">Ethereum (ERC-20)</option>
                  <option value="Bitcoin">Bitcoin (UTXO)</option>
                  <option value="Tron">Tron (TRC-20)</option>
                  <option value="BNB Chain">BNB Chain (BEP-20)</option>
                  <option value="Solana">Solana (SPL)</option>
                  <option value="Polygon">Polygon (POS)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tracked Balance</label>
                <input
                  type="text"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="142.50 ETH"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Risk Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={riskScore}
                  onChange={(e) => setRiskScore(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Statutory Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                {loading && <i data-lucide="loader-2" className="w-3.5 h-3.5 animate-spin"></i>}
                <span>Initiate Case Docket</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return {
    SmartAssignmentModal,
    CaseCreationModal
  };
})();
