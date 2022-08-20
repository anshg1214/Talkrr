import bcrypt from 'bcryptjs';
import { AvatarGenerator } from 'random-avatar-generator';
const generator = new AvatarGenerator();
import User from '../models/user';

const signup = async (req: any, res: any, next: any) => {
	try {
		const { email, password, username } = req.body;
		const defaultImage = generator.generateRandomAvatar();

		const usernameCheck = await User.findOne({ email });
		if (usernameCheck) {
			return res.json({
				msg: 'Username already exists',
				status: false
			});
		}

		const emailCheck = await User.findOne({ email });
		if (emailCheck) {
			return res.json({
				msg: 'Email already exists',
				status: false
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({
			email,
			password: hashedPassword,
			username,
			image: defaultImage
		});
		delete user.password;
		res.json({ user, status: true });
	} catch (err) {
		next(err);
	}
};

const login = async (req: any, res: any, next: any) => {
	try {
		const { username, password } = req.body;
        const user = await User.findOne({ username });

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

		delete user.password;
		return res.json({ status: true, user });
	} catch (err) {
		next(err);
	}
};

export { login, signup };
