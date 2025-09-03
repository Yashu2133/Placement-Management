const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const logger = require('./utils/logger');
const errorRoute = require('./utils/errorRoute');
const errorHandler = require('./middleware/errorHandler');

const authRouter = require('./routes/authRoutes');
const studentRouter = require('./routes/studentRoutes');
const companyRouter = require('./routes/companyRoutes');
const jobRouter = require('./routes/jobRoutes');
const applicationRouter = require('./routes/applicationRoutes');
const interviewRouter = require('./routes/interviewRoutes');
const placementRouter = require('./routes/placementRoutes');
const reportRouter = require('./routes/reportRoutes');
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors({
  origin: ['http://localhost:3000','http://localhost:5173','https://ry-placements.netlify.app'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

app.use(logger);

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/companies', companyRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/applications', applicationRouter);
app.use('/api/v1/interviews', interviewRouter);
app.use('/api/v1/placements', placementRouter);
app.use('/api/v1/reports', reportRouter);
app.use("/api/notifications", notificationRoutes);
// 404 + error handler
app.use(errorRoute);
app.use(errorHandler);

module.exports = app;
