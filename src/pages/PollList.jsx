// src/pages/PollList.jsx
import React, { useEffect, useState } from 'react';
import { Link, /*useNavigate*/ } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const PollList = ({ showOnlyMine = false }) => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    // const navigate = useNavigate();

    /* const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };
    */

    useEffect(() => {
        const fetchPolls = async () => {
            setLoading(true);
            let userId = null;

            if (showOnlyMine) {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError || !user) {
                    console.error('User fetch error:', userError);
                    setPolls([]);
                    setLoading(false);
                    return;
                }
                userId = user.id;
            }

            const query = supabase
                .from('polls')
                .select('id, question, created_at, admin_token, is_closed')
                .order('created_at', { ascending: false });

            if (showOnlyMine) query.eq('created_by', userId);

            const { data, error } = await query;

            if (error) console.error('Poll fetch error:', error);
            else setPolls(data || []);

            setLoading(false);
        };

        fetchPolls();
    }, [showOnlyMine]);

    if (loading) return <p className="text-center p-6">Loading polls...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-4">
                {showOnlyMine ? "📋 My Polls" : "🗳️ All Polls"}
            </h2>

            {polls.length === 0 ? (
                <p>{showOnlyMine ? "You haven't created any polls yet." : "No polls available."}</p>
            ) : (
                <ul className="space-y-2">
                    {polls.map((poll) => (
                        <li key={poll.id} className="bg-gray-100 p-4 rounded shadow hover:bg-gray-200">
                            <Link to={`/poll/${poll.id}`} className="text-lg font-medium text-blue-600 hover:underline">
                                {poll.question}
                            </Link>

                            {showOnlyMine && poll.admin_token && (
                                <div className="text-xs text-green-600 break-all">
                                    Admin Link:{' '}
                                    <Link
                                        to={`/poll/${poll.id}?adminToken=${poll.admin_token}`}
                                        className="underline"
                                    >
                                        /poll/{poll.id}?adminToken=...
                                    </Link>
                                </div>
                            )}

                            {(showOnlyMine || poll.is_closed) && (
                                <div className="mt-2">
                                    <Link
                                        to={`/poll/${poll.id}/results`}
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        📊 View Results
                                    </Link>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PollList;