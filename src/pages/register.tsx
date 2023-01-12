import type { NextPage } from 'next';
import TextInput from '../components/TextInput';
import Mail from '../assets/Mail';
import Lock from '../assets/Lock';
import Button from '../components/Button';
import User from '../assets/User';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios, { AxiosError } from 'axios';
import { registerRoute } from '../utils/APIRoutes';
import { useRouter } from 'next/router';
import { allToastOptions } from '../utils/types';

const Register: NextPage = () => {
	const router = useRouter();

	const toastOptions: allToastOptions = {
		position: 'bottom-right',
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: 'dark'
	};

	const [values, setValues] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	useEffect(() => {
		if (localStorage.getItem('chat-app-user')) {
			router.push('/');
		}
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		if (handleValidation()) {
			const { password, email, username } = values;
			try {
				const resp = await axios.post(registerRoute, {
					username,
					email,
					password
				});

				setValues({
					username: '',
					email: '',
					password: '',
					confirmPassword: ''
				});

				toast.error(
					'Account created successfully. You can now login.',
					toastOptions
				);
			} catch (err) {
				const errors = err as Error | AxiosError;

				if (axios.isAxiosError(errors)) {
					const resp = errors.response!;
					if (resp.status === 409) {
						toast.error('Email already exists.', toastOptions);
					} else {
						toast.error('Something went wrong', toastOptions);
					}
				} else {
					toast.error('Something went wrong', toastOptions);
				}
			}
		}
	};

	const handleValidation = () => {
		const { password, confirmPassword, username, email } = values;
		if (password !== confirmPassword) {
			toast.error(
				'Password and confirm password should be same.',
				toastOptions
			);
			return false;
		} else if (username.length < 3) {
			toast.error(
				'Name should be greater than 3 characters.',
				toastOptions
			);
			return false;
		} else if (password.length < 8) {
			toast.error(
				'Password should be equal or greater than 8 characters.',
				toastOptions
			);
			return false;
		} else if (email === '') {
			toast.error('Email is required.', toastOptions);
			return false;
		}

		return true;
	};

	return (
		<div className="bg-dark-blue flex justify-center items-center h-screen">
			<div className="w-100 border-1 border-grey-custom rounded-xl p-9">
				<span className="text-lg text-white-custom">Sign Up</span>
				<form className="mt-5" onSubmit={handleSubmit}>
					<TextInput
						Icon={User}
						name="username"
						placeHolderText="Name"
						type="text"
						text={values.username}
						onChange={handleChange}
					/>
					<TextInput
						Icon={Mail}
						name="email"
						placeHolderText="Email"
						type="email"
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
					<TextInput
						Icon={Lock}
						name="confirmPassword"
						placeHolderText="Confirm Password"
						type="password"
						text={values.confirmPassword}
						onChange={handleChange}
					/>
					<Button text="Sign Up" type="submit" />
					<ToastContainer />
				</form>
			</div>
		</div>
	);
};

export default Register;
