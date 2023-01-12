import bcrypt from 'bcryptjs';
import { AvatarGenerator } from 'random-avatar-generator';
const generator = new AvatarGenerator();
import { prisma } from '../server';
import { Request, Response, NextFunction } from 'express';

const signup = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password, username } = req.body;
		const defaultImage = generator.generateRandomAvatar();

		const emailCheck = await prisma.user.findUnique({
			where: {
				email: email
			}
		});

		if (emailCheck) {
			return res.sendStatus(409).json({
				msg: 'Email already exists',
				status: false
			});
		}

		const hashedPassword = await bcrypt.hash(password, 5);
		const user = await prisma.user.create({
			data: {
				email: email,
				password: hashedPassword,
				name: username,
				profileImage: defaultImage
			}
		});
		res.json({ status: true });
	} catch (err) {
		next(err);
	}
};

const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		const user = await prisma.user.findUnique({
			where: {
				email: email
			},
			include: {
				groups: true
			}
		});

		if (!user) {
			return res.json({
				msg: 'Incorrect Username or Password',
				status: false
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.json({
				msg: 'Incorrect Username or Password',
				status: false
			});
		}
		user.password = '';
		return res.json({ status: true, user });
	} catch (err) {
		next(err);
	}
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
	req.logout(err => {
		if (err) return next(err);
	});
	res.json({
		message: 'Logged out successfully.'
	});
};

const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
	if (req.user) {
		const user = req.user;
		// @ts-ignore
		user.password = '';
		res.json({ status: true, user: user });
	} else {
		res.json({ status: false });
	}
};

export { login, logout, signup, getUserInfo };
