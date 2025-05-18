

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import venueRoutes from './routes/venueRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use('/api/venues', venueRoutes);
app.use('/api', imageRoutes);
app.use('/api/auth', authRoutes);
// Add this with your other route imports
app.use('/api/subscriptions', subscriptionRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
