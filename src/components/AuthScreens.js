// VASPX Auth Screens: Login, Forgot Password, Reset Password
window.AuthScreens = (function() {
  const { useState } = React;

  function LoginScreen({ onLoginSuccess }) {
    const [email, setEmail] = useState('investigator@vaspx.demo');
    const [password, setPassword] = useState('password123');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForgotModal, setShowForgotModal] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        const res = await window.VaspxAPI.login(email.trim(), password, rememberMe);
        window.VaspxAPI.setToken(res.token, rememberMe);
        onLoginSuccess(res.user);
      } catch (err) {
        setError(err.message || 'Login failed. Please verify your credentials.');
      } finally {
        setIsLoading(false);
      }
    };

    const handleQuickLogin = (demoEmail) => {
      setEmail(demoEmail);
      setPassword('password123');
      setError(null);
    };

    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Subtle grid and glowing gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/25 via-slate-900 to-black pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

        <div className="w-full max-w-md z-10">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-xl shadow-sky-500/20 mb-3 border border-sky-400/30">
              <i data-lucide="shield-alert" className="w-7 h-7 text-white"></i>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
              <span>VASPX</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold uppercase">
                Gov / LEA
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Virtual Asset Service Provider Attribution & Blockchain Intelligence Case Management System
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl p-6 backdrop-blur-xl">
            <div className="border-b border-slate-700/70 pb-3 mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Secure Access Portal</h2>
                <p className="text-[11px] text-slate-400">Authorized Personnel & Law Enforcement Only</p>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                TLS 1.3 SECURE
              </span>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
                <i data-lucide="alert-circle" className="w-4 h-4 shrink-0 mt-0.5"></i>
                <div className="flex-1 leading-relaxed">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <i data-lucide="mail" className="w-4 h-4"></i>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@vaspx.demo"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Security Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <i data-lucide="lock" className="w-4 h-4"></i>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
                  />
                  <span className="text-xs text-slate-400">Remember this workstation</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">15m idle auto-logout</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-sky-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <i data-lucide="loader-2" className="w-4 h-4 animate-spin"></i>
                    <span>Verifying Credentials & Permissions...</span>
                  </>
                ) : (
                  <>
                    <i data-lucide="key" className="w-4 h-4"></i>
                    <span>Authenticate & Access Platform</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Role Fillers for Inspection & Evaluation */}
            <div className="mt-5 pt-4 border-t border-slate-700/60">
              <div className="text-[11px] text-slate-400 font-medium mb-2 flex items-center justify-between">
                <span>Evaluation Quick Sign-in:</span>
                <span className="text-[10px] text-slate-500">Fixed DB Roles</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@vaspx.demo')}
                  className="p-2 rounded bg-slate-900 hover:bg-slate-700/70 border border-slate-700 text-left transition"
                >
                  <div className="text-[11px] font-bold text-sky-400">Admin</div>
                  <div className="text-[9px] text-slate-400 truncate">Dir. Rajesh</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('supervisor@vaspx.demo')}
                  className="p-2 rounded bg-slate-900 hover:bg-slate-700/70 border border-slate-700 text-left transition"
                >
                  <div className="text-[11px] font-bold text-amber-400">Supervisor</div>
                  <div className="text-[9px] text-slate-400 truncate">Supt. Ananya</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('investigator@vaspx.demo')}
                  className="p-2 rounded bg-slate-900 hover:bg-slate-700/70 border border-slate-700 text-left transition"
                >
                  <div className="text-[11px] font-bold text-emerald-400">Investigator</div>
                  <div className="text-[9px] text-slate-400 truncate">Insp. Vikram</div>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-500">
              Notice: All user activities, API calls, and audit events are cryptographically logged.
            </p>
          </div>
        </div>

        {showForgotModal && (
          <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
        )}
      </div>
    );
  }

  function ForgotPasswordModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRequestToken = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setMessage(null);
      try {
        const res = await window.VaspxAPI.forgotPassword(email.trim());
        setMessage(res.message);
        if (res.demoResetToken) {
          setToken(res.demoResetToken);
        }
        setStep(2);
      } catch (err) {
        setError(err.message || 'Failed to process request');
      } finally {
        setLoading(false);
      }
    };

    const handleResetPassword = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setMessage(null);
      try {
        const res = await window.VaspxAPI.resetPassword(token.trim(), newPassword);
        setMessage(res.message);
        setTimeout(() => {
          onClose();
        }, 2000);
      } catch (err) {
        setError(err.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 w-full max-w-md shadow-2xl text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <i data-lucide="key-round" className="w-4 h-4 text-sky-400"></i>
              <span>Password Recovery & Reset</span>
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700"
            >
              <i data-lucide="x" className="w-4 h-4"></i>
            </button>
          </div>

          {error && (
            <div className="mb-3 p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-3 p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              {message}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestToken} className="space-y-3">
              <p className="text-xs text-slate-300">
                Enter your verified departmental email address. An authorized reset authorization code will be generated.
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investigator@vaspx.demo"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded bg-slate-700/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded flex items-center gap-1.5"
                >
                  {loading && <i data-lucide="loader-2" className="w-3.5 h-3.5 animate-spin"></i>}
                  <span>Issue Reset Token</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Reset Authorization Code</label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">New Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded flex items-center gap-1.5"
                >
                  {loading && <i data-lucide="loader-2" className="w-3.5 h-3.5 animate-spin"></i>}
                  <span>Confirm New Password</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return {
    LoginScreen,
    ForgotPasswordModal
  };
})();
