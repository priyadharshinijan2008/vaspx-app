const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('./db');
const { createSession, destroySession, requireAuth, requireRole } = require('./auth');

const router = express.Router();

// Helper to extract client IP and user agent
function getClientInfo(req) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown Browser';
  return { ip: String(ip).split(',')[0].trim(), userAgent };
}

// -------------------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS
// -------------------------------------------------------------

// POST /api/auth/login
router.post('/auth/login', (req, res) => {
  const { email, password, rememberMe } = req.body || {};
  const { ip, userAgent } = getClientInfo(req);

  if (!email || !password) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "Email and password are required." });
  }

  const user = db.findUserByEmail(email);

  // If user doesn't exist
  if (!user) {
    db.addLoginLog({
      userId: null,
      email,
      ip,
      userAgent,
      status: "FAILED_INVALID_CREDENTIALS"
    });
    // Non-revealing error message
    return res.status(401).json({ error: "INVALID_CREDENTIALS", message: "Invalid email or password." });
  }

  // Check if account is deactivated
  if (!user.active) {
    db.addLoginLog({
      userId: user.id,
      email,
      ip,
      userAgent,
      status: "FAILED_ACCOUNT_DEACTIVATED"
    });
    return res.status(403).json({
      error: "ACCOUNT_DEACTIVATED",
      message: "This account has been deactivated by an administrator. Please contact IT Security."
    });
  }

  // Verify password with bcrypt
  const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordMatch) {
    db.addLoginLog({
      userId: user.id,
      email,
      ip,
      userAgent,
      status: "FAILED_WRONG_PASSWORD"
    });
    return res.status(401).json({ error: "INVALID_CREDENTIALS", message: "Invalid email or password." });
  }

  // Login successful
  const sessionToken = createSession(user, rememberMe);
  const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

  // Update user last login
  db.updateUser(user.id, { lastLogin: nowStr });

  // Log successful login
  db.addLoginLog({
    userId: user.id,
    email: user.email,
    ip,
    userAgent,
    status: "SUCCESS"
  });

  // Record in audit log
  db.addAuditLog({
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    action: "USER_LOGIN",
    entityType: "SESSION",
    entityId: sessionToken.slice(0, 8),
    details: `${user.role} ${user.name} logged in from IP ${ip}.`,
    ip
  });

  const { passwordHash, ...safeUser } = user;
  return res.json({
    token: sessionToken,
    user: safeUser,
    expiresIn: rememberMe ? "30 days" : "15 minutes of inactivity"
  });
});

// POST /api/auth/logout
router.post('/auth/logout', requireAuth, (req, res) => {
  const { ip } = getClientInfo(req);
  destroySession(req.sessionToken);

  db.addAuditLog({
    userId: req.user.id,
    userEmail: req.user.email,
    userRole: req.user.role,
    action: "USER_LOGOUT",
    entityType: "SESSION",
    entityId: req.sessionToken ? req.sessionToken.slice(0, 8) : 'unknown',
    details: `${req.user.name} logged out.`,
    ip
  });

  return res.json({ success: true, message: "Logged out successfully." });
});

// GET /api/auth/me - Refresh current session and obtain verified role from database
router.get('/auth/me', requireAuth, (req, res) => {
  const { passwordHash, ...safeUser } = req.user;
  return res.json({ user: safeUser });
});

// POST /api/auth/forgot-password - Request reset token
router.post('/auth/forgot-password', (req, res) => {
  const { email } = req.body || {};
  const { ip } = getClientInfo(req);

  if (!email) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "Email is required." });
  }

  const user = db.findUserByEmail(email);
  let resetToken = null;

  if (user && user.active) {
    resetToken = db.createResetToken(user.id);
    db.addAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "PASSWORD_RESET_REQUESTED",
      entityType: "USER",
      entityId: user.id,
      details: `Password reset requested for ${email} from IP ${ip}.`,
      ip
    });
  }

  // Consistent security response: do not expose whether user was found
  return res.json({
    success: true,
    message: "If an active account exists for that email, a password reset authorization code has been issued.",
    // For demo/investigation platform convenience, return reset token in response if generated
    demoResetToken: resetToken
  });
});

