// VASPX Admin User Management, Audit Trail, Notifications, and Profile
window.AdminToolsAndAudit = (function() {
  const { useState, useEffect } = React;

  // -------------------------------------------------------------
  // 1. ADMIN USER MANAGEMENT
  // -------------------------------------------------------------
  function UserManagementView() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(null); // user obj
    const [showPasswordModal, setShowPasswordModal] = useState(null); // user obj
    const [showLoginHistory, setShowLoginHistory] = useState(false);
    const [loginLogs, setLoginLogs] = useState([]);
    const [error, setError] = useState(null);
    const [actionMsg, setActionMsg] = useState(null);

    const loadUsers = async () => {
      try {
        setLoading(true);
        const res = await window.VaspxAPI.getUsers();
        setUsers(res.users || []);
      } catch (err) {
        setError(err.message || 'Failed to retrieve users');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadUsers();
    }, []);

    const handleToggleStatus = async (user) => {
      if (!confirm(`Are you sure you want to ${user.active ? 'deactivate' : 'reactivate'} account for ${user.name}?`)) {
        return;
      }
      try {
        await window.VaspxAPI.updateUserStatus(user.id, !user.active);
        setActionMsg(`Account for ${user.name} is now ${!user.active ? 'ACTIVE' : 'DEACTIVATED'}.`);
        loadUsers();
      } catch (err) {
        alert(err.message || 'Action failed');
      }
    };

    const handleOpenLoginHistory = async () => {
      setShowLoginHistory(true);
      try {
        const res = await window.VaspxAPI.getLoginHistory();
        setLoginLogs(res.logs || []);
      } catch (err) {
        alert('Failed to load login history');
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <i data-lucide="shield-check" className="w-5 h-5 text-indigo-600"></i>
              <span>Enterprise Identity & Access Governance (IAM)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Account provisioning, role assignments, cryptographic credential resets, and activity inspection
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenLoginHistory}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
            >
              <i data-lucide="shield" className="w-4 h-4 text-slate-400"></i>
              <span>Login Security Audit</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition"
            >
              <i data-lucide="user-plus" className="w-4 h-4"></i>
              <span>Provision User Account</span>
            </button>
          </div>
        </div>

        {actionMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center justify-between">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">✕</button>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">User Particulars</th>
                  <th className="py-3 px-4">Role Authorization</th>
                  <th className="py-3 px-4">Department & Unit</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" />
                        <div>
                          <div className="font-semibold text-slate-900">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                          <div className="text-[9px] text-slate-400 font-mono">ID: {u.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        u.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        u.role === 'SUPERVISOR' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{u.department}</td>
                    <td className="py-3 px-4 text-slate-600">{u.specialization}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        u.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {u.active ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[10px]">
                      {u.lastLogin || 'Never logged in'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setShowRoleModal(u)}
                        className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded"
                        title="Change Role"
                      >
                        Role
                      </button>
                      <button
                        onClick={() => setShowPasswordModal(u)}
                        className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded"
                        title="Reset Password"
                      >
                        Reset PW
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2 py-1 text-[11px] font-semibold rounded border ${
                          u.active
                            ? 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100'
                            : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {u.active ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add User */}
        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onCreated={() => { setShowAddModal(false); loadUsers(); }}
          />
        )}

        {/* Modal: Change Role */}
        {showRoleModal && (
          <ChangeRoleModal
            user={showRoleModal}
            onClose={() => setShowRoleModal(null)}
            onUpdated={() => { setShowRoleModal(null); loadUsers(); }}
          />
        )}

        {/* Modal: Admin Password Reset */}
        {showPasswordModal && (
          <AdminResetPasswordModal
            user={showPasswordModal}
            onClose={() => setShowPasswordModal(null)}
          />
        )}

        {/* Modal: Login Security History */}
        {showLoginHistory && (
          <LoginHistoryModal
            logs={loginLogs}
            onClose={() => setShowLoginHistory(false)}
          />
        )}
      </div>
    );
  }

  function AddUserModal({ onClose, onCreated }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('VaspxSecure2026!');
    const [role, setRole] = useState('INVESTIGATOR');
    const [department, setDepartment] = useState('National Cyber Crime Threat Unit');
    const [departmentId, setDepartmentId] = useState('DEP-CYBER');
    const [designation, setDesignation] = useState('Special Cyber Forensics Investigator');
    const [specialization, setSpecialization] = useState('Blockchain Forensics');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
        await window.VaspxAPI.createUser({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          department,
          departmentId,
          designation,
          specialization
        });
        onCreated();
      } catch (err) {
        setError(err.message || 'Failed to create user');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="user-plus" className="w-4 h-4 text-indigo-600"></i>
              <span>Provision User Account</span>
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>

          {error && <div className="p-2.5 rounded bg-rose-50 text-rose-700 text-xs">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Inspector Arjun Singh"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arjun.singh@vaspx.demo"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-bold"
                >
                  <option value="INVESTIGATOR">INVESTIGATOR</option>
                  <option value="SUPERVISOR">SUPERVISOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={departmentId}
                  onChange={(e) => {
                    setDepartmentId(e.target.value);
                    if (e.target.value === 'DEP-CYBER') setDepartment('National Cyber Crime Threat Unit');
                    if (e.target.value === 'DEP-FIN') setDepartment('Financial Intelligence & AML Directorate');
                    if (e.target.value === 'DEP-FOR') setDepartment('Digital Forensics & Incident Response');
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
                >
                  <option value="DEP-CYBER">Cyber Crime Unit</option>
                  <option value="DEP-FIN">FIU & AML Directorate</option>
                  <option value="DEP-FOR">Digital Forensics</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Darknet Markets, Peeling Chains, Smart Contracts"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Temporary Password</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-slate-600 bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded"
              >
                Provision Account
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function ChangeRoleModal({ user, onClose, onUpdated }) {
    const [role, setRole] = useState(user.role);
    const [specialization, setSpecialization] = useState(user.specialization || '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
      setLoading(true);
      try {
        await window.VaspxAPI.updateUserRole(user.id, { role, specialization });
        onUpdated();
      } catch (err) {
        alert(err.message || 'Failed to update role');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Change Role Authorization</h3>
            <button onClick={onClose} className="text-slate-400">✕</button>
          </div>

          <p className="text-xs text-slate-600">
            Updating role for <span className="font-bold text-slate-900">{user.name}</span>. This change is cryptographically audited.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-bold"
              >
                <option value="INVESTIGATOR">INVESTIGATOR</option>
                <option value="SUPERVISOR">SUPERVISOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specialization Domain</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button onClick={onClose} className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded">
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded"
            >
              Confirm Role Change
            </button>
          </div>
        </div>
      </div>
    );
  }

  function AdminResetPasswordModal({ user, onClose }) {
    const [newPassword, setNewPassword] = useState('VaspxSecure2026!');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
      setLoading(true);
      try {
        await window.VaspxAPI.adminResetPassword(user.id, newPassword);
        alert(`Password for ${user.email} has been updated.`);
        onClose();
      } catch (err) {
        alert(err.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Administrator Password Reset</h3>
            <button onClick={onClose} className="text-slate-400">✕</button>
          </div>
          <p className="text-xs text-slate-600">
            Reset password for user <span className="font-bold text-slate-900">{user.email}</span>.
          </p>
          <div className="space-y-2 text-xs">
            <label className="block font-semibold text-slate-700">New Password</label>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-mono"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button onClick={onClose} className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded">
              Cancel
            </button>
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded"
            >
              Reset & Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  function LoginHistoryModal({ logs, onClose }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-xl border border-slate-200 max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="shield" className="w-4 h-4 text-sky-600"></i>
              <span>Login Security & Workstation IP Inspection</span>
            </h3>
            <button onClick={onClose} className="text-slate-400">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Account Email</th>
                  <th className="pb-2">IP Address</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Client User Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="py-2 font-mono text-slate-400 text-[10px]">{l.timestamp}</td>
                    <td className="py-2 font-semibold text-slate-900">{l.email}</td>
                    <td className="py-2 font-mono text-slate-600">{l.ip}</td>
                    <td className="py-2">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        l.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-2 text-slate-400 truncate max-w-xs text-[10px]" title={l.userAgent}>
                      {l.userAgent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-200">
            <button onClick={onClose} className="px-4 py-1.5 text-xs text-slate-700 bg-slate-100 rounded font-semibold">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. IMMUTABLE AUDIT TRAIL VIEW
  // -------------------------------------------------------------
  function AuditTrailView() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedAction, setSelectedAction] = useState('ALL');
    const [selectedRole, setSelectedRole] = useState('ALL');

    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await window.VaspxAPI.getAuditLogs({
          search: search || undefined,
          action: selectedAction !== 'ALL' ? selectedAction : undefined,
          role: selectedRole !== 'ALL' ? selectedRole : undefined
        });
        setLogs(res.logs || []);
      } catch (err) {
        console.error('Failed to load audit trail:', err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchLogs();
    }, [search, selectedAction, selectedRole]);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <i data-lucide="file-text" className="w-5 h-5 text-slate-700"></i>
              <span>Statutory Immutable Audit Trail</span>
            </h2>
            <p className="text-xs text-slate-500">
              Non-repudiation log recording logins, status transitions, evidence uploads, and access permissions
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            WRITE-ONCE READ-MANY (WORM)
          </span>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <i data-lucide="search" className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail by user, action, case ref, or details..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="w-44">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPERVISOR">SUPERVISOR</option>
              <option value="INVESTIGATOR">INVESTIGATOR</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Audit Ref</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Officer / User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Audit Event Details</th>
                  <th className="py-3 px-4">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900 text-[11px]">{log.id}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-400 text-[10px]">{log.timestamp}</td>
                    <td className="py-2.5 px-4">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{log.userEmail}</td>
                    <td className="py-2.5 px-4">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                        log.userRole === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        log.userRole === 'SUPERVISOR' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 max-w-sm truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-400 text-[10px]">{log.ip || '127.0.0.1'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. NOTIFICATIONS MODAL
  // -------------------------------------------------------------
  function NotificationsModal({ onClose, onOpenCase }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
      try {
        setLoading(true);
        const res = await window.VaspxAPI.getNotifications();
        setNotifications(res.notifications || []);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadNotifications();
    }, []);

    const handleMarkAllRead = async () => {
      await window.VaspxAPI.markAllNotificationsRead();
      loadNotifications();
    };

    const handleSelectNotif = async (n) => {
      if (!n.isRead) {
        await window.VaspxAPI.markNotificationRead(n.id);
      }
      onClose();
      if (n.caseId) {
        onOpenCase(n.caseId);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="bell" className="w-4 h-4 text-sky-600"></i>
              <span>Investigation Notifications</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold"
              >
                Mark all read
              </button>
              <button onClick={onClose} className="text-slate-400 p-1">✕</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No notifications.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleSelectNotif(n)}
                  className={`p-3 rounded-lg border transition cursor-pointer text-xs space-y-1 ${
                    !n.isRead ? 'bg-sky-50/60 border-sky-200' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-sky-500"></span>}
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{n.createdAt}</span>
                  </div>
                  <p className="text-slate-600">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. USER PROFILE MODAL
  // -------------------------------------------------------------
  function UserProfileModal({ user, onClose, onProfileUpdated }) {
    const [phone, setPhone] = useState(user.phone || '');
    const [avatar, setAvatar] = useState(user.avatar || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMsg, setPasswordMsg] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSaveContact = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const res = await window.VaspxAPI.updateProfile({ phone, avatar });
        onProfileUpdated(res.user);
        alert('Profile contact information updated.');
      } catch (err) {
        alert(err.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    };

    const handleChangePassword = async (e) => {
      e.preventDefault();
      setPasswordMsg(null);
      setPasswordError(null);
      try {
        setLoading(true);
        await window.VaspxAPI.changePassword(currentPassword, newPassword);
        setPasswordMsg('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
      } catch (err) {
        setPasswordError(err.message || 'Failed to change password');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="user" className="w-4 h-4 text-sky-600"></i>
              <span>Official Officer Dossier & Security Credentials</span>
            </h3>
            <button onClick={onClose} className="text-slate-400">✕</button>
          </div>

          {/* Read-Only Official Information */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
            <div className="flex items-center gap-3">
              <img src={user.avatar} className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200" />
              <div>
                <div className="text-sm font-bold text-slate-900">{user.name}</div>
                <div className="text-slate-500 font-mono text-[11px]">{user.email}</div>
                <div className="text-sky-600 font-mono font-semibold text-[10px]">ID: {user.employeeId}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Role</span>
                <span className="font-bold text-indigo-700">{user.role}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
                <span className="font-medium text-slate-800">{user.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Designation</span>
                <span className="font-medium text-slate-800">{user.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Specialization</span>
                <span className="font-medium text-slate-800">{user.specialization}</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 italic pt-1">
              * Note: Role and jurisdictional assignments are strictly managed by system administrators.
            </div>
          </div>

          {/* Change Contact Details */}
          <form onSubmit={handleSaveContact} className="space-y-3 text-xs border-t border-slate-200 pt-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Contact Particulars</h4>
            <div>
              <label className="block text-slate-600 mb-1">Official Mobile / Secure Comms</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-slate-900"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-semibold text-xs"
              >
                Save Contact
              </button>
            </div>
          </form>

          {/* Change Security Password */}
          <form onSubmit={handleChangePassword} className="space-y-3 text-xs border-t border-slate-200 pt-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Update Security Password</h4>
            {passwordMsg && <div className="p-2 rounded bg-emerald-50 text-emerald-700">{passwordMsg}</div>}
            {passwordError && <div className="p-2 rounded bg-rose-50 text-rose-700">{passwordError}</div>}

            <div>
              <label className="block text-slate-600 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">New Password (min 8 characters)</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-slate-900"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-semibold text-xs"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return {
    UserManagementView,
    AuditTrailView,
    NotificationsModal,
    UserProfileModal
  };
})();
