import app from './app';
import logger from './utils/logger.utils';

import { prisma } from './utils/prisma.utils';

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to connect to the database', { error });
    process.exit(1);
  }
};

startServer();
