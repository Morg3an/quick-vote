import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const [searchId, setSearchId] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchId.trim()) {
            navigate(`/poll/${searchId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-blue-800 text-white">
            <h1 className="text-4xl font-bold mb-4">🗳️ QuickVote</h1>
            <p className="text-white mb-6">Make decisions faster with live polls.</p>

            <form onSubmit={handleSearch} className="w-full max-w-sm mb-6">
                <input
                    type="text"
                    placeholder="Enter poll ID to vote..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="w-full px-4 py-2 border rounded mb-2"
                />
                <button type="submit" className="w-full bg-gray-600 text-white py-2 rounded hover:bg-blue-700">
                    Search Poll
                </button>
            </form>

            <div className="flex gap-4">
                <button
                    onClick={() => navigate('/login')}
                    className="bg-yellow-600 border border-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Log In
                </button>
                <button
                    onClick={() => navigate('/signup')}
                    className="bg-amber-900 border border-green-600 text-white px-4 py-2 rounded hover:bg-green-100 hover:text-green-900"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default LandingPage;