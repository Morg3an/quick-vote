// src/pages/Home.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const { data } = await supabase
      .from('polls')
      .select('id')
      .ilike('question', `%${searchTerm}%`)
      .limit(1)
      .single();

    if (data) {
      navigate(`/polls/${data.id}`);
    } else {
      alert('Poll not found.');
    }
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold txt-blue-500">🗳️ QuickVote</h1>
        <ul className="flex space-x-6">
          <li>
            <Link to="/home" className="hover:text-yellow-300">Home</Link>
          </li>
          <li>
            <Link to="/polls" className="hover:text-yellow-300">Browse Polls</Link>
          </li>
          <li>
            <Link to="/create" className="hover:text-yellow-300">Create Poll</Link>
          </li>
          <li>
            <Link to="/my-polls" className="hover:text-yellow-300">My Polls</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="hover:text-yellow-300">Logout</button>
          </li>
        </ul>
      </nav>

      <main className="p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to QuickVote 🎉</h2>
        <p className="text-lg text-gray-700 mb-6">Create and vote on polls in real-time!</p>

        <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search polls by question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </main>
    </div>
  );
};

export default Home;