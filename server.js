const express = require('express');
const path = require('path');
const apiRoutes = require('./server/routes');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security & Caching Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Mount secure API routes BEFORE static file serving
app.use('/api', apiRoutes);

// Explicit route for JavaScript app bundle
app.get('/src/appBundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'appBundle.js'), (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'appBundle.js'));
    }
  });
});

app.get('/appBundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'appBundle.js'), (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'appBundle.js'));
    }
  });
});

// Serve static assets from root directory
app.use(express.static(__dirname));

// Fallback to index.html for client-side routing (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ error: "INTERNAL_SERVER_ERROR", message: "An unexpected system error occurred." });
});

app.listen(PORT, HOST, () => {
  console.log(`VASPX Secure Enterprise Platform running on http://${HOST}:${PORT}`);
});
