import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            setErrorMsg(error.message);
        } else {
            navigate('/login');
        }
    };

    return (
        <form onSubmit={handleSignup} className="max-w-sm mx-auto p-4 space-y-4">
            <h2 className="text-xl font-bold">Sign Up</h2>
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            <input type="email" placeholder="Email" value={email}
                onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded" required />
            <input type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded" required />
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">Sign Up</button>
        </form>
    );
};

export default Signup;