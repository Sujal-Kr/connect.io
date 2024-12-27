import { Avatar } from '@mui/material';
import React, { useState } from 'react';
import ProfileInput from '../components/styles/ProfileInput';
import { RegisterSchema } from '../schema/Register';
import { fromZodError } from 'zod-validation-error';
import toast from 'react-hot-toast';
import { LoginSchema } from '../schema/Login';
import axios from 'axios';
import { server } from '../constants/config';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/slices/auth';

const Login = () => {
	const dispatch = useDispatch()
	const [isLoggedIn, setIsLoggedIn] = useState(true);
	const [error, setError] = useState('')
	const [file, setFile] = useState(null)


	const setProfile = (profile) => {
		setFile(profile)
	}

	const handleToggle = () => {
		setIsLoggedIn((prev) => !prev);
	};
	const config = {
		withCredentials: true,
		headers: {
			"Content-Type": "application/json"
		}
	}
	const handleLogin = async (e) => {
		try {
			e.preventDefault();
			const formData = new FormData(e.target);

			const obj = {
				username: formData.get('username') || '',
				password: formData.get('password') || '',
			};

			const result = LoginSchema.safeParse({ username: obj.username, password: obj.password })


			if (!result.success) {
				const { message } = fromZodError(result.error).details[0];
				// console.log(message);
				setError(message)
				setTimeout(() => {
					setError('')
				}, 3000);
			} else {
				const { data } = await axios.post(`${server}/api/v1/user/login`, {
					username: obj.username,
					password: obj.password,
				}, config)

				dispatch(userExists(data.user))
				toast.success(data.message)
				setFile(null)
				e.target.reset();
			}
		} catch (err) {
			toast.error(err.response.data.message)
			// console.log(err.message)
		}
	};

	const handleRegister = async (e) => {
		try {
			e.preventDefault();
			const formData = new FormData(e.target);
			formData.append("avatar", file)
			const obj = {
				name: formData.get('name') || '',  // Accessing form field values correctly
				username: formData.get('username') || '',
				bio: formData.get('bio') || '',
				password: formData.get('password') || '',
				avatar: file
			};
			// console.log([...formData.entries()]);
			const result = RegisterSchema.safeParse(obj);
			if (!result.success) {
				const { message } = fromZodError(result.error).details[0];
				console.log(message);
				setError(message)
				setTimeout(() => {
					setError('')
				}, 3000);
			} else {
				const { data } = await axios.post(`${server}/api/v1/user/signup`, formData, {
					...config, headers: {
						"Content-Type": "multipart/form-data"
					}
				})
				// console.log("register",data)
				if (data.success) {
					dispatch(userExists(data.user))
					toast.success(data.message)
					setFile(null)
					e.target.reset();
					
				}

			}
		} catch (err) {
			toast.error(err.response.data.message)
		}
	}

	return (
		<div className='min-h-dvh flex justify-center items-center p-2  bg-pattern	'>
			{isLoggedIn ? (
				<div className='flex flex-col gap-8 shadow-md rounded-md px-5 py-10 w-full max-w-xs bg-white'>
					<div>
						<h3 className='text-xl text-center'>Connect.io</h3>
						<h1 className='text-center text-gray-500'>Welcome user!</h1>
					</div>
					<p className='text-xs text-red-500 text-center'>{error}</p>
					<form onSubmit={handleLogin}  className='flex gap-5 flex-col'>
						<input
							type="text"
							name='username'
							placeholder='Username'
							className='outline-none border p-2 text-xs w-full rounded-md'
						/>
						<input
							type="password"
							name='password'
							placeholder='Password'
							className='outline-none border p-2 text-xs w-full rounded-md'
						/>
						<button
							type="submit"
							className='outline-none border p-2 bg-primary text-white mt-6 w-full rounded-md'>
							Login
						</button>
					</form>
					<div className='text-center text-xs text-gray-500'>
						<p>Are you a new user?
							<span
								onClick={handleToggle}
								className='text-primary font-semibold cursor-pointer ml-1'>
								Register
							</span>
						</p>
					</div>
				</div>
			) : (
				<div className='flex flex-col gap-6 md:gap-8 shadow-md rounded-md px-5 py-10 w-full max-w-xs bg-white'>
					<div>
						<h3 className='text-xl text-center'>Connect.io</h3>
						<h1 className='text-center text-gray-500'>Welcome user!</h1>
					</div>
					<div className='flex justify-center'>
						<div className='relative'>
							<Avatar
								sx={{ width: 80, height: 80 }}
								src={file && URL.createObjectURL(file)} />
							<ProfileInput setProfile={setProfile} />
						</div>
					</div>
					<p className='text-xs text-red-500 text-center'>{error}</p>
					<form onSubmit={handleRegister} className='flex gap-5 flex-col'>
						<input
							type="text"
							name='name'
							placeholder='Name'
							className='outline-none border p-2 text-xs w-full rounded-md'
						/>
						<input
							type="text"
							name='username'
							placeholder='Username'
							className='outline-none border p-2 text-xs w-full rounded-md'
						/>
						<input
							type="text"
							name='bio'
							placeholder='Bio'
							className='outline-none border p-2 text-xs w-full rounded-md'
						/>
						<input
							type="password"
							name='password'
							placeholder='Password'
							className='outline-none border p-2 text-xs w-full rounded-md'
						/>
						<button
							type="submit"
							className='outline-none shadow p-2 bg-primary text-white mt-6 w-full rounded-md'>
							Register
						</button>
					</form>
					<div className='text-center text-xs text-gray-500'>
						<p>Already registered with us?
							<span
								onClick={handleToggle}
								className='text-primary font-semibold cursor-pointer ml-1'>
								Login
							</span>
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Login;