// POST /api/auth/reset-password - Complete reset
router.post('/auth/reset-password', (req, res) => {
  const { token, newPassword } = req.body || {};
  const { ip } = getClientInfo(req);

  if (!token || !newPassword) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "Token and new password are required." });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: "WEAK_PASSWORD", message: "Password must be at least 8 characters long." });
  }

  const userId = db.consumeResetToken(token);
  if (!userId) {
    return res.status(400).json({ error: "INVALID_TOKEN", message: "Invalid or expired password reset token." });
  }

  const user = db.findUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "NOT_FOUND", message: "User not found." });
  }

  db.setUserPassword(userId, newPassword);

  db.addAuditLog({
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    action: "PASSWORD_RESET_COMPLETED",
    entityType: "USER",
    entityId: user.id,
    details: `Password was successfully reset for user ${user.email} from IP ${ip}.`,
    ip
  });

  return res.json({ success: true, message: "Password has been successfully updated. You may now log in." });
});

// POST /api/auth/change-password
router.post('/auth/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  const { ip } = getClientInfo(req);

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "Current password and new password are required." });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: "WEAK_PASSWORD", message: "New password must be at least 8 characters long." });
  }

  const match = bcrypt.compareSync(currentPassword, req.user.passwordHash);
  if (!match) {
    return res.status(400).json({ error: "INVALID_PASSWORD", message: "Incorrect current password." });
  }

  db.setUserPassword(req.user.id, newPassword);

  db.addAuditLog({
    userId: req.user.id,
    userEmail: req.user.email,
    userRole: req.user.role,
    action: "PASSWORD_CHANGED",
    entityType: "USER",
    entityId: req.user.id,
    details: `${req.user.name} changed their password.`,
    ip
  });

  return res.json({ success: true, message: "Password updated successfully." });
});

// PUT /api/auth/profile - User can update phone, avatar, bio (NOT role or permissions)
router.put('/auth/profile', requireAuth, (req, res) => {
  const { phone, avatar, designation } = req.body || {};
  const { ip } = getClientInfo(req);

  // Strictly filter permitted fields to prevent role elevation
  const updates = {};
  if (phone !== undefined) updates.phone = phone;
  if (avatar !== undefined) updates.avatar = avatar;

  const updatedUser = db.updateUser(req.user.id, updates);

  db.addAuditLog({
    userId: req.user.id,
    userEmail: req.user.email,
    userRole: req.user.role,
    action: "PROFILE_UPDATED",
    entityType: "USER",
    entityId: req.user.id,
    details: `${req.user.name} updated profile contact details.`,
    ip
  });

  return res.json({ success: true, user: updatedUser });
});

// -------------------------------------------------------------
// 2. CASE MANAGEMENT ENDPOINTS (Strict RBAC & Access Control)
// -------------------------------------------------------------

// GET /api/cases - Filtered strictly by user role
router.get('/cases', requireAuth, (req, res) => {
  const cases = db.getCasesForUser(req.user);
  return res.json({ cases });
});

// GET /api/cases/:id - Retrieve full case details with RBAC authorization
router.get('/cases/:id', requireAuth, (req, res) => {
  const caseId = req.params.id;
  const caseItem = db.getCaseById(caseId, req.user);

  if (!caseItem) {
    // Check if case exists at all to differentiate 404 from 403
    const existsAnywhere = db.data.cases.some(c => c.id === caseId);
    if (existsAnywhere) {
      // 403 Forbidden: Investigator trying to view another investigator's case
      return res.status(403).json({
        error: "ACCESS_DENIED",
        message: "You are not authorized to view this case. It is assigned to another investigator or department."
      });
    }
    return res.status(404).json({ error: "NOT_FOUND", message: `Case ${caseId} does not exist.` });
  }

  // Populate assignments, activities, notes, and evidence
  const assignments = db.getCaseAssignments(caseId);
  const activities = db.getCaseActivities(caseId);
  const notes = db.getCaseNotes(caseId, req.user.role);
  const evidence = db.getCaseEvidence(caseId);

  // Investigator and supervisor details
  const investigator = caseItem.assignedInvestigatorId
    ? db.findUserById(caseItem.assignedInvestigatorId)
    : null;
  const supervisor = caseItem.assignedSupervisorId
    ? db.findUserById(caseItem.assignedSupervisorId)
    : null;

  return res.json({
    case: caseItem,
    investigator: investigator ? {
      id: investigator.id,
      name: investigator.name,
      employeeId: investigator.employeeId,
      department: investigator.department,
      specialization: investigator.specialization,
      avatar: investigator.avatar
    } : null,
    supervisor: supervisor ? {
      id: supervisor.id,
      name: supervisor.name,
      employeeId: supervisor.employeeId,
      department: supervisor.department
    } : null,
    assignments,
    timeline: activities,
    notes,
    evidence
  });
});

