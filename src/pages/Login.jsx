import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setErrorMsg(error.message);
        } else {
            navigate('/home');
        }
    };

    return (
        <div className='min-h-screen flex flex-col justify-center items-center text-center px-4 bg-blue-800 text-white'>
            <form onSubmit={handleLogin} className="max-w-sm mx-auto p-4 space-y-4">
                <h1 className="text-4xl font-bold mb-4">Login</h1>
                {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                <input type="email" placeholder="Email" value={email}
                    onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded" required />
                <input type="password" placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded" required />
                <button className="bg-green-600 border border-white text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Log In</button>
            </form>
        </div>
    );
};

export default Login;