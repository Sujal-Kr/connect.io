import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { fromZodError } from 'zod-validation-error';
import { LoginSchema } from '../../schema/Login';
import { Navigate } from 'react-router-dom';


const AdminLogin = () => {
    const isAdmin =true
    const [error, setError] = useState('')
   
   
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const obj = {
            password: formData.get('password') || '',
        };

        const result = LoginSchema.safeParse({ username: obj.username, password: obj.password })

        if (!result.success) {
            const { message } = fromZodError(result.error).details[0];
            console.log(message);
            setError(message)
            setTimeout(() => {
                setError('')
            }, 3000);
        } else {
            toast.success("Welcome to Connect.io!")
            setFile(null)
            e.target.reset();
        }
    };

    if(isAdmin){
        return (<Navigate to='/admin/dashboard'/>)
    }

    return (
        <div className='min-h-dvh flex justify-center items-center p-2  bg-pattern	'>

            <div className='flex flex-col gap-8 shadow-md rounded-md px-5 py-10 w-full max-w-xs bg-white'>
                <div>
                    <h3 className='text-xl text-center'>Connect.io</h3>
                    <h1 className='text-center text-gray-500'>Welcome Admin!</h1>
                </div>
                <p className='text-xs text-red-500 text-center'>{error}</p>
                <form onSubmit={handleSubmit} className='flex gap-5 flex-col'>
                    
                    <input
                        type="password"
                        name='password'
                        placeholder='Password'
                        className='outline-none border p-3 text-xs w-full rounded-md'
                    />
                    <button
                        type="submit"
                        className='outline-none border p-2 bg-primary text-white mt-6 w-full rounded-md'>
                        Login
                    </button>
                </form>
                <div className='text-center text-xs text-gray-500'>
                    <p>Please provide the secret key </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
