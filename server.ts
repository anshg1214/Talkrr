import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
// import { Server } from 'socket.io';
import next from 'next';

// Prisma
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export { prisma };

// Routes
import usersRoute from './routes/userRouter';
import groupsRoute from './routes/groupRouter';
import messageRoute from './routes/messageRouter';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextServer = next({ dev });
const handle = nextServer.getRequestHandler();

nextServer.prepare().then(() => {
	const app = express();
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use('/api/users', usersRoute);
	app.use('/api/groups', groupsRoute);
	app.use('/api/messages', messageRoute);

	app.use((error: any, req: any, res: any, next: any) => {
		console.log('Error occured:', error);
		res.json({
			message: error.message || 'An unknown error occured.',
			error: true
		});
	});

	app.all('*', (req: Request, res: Response) => {
		return handle(req, res);
	});

	const httpServer = createServer(app);

	httpServer.listen(port, (err?: any) => {
		if (err) throw err;
		console.log(
			`> Ready on http://localhost:${port} - env ${process.env.NODE_ENV}`
		);
	});
});
