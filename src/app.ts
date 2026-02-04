import express from 'express';
import cors from 'cors';
import { prisma } from './utils/prisma.utils';
import logger from './infrastructure/logger/logger.utils';

// import calendarsRoutes from './routes/calendars.routes';
// import eventsRoutes from './routes/events.routes';
// import usersRoutes from './routes/users.routes';

import { configDotenv } from 'dotenv';
import authRoutes from './api/routes/auth.routes';
import {
  errorHandler,
  errorMiddleware,
} from './api/middleware/error.middleware';

const app = express();
app.use(cors());
app.use(express.json());

configDotenv();

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.debug('Health check passed');
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    logger.error('Health check failed', { error });
    res.status(500).json({ status: 'error' });
  }
});

app.use('/api/auth', authRoutes);
// app.use('/api/calendars', calendarsRoutes);
// app.use('/api/events', eventsRoutes);
// app.use('/api/users', usersRoutes);

app.use(errorMiddleware);
app.use(errorHandler);

export default app;
