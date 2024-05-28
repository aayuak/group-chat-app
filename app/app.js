import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

app.use(bodyParser.json());

authRoutes(app);
userRoutes(app);
groupRoutes(app);
messageRoutes(app);

connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { app, server };