// POST /api/cases - Create new case (Admin or Supervisor only)
router.post('/cases', requireAuth, requireRole('ADMIN', 'SUPERVISOR'), (req, res) => {
  const { title, description, category, priority, suspectWallet, chain, riskScore, assignedInvestigatorId, dueDate, balance } = req.body || {};
  const { ip } = getClientInfo(req);

  if (!title || !description) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "Case title and description are required." });
  }

  const newCase = db.createCase({
    title,
    description,
    category,
    priority,
    suspectWallet,
    chain,
    riskScore,
    assignedInvestigatorId,
    dueDate,
    balance
  }, req.user);

  db.addAuditLog({
    userId: req.user.id,
    userEmail: req.user.email,
    userRole: req.user.role,
    action: "CASE_CREATED",
    entityType: "CASE",
    entityId: newCase.id,
    details: `${req.user.role} ${req.user.name} created Case ${newCase.id} (${title}).`,
    ip
  });

  return res.status(201).json({ success: true, case: newCase });
});

// POST /api/cases/:id/assign - Assign or reassign case to investigator (Admin or Supervisor only)
router.post('/cases/:id/assign', requireAuth, requireRole('ADMIN', 'SUPERVISOR'), (req, res) => {
  const caseId = req.params.id;
  const { investigatorId, notes } = req.body || {};

  if (!investigatorId) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "Target investigatorId is required." });
  }

  try {
    const result = db.assignCase(caseId, investigatorId, req.user, notes);
    return res.json({
      success: true,
      message: `Case ${caseId} assigned successfully.`,
      case: result.caseItem,
      assignment: result.assignment
    });
  } catch (err) {
    return res.status(400).json({ error: "ASSIGNMENT_FAILED", message: err.message });
  }
});

// PATCH /api/cases/:id/status - Status workflow transitions with strict permission checks
router.patch('/cases/:id/status', requireAuth, (req, res) => {
  const caseId = req.params.id;
  const { status, notes } = req.body || {};

  if (!status) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "Target status is required." });
  }

  const caseItem = db.getCaseById(caseId, req.user);
  if (!caseItem) {
    return res.status(403).json({ error: "ACCESS_DENIED", message: "You do not have permission to modify this case." });
  }

  // Investigators can only update their own case status to IN_PROGRESS (accept) or UNDER_REVIEW (submit)
  if (req.user.role === 'INVESTIGATOR') {
    if (!['IN_PROGRESS', 'UNDER_REVIEW'].includes(status)) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "Investigators can only start investigations (IN_PROGRESS) or submit them for review (UNDER_REVIEW)."
      });
    }
  }

  try {
    const updated = db.updateCaseStatus(caseId, status, req.user, notes);
    return res.json({ success: true, case: updated });
  } catch (err) {
    return res.status(400).json({ error: "TRANSITION_FAILED", message: err.message });
  }
});

// POST /api/cases/:id/notes - Add note to case
router.post('/cases/:id/notes', requireAuth, (req, res) => {
  const caseId = req.params.id;
  const { content, isInternal } = req.body || {};

  if (!content || !content.trim()) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "Note content cannot be empty." });
  }

  const caseItem = db.getCaseById(caseId, req.user);
  if (!caseItem) {
    return res.status(403).json({ error: "ACCESS_DENIED", message: "You do not have access to this case." });
  }

  // Only Admin or Supervisor can mark notes as internal
  const canMarkInternal = req.user.role === 'ADMIN' || req.user.role === 'SUPERVISOR';
  const newNote = db.addCaseNote({
    caseId,
    content: content.trim(),
    isInternal: canMarkInternal && !!isInternal
  }, req.user);

  return res.status(201).json({ success: true, note: newNote });
});

