import bcrypt from 'bcryptjs';
import { prisma } from '../server';
import { Strategy as LocalStrategy } from 'passport-local';

const strategy = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	async (email, password, done) => {
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

export default strategy;
