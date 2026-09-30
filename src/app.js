// VASPX Root Application Component
(function() {
  const { useState, useEffect, useRef } = React;

  function App() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const [assigningCaseId, setAssigningCaseId] = useState(null);
    const [showCreateCaseModal, setShowCreateCaseModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [idleSecondsRemaining, setIdleSecondsRemaining] = useState(15 * 60);

    // Initial session verification from database
    const checkSession = async () => {
      try {
        setAuthLoading(true);
        const res = await window.VaspxAPI.getMe();
        if (res && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    useEffect(() => {
      checkSession();

      const handleUnauthorized = () => {
        setUser(null);
        alert('Your session has terminated due to inactivity or invalid authorization. Please log in again.');
      };
      window.addEventListener('vaspx:unauthorized', handleUnauthorized);
      return () => window.removeEventListener('vaspx:unauthorized', handleUnauthorized);
    }, []);

    // Inactivity Tracking & Auto-Logout Timer (15 minutes)
    useEffect(() => {
      if (!user) return;

      let remaining = 15 * 60;
      setIdleSecondsRemaining(remaining);

      const resetIdle = () => {
        remaining = 15 * 60;
        setIdleSecondsRemaining(remaining);
      };

      const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
      events.forEach(e => window.addEventListener(e, resetIdle, { passive: true }));

      const interval = setInterval(() => {
        remaining -= 1;
        setIdleSecondsRemaining(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          handleLogout();
          alert('You have been automatically logged out due to 15 minutes of inactivity.');
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        events.forEach(e => window.removeEventListener(e, resetIdle));
      };
    }, [user]);

    // Load Dashboard Stats & Notifications
    const refreshData = async () => {
      if (!user) return;
      try {
        const [statsRes, notifsRes] = await Promise.all([
          window.VaspxAPI.getDashboardAnalytics(),
          window.VaspxAPI.getNotifications()
        ]);
        setDashboardStats(statsRes.stats);
        setNotificationsCount(notifsRes.unreadCount || 0);
      } catch (err) {
        console.error('Failed to refresh data:', err);
      }
    };

    useEffect(() => {
      if (user) {
        refreshData();
        const poll = setInterval(refreshData, 30000); // 30s poll
        return () => clearInterval(poll);
      }
    }, [user]);

    // Reinitialize Lucide icons on tab or modal changes
    useEffect(() => {
      if (window.lucide && window.lucide.createIcons) {
        setTimeout(() => {
          window.lucide.createIcons();
        }, 50);
      }
    });

    const handleLoginSuccess = (authenticatedUser) => {
      setUser(authenticatedUser);
      setActiveTab('dashboard');
      setSelectedCaseId(null);
    };

    const handleLogout = async () => {
      try {
        await window.VaspxAPI.logout();
      } catch (e) {
        // Continue
      }
      setUser(null);
      setSelectedCaseId(null);
    };

    if (authLoading) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/20 animate-pulse">
            <i data-lucide="shield" className="w-6 h-6"></i>
          </div>
          <div className="text-white text-xs font-semibold tracking-wider uppercase font-mono">
            VASPX Intelligence Platform Initializing...
          </div>
        </div>
      );
    }

    if (!user) {
      return <window.AuthScreens.LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }

    // Role-Guarded Tab Access Verification
    const isTabAllowed = (tabId) => {
      if (user.role === 'ADMIN') return true;
      if (user.role === 'SUPERVISOR') {
        return ['dashboard', 'cases', 'assignments', 'reviews', 'reports', 'vasp_map', 'attribution_tool'].includes(tabId);
      }
      if (user.role === 'INVESTIGATOR') {
        return ['dashboard', 'my_cases', 'evidence', 'vasp_map', 'attribution_tool', 'profile'].includes(tabId);
      }
      return false;
    };

    const handleSelectTab = (tabId) => {
      if (tabId === 'profile') {
        setShowProfileModal(true);
        return;
      }
      if (!isTabAllowed(tabId)) {
        alert(`Access Denied: Your role (${user.role}) does not have authorization to view this section.`);
        return;
      }
      setSelectedCaseId(null);
      setActiveTab(tabId);
    };

    return (
      <div className="h-screen flex flex-col bg-slate-100 font-sans text-slate-900 overflow-hidden">
        {/* Header */}
        <window.Navigation.Header
          user={user}
          onLogout={handleLogout}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          unreadCount={notificationsCount}
          idleSecondsRemaining={idleSecondsRemaining}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <window.Navigation.Sidebar
            user={user}
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
          />

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-y-auto">
            {selectedCaseId ? (
              <window.CaseManagement.CaseDetailsWorkspace
                caseId={selectedCaseId}
                user={user}
                onBack={() => { setSelectedCaseId(null); refreshData(); }}
                onOpenAssignModal={(cid) => setAssigningCaseId(cid)}
              />
            ) : (
              <>
                {/* 1. DASHBOARD */}
                {activeTab === 'dashboard' && (
                  user.role === 'ADMIN' ? (
                    <window.Dashboards.AdminDashboard
                      stats={dashboardStats}
                      onOpenCase={(id) => setSelectedCaseId(id)}
                      onAssignCase={(id) => setAssigningCaseId(id)}
                      onCreateCase={() => setShowCreateCaseModal(true)}
                      onSelectTab={handleSelectTab}
                    />
                  ) : user.role === 'SUPERVISOR' ? (
                    <window.Dashboards.SupervisorDashboard
                      stats={dashboardStats}
                      onOpenCase={(id) => setSelectedCaseId(id)}
                      onAssignCase={(id) => setAssigningCaseId(id)}
                      onSelectTab={handleSelectTab}
                    />
                  ) : (
                    <window.Dashboards.InvestigatorDashboard
                      stats={dashboardStats}
                      onOpenCase={(id) => setSelectedCaseId(id)}
                      onSelectTab={handleSelectTab}
                    />
                  )
                )}

                {/* 2. CASES LIST */}
                {(activeTab === 'cases' || activeTab === 'my_cases' || activeTab === 'reviews') && (
                  <window.CaseManagement.CaseListView
                    user={user}
                    onOpenCase={(id) => setSelectedCaseId(id)}
                    onAssignCase={(id) => setAssigningCaseId(id)}
                    onCreateCase={() => setShowCreateCaseModal(true)}
                  />
                )}

                {/* 3. ASSIGNMENTS */}
                {activeTab === 'assignments' && (
                  <window.CaseManagement.CaseListView
                    user={user}
                    onOpenCase={(id) => setSelectedCaseId(id)}
                    onAssignCase={(id) => setAssigningCaseId(id)}
                    onCreateCase={() => setShowCreateCaseModal(true)}
                  />
                )}

                {/* 4. INVESTIGATORS MATRIX */}
                {activeTab === 'investigators' && (
                  <window.VaspIntelligenceTools.InvestigatorsMatrix
                    onAssignCase={(id) => setAssigningCaseId(id)}
                  />
                )}

                {/* 5. USER MANAGEMENT (ADMIN ONLY) */}
                {activeTab === 'users' && user.role === 'ADMIN' && (
                  <window.AdminToolsAndAudit.UserManagementView />
                )}

                {/* 6. AUDIT TRAIL (ADMIN ONLY) */}
                {activeTab === 'audit' && user.role === 'ADMIN' && (
                  <window.AdminToolsAndAudit.AuditTrailView />
                )}

                {/* 7. GLOBAL VASP MAP */}
                {activeTab === 'vasp_map' && (
                  <window.VaspIntelligenceTools.GlobalVaspMap />
                )}

                {/* 8. ATTRIBUTION LAB */}
                {activeTab === 'attribution_tool' && (
                  <window.VaspIntelligenceTools.AttributionLab />
                )}

                {/* 9. EVIDENCE VAULT (INVESTIGATOR) */}
                {activeTab === 'evidence' && (
                  <window.CaseManagement.CaseListView
                    user={user}
                    onOpenCase={(id) => setSelectedCaseId(id)}
                    onAssignCase={(id) => setAssigningCaseId(id)}
                    onCreateCase={() => setShowCreateCaseModal(true)}
                  />
                )}

                {/* 10. REPORTS */}
                {activeTab === 'reports' && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-slate-900">Jurisdictional Case & Performance Reports</h2>
                    <p className="text-xs text-slate-500">
                      Export statutory reports for Ministry of Home Affairs, CERT-In, FIU-IND, and Inter-Agency Task Forces.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                        <div className="font-bold text-slate-900">Monthly VASP Attribution Summary</div>
                        <p className="text-slate-500">Total transaction clusters, direct deposit matches, and response latency.</p>
                        <button onClick={() => alert('Generating PDF Report...')} className="px-3 py-1.5 bg-sky-600 text-white rounded font-semibold">
                          Export PDF
                        </button>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                        <div className="font-bold text-slate-900">Section 91 CrPC Compliance Tracker</div>
                        <p className="text-slate-500">Notices dispatched, KYC documents received, and asset freeze records.</p>
                        <button onClick={() => alert('Generating CSV Report...')} className="px-3 py-1.5 bg-sky-600 text-white rounded font-semibold">
                          Export CSV
                        </button>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                        <div className="font-bold text-slate-900">Investigator Workload & Clear Rate</div>
                        <p className="text-slate-500">Operational performance metrics, average time to resolution.</p>
                        <button onClick={() => alert('Generating Audit Dossier...')} className="px-3 py-1.5 bg-sky-600 text-white rounded font-semibold">
                          Export Dossier
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Smart Assignment Modal */}
        {assigningCaseId && (
          <window.AssignmentAndCreationModals.SmartAssignmentModal
            caseId={assigningCaseId}
            onClose={() => setAssigningCaseId(null)}
            onAssignedSuccess={() => {
              setAssigningCaseId(null);
              refreshData();
              alert('Investigator assigned and notified.');
            }}
          />
        )}

        {/* Case Creation Modal */}
        {showCreateCaseModal && (
          <window.AssignmentAndCreationModals.CaseCreationModal
            onClose={() => setShowCreateCaseModal(false)}
            onCreatedSuccess={() => {
              setShowCreateCaseModal(false);
              refreshData();
              alert('New case successfully created.');
            }}
          />
        )}

        {/* User Profile Modal */}
        {showProfileModal && (
          <window.AdminToolsAndAudit.UserProfileModal
            user={user}
            onClose={() => setShowProfileModal(false)}
            onProfileUpdated={(updated) => setUser(updated)}
          />
        )}

        {/* Notifications Modal */}
        {showNotificationsModal && (
          <window.AdminToolsAndAudit.NotificationsModal
            onClose={() => {
              setShowNotificationsModal(false);
              refreshData();
            }}
            onOpenCase={(id) => {
              setShowNotificationsModal(false);
              setSelectedCaseId(id);
            }}
          />
        )}
      </div>
    );
  }

  // Mount to DOM using React 18 createRoot
  const rootElement = document.getElementById('root');
  if (ReactDOM.createRoot) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  } else {
    ReactDOM.render(<App />, rootElement);
  }
})();