// POST /api/cases/:id/evidence - Add evidence / attachment to case
router.post('/cases/:id/evidence', requireAuth, (req, res) => {
  const caseId = req.params.id;
  const { fileName, fileType, fileSize, txHashOrDetails, description } = req.body || {};

  const caseItem = db.getCaseById(caseId, req.user);
  if (!caseItem) {
    return res.status(403).json({ error: "ACCESS_DENIED", message: "You do not have access to this case." });
  }

  const newEvidence = db.addCaseEvidence({
    caseId,
    fileName,
    fileType,
    fileSize,
    txHashOrDetails,
    description
  }, req.user);

  return res.status(201).json({ success: true, evidence: newEvidence });
});

// POST /api/cases/:id/reassignment-request - Investigator requests reassignment
router.post('/cases/:id/reassignment-request', requireAuth, requireRole('INVESTIGATOR'), (req, res) => {
  const caseId = req.params.id;
  const { reason } = req.body || {};

  const caseItem = db.getCaseById(caseId, req.user);
  if (!caseItem) {
    return res.status(403).json({ error: "ACCESS_DENIED", message: "You are not assigned to this case." });
  }

  // Notify Supervisor and Admin
  if (caseItem.assignedSupervisorId) {
    db.addNotification({
      recipientId: caseItem.assignedSupervisorId,
      title: "Reassignment Request Submitted",
      message: `${req.user.name} requested reassignment for Case ${caseId}. Reason: ${reason || 'Workload constraints'}`,
      type: "REASSIGNMENT_REQUEST",
      caseId
    });
  }

  // Add timeline note
  db.addCaseActivity({
    caseId,
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: "REASSIGNMENT_REQUESTED",
    description: `Investigator requested case reassignment. Reason: ${reason || 'Capacity limitations'}`,
    previousValue: req.user.name,
    newValue: "Pending Supervisor Review"
  });

  db.addAuditLog({
    userId: req.user.id,
    userEmail: req.user.email,
    userRole: req.user.role,
    action: "CASE_REASSIGNMENT_REQUESTED",
    entityType: "CASE",
    entityId: caseId,
    details: `${req.user.name} requested reassignment for Case ${caseId}.`
  });

  return res.json({ success: true, message: "Reassignment request has been submitted to your supervisor." });
});

// -------------------------------------------------------------
// 3. INVESTIGATORS & USER MANAGEMENT ENDPOINTS
// -------------------------------------------------------------

// GET /api/users/investigators - Get eligible investigators with workload metrics (Admin & Supervisor)
router.get('/users/investigators', requireAuth, requireRole('ADMIN', 'SUPERVISOR'), (req, res) => {
  const investigators = db.getEligibleInvestigators();
  return res.json({ investigators });
});

// GET /api/users - Full user management list (Admin only)
router.get('/users', requireAuth, requireRole('ADMIN'), (req, res) => {
  const users = db.getAllUsers();
  return res.json({ users });
});

// POST /api/users - Create new user account (Admin only)
router.post('/users', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { name, email, password, role, department, departmentId, designation, specialization, phone } = req.body || {};
  const { ip } = getClientInfo(req);

  if (!name || !email || !role) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "Name, email, and role are required." });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "CONFLICT", message: "A user with this email address already exists." });
  }

  const newUser = db.createUser({
    name,
    email,
    password: password || "VaspxSecure2026!",
    role,
    department,
    departmentId,
    designation,
    specialization,
    phone
  });

  db.addAuditLog({
    userId: req.user.id,
    userEmail: req.user.email,
    userRole: req.user.role,
    action: "USER_CREATED",
    entityType: "USER",
    entityId: newUser.id,
    details: `Created new user ${newUser.name} (${newUser.email}) with role ${newUser.role}.`,
    ip
  });

  return res.status(201).json({ success: true, user: newUser });
});

// PATCH /api/users/:id/status - Deactivate or reactivate user account (Admin only)
router.patch('/users/:id/status', requireAuth, requireRole('ADMIN'), (req, res) => {
  const targetId = req.params.id;
  const { active } = req.body || {};
  const { ip } = getClientInfo(req);

  if (active === undefined) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "Active status is required." });
  }

  if (targetId === req.user.id && !active) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "Administrators cannot deactivate their own account." });
  }

  const updatedUser = db.updateUser(targetId, { active: !!active });
  if (!updatedUser) {
    return res.status(404).json({ error: "NOT_FOUND", message: "User not found." });
  }

  db.addAuditLog({
    userId: req.user.id,
    userEmail: req.user.email,
    userRole: req.user.role,
    action: active ? "USER_REACTIVATED" : "USER_DEACTIVATED",
    entityType: "USER",
    entityId: targetId,
    details: `User ${updatedUser.email} account status changed to ${active ? 'ACTIVE' : 'DEACTIVATED'}.`,
    ip
  });

  return res.json({ success: true, user: updatedUser });
});

