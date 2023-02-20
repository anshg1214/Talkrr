import bcrypt from 'bcryptjs';
import { prisma } from '../server';
import { Strategy as LocalStrategy } from 'passport-local';

const strategy = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	async (email, password, done) => {
		if (!email || !password)
			return done(null, false, {
				message: 'Please enter your email and password.'
			});

		const user = await prisma.user.findUnique({
			where: {
				email: email
			}
		});

		if (!user) {
			return done(null, false, {
				message: 'Incorrect username or password.'
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return done(null, false, {
				message: 'Incorrect username or password.'
			});
		}

		return done(null, user, {
			message: 'Logged in successfully.'
		});
	}
);

export const findUser = async (email: string) => {
	return prisma.user.findUnique({
		where: {
			email: email
		}
	});
};

export const isAuthenticated = (req: any, res: any, next: any) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};

export default strategy;
