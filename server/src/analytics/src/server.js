import express from 'express';
import connectDB from './config/database.js';
import analyticsService from './services/analytics-service.js';
const app = express();

connectDB();

analyticsService.startScheduler();

const PORT = 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