// PATCH /api/users/:id/role - Change user role (Admin only)
router.patch('/users/:id/role', requireAuth, requireRole('ADMIN'), (req, res) => {
  const targetId = req.params.id;
  const { role, departmentId, department, specialization } = req.body || {};
  const { ip } = getClientInfo(req);

  const validRoles = ['ADMIN', 'SUPERVISOR', 'INVESTIGATOR'];
  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ error: "BAD_REQUEST", message: `Role must be one of: ${validRoles.join(', ')}.` });
  }

  const targetUser = db.findUserById(targetId);
  if (!targetUser) {
    return res.status(404).json({ error: "NOT_FOUND", message: "User not found." });
  }

  const oldRole = targetUser.role;
  const updates = { role };
  if (departmentId) updates.departmentId = departmentId;
  if (department) updates.department = department;
  if (specialization) updates.specialization = specialization;

  const updatedUser = db.updateUser(targetId, updates);

  db.addAuditLog({
    userId: req.user.id,
    userEmail: req.user.email,
    userRole: req.user.role,
    action: "USER_ROLE_CHANGED",
    entityType: "USER",
    entityId: targetId,
    details: `Changed role of user ${targetUser.email} from ${oldRole} to ${role}.`,
    ip
  });

  return res.json({ success: true, user: updatedUser });
});

// POST /api/users/:id/reset-password - Admin resets another user's password
router.post('/users/:id/reset-password', requireAuth, requireRole('ADMIN'), (req, res) => {
  const targetId = req.params.id;
  const { newPassword } = req.body || {};
  const { ip } = getClientInfo(req);

  const pwd = newPassword || "VaspxSecure2026!";
  const success = db.setUserPassword(targetId, pwd);
  if (!success) {
    return res.status(404).json({ error: "NOT_FOUND", message: "User not found." });
  }

  const targetUser = db.findUserById(targetId);

  db.addAuditLog({
    userId: req.user.id,
    userEmail: req.user.email,
    userRole: req.user.role,
    action: "ADMIN_RESET_PASSWORD",
    entityType: "USER",
    entityId: targetId,
    details: `Admin ${req.user.name} reset password for user ${targetUser.email}.`,
    ip
  });

  return res.json({ success: true, message: `Password for ${targetUser.email} has been reset.` });
});

// GET /api/users/login-history - Admin only login audit history
router.get('/users/login-history', requireAuth, requireRole('ADMIN'), (req, res) => {
  const logs = db.getLoginLogs(100);
  return res.json({ logs });
});

// -------------------------------------------------------------
// 4. AUDIT LOGS ENDPOINT (Admin only, Immutable)
// -------------------------------------------------------------
router.get('/audit-logs', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { search, action, role } = req.query;
  const logs = db.getAuditLogs({ search, action, role });
  return res.json({ logs });
});

// -------------------------------------------------------------
// 5. NOTIFICATIONS ENDPOINTS
// -------------------------------------------------------------
router.get('/notifications', requireAuth, (req, res) => {
  const notifications = db.getUserNotifications(req.user.id);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  return res.json({ notifications, unreadCount });
});

router.patch('/notifications/:id/read', requireAuth, (req, res) => {
  const notif = db.markNotificationRead(req.params.id, req.user.id);
  return res.json({ success: true, notification: notif });
});

router.post('/notifications/mark-all-read', requireAuth, (req, res) => {
  db.markAllNotificationsRead(req.user.id);
  return res.json({ success: true });
});

// -------------------------------------------------------------
// 6. DASHBOARD ANALYTICS ENDPOINT (Role-Customized)
// -------------------------------------------------------------
router.get('/analytics/dashboard', requireAuth, (req, res) => {
  const stats = db.getDashboardStats(req.user);
  return res.json({ stats });
});

module.exports = router;
