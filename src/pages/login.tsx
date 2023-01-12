import type { NextPage } from 'next';
import TextInput from '../components/TextInput';
import User from '../assets/User';
import Lock from '../assets/Lock';
import Button from '../components/Button';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios, { AxiosError } from 'axios';
import { loginRoute } from '../utils/APIRoutes';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { allToastOptions } from '../utils/types';

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

			try {
				const resp = await axios.post(
					loginRoute,
					new URLSearchParams({
						email,
						password
					})
				);

				router.push('/');
			} catch (err) {
				const errors = err as Error | AxiosError;

				if (axios.isAxiosError(errors)) {
					if (errors.response?.status === 401) {
						toast.error(
							'Incorrect Username or Password',
							toastOptions
						);
					} else {
						toast.error('Something went wrong', toastOptions);
					}
				} else {
					toast.error('Something went wrong', toastOptions);
				}
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
