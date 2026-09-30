const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { db } = require('./db');

// In-memory active session store with sliding window activity tracking
// Map: token -> { userId, createdAt, lastActivity, expiresAt, rememberMe }
const sessions = new Map();

// Inactivity timeout: 15 minutes (in milliseconds)
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
// Normal session TTL: 8 hours
const STANDARD_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
// Remember me session TTL: 30 days
const REMEMBER_ME_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function createSession(user, rememberMe = false) {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const ttl = rememberMe ? REMEMBER_ME_TTL_MS : STANDARD_SESSION_TTL_MS;

  const sessionData = {
    token,
    userId: user.id,
    createdAt: now,
    lastActivity: now,
    expiresAt: now + ttl,
    rememberMe: !!rememberMe
  };

  sessions.set(token, sessionData);
  return token;
}

function getSession(token) {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;

  const now = Date.now();

  // Check absolute expiration
  if (now > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  // Check inactivity timeout (only for non-remember-me sessions or if inactive > 15m)
  // For strict enterprise compliance, if inactive for 15 minutes, invalidate
  if (!session.rememberMe && (now - session.lastActivity > INACTIVITY_TIMEOUT_MS)) {
    sessions.delete(token);
    return null;
  }

  // Update last activity sliding window
  session.lastActivity = now;
  return session;
}

function destroySession(token) {
  if (token) {
    sessions.delete(token);
  }
}

// Authentication Middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Authentication required. Please log in."
    });
  }

  const session = getSession(token);
  if (!session) {
    return res.status(401).json({
      error: "SESSION_EXPIRED",
      message: "Session has expired due to inactivity or invalid credentials. Please log in again."
    });
  }

  const user = db.findUserById(session.userId);
  if (!user || !user.active) {
    destroySession(token);
    return res.status(401).json({
      error: "ACCOUNT_INACTIVE",
      message: "Account has been deactivated. Please contact an administrator."
    });
  }

  req.user = user;
  req.sessionToken = token;
  next();
}

// Role Authorization Middleware
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: `Access denied. Role ${req.user.role} is not authorized to access this resource. Required: ${allowedRoles.join(' or ')}.`
      });
    }

    next();
  };
}

module.exports = {
  createSession,
  getSession,
  destroySession,
  requireAuth,
  requireRole,
  INACTIVITY_TIMEOUT_MS
};
