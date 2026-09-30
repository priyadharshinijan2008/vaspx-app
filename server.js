const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Serve static assets from root directory
app.use(express.static(__dirname));

// Ensure explicit route for /src/appBundle.js or /appBundle.js
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

// Fallback to index.html for client-side routing (compatible with Express 5)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`VASPX Platform running on http://${HOST}:${PORT}`);
});
