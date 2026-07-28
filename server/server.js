const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Serve frontend in production (optional, if they build the React app and drop it in server/public)
app.use(express.static(path.join(__dirname, '../build')));

// Catch-all route for SPA (React router)
app.use((req, res, next) => {
  // If request is for an API, don't serve index.html
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  const indexPath = path.join(__dirname, '../build/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('Sweet Treats Server is running. Frontend build not found.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploaded images served at http://localhost:${PORT}/uploads/`);
});
