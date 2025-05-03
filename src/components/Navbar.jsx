import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data?.user);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => listener.subscription.unsubscribe();
    }, [setUser]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
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
                    <button onClick={handleLogout} className="hover:text-yellow-300">Logout</button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;