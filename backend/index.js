// backend/server.js
import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Import Routes
import internshipRoutes from './routes/internshipRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Connect to Database
connectDB();

const app = express();

// --- MIDDLEWARES (Should come first) ---
app.use(cors());        // Enable CORS for all origins
app.use(express.json()); // Enable JSON body parsing for all routes

// --- Simple Root Route ---
app.get('/', (req, res) => {
  res.send('Your backend server is running!');
});

// --- API ROUTES (Grouped together AFTER middleware) ---
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/users', userRoutes); // User routes now correctly placed

// --- Start Server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));