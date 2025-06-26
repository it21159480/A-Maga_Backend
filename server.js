const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');

const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Load .env variables

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // <-- Important for parsing JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
