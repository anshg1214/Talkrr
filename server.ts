import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import next from 'next';
import passport from 'passport';
import session from 'express-session';
import authenticationMiddleware from './services/authMiddleware';
import strategy from './services/auth';
import { User } from '@prisma/client';

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

class SocketUser {
	userID: string;
	socketID: string;
	groupID: string | undefined;
	constructor(userID: string, socketID: string) {
		this.userID = userID;
		this.socketID = socketID;
	}

	setGroupID(groupID: string) {
		this.groupID = groupID;
	}
}

nextServer.prepare().then(() => {
	const app = express();
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(
		session({
			name: 'session',
			secret: process.env.SESSION_SECRET!,
			resave: false,
			saveUninitialized: false,
			cookie: { maxAge: 1000 * 60 * 60 * 24 * 1, sameSite: 'lax' }
		})
	);

	// Passport
	passport.use(strategy);
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((user, done) => {
		done(null, (user as User).id);
	});

	passport.deserializeUser(async (id: string, done) => {
		const user = await prisma.user.findUnique({
			where: {
				id: id
			}
		});

		if (!user) return done('No user to deserialize');

		return done(null, user);
	});

	app.post('/api/users/login', passport.authenticate('local'), (req, res) => {
		res.json({
			message: 'Logged in successfully.'
		});
	});

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

	// Socket.io
	const io = new Server(httpServer, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST']
		}
	});

	let users: SocketUser[] = [];

	io.on('connection', (socket: Socket) => {
		// When creating a new user
		socket.on('newUser', (userID: string) => {
			if (!userID) return;
			const user = users.find(user => user.userID === userID);
			if (user) {
				user.socketID = socket.id;
				return;
			}
			const newUser = new SocketUser(userID, socket.id);
			users.push(newUser);
		});

		// When joining a group
		socket.on('joinGroup', (groupID: string, userID: string) => {
			if (!userID) return;
			const user = users.find(user => user.userID === userID);
			if (user) {
				user.setGroupID(groupID);
			}
		});

		// When being added to a group
		socket.on('addedToGroup', (groupID: string) => {
			const groupUsers = users.filter(user => user.groupID === groupID);
			groupUsers.forEach(user => {
				io.to(user.socketID).emit('fetchGroup');
			});
		});

		// When sending a message
		socket.on('sendMessage', (groupID: string) => {
			const groupUsers = users.filter(user => user.groupID === groupID);
			groupUsers.forEach(user => {
				io.to(user.socketID).emit('fetchMessage', groupID);
			});
		});

		// When Creating a new group
		socket.on('newGroup', () => {
			io.emit('fetchGroup');
		});

		// When disconnecting
		socket.on('disconnect', () => {
			users = users.filter(user => user.socketID !== socket.id);
		});
	});

	httpServer.listen(port, (err?: any) => {
		if (err) throw err;
		console.log(
			`> Ready on http://localhost:${port} - env ${process.env.NODE_ENV}`
		);
	});
});
