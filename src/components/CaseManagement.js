// VASPX Case Management, Search, Filters, and Deep Investigation Workspace
window.CaseManagement = (function() {
  const { useState, useEffect, useRef } = React;

  // -------------------------------------------------------------
  // 1. CASES LIST & ADVANCED SEARCH TABLE
  // -------------------------------------------------------------
  function CaseListView({ user, onOpenCase, onAssignCase, onCreateCase }) {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [selectedPriority, setSelectedPriority] = useState('ALL');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    const fetchCases = async () => {
      try {
        setLoading(true);
        const res = await window.VaspxAPI.getCases();
        setCases(res.cases || []);
      } catch (err) {
        console.error('Failed to load cases:', err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchCases();
    }, []);

    // Filter cases
    const filteredCases = cases.filter(c => {
      const q = search.toLowerCase();
      const matchSearch =
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        (c.suspectWallet && c.suspectWallet.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q));

      const matchStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
      const matchPriority = selectedPriority === 'ALL' || c.priority === selectedPriority;
      const matchCategory = selectedCategory === 'ALL' || c.category === selectedCategory;

      return matchSearch && matchStatus && matchPriority && matchCategory;
    });

    const categories = Array.from(new Set(cases.map(c => c.category).filter(Boolean)));

    return (
      <div className="space-y-4">
        {/* Header & Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <i data-lucide="briefcase" className="w-5 h-5 text-sky-600"></i>
              <span>{user.role === 'INVESTIGATOR' ? 'My Assigned Case Docket' : 'Official Case Inquiries Repository'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {user.role === 'INVESTIGATOR'
                ? 'Authorized cases allocated to your badge number. Complete access isolation enabled.'
                : 'Central repository of ongoing virtual asset attribution cases and inter-agency investigations.'}
            </p>
          </div>

          {(user.role === 'ADMIN' || user.role === 'SUPERVISOR') && (
            <button
              onClick={onCreateCase}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
            >
              <i data-lucide="plus-circle" className="w-4 h-4"></i>
              <span>Initiate Case</span>
            </button>
          )}
        </div>

        {/* Search & Multi-Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <i data-lucide="search" className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Case ID, title, wallet address, or category..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">NEW</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>
        </div>

        {/* Case Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">
              <i data-lucide="loader-2" className="w-6 h-6 animate-spin mx-auto text-sky-600 mb-2"></i>
              Querying database records...
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <i data-lucide="inbox" className="w-8 h-8 text-slate-300 mx-auto mb-2"></i>
              No cases matching your criteria or access authorization.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Case ID</th>
                    <th className="py-3 px-4">Case Subject & Category</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Target VASP Attribution</th>
                    <th className="py-3 px-4">Statutory Due</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCases.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {c.id}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate" title={c.title}>
                          {c.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {c.category} • <span className="font-mono">{c.chain}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityBadge(c.priority)}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${window.Dashboards.getStatusBadge(c.status)}`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 text-[11px]">
                          {c.attribution?.vaspCandidate || 'Analysis Pending'}
                        </div>
                        {c.attribution?.confidence ? (
                          <div className="text-[10px] text-emerald-600 font-bold font-mono">
                            {c.attribution.confidence}% Confidence Match
                          </div>
                        ) : null}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {c.dueDate}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {(user.role === 'ADMIN' || user.role === 'SUPERVISOR') && (
                          <button
                            onClick={() => onAssignCase(c.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-sky-700 bg-white hover:bg-slate-50 border border-slate-200 rounded transition"
                          >
                            Assign
                          </button>
                        )}
                        <button
                          onClick={() => onOpenCase(c.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded shadow-sm transition"
                        >
                          Workspace
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. CASE DETAILS WORKSPACE & INVESTIGATION ENGINE
  // -------------------------------------------------------------
  function CaseDetailsWorkspace({ caseId, user, onBack, onOpenAssignModal }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // overview, timeline, evidence, notes, graph
    const [actionLoading, setActionLoading] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [isInternalNote, setIsInternalNote] = useState(false);
    const [showReassignModal, setShowReassignModal] = useState(false);
    const [reassignReason, setReassignReason] = useState('');

    const graphContainerRef = useRef(null);

    const loadCase = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await window.VaspxAPI.getCaseDetails(caseId);
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to retrieve case details. Access may be restricted.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadCase();
    }, [caseId]);

    // Initialize Cytoscape graph when graph tab is open
    useEffect(() => {
      if (activeTab === 'graph' && graphContainerRef.current && window.cytoscape) {
        try {
          const cy = window.cytoscape({
            container: graphContainerRef.current,
            elements: [
              { data: { id: 'suspect', label: `Suspect Wallet\n${data?.case?.suspectWallet?.slice(0, 10)}...`, type: 'suspect' } },
              { data: { id: 'hop1', label: 'Intermediary Hop 1\n0x98b1...4120', type: 'wallet' } },
              { data: { id: 'mixer', label: 'Tornado Cash Pool\nPrivacy Mixer', type: 'mixer' } },
              { data: { id: 'hop2', label: 'Consolidation Peeler\n0xd831...aa91', type: 'wallet' } },
              { data: { id: 'vasp', label: `${data?.case?.attribution?.vaspCandidate || 'Target VASP'}\nDeposit Hot Wallet`, type: 'vasp' } },
              { data: { source: 'suspect', target: 'hop1', label: '42.5 ETH' } },
              { data: { source: 'hop1', target: 'mixer', label: '10 ETH Split' } },
              { data: { source: 'hop1', target: 'hop2', label: '32.5 ETH' } },
              { data: { source: 'hop2', target: 'vasp', label: 'Attributed Deposit' } }
            ],
            style: [
              {
                selector: 'node',
                style: {
                  'label': 'data(label)',
                  'text-wrap': 'wrap',
                  'font-size': '10px',
                  'text-valign': 'center',
                  'text-halign': 'center',
                  'color': '#0f172a',
                  'background-color': '#94a3b8',
                  'border-width': 2,
                  'border-color': '#cbd5e1',
                  'width': 60,
                  'height': 60
                }
              },
              {
                selector: 'node[type="suspect"]',
                style: {
                  'background-color': '#f43f5e',
                  'border-color': '#be123c',
                  'color': '#ffffff'
                }
              },
              {
                selector: 'node[type="vasp"]',
                style: {
                  'background-color': '#0284c7',
                  'border-color': '#0369a1',
                  'color': '#ffffff'
                }
              },
              {
                selector: 'node[type="mixer"]',
                style: {
                  'background-color': '#f59e0b',
                  'border-color': '#d97706',
                  'color': '#ffffff'
                }
              },
              {
                selector: 'edge',
                style: {
                  'width': 2,
                  'line-color': '#94a3b8',
                  'target-arrow-color': '#94a3b8',
                  'target-arrow-shape': 'triangle',
                  'curve-style': 'bezier',
                  'label': 'data(label)',
                  'font-size': '9px',
                  'text-background-opacity': 1,
                  'text-background-color': '#ffffff',
                  'text-background-padding': '2px'
                }
              }
            ],
            layout: {
              name: 'breadthfirst',
              directed: true,
              padding: 20
            }
          });
        } catch (e) {
          console.error("Cytoscape render error:", e);
        }
      }
    }, [activeTab, data]);

    const handleStatusTransition = async (nextStatus, notes) => {
      try {
        setActionLoading(true);
        await window.VaspxAPI.updateCaseStatus(caseId, nextStatus, notes);
        await loadCase();
      } catch (err) {
        alert(err.message || 'Status transition failed.');
      } finally {
        setActionLoading(false);
      }
    };

    const handleAddNote = async (e) => {
      e.preventDefault();
      if (!newNote.trim()) return;
      try {
        setActionLoading(true);
        await window.VaspxAPI.addCaseNote(caseId, newNote.trim(), isInternalNote);
        setNewNote('');
        await loadCase();
      } catch (err) {
        alert(err.message || 'Failed to add note');
      } finally {
        setActionLoading(false);
      }
    };

    const handleAddSampleEvidence = async () => {
      const fileName = `cryptographic_audit_extract_${Date.now().toString().slice(-4)}.json`;
      try {
        setActionLoading(true);
        await window.VaspxAPI.addCaseEvidence(caseId, {
          fileName,
          fileType: "application/json",
          fileSize: "840 KB",
          txHashOrDetails: "Clustered Tx Hashes (14 nodes, 2 hops)",
          description: "Cryptographic trace proving direct deposit relationship to identified VASP custodial wallet."
        });
        await loadCase();
      } catch (err) {
        alert(err.message || 'Failed to upload evidence');
      } finally {
        setActionLoading(false);
      }
    };

    const handleRequestReassignment = async (e) => {
      e.preventDefault();
      try {
        setActionLoading(true);
        await window.VaspxAPI.requestReassignment(caseId, reassignReason);
        setShowReassignModal(false);
        setReassignReason('');
        await loadCase();
        alert('Reassignment request has been formally recorded and dispatched to supervisory oversight.');
      } catch (err) {
        alert(err.message || 'Failed to submit reassignment request');
      } finally {
        setActionLoading(false);
      }
    };

    if (loading) {
      return (
        <div className="p-12 text-center text-xs text-slate-500">
          <i data-lucide="loader-2" className="w-8 h-8 animate-spin mx-auto text-sky-600 mb-2"></i>
          Decrypting and loading authenticated case file...
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 max-w-lg mx-auto bg-rose-50 border border-rose-200 rounded-xl text-center space-y-3">
          <i data-lucide="shield-alert" className="w-10 h-10 text-rose-600 mx-auto"></i>
          <h3 className="text-sm font-bold text-rose-900">Access Restricted / Permission Denied</h3>
          <p className="text-xs text-rose-700">{error}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-rose-600 text-white rounded text-xs font-semibold hover:bg-rose-500"
          >
            Return to Case List
          </button>
        </div>
      );
    }

    const { case: c, investigator, supervisor, assignments, timeline, notes, evidence } = data;

    // Strict workflow status state machine:
    // Determine allowed actions by user role:
    const canAccept = user.role === 'INVESTIGATOR' && c.status === 'ASSIGNED';
    const canSubmitReview = (user.role === 'INVESTIGATOR' || user.role === 'ADMIN') && c.status === 'IN_PROGRESS';
    const canApproveReview = (user.role === 'SUPERVISOR' || user.role === 'ADMIN') && c.status === 'UNDER_REVIEW';
    const canReturnReview = (user.role === 'SUPERVISOR' || user.role === 'ADMIN') && c.status === 'UNDER_REVIEW';
    const canClose = user.role === 'ADMIN' && c.status === 'RESOLVED';
    const canReopen = user.role === 'ADMIN' && c.status === 'CLOSED';
    const canAssign = user.role === 'ADMIN' || user.role === 'SUPERVISOR';
    const canRequestReassign = user.role === 'INVESTIGATOR' && ['ASSIGNED', 'IN_PROGRESS'].includes(c.status);

    return (
      <div className="space-y-5">
        {/* Top Breadcrumb & Workflow Action Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
              >
                <i data-lucide="arrow-left" className="w-4 h-4"></i>
                <span>Back</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="font-mono text-xs font-bold text-slate-900">{c.id}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${window.Dashboards.getStatusBadge(c.status)}`}>
                {c.status.replace('_', ' ')}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getPriorityBadge(c.priority)}`}>
                {c.priority}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">{c.title}</h1>
          </div>

          {/* Workflow Action Buttons (Role-Guarded) */}
          <div className="flex flex-wrap items-center gap-2">
            {canAccept && (
              <button
                disabled={actionLoading}
                onClick={() => handleStatusTransition('IN_PROGRESS', 'Investigator accepted assignment')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <i data-lucide="play" className="w-3.5 h-3.5"></i>
                <span>Accept & Begin Investigation</span>
              </button>
            )}

            {canSubmitReview && (
              <button
                disabled={actionLoading}
                onClick={() => handleStatusTransition('UNDER_REVIEW', 'Investigation submitted for supervisor approval')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <i data-lucide="check-square" className="w-3.5 h-3.5"></i>
                <span>Submit for Supervisory Review</span>
              </button>
            )}

            {canApproveReview && (
              <button
                disabled={actionLoading}
                onClick={() => handleStatusTransition('RESOLVED', 'Supervisor signed off and approved resolution')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <i data-lucide="check-circle-2" className="w-3.5 h-3.5"></i>
                <span>Approve & Mark Resolved</span>
              </button>
            )}

            {canReturnReview && (
              <button
                disabled={actionLoading}
                onClick={() => handleStatusTransition('IN_PROGRESS', 'Returned for additional forensic clarification')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <i data-lucide="rotate-ccw" className="w-3.5 h-3.5"></i>
                <span>Return for Additional Inquiries</span>
              </button>
            )}

            {canClose && (
              <button
                disabled={actionLoading}
                onClick={() => handleStatusTransition('CLOSED', 'Case file permanently archived and closed')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <i data-lucide="archive" className="w-3.5 h-3.5"></i>
                <span>Archive & Close Case</span>
              </button>
            )}

            {canReopen && (
              <button
                disabled={actionLoading}
                onClick={() => handleStatusTransition('IN_PROGRESS', 'Administrator reopened case')}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <i data-lucide="unlock" className="w-3.5 h-3.5"></i>
                <span>Reopen Case</span>
              </button>
            )}

            {canAssign && (
              <button
                onClick={() => onOpenAssignModal(c.id)}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <i data-lucide="user-plus" className="w-3.5 h-3.5 text-slate-500"></i>
                <span>{c.assignedInvestigatorId ? 'Reassign Investigator' : 'Assign Investigator'}</span>
              </button>
            )}

            {canRequestReassign && (
              <button
                onClick={() => setShowReassignModal(true)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium flex items-center gap-1"
                title="Request Reassignment"
              >
                <i data-lucide="user-x" className="w-3.5 h-3.5 text-slate-500"></i>
                <span>Request Reassignment</span>
              </button>
            )}
          </div>
        </div>

        {/* Visual Workflow Steps Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Statutory Workflow Progress
          </div>
          <WorkflowProgressBar status={c.status} />
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-2">
          {[
            { id: 'overview', label: 'Case Overview & Attribution', icon: 'file-text' },
            { id: 'timeline', label: `Chronological Timeline (${timeline?.length || 0})`, icon: 'clock' },
            { id: 'graph', label: 'Attribution Flow Graph', icon: 'git-merge' },
            { id: 'evidence', label: `Evidence Vault (${evidence?.length || 0})`, icon: 'folder-lock' },
            { id: 'notes', label: `Investigation Notes (${notes?.length || 0})`, icon: 'message-square' },
            { id: 'assignments', label: `Assignment Audit (${assignments?.length || 0})`, icon: 'user-check' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <i data-lucide={tab.icon} className="w-3.5 h-3.5"></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & ATTRIBUTION */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Case Particulars */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i data-lucide="info" className="w-4 h-4 text-sky-600"></i>
                  <span>Case Particulars & Target Parameters</span>
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {c.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Suspect Wallet</span>
                    <span className="font-mono font-bold text-slate-900 truncate block mt-0.5" title={c.suspectWallet}>
                      {c.suspectWallet}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Blockchain Network</span>
                    <span className="font-semibold text-slate-900 block mt-0.5">{c.chain}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tracked Balance</span>
                    <span className="font-mono font-bold text-slate-900 block mt-0.5">{c.balance}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Risk Index</span>
                    <span className="font-mono font-bold text-rose-600 block mt-0.5">{c.riskScore} / 100</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Created Timestamp</span>
                    <span className="font-mono text-slate-600 block mt-0.5 text-[11px]">{c.createdAt}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Statutory Due Date</span>
                    <span className="font-mono text-slate-900 block mt-0.5 text-[11px] font-bold">{c.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Attribution Signals Matrix */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <i data-lucide="cpu" className="w-4 h-4 text-indigo-600"></i>
                    <span>VASP Attribution Signals & Evidence Weight</span>
                  </h3>
                  <span className="text-xs font-bold font-mono text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {c.attribution?.confidence}% Match
                  </span>
                </div>

                <div className="space-y-2">
                  {c.attribution?.signals && c.attribution.signals.map((sig, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-800">{sig.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{sig.desc}</div>
                      </div>
                      <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        {sig.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Officer & Supervisory Assignment Card */}
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i data-lucide="shield" className="w-4 h-4 text-emerald-600"></i>
                  <span>Assigned Personnel</span>
                </h3>

                {investigator ? (
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                    <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                      Lead Investigator
                    </div>
                    <div className="flex items-center gap-3">
                      <img src={investigator.avatar} className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{investigator.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{investigator.employeeId}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-600">{investigator.department}</div>
                    <div className="text-[10px] text-sky-600 font-medium">{investigator.specialization}</div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-dashed border-amber-300 bg-amber-50 text-center">
                    <p className="text-xs text-amber-800 font-semibold mb-2">Unassigned Case</p>
                    {canAssign && (
                      <button
                        onClick={() => onOpenAssignModal(c.id)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold"
                      >
                        Assign Investigator Now
                      </button>
                    )}
                  </div>
                )}

                {supervisor && (
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                      Reviewing Supervisor
                    </div>
                    <div className="text-xs font-bold text-slate-900">{supervisor.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{supervisor.employeeId}</div>
                    <div className="text-[11px] text-slate-600">{supervisor.department}</div>
                  </div>
                )}
              </div>

              {/* Typologies */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i data-lucide="layers" className="w-4 h-4 text-rose-600"></i>
                  <span>Detected Laundering Typologies</span>
                </h3>
                <div className="space-y-2">
                  {c.typologies && c.typologies.map((typ, i) => (
                    <div key={i} className="p-2.5 rounded bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>{typ.title}</span>
                        <span className="text-[10px] text-rose-600 font-mono">{typ.confidence}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{typ.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPLETE CHRONOLOGICAL VISUAL TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="history" className="w-4 h-4 text-sky-600"></i>
                <span>Complete Audited Case Timeline</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Every action recorded immutably</span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timeline && timeline.map((item, idx) => (
                <div key={item.id || idx} className="relative flex items-start gap-4">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-sky-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-900">
                        {item.action.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{item.description}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                      <span className="text-slate-500">
                        Officer: <span className="font-semibold text-slate-800">{item.userName}</span> ({item.userRole})
                      </span>
                      {item.previousValue && item.newValue && (
                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                          {item.previousValue} → {item.newValue}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CYTOSCAPE ATTRIBUTION GRAPH */}
        {activeTab === 'graph' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i data-lucide="git-merge" className="w-4 h-4 text-sky-600"></i>
                  <span>Multi-Hop Transaction Flow & VASP Attribution Graph</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Interactive topological cluster mapping from suspect wallet through intermediaries to custodial deposit
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-mono text-[10px] text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Suspect
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Mixer
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> VASP
                </span>
              </div>
            </div>

            <div
              ref={graphContainerRef}
              className="w-full h-96 bg-slate-50 rounded-lg border border-slate-200 relative overflow-hidden"
            ></div>
          </div>
        )}

        {/* TAB 4: EVIDENCE VAULT */}
        {activeTab === 'evidence' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <i data-lucide="folder-lock" className="w-4 h-4 text-emerald-600"></i>
                  <span>Cryptographic Evidence Repository</span>
                </h3>
                <p className="text-[11px] text-slate-500">Attached Section 91 notices, on-chain trace graphs, and foreign intelligence bulletins</p>
              </div>
              <button
                onClick={handleAddSampleEvidence}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1"
              >
                <i data-lucide="upload" className="w-3.5 h-3.5"></i>
                <span>Upload Evidence Document</span>
              </button>
            </div>

            <div className="space-y-3">
              {evidence && evidence.map((ev) => (
                <div key={ev.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <i data-lucide="file-check" className="w-4 h-4 text-emerald-600"></i>
                      <span className="font-semibold text-slate-900">{ev.fileName}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border">
                        {ev.fileSize}
                      </span>
                    </div>
                    <p className="text-slate-600">{ev.description}</p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Tx Ref: {ev.txHashOrDetails} • Uploaded by {ev.uploaderName} at {ev.uploadedAt}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                    CHAIN VERIFIED
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: INVESTIGATION NOTES */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="message-square" className="w-4 h-4 text-sky-600"></i>
              <span>Chronological Investigation Log & Supervisory Directives</span>
            </h3>

            {/* Note Entry Form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter investigation progress, coordination steps with VASP compliance, or supervisory guidance..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <div className="flex items-center justify-between">
                {(user.role === 'ADMIN' || user.role === 'SUPERVISOR') ? (
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded text-sky-600"
                    />
                    <span>Mark as Supervisory Internal Note</span>
                  </label>
                ) : <div></div>}
                <button
                  type="submit"
                  disabled={actionLoading || !newNote.trim()}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  Record Note in Case Docket
                </button>
              </div>
            </form>

            {/* Existing Notes */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              {notes && notes.map((n) => (
                <div key={n.id} className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${n.isInternal ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{n.authorName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({n.authorRole})</span>
                      {n.isInternal && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                          INTERNAL DIRECTIVE
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{n.createdAt}</span>
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ASSIGNMENT HISTORY */}
        {activeTab === 'assignments' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="user-check" className="w-4 h-4 text-indigo-600"></i>
              <span>Immutable Case Assignment & Transfer Log</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                    <th className="pb-2">Assignment Ref</th>
                    <th className="pb-2">Assigned Officer</th>
                    <th className="pb-2">Previous Officer</th>
                    <th className="pb-2">Authorized By</th>
                    <th className="pb-2">Date / Time</th>
                    <th className="pb-2">Directive Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assignments && assignments.map((asg) => (
                    <tr key={asg.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 font-mono font-bold text-slate-900">{asg.id}</td>
                      <td className="py-2.5 font-semibold text-slate-900">{asg.investigatorName}</td>
                      <td className="py-2.5 text-slate-500">{asg.previousInvestigatorName || 'None (Initial)'}</td>
                      <td className="py-2.5 text-slate-700">
                        {asg.assignedByName} <span className="text-slate-400 font-mono">({asg.assignedByRole})</span>
                      </td>
                      <td className="py-2.5 font-mono text-slate-400 text-[11px]">{asg.assignedAt}</td>
                      <td className="py-2.5 text-slate-600 max-w-xs truncate" title={asg.notes}>
                        {asg.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Investigator Requests Reassignment */}
        {showReassignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <i data-lucide="user-x" className="w-4 h-4 text-amber-600"></i>
                  <span>Formal Reassignment Request</span>
                </h3>
                <button onClick={() => setShowReassignModal(false)} className="text-slate-400 hover:text-slate-600">
                  <i data-lucide="x" className="w-4 h-4"></i>
                </button>
              </div>

              <form onSubmit={handleRequestReassignment} className="space-y-3">
                <p className="text-xs text-slate-600">
                  Submit a formal request to your supervisor for case transfer (e.g., jurisdictional reallocation, technical specialization mismatch, or workload constraints).
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Reassignment</label>
                  <textarea
                    required
                    rows={3}
                    value={reassignReason}
                    onChange={(e) => setReassignReason(e.target.value)}
                    placeholder="Specify justification..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReassignModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded"
                  >
                    Dispatch Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Visual Timeline progress bar
  function WorkflowProgressBar({ status }) {
    const steps = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED'];
    const currentIdx = steps.indexOf(status);

    return (
      <div className="grid grid-cols-6 gap-2">
        {steps.map((st, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={st} className="space-y-1 text-center">
              <div
                className={`h-2 rounded-full transition ${
                  isDone
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? 'bg-sky-500 ring-2 ring-sky-300'
                    : 'bg-slate-200'
                }`}
              ></div>
              <span className={`text-[9px] font-bold uppercase tracking-wider block truncate ${
                isCurrent ? 'text-sky-700' : isDone ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                {st.replace('_', ' ')}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  function getPriorityBadge(pri) {
    switch (pri) {
      case 'CRITICAL': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'LOW': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  }

  return {
    CaseListView,
    CaseDetailsWorkspace
  };
})();
