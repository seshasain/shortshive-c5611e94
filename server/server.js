
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { storyRoutes } = require('./routes/storyRoutes');
const { animationRoutes } = require('./routes/animationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Check if Gemini API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is not set');
  process.exit(1);
}

// Routes
app.use('/api', storyRoutes);
app.use('/api', animationRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
