// VASPX Separate Role Dashboards: Admin, Supervisor, Investigator
window.Dashboards = (function() {
  const { useState, useEffect } = React;

  // -------------------------------------------------------------
  // 1. ADMIN DASHBOARD
  // -------------------------------------------------------------
  function AdminDashboard({ stats, onOpenCase, onAssignCase, onCreateCase, onSelectTab }) {
    if (!stats) return <LoadingState />;

    return (
      <div className="space-y-6">
        {/* Top Metric Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <i data-lucide="shield-check" className="w-6 h-6 text-sky-600"></i>
              <span>National Operations & Command Center</span>
            </h1>
            <p className="text-xs text-slate-500">
              System-wide real-time metrics, investigator allocation, and jurisdictional oversight
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateCase}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
            >
              <i data-lucide="plus-circle" className="w-4 h-4"></i>
              <span>Initiate New Case</span>
            </button>
            <button
              onClick={() => onSelectTab('audit')}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            >
              <i data-lucide="file-text" className="w-4 h-4 text-slate-400"></i>
              <span>Audit Trail</span>
            </button>
          </div>
        </div>

        {/* 6 Key Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            label="Total Cases"
            value={stats.totalCases}
            color="slate"
            icon="briefcase"
          />
          <StatCard
            label="New Unassigned"
            value={stats.unassignedCases}
            color="amber"
            icon="alert-circle"
            highlight={stats.unassignedCases > 0}
          />
          <StatCard
            label="Active Inquiries"
            value={stats.activeCases}
            color="sky"
            icon="clock"
          />
          <StatCard
            label="Overdue Alerts"
            value={stats.overdueCases}
            color="rose"
            icon="alert-triangle"
            highlight={stats.overdueCases > 0}
          />
          <StatCard
            label="Resolved / Closed"
            value={stats.completedCases}
            color="emerald"
            icon="check-circle"
          />
          <StatCard
            label="Active Officers"
            value={`${stats.availableInvestigators}/${stats.totalInvestigators}`}
            color="indigo"
            icon="users"
          />
        </div>

        {/* Middle Section: Unassigned / Actionable Cases + Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Breakdown & Priority Grid */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="pie-chart" className="w-4 h-4 text-sky-600"></i>
              <span>Case Workflow Distribution</span>
            </h3>
            <div className="space-y-2.5">
              {stats.statusCounts && Object.entries(stats.statusCounts).map(([status, count]) => {
                const pct = stats.totalCases > 0 ? Math.round((count / stats.totalCases) * 100) : 0;
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">{status.replace('_', ' ')}</span>
                      <span className="font-mono text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getStatusColorBar(status)}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">Priority Severity</h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded bg-rose-50 border border-rose-100">
                  <div className="text-[10px] text-rose-600 font-bold">CRITICAL</div>
                  <div className="text-sm font-extrabold text-rose-700 font-mono">{stats.priorityCounts?.CRITICAL || 0}</div>
                </div>
                <div className="p-2 rounded bg-orange-50 border border-orange-100">
                  <div className="text-[10px] text-orange-600 font-bold">HIGH</div>
                  <div className="text-sm font-extrabold text-orange-700 font-mono">{stats.priorityCounts?.HIGH || 0}</div>
                </div>
                <div className="p-2 rounded bg-sky-50 border border-sky-100">
                  <div className="text-[10px] text-sky-600 font-bold">MEDIUM</div>
                  <div className="text-sm font-extrabold text-sky-700 font-mono">{stats.priorityCounts?.MEDIUM || 0}</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-600 font-bold">LOW</div>
                  <div className="text-sm font-extrabold text-slate-700 font-mono">{stats.priorityCounts?.LOW || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Investigator Capacity & Workload Matrix */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="users" className="w-4 h-4 text-indigo-600"></i>
                <span>Investigator Caseload & Availability Matrix</span>
              </h3>
              <button
                onClick={() => onSelectTab('investigators')}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
              >
                View Full Roster →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-2">Officer</th>
                    <th className="pb-2">Specialization</th>
                    <th className="pb-2 text-center">Active Cases</th>
                    <th className="pb-2">Workload Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.investigatorWorkload && stats.investigatorWorkload.map((inv, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5">
                        <div className="font-semibold text-slate-900">{inv.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{inv.employeeId}</div>
                      </td>
                      <td className="py-2.5 text-slate-600">{inv.specialization}</td>
                      <td className="py-2.5 text-center font-mono font-bold text-slate-900">
                        {inv.activeCasesCount}
                      </td>
                      <td className="py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getAvailabilityBadge(inv.availability)}`}>
                          {inv.availability.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onSelectTab('assignments')}
                          className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold bg-sky-50 px-2.5 py-1 rounded border border-sky-200"
                        >
                          Dispatch Case
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Audit & System Activities */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="activity" className="w-4 h-4 text-emerald-600"></i>
              <span>Live Case Activity Stream</span>
            </h3>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              AUDITED
            </span>
          </div>

          <div className="space-y-3">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.slice(0, 6).map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-600 mt-0.5">
                    <i data-lucide={getActivityIcon(act.action)} className="w-3.5 h-3.5"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900">
                        {act.userName} <span className="text-slate-400 font-normal">({act.userRole})</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 truncate">{act.description}</p>
                    <div className="text-[10px] font-mono text-sky-600 mt-0.5">
                      Case Ref: {act.caseId}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No recent activity recorded.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. SUPERVISOR DASHBOARD
  // -------------------------------------------------------------
  function SupervisorDashboard({ stats, onOpenCase, onAssignCase, onSelectTab }) {
    if (!stats) return <LoadingState />;

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <i data-lucide="briefcase" className="w-6 h-6 text-amber-600"></i>
              <span>Supervisory Command: {stats.teamDepartment}</span>
            </h1>
            <p className="text-xs text-slate-500">
              Team workload balancing, investigation approvals, and quality control
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('reviews')}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
            >
              <i data-lucide="check-square" className="w-4 h-4"></i>
              <span>Review Queue ({stats.pendingReviews})</span>
            </button>
          </div>
        </div>

        {/* 5 Key Supervisor Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard
            label="Team Cases"
            value={stats.totalTeamCases}
            color="slate"
            icon="briefcase"
          />
          <StatCard
            label="Pending Review"
            value={stats.pendingReviews}
            color="amber"
            icon="clock"
            highlight={stats.pendingReviews > 0}
          />
          <StatCard
            label="Active Inquiries"
            value={stats.activeCases}
            color="sky"
            icon="refresh-cw"
          />
          <StatCard
            label="Overdue Deadlines"
            value={stats.overdueTeamCases}
            color="rose"
            icon="alert-triangle"
            highlight={stats.overdueTeamCases > 0}
          />
          <StatCard
            label="Completed Inquiries"
            value={stats.completedCases}
            color="emerald"
            icon="check-circle-2"
          />
        </div>

        {/* Pending Reviews Queue */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="file-check" className="w-4 h-4 text-amber-600"></i>
              <span>Investigations Awaiting Supervisor Sign-Off</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              ACTION REQUIRED
            </span>
          </div>

          {stats.pendingReviewCases && stats.pendingReviewCases.length > 0 ? (
            <div className="space-y-3">
              {stats.pendingReviewCases.map((c) => (
                <div key={c.id} className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{c.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                        {c.priority}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800">{c.title}</div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{c.description}</p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Target VASP: {c.attribution?.vaspCandidate || 'Pending'} • Due: {c.dueDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenCase(c.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1"
                    >
                      <i data-lucide="eye" className="w-3.5 h-3.5"></i>
                      <span>Review Evidence & Approve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
              <i data-lucide="check-circle" className="w-6 h-6 text-emerald-500 mx-auto mb-2"></i>
              No pending reviews. All current investigations are active or resolved.
            </div>
          )}
        </div>

        {/* Team Investigators Caseload */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <i data-lucide="users" className="w-4 h-4 text-indigo-600"></i>
            <span>Team Officers & Case Allocation</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.teamInvestigators && stats.teamInvestigators.map((inv) => (
              <div key={inv.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={inv.avatar} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{inv.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{inv.employeeId}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${getAvailabilityBadge(inv.availability)}`}>
                    {inv.availability.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">{inv.specialization}</div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500">Active Investigations:</span>
                  <span className="font-mono font-bold text-slate-900">{inv.activeCasesCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. INVESTIGATOR DASHBOARD
  // -------------------------------------------------------------
  function InvestigatorDashboard({ stats, onOpenCase, onSelectTab }) {
    if (!stats) return <LoadingState />;

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <i data-lucide="folder-lock" className="w-6 h-6 text-emerald-600"></i>
              <span>Investigator Operational Center</span>
            </h1>
            <p className="text-xs text-slate-500">
              Assigned case queue, blockchain forensics workspaces, and evidence repositories
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('my_cases')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
            >
              <i data-lucide="briefcase" className="w-4 h-4"></i>
              <span>View All My Cases ({stats.totalAssignedCases})</span>
            </button>
          </div>
        </div>

        {/* Key Investigator Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard
            label="My Total Cases"
            value={stats.totalAssignedCases}
            color="slate"
            icon="briefcase"
          />
          <StatCard
            label="New Assignments"
            value={stats.newAssignments}
            color="emerald"
            icon="user-check"
            highlight={stats.newAssignments > 0}
          />
          <StatCard
            label="Active Inquiries"
            value={stats.activeCases}
            color="sky"
            icon="activity"
          />
          <StatCard
            label="Under Review"
            value={stats.underReview}
            color="amber"
            icon="clock"
          />
          <StatCard
            label="Overdue Alerts"
            value={stats.overdueCases}
            color="rose"
            icon="alert-triangle"
            highlight={stats.overdueCases > 0}
          />
        </div>

        {/* Priority Inquiries Requiring Action */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="alert-octagon" className="w-4 h-4 text-emerald-600"></i>
              <span>Cases Requiring Prompt Investigation</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">ASSIGNED TO ME ONLY</span>
          </div>

          {stats.casesRequiringAction && stats.casesRequiringAction.length > 0 ? (
            <div className="space-y-3">
              {stats.casesRequiringAction.map((c) => (
                <div key={c.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{c.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(c.status)}`}>
                        {c.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                        {c.priority}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800">{c.title}</div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{c.description}</p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Suspect: {c.suspectWallet} • Chain: {c.chain} • Balance: {c.balance}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenCase(c.id)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow-sm flex items-center gap-1.5"
                    >
                      <i data-lucide="play" className="w-3.5 h-3.5"></i>
                      <span>Launch Investigation Workspace</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
              <i data-lucide="check-circle-2" className="w-6 h-6 text-emerald-500 mx-auto mb-2"></i>
              No priority cases requiring immediate action. You're up to date!
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <i data-lucide="calendar" className="w-4 h-4 text-sky-600"></i>
            <span>Upcoming Statutory Deadlines</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {stats.upcomingDeadlines && stats.upcomingDeadlines.map((c) => (
              <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900 mr-2">{c.id}</span>
                  <span className="font-medium text-slate-700">{c.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-500 text-[11px]">Due: {c.dueDate}</span>
                  <button
                    onClick={() => onOpenCase(c.id)}
                    className="text-sky-600 hover:text-sky-700 font-semibold"
                  >
                    Open →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- SUB-COMPONENTS & HELPERS ---
  function StatCard({ label, value, color, icon, highlight }) {
    const colorClasses = {
      slate: 'text-slate-900 border-slate-200 bg-white',
      sky: 'text-sky-900 border-sky-200 bg-white',
      amber: 'text-amber-900 border-amber-200 bg-amber-50/50',
      rose: 'text-rose-900 border-rose-200 bg-rose-50/50',
      emerald: 'text-emerald-900 border-emerald-200 bg-white',
      indigo: 'text-indigo-900 border-indigo-200 bg-white'
    };

    return (
      <div className={`p-4 rounded-xl border shadow-sm ${colorClasses[color] || 'bg-white border-slate-200'} ${highlight ? 'ring-2 ring-rose-400' : ''}`}>
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
          <i data-lucide={icon} className="w-4 h-4"></i>
        </div>
        <div className="text-2xl font-extrabold tracking-tight font-mono">{value}</div>
      </div>
    );
  }

  function LoadingState() {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-3">
        <i data-lucide="loader-2" className="w-8 h-8 text-sky-600 animate-spin"></i>
        <p className="text-xs text-slate-500 font-medium">Loading telemetry and operational data...</p>
      </div>
    );
  }

  function getStatusColorBar(status) {
    switch (status) {
      case 'NEW': return 'bg-slate-400';
      case 'ASSIGNED': return 'bg-sky-500';
      case 'IN_PROGRESS': return 'bg-indigo-600';
      case 'UNDER_REVIEW': return 'bg-amber-500';
      case 'RESOLVED': return 'bg-emerald-500';
      case 'CLOSED': return 'bg-slate-700';
      default: return 'bg-slate-400';
    }
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'NEW': return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'ASSIGNED': return 'bg-sky-50 text-sky-700 border-sky-300';
      case 'IN_PROGRESS': return 'bg-indigo-50 text-indigo-700 border-indigo-300';
      case 'UNDER_REVIEW': return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'CLOSED': return 'bg-slate-900 text-white border-slate-900';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  }

  function getAvailabilityBadge(av) {
    switch (av) {
      case 'AVAILABLE': return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'MODERATE': return 'bg-sky-50 text-sky-700 border-sky-300';
      case 'HIGH_WORKLOAD': return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'MAX_CAPACITY': return 'bg-rose-50 text-rose-700 border-rose-300';
      default: return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  }

  function getActivityIcon(action) {
    if (action.includes('ASSIGN')) return 'user-plus';
    if (action.includes('STATUS')) return 'refresh-cw';
    if (action.includes('EVIDENCE')) return 'folder-plus';
    if (action.includes('NOTE')) return 'message-square';
    if (action.includes('CREATE')) return 'plus-circle';
    return 'activity';
  }

  return {
    AdminDashboard,
    SupervisorDashboard,
    InvestigatorDashboard,
    getStatusBadge,
    getAvailabilityBadge
  };
})();
