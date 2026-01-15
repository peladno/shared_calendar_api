import express from 'express';
import cors from 'cors';

//import authRoutes from './routes/auth.routes';
// import calendarsRoutes from './routes/calendars.routes';
// import eventsRoutes from './routes/events.routes';
// import usersRoutes from './routes/users.routes';
import { errorMiddleware } from './middleware/error.middleware.js';

const app = express();
app.use(cors());
app.use(express.json());

//app.use('/api/auth', authRoutes);
// app.use('/api/calendars', calendarsRoutes);
// app.use('/api/events', eventsRoutes);
// app.use('/api/users', usersRoutes);

app.use(errorMiddleware);

export default app;
