import type { NextPage } from 'next';
import TextInput from '../components/TextInput';
import User from '../assets/User';
import Lock from '../assets/Lock';
import Button from '../components/Button';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface allToastOptions {
	theme: 'colored' | 'light' | 'dark';
	position: 'bottom-right';
	autoClose: number;
	pauseOnHover: boolean;
	draggable: boolean;
}

const Login: NextPage = () => {
	const router = useRouter();
	const toastOptions: allToastOptions = {
		position: 'bottom-right',
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: 'dark'
	};
	const [values, setValues] = useState({
		email: '',
		password: ''
	});

	useEffect(() => {
		if (localStorage.getItem('chat-app-user')) {
			router.push('/');
		}
	});

	const handleValidation = () => {
		const { email, password } = values;
		if (email === '') {
			toast.error('Email and Password is required.', toastOptions);
			return false;
		} else if (password === '') {
			toast.error('Email and Password is required.', toastOptions);
			return false;
		}
		return true;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		if (handleValidation()) {
			const { email, password } = values;
			const { data } = await axios.post(loginRoute, {
				email,
				password
			});

			if (data.status) {
				localStorage.setItem(
					'chat-app-user',
					JSON.stringify(data.user)
				);

				router.push('/');
			}
			if (data.status === 'false') {
				toast.error(data.message, toastOptions);
			}
		}
	};

	return (
		<div className="bg-dark-blue flex justify-center items-center h-screen">
			<div className="w-100 border-1 border-grey-custom rounded-xl p-9">
				<span className="text-lg text-white-custom">Login</span>
				<form className="mt-5" onSubmit={handleSubmit}>
					<TextInput
						Icon={User}
						name="email"
						placeHolderText="Email"
						type="text"
						text={values.email}
						onChange={handleChange}
					/>
					<TextInput
						Icon={Lock}
						name="password"
						placeHolderText="Password"
						type="password"
						text={values.password}
						onChange={handleChange}
					/>
					<Button text="Login" type="submit" />
					<span>
						Don&apos;t post have an account ?{' '}
						<Link href="/register">Create One.</Link>
					</span>
					<ToastContainer />
				</form>
			</div>
		</div>
	);
};

export default Login;
