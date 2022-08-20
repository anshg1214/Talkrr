import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

// Routes
import usersRoute from './routes/userRouter';
import groupsRoute from './routes/groupRouter';
import messageRoute from './routes/messageRouter';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// routes
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

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch(err => {
		console.log('Error connecting to MongoDB:', err);
	});

const httpServer = createServer(app);
const io = new Server(httpServer);

let users = [];

io.on('connection', socket => {
	console.log('New client connected');
	socket.on('join group', username => {
		const user = {
			username,
			id: socket.id
		};
		users.push(user);
		io.emit('users', users);
	});
});

httpServer.listen(process.env.PORT || 4000, () => {
	console.log('Server started on port' + process.env.PORT || 4000);
});
