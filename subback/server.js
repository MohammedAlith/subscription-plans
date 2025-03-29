const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;

// In-memory user database
let users = [];

// Utility: Get images for a subscription plan (case-insensitive)
const getImagesByPlan = (plan) => {
  const normalizedPlan = plan.toLowerCase(); // ✅ Normalize for folder match
  const dirPath = path.join(__dirname, 'public', 'images', normalizedPlan);

  if (!fs.existsSync(dirPath)) {
    console.log(`❌ Folder not found: ${dirPath}`);
    return [];
  }

  const files = fs.readdirSync(dirPath);
  const imageUrls = files.map(file =>
    `http://localhost:${PORT}/images/${normalizedPlan}/${file}`
  );
  console.log(`📂 Found ${files.length} images for plan "${normalizedPlan}"`);
  return imageUrls;
};

const server = http.createServer((req, res) => {
  // ✅ CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  // ✅ User Login Route
  if (req.method === 'POST' && req.url === '/login') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const { name, email, plan } = JSON.parse(body);
        const user = { name, email, plan };

        // Save user to memory (you can add duplicate checks if needed)
        users.push(user);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Login successful', user }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid JSON' }));
      }
    });

  // ✅ Fetch Images by User Email
  } else if (req.method === 'GET' && req.url.startsWith('/gallery')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const email = url.searchParams.get('email');

    const user = users.find(u => u.email === email);
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'User not found' }));
    }

    const images = getImagesByPlan(user.plan);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(images)); // Return directly as array

  // ✅ Serve Static Images
  } else if (req.url.startsWith('/images/')) {
    const filePath = path.join(__dirname, 'public', req.url);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('Image not found');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
      }[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });

  // ❌ Handle Unknown Routes
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
