import bcrypt from 'bcryptjs';
import { AvatarGenerator } from 'random-avatar-generator';
const generator = new AvatarGenerator();
import { prisma } from '../server';

const signup = async (req: any, res: any, next: any) => {
	try {
		const { email, password, username } = req.body;
		const defaultImage = generator.generateRandomAvatar();

		const emailCheck = await prisma.user.findUnique({
			where: {
				email: email
			}
		});

		if (emailCheck) {
			return res.json({
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
		user.password = '';
		res.json({ user, status: true });
	} catch (err) {
		next(err);
	}
};

const login = async (req: any, res: any, next: any) => {
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

export { login, signup };
