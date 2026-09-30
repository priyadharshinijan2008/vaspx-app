// VASPX Role-Aware Navigation & Header
window.Navigation = (function() {
  const { useState, useEffect } = React;

  function Header({ user, onLogout, onOpenProfile, onOpenNotifications, unreadCount, idleSecondsRemaining }) {
    const roleBadgeStyles = {
      ADMIN: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      SUPERVISOR: 'bg-amber-100 text-amber-800 border-amber-300',
      INVESTIGATOR: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };

    const roleNameLabels = {
      ADMIN: 'SYSTEM ADMINISTRATOR',
      SUPERVISOR: 'SUPERVISORY OFFICER',
      INVESTIGATOR: 'CASE INVESTIGATOR'
    };

    // Format idle timer mm:ss
    const formatTime = (secs) => {
      if (secs <= 0) return '00:00';
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return (
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-30">
        {/* Brand & Mission Statement */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
              <i data-lucide="shield" className="w-5 h-5"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">VASPX</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white tracking-widest font-mono">
                  INTELLIGENCE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Virtual Asset Attribution & Multi-Agency Investigation Network
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Inactivity Timer, Notifications, Role Badge & User Profile */}
        <div className="flex items-center space-x-4">
          {/* Inactivity countdown warning */}
          <div
            title="Session auto-terminates after 15 minutes of inactivity for security compliance."
            className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border ${
              idleSecondsRemaining < 120
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <i data-lucide="timer" className="w-3.5 h-3.5"></i>
            <span>Session: {formatTime(idleSecondsRemaining)}</span>
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Notifications"
          >
            <i data-lucide="bell" className="w-5 h-5"></i>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div className="h-6 w-px bg-slate-200"></div>

          {/* User & Fixed Role Presentation (NO ROLE SWITCHER) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-3 text-left p-1 rounded-lg hover:bg-slate-50 transition"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</div>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                      roleBadgeStyles[user.role] || 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {roleNameLabels[user.role] || user.role}
                  </span>
                </div>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              title="Secure Logout"
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <i data-lucide="log-out" className="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </header>
    );
  }

  function Sidebar({ user, activeTab, onSelectTab }) {
    // Role-Aware Navigation Menus
    const adminNav = [
      { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', badge: null },
      { id: 'cases', label: 'All Cases', icon: 'briefcase', badge: null },
      { id: 'assignments', label: 'Case Assignments', icon: 'user-check', badge: 'Action' },
      { id: 'investigators', label: 'Investigators Matrix', icon: 'users', badge: null },
      { id: 'users', label: 'User Management', icon: 'shield-check', badge: null },
      { id: 'audit', label: 'Audit Trail', icon: 'file-text', badge: 'Sec' },
      { id: 'vasp_map', label: 'Global VASP Map', icon: 'globe', badge: null },
      { id: 'attribution_tool', label: 'Attribution Lab', icon: 'cpu', badge: null }
    ];

    const supervisorNav = [
      { id: 'dashboard', label: 'Team Dashboard', icon: 'layout-dashboard', badge: null },
      { id: 'cases', label: 'Team Cases', icon: 'briefcase', badge: null },
      { id: 'assignments', label: 'Assign & Reassign', icon: 'user-plus', badge: null },
      { id: 'reviews', label: 'Pending Reviews', icon: 'check-circle-2', badge: 'Review' },
      { id: 'vasp_map', label: 'Global VASP Map', icon: 'globe', badge: null },
      { id: 'attribution_tool', label: 'Attribution Lab', icon: 'cpu', badge: null },
      { id: 'reports', label: 'Team Reports', icon: 'bar-chart-3', badge: null }
    ];

    const investigatorNav = [
      { id: 'dashboard', label: 'Investigator Center', icon: 'layout-dashboard', badge: null },
      { id: 'my_cases', label: 'My Assigned Cases', icon: 'briefcase', badge: 'Active' },
      { id: 'evidence', label: 'Evidence & Documents', icon: 'folder-lock', badge: null },
      { id: 'vasp_map', label: 'Global VASP Map', icon: 'globe', badge: null },
      { id: 'attribution_tool', label: 'Attribution Lab', icon: 'cpu', badge: null },
      { id: 'profile', label: 'Officer Profile', icon: 'user', badge: null }
    ];

    const navItems = user.role === 'ADMIN'
      ? adminNav
      : user.role === 'SUPERVISOR'
      ? supervisorNav
      : investigatorNav;

    return (
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 text-slate-300 z-20">
        {/* Department Info Box */}
        <div className="p-4 border-b border-slate-800">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Department Unit
          </div>
          <div className="text-xs font-semibold text-white truncate" title={user.department}>
            {user.department}
          </div>
          <div className="text-[11px] text-sky-400 font-mono mt-0.5">
            ID: {user.employeeId}
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <i data-lucide={item.icon} className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`}></i>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      isActive ? 'bg-sky-700 text-sky-100' : 'bg-slate-800 text-sky-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Security & Authenticated State Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2 text-emerald-400 text-[11px] font-mono mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>RBAC SECURED (LEVEL 4)</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Protected under IT Act Sec 43A & Official Secrets protocols.
          </p>
        </div>
      </aside>
    );
  }

  return {
    Header,
    Sidebar
  };
})();
