// VASPX Enterprise API Client
window.VaspxAPI = (function() {
  const TOKEN_KEY = 'vaspx_auth_token';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }

  function setToken(token, remember = false) {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }

  async function request(endpoint, options = {}) {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/api/auth/login')) {
        clearToken();
        window.dispatchEvent(new CustomEvent('vaspx:unauthorized', { detail: data }));
      }
      const error = new Error(data.message || 'Request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  return {
    getToken,
    setToken,
    clearToken,
    login: (email, password, rememberMe) =>
      request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, rememberMe })
      }),
    logout: () =>
      request('/api/auth/logout', { method: 'POST' }).finally(clearToken),
    getMe: () => request('/api/auth/me'),
    forgotPassword: (email) =>
      request('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
    resetPassword: (token, newPassword) =>
      request('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword })
      }),
    changePassword: (currentPassword, newPassword) =>
      request('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      }),
    updateProfile: (profile) =>
      request('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profile)
      }),
    getCases: () => request('/api/cases'),
    getCaseDetails: (id) => request(`/api/cases/${id}`),
    createCase: (caseData) =>
      request('/api/cases', {
        method: 'POST',
        body: JSON.stringify(caseData)
      }),
    assignCase: (id, investigatorId, notes) =>
      request(`/api/cases/${id}/assign`, {
        method: 'POST',
        body: JSON.stringify({ investigatorId, notes })
      }),
    updateCaseStatus: (id, status, notes) =>
      request(`/api/cases/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes })
      }),
    addCaseNote: (id, content, isInternal) =>
      request(`/api/cases/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ content, isInternal })
      }),
    addCaseEvidence: (id, evidence) =>
      request(`/api/cases/${id}/evidence`, {
        method: 'POST',
        body: JSON.stringify(evidence)
      }),
    requestReassignment: (id, reason) =>
      request(`/api/cases/${id}/reassignment-request`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      }),
    getInvestigators: () => request('/api/users/investigators'),
    getUsers: () => request('/api/users'),
    createUser: (userData) =>
      request('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    updateUserStatus: (id, active) =>
      request(`/api/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ active })
      }),
    updateUserRole: (id, roleData) =>
      request(`/api/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify(roleData)
      }),
    adminResetPassword: (id, newPassword) =>
      request(`/api/users/${id}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ newPassword })
      }),
    getLoginHistory: () => request('/api/users/login-history'),
    getAuditLogs: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/api/audit-logs${q ? '?' + q : ''}`);
    },
    getNotifications: () => request('/api/notifications'),
    markNotificationRead: (id) =>
      request(`/api/notifications/${id}/read`, { method: 'PATCH' }),
    markAllNotificationsRead: () =>
      request('/api/notifications/mark-all-read', { method: 'POST' }),
    getDashboardAnalytics: () => request('/api/analytics/dashboard')
  };
})();